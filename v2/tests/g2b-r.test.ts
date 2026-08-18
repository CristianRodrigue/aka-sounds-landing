import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Environment } from "@paddle/paddle-node-sdk";
import { createGcsAdapter, SIGNED_URL_TTL_SECONDS } from "../lib/commerce/gcs";
import { processReceiptEvent } from "../lib/commerce/fulfillment-service";
import { createMailerLiteAdapter } from "../lib/commerce/mailerlite";
import { createPaddleCustomerAdapter, resolvePaddleEnvironment } from "../lib/commerce/paddle-customer";
import { normalizeTransactionCompleted } from "../lib/commerce/paddle";
import type {
  GcsAdapter,
  MailerLiteAdapter,
  PaddleCustomerAdapter,
  ProviderValue,
  ReceiptEvent,
  ReceiptStore,
} from "../lib/commerce/providers";
import { InMemoryReceiptStore } from "../lib/commerce/receipt-store";
import { handleV2Webhook } from "../lib/commerce/webhook-handler";
import { canonicalOffers } from "../lib/commerce/server-catalog";

function fixture(eventId = "evt_g2br_fixture_001") {
  return {
    event_id: eventId,
    notification_id: "ntf_g2br_fixture_001",
    occurred_at: "2026-08-17T00:00:00Z",
    event_type: "transaction.completed",
    data: {
      id: "txn_g2br_fixture_001",
      status: "completed",
      customer_id: "ctm_g2br_fixture_001",
      items: [{
        quantity: 1,
        price: {
          id: canonicalOffers[0].paddlePriceId,
          product_id: canonicalOffers[0].paddleProductId,
        },
      }],
    },
  };
}

function receiptEvent(eventId = "evt_g2br_worker_001"): ReceiptEvent {
  return {
    eventId,
    notificationId: "ntf_g2br_worker_001",
    transactionId: "txn_g2br_worker_001",
    customerId: "ctm_g2br_worker_001",
    priceId: canonicalOffers[0].paddlePriceId,
    productId: canonicalOffers[0].paddleProductId,
    quantity: 1,
    itemCount: 1,
    occurredAt: "2026-08-17T00:00:00Z",
  };
}

function acceptedCustomer(marketingConsent: boolean | null = true): PaddleCustomerAdapter {
  return {
    getCustomer: async (customerId) => ({
      accepted: true,
      value: { id: customerId, email: "hydrated@example.test", marketingConsent },
    }),
  };
}

function acceptedGcs(): GcsAdapter {
  return { createSignedDownload: async (): Promise<ProviderValue<string>> => ({ accepted: true, value: "https://storage.example.test/signed" }) };
}

function acceptedResend() {
  return { sendTransactionEmail: async () => ({ accepted: true }) };
}

