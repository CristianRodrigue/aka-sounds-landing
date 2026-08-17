import { normalizeTransactionCompleted } from "./paddle";
import type { FulfillmentServiceResult } from "./fulfillment-service";
import type { OfficialVerificationResult } from "./paddle-verifier";
import type { NormalizedTransaction } from "./types";

export interface WebhookHandlerDependencies {
  readonly verify: (rawBody: string, signature: string | null, secret: string) => Promise<OfficialVerificationResult>;
  readonly process: (transaction: NormalizedTransaction) => Promise<FulfillmentServiceResult>;
}

export async function handleV2Webhook(request: Request, dependencies: WebhookHandlerDependencies): Promise<Response> {
  const rawBody = await request.text();
  const verification = await dependencies.verify(
    rawBody,
    request.headers.get("paddle-signature"),
    process.env.PADDLE_WEBHOOK_SECRET ?? "",
  );
  if (!verification.valid) {
    const status = verification.reason === "MISSING_SECRET" ? 503 : verification.reason === "MISSING_HEADER" ? 400 : 401;
    return Response.json({ error: verification.reason }, { status });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return Response.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const normalized = normalizeTransactionCompleted(payload);
  if (!normalized.ok) {
    if (normalized.reason === "UNSUPPORTED_EVENT") return Response.json({ status: "IGNORED" }, { status: 200 });
    return Response.json({ error: normalized.reason }, { status: 400 });
  }

  const result = await dependencies.process(normalized.transaction);
  return Response.json(result.body, { status: result.httpStatus });
}
