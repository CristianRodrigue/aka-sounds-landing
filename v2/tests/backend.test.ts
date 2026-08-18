import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { POST as webhookPost } from "../app/api/webhook/route";
import { createGcsAdapter, SIGNED_URL_TTL_SECONDS, type GcsClient } from "../lib/commerce/gcs";
import { processFulfillmentEvent } from "../lib/commerce/fulfillment-service";
import { createMailerLiteAdapter } from "../lib/commerce/mailerlite";
import { verifyOfficialPaddleWebhook } from "../lib/commerce/paddle-verifier";
import { createResendAdapter } from "../lib/commerce/resend";
import type {
  GcsAdapter,
  MailerLiteAdapter,
  ProviderValue,
  ReceiptEvent,
  ResendAdapter,
} from "../lib/commerce/providers";
import { InMemoryReceiptStore } from "../lib/commerce/receipt-store";
import { handleV2Webhook } from "../lib/commerce/webhook-handler";
import { canonicalCommerceModel, canonicalOffers } from "../lib/commerce/server-catalog";
import type { MarketingConsent, NormalizedTransaction, Offer } from "../lib/commerce/types";
import { submitNewsletter } from "../lib/commerce/newsletter";

function transactionFor(
  offer: Offer = canonicalOffers[0],
  consent: MarketingConsent = null,
  eventId = "evt_g2b_test_001",
): NormalizedTransaction {
  return {
    eventId,
    notificationId: "ntf_g2b_test_001",
    occurredAt: "2026-08-17T00:00:00Z",
    transactionId: "txn_g2b_test_001",
    status: "completed",
    customerId: "ctm_g2b_test_001",
    customerEmail: "customer@example.test",
    marketingConsent: consent,
    items: [{ priceId: offer.paddlePriceId, productId: offer.paddleProductId, quantity: 1 }],
  };
}

function receiptEvent(eventId = "evt_claim_001"): ReceiptEvent {
  return {
    eventId,
    notificationId: "ntf_claim_001",
    transactionId: "txn_claim_001",
    customerId: "ctm_claim_001",
    priceId: null,
    productId: null,
    quantity: 0,
    itemCount: 0,
    occurredAt: "2026-08-17T00:00:00Z",
  };
}

function acceptedGcs(url = "https://storage.example.test/signed"): GcsAdapter {
  return { createSignedDownload: async (): Promise<ProviderValue<string>> => ({ accepted: true, value: url }) };
}

function acceptedResend(): ResendAdapter {
  return { sendTransactionEmail: async () => ({ accepted: true }) };
}

function acceptedMailerLite(): MailerLiteAdapter {
  return { upsertMarketingSubscriber: async () => ({ accepted: true }) };
}

describe("G2B durable ReceiptStore", () => {
  it("claims one owner under concurrent duplicate attempts", async () => {
    const store = new InMemoryReceiptStore();
    const claims = await Promise.all(Array.from({ length: 25 }, () => store.claimEvent(receiptEvent())));
    assert.equal(claims.filter((claim) => claim.owner).length, 1);
    assert.equal(claims.filter((claim) => claim.duplicate).length, 24);
  });

  it("reclaims only a retryable receipt and increments attempts", async () => {
    const store = new InMemoryReceiptStore();
    const input = receiptEvent("evt_retry_001");
    await store.claimEvent(input);
    await store.transition(input.eventId, "VALIDATED");
    await store.transition(input.eventId, "FULFILLMENT_PENDING");
    await store.transition(input.eventId, "RETRYABLE_FAILURE", {
      provider: "resend",
      code: "TIMEOUT",
      status: 504,
      retryable: true,
    });

    const retry = await store.claimEvent(input);
    assert.equal(retry.owner, true);
    assert.equal(retry.record.state, "SIGNATURE_VERIFIED");
    assert.equal(retry.record.attemptCount, 2);

    const duplicate = await store.claimEvent(input);
    assert.equal(duplicate.owner, false);
    assert.equal(duplicate.duplicate, true);
  });

  it("rejects invalid state transitions", async () => {
    const store = new InMemoryReceiptStore();
    const input = receiptEvent("evt_state_001");
    await store.claimEvent(input);
    await assert.rejects(() => store.transition(input.eventId, "FULFILLED"), /INVALID_STATE_TRANSITION/);
  });
});

