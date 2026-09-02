import { NeonReceiptStore } from "../../../../lib/commerce/receipt-store";
import {
  createPurchaseSessionCredentials,
  purchaseOfferForPrice,
} from "../../../../lib/commerce/purchase-access";
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

  const priceId = body && typeof body === "object" && "priceId" in body && typeof body.priceId === "string"
    ? body.priceId.trim()
    : "";
  const offer = purchaseOfferForPrice(priceId);
  if (!offer) return withPurchaseAccessCors(request, Response.json({ error: "INVALID_OFFER" }, { status: 400 }), CORS_METHODS);

  const credentials = createPurchaseSessionCredentials();
  try {
    await new NeonReceiptStore().createPurchaseAccessSession({
      sessionId: credentials.sessionId,
      browserSecretHash: credentials.browserSecretHash,
      fulfillmentOfferId: offer.offerId,
      priceId: offer.priceId,
      productId: offer.productId,
      createdAt: credentials.createdAt,
      expiresAt: credentials.expiresAt,
    });
  } catch {
    return withPurchaseAccessCors(request, Response.json({ error: "SESSION_NOT_CREATED" }, { status: 503 }), CORS_METHODS);
  }

  return withPurchaseAccessCors(request, Response.json({
    sessionId: credentials.sessionId,
    browserSecret: credentials.browserSecret,
    expiresAt: credentials.expiresAt,
  }, { status: 201 }), CORS_METHODS);
}
