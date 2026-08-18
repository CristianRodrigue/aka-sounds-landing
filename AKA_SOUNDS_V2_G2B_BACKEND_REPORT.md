# AKA SOUNDS V2 — G2B BACKEND REPORT

Date: 2026-08-17
Branch: redesign/aka-sounds-v2
Starting HEAD: 89274c7bfd115dc90d7dfbae705b74f6abe8233b

G0 STATUS: GREEN
G1 STATUS: GREEN
G2A STATUS: GREEN

This report covers G2B only. It does not authorize G2C, a production webhook replacement, a production deployment, UI work, or G3.

## 1. Starting state

VERIFIED

- The local branch is redesign/aka-sounds-v2.
- The starting HEAD matches the approved G2A commit.
- origin/main remains f98a2a2bf41d13c1698d350ec70755932cddb0ad.
- The working tree was clean before G2B work.
- The six current Price/Product relations remain canonical and verified.
- The historical premium Price ID remains NOT FOUND and metadata-only.
- The latest aka-sounds-v2-preview deployment remains Ready / Preview.
- The earlier failed Vercel deployment was preserved as historical context and was not treated as Hostinger production.

## 2. Durable store decision

VERIFIED — RECOMMENDATION

Recommended provider: Neon Postgres through the Vercel Marketplace native integration.

Cost class:

- Neon Free is suitable for isolated Preview implementation and tests: $0, usage-limited, with a limited restore window.
- A production-grade G2C store should use a paid usage-based plan selected by the owner after traffic, retention, and backup requirements are approved.
- No paid resource was created automatically.

Connection mechanism:

- V2 uses the server-only DATABASE_URL environment variable.
- The Neon serverless driver is loaded lazily and uses parameterized tagged-template queries.
- No database client is initialized in browser code.
- The webhook route uses the Node.js runtime.

Migration approach:

1. Human owner approves and provisions a separate Preview Neon resource.
2. Apply v2/db/migrations/0001_webhook_receipts.sql to that Preview database.
3. Connect only the isolated V2 Preview project to the Preview database.
4. Validate route and retry behavior with synthetic events.
5. Define a separate production Neon resource and migration review in G2C.
6. Never reuse the Preview DATABASE_URL for production.

Backup implications:

- Free-tier restore history is limited and is appropriate only for Preview.
- Production must have an owner-approved paid retention policy plus scheduled logical exports or an equivalent recovery plan.
- Receipt rows contain state and identifiers, not raw webhook bodies or signed URLs.
- GCS objects are not database records and require an independent storage recovery policy.

Vercel Preview support:

- Vercel Marketplace supports Neon as a native integration.
- Neon supports isolated branching and Preview workflows.
- No integration was installed, no resource was provisioned, and no Vercel environment variables were changed during G2B.

Production isolation:

- The Preview database does not exist yet.
- The existing Vercel backend remains the production backend.
- No Paddle production notification destination points to the V2 route.
- akasounds.com and Hostinger remain outside this work.

DURABLE STORE PROVISIONING: HUMAN APPROVAL REQUIRED

Official evidence:

- Vercel Storage: https://vercel.com/docs/storage
- Vercel Postgres status: https://vercel.com/docs/postgres
- Neon for Vercel: https://vercel.com/marketplace/neon
- Neon pricing and restore windows: https://neon.com/pricing
- Neon serverless driver: https://neon.com/docs/serverless/serverless-driver
- Neon branching: https://neon.com/docs/guides/branching-intro

Alternative considered: Supabase is also Vercel-native, starts at $0, and supports Preview branching, but its broader Auth/Storage/Realtime surface is unnecessary for this low-traffic receipt store. Supabase Free backup recovery requires owner-managed exports, while paid plans provide stronger managed backup options. Sources: https://vercel.com/marketplace/supabase and https://supabase.com/docs/guides/platform/backups

## 3. Database schema

IMPLEMENTED

Migration: v2/db/migrations/0001_webhook_receipts.sql

The webhook_receipts table includes:

