import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Webhook } from "svix";
import { processFulfillmentEvent } from "../lib/commerce/fulfillment-service";
import { InMemoryReceiptStore } from "../lib/commerce/receipt-store";
import { createResendAdapter } from "../lib/commerce/resend";
import { handleResendWebhook } from "../lib/commerce/resend-webhook";
import type { NormalizedTransaction } from "../lib/commerce/types";
import { canonicalCommerceModel, canonicalOffers } from "../lib/commerce/server-catalog";

const NOW_SECONDS = Math.floor(Date.now() / 1000);
const SECRET = `whsec_${Buffer.from("resend-webhook-test-secret", "utf8").toString("base64")}`;

function transactionFor(eventId = "evt_resend_test_001"): NormalizedTransaction {
  const offer = canonicalOffers[0];
  return {
    eventId,
    notificationId: "ntf_resend_test_001",
    occurredAt: "2026-08-30T00:00:00.000Z",
    transactionId: `txn_${eventId}`,
    status: "completed",
    customerId: "ctm_resend_test_001",
    customerEmail: "customer@example.test",
    marketingConsent: false,
    items: [{ priceId: offer.paddlePriceId, productId: offer.paddleProductId, quantity: 1 }],
  };
}

function receiptEvent(eventId: string) {
  const transaction = transactionFor(eventId);
  return {
    eventId,
    notificationId: transaction.notificationId,
    transactionId: transaction.transactionId,
    customerId: transaction.customerId,
    priceId: transaction.items[0].priceId,
    productId: transaction.items[0].productId,
    quantity: 1,
    itemCount: 1,
    occurredAt: transaction.occurredAt,
  };
}

function deliveryEvent(
  type: string,
  emailId: string,
  createdAt = "2026-08-30T10:00:00.000Z",
): Record<string, unknown> {
  return {
    type,
    created_at: createdAt,
    data: {
      email_id: emailId,
      ...(type === "email.bounced"
        ? { bounce: { type: "hard", subtype: "content_rejected", message: "provider rejection" } }
        : {}),
    },
  };
}

function signedRequest(
  payload: Record<string, unknown>,
  svixId: string,
  timestamp = NOW_SECONDS,
  secret = SECRET,
): Request {
  const rawBody = JSON.stringify(payload);
  const signature = new Webhook(secret).sign(svixId, new Date(timestamp * 1000), rawBody);
  return new Request("http://v2.test/api/resend/webhook", {
    method: "POST",
    headers: {
      "svix-id": svixId,
      "svix-timestamp": String(timestamp),
      "svix-signature": signature,
      "content-type": "application/json",
    },
    body: rawBody,
  });
}

async function handle(request: Request, store: InMemoryReceiptStore, secret = SECRET): Promise<Response> {
  return handleResendWebhook(request, { deliveryStore: store, secret });
}

describe("G4A Resend email ID persistence", () => {
  it("exposes the provider email ID while preserving accepted semantics", async () => {
    const result = await createResendAdapter({
      apiKey: "synthetic-resend-key",
      from: "AKA SOUNDS <test@example.invalid>",
      fetchImpl: async () => Response.json({ id: "re_g4a_email_001" }, { status: 202 }),
    }).sendTransactionEmail({
      email: "customer@example.test",
      transaction: transactionFor(),
      policy: canonicalCommerceModel.fulfillmentPolicies[0],
      downloadUrl: "https://storage.example.test/signed",
    });

    assert.deepEqual(result, { accepted: true, emailId: "re_g4a_email_001" });
  });

  it("persists the email ID on the receipt that produced the email", async () => {
    const store = new InMemoryReceiptStore();
    const transaction = transactionFor("evt_resend_persist_001");
    const result = await processFulfillmentEvent(transaction, {
      receiptStore: store,
      gcs: { createSignedDownload: async () => ({ accepted: true, value: "https://storage.example.test/signed" }) },
      resend: { sendTransactionEmail: async () => ({ accepted: true, emailId: "re_g4a_email_002" }) },
    });

    assert.equal(result.httpStatus, 200);
    const receipt = await store.get(transaction.eventId);
    assert.equal(receipt?.state, "FULFILLED");
    assert.equal(receipt?.resendEmailId, "re_g4a_email_002");
    assert.equal(receipt?.resendDeliveryStatus, "accepted");
  });
});

