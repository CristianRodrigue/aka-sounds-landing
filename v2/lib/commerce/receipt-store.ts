import { neon } from "@neondatabase/serverless";
import { canTransition, deliveryStates } from "./state";
import { classifyProviderFailure } from "./providers";
import type { ProviderFailure, ReceiptClaim, ReceiptEvent, ReceiptRecord, ReceiptStore } from "./providers";
import type { DeliveryState } from "./state";
type MutableReceiptRecord = {
  -readonly [K in keyof ReceiptRecord]: ReceiptRecord[K];
};

const PROCESSING_LEASE_MS = 5 * 60 * 1000;

function nowIso(): string {
  return new Date().toISOString();
}

function leaseUntilIso(): string {
  return new Date(Date.now() + PROCESSING_LEASE_MS).toISOString();
}

function leaseActive(value: string | null): boolean {
  return value !== null && Date.parse(value) > Date.now();
}

function createRecord(input: ReceiptEvent): MutableReceiptRecord {
  const now = nowIso();
  return {
    eventId: input.eventId,
    notificationId: input.notificationId,
    transactionId: input.transactionId,
    customerId: input.customerId,
    priceId: input.priceId,
    productId: input.productId,
    quantity: input.quantity,
    itemCount: input.itemCount,
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
    customerHydratedAt: null,
    marketingConsentSnapshot: null,
    processingLeaseUntil: null,
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
  record.lastErrorClass = failure ? classifyProviderFailure(failure) : null;
}

function markCustomer(record: MutableReceiptRecord, marketingConsent: boolean | null): void {
  record.customerHydratedAt = nowIso();
  record.marketingConsentSnapshot = marketingConsent;
  record.updatedAt = nowIso();
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

    if (existing.state === "RETRYABLE_FAILURE" && !leaseActive(existing.processingLeaseUntil)) {
      applyTransition(existing, "SIGNATURE_VERIFIED");
      existing.attemptCount += 1;
      existing.processingLeaseUntil = null;
      return { owner: true, duplicate: false, record: cloneRecord(existing) };
    }

    return { owner: false, duplicate: true, record: cloneRecord(existing) };
  }

  async claimProcessing(eventId: string): Promise<ReceiptClaim> {
    const existing = this.records.get(eventId);
    if (!existing) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    if (
      !["SIGNATURE_VERIFIED", "FULFILLMENT_PENDING", "RETRYABLE_FAILURE"].includes(existing.state) ||
      leaseActive(existing.processingLeaseUntil)
    ) {
      return { owner: false, duplicate: true, record: cloneRecord(existing) };
    }

    if (existing.state === "RETRYABLE_FAILURE") {
      applyTransition(existing, "SIGNATURE_VERIFIED");
      existing.attemptCount += 1;
    }
    existing.processingLeaseUntil = leaseUntilIso();
    existing.updatedAt = nowIso();
    return { owner: true, duplicate: false, record: cloneRecord(existing) };
  }

  async releaseProcessing(eventId: string): Promise<void> {
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    record.processingLeaseUntil = null;
    record.updatedAt = nowIso();
  }

  async transition(eventId: string, state: DeliveryState, failure?: ProviderFailure): Promise<void> {
    assertState(state);
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    applyTransition(record, state, failure);
  }

  async recordProviderFailure(eventId: string, failure: ProviderFailure): Promise<void> {
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    record.lastErrorCode = failure.code;
    record.lastErrorClass = classifyProviderFailure(failure);
    record.updatedAt = nowIso();
  }

  async markCustomerHydrated(eventId: string, marketingConsent: boolean | null): Promise<void> {
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    markCustomer(record, marketingConsent);
  }

  async markTransactionalEmailCompleted(eventId: string): Promise<void> {
    const record = this.records.get(eventId);
    if (!record) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    const now = nowIso();
    record.transactionalEmailCompletedAt = now;
    record.fulfillmentCompletedAt = now;
    record.updatedAt = now;
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

function asNullableBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
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
    priceId: asNullableString(row.price_id),
    productId: asNullableString(row.product_id),
    quantity: Number(row.quantity ?? 0),
    itemCount: Number(row.item_count ?? 0),
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
    marketingRequested: row.marketing_requested === true,
    marketingCompletedAt: asNullableString(row.marketing_completed_at),
    customerHydratedAt: asNullableString(row.customer_hydrated_at),
    marketingConsentSnapshot: asNullableBoolean(row.marketing_consent_snapshot),
    processingLeaseUntil: asNullableString(row.processing_lease_until),
  };
}

function databaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL_MISSING");
  return value;
}

/** Neon-backed store. INSERT/UPDATE predicates provide database-level ownership. */
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
        (event_id, notification_id, transaction_id, customer_id, price_id, product_id, quantity, item_count, occurred_at, state, attempt_count, fulfillment_offer_id)
      VALUES
        (${input.eventId}, ${input.notificationId}, ${input.transactionId}, ${input.customerId}, ${input.priceId}, ${input.productId}, ${input.quantity}, ${input.itemCount}, ${input.occurredAt}, 'SIGNATURE_VERIFIED', 1, ${input.fulfillmentOfferId ?? null})
      ON CONFLICT (event_id) DO NOTHING
      RETURNING *
    `;
    if (inserted.length > 0) {
      return { owner: true, duplicate: false, record: asRecord(inserted[0] as SqlRow) };
    }

    const reclaimed = await sql`
      UPDATE webhook_receipts
      SET state = 'SIGNATURE_VERIFIED', attempt_count = attempt_count + 1,
          last_error_code = NULL, last_error_class = NULL, processing_lease_until = NULL, updated_at = NOW()
      WHERE event_id = ${input.eventId} AND state = 'RETRYABLE_FAILURE'
        AND (processing_lease_until IS NULL OR processing_lease_until < NOW())
      RETURNING *
    `;
    if (reclaimed.length > 0) {
      return { owner: true, duplicate: false, record: asRecord(reclaimed[0] as SqlRow) };
    }

    const existing = await this.get(input.eventId);
    if (!existing) throw new Error("RECEIPT_CLAIM_LOST");
    return { owner: false, duplicate: true, record: existing };
  }

  async claimProcessing(eventId: string): Promise<ReceiptClaim> {
    const sql = this.sql();
    const claimed = await sql`
      UPDATE webhook_receipts
      SET state = CASE WHEN state = 'RETRYABLE_FAILURE' THEN 'SIGNATURE_VERIFIED' ELSE state END,
          attempt_count = CASE WHEN state = 'RETRYABLE_FAILURE' THEN attempt_count + 1 ELSE attempt_count END,
          last_error_code = CASE WHEN state = 'RETRYABLE_FAILURE' THEN NULL ELSE last_error_code END,
          last_error_class = CASE WHEN state = 'RETRYABLE_FAILURE' THEN NULL ELSE last_error_class END,
          processing_lease_until = NOW() + INTERVAL '5 minutes',
          updated_at = NOW()
      WHERE event_id = ${eventId}
        AND state IN ('SIGNATURE_VERIFIED', 'FULFILLMENT_PENDING', 'RETRYABLE_FAILURE')
        AND (processing_lease_until IS NULL OR processing_lease_until < NOW())
      RETURNING *
    `;
    if (claimed.length > 0) {
      return { owner: true, duplicate: false, record: asRecord(claimed[0] as SqlRow) };
    }

    const existing = await this.get(eventId);
    if (!existing) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
    return { owner: false, duplicate: true, record: existing };
  }

  async releaseProcessing(eventId: string): Promise<void> {
    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts SET processing_lease_until = NULL, updated_at = NOW()
      WHERE event_id = ${eventId} RETURNING event_id
    `;
    if (rows.length === 0) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
  }

  async transition(eventId: string, state: DeliveryState, failure?: ProviderFailure): Promise<void> {
    assertState(state);
    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts
      SET state = ${state}, last_error_code = ${failure?.code ?? null},
          last_error_class = ${failure ? classifyProviderFailure(failure) : null}, updated_at = NOW()
      WHERE event_id = ${eventId}
      RETURNING event_id
    `;
    if (rows.length === 0) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
  }

  async recordProviderFailure(eventId: string, failure: ProviderFailure): Promise<void> {
    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts
      SET last_error_code = ${failure.code}, last_error_class = ${classifyProviderFailure(failure)}, updated_at = NOW()
      WHERE event_id = ${eventId}
      RETURNING event_id
    `;
    if (rows.length === 0) throw new Error(`RECEIPT_NOT_FOUND:${eventId}`);
  }

  async markCustomerHydrated(eventId: string, marketingConsent: boolean | null): Promise<void> {
    const sql = this.sql();
    const rows = await sql`
      UPDATE webhook_receipts
      SET customer_hydrated_at = NOW(), marketing_consent_snapshot = ${marketingConsent}, updated_at = NOW()
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
