# AKA SOUNDS V2 — G2A Commerce Truth & Test Harness Report

Date: 2026-08-17

## Gate scope

VERIFIED: G0 and G1 are GREEN. This document covers G2A only: commerce inventory, a typed V2 commerce boundary, deterministic fulfillment decisions, webhook normalization, synthetic signature tests, idempotency/state design, consent boundaries, newsletter adapter mocks, and local validation.

VERIFIED: G2A did not cut over production commerce, did not create a public V2 webhook, and did not start G3 or brand/UI work.

## 1. Starting state

VERIFIED:

- Branch: redesign/aka-sounds-v2
- Starting HEAD: 81bd554075184ef6961b8066854d60b5da37099d
- Upstream: origin/redesign/aka-sounds-v2
- origin/main: f98a2a2bf41d13c1698d350ec70755932cddb0ad
- Starting working tree: clean
- G1B report: PASS
- V2 Preview project: aka-sounds-v2-preview
- V2 Preview deployment: dpl_Dmzu1DpqMNGQTJz78sVxoYGXdkzM
- V2 Preview target: preview
- V2 Preview state: READY
- Hostinger remains the current public frontend host.
- The existing Vercel project remains the backend host for the legacy /api/webhook.

VERIFIED: CodeGraph was used before and after the implementation. Final index status: 61 files, 374 nodes, 620 edges, index up to date.

## 2. Production topology preserved

VERIFIED:

- Frontend production: GitHub -> existing deployment workflow -> Hostinger -> akasounds.com
- Existing backend production: Vercel project aka-sounds-landing -> legacy /api/webhook
- V2 development: isolated Next.js app under v2/ and isolated Vercel Preview project

VERIFIED: No production domain, webhook destination, production credential, DNS setting, Hostinger deployment, or existing Vercel backend setting was changed.

## 3. Current commerce inventory

VERIFIED from current source:

- Legacy paid product route: /product/hardtechno-essentials-vol-1
- Legacy free-download route: /free-trial
- The legacy frontend is a HashRouter application.
- The five free-pack cards open Paddle Checkout with one price ID and quantity 1.
- The five free-pack cards display Download - $0.00.
- The paid product source contains a Paddle price ID.
- The free-trial entry in src/data/products.ts has no Paddle price field and still carries a Payhip paymentUrl; the matching checkout price is present in src/data/freePacks.ts.

VERIFIED: The legacy webhook maps the first transaction item by comparing the item price ID or the item price.product_id against values that are all configured as price IDs. This is a Price ID/Product ID type-confusion risk.

VERIFIED: The legacy webhook has no durable event-id receipt. Unknown price/product values fall through to the premium GCP_FILE_NAME path. The legacy catch block returns HTTP 200 even on processing errors. These behaviors were inventoried only; api/webhook.ts was not edited.

## 4. Product / Price ID matrix

HISTORICAL G2A SNAPSHOT (preserved): Paddle Product ID values were marked BLOCKED because the previously available production API key returned 403 on the read-only price lookups needed to resolve the product relationship. No Product ID was invented. See G2A-R below for the verified live matrix.

