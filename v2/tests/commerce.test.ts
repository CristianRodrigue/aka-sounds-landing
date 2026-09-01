import { createHmac } from "node:crypto";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canonicalCommerceModel, canonicalOffers, validateCommerceModel } from "../lib/commerce/server-catalog";
import { decideConsent } from "../lib/commerce/consent";
import { decideFulfillment } from "../lib/commerce/decision";
import { resolvePaddleEnvironment } from "../lib/commerce/paddle-customer";
import { classifyProviderFailure } from "../lib/commerce/providers";
import { normalizeTransactionCompleted } from "../lib/commerce/paddle";
import { verifyPaddleSignature } from "../lib/commerce/signature";
import { canTransition, isDuplicateReceipt } from "../lib/commerce/state";
import { validateNewsletterRequest } from "../lib/commerce/newsletter";
import { submitNewsletter } from "../lib/commerce/newsletter";
import type { CommerceModel, NormalizedTransaction, Offer } from "../lib/commerce/types";


function transactionFor(offer: Offer, productId: string | null = offer.paddleProductId): NormalizedTransaction {
  return {
    eventId: "evt_test_001",
    notificationId: "ntf_test_001",
    occurredAt: "2026-08-17T00:00:00Z",
    transactionId: "txn_test_001",
    status: "completed",
    customerId: "ctm_test_001",
    customerEmail: "customer@example.test",
    marketingConsent: null,
    items: [{ priceId: offer.paddlePriceId, productId, quantity: 1 }],
  };
}

function sandboxFixture(): { model: CommerceModel; transaction: NormalizedTransaction } {
  const sandboxMapping = { priceId: "pri_sandbox_fixture_001", productId: "pro_sandbox_fixture_001" };
  const offer: Offer = {
    ...canonicalOffers[0],
    paddle: { ...canonicalOffers[0].paddle, sandbox: sandboxMapping },
  };
  const model: CommerceModel = { ...canonicalCommerceModel, offers: [offer] };
  return {
    model,
    transaction: {
      ...transactionFor(offer),
      items: [{ priceId: sandboxMapping.priceId, productId: sandboxMapping.productId, quantity: 1 }],
    },
  };
}

function signatureFor(rawBody: string, secret: string, timestamp = 1_700_000_000): string {
  const hash = createHmac("sha256", secret).update(String(timestamp) + ":" + rawBody).digest("hex");
  return "ts=" + timestamp + ";h1=" + hash;
}

const verifiedRelations = [
  { priceId: "pri_01kk855x7wk29gv2d4hgz60k63", productId: "pro_01kk852aee3nqfj046d1ht4wb5" },
  { priceId: "pri_01kkd2y0pdsxvg234s8zvfshqj", productId: "pro_01kkd2v46gh17agp418540s9b7" },
  { priceId: "pri_01kkwnrqgq7xcd5hhpxg99ae6p", productId: "pro_01kkwhw131933xnm3c8yhcqrps" },
  { priceId: "pri_01kmnmnp5fr08h43fsfa2qbcqt", productId: "pro_01kmnmhnth6nz30geqrfrfvj82" },
  { priceId: "pri_01kn7gspy845ttqp6m8mn4jgkr", productId: "pro_01kn7gqyc33erxrypv628qak5t" },
  { priceId: "pri_01knt149kwqhp35wa0hwb4gwqn", productId: "pro_01knt11by8qqzskg701zgd7k2c" },
  { priceId: "pri_01m0zn4mcma11bnywpvcp2qfk0", productId: "pro_01m0zn4m2yj1b1a6hcec11762f" },
  { priceId: "pri_01m0zn4mt890s0fp4xym0jpj9s", productId: "pro_01m0zn4mjav7rq5hq620tkedmk" },
] as const;