describe("G2B fulfillment orchestration", () => {
  it("fulfills exact catalog policy and records transactional plus marketing outcomes", async () => {
    const store = new InMemoryReceiptStore();
    let gcsCalls = 0;
    let resendCalls = 0;
    let mailerliteCalls = 0;
    const result = await processFulfillmentEvent(transactionFor(canonicalOffers[0], true), {
      receiptStore: store,
      gcs: { createSignedDownload: async () => { gcsCalls += 1; return { accepted: true, value: "https://storage.example.test/signed" }; } },
      resend: { sendTransactionEmail: async (input) => { resendCalls += 1; assert.equal(input.policy.offerId, canonicalOffers[0].id); return { accepted: true }; } },
      mailerlite: { upsertMarketingSubscriber: async () => { mailerliteCalls += 1; return { accepted: true }; } },
    });

    assert.deepEqual(result.body, { status: "FULFILLED", marketing: "COMPLETED" });
    assert.equal(result.httpStatus, 200);
    assert.equal(gcsCalls, 1);
    assert.equal(resendCalls, 1);
    assert.equal(mailerliteCalls, 1);
    const record = await store.get("evt_g2b_test_001");
    assert.equal(record?.state, "FULFILLED");
    assert.equal(record?.transactionalEmailCompletedAt !== null, true);
    assert.equal(record?.marketingRequested, true);
    assert.equal(record?.marketingCompletedAt !== null, true);
  });

  it("never calls MailerLite without explicit true consent", async () => {
    let mailerliteCalls = 0;
    const store = new InMemoryReceiptStore();
    const result = await processFulfillmentEvent(transactionFor(canonicalOffers[1], null), {
      receiptStore: store,
      gcs: acceptedGcs(),
      resend: acceptedResend(),
      mailerlite: { upsertMarketingSubscriber: async () => { mailerliteCalls += 1; return { accepted: true }; } },
    });
    assert.deepEqual(result.body, { status: "FULFILLED", marketing: "NOT_REQUESTED" });
    assert.equal(mailerliteCalls, 0);
    assert.equal((await store.get("evt_g2b_test_001"))?.marketingRequested, false);
  });

  it("keeps fulfillment successful when MailerLite fails", async () => {
    const store = new InMemoryReceiptStore();
    const result = await processFulfillmentEvent(transactionFor(canonicalOffers[2], true), {
      receiptStore: store,
      gcs: acceptedGcs(),
      resend: acceptedResend(),
      mailerlite: {
        upsertMarketingSubscriber: async () => ({
          accepted: false,
          failure: { provider: "mailerlite", code: "RATE_LIMIT", status: 429, retryable: true },
        }),
      },
    });
    assert.deepEqual(result.body, { status: "FULFILLED", marketing: "RETRYABLE_FAILURE" });
    assert.equal(result.httpStatus, 200);
    const record = await store.get("evt_g2b_test_001");
    assert.equal(record?.state, "FULFILLED");
    assert.equal(record?.lastErrorCode, "RATE_LIMIT");
  });

  it("rejects permanent invalid offers before GCS or Resend", async () => {
    const store = new InMemoryReceiptStore();
    let gcsCalls = 0;
    let resendCalls = 0;
    const result = await processFulfillmentEvent(
      { ...transactionFor(), items: [{ priceId: "pri_unknown", productId: "pro_unknown", quantity: 1 }] },
      {
        receiptStore: store,
        gcs: { createSignedDownload: async () => { gcsCalls += 1; return { accepted: true, value: "never" }; } },
        resend: { sendTransactionEmail: async () => { resendCalls += 1; return { accepted: true }; } },
      },
    );
    assert.deepEqual(result.body, { status: "REJECTED", reason: "UNKNOWN_PRICE" });
    assert.equal(gcsCalls, 0);
    assert.equal(resendCalls, 0);
    assert.equal((await store.get("evt_g2b_test_001"))?.state, "REJECTED");
  });

  it("rejects multiple items instead of selecting item zero", async () => {
    const store = new InMemoryReceiptStore();
    const result = await processFulfillmentEvent(
      { ...transactionFor(), items: [transactionFor().items[0], transactionFor(canonicalOffers[1]).items[0]] },
      { receiptStore: store, gcs: acceptedGcs(), resend: acceptedResend() },
    );
    assert.deepEqual(result.body, { status: "REJECTED", reason: "MULTIPLE_ITEMS_UNSUPPORTED" });
  });

  it("returns 503 for transient fulfillment providers and does not send email after GCS failure", async () => {
    const store = new InMemoryReceiptStore();
    let resendCalls = 0;
    const result = await processFulfillmentEvent(transactionFor(canonicalOffers[3]), {
      receiptStore: store,
      gcs: {
        createSignedDownload: async () => ({
          accepted: false,
          failure: { provider: "gcs", code: "TIMEOUT", status: 504, retryable: true },
        }),
      },
      resend: { sendTransactionEmail: async () => { resendCalls += 1; return { accepted: true }; } },
    });
    assert.equal(result.httpStatus, 503);
    assert.deepEqual(result.body, { status: "PROVIDER_FAILURE", provider: "gcs", code: "TIMEOUT" });
    assert.equal(resendCalls, 0);
    assert.equal((await store.get("evt_g2b_test_001"))?.state, "RETRYABLE_FAILURE");
  });

  it("does not repeat side effects for a completed duplicate", async () => {
    const store = new InMemoryReceiptStore();
    let gcsCalls = 0;
    const dependencies = {
      receiptStore: store,
      gcs: { createSignedDownload: async (): Promise<ProviderValue<string>> => { gcsCalls += 1; return { accepted: true, value: "url" }; } },
      resend: acceptedResend(),
    };
    const first = await processFulfillmentEvent(transactionFor(canonicalOffers[4]), dependencies);
    const second = await processFulfillmentEvent(transactionFor(canonicalOffers[4]), dependencies);
    assert.equal(first.body.status, "FULFILLED");
    assert.deepEqual(second.body, { status: "DUPLICATE_COMPLETED" });
    assert.equal(gcsCalls, 1);
  });
});

