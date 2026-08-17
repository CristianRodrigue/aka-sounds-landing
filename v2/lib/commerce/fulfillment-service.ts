import { decideFulfillment } from "./decision";
import { isTerminalState } from "./state";
import type {
  GcsAdapter,
  MailerLiteAdapter,
  ProviderFailure,
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

export async function processFulfillmentEvent(
  transaction: NormalizedTransaction,
  dependencies: FulfillmentDependencies,
): Promise<FulfillmentServiceResult> {
  const claim = await dependencies.receiptStore.claimEvent({
    eventId: transaction.eventId,
    notificationId: transaction.notificationId,
    transactionId: transaction.transactionId,
    customerId: transaction.customerId,
    occurredAt: transaction.occurredAt,
  });

  if (!claim.owner) {
    return {
      httpStatus: 200,
      body: { status: isTerminalState(claim.record.state) ? "DUPLICATE_COMPLETED" : "DUPLICATE_IN_PROGRESS" },
    };
  }

  const decision = decideFulfillment(transaction);
  if (decision.decision === "REJECT") {
    await dependencies.receiptStore.transition(transaction.eventId, "REJECTED");
    return { httpStatus: 200, body: { status: "REJECTED", reason: decision.reason } };
  }

  await dependencies.receiptStore.transition(transaction.eventId, "VALIDATED");
  await dependencies.receiptStore.transition(transaction.eventId, "FULFILLMENT_PENDING");

  const download = await dependencies.gcs.createSignedDownload(decision.policy);
  if (!download.accepted) return recordFailure(dependencies, transaction.eventId, download.failure);

  const email = await dependencies.resend.sendTransactionEmail({
    email: transaction.customerEmail as string,
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
    email: transaction.customerEmail as string,
    transactionId: transaction.transactionId,
  });
  if (marketing.accepted) {
    await dependencies.receiptStore.markMarketingCompleted(transaction.eventId);
    return { httpStatus: 200, body: { status: "FULFILLED", marketing: "COMPLETED" } };
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
