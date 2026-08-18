ALTER TABLE webhook_receipts
  ADD COLUMN IF NOT EXISTS price_id TEXT,
  ADD COLUMN IF NOT EXISTS product_id TEXT,
  ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  ADD COLUMN IF NOT EXISTS item_count INTEGER NOT NULL DEFAULT 0 CHECK (item_count >= 0),
  ADD COLUMN IF NOT EXISTS customer_hydrated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS marketing_consent_snapshot BOOLEAN,
  ADD COLUMN IF NOT EXISTS processing_lease_until TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS webhook_receipts_processing_idx
  ON webhook_receipts (state, processing_lease_until);