describe("G2B GCS signed URL adapter", () => {
  it("requests the exact private object and explicit 15 minute expiry", async () => {
    let requestedBucket = "";
    let requestedObject = "";
    let requestedExpiry = 0;
    const client: GcsClient = {
      bucket: (name) => ({
        file: (objectName) => ({
          getSignedUrl: async (options) => {
            requestedBucket = name;
            requestedObject = objectName;
            requestedExpiry = options.expires.getTime();
            return ["https://storage.example.test/private"];
          },
        }),
      }),
    };
    const policy = canonicalCommerceModel.fulfillmentPolicies[1];
    const result = await createGcsAdapter(client, "aka-private-bucket").createSignedDownload(policy);
    assert.equal(result.accepted, true);
    assert.equal(requestedBucket, "aka-private-bucket");
    assert.equal(requestedObject, "AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL 1.zip");
    assert.ok(requestedExpiry >= Date.now() + (SIGNED_URL_TTL_SECONDS - 2) * 1000);
    assert.ok(requestedExpiry <= Date.now() + (SIGNED_URL_TTL_SECONDS + 2) * 1000);
  });

  it("classifies missing object and signing failure without exposing object data", async () => {
    const missing = createGcsAdapter({
      bucket: () => ({ file: () => ({ getSignedUrl: async () => { throw Object.assign(new Error("missing"), { code: 404 }); } }) }),
    }, "aka-private-bucket");
    const missingResult = await missing.createSignedDownload(canonicalCommerceModel.fulfillmentPolicies[2]);
    assert.deepEqual(missingResult, {
      accepted: false,
      failure: { provider: "gcs", code: "OBJECT_NOT_FOUND", status: 404, retryable: false },
    });

    const failed = createGcsAdapter({
      bucket: () => ({ file: () => ({ getSignedUrl: async () => { throw new Error("signing failed"); } }) }),
    }, "aka-private-bucket");
    const failedResult = await failed.createSignedDownload(canonicalCommerceModel.fulfillmentPolicies[2]);
    assert.equal(failedResult.accepted, false);
    if (!failedResult.accepted) assert.equal(failedResult.failure!.code, "SIGNED_URL_FAILED");
  });
});

