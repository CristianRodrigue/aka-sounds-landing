import { normalizeTransactionCompleted } from "./paddle";
import type { FulfillmentServiceResult } from "./fulfillment-service";
import type { OfficialVerificationResult } from "./paddle-verifier";
import type { ReceiptStore } from "./providers";
import type { NormalizedTransaction } from "./types";
import { isTerminalState } from "./state";

export interface WebhookHandlerDependencies {
  readonly verify: (rawBody: string, signature: string | null, secret: string) => Promise<OfficialVerificationResult>;
  readonly receiptStore?: ReceiptStore;
  readonly processReceipt?: (eventId: string) => Promise<FulfillmentServiceResult>;
  readonly schedule?: (task: () => Promise<void>) => void;
  /** Legacy test harness only; production must use receiptStore + processReceipt. */
  readonly process?: (transaction: NormalizedTransaction) => Promise<FulfillmentServiceResult>;
}

function receiptEventFromTransaction(transaction: NormalizedTransaction) {
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

function scheduleSafely(
  dependencies: WebhookHandlerDependencies,
  eventId: string,
): void {
  if (!dependencies.schedule || !dependencies.processReceipt) return;
  try {
    dependencies.schedule(async () => {
      try {
        await dependencies.processReceipt?.(eventId);
      } catch {
        // The durable receipt remains recoverable by the independent worker.
      }
    });
  } catch {
    // after() is convenience only; durable acceptance already succeeded.
  }
}

export async function handleV2Webhook(request: Request, dependencies: WebhookHandlerDependencies): Promise<Response> {
  const rawBody = await request.text();
  const verification = await dependencies.verify(
    rawBody,
    request.headers.get("paddle-signature"),
    process.env.PADDLE_WEBHOOK_SECRET ?? "",
  );
  if (!verification.valid) {
    const status = verification.reason === "MISSING_SECRET" ? 503 : verification.reason === "MISSING_HEADER" ? 400 : 401;
    return Response.json({ error: verification.reason }, { status });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return Response.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const normalized = normalizeTransactionCompleted(payload);
  if (!normalized.ok) {
    if (normalized.reason === "UNSUPPORTED_EVENT") return Response.json({ status: "IGNORED" }, { status: 200 });
    return Response.json({ error: normalized.reason }, { status: 400 });
  }

  if (!dependencies.receiptStore) {
    if (!dependencies.process) return Response.json({ error: "PROCESSOR_NOT_CONFIGURED" }, { status: 503 });
    const result = await dependencies.process(normalized.transaction);
    return Response.json(result.body, { status: result.httpStatus });
  }

  let claim;
  try {
    claim = await dependencies.receiptStore.claimEvent(receiptEventFromTransaction(normalized.transaction));
  } catch {
    return Response.json({ error: "RECEIPT_NOT_ACCEPTED" }, { status: 503 });
  }

  if (!isTerminalState(claim.record.state)) {
    scheduleSafely(dependencies, normalized.transaction.eventId);
  }

  return Response.json(
    { status: claim.owner ? "RECEIVED" : "DUPLICATE_RECEIPT_ACCEPTED", event_id: normalized.transaction.eventId },
    { status: 200 },
  );
}
