import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  authorizePurchaseDownload,
  createDownloadGrantCredentials,
  createPurchaseSessionCredentials,
  hashDownloadGrant,
  purchaseOfferForPrice,
  readPurchaseAccessStatus,
} from "../lib/commerce/purchase-access";
import { InMemoryReceiptStore } from "../lib/commerce/receipt-store";
import { canonicalOffers } from "../lib/commerce/server-catalog";
import { handleV2Webhook } from "../lib/commerce/webhook-handler";
import type { Offer } from "../lib/commerce/types";
import { createResendAdapter } from "../lib/commerce/resend";
import { fulfillmentPolicies } from "../lib/commerce/fulfillment";
import { isPaddleCheckoutCompletedEvent, paddleTransactionId } from "../components/product-detail/paddle-checkout-events";
import { beginC6Flow, canDismissC6, stateAfterDelayCheck, stateAfterPreparingStatus } from "../components/product-detail/c6-state-machine";
import { buildCommerceApiUrl } from "../components/product-detail/commerce-api";
import { purchaseAccessOptions, withPurchaseAccessCors } from "../app/api/purchase-access/cors";

const offer = canonicalOffers[0];

function receiptInput(eventId: string, selectedOffer: Offer = offer) {
  return {
    eventId,
    notificationId: null,
    transactionId: `txn_${eventId}`,
    customerId: null,
    priceId: selectedOffer.paddlePriceId,
    productId: selectedOffer.paddleProductId,
    quantity: 1,
    itemCount: 1,
    occurredAt: "2026-09-01T00:00:00.000Z",
    fulfillmentOfferId: selectedOffer.id,
  };
}

async function createSession(store: InMemoryReceiptStore, now = Date.now(), selectedOffer: Offer = offer) {
  const credentials = createPurchaseSessionCredentials(now);
  await store.createPurchaseAccessSession({
    sessionId: credentials.sessionId,
    browserSecretHash: credentials.browserSecretHash,
    fulfillmentOfferId: selectedOffer.id,
    priceId: selectedOffer.paddlePriceId,
    productId: selectedOffer.paddleProductId!,
    createdAt: credentials.createdAt,
    expiresAt: credentials.expiresAt,
  });
  return credentials;
}

async function claimAndBind(
  store: InMemoryReceiptStore,
  credentials: Awaited<ReturnType<typeof createSession>>,
  eventId: string,
  selectedOffer: Offer = offer,
) {
  const input = receiptInput(eventId, selectedOffer);
  await store.claimEvent(input);
  const bound = await store.bindPurchaseAccessSession({
    sessionId: credentials.sessionId,
    eventId,
    transactionId: input.transactionId,
    fulfillmentOfferId: selectedOffer.id,
    priceId: selectedOffer.paddlePriceId,
    productId: selectedOffer.paddleProductId!,
  });
  assert.equal(bound, true);
  return input;
}

async function fulfill(store: InMemoryReceiptStore, eventId: string) {
  await store.transition(eventId, "VALIDATED");
  await store.transition(eventId, "FULFILLMENT_PENDING");
  await store.transition(eventId, "FULFILLED");
}