- event_id as the primary key and unique event identity
- notification_id
- transaction_id
- customer_id
- occurred_at
- state with an explicit CHECK constraint
- attempt_count
- created_at and updated_at
- last_error_code and last_error_class
- fulfillment_offer_id
- fulfillment_completed_at
- transactional_email_completed_at
- marketing_requested
- marketing_completed_at

The schema does not store raw Paddle webhook bodies indefinitely and does not store GCS signed URLs as permanent entitlement state.

## 4. Atomic idempotency implementation

IMPLEMENTED and TESTED

ReceiptStore is defined in v2/lib/commerce/providers.ts.

NeonReceiptStore uses one database INSERT with ON CONFLICT DO NOTHING and RETURNING to claim the event atomically. Concurrent callers cannot both become the owner. A retryable receipt can be reclaimed atomically only when its state is RETRYABLE_FAILURE.

InMemoryReceiptStore is used for deterministic tests and local harnesses. It mirrors the claim and state semantics without pretending to be a durable database.

Tests cover:

- first claim
- 25 concurrent duplicate attempts with one owner
- duplicate recognition
- retryable reclaim
- attempt accounting
- invalid state transitions
- terminal duplicate without repeated side effects

## 5. V2 webhook architecture

IMPLEMENTED

Route: v2/app/api/webhook/route.ts

Server processing order:

1. Read the raw request body.
2. Read Paddle-Signature.
3. Verify the raw body before parsing.
4. Parse JSON.
5. Normalize transaction.completed.
6. Claim the event durably.
7. Validate canonical Price/Product mapping.
8. Decide fulfillment.
9. Generate a private GCS signed URL.
10. Send transactional email through Resend.
11. Mark fulfillment and transactional delivery state.
12. Evaluate marketing consent independently.
13. Call MailerLite only for explicit true consent.

The route is Node.js runtime only and is not connected to a Paddle destination in G2B.

## 6. Paddle verification

IMPLEMENTED and TESTED

The active route uses the official @paddle/paddle-node-sdk webhook unmarshal helper with the exact raw body and endpoint secret. The synthetic HMAC verifier from G2A remains an independent oracle.

Tests cover:

- valid official SDK signature
- body alteration
- missing signature
- malformed JSON after verification
- unsupported events
- route smoke behavior

Official references:

- Signature verification: https://developer.paddle.com/webhooks/about/signature-verification/
- Node.js SDK: https://developer.paddle.com/sdks/libraries/node/
- Webhook response and retry behavior: https://developer.paddle.com/webhooks/about/respond-to-webhooks/

## 7. Fulfillment orchestrator

IMPLEMENTED and TESTED

Service: v2/lib/commerce/fulfillment-service.ts

Provider SDK calls are kept out of route.ts. The orchestration layer owns:

- ReceiptStore claim
- canonical decision
- state transitions
- GCS result classification
- Resend result classification
- transactional completion recording
- consent decision
- independent MailerLite outcome recording

No premium fallback exists. Unknown, historical, blocked, inactive, missing, or mismatched offers do not reach GCS or Resend.

## 8. GCS signed URL architecture

IMPLEMENTED and TESTED

Adapter: v2/lib/commerce/gcs.ts

- Google Cloud Storage remains private.
- The object is selected only from the canonical FulfillmentPolicy.
- No client-provided object path is accepted.
- No bucket listing route exists.
- No credential is sent to the browser.
- Signed URLs use V4 read access.
- Lifetime is 15 minutes.
- Rejected or unknown offers never invoke the adapter.
- URLs are used for delivery and are not persisted in webhook_receipts.

Provider tests cover exact object selection, success, missing object, signing failure, and transient failure.

## 9. Resend adapter

IMPLEMENTED and TESTED

Adapter: v2/lib/commerce/resend.ts

- Uses the server-only RESEND_API_KEY.
- Sends only product identity and the temporary signed URL.
- Uses an idempotency key derived from the transaction ID.
- Supports an explicit V2_SAFE_TEST_MODE recipient override.
- Does not send real customer email during G2B.
- Classifies success, 4xx permanent failure, 5xx transient failure, and network/timeout failure.