describe("G2B Resend and MailerLite adapters", () => {
  it("sends only transactional product identity and uses safe test recipient override", async () => {
    let requestBody: Record<string, unknown> | undefined;
    const adapter = createResendAdapter({
      apiKey: "synthetic-resend-key",
      from: "AKA SOUNDS <test@example.invalid>",
      safeTestMode: true,
      testRecipient: "safe@example.test",
      fetchImpl: async (_input, init) => {
        requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
        return new Response(null, { status: 202 });
      },
    });
    const result = await adapter.sendTransactionEmail({
      email: "customer@example.test",
      transaction: transactionFor(),
      policy: canonicalCommerceModel.fulfillmentPolicies[0],
      downloadUrl: "https://storage.example.test/signed",
    });
    assert.deepEqual(result, { accepted: true });
    const body = requestBody as Record<string, unknown>;
    assert.deepEqual(body.to, ["safe@example.test"]);
    assert.match(String(body.html), /Hardtechno Essentials/);
    assert.match(String(body.html), /storage\.example\.test/);
    assert.doesNotMatch(String(body.html), /marketing|newsletter/i);
  });

  it("classifies Resend success, permanent, transient, and timeout outcomes", async () => {
    const response = async (status: number) => createResendAdapter({
      apiKey: "synthetic-resend-key",
      from: "AKA SOUNDS <test@example.invalid>",
      fetchImpl: async () => new Response(null, { status }),
    }).sendTransactionEmail({
      email: "customer@example.test",
      transaction: transactionFor(),
      policy: canonicalCommerceModel.fulfillmentPolicies[0],
      downloadUrl: "https://storage.example.test/signed",
    });
    assert.deepEqual(await response(202), { accepted: true });
    const permanent = await response(400);
    assert.equal(permanent.accepted, false);
    if (!permanent.accepted) assert.equal(permanent.failure!.retryable, false);
    const transient = await response(503);
    assert.equal(transient.accepted, false);
    if (!transient.accepted) assert.equal(transient.failure!.retryable, true);

    const timeout = await createResendAdapter({
      apiKey: "synthetic-resend-key",
      from: "AKA SOUNDS <test@example.invalid>",
      fetchImpl: async () => { throw new Error("timeout"); },
    }).sendTransactionEmail({
      email: "customer@example.test",
      transaction: transactionFor(),
      policy: canonicalCommerceModel.fulfillmentPolicies[0],
      downloadUrl: "https://storage.example.test/signed",
    });
    assert.equal(timeout.accepted, false);
    if (!timeout.accepted) assert.equal(timeout.failure!.retryable, true);
  });

  it("classifies MailerLite existing subscriber, permanent, and transient outcomes", async () => {
    const call = (status: number, subscriberStatus = "active") => createMailerLiteAdapter({
      apiKey: "synthetic-mailerlite-key",
      groupId: "synthetic-group",
      fetchImpl: async () => new Response(JSON.stringify({ data: { status: subscriberStatus } }), { status, headers: { "content-type": "application/json" } }),
    }).upsertMarketingSubscriber({ email: "customer@example.test", transactionId: "txn" });
    assert.deepEqual(await call(200), { accepted: true, outcome: "EXISTING_ACTIVE", subscriberStatus: "active" });
    const existing = await call(200, "unsubscribed");
    assert.equal(existing.accepted, false);
    assert.equal(existing.outcome, "EXISTING_NONACTIVE");
    if (!existing.accepted) assert.equal(existing.failure!.code, "NON_ACTIVE_SUBSCRIBER");
    const permanent = await call(422);
    assert.equal(permanent.accepted, false);
    if (!permanent.accepted) assert.equal(permanent.failure!.retryable, false);
    const transient = await call(500);
    assert.equal(transient.accepted, false);
    if (!transient.accepted) assert.equal(transient.failure!.retryable, true);
  });

  it("newsletter distinguishes validation, provider failure, and retryable failure", async () => {
    assert.deepEqual(await submitNewsletter({ email: "bad", consent: true }, acceptedMailerLite()), {
      accepted: false,
      outcome: "REJECTED",
      reason: "INVALID_EMAIL",
    });
    assert.deepEqual(await submitNewsletter({ email: "customer@example.test", consent: true }, {
      upsertMarketingSubscriber: async () => ({
        accepted: false,
        failure: { provider: "mailerlite", code: "INVALID", status: 422 },
      }),
    }), {
      accepted: false,
      outcome: "PROVIDER_FAILURE",
      reason: "INVALID",
    });
    assert.deepEqual(await submitNewsletter({ email: "customer@example.test", consent: true }, {
      upsertMarketingSubscriber: async () => ({
        accepted: false,
        failure: { provider: "mailerlite", code: "TIMEOUT", status: 504, retryable: true },
      }),
    }), {
      accepted: false,
      outcome: "RETRYABLE_FAILURE",
      reason: "TIMEOUT",
    });
  });
});

