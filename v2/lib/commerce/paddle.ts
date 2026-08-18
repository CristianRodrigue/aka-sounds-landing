import type { NormalizedTransaction, NormalizedTransactionItem } from "./types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" ? (value as UnknownRecord) : null;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    const result = stringValue(value);
    if (result) return result;
  }
  return null;
}

export type NormalizationFailure =
  | "INVALID_PAYLOAD"
  | "UNSUPPORTED_EVENT"
  | "MISSING_EVENT_ID"
  | "MISSING_TRANSACTION_ID"
  | "MISSING_ITEMS";

export type NormalizationResult =
  | { readonly ok: true; readonly transaction: NormalizedTransaction }
  | { readonly ok: false; readonly reason: NormalizationFailure };

export function normalizeTransactionCompleted(payload: unknown): NormalizationResult {
  const root = asRecord(payload);
  const data = asRecord(root?.data);
  if (!root || !data) return { ok: false, reason: "INVALID_PAYLOAD" };

  const eventType = firstString(root.event_type, root.eventType);
  if (eventType !== "transaction.completed") return { ok: false, reason: "UNSUPPORTED_EVENT" };

  const eventId = firstString(root.event_id, root.eventId);
  const transactionId = firstString(data.id);
  const rawItems = Array.isArray(data.items) ? data.items : null;
  if (!eventId) return { ok: false, reason: "MISSING_EVENT_ID" };
  if (!transactionId) return { ok: false, reason: "MISSING_TRANSACTION_ID" };
  if (!rawItems) return { ok: false, reason: "MISSING_ITEMS" };

  const items: NormalizedTransactionItem[] = rawItems.map((rawItem) => {
    const item = asRecord(rawItem) ?? {};
    const price = asRecord(item.price);
    const product = asRecord(item.product);
    const quantity = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
    return {
      priceId: firstString(price?.id, item.price_id),
      productId: firstString(price?.product_id, price?.productId, product?.id, item.product_id),
      quantity,
    };
  });

  return {
    ok: true,
    transaction: {
      eventId,
      notificationId: firstString(root.notification_id, root.notificationId),
      occurredAt: firstString(root.occurred_at, root.occurredAt),
      transactionId,
      status: firstString(data.status) ?? "unknown",
      customerId: firstString(data.customer_id, data.customerId),
      customerEmail: null,
      marketingConsent: null,
      items,
    },
  };
}