## 10. MailerLite adapter

IMPLEMENTED and TESTED

Adapter: v2/lib/commerce/mailerlite.ts

- Uses server-only MailerLite credentials.
- Calls the subscriber endpoint only from server code.
- Treats HTTP 409 as already subscribed.
- Classifies permanent and retryable provider failures.
- No production subscriber was created.
- A MailerLite failure after transactional fulfillment is recorded without revoking fulfillment.

## 11. Consent enforcement

IMPLEMENTED and TESTED

- marketingConsent true: marketing is allowed.
- marketingConsent false: no MailerLite call.
- marketingConsent absent: no MailerLite call.
- Transactional delivery remains independent of marketing.
- Newsletter input requires explicit consent true.

## 12. Newsletter route

IMPLEMENTED and TESTED

Route: v2/app/api/subscribe/route.ts

- Validates server-side input.
- Requires explicit consent.
- Uses the MailerLite adapter.
- Returns distinct application outcomes for subscribed, already subscribed, validation failure, permanent provider failure, and retryable provider failure.
- Does not use no-cors.
- Does not use Google Apps Script.
- Does not port or redesign the newsletter UI.

## 13. Failure and retry semantics

IMPLEMENTED and TESTED

- Missing signature: HTTP 400.
- Invalid signature: HTTP 401.
- Missing server secret: HTTP 503.
- Malformed JSON after successful verification: HTTP 400.
- Valid unsupported event: HTTP 200 and no side effects.
- Valid completed terminal duplicate: HTTP 200 and no side effects.
- Valid accepted event: HTTP 200 after processing.
- Temporary durable/provider failure: HTTP 503 and retryable receipt state.
- Permanent provider failure: HTTP 422 and permanent receipt state.
- Permanent invalid offer: durable REJECTED state with no fulfillment.
- The legacy catch-everything-to-200 behavior is not reproduced.

## 14. Multiple-items policy

IMPLEMENTED and TESTED

AKA Sounds currently uses one offer per checkout. G2B retains an explicit single-offer policy. A multi-item transaction is rejected with MULTIPLE_ITEMS_UNSUPPORTED. The implementation never silently selects item zero.

## 15. Price truth safeguard

VERIFIED from G2A

- Current premium Price ID: pri_01kk855x7wk29gv2d4hgz60k63
- Verified amount: USD 29.99
- The price was not modified.
- All five lead magnets remain verified at USD 0.
- The historical premium ID remains metadata-only and cannot fulfill.

## 16. Test suite

TESTED

Command: npm test

Result: 35 passing, 0 failing.

Coverage includes:

- catalog relations and historical rejection
- unknown Price and Product mismatch rejection
- official Paddle verification and synthetic signature oracle
- malformed and unsupported webhook events
- duplicate and concurrent event claims
- valid state transitions and retry accounting
- exact GCS object and signed URL policy
- GCS timeout, missing object, and signing failure
- Resend success, permanent, transient, and timeout outcomes
- MailerLite existing subscriber and provider outcomes
- explicit consent true/false/absent
- newsletter validation and provider status distinctions
- fulfillment isolation when marketing fails

## 17. Validation

TESTED

- Legacy build: PASS
- V2 TypeScript: PASS
- V2 lint: PASS with one pre-existing warning in v2/postcss.config.mjs
- V2 build: PASS
- V2 tests: PASS, 35/35
- Route smoke tests: PASS
- API route tests: PASS
- CodeGraph: PASS, 71 files, 506 nodes, 1,102 edges, index up to date
- Security scan: PASS

## 18. Security scan

TESTED

The repository-controlled scan found no copy of the temporary G2A catalog key or its variable name in tracked files, working-tree files, V2 fixtures, or repository-controlled logs. Vercel Preview environment-name inspection found no temporary catalog key variable. No secret value was printed, logged, committed, or added to Vercel.

The scan also checked the new server adapters and report for common API-key/private-key patterns without printing matches.

