import { neon } from "@neondatabase/serverless";
import { canTransition, deliveryStates } from "./state";
import type {
  ProviderFailure,
  ReceiptClaim,
  ReceiptEvent,
  ReceiptRecord,
  ReceiptStore,
} from "./providers";
import type { DeliveryState } from "./state";

type MutableReceiptRecord = {
  -readonly [K in keyof ReceiptRecord]: ReceiptRecord[K];
};

function nowIso(): string {
  return new Date().toISOString();
}

function createRecord(input: ReceiptEvent): MutableReceiptRecord {
  const now = nowIso();
  return {
    eventId: input.eventId,
    notificationId: input.notificationId,
    transactionId: input.transactionId,
    customerId: input.customerId,
    occurredAt: input.occurredAt,
    state: "SIGNATURE_VERIFIED",
    attemptCount: 1,
    createdAt: now,
    updatedAt: now,
    lastErrorCode: null,
    lastErrorClass: null,
    fulfillmentOfferId: input.fulfillmentOfferId ?? null,
    fulfillmentCompletedAt: null,
    transactionalEmailCompletedAt: null,
    marketingRequested: false,
    marketingCompletedAt: null,
  };
}

function cloneRecord(record: MutableReceiptRecord): ReceiptRecord {
  return { ...record };
}

function assertState(value: string): asserts value is DeliveryState {
  if (!deliveryStates.includes(value as DeliveryState)) throw new Error(`INVALID_DELIVERY_STATE:${value}`);
}

function applyTransition(record: MutableReceiptRecord, state: DeliveryState, failure?: ProviderFailure): void {
  if (!canTransition(record.state, state)) {
    throw new Error(`INVALID_STATE_TRANSITION:${record.state}->${state}`);
  }
  record.state = state;
  record.updatedAt = nowIso();
  record.lastErrorCode = failure?.code ?? null;
  record.lastErrorClass = failure
    ? failure.retryable === true || (failure.status !== undefined && failure.status >= 500)
      ? "retryable"
      : "permanent"
    : null;
}

/** In-memory implementation used by tests and local route harnesses. */
export class InMemoryReceiptStore implements ReceiptStore {
  private readonly records = new Map<string, MutableReceiptRecord>();

  async get(eventId: string): Promise<ReceiptRecord | null> {
    const record = this.records.get(eventId);
    return record ? cloneRecord(record) : null;
  }

  async claimEvent(input: ReceiptEvent): Promise<ReceiptClaim> {
    const existing = this.records.get(input.eventId);
    if (!existing) {
      const record = createRecord(input);
      this.records.set(input.eventId, record);
      return { owner: true, duplicate: false, record: cloneRecord(record) };
    }

    if (existing.state === "RETRYABLE_FAILURE") {
      applyTransition(existing, "SIGNATURE_VERIFIED");
      existing.attemptCount += 1;
      return { owner: true, duplicate: false, record: cloneRecord(existing) };
    }

    return { owner: false, duplicate: true, record: cloneRecord(existing) };
  }

  async transition(eventId: string, state: DeliveryState, failure?: ProviderFailure): Promise<void> {
    assertState(state);
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    applyTransition(record, state, failure);
  }

  async markTransactionalEmailCompleted(eventId: string): Promise<void> {
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    const now = nowIso();
    record.transactionalEmailCompletedAt = now;
    record.fulfillmentCompletedAt = now;
    record.updatedAt = now;
  }

  async recordProviderFailure(eventId: string, failure: ProviderFailure): Promise<void> {
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    record.lastErrorCode = failure.code;
    record.lastErrorClass = errorClass(failure);
    record.updatedAt = nowIso();
  }
  async markMarketingRequested(eventId: string, requested: boolean): Promise<void> {
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    record.marketingRequested = requested;
    record.updatedAt = nowIso();
  }

  async markMarketingCompleted(eventId: string): Promise<void> {
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    record.marketingCompletedAt = nowIso();
    record.updatedAt = nowIso();
  }
}

type SqlRow = Record<string, unknown>;

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : value instanceof Date ? value.toISOString() : null;
}

