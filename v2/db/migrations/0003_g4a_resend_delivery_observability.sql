ALTER TABLE webhook_receipts
  ADD COLUMN IF NOT EXISTS resend_email_id TEXT,
  ADD COLUMN IF NOT EXISTS resend_delivery_status TEXT CHECK (
    resend_delivery_status IN ('accepted', 'delivered', 'delivery_delayed', 'bounced', 'failed')
  ),
  ADD COLUMN IF NOT EXISTS resend_last_event_id TEXT,
  ADD COLUMN IF NOT EXISTS resend_last_event_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS webhook_receipts_resend_email_id_idx
  ON webhook_receipts (resend_email_id)
  WHERE resend_email_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS resend_delivery_events (
  svix_id TEXT PRIMARY KEY,
  email_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('email.delivered', 'email.bounced', 'email.failed', 'email.delivery_delayed')
  ),
  event_created_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  receipt_event_id TEXT REFERENCES webhook_receipts(event_id),
  bounce_type TEXT,
  bounce_subtype TEXT,
  provider_message TEXT CHECK (provider_message IS NULL OR length(provider_message) <= 500)
);

CREATE INDEX IF NOT EXISTS resend_delivery_events_email_id_idx
  ON resend_delivery_events (email_id);

CREATE INDEX IF NOT EXISTS resend_delivery_events_receipt_event_created_idx
  ON resend_delivery_events (receipt_event_id, event_created_at DESC)
  WHERE receipt_event_id IS NOT NULL;