## 19. Preview isolation

VERIFIED and IMPLEMENTED

- V2 route exists only in the isolated aka-sounds-v2-preview project.
- The latest project deployment remains target Preview and Ready.
- No Paddle destination was configured or changed for the V2 route.
- Random unsigned webhook requests cannot reach processing side effects.
- akasounds.com is not attached to V2.
- Hostinger was not modified.
- The existing Vercel backend was not modified.
- No deployment was created by this G2B task.

## 20. Files changed

IMPLEMENTED

Allowed scope was respected: V2 runtime/docs only.

- v2/app/api/webhook/route.ts
- v2/app/api/subscribe/route.ts
- v2/db/migrations/0001_webhook_receipts.sql
- v2/lib/commerce/providers.ts
- v2/lib/commerce/state.ts
- v2/lib/commerce/receipt-store.ts
- v2/lib/commerce/fulfillment-service.ts
- v2/lib/commerce/webhook-handler.ts
- v2/lib/commerce/paddle-verifier.ts
- v2/lib/commerce/gcs.ts
- v2/lib/commerce/resend.ts
- v2/lib/commerce/mailerlite.ts
- v2/lib/commerce/newsletter.ts
- v2/tests/commerce.test.ts
- v2/tests/backend.test.ts
- v2/package.json
- v2/package-lock.json
- v2/.env.example
- AKA_SOUNDS_V2_G2B_BACKEND_REPORT.md

api/webhook.ts was not modified.

## 21. Production systems untouched

VERIFIED

Expected production modification fields:

- PRODUCTION WEBHOOK DESTINATION MODIFIED: NO
- LEGACY api/webhook.ts MODIFIED: NO
- HOSTINGER MODIFIED: NO
- EXISTING VERCEL BACKEND MODIFIED: NO
- PADDLE PRODUCTION MODIFIED: NO
- GCS PRODUCTION DATA MODIFIED: NO
- MAILERLITE PRODUCTION MODIFIED: NO
- RESEND PRODUCTION MODIFIED: NO
- MAIN MODIFIED: NO
- G3 STARTED: NO

No real customer purchase was performed. No real customer email was sent. No real customer was subscribed to MailerLite. GCS ZIPs were not moved and the bucket was not made public.

## 22. Remaining blockers and G2C proposal

BLOCKED FOR LIVE RESOURCE PROVISIONING

DURABLE STORE PROVISIONING: HUMAN APPROVAL REQUIRED

Remaining work before any production cutover:

1. Owner approves the Preview Neon resource and its billing/retention class.
2. Apply and inspect the SQL migration in isolated Preview.
3. Add only non-production Preview provider configuration.
4. Run synthetic Paddle webhook simulator events and inspect receipt state.
5. Review provider sender/test-recipient configuration.
6. Define a separate production Neon resource and backup plan.
7. Create a separate G2C production route/destination plan.
8. Human review and approval before any production Paddle destination change.
9. Define rollback and replay procedure before cutover.

Exact G2C proposal:

- Keep the legacy Vercel webhook as the production handler.
- Provision a separate production receipt database.
- Apply the reviewed migration.
- Deploy V2 to an isolated Preview and run synthetic events.
- Prepare a separately reviewed production V2 deployment.
- Create or select a new Paddle notification destination only during G2C.
- Verify the new destination secret against the new production environment.
- Route only the intended production events after approval.
- Monitor receipt claims, fulfillment, email, and retry state.
- Roll back by restoring the legacy destination and leaving the V2 database isolated.
- Do not change Hostinger or the public frontend as part of webhook cutover.

## Final result

PADDLE VERIFIER: IMPLEMENTED / TESTED
DURABLE STORE ABSTRACTION: IMPLEMENTED / TESTED
NEON PRODUCTION RESOURCE: NOT PROVISIONED
DURABLE STORE PROVISIONING: HUMAN APPROVAL REQUIRED
G2B RUNTIME IMPLEMENTATION: PASS
G2B VALIDATION: PASS
PRODUCTION SYSTEMS: UNTOUCHED
G2C STARTED: NO
G3 STARTED: NO