function asRecord(row: SqlRow): ReceiptRecord {
  const state = String(row.state);
  assertState(state);
  const lastErrorClass = asNullableString(row.last_error_class);
  return {
    eventId: String(row.event_id),
    notificationId: asNullableString(row.notification_id),
    transactionId: String(row.transaction_id),
    customerId: asNullableString(row.customer_id),
    occurredAt: asNullableString(row.occurred_at),
    state,
    attemptCount: Number(row.attempt_count),
    createdAt: asNullableString(row.created_at) ?? nowIso(),
    updatedAt: asNullableString(row.updated_at) ?? nowIso(),
    lastErrorCode: asNullableString(row.last_error_code),
    lastErrorClass: lastErrorClass === "retryable" || lastErrorClass === "permanent" ? lastErrorClass : null,
    fulfillmentOfferId: asNullableString(row.fulfillment_offer_id),
    fulfillmentCompletedAt: asNullableString(row.fulfillment_completed_at),
    transactionalEmailCompletedAt: asNullableString(row.transactional_email_completed_at),
    marketingRequested: Boolean(row.marketing_requested),
    marketingCompletedAt: asNullableString(row.marketing_completed_at),
  };
}

function databaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL_MISSING");
  return value;
}

function errorClass(failure?: ProviderFailure): "retryable" | "permanent" | null {
  if (!failure) return null;
  return failure.retryable === true || (failure.status !== undefined && failure.status >= 500)
    ? "retryable"
    : "permanent";
}

/** Neon-backed store. Claiming uses one INSERT with a database PK conflict guard. */
export class NeonReceiptStore implements ReceiptStore {
  private sql() {
    return neon(databaseUrl());
  }

  async get(eventId: string): Promise<ReceiptRecord | null> {
    const sql = this.sql();
    const rows = await sql`SELECT * FROM webhook_receipts WHERE event_id = ${eventId} LIMIT 1`;
    return rows.length > 0 ? asRecord(rows[0] as SqlRow) : null;
  }

  async claimEvent(input: ReceiptEvent): Promise<ReceiptClaim> {
    const sql = this.sql();
    const inserted = await sql`
      INSERT INTO webhook_receipts
        (event_id, notification_id, transaction_id, customer_id, occurred_at, state, attempt_count, fulfillment_offer_id)
      VALUES
        (${input.eventId}, ${input.notificationId}, ${input.transactionId}, ${input.customerId}, ${input.occurredAt}, 'SIGNATURE_VERIFIED', 1, ${input.fulfillmentOfferId ?? null})
      ON CONFLICT (event_id) DO NOTHING
      RETURNING *
    `;
    if (inserted.length > 0) {
      return { owner: true, duplicate: false, record: asRecord(inserted[0] as SqlRow) };
    }

    const reclaimed = await sql`
      UPDATE webhook_receipts
      SET state = 'SIGNATURE_VERIFIED', attempt_count = attempt_count + 1,
          last_error_code = NULL, last_error_class = NULL, updated_at = NOW()
      WHERE event_id = ${input.eventId} AND state = 'RETRYABLE_FAILURE'
      RETURNING *
    `;
    if (reclaimed.length > 0) {
      return { owner: true, duplicate: false, record: asRecord(reclaimed[0] as SqlRow) };
    }

    const existing = await this.get(input.eventId);
    if (!existing) throw new Error("RECEIPT_CLAIM_LOST");
    return { owner: false, duplicate: true, record: existing };
  }

  async transition(eventId: string, state: DeliveryState, failure?: ProviderFailure): Promise<void> {
    assertState(state);
    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts
      SET state = ${state}, last_error_code = ${failure?.code ?? null},
          last_error_class = ${errorClass(failure)}, updated_at = NOW()
      WHERE event_id = ${eventId}
      RETURNING event_id
    `;
    if (rows.length === 0) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
  }

  async markTransactionalEmailCompleted(eventId: string): Promise<void> {

    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts
      SET transactional_email_completed_at = NOW(), fulfillment_completed_at = NOW(), updated_at = NOW()
      WHERE event_id = ${eventId}
      RETURNING event_id
    `;
    if (rows.length === 0) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
  }

  async recordProviderFailure(eventId: string, failure: ProviderFailure): Promise<void> {
    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts
      SET last_error_code = ${failure.code}, last_error_class = ${errorClass(failure)}, updated_at = NOW()
      WHERE event_id = ${eventId}
      RETURNING event_id
    `;
    if (rows.length === 0) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
  }
  async markMarketingRequested(eventId: string, requested: boolean): Promise<void> {
    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts SET marketing_requested = ${requested}, updated_at = NOW()
      WHERE event_id = ${eventId} RETURNING event_id
    `;
    if (rows.length === 0) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
  }

  async markMarketingCompleted(eventId: string): Promise<void> {
    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts SET marketing_completed_at = NOW(), updated_at = NOW()
      WHERE event_id = ${eventId} RETURNING event_id
    `;
    if (rows.length === 0) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
  }
}
