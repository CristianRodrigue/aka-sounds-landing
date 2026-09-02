import { NeonReceiptStore } from "../../../../lib/commerce/receipt-store";
import { readPurchaseAccessStatus } from "../../../../lib/commerce/purchase-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const sessionId = body && typeof body === "object" && "sessionId" in body && typeof body.sessionId === "string"
    ? body.sessionId.trim()
    : "";
  const browserSecret = body && typeof body === "object" && "browserSecret" in body && typeof body.browserSecret === "string"
    ? body.browserSecret
    : "";
  if (!sessionId || !browserSecret) return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });

  try {
    const result = await readPurchaseAccessStatus(new NeonReceiptStore(), sessionId, browserSecret);
    if (result.status === "UNAUTHORIZED") return Response.json({ error: "PURCHASE_ACCESS_UNAUTHORIZED" }, { status: 401 });
    if (result.status === "EXPIRED") return Response.json({ status: "FAILED" }, { status: 410 });
    return Response.json(result, { status: 200 });
  } catch {
    return Response.json({ error: "PURCHASE_ACCESS_UNAVAILABLE" }, { status: 503 });
  }
}
