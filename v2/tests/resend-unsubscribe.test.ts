import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Webhook } from "svix";
import { createMailerLiteAdapter } from "../lib/commerce/mailerlite";
import { InMemoryReceiptStore } from "../lib/commerce/receipt-store";
import { handleResendWebhook } from "../lib/commerce/resend-webhook";
import type { ProviderResult } from "../lib/commerce/providers";

const SECRET = `whsec_${Buffer.from("resend-unsubscribe-test-secret", "utf8").toString("base64")}`;

function contactPayload(email: unknown, unsubscribed: boolean): Record<string, unknown> {
  return {
    type: "contact.updated",
    created_at: "2026-09-04T10:00:00.000Z",
    data: { id: "contact_test_001", email, unsubscribed },
  };
}

function signedRequest(
  payload: Record<string, unknown>,
  svixId: string,
  secret = SECRET,
): Request {
  const rawBody = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
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

function adapterFor(result: ProviderResult, calls: string[]): { unsubscribeMarketingSubscriber(email: string): Promise<ProviderResult> } {
  return {
    async unsubscribeMarketingSubscriber(email) {
      calls.push(email);
      return result;
    },
  };
}

function handler(
  mailerlite: { unsubscribeMarketingSubscriber(email: string): Promise<ProviderResult> },
) {
  return (request: Request) => handleResendWebhook(request, {
    deliveryStore: new InMemoryReceiptStore(),
    mailerlite,
    secret: SECRET,
  });
}

describe("Resend contact.updated unsubscribe sync", () => {
  it("syncs a valid signed unsubscribe with a normalized email", async () => {
    const calls: string[] = [];
    const response = await handler(adapterFor({ accepted: true, outcome: "UNSUBSCRIBED", subscriberStatus: "unsubscribed" }, calls))(
      signedRequest(contactPayload(" Person@Example.COM ", true), "msg_contact_unsubscribe_001"),
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "UNSUBSCRIBED" });
    assert.deepEqual(calls, ["person@example.com"]);
  });

  it("does not call MailerLite or reactivate on unsubscribed=false", async () => {
    const calls: string[] = [];
    const response = await handler(adapterFor({ accepted: true, outcome: "UNSUBSCRIBED" }, calls))(
      signedRequest(contactPayload("person@example.com", false), "msg_contact_active_001"),
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "IGNORED" });
    assert.deepEqual(calls, []);
  });

  it("ignores malformed email safely", async () => {
    const calls: string[] = [];
    const response = await handler(adapterFor({ accepted: true, outcome: "UNSUBSCRIBED" }, calls))(
      signedRequest(contactPayload("not-an-email", true), "msg_contact_invalid_email_001"),
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "IGNORED" });
    assert.deepEqual(calls, []);
  });

  it("rejects an invalid Svix signature before MailerLite", async () => {
    const calls: string[] = [];
    const request = signedRequest(contactPayload("person@example.com", true), "msg_contact_invalid_signature_001");
    request.headers.set("svix-signature", "v1,invalid");

    const response = await handler(adapterFor({ accepted: true, outcome: "UNSUBSCRIBED" }, calls))(request);

    assert.equal(response.status, 401);
    assert.deepEqual(calls, []);
  });

  it("is safe for duplicate events because every sync requests unsubscribed", async () => {
    const statuses: string[] = [];
    const mailerlite = {
      async unsubscribeMarketingSubscriber(email: string): Promise<ProviderResult> {
        statuses.push(`${email}:unsubscribed`);
        return { accepted: true, outcome: "UNSUBSCRIBED", subscriberStatus: "unsubscribed" };
      },
    };
    const payload = contactPayload("person@example.com", true);

    const first = await handler(mailerlite)(signedRequest(payload, "msg_contact_duplicate_001"));
    const second = await handler(mailerlite)(signedRequest(payload, "msg_contact_duplicate_001"));

    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    assert.deepEqual(statuses, ["person@example.com:unsubscribed", "person@example.com:unsubscribed"]);
  });

  it("treats an already-unsubscribed MailerLite subscriber as success", async () => {
    let requestBody: Record<string, unknown> | null = null;
    const adapter = createMailerLiteAdapter({
      apiKey: "test-mailerlite-key",
      fetchImpl: async (_input, init) => {
        requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
        return Response.json({ data: { status: "unsubscribed" } }, { status: 200 });
      },
    });

    const result = await adapter.unsubscribeMarketingSubscriber("person@example.com");

    assert.equal(result.accepted, true);
    assert.equal(result.subscriberStatus, "unsubscribed");
    assert.deepEqual(requestBody, { email: "person@example.com", status: "unsubscribed" });
  });

  it("returns retryable failure for MailerLite 429/5xx responses", async () => {
    for (const status of [429, 503]) {
      const provider = createMailerLiteAdapter({
        apiKey: "test-mailerlite-key",
        fetchImpl: async () => Response.json({ error: "temporary" }, { status }),
      });
      const providerResult = await provider.unsubscribeMarketingSubscriber("person@example.com");
      assert.equal(providerResult.accepted, false);
      assert.equal(providerResult.failure?.retryable, true);

      const calls: string[] = [];
      const response = await handler(adapterFor({
        accepted: false,
        outcome: "RETRYABLE_FAILURE",
        failure: { provider: "mailerlite", code: "PROVIDER_RETRYABLE", status, retryable: true },
      }, calls))(signedRequest(contactPayload("person@example.com", true), `msg_contact_retry_${status}`));

      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), { error: "MAILERLITE_SYNC_RETRYABLE" });
      assert.deepEqual(calls, ["person@example.com"]);
    }
  });

  it("does not activate on a permanent MailerLite client failure", async () => {
    const calls: string[] = [];
    const response = await handler(adapterFor({
      accepted: false,
      outcome: "REJECTED",
      failure: { provider: "mailerlite", code: "PROVIDER_REJECTED", status: 422, retryable: false },
    }, calls))(signedRequest(contactPayload("person@example.com", true), "msg_contact_permanent_001"));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "IGNORED" });
    assert.deepEqual(calls, ["person@example.com"]);
  });
});
