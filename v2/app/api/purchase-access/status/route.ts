import { NeonReceiptStore } from "../../../../lib/commerce/receipt-store";
import { readPurchaseAccessStatus } from "../../../../lib/commerce/purchase-access";
import { purchaseAccessOptions, withPurchaseAccessCors } from "../cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS_METHODS = "POST, OPTIONS";

export function OPTIONS(request: Request): Response {
  return purchaseAccessOptions(request, CORS_METHODS);
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return withPurchaseAccessCors(request, Response.json({ error: "INVALID_REQUEST" }, { status: 400 }), CORS_METHODS);
  }

  const sessionId = body && typeof body === "object" && "sessionId" in body && typeof body.sessionId === "string"
    ? body.sessionId.trim()
    : "";
  const browserSecret = body && typeof body === "object" && "browserSecret" in body && typeof body.browserSecret === "string"
    ? body.browserSecret
    : "";
  if (!sessionId || !browserSecret) return withPurchaseAccessCors(request, Response.json({ error: "INVALID_REQUEST" }, { status: 400 }), CORS_METHODS);

  try {
    const result = await readPurchaseAccessStatus(new NeonReceiptStore(), sessionId, browserSecret);
    if (result.status === "UNAUTHORIZED") return withPurchaseAccessCors(request, Response.json({ error: "PURCHASE_ACCESS_UNAUTHORIZED" }, { status: 401 }), CORS_METHODS);
    if (result.status === "EXPIRED") return withPurchaseAccessCors(request, Response.json({ status: "FAILED" }, { status: 410 }), CORS_METHODS);
    return withPurchaseAccessCors(request, Response.json(result, { status: 200 }), CORS_METHODS);
  } catch {
    return withPurchaseAccessCors(request, Response.json({ error: "PURCHASE_ACCESS_UNAVAILABLE" }, { status: 503 }), CORS_METHODS);
  }
}
