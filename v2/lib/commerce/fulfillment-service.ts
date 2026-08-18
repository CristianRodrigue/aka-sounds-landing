import { decideFulfillment } from "./decision";
import { isTerminalState } from "./state";
import type {
  GcsAdapter,
  MailerLiteAdapter,
  PaddleCustomerAdapter,
  ProviderFailure,
  ReceiptRecord,
  ReceiptStore,
  ResendAdapter,
} from "./providers";
import { classifyProviderFailure } from "./providers";
import type { NormalizedTransaction } from "./types";

export interface FulfillmentDependencies {
  readonly receiptStore: ReceiptStore;
  readonly gcs: GcsAdapter;
  readonly resend: ResendAdapter;
  readonly mailerlite?: MailerLiteAdapter;
}

export interface ReceiptProcessingDependencies extends FulfillmentDependencies {
  readonly customer: PaddleCustomerAdapter;
}

export interface FulfillmentServiceResult {
  readonly httpStatus: number;
  readonly body: Record<string, unknown>;
}

function failureStatus(failure: ProviderFailure): number {
  return classifyProviderFailure(failure) === "retryable" ? 503 : 422;
}

async function recordFailure(
  dependencies: FulfillmentDependencies,
  eventId: string,
  failure: ProviderFailure,
): Promise<FulfillmentServiceResult> {
  const state = classifyProviderFailure(failure) === "retryable" ? "RETRYABLE_FAILURE" : "PERMANENT_FAILURE";
  await dependencies.receiptStore.transition(eventId, state, failure);
  return {
    httpStatus: failureStatus(failure),
    body: { status: "PROVIDER_FAILURE", provider: failure.provider, code: failure.code },
  };
}

function fallbackFailure(provider: ProviderFailure["provider"]): ProviderFailure {
  return { provider, code: "UNKNOWN_PROVIDER_FAILURE", retryable: true };
}

export function receiptEventFromTransaction(transaction: NormalizedTransaction) {
  const item = transaction.items[0];
  return {
    eventId: transaction.eventId,
    notificationId: transaction.notificationId,
    transactionId: transaction.transactionId,
    customerId: transaction.customerId,
    priceId: item?.priceId ?? null,
    productId: item?.productId ?? null,
    quantity: item?.quantity ?? 0,
    itemCount: transaction.items.length,
    occurredAt: transaction.occurredAt,
  };
}

async function executeFulfillmentEvent(
  transaction: NormalizedTransaction,
  dependencies: FulfillmentDependencies,
  resumeFrom: "SIGNATURE_VERIFIED" | "FULFILLMENT_PENDING" = "SIGNATURE_VERIFIED",
): Promise<FulfillmentServiceResult> {
  if (!transaction.customerEmail) {
    return recordFailure(dependencies, transaction.eventId, {
      provider: "paddle-customer",
      code: "CUSTOMER_EMAIL_MISSING",
      retryable: false,
    });
  }

  const decision = decideFulfillment(transaction);
  if (decision.decision === "REJECT") {
    await dependencies.receiptStore.transition(transaction.eventId, "REJECTED");
    return { httpStatus: 200, body: { status: "REJECTED", reason: decision.reason } };
  }

  if (resumeFrom !== "FULFILLMENT_PENDING") {
    await dependencies.receiptStore.transition(transaction.eventId, "VALIDATED");
    await dependencies.receiptStore.transition(transaction.eventId, "FULFILLMENT_PENDING");
  }

  const download = await dependencies.gcs.createSignedDownload(decision.policy);
  if (!download.accepted) return recordFailure(dependencies, transaction.eventId, download.failure);

  const email = await dependencies.resend.sendTransactionEmail({
    email: transaction.customerEmail,
    transaction,
    policy: decision.policy,
    downloadUrl: download.value,
  });
  if (!email.accepted) {
    return recordFailure(dependencies, transaction.eventId, email.failure ?? fallbackFailure("resend"));
  }

  await dependencies.receiptStore.transition(transaction.eventId, "FULFILLED");
  await dependencies.receiptStore.markTransactionalEmailCompleted(transaction.eventId);

  const marketingAllowed = decision.consent.marketingSubscriptionAllowed;
  await dependencies.receiptStore.markMarketingRequested(transaction.eventId, marketingAllowed);
  if (!marketingAllowed || !dependencies.mailerlite) {
    return {
      httpStatus: 200,
      body: { status: "FULFILLED", marketing: marketingAllowed ? "NOT_CONFIGURED" : "NOT_REQUESTED" },
    };
  }

  const marketing = await dependencies.mailerlite.upsertMarketingSubscriber({
    email: transaction.customerEmail,
    transactionId: transaction.transactionId,
  });
  if (marketing.accepted) {
    await dependencies.receiptStore.markMarketingCompleted(transaction.eventId);
    return {
      httpStatus: 200,
      body: { status: "FULFILLED", marketing: marketing.outcome ?? "COMPLETED" },
    };
  }

  const marketingFailure = marketing.failure ?? fallbackFailure("mailerlite");
  await dependencies.receiptStore.recordProviderFailure(transaction.eventId, marketingFailure);
  return {
    httpStatus: 200,
    body: {
      status: "FULFILLED",
      marketing: classifyProviderFailure(marketingFailure) === "retryable" ? "RETRYABLE_FAILURE" : "FAILED",
    },
  };
}

