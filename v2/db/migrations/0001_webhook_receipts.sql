CREATE TABLE IF NOT EXISTS webhook_receipts (
  event_id TEXT PRIMARY KEY,
  notification_id TEXT,
  transaction_id TEXT NOT NULL,
  customer_id TEXT,
  occurred_at TIMESTAMPTZ,
  state TEXT NOT NULL CHECK (state IN (
    'RECEIVED', 'SIGNATURE_VERIFIED', 'VALIDATED', 'FULFILLMENT_PENDING',
    'FULFILLED', 'REJECTED', 'RETRYABLE_FAILURE', 'PERMANENT_FAILURE'
  )),
  attempt_count INTEGER NOT NULL DEFAULT 1 CHECK (attempt_count > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error_code TEXT,
  last_error_class TEXT CHECK (last_error_class IN ('retryable', 'permanent')),
  fulfillment_offer_id TEXT,
  fulfillment_completed_at TIMESTAMPTZ,
  transactional_email_completed_at TIMESTAMPTZ,
  marketing_requested BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS webhook_receipts_transaction_id_idx
  ON webhook_receipts (transaction_id);

CREATE INDEX IF NOT EXISTS webhook_receipts_state_updated_at_idx
  ON webhook_receipts (state, updated_at);