| Offer / internal slug | Display title | Kind | Current frontend Price ID | Legacy webhook mapping ID | Paddle Product ID | Fulfillment object | Email subject | Status / route |
|---|---|---|---|---|---|---|---|---|
| offer-hardtechno-essentials-v1 / hardtechno-essentials-vol-1 | Hardtechno Essentials Vol. 1 | paid | pri_01kk855x7wk29gv2d4hgz60k63 | pri_01kkcjshgdd9p0yqgexv3nrt2f | BLOCKED / not read | environment reference GCP_FILE_NAME | Your AKA SOUNDS Download Request! | BLOCKED for live relation / /product/:slug |
| offer-hardtechno-essentials-free-trial / hardtechno-essentials-vol-1-free-trial | Hardtechno Essentials Vol. 1 FREE TRIAL | free | pri_01kkd2y0pdsxvg234s8zvfshqj | pri_01kkd2y0pdsxvg234s8zvfshqj | BLOCKED / not read | AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL 1.zip | Your AKA SOUNDS Free Access! | BLOCKED for live relation / /free-trial |
| offer-serum-2-reverse-bass-kick / serum-2-reverse-bass-kick | Serum 2 Reverse Bass Kick | free | pri_01kkwnrqgq7xcd5hhpxg99ae6p | pri_01kkwnrqgq7xcd5hhpxg99ae6p | BLOCKED / not read | AKA Sounds Free Serum 2 Reverse Bass Kick.zip | Your AKA SOUNDS Download Request! | BLOCKED for live relation / /free-trial |
| offer-serum-2-zaag-kick / serum-2-zaag-kick | Serum 2 Zaag Kick | free | pri_01kmnmnp5fr08h43fsfa2qbcqt | pri_01kmnmnp5fr08h43fsfa2qbcqt | BLOCKED / not read | AKA Sounds Free Serum 2 Zaag Kick.zip | Your AKA SOUNDS Download Request! | BLOCKED for live relation / /free-trial |
| offer-serum-2-hardtechno-kick / serum-2-hardtechno-kick | Serum 2 Hardtechno Kick | free | pri_01kn7gspy845ttqp6m8mn4jgkr | pri_01kn7gspy845ttqp6m8mn4jgkr | BLOCKED / not read | AKA Sounds Free Serum 2 Hardtechno Kick.zip | Your AKA SOUNDS Download Request! | BLOCKED for live relation / /free-trial |
| offer-serum-2-hard-dance-screeches / serum-2-hard-dance-screeches | Serum 2 Hard Dance Screeches | free | pri_01knt149kwqhp35wa0hwb4gwqn | pri_01knt149kwqhp35wa0hwb4gwqn | BLOCKED / not read | AKA Sounds Free Serum 2 Hard Dance Screeches.zip | Your AKA SOUNDS Download Request! | BLOCKED for live relation / /free-trial |

INFERRED: The premium mismatch is not a legitimate V2 alias. The V2 model records the historical webhook ID as historical metadata only; it is not accepted as an active offer.

VERIFIED from legacy source: The premium object key is only determinable as the environment reference GCP_FILE_NAME without exposing the environment value. The five free object filenames above are literal legacy mappings.

## 5. Paddle live verification

HISTORICAL BLOCKED STATE (preserved): A read-only GET request was attempted for each current frontend Price ID and the historical premium webhook Price ID through the production environment already configured on the existing Vercel backend. No secret or response body was printed.

Observed safe result summary:

- Current frontend Price IDs: HTTP 403 from Paddle price lookup.
- Historical premium webhook Price ID: HTTP 404 from the same lookup.
- Product ID, price status, product status, and product name could not be safely resolved from the available API permission.

HISTORICAL BLOCKED STATE (preserved): PADDLE LIVE VERIFICATION remained BLOCKED. The source mismatch kept the premium risk open; the later G2A-R evidence is recorded below and does not infer historical legitimacy.

Official references:

