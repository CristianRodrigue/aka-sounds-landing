CREATE TABLE IF NOT EXISTS purchase_access_sessions (
  session_id TEXT PRIMARY KEY,
  browser_secret_hash TEXT NOT NULL,
  fulfillment_offer_id TEXT NOT NULL,
  price_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  bound_event_id TEXT REFERENCES webhook_receipts(event_id),
  bound_transaction_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  CHECK (expires_at > created_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS purchase_access_sessions_bound_event_idx
  ON purchase_access_sessions (bound_event_id)
  WHERE bound_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS purchase_access_sessions_expires_at_idx
  ON purchase_access_sessions (expires_at);

CREATE TABLE IF NOT EXISTS purchase_download_grants (
  grant_hash TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES purchase_access_sessions(session_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS purchase_download_grants_session_id_idx
  ON purchase_download_grants (session_id);

CREATE INDEX IF NOT EXISTS purchase_download_grants_expires_at_idx
  ON purchase_download_grants (expires_at);