G2B STATUS: PASS

SAFE FOR HUMAN G2B REVIEW

STOP.
---

## G2B-R — Human Review Corrections

G2B-R was executed from the reviewed G2B HEAD:

- Starting HEAD: `392ce416e2b4b64491bd371e1d8629558254730a`
- Scope: `v2/**` and this report only
- `api/webhook.ts`: untouched
- Production systems: untouched

### Paddle ACK model

The V2 webhook now has two explicit stages:

1. Ingestion reads the raw body, verifies the Paddle signature, parses and normalizes the event, then atomically persists the normalized receipt.
2. Processing runs independently from the durable receipt and performs Customer hydration, fulfillment decision, GCS, Resend, and optional MailerLite work.

The HTTP response is returned only after durable receipt acceptance. GCS, Resend, MailerLite, and Customer hydration are not awaited by the Paddle HTTP ingress. Durable-store failure returns HTTP 503 so Paddle can retry. Paddle's official webhook guidance requires a 200 response within five seconds and recommends responding before downstream processing: [Paddle webhook delivery](https://developer.paddle.com/webhooks/about/respond-to-webhooks/).

### Durable inbox and recovery boundary

Implemented:

- `v2/db/migrations/0001_webhook_receipts.sql`
- `v2/db/migrations/0002_g2b_r_receipt_inbox.sql`
- normalized event, notification, transaction, customer, price, product, quantity, item count, state, attempt, error, hydration snapshot, marketing decision, and processing lease fields
- no raw Paddle body, API secret, GCS signed URL, or unnecessary Customer payload
- `NeonReceiptStore.claimProcessing()` and `releaseProcessing()` use database predicates and a processing lease
- `processReceiptEvent()` is an independent worker/recovery boundary and can process a previously stored receipt without the original request

### Next.js `after()`