describe("G2B official Paddle verifier and route boundary", () => {
  it("accepts the exact raw body through the official SDK helper", async () => {
    const secret = "synthetic-g2b-secret";
    const rawBody = '{"event_type":"transaction.completed","data":{"id":"txn","items":[],"payments":[]}}';
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = "ts=" + timestamp + ";h1=" + createHmac("sha256", secret).update(timestamp + ":" + rawBody).digest("hex");
    const result = await verifyOfficialPaddleWebhook(rawBody, signature, secret);
    assert.equal(result.valid, true);
  });

  it("rejects body alteration through the official SDK helper", async () => {
    const secret = "synthetic-g2b-secret";
    const rawBody = '{"event_type":"transaction.completed","data":{"id":"txn","items":[],"payments":[]}}';
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = "ts=" + timestamp + ";h1=" + createHmac("sha256", secret).update(timestamp + ":" + rawBody).digest("hex");
    const result = await verifyOfficialPaddleWebhook(rawBody + " ", signature, secret);
    assert.deepEqual(result, { valid: false, reason: "INVALID_SIGNATURE" });
  });

  it("does not parse or process an unsigned request", async () => {
    let processCalls = 0;
    const response = await handleV2Webhook(new Request("http://v2.test/api/webhook", { method: "POST", body: "not-json" }), {
      verify: async () => ({ valid: false, reason: "MISSING_HEADER" }),
      process: async () => { processCalls += 1; return { httpStatus: 200, body: {} }; },
    });
    assert.equal(response.status, 400);
    assert.equal(processCalls, 0);
  });

  it("parses only after verification and normalizes before orchestration", async () => {
    const rawBody = JSON.stringify({
      event_id: "evt_route_001",
      event_type: "transaction.completed",
      data: {
        id: "txn_route_001",
        status: "completed",
        customer: { email: "customer@example.test" },
        items: [{ price: { id: canonicalOffers[0].paddlePriceId, product_id: canonicalOffers[0].paddleProductId }, quantity: 1 }],
      },
    });
    let captured: NormalizedTransaction | null = null;
    const previousSecret = process.env.PADDLE_WEBHOOK_SECRET;
    process.env.PADDLE_WEBHOOK_SECRET = "synthetic-route-secret";
    try {
      const response = await handleV2Webhook(new Request("http://v2.test/api/webhook", {
        method: "POST",
        headers: { "paddle-signature": "synthetic" },
        body: rawBody,
      }), {
        verify: async (body, signature, secret) => {
          assert.equal(body, rawBody);
          assert.equal(signature, "synthetic");
          assert.equal(secret, "synthetic-route-secret");
          return { valid: true, event: {} };
        },
        process: async (transaction) => {
          captured = transaction;
          return { httpStatus: 200, body: { status: "accepted" } };
        },
      });
      assert.equal(response.status, 200);
      const normalized = captured as unknown as NormalizedTransaction;
      assert.equal(normalized.items[0].priceId, canonicalOffers[0].paddlePriceId);
      assert.equal(normalized.items[0].productId, canonicalOffers[0].paddleProductId);
    } finally {
      if (previousSecret === undefined) delete process.env.PADDLE_WEBHOOK_SECRET;
      else process.env.PADDLE_WEBHOOK_SECRET = previousSecret;
    }
  });

  it("ignores valid unsupported events without side effects", async () => {
    const response = await handleV2Webhook(new Request("http://v2.test/api/webhook", {
      method: "POST",
      body: JSON.stringify({ event_type: "product.updated", data: {} }),
    }), {
      verify: async () => ({ valid: true, event: {} }),
      process: async () => ({ httpStatus: 500, body: {} }),
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "IGNORED" });
  });

  it("smoke-tests the actual route with an unsigned request", async () => {
    const previousSecret = process.env.PADDLE_WEBHOOK_SECRET;
    delete process.env.PADDLE_WEBHOOK_SECRET;
    try {
      const response = await webhookPost(new Request("http://v2.test/api/webhook", { method: "POST", body: "{}" }));
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { error: "MISSING_HEADER" });
    } finally {
      if (previousSecret !== undefined) process.env.PADDLE_WEBHOOK_SECRET = previousSecret;
    }
  });
});
describe("Resend safe test mode", () => {
  const input = {
    email: "customer@example.test",
    transaction: transactionFor(),
    policy: canonicalCommerceModel.fulfillmentPolicies[0],
    downloadUrl: "https://storage.example.test/signed",
  };

  it("fails closed without a safe test recipient and never calls Resend", async () => {
    let resendCalls = 0;
    const adapter = createResendAdapter({
      apiKey: "test-api-key",
      from: "test@example.test",
      safeTestMode: true,
      fetchImpl: async () => {
        resendCalls += 1;
        return new Response(null, { status: 202 });
      },
    });

    const result = await adapter.sendTransactionEmail(input);

    assert.deepEqual(result, {
      accepted: false,
      failure: { provider: "resend", code: "SAFE_TEST_RECIPIENT_REQUIRED", retryable: false },
    });
    assert.equal(resendCalls, 0);
  });

  it("uses only the configured safe test recipient", async () => {
    let requestBody: { to?: string[] } | undefined;
    const adapter = createResendAdapter({
      apiKey: "test-api-key",
      from: "test@example.test",
      safeTestMode: true,
      testRecipient: "safe-recipient@example.test",
      fetchImpl: async (_url, init) => {
        requestBody = JSON.parse(String(init?.body)) as { to?: string[] };
        return new Response(null, { status: 202 });
      },
    });

    const result = await adapter.sendTransactionEmail(input);

    assert.equal(result.accepted, true);
    assert.deepEqual(requestBody?.to, ["safe-recipient@example.test"]);
  });

  it("uses the transaction email when safe test mode is disabled", async () => {
    let requestBody: { to?: string[] } | undefined;
    const adapter = createResendAdapter({
      apiKey: "test-api-key",
      from: "test@example.test",
      safeTestMode: false,
      testRecipient: "safe-recipient@example.test",
      fetchImpl: async (_url, init) => {
        requestBody = JSON.parse(String(init?.body)) as { to?: string[] };
        return new Response(null, { status: 202 });
      },
    });

    const result = await adapter.sendTransactionEmail(input);

    assert.equal(result.accepted, true);
    assert.deepEqual(requestBody?.to, ["customer@example.test"]);
  });
});