describe("G2B-R asynchronous ACK and durable recovery", () => {
  it("returns HTTP 200 after durable acceptance without waiting for downstream processing", async () => {
    const store = new InMemoryReceiptStore();
    let release!: () => void;
    const blocked = new Promise<void>((resolve) => { release = resolve; });
    let processingStarted = false;
    let scheduled: (() => Promise<void>) | undefined;

    const response = await handleV2Webhook(new Request("http://v2.test/api/webhook", {
      method: "POST",
      headers: { "paddle-signature": "synthetic" },
      body: JSON.stringify(fixture()),
    }), {
      verify: async () => ({ valid: true, event: {} }),
      receiptStore: store,
      processReceipt: async () => {
        processingStarted = true;
        await blocked;
        return { httpStatus: 200, body: { status: "FULFILLED" } };
      },
      schedule: (task) => {
        scheduled = task;
        void task();
      },
    });

    assert.equal(response.status, 200);
    assert.equal(processingStarted, true);
    assert.deepEqual(await response.json(), {
      status: "RECEIVED",
      event_id: "evt_g2br_fixture_001",
    });
    release();
    await scheduled?.();
  });

  it("returns non-2xx when durable receipt acceptance fails", async () => {
    let writes = 0;
    const store = {
      claimEvent: async () => {
        writes += 1;
        throw new Error("synthetic store outage");
      },
    } as unknown as ReceiptStore;

    const response = await handleV2Webhook(new Request("http://v2.test/api/webhook", {
      method: "POST",
      headers: { "paddle-signature": "synthetic" },
      body: JSON.stringify(fixture()),
    }), {
      verify: async () => ({ valid: true, event: {} }),
      receiptStore: store,
      processReceipt: async () => ({ httpStatus: 200, body: {} }),
    });

    assert.equal(response.status, 503);
    assert.equal(writes, 1);
  });

  it("does not write an invalid-signature request", async () => {
    let writes = 0;
    const store = {
      claimEvent: async () => {
        writes += 1;
        throw new Error("must not be called");
      },
    } as unknown as ReceiptStore;

    const response = await handleV2Webhook(new Request("http://v2.test/api/webhook", {
      method: "POST",
      body: JSON.stringify(fixture()),
    }), {
      verify: async () => ({ valid: false, reason: "INVALID_SIGNATURE" }),
      receiptStore: store,
      processReceipt: async () => ({ httpStatus: 200, body: {} }),
    });

    assert.equal(response.status, 401);
    assert.equal(writes, 0);
  });

  it("prevents duplicate durable events from duplicating fulfillment", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent());
    let gcsCalls = 0;
    const dependencies = {
      receiptStore: store,
      customer: acceptedCustomer(),
      gcs: {
        createSignedDownload: async () => {
          gcsCalls += 1;
          await new Promise((resolve) => setTimeout(resolve, 5));
          return { accepted: true as const, value: "https://storage.example.test/signed" };
        },
      },
      resend: acceptedResend(),
    };

    const results = await Promise.all([
      processReceiptEvent("evt_g2br_worker_001", dependencies),
      processReceiptEvent("evt_g2br_worker_001", dependencies),
    ]);

    assert.equal(results.filter((result) => result.body.status === "FULFILLED").length, 1);
    assert.equal(gcsCalls, 1);
  });

  it("processes a previously stored event independently after customer hydration", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_g2br_recovery_001"));
    let customerCalls = 0;
    const result = await processReceiptEvent("evt_g2br_recovery_001", {
      receiptStore: store,
      customer: {
        getCustomer: async (customerId) => {
          customerCalls += 1;
          return { accepted: true, value: { id: customerId, email: "customer@example.test", marketingConsent: true } };
        },
      },
      gcs: acceptedGcs(),
      resend: acceptedResend(),
      mailerlite: { upsertMarketingSubscriber: async () => ({ accepted: true, outcome: "CREATED_ACTIVE", subscriberStatus: "active" }) },
    });

    assert.equal(result.httpStatus, 200);
    assert.equal(result.body.status, "FULFILLED");
    assert.equal(customerCalls, 1);
    const record = await store.get("evt_g2br_recovery_001");
    assert.equal(record?.customerHydratedAt !== null, true);
    assert.equal(record?.marketingConsentSnapshot, true);
  });

  it("keeps retryable worker failures recoverable", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_g2br_retry_001"));
    let gcsCalls = 0;
    const dependencies = {
      receiptStore: store,
      customer: acceptedCustomer(false),
      gcs: {
        createSignedDownload: async () => {
          gcsCalls += 1;
          if (gcsCalls === 1) return { accepted: false as const, failure: { provider: "gcs" as const, code: "TIMEOUT", status: 504, retryable: true } };
          return { accepted: true as const, value: "https://storage.example.test/signed" };
        },
      },
      resend: acceptedResend(),
    };

    const first = await processReceiptEvent("evt_g2br_retry_001", dependencies);
    assert.equal(first.httpStatus, 503);
    assert.equal((await store.get("evt_g2br_retry_001"))?.state, "RETRYABLE_FAILURE");

    const second = await processReceiptEvent("evt_g2br_retry_001", dependencies);
    assert.equal(second.body.status, "FULFILLED");
    assert.equal((await store.get("evt_g2br_retry_001"))?.attemptCount, 2);
  });
});

