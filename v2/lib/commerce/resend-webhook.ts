import { Webhook, WebhookVerificationError } from "svix";
import type {
  ResendDeliveryEventInput,
  ResendDeliveryEventType,
  ResendDeliveryStore,
} from "./providers";

const EVENT_TYPES = new Set<ResendDeliveryEventType>([
  "email.delivered",
  "email.bounced",
  "email.failed",
  "email.delivery_delayed",
]);

type VerificationFailure =
  | "MISSING_SECRET"
  | "MISSING_HEADERS"
  | "INVALID_SECRET"
  | "TIMESTAMP_OUT_OF_RANGE"
  | "INVALID_SIGNATURE";

export interface ResendWebhookDependencies {
  readonly deliveryStore: ResendDeliveryStore;
  readonly secret?: string;
}

function verifySignature(
  rawBody: string,
  headers: Headers,
  secret: string | undefined,
): { valid: true; svixId: string } | { valid: false; reason: VerificationFailure } {
  if (!secret?.trim()) return { valid: false, reason: "MISSING_SECRET" };
  const svixId = headers.get("svix-id")?.trim();
  const timestamp = headers.get("svix-timestamp")?.trim();
  const signatureHeader = headers.get("svix-signature")?.trim();
  if (!svixId || !timestamp || !signatureHeader) return { valid: false, reason: "MISSING_HEADERS" };

  try {
    new Webhook(secret.trim()).verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": timestamp,
      "svix-signature": signatureHeader,
    });
    return { valid: true, svixId };
  } catch (error) {
    if (error instanceof WebhookVerificationError && /timestamp/i.test(error.message)) {
      return { valid: false, reason: "TIMESTAMP_OUT_OF_RANGE" };
    }
    return { valid: false, reason: "INVALID_SIGNATURE" };
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function sanitizedMessage(value: unknown): string | null {
  const message = safeString(value);
  if (!message) return null;
  return message.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").slice(0, 500).trim() || null;
}

function eventInput(payload: Record<string, unknown>, svixId: string): ResendDeliveryEventInput | null {
  const eventType = payload.type;
  if (typeof eventType !== "string" || !EVENT_TYPES.has(eventType as ResendDeliveryEventType)) return null;
  const data = isObject(payload.data) ? payload.data : null;
  const emailId = safeString(data?.email_id);
  const eventCreatedAt = safeString(payload.created_at) ?? safeString(data?.created_at);
  if (!emailId || !eventCreatedAt || Number.isNaN(Date.parse(eventCreatedAt))) return null;

  const bounce = isObject(data?.bounce) ? data.bounce : null;
  const failed = isObject(data?.failed) ? data.failed : null;
  return {
    svixId,
    emailId,
    eventType: eventType as ResendDeliveryEventType,
    eventCreatedAt,
    bounceType: safeString(bounce?.type),
    bounceSubtype: safeString(bounce?.subType) ?? safeString(bounce?.subtype),
    providerMessage: sanitizedMessage(data?.message) ?? sanitizedMessage(bounce?.message) ?? sanitizedMessage(failed?.reason),
  };
}

export async function handleResendWebhook(
  request: Request,
  dependencies: ResendWebhookDependencies,
): Promise<Response> {
  const rawBody = await request.text();
  const verification = verifySignature(
    rawBody,
    request.headers,
    dependencies.secret,
  );
  if (!verification.valid) {
    return Response.json(
      { error: verification.reason === "MISSING_SECRET" ? "WEBHOOK_NOT_CONFIGURED" : "INVALID_WEBHOOK" },
      { status: verification.reason === "MISSING_SECRET" ? 503 : 401 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "INVALID_EVENT_PAYLOAD" }, { status: 400 });
  }
  if (!isObject(payload)) return Response.json({ error: "INVALID_EVENT_PAYLOAD" }, { status: 400 });
  if (typeof payload.type !== "string" || !EVENT_TYPES.has(payload.type as ResendDeliveryEventType)) {
    return Response.json({ status: "IGNORED" }, { status: 200 });
  }

  const input = eventInput(payload, verification.svixId);
  if (!input) return Response.json({ error: "INVALID_EVENT_PAYLOAD" }, { status: 400 });

  try {
    const result = await dependencies.deliveryStore.recordResendDeliveryEvent(input);
    return Response.json({ status: result.inserted ? "RECEIVED" : "DUPLICATE" }, { status: 200 });
  } catch {
    return Response.json({ error: "DELIVERY_EVENT_STORAGE_FAILURE" }, { status: 503 });
  }
}