describe("G2A canonical commerce model", () => {
  it("contains a valid policy for every current offer", () => {
    assert.deepEqual(validateCommerceModel(canonicalCommerceModel), []);
    assert.equal(canonicalOffers.length, 8);
    for (const offer of canonicalOffers) {
      assert.ok(canonicalCommerceModel.fulfillmentPolicies.some((policy) => policy.offerId === offer.id));
    }
  });

  it("fulfills every current offer exactly once against live Price/Product pairs", () => {
    const model = canonicalCommerceModel;
    assert.equal(model.offers.length, verifiedRelations.length);
    for (const relation of verifiedRelations) {
      const offer = model.offers.find((candidate) => candidate.paddlePriceId === relation.priceId);
      assert.ok(offer);
      assert.equal(offer.paddlePriceId, relation.priceId);
      assert.equal(offer.paddleProductId, relation.productId);
      assert.equal(offer.verification, "verified");
      assert.equal(offer.availability, "active");
      const result = decideFulfillment(transactionFor(offer), model);
      assert.equal(result.decision, "FULFILL");
      if (result.decision === "FULFILL") assert.equal(result.offerId, offer.id);
    }
  });

  it("isolates Live and Sandbox Price/Product mappings by environment", () => {
    const live = canonicalOffers[0];
    const production = decideFulfillment(
      transactionFor(live),
      canonicalCommerceModel,
      resolvePaddleEnvironment("production"),
    );
    assert.equal(production.decision, "FULFILL");

    const liveInSandbox = decideFulfillment(
      transactionFor(live),
      canonicalCommerceModel,
      resolvePaddleEnvironment("sandbox"),
    );
    assert.deepEqual(liveInSandbox, { decision: "REJECT", reason: "UNKNOWN_PRICE" });

    const { model, transaction } = sandboxFixture();
    const sandbox = decideFulfillment(transaction, model, resolvePaddleEnvironment("sandbox"));
    assert.equal(sandbox.decision, "FULFILL");

    const sandboxInProduction = decideFulfillment(
      transaction,
      model,
      resolvePaddleEnvironment("production"),
    );
    assert.deepEqual(sandboxInProduction, { decision: "REJECT", reason: "UNKNOWN_PRICE" });

    const invalid = decideFulfillment(
      transactionFor(live),
      canonicalCommerceModel,
      resolvePaddleEnvironment("invalid"),
    );
    assert.deepEqual(invalid, { decision: "REJECT", reason: "INVALID_PADDLE_ENVIRONMENT" });
  });

  it("rejects unknown prices without falling back to premium", () => {
    const model = canonicalCommerceModel;
    const result = decideFulfillment(
      { ...transactionFor(model.offers[0]), items: [{ priceId: "pri_unknown", productId: "pro_unknown", quantity: 1 }] },
      model,
    );
    assert.deepEqual(result, { decision: "REJECT", reason: "UNKNOWN_PRICE" });
  });

  it("rejects the historical premium webhook price in every environment", () => {
    const model = canonicalCommerceModel;
    const offer = model.offers[0];
    for (const environment of ["production", "sandbox"] as const) {
      const result = decideFulfillment(
        { ...transactionFor(offer), items: [{ priceId: "pri_01kkcjshgdd9p0yqgexv3nrt2f", productId: offer.paddleProductId, quantity: 1 }] },
        model,
        resolvePaddleEnvironment(environment),
      );
      assert.deepEqual(result, { decision: "REJECT", reason: "UNKNOWN_PRICE" });
    }
  });

  it("rejects product/price mismatches and missing products for verified offers", () => {
    const model = canonicalCommerceModel;
    const offer = model.offers[0];
    assert.deepEqual(
      decideFulfillment(transactionFor(offer, "pro_wrong"), model),
      { decision: "REJECT", reason: "PRICE_PRODUCT_MISMATCH", offerId: offer.id },
    );
    assert.deepEqual(
      decideFulfillment(transactionFor(offer, null), model),
      { decision: "REJECT", reason: "MISSING_PRODUCT", offerId: offer.id },
    );
    const blockedOffer: Offer = {
      ...offer,
      paddleProductId: null,
      verification: "blocked",
      availability: "unverified",
    };
    const blockedModel = { ...model, offers: [blockedOffer, ...model.offers.slice(1)] };
    assert.deepEqual(
      decideFulfillment(transactionFor(blockedOffer, null), blockedModel),
      { decision: "REJECT", reason: "UNVERIFIED_PRODUCT_MAPPING", offerId: blockedOffer.id },
    );
  });
});
describe("G2A consent and normalized transaction boundaries", () => {
  it("allows transactional email but only explicit true enables marketing", () => {
    assert.equal(decideConsent(true).marketingSubscriptionAllowed, true);
    assert.equal(decideConsent(false).marketingSubscriptionAllowed, false);
    assert.equal(decideConsent(null).marketingSubscriptionAllowed, false);
    assert.equal(decideConsent(null).transactionalEmailAllowed, true);
  });

  it("normalizes transaction.completed and preserves product/price separately", () => {
    const result = normalizeTransactionCompleted({
      event_id: "evt_001",
      event_type: "transaction.completed",
      notification_id: "ntf_001",
      occurred_at: "2026-08-17T00:00:00Z",
      data: {
        id: "txn_001",
        status: "completed",
        customer_id: "ctm_001",
        customer: { email: "customer@example.test", marketing_consent: true },
        items: [{ quantity: 1, price: { id: canonicalOffers[0].paddlePriceId, product_id: "pro_001" } }],
      },
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.transaction.items[0].priceId, canonicalOffers[0].paddlePriceId);
      assert.equal(result.transaction.items[0].productId, "pro_001");
      assert.equal(result.transaction.marketingConsent, null);
      assert.equal(result.transaction.customerEmail, null);
    }
  });
});

