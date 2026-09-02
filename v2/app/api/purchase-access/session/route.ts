import { NeonReceiptStore } from "../../../../lib/commerce/receipt-store";
import {
  createPurchaseSessionCredentials,
  purchaseOfferForPrice,
} from "../../../../lib/commerce/purchase-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const priceId = body && typeof body === "object" && "priceId" in body && typeof body.priceId === "string"
    ? body.priceId.trim()
    : "";
  const offer = purchaseOfferForPrice(priceId);
  if (!offer) return Response.json({ error: "INVALID_OFFER" }, { status: 400 });

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
    return Response.json({ error: "SESSION_NOT_CREATED" }, { status: 503 });
  }

  return Response.json({
    sessionId: credentials.sessionId,
    browserSecret: credentials.browserSecret,
    expiresAt: credentials.expiresAt,
  }, { status: 201 });
}