describe("C6 local purchase-access simulator", () => {
  it("runs checkout.completed -> server binding -> fulfilled -> READY -> grant validation", async () => {
    const store = new InMemoryReceiptStore();
    const credentials = await createSession(store);
    const input = await claimAndBind(store, credentials, "c6_ready_event");
    await fulfill(store, input.eventId);

    assert.equal(beginC6Flow(), "preparing");
    const status = await readPurchaseAccessStatus(store, credentials.sessionId, credentials.browserSecret);
    assert.equal(status.status, "READY");
    if (status.status !== "READY") return;
    const grant = await authorizePurchaseDownload(store, new URL(status.downloadUrl, "https://v2.test").searchParams.get("grant")!);
    assert.equal(grant.authorized, true);
  });

  it("extracts only the opaque session ID from Paddle custom_data and binds server-side", async () => {
    const store = new InMemoryReceiptStore();
    const credentials = await createSession(store);
    const response = await handleV2Webhook(new Request("https://v2.test/api/webhook", {
      method: "POST",
      body: JSON.stringify({
        event_type: "transaction.completed",
        event_id: "c6_custom_data_event",
        data: {
          id: "c6_custom_data_transaction",
          status: "completed",
          items: [{ price: { id: offer.paddlePriceId, product_id: offer.paddleProductId }, quantity: 1 }],
          custom_data: { purchase_session_id: credentials.sessionId },
        },
      }),
    }), {
      verify: async () => ({ valid: true, event: {} }),
      receiptStore: store,
      bindPurchaseSession: (input) => store.bindPurchaseAccessSession(input),
    });
    assert.equal(response.status, 200);
    const session = await store.getPurchaseAccessSession(credentials.sessionId);
    assert.equal(session?.boundEventId, "c6_custom_data_event");
    assert.equal(session?.boundTransactionId, "c6_custom_data_transaction");
  });

  it("keeps unbound and unfulfilled sessions unable to download", async () => {
    const unboundStore = new InMemoryReceiptStore();
    const unbound = await createSession(unboundStore);
    const unboundStatus = await readPurchaseAccessStatus(unboundStore, unbound.sessionId, unbound.browserSecret);
    assert.deepEqual(unboundStatus, { status: "PENDING" });
    assert.equal((await authorizePurchaseDownload(unboundStore, "transaction-id-alone")).authorized, false);

    const pendingStore = new InMemoryReceiptStore();
    const pending = await createSession(pendingStore);
    const pendingInput = await claimAndBind(pendingStore, pending, "c6_pending_event");
    const pendingStatus = await readPurchaseAccessStatus(pendingStore, pending.sessionId, pending.browserSecret);
    assert.deepEqual(pendingStatus, { status: "PENDING" });
    assert.equal((await authorizePurchaseDownload(pendingStore, pendingInput.transactionId)).authorized, false);
  });

  it("rejects unknown sessions and wrong browser secrets", async () => {
    const store = new InMemoryReceiptStore();
    const credentials = await createSession(store);
    assert.equal((await readPurchaseAccessStatus(store, "unknown-session", credentials.browserSecret)).status, "UNAUTHORIZED");
    assert.equal((await readPurchaseAccessStatus(store, credentials.sessionId, "wrong-secret")).status, "UNAUTHORIZED");
  });

  it("rejects expired sessions and expired grants", async () => {
    const now = Date.now();
    const store = new InMemoryReceiptStore();
    const expired = await createSession(store, now - 31 * 60 * 1000);
    assert.equal((await readPurchaseAccessStatus(store, expired.sessionId, expired.browserSecret, now)).status, "EXPIRED");

    const valid = await createSession(store, now);
    const input = await claimAndBind(store, valid, "c6_expired_grant_event");
    await fulfill(store, input.eventId);
    const grant = createDownloadGrantCredentials(now);
    await store.createDownloadGrant({
      grantHash: hashDownloadGrant(grant.token),
      sessionId: valid.sessionId,
      createdAt: grant.createdAt,
      expiresAt: grant.expiresAt,
    });
    assert.equal((await authorizePurchaseDownload(store, grant.token, now + 5 * 60 * 1000 + 1)).authorized, false);
  });

  it("rejects wrong-product bindings and never reassigns a transaction", async () => {
    const store = new InMemoryReceiptStore();
    const first = await createSession(store);
    const secondOffer = canonicalOffers[1];
    const input = receiptInput("c6_wrong_product_event", secondOffer);
    await store.claimEvent(input);
    assert.equal(await store.bindPurchaseAccessSession({
      sessionId: first.sessionId,
      eventId: input.eventId,
      transactionId: input.transactionId,
      fulfillmentOfferId: secondOffer.id,
      priceId: secondOffer.paddlePriceId,
      productId: secondOffer.paddleProductId!,
    }), false);

    const second = await createSession(store, Date.now(), secondOffer);
    assert.equal(await store.bindPurchaseAccessSession({
      sessionId: second.sessionId,
      eventId: input.eventId,
      transactionId: input.transactionId,
      fulfillmentOfferId: secondOffer.id,
      priceId: secondOffer.paddlePriceId,
      productId: secondOffer.paddleProductId!,
    }), true);
    assert.equal(await store.bindPurchaseAccessSession({
      sessionId: first.sessionId,
      eventId: input.eventId,
      transactionId: input.transactionId,
      fulfillmentOfferId: secondOffer.id,
      priceId: secondOffer.paddlePriceId,
      productId: secondOffer.paddleProductId!,
    }), false);
  });

  it("models timeout, delay retry, repeated checks, and safe dismissal", () => {
    assert.equal(stateAfterPreparingStatus("PENDING", false), "preparing");
    assert.equal(stateAfterPreparingStatus("PENDING", true), "delay");
    assert.equal(stateAfterPreparingStatus("FAILED", false), "delay");
    assert.equal(stateAfterDelayCheck("READY"), "ready");
    assert.equal(stateAfterDelayCheck("PENDING"), "delay");
    assert.equal(canDismissC6("preparing", false), false);
    assert.equal(canDismissC6("preparing", true), true);
    assert.equal(canDismissC6("delay", false), true);
    assert.equal(canDismissC6("ready", false), true);
  });

  it("only resolves grants from the canonical offer and never accepts an arbitrary object", () => {
    assert.ok(purchaseOfferForPrice(offer.paddlePriceId));
    assert.equal(purchaseOfferForPrice("arbitrary-object.zip"), null);
  });

  it("covers every current active Paddle offer through the secure entitlement path", async () => {
    for (const [index, selectedOffer] of canonicalOffers.entries()) {
      assert.equal(selectedOffer.availability, "active");
      assert.ok(selectedOffer.paddleProductId);
      const store = new InMemoryReceiptStore();
      const credentials = await createSession(store, Date.now(), selectedOffer);
      const input = await claimAndBind(store, credentials, `c6_universal_offer_${index}`, selectedOffer);
      await fulfill(store, input.eventId);
      const status = await readPurchaseAccessStatus(store, credentials.sessionId, credentials.browserSecret);
      assert.equal(status.status, "READY", selectedOffer.id);
      if (status.status === "READY") {
        assert.equal(status.productName.length > 0, true);
        assert.equal((await authorizePurchaseDownload(store, new URL(status.downloadUrl, "https://v2.test").searchParams.get("grant")!)).authorized, true);
      }
    }
  });

  it("handles Paddle's checkout.completed payload for zero-dollar checkouts", () => {
    const event = { name: "checkout.completed", data: { transaction_id: "txn_free_checkout" } };
    assert.equal(isPaddleCheckoutCompletedEvent(event), true);
    assert.equal(paddleTransactionId(event), "txn_free_checkout");
    assert.equal(isPaddleCheckoutCompletedEvent({ name: "checkout.closed" }), false);
  });

  it("uses the configured Vercel origin for Hostinger browser calls", () => {
    assert.equal(
      buildCommerceApiUrl("/api/purchase-access/session", "https://aka-sounds-v2-preview.vercel.app"),
      "https://aka-sounds-v2-preview.vercel.app/api/purchase-access/session",
    );
    assert.equal(
      buildCommerceApiUrl("/api/purchase-access/download?grant=opaque", "https://aka-sounds-v2-preview.vercel.app"),
      "https://aka-sounds-v2-preview.vercel.app/api/purchase-access/download?grant=opaque",
    );
  });

  it("allows C6 CORS only from the production frontend origin", () => {
    const allowedRequest = new Request("https://aka-sounds-v2-preview.vercel.app/api/purchase-access/status", {
      headers: { Origin: "https://akasounds.com" },
    });
    const allowedResponse = withPurchaseAccessCors(allowedRequest, new Response("ok"), "POST, OPTIONS");
    assert.equal(allowedResponse.headers.get("Access-Control-Allow-Origin"), "https://akasounds.com");
    assert.equal(allowedResponse.headers.get("Access-Control-Allow-Headers"), "Content-Type");
    assert.equal(purchaseAccessOptions(allowedRequest, "POST, OPTIONS").status, 204);
    const redirectResponse = withPurchaseAccessCors(
      allowedRequest,
      Response.redirect("https://storage.example/pack.zip", 302),
      "GET, OPTIONS",
    );
    assert.equal(redirectResponse.status, 302);
    assert.equal(redirectResponse.headers.get("Location"), "https://storage.example/pack.zip");
    assert.equal(redirectResponse.headers.get("Access-Control-Allow-Origin"), "https://akasounds.com");

    const foreignRequest = new Request("https://aka-sounds-v2-preview.vercel.app/api/purchase-access/status", {
      headers: { Origin: "https://attacker.example" },
    });
    const foreignResponse = withPurchaseAccessCors(foreignRequest, new Response("ok"), "POST, OPTIONS");
    assert.equal(foreignResponse.headers.get("Access-Control-Allow-Origin"), null);
    assert.equal(purchaseAccessOptions(foreignRequest, "POST, OPTIONS").status, 403);
  });

  it("uses the approved official AKA geometric symbol background in transactional email", async () => {
    let html = "";
    const adapter = createResendAdapter({
      apiKey: "test-api-key",
      from: "AKA Sounds <noreply@akasounds.com>",
      fetchImpl: async (_input, init) => {
        const payload = JSON.parse(String(init?.body)) as { html?: string };
        html = payload.html ?? "";
        return new Response(JSON.stringify({ id: "email_test_logo" }), { status: 200, headers: { "Content-Type": "application/json" } });
      },
    });
    const freeOffer = canonicalOffers.find((candidate) => candidate.id === "offer-modern-raw-kick-arsenal-vol-1-free-edition");
    assert.ok(freeOffer);
    const policy = fulfillmentPolicies.find((candidate) => candidate.offerId === freeOffer.id);
    assert.ok(policy);
    const result = await adapter.sendTransactionEmail({
      email: "customer@example.com",
      transaction: {
        eventId: "evt_email_logo",
        notificationId: null,
        occurredAt: null,
        transactionId: "txn_email_logo",
        status: "completed",
        customerId: null,
        customerEmail: "customer@example.com",
        marketingConsent: null,
        items: [{ priceId: freeOffer.paddlePriceId, productId: freeOffer.paddleProductId, quantity: 1 }],
      },
      policy,
      downloadUrl: "https://akasounds.com/api/download/test",
    });
    assert.equal(result.accepted, true);
    assert.match(html, /https:\/\/akasounds\.com\/assets\/aka-logo-symbol-white-official\.png/);
    assert.doesNotMatch(html, /akasounds\.com\/favicon\.png/);
  });
});