describe("G2B-R realistic Paddle and Customer hydration fixtures", () => {
  function withPaddleEnvironment(value: string | undefined, run: () => void | Promise<void>): Promise<void> {
    const previous = process.env.PADDLE_ENVIRONMENT;
    if (value === undefined) delete process.env.PADDLE_ENVIRONMENT;
    else process.env.PADDLE_ENVIRONMENT = value;
    return Promise.resolve().then(run).finally(() => {
      if (previous === undefined) delete process.env.PADDLE_ENVIRONMENT;
      else process.env.PADDLE_ENVIRONMENT = previous;
    });
  }

  it("resolves sandbox to the official sandbox environment", async () => {
    await withPaddleEnvironment("sandbox", async () => {
      let captured: Environment | undefined;
      const adapter = createPaddleCustomerAdapter({
        apiKey: "synthetic-key",
        paddleFactory: (_apiKey, environment) => {
          captured = environment;
          return { get: async (customerId) => ({ id: customerId, email: "customer@example.test" }) };
        },
      });
      assert.equal((await adapter.getCustomer("ctm_sandbox")).accepted, true);
      assert.equal(captured, Environment.sandbox);
    });
  });

  it("resolves production to the official production environment", async () => {
    await withPaddleEnvironment("production", async () => {
      let captured: Environment | undefined;
      const adapter = createPaddleCustomerAdapter({
        apiKey: "synthetic-key",
        paddleFactory: (_apiKey, environment) => {
          captured = environment;
          return { get: async (customerId) => ({ id: customerId, email: "customer@example.test" }) };
        },
      });
      assert.equal((await adapter.getCustomer("ctm_production")).accepted, true);
      assert.equal(captured, Environment.production);
    });
  });

  it("defaults an absent environment to documented production", () => {
    assert.deepEqual(resolvePaddleEnvironment(undefined), {
      valid: true,
      name: "production",
      sdkEnvironment: Environment.production,
    });
  });

  it("rejects an invalid environment without initializing the SDK", async () => {
    await withPaddleEnvironment("staging", async () => {
      let factoryCalls = 0;
      const adapter = createPaddleCustomerAdapter({
        paddleFactory: () => {
          factoryCalls += 1;
          return { get: async () => ({ id: "ctm_invalid", email: "customer@example.test" }) };
        },
      });
      assert.deepEqual(await adapter.getCustomer("ctm_invalid"), {
        accepted: false,
        failure: { provider: "paddle-customer", code: "INVALID_PADDLE_ENVIRONMENT", retryable: false },
      });
      assert.equal(factoryCalls, 0);
    });
  });
  it("does not assume email or marketing consent in transaction.completed", () => {
    const result = normalizeTransactionCompleted(fixture());
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.transaction.customerId, "ctm_g2br_fixture_001");
      assert.equal(result.transaction.customerEmail, null);
      assert.equal(result.transaction.marketingConsent, null);
    }
  });

  it("hydrates a Customer through the official adapter boundary", async () => {
    const adapter = createPaddleCustomerAdapter({
      client: {
        get: async (customerId) => ({
          id: customerId,
          email: "customer@example.test",
          marketingConsent: true,
        }),
      },
    });
    assert.deepEqual(await adapter.getCustomer("ctm_g2br_fixture_001"), {
      accepted: true,
      value: { id: "ctm_g2br_fixture_001", email: "customer@example.test", marketingConsent: true },
    });
  });

  it("classifies Paddle Customer 404 as permanent and 429 as retryable", async () => {
    const notFound = createPaddleCustomerAdapter({
      client: { get: async () => { throw Object.assign(new Error("not found"), { status: 404 }); } },
    });
    const rateLimited = createPaddleCustomerAdapter({
      client: { get: async () => { throw Object.assign(new Error("rate limited"), { status: 429 }); } },
    });
    const missing = await notFound.getCustomer("ctm_missing");
    const retryable = await rateLimited.getCustomer("ctm_rate_limited");
    assert.equal(missing.accepted, false);
    if (!missing.accepted) assert.equal(missing.failure.code, "CUSTOMER_NOT_FOUND");
    assert.equal(retryable.accepted, false);
    if (!retryable.accepted) assert.equal(retryable.failure.retryable, true);
  });
});