describe("G4A Resend webhook verification and state", () => {
  it("accepts a valid delivered event and persists it", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_delivered_001"));
    await store.markTransactionalEmailAccepted("evt_resend_delivered_001", "re_g4a_email_003");

    const response = await handle(
      signedRequest(deliveryEvent("email.delivered", "re_g4a_email_003"), "msg_delivered_001"),
      store,
    );

    assert.equal(response.status, 200);
    assert.equal(store.getResendDeliveryEventCount(), 1);
    const receipt = await store.get("evt_resend_delivered_001");
    assert.equal(receipt?.resendDeliveryStatus, "delivered");
    assert.equal(receipt?.resendLastEventId, "msg_delivered_001");
  });

  it("reconciles a delivered event received before email acceptance", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_event_first_001"));

    const response = await handle(
      signedRequest(deliveryEvent("email.delivered", "re_event_first_001"), "msg_event_first_001"),
      store,
    );

    assert.equal(response.status, 200);
    assert.equal(store.getResendDeliveryEvent("msg_event_first_001")?.receiptEventId, null);

    await store.markTransactionalEmailAccepted("evt_resend_event_first_001", "re_event_first_001");

    const receipt = await store.get("evt_resend_event_first_001");
    assert.equal(receipt?.resendEmailId, "re_event_first_001");
    assert.equal(receipt?.resendDeliveryStatus, "delivered");
    assert.equal(receipt?.resendLastEventId, "msg_event_first_001");
    assert.equal(receipt?.resendLastEventAt, "2026-08-30T10:00:00.000Z");
    assert.equal(store.getResendDeliveryEvent("msg_event_first_001")?.receiptEventId, "evt_resend_event_first_001");
  });

  it("reconciles multiple orphan events and reduces to delivered", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_multi_orphan_001"));

    await handle(
      signedRequest(deliveryEvent("email.delivery_delayed", "re_multi_orphan_001", "2026-08-30T10:00:00Z"), "msg_multi_delayed_001"),
      store,
    );
    await handle(
      signedRequest(deliveryEvent("email.delivered", "re_multi_orphan_001", "2026-08-30T10:01:00Z"), "msg_multi_delivered_001"),
      store,
    );

    await store.markTransactionalEmailAccepted("evt_resend_multi_orphan_001", "re_multi_orphan_001");

    const receipt = await store.get("evt_resend_multi_orphan_001");
    assert.equal(receipt?.resendDeliveryStatus, "delivered");
    assert.equal(receipt?.resendLastEventId, "msg_multi_delivered_001");
    assert.equal(store.getResendDeliveryEvent("msg_multi_delayed_001")?.receiptEventId, "evt_resend_multi_orphan_001");
    assert.equal(store.getResendDeliveryEvent("msg_multi_delivered_001")?.receiptEventId, "evt_resend_multi_orphan_001");
  });

  it("protects a terminal state when a newer delayed event arrives first in transport order", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_terminal_guard_001"));

    await handle(
      signedRequest(deliveryEvent("email.delivered", "re_terminal_guard_001", "2026-08-30T10:00:00Z"), "msg_terminal_delivered_001"),
      store,
    );
    await handle(
      signedRequest(deliveryEvent("email.delivery_delayed", "re_terminal_guard_001", "2026-08-30T10:01:00Z"), "msg_terminal_delayed_001"),
      store,
    );

    await store.markTransactionalEmailAccepted("evt_resend_terminal_guard_001", "re_terminal_guard_001");

    const receipt = await store.get("evt_resend_terminal_guard_001");
    assert.equal(receipt?.resendDeliveryStatus, "delivered");
    assert.equal(receipt?.resendLastEventId, "msg_terminal_delivered_001");
  });

  it("is idempotent for a duplicate svix ID", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_duplicate_001"));
    await store.markTransactionalEmailAccepted("evt_resend_duplicate_001", "re_g4a_email_004");
    const payload = deliveryEvent("email.delivered", "re_g4a_email_004");

    assert.equal((await handle(signedRequest(payload, "msg_duplicate_001"), store)).status, 200);
    assert.equal((await handle(signedRequest(payload, "msg_duplicate_001"), store)).status, 200);
    assert.equal(store.getResendDeliveryEventCount(), 1);
  });

  it("rejects an invalid signature without persisting", async () => {
    const store = new InMemoryReceiptStore();
    const request = signedRequest(deliveryEvent("email.delivered", "re_g4a_email_005"), "msg_invalid_001");
    request.headers.set("svix-signature", "v1,invalid");

    const response = await handle(request, store);

    assert.equal(response.status, 401);
    assert.equal(store.getResendDeliveryEventCount(), 0);
  });

  it("rejects a stale signed event without persisting", async () => {
    const store = new InMemoryReceiptStore();
    const request = signedRequest(
      deliveryEvent("email.delivered", "re_g4a_email_stale_001"),
      "msg_stale_001",
      NOW_SECONDS - 301,
    );

    const response = await handle(request, store);

    assert.equal(response.status, 401);
    assert.equal(store.getResendDeliveryEventCount(), 0);
  });

  it("moves delayed to delivered when delivered is newer", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_order_001"));
    await store.markTransactionalEmailAccepted("evt_resend_order_001", "re_g4a_email_006");

    await handle(signedRequest(deliveryEvent("email.delivery_delayed", "re_g4a_email_006", "2026-08-30T10:00:00Z"), "msg_delayed_001"), store);
    await handle(signedRequest(deliveryEvent("email.delivered", "re_g4a_email_006", "2026-08-30T10:01:00Z"), "msg_delivered_002"), store);

    assert.equal((await store.get("evt_resend_order_001"))?.resendDeliveryStatus, "delivered");
  });

  it("does not downgrade a newer delivered status with an older delayed event", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_order_002"));
    await store.markTransactionalEmailAccepted("evt_resend_order_002", "re_g4a_email_007");

    await handle(signedRequest(deliveryEvent("email.delivered", "re_g4a_email_007", "2026-08-30T10:01:00Z"), "msg_delivered_003"), store);
    await handle(signedRequest(deliveryEvent("email.delivery_delayed", "re_g4a_email_007", "2026-08-30T10:00:00Z"), "msg_delayed_002"), store);

    const receipt = await store.get("evt_resend_order_002");
    assert.equal(receipt?.resendDeliveryStatus, "delivered");
    assert.equal(receipt?.resendLastEventId, "msg_delivered_003");
  });

  it("uses event timestamp ordering for contradictory terminal events", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_order_003"));
    await store.markTransactionalEmailAccepted("evt_resend_order_003", "re_g4a_email_009");

    await handle(signedRequest(deliveryEvent("email.delivered", "re_g4a_email_009", "2026-08-30T10:00:00Z"), "msg_delivered_004"), store);
    await handle(signedRequest(deliveryEvent("email.bounced", "re_g4a_email_009", "2026-08-30T10:01:00Z"), "msg_bounced_002"), store);

    const receipt = await store.get("evt_resend_order_003");
    assert.equal(receipt?.resendDeliveryStatus, "bounced");
    assert.equal(receipt?.resendLastEventId, "msg_bounced_002");
  });

  it("persists an unknown email ID without fabricating receipt mapping", async () => {
    const store = new InMemoryReceiptStore();
    const response = await handle(
      signedRequest(deliveryEvent("email.delivered", "re_g4a_unknown_001"), "msg_unknown_001"),
      store,
    );

    assert.equal(response.status, 200);
    assert.equal(store.getResendDeliveryEventCount(), 1);
    assert.equal(store.getResendDeliveryEvent("msg_unknown_001")?.receiptEventId, null);
  });

  it("never reassigns an event already correlated to another receipt", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_owner_a_001"));
    await store.markTransactionalEmailAccepted("evt_resend_owner_a_001", "re_shared_email_001");
    await handle(
      signedRequest(deliveryEvent("email.delivered", "re_shared_email_001"), "msg_shared_email_001"),
      store,
    );

    await store.claimEvent(receiptEvent("evt_resend_owner_b_001"));
    await store.markTransactionalEmailAccepted("evt_resend_owner_b_001", "re_shared_email_001");

    assert.equal(store.getResendDeliveryEvent("msg_shared_email_001")?.receiptEventId, "evt_resend_owner_a_001");
    assert.equal((await store.get("evt_resend_owner_b_001"))?.resendLastEventId, null);
  });

  it("keeps accepted when no lifecycle event exists", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_accepted_only_001"));

    await store.markTransactionalEmailAccepted("evt_resend_accepted_only_001", "re_accepted_only_001");

    const receipt = await store.get("evt_resend_accepted_only_001");
    assert.equal(receipt?.resendDeliveryStatus, "accepted");
    assert.equal(receipt?.resendLastEventId, null);
    assert.equal(receipt?.resendLastEventAt, null);
  });

  it("records bounced and failed events without a retry or send path", async () => {
    const store = new InMemoryReceiptStore();
    await store.claimEvent(receiptEvent("evt_resend_failure_001"));
    await store.markTransactionalEmailAccepted("evt_resend_failure_001", "re_g4a_email_008");

    assert.equal((await handle(signedRequest(deliveryEvent("email.bounced", "re_g4a_email_008"), "msg_bounced_001"), store)).status, 200);
    assert.equal((await handle(signedRequest(deliveryEvent("email.failed", "re_g4a_email_008", "2026-08-30T10:01:00Z"), "msg_failed_001"), store)).status, 200);
    assert.equal((await store.get("evt_resend_failure_001"))?.resendDeliveryStatus, "failed");
    assert.equal(store.getResendDeliveryEventCount(), 2);
  });

  it("ignores unsupported signed events without side effects", async () => {
    const store = new InMemoryReceiptStore();
    const response = await handle(
      signedRequest({ type: "email.complained", created_at: "2026-08-30T10:00:00Z", data: {} }, "msg_unsupported_001"),
      store,
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "IGNORED" });
    assert.equal(store.getResendDeliveryEventCount(), 0);
  });
});