describe("G2A Paddle signature harness", () => {
  const secret = "synthetic-g2a-secret";
  const rawBody = '{"event_type":"transaction.completed","data":{"id":"txn_001"}}';
  const header = signatureFor(rawBody, secret);

  it("accepts a valid signature over the exact raw body", () => {
    assert.deepEqual(verifyPaddleSignature(rawBody, header, secret, 1_700_000_000), { valid: true });
  });

  it("rejects altered body, invalid, missing, and malformed signatures", () => {
    assert.equal(verifyPaddleSignature(rawBody + " ", header, secret, 1_700_000_000).valid, false);
    assert.equal(verifyPaddleSignature(rawBody, "ts=1700000000;h1=bad", secret, 1_700_000_000).valid, false);
    assert.deepEqual(verifyPaddleSignature(rawBody, null, secret, 1_700_000_000), { valid: false, reason: "MISSING_HEADER" });
    assert.deepEqual(verifyPaddleSignature(rawBody, header, "", 1_700_000_000), { valid: false, reason: "MISSING_SECRET" });
    assert.equal(verifyPaddleSignature(rawBody, "ts=nope;h1=bad", secret, 1_700_000_000).valid, false);
  });
});

describe("G2A idempotency, retry, and newsletter boundaries", () => {
  it("does not process a duplicate receipt and enforces state transitions", () => {
    assert.equal(isDuplicateReceipt({ eventId: "evt_001" }, "evt_001"), true);
    assert.equal(isDuplicateReceipt({ eventId: "evt_001" }, "evt_002"), false);
    assert.equal(canTransition("FULFILLMENT_PENDING", "FULFILLED"), true);
    assert.equal(canTransition("FULFILLED", "FULFILLMENT_PENDING"), false);
  });

  it("classifies provider failures for retry semantics", () => {
    assert.equal(classifyProviderFailure({ provider: "resend", code: "TIMEOUT", status: 504 }), "retryable");
    assert.equal(classifyProviderFailure({ provider: "gcs", code: "BAD_REQUEST", status: 400 }), "permanent");
    assert.equal(classifyProviderFailure({ provider: "mailerlite", code: "RATE_LIMIT", retryable: true }), "retryable");
  });

  it("requires explicit consent for newsletter enrollment", () => {
    assert.deepEqual(validateNewsletterRequest({ email: " Customer@Example.Test ", consent: true }), {
      valid: true,
      request: { email: "customer@example.test", consent: true },
    });
    assert.deepEqual(validateNewsletterRequest({ email: "customer@example.test", consent: false }), {
      valid: false,
      reason: "CONSENT_REQUIRED",
    });
    assert.deepEqual(validateNewsletterRequest({ email: "not-an-email", consent: true }), {
      valid: false,
      reason: "INVALID_EMAIL",
    });
  });
  it("tests newsletter adapter success, existing subscriber, rejection, and timeout", async () => {
    const validInput = { email: "customer@example.test", consent: true };
    const successAdapter = {
      upsertMarketingSubscriber: async () => ({ accepted: true }),
    };
    const existingAdapter = {
      upsertMarketingSubscriber: async () => ({
        accepted: false,
        failure: { provider: "mailerlite" as const, code: "ALREADY_SUBSCRIBED", status: 409 },
      }),
    };
    const rejectionAdapter = {
      upsertMarketingSubscriber: async () => ({
        accepted: false,
        failure: { provider: "mailerlite" as const, code: "VALIDATION", status: 422 },
      }),
    };
    const timeoutAdapter = {
      upsertMarketingSubscriber: async () => ({
        accepted: false,
        failure: { provider: "mailerlite" as const, code: "TIMEOUT", status: 504 },
      }),
    };

    assert.deepEqual(await submitNewsletter(validInput, successAdapter), {
      accepted: true,
      outcome: "SUBSCRIBED",
    });
    assert.deepEqual(await submitNewsletter(validInput, existingAdapter), {
      accepted: false,
      outcome: "PROVIDER_FAILURE",
      reason: "ALREADY_SUBSCRIBED",
    });
    assert.deepEqual(await submitNewsletter(validInput, rejectionAdapter), {
      accepted: false,
      outcome: "PROVIDER_FAILURE",
      reason: "VALIDATION",
    });
    assert.deepEqual(await submitNewsletter(validInput, timeoutAdapter), {
      accepted: false,
      outcome: "RETRYABLE_FAILURE",
      reason: "TIMEOUT",
    });
  });
});
