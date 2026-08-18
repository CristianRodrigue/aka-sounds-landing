# AKA SOUNDS V2 — G2B-E2E Preview Closeout

## G2B-E2E — Human-Confirmed GREEN

Checkpoint: G2B-E2E  
Environment: isolated Vercel Preview + Paddle Sandbox + Neon Preview  
Source HEAD: `7973f6c9bd1f9f3a08100453e273371f8043d6a3`  

The human owner confirmed receipt of the transactional email, downloaded the
Zaag Kick ZIP, and opened the correct archive successfully.

## Final technical evidence

- Paddle Sandbox simulation: `AKA SOUNDS V2 ZAAG FINAL E2E`
- Final simulation run: `ntfsimrun_01m0b5ajmqx0m6h3zcrznapq7w`
- Final simulation event: `ntfsimevt_01m0b5ajn394jzf1ym7qqwbk9c`
- Final webhook result: HTTP 200
- Final Neon receipt: `FULFILLED`, one item, attempt count 1
- Customer hydration: PASS for the approved Sandbox customer
- Verified Sandbox mapping: Zaag Kick Price/Product to `offer-serum-2-zaag-kick`
- Marketing consent: `false`; `marketing_requested=false`
- GCS: existing `AKA Sounds Free Serum 2 Zaag Kick.zip`; signed V4 read URL with 24-hour TTL generated
- Resend: PASS through the Preview safe test recipient
- MailerLite: not called
- Human download/open confirmation: PASS
- No signed URL, credential, private key, or full recipient address is recorded here

## Recovery history preserved

1. The first custom simulation fixture was incomplete. The Paddle SDK raised a
   parsing `TypeError`, which the existing verifier surfaced as
   `INVALID_SIGNATURE`.
2. Paddle's complete demo transaction shape verified the secret, signature,
   route, and handler with HTTP 200.
3. The demo shape contained three line items. The final fixture retained the
   official structure but reduced it to exactly one verified Zaag item, as
   required by the V2 multi-item policy.

## Cleanup performed

- Temporary Vercel automation bypass `Paddle Sandbox E2E`: revoked.
- Paddle Sandbox notification destination: temporary bypass query removed;
  endpoint secret remained stable.
- Temporary `PADDLE_API_KEY` copy: removed from Vercel Preview.
- `PADDLE_WEBHOOK_SECRET`: retained for the normal Preview webhook integration.
- Neon Preview, GCS read-only service account, Resend Preview configuration,
  and Sandbox catalog mappings: retained.

## Production isolation

- Paddle Live: unchanged
- Vercel Production: unchanged
- Hostinger / `akasounds.com`: unchanged
- Live products/prices: unchanged
- GCS objects and IAM: unchanged
- MailerLite live writes: none
- Main branch: unchanged

## Remaining credential action

The Sandbox API key management endpoint returned no manageable keys for the
temporary key's permissions, so the key itself could not be revoked through
the API. Its Vercel Preview copy and temporary permissions usage are gone.

G2B STATUS: GREEN