- [Paddle products and prices](https://developer.paddle.com/build/reports/products-prices/)
- [Paddle list products API](https://developer.paddle.com/api-reference/products/list-products/)
- [Paddle transaction.completed](https://developer.paddle.com/webhooks/transactions/transaction-completed/)

## 6. Canonical V2 commerce model

VERIFIED implementation in v2/lib/commerce:

- CatalogProduct: public/editorial product identity and kind.
- Offer: one canonical Paddle Price ID mapping to one CatalogProduct slug, with Product ID, availability, verification state, and historical IDs.
- FulfillmentPolicy: server-only offer policy containing the storage object reference and transactional email metadata.
- canonicalCommerceModel: the single server-side mapping source.
- publicCommerceCatalog: client-safe projection without storage policy data.

VERIFIED: The model contains six current offers and six fulfillment policies. No duplicated switch/case mapping was added. The old webhook switch remains untouched and is explicitly treated as legacy risk.

HISTORICAL BLOCKED STATE (preserved): Because live Product ID relations were not readable at the time, the production model stored null Product IDs, verification blocked, and availability unverified. G2A-R now records the verified current relations below.

VERIFIED: No V2 app page, client component, or public route imports the server fulfillment policy module. No V2 checkout integration or active provider SDK path was added.

## 7. Unknown-product policy and decision engine

VERIFIED implementation: decideFulfillment is pure and network-free. It returns FULFILL with the exact offer and policy or REJECT with a structured reason.

VERIFIED rejection behavior:

- UNKNOWN_PRICE rejects.
- Historical premium Price ID rejects as UNKNOWN_PRICE.
- Missing Product ID rejects.
- Unverified Product/Price mapping rejects.
- Product/Price mismatch rejects.
- Inactive offer rejects.
- Missing fulfillment policy rejects.
- Missing customer email, missing item, multiple unsupported items, and non-completed transactions reject.

VERIFIED: Rejected input cannot select another product, default to premium, generate a signed URL, send an email, or subscribe to marketing because the decision layer has no provider access.

## 8. Webhook normalization

VERIFIED implementation: normalizeTransactionCompleted supports only transaction.completed and normalizes:

- event ID
- notification ID
- occurred timestamp
- transaction ID and status
- customer ID and email when present
- marketing consent when present
- item quantity
- item Price ID and Product ID as separate fields

VERIFIED: No public V2 webhook route was added. No raw personal data is persisted by this harness.

## 9. Signature verification harness

VERIFIED: The synthetic harness covers:

- valid signature
- invalid signature
- missing signature
- malformed header
- altered body after signing
- exact raw body before parsing

VERIFIED: The implementation uses the documented Paddle algorithm: ts + ":" + raw body, HMAC-SHA256, timing-safe comparison, and timestamp tolerance. No live event or production secret is used by tests.

PROPOSED: A future V2 active webhook should use the installed official Paddle SDK verifier where its request adapter supports the required raw-body boundary. The manual harness remains useful as a deterministic unit-test oracle.

Official reference: [Paddle webhook signature verification](https://developer.paddle.com/webhooks/about/signature-verification/)

## 10. Idempotency store recommendation

PROPOSED recommendation: managed Postgres compatible with Vercel, preferably the existing Vercel Marketplace/Neon-style Postgres option after human approval.

Required receipt shape:

- unique event_id
- transaction_id
- notification_id
- state
- attempt count
- first/last timestamps
- occurred_at
- last failure class/code
- fulfillment and marketing outcome fields

Why Postgres:

- atomic unique insert/check for event_id
- durable state transitions and audit queries
- straightforward retry leases and indexes
- compatible with a low-traffic Vercel server function
- no provider SDK needs to be spread through business logic

Comparison:

- Managed Postgres: medium-low implementation complexity, durable relational state, low-to-medium cost class.
- Serverless SQL/libSQL: medium implementation complexity and durable storage, but an additional adapter and transaction/concurrency verification are required.
- Redis/KV: low initial complexity, but less suitable as the authoritative receipt/audit store unless persistence, atomic claims, retention, and failure recovery are separately proven.

VERIFIED: No database provider, billing resource, table, or credential was created in G2A.

## 11. Proposed webhook state machine

VERIFIED implementation states:

RECEIVED -> SIGNATURE_VERIFIED -> VALIDATED -> FULFILLMENT_PENDING -> FULFILLED

Terminal or failure branches:

- RECEIVED -> REJECTED or PERMANENT_FAILURE
- SIGNATURE_VERIFIED -> REJECTED or PERMANENT_FAILURE
- VALIDATED -> REJECTED or PERMANENT_FAILURE
- FULFILLMENT_PENDING -> RETRYABLE_FAILURE or PERMANENT_FAILURE
- RETRYABLE_FAILURE -> FULFILLMENT_PENDING or PERMANENT_FAILURE

PROPOSED delivery semantics:

- Verify the raw signature before trusting parsed content.
- Atomically insert event_id before side effects.
- Return 2xx only after a valid signature and durable receipt acceptance, including a terminal duplicate decision.
- Return non-2xx for transient inability to durably accept a valid notification so Paddle can retry.
- Record permanent validation rejection durably and do not perform provider side effects.
- A duplicate event_id must not create a second signed URL or transactional email.
- GCS and Resend failures are fulfillment-critical and retryable when transient.
- MailerLite is a separate, non-critical marketing side effect; its failure must not invalidate a successful transactional fulfillment.

Official reference: [How Paddle webhooks work](https://developer.paddle.com/webhooks/about/how-webhooks-work/)

## 12. Retry semantics

VERIFIED implementation: Provider failures are classified as retryable or permanent. The harness covers timeout/5xx and permanent 4xx-style mapping failures.

PROPOSED:

- Retry GCS/Resend transient failures with bounded exponential backoff and receipt attempt tracking.
- Do not retry deterministic mapping, signature, consent, or validation failures.
- Retry MailerLite independently only when explicit consent exists.
- Never retry by blindly replaying a side effect without checking the durable receipt state.

Paddle documents at-least-once delivery and automatic retries when a delivery is not acknowledged in time. See [Paddle delivery and retries](https://developer.paddle.com/webhooks/about/respond-to-webhooks/).

## 13. Consent boundary

VERIFIED from current Paddle documentation: customer marketing_consent is a boolean and defaults to false unless the customer opts into marketing during checkout. See [Paddle customers](https://developer.paddle.com/api-reference/customers/list-customers/).

VERIFIED from legacy source: the current webhook reads customer marketing consent but then activates MailerLite for every download when the MailerLite key exists. The consent value is not used as a gate.

PROPOSED V2 policy:

- Transactional download email: allowed when the exact offer has passed deterministic fulfillment.
- Marketing subscription: allowed only when the normalized consent value is explicitly true.
- false or absent consent: do not call MailerLite.
- Preserve event ID, consent value, occurred_at, and policy version in the future receipt/audit record without retaining unnecessary raw personal data.

VERIFIED: No MailerLite subscriber was written in G2A.

## 14. Newsletter architecture

PROPOSED target:

browser -> V2 subscribe boundary -> validated server request -> MailerLite adapter -> truthful response

VERIFIED implementation in G2A:

- validateNewsletterRequest validates email and requires explicit consent.
- submitNewsletter consumes only the adapter interface.
- Provider outcomes are explicit: SUBSCRIBED, ALREADY_SUBSCRIBED, REJECTED, or RETRYABLE_FAILURE.
- Tests use fake adapters only.
- No public /api/subscribe route was added.

VERIFIED from [MailerLite subscriber API documentation](https://developers.mailerlite.com/api/subscribers): POST subscriber upsert returns 201 for a new subscriber, 200 when the email already exists, and 422 for invalid data. Rate-limit and transient responses are treated as retryable at the adapter boundary.

## 15. Provider adapter boundaries

VERIFIED interfaces exist for:

- PaddleAdapter
- GcsAdapter
- ResendAdapter
- MailerLiteAdapter
- ReceiptStore

VERIFIED: Business logic in the new V2 commerce modules does not import live Paddle, GCS, Resend, or MailerLite SDK clients. Tests supply fake adapter responses.

## 16. Automated tests

VERIFIED: V2 test command passed 13/13 tests.

Coverage includes:

- every current offer resolving exactly once against a synthetic verified Product relation
- unknown Price ID rejection
- historical premium ID rejection
- wrong Product ID and missing Product ID rejection
- no premium fallback
- exact fulfillment policy mapping
- consent true, false, and absent
- transaction.completed normalization
- valid, invalid, missing, malformed, and altered-body signatures
- raw-body verification boundary
- duplicate event behavior
- retryable and permanent provider failures
- newsletter valid/invalid/missing consent
- newsletter success, existing subscriber, provider rejection, and timeout mocks

## 17. Security scan

VERIFIED:

- No API key, webhook secret, GCP private key, signed credential, or provider token was added to new V2 code.
- v2/.env.example contains only empty variable-name placeholders.
- No private storage policy module is imported by v2/app or v2/components.
- No production credential was attached to the V2 Preview project.
- The new test secret and provider IDs are synthetic/public test values only.

## 18. Validation results

VERIFIED:

- Legacy build: PASS — TypeScript and Vite build completed.
- V2 lint: PASS — one pre-existing warning in postcss.config.mjs, no errors.
- V2 build: PASS — Next.js build completed.
- V2 tests: PASS — 13/13.
- V2 local route smoke: PASS — /, /about, /free, /sounds, /tutorials, /legal/privacy, and /robots.txt returned HTTP 200.
- CodeGraph: PASS — index up to date.
- Existing V2 Preview: PASS — READY, target preview, no production domain.

## 19. Files changed

Allowed implementation scope only:

- v2/lib/commerce/catalog.ts
- v2/lib/commerce/consent.ts
- v2/lib/commerce/decision.ts
- v2/lib/commerce/fulfillment.ts
- v2/lib/commerce/newsletter.ts
- v2/lib/commerce/paddle.ts
- v2/lib/commerce/providers.ts
- v2/lib/commerce/server-catalog.ts
- v2/lib/commerce/signature.ts
- v2/lib/commerce/state.ts
- v2/lib/commerce/types.ts
- v2/tests/commerce.test.ts
- v2/package.json
- v2/package-lock.json
- AKA_SOUNDS_V2_G2A_COMMERCE_TRUTH_REPORT.md

VERIFIED: No V2 app page, UI component, legacy source, legacy API, or deployment configuration was changed.

## 20. Legacy production files confirmed untouched

VERIFIED:

- api/webhook.ts byte-for-byte unchanged.
- Hostinger modified: NO.
- Existing Vercel backend modified: NO.
- Paddle production modified: NO.
- MailerLite production modified: NO.
- Resend production modified: NO.
- GCP production modified: NO.
- main modified: NO.
- G3 started: NO.

## 21. Open risks

HISTORICAL BLOCKED STATE (preserved): Production Paddle Product/Price verification was open because the previously available production API credential did not permit the required read-only catalog lookup. G2A-R supersedes this current-state finding for the six verified offers.

VERIFIED: The premium frontend Price ID and legacy webhook Price ID differ.

VERIFIED: The legacy webhook compares Product ID fields to Price ID constants and has a premium fallback. This remains production risk but was intentionally not changed in G2A.

PROPOSED: Do not enable a V2 fulfillment route until Product ID relations, offer status, destination identity, and receipt storage are reviewed by a human owner.

## 22. Exact proposed scope for G2B

PROPOSED G2B only:

1. Obtain approved read-only Paddle product.read access and complete the Product/Price matrix.
2. Human-review the canonical mapping and replace blocked Product IDs only with evidence from Paddle.
3. Choose and approve the durable receipt store.
4. Implement an isolated server route using the adapter interfaces and official Paddle verifier.
5. Run provider-contract tests against safe non-production fixtures.
6. Review consent/audit retention and newsletter semantics.
7. Produce a separate G2B report and approval checkpoint.

G2B must not merge or cut over the legacy production webhook without a separate human approval.

## G2A-R — Paddle Live Catalog Verification

VERIFIED: On 2026-08-17, the six current frontend Price IDs and the historical legacy premium Price ID were queried with the temporary Paddle API key supplied for this recovery. The key was passed through stdin to an ephemeral process, held only in memory, and never printed, written to a file, added to Vercel, added to Git, or used after the read-only queries.

VERIFIED: Only GET requests to Paddle Prices and Products endpoints were used. No Paddle write endpoint, checkout, notification-setting mutation, or production integration was performed.

### Verified live Product / Price matrix

| Current offer | Price ID | Price status | Product ID | Product status | Price details | Product name | Classification |
|---|---|---|---|---|---|---|---|
| Hardtechno Essentials Vol. 1 | pri_01kk855x7wk29gv2d4hgz60k63 | active | pro_01kk852aee3nqfj046d1ht4wb5 | active | USD 2999, one-time, Base Price | AKA Sounds - Hardtechno Essentials Vol. 1 | ACTIVE CURRENT |
| Hardtechno Essentials Vol. 1 Free Trial | pri_01kkd2y0pdsxvg234s8zvfshqj | active | pro_01kkd2v46gh17agp418540s9b7 | active | USD 0, one-time, FREE TRIAL | AKA Sounds - Hardtechno Essentials Vol. 1 Free Trial. | ACTIVE CURRENT |
| Serum 2 Reverse Bass Kick | pri_01kkwnrqgq7xcd5hhpxg99ae6p | active | pro_01kkwhw131933xnm3c8yhcqrps | active | USD 0, one-time, Free Lead Magnet - Reverse Bass Expansion Vol. 1 | AKA Sounds - Free Serum 2 Reverse Bass Kick | ACTIVE CURRENT |
| Serum 2 Zaag Kick | pri_01kmnmnp5fr08h43fsfa2qbcqt | active | pro_01kmnmhnth6nz30geqrfrfvj82 | active | USD 0, one-time, Free Lead Magnet - Zaag Expansion Vol. 1 | AKA Sounds - Free Serum 2 Zaag Kick | ACTIVE CURRENT |
| Serum 2 Hardtechno Kick | pri_01kn7gspy845ttqp6m8mn4jgkr | active | pro_01kn7gqyc33erxrypv628qak5t | active | USD 0, one-time, Free Lead Magnet - Hardtechno Expansion Vol. 1 | AKA Sounds - Free Serum 2 Hardtechno Kick | ACTIVE CURRENT |
| Serum 2 Hard Dance Screeches | pri_01knt149kwqhp35wa0hwb4gwqn | active | pro_01knt11by8qqzskg701zgd7k2c | active | USD 0, one-time, Free Lead Magnet - Hard Dance Screech Expansion Vol. 1 | AKA Sounds - Free Serum 2 Hard Dance Screech | ACTIVE CURRENT |
| Historical legacy premium mapping | pri_01kkcjshgdd9p0yqgexv3nrt2f | NOT FOUND, HTTP 404 | not returned | not queried | no live Price object returned | not queried | NOT FOUND |

VERIFIED: Each of the six current Price objects returned its requested Price ID, an active status, USD currency, a one-time billing shape, and a Product ID. Each distinct returned Product ID was then queried directly and returned HTTP 200, the same Product ID, an active status, and the product name shown above.

VERIFIED: The current frontend premium Price ID is active and belongs to the active product pro_01kk852aee3nqfj046d1ht4wb5. The historical legacy webhook Price ID is not found by the live Prices endpoint.

RESOLVED FOR CURRENT PRODUCTION BEHAVIOR: the active current offer is the frontend Price ID pri_01kk855x7wk29gv2d4hgz60k63. The historical ID remains metadata only and is not an active V2 fulfillment alias.

BLOCKED HISTORICAL QUESTION: the 404 result does not establish whether the historical ID was ever legitimate in the past. No historical legitimacy is inferred from the current response.

### G2A-R model and test outcome

VERIFIED: The canonical V2 model now contains all six live Product IDs, verification: verified, and availability: active. Historical premium mapping remains in historicalPriceIds only.

VERIFIED: Commerce tests now assert every real current Price ID against its corresponding real Product ID, then run fulfillment with that exact pair. A correct Price ID with a wrong Product ID rejects with PRICE_PRODUCT_MISMATCH.

VERIFIED: G2A-R did not modify api/webhook.ts, Hostinger, the existing Vercel backend, production Paddle settings, MailerLite, Resend, GCP, or Vercel Preview.


## Final gate result

PADDLE LIVE VERIFICATION: PASS

CANONICAL PRODUCT MODEL: PASS — all six current Price/Product relations verified live

PREMIUM ID MISMATCH STATUS: RESOLVED FOR CURRENT PRODUCTION BEHAVIOR

UNKNOWN PRODUCT FALLBACK: PASS — explicit REJECT, no premium fallback

SIGNATURE TESTS: PASS

IDEMPOTENCY STORE RECOMMENDATION: PROPOSED — managed Postgres compatible with Vercel

CONSENT TESTS: PASS

NEWSLETTER TESTS: PASS — mocks only

SECURITY SCAN: PASS

LEGACY BUILD: PASS

V2 LINT: PASS

V2 BUILD: PASS

V2 TESTS: PASS — 13/13

CODEGRAPH: PASS

LEGACY api/webhook.ts MODIFIED: NO

HOSTINGER MODIFIED: NO

EXISTING VERCEL BACKEND MODIFIED: NO

PADDLE PRODUCTION MODIFIED: NO

MAILERLITE PRODUCTION MODIFIED: NO

RESEND PRODUCTION MODIFIED: NO

GCP PRODUCTION MODIFIED: NO

MAIN MODIFIED: NO

G3 STARTED: NO

G2A STATUS: PASS

G2A-R completed with read-only Paddle evidence. The historical ID remains NOT FOUND and metadata-only; no historical legitimacy was inferred and no production mutation was attempted.

SAFE FOR HUMAN G2A REVIEW