The route uses stable Next.js `after()` only as a Preview convenience trigger after durable acceptance. Its callback catches downstream errors, and the receipt remains recoverable through `processReceiptEvent()`; `after()` is not treated as a durable queue. This matches the current Next.js behavior for post-response work: [Next.js `after`](https://nextjs.org/docs/app/api-reference/functions/after).

No Vercel Queue or paid/external queue was provisioned. Production async options remain a G2C decision.

### Paddle Customer hydration

Implemented server-only `PaddleCustomerAdapter` using the official Paddle Node SDK `customers.get(customerId)`.

The adapter returns only:

- Customer ID
- Customer email
- `marketing_consent`

Customer hydration occurs before the fulfillment decision. Webhook normalization no longer extracts email or marketing consent from the transaction payload. The realistic fixture contains `customer_id` but no email or marketing consent.

Required future permission: `customer.read`. No live Customer API call or credential change was made in G2B-R. Paddle documents both the `customer.read` requirement and the email/marketing consent fields: [Get a customer](https://developer.paddle.com/api-reference/customers/get-customer/) and [Paddle permissions](https://developer.paddle.com/api-reference/about/permissions/).

### Consent snapshot

After successful Customer hydration, the receipt stores only:

- hydration timestamp
- marketing consent snapshot
- marketing requested/completed audit fields

Transactional fulfillment remains independent of marketing consent. MailerLite is called only when hydrated `marketing_consent === true`. False or absent consent makes no marketing call.

### MailerLite semantics

The adapter now preserves HTTP/result semantics:

- 201 + active: `CREATED_ACTIVE`
- 200 + active: `EXISTING_ACTIVE`
- 200 + unsubscribed, bounced, junk, or unknown: `EXISTING_NONACTIVE`, not accepted
- 422: `REJECTED`
- 429, 5xx, and network timeout: `RETRYABLE_FAILURE`

No `resubscribe=true` is sent. Non-active subscribers are never silently reactivated or reported as successful subscriptions. Reference: [MailerLite Subscribers API](https://developers.mailerlite.com/api/subscribers).

### Signed URL policy

The V2 customer download policy is restored to:

- V4 signed read URL
- exact canonical private object
- 24-hour lifetime
- no client-selected object path
- no signed URL persisted in the receipt database

The 24-hour duration is an intentional AKA SOUNDS customer-experience decision.

### Expanded validation

- ACK returns HTTP 200 after durable acceptance without waiting for blocked downstream work
- durable-store failure returns non-2xx
- invalid signature performs no durable write
- duplicate processing has no duplicate fulfillment side effect
- previously stored receipts process independently
- retryable worker failures remain recoverable
- realistic Paddle `transaction.completed` fixture has no assumed email/consent
- Customer 404 is permanent; 429 is retryable
- MailerLite 201/200, active/non-active, 422, 429, 5xx, and timeout outcomes
- exact 24-hour GCS expiry
- unknown/rejected offers do not invoke GCS

G2B-R validation result:

- TypeScript: PASS
- V2 tests: PASS, 49/49
- Customer and MailerLite tests: PASS
- ACK/recovery tests: PASS
- GCS policy tests: PASS
- Security scan: PASS, no temporary Paddle key or value persisted
- CodeGraph: PASS, 73 files, 559 nodes, 1,319 edges, index up to date

### Scope and provisioning

- Neon provisioned: NO
- `DATABASE_URL` added to Vercel: NO
- Production Paddle modified: NO
- Existing Vercel backend modified: NO
- Hostinger modified: NO
- Production GCS data modified: NO
- Production Resend modified: NO
- Production MailerLite modified: NO
- `main` modified: NO
- G2C started: NO
- G3 started: NO

G2B-R changes are not a claim that production is cut over. Live Customer permission, isolated Neon provisioning, Preview configuration, synthetic webhook execution, and production async queue selection remain future human-reviewed work.

## G2B-R Final Result

PADDLE ACK MODEL: PASS
DURABLE INBOX: PASS
BACKGROUND PROCESSOR: PASS
PADDLE CUSTOMER ADAPTER: PASS WITH SYNTHETIC FIXTURES
CUSTOMER.READ REQUIRED: YES — FUTURE, NOT CONFIGURED
MAILERLITE 201/200 SEMANTICS: PASS
NONACTIVE SUBSCRIBER POLICY: PASS
SIGNED URL POLICY: PASS — 24 HOURS / V4 READ
TEST COUNT: 49/49
SECURITY SCAN: PASS

LEGACY BUILD: PASS
V2 LINT: PASS — one pre-existing warning in v2/postcss.config.mjs
V2 BUILD: PASS
V2 TESTS: PASS
CODEGRAPH: PASS — 73 files, 559 nodes, 1,319 edges, index up to date

NEON PROVISIONED: NO
PRODUCTION WEBHOOK MODIFIED: NO
HOSTINGER MODIFIED: NO
EXISTING VERCEL BACKEND MODIFIED: NO
PADDLE PRODUCTION MODIFIED: NO
GCS PRODUCTION MODIFIED: NO
MAILERLITE PRODUCTION MODIFIED: NO
RESEND PRODUCTION MODIFIED: NO
MAIN MODIFIED: NO
G2C STARTED: NO
G3 STARTED: NO

G2B-R STATUS: PASS

G2B STATUS: PASS
SAFE FOR HUMAN G2B REVIEW

STOP.

## G2B-R2 — Paddle Environment Safety

- Human review identified that `new Paddle(apiKey)` uses the SDK production default when no environment is provided.
- `PADDLE_ENVIRONMENT` now resolves explicitly to the official `Environment.sandbox` or `Environment.production` value. An absent or empty value retains a documented production default for backward compatibility; any other value fails in a controlled way without initializing the SDK client.
- The isolated V2 Preview configuration must be `PADDLE_ENVIRONMENT=sandbox`.
- The future production configuration must be `PADDLE_ENVIRONMENT=production`.
- Sandbox API keys and live API keys must never be mixed.
- No credentials, Vercel variables, Paddle production systems, legacy production code, Hostinger, Neon, or deployments were changed.

G2B-R2 STATUS: PASS