describe("G2B-R MailerLite response semantics", () => {
  function adapter(status: number, subscriberStatus: string, capture?: (body: string) => void): MailerLiteAdapter {
    return createMailerLiteAdapter({
      apiKey: "synthetic-key",
      groupId: "synthetic-group",
      fetchImpl: async (_input, init) => {
        capture?.(String(init?.body));
        return new Response(JSON.stringify({ data: { status: subscriberStatus } }), {
          status,
          headers: { "content-type": "application/json" },
        });
      },
    });
  }

  it("distinguishes 201 active from 200 active", async () => {
    assert.deepEqual(await adapter(201, "active").upsertMarketingSubscriber({ email: "customer@example.test", transactionId: "txn" }), {
      accepted: true,
      outcome: "CREATED_ACTIVE",
      subscriberStatus: "active",
    });
    assert.deepEqual(await adapter(200, "active").upsertMarketingSubscriber({ email: "customer@example.test", transactionId: "txn" }), {
      accepted: true,
      outcome: "EXISTING_ACTIVE",
      subscriberStatus: "active",
    });
  });

  it("does not silently reactivate unsubscribed, bounced, or junk subscribers", async () => {
    for (const status of ["unsubscribed", "bounced", "junk"]) {
      const result = await adapter(200, status).upsertMarketingSubscriber({ email: "customer@example.test", transactionId: "txn" });
      assert.equal(result.accepted, false);
      assert.equal(result.outcome, "EXISTING_NONACTIVE");
      assert.equal(result.subscriberStatus, status);
    }
  });

  it("classifies 422, 429, 5xx, and timeout truthfully", async () => {
    const rejected = await adapter(422, "unknown").upsertMarketingSubscriber({ email: "customer@example.test", transactionId: "txn" });
    assert.equal(rejected.accepted, false);
    assert.equal(rejected.outcome, "REJECTED");
    if (!rejected.accepted) assert.equal(rejected.failure?.retryable, false);

    const retryable = await adapter(429, "unknown").upsertMarketingSubscriber({ email: "customer@example.test", transactionId: "txn" });
    assert.equal(retryable.accepted, false);
    assert.equal(retryable.outcome, "RETRYABLE_FAILURE");
    if (!retryable.accepted) assert.equal(retryable.failure?.retryable, true);

    const timeout = createMailerLiteAdapter({
      apiKey: "synthetic-key",
      groupId: "synthetic-group",
      fetchImpl: async () => { throw new Error("timeout"); },
    });
    const timedOut = await timeout.upsertMarketingSubscriber({ email: "customer@example.test", transactionId: "txn" });
    assert.equal(timedOut.accepted, false);
    assert.equal(timedOut.outcome, "RETRYABLE_FAILURE");
  });

  it("does not send resubscribe=true", async () => {
    let body = "";
    await adapter(201, "active", (value) => { body = value; }).upsertMarketingSubscriber({
      email: "customer@example.test",
      transactionId: "txn",
    });
    assert.doesNotMatch(body, /resubscribe/);
  });
});

describe("G2B-R GCS policy", () => {
  it("uses an exact 24-hour V4 signed read URL", async () => {
    assert.equal(SIGNED_URL_TTL_SECONDS, 24 * 60 * 60);
    let expiresAt = 0;
    const result = await createGcsAdapter({
      bucket: () => ({
        file: () => ({
          getSignedUrl: async (options) => {
            expiresAt = options.expires.getTime();
            return ["https://storage.example.test/signed"];
          },
        }),
      }),
    }, "aka-private-bucket").createSignedDownload({
      offerId: "offer",
      productName: "Product",
      emailSubject: "Product",
      storageObject: { kind: "static", objectName: "canonical-object.zip" },
    });
    assert.equal(result.accepted, true);
    assert.ok(Math.abs(expiresAt - (Date.now() + 24 * 60 * 60 * 1000)) < 2_000);
  });
});