/** Compatibility harness for direct transaction tests; production uses processReceiptEvent. */
export async function processFulfillmentEvent(
  transaction: NormalizedTransaction,
  dependencies: FulfillmentDependencies,
): Promise<FulfillmentServiceResult> {
  const claim = await dependencies.receiptStore.claimEvent(receiptEventFromTransaction(transaction));

  if (!claim.owner) {
    return {
      httpStatus: 200,
      body: { status: isTerminalState(claim.record.state) ? "DUPLICATE_COMPLETED" : "DUPLICATE_IN_PROGRESS" },
    };
  }

  return executeFulfillmentEvent(transaction, dependencies);
}

function transactionFromReceipt(record: ReceiptRecord, customerEmail: string, marketingConsent: boolean | null): NormalizedTransaction {
  const items = record.itemCount === 1
    ? [{ priceId: record.priceId, productId: record.productId, quantity: record.quantity }]
    : Array.from({ length: Math.max(0, record.itemCount) }, (_, index) =>
        index === 0
          ? { priceId: record.priceId, productId: record.productId, quantity: record.quantity }
          : { priceId: null, productId: null, quantity: 1 },
      );

  return {
    eventId: record.eventId,
    notificationId: record.notificationId,
    occurredAt: record.occurredAt,
    transactionId: record.transactionId,
    status: "completed",
    customerId: record.customerId,
    customerEmail,
    marketingConsent,
    items,
  };
}

/** Independent worker/recovery boundary. It never depends on the original HTTP request. */
export async function processReceiptEvent(
  eventId: string,
  dependencies: ReceiptProcessingDependencies,
): Promise<FulfillmentServiceResult> {
  const claim = await dependencies.receiptStore.claimProcessing(eventId);
  if (!claim.owner) {
    return {
      httpStatus: 200,
      body: { status: isTerminalState(claim.record.state) ? "DUPLICATE_COMPLETED" : "DUPLICATE_IN_PROGRESS" },
    };
  }

  try {
    if (!claim.record.customerId) {
      return recordFailure(dependencies, eventId, {
        provider: "paddle-customer",
        code: "CUSTOMER_ID_MISSING",
        retryable: false,
      });
    }

    const customer = await dependencies.customer.getCustomer(claim.record.customerId);
    if (!customer.accepted) return recordFailure(dependencies, eventId, customer.failure);

    await dependencies.receiptStore.markCustomerHydrated(eventId, customer.value.marketingConsent);
    return executeFulfillmentEvent(
      transactionFromReceipt(claim.record, customer.value.email, customer.value.marketingConsent),
      dependencies,
      claim.record.state === "FULFILLMENT_PENDING" ? "FULFILLMENT_PENDING" : "SIGNATURE_VERIFIED",
    );
  } finally {
    await dependencies.receiptStore.releaseProcessing(eventId).catch(() => undefined);
  }
}
