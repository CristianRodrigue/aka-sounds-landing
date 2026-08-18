import { decideConsent } from "./consent";
import { canonicalCommerceModel, findFulfillmentPolicy, findOfferByPriceId } from "./server-catalog";
import { resolvePaddleEnvironment } from "./paddle-customer";
import type { CommerceModel, FulfillmentPolicy, NormalizedTransaction } from "./types";

export type RejectionReason =
  | "NON_COMPLETED_TRANSACTION"
  | "INVALID_PADDLE_ENVIRONMENT"
  | "MISSING_CUSTOMER_EMAIL"
  | "MISSING_ITEM"
  | "MULTIPLE_ITEMS_UNSUPPORTED"
  | "UNKNOWN_PRICE"
  | "UNVERIFIED_PRODUCT_MAPPING"
  | "MISSING_PRODUCT"
  | "PRICE_PRODUCT_MISMATCH"
  | "INACTIVE_OFFER"
  | "INVALID_OFFER"
  | "MISSING_FULFILLMENT_POLICY";

export interface FulfillDecision {
  readonly decision: "FULFILL";
  readonly offerId: string;
  readonly policy: FulfillmentPolicy;
  readonly consent: ReturnType<typeof decideConsent>;
}

export interface RejectDecision {
  readonly decision: "REJECT";
  readonly reason: RejectionReason;
  readonly offerId?: string;
}

export type FulfillmentDecision = FulfillDecision | RejectDecision;

export function decideFulfillment(
  transaction: NormalizedTransaction,
  model: CommerceModel = canonicalCommerceModel,
  environment = resolvePaddleEnvironment(),
): FulfillmentDecision {
  if (transaction.status !== "completed") return { decision: "REJECT", reason: "NON_COMPLETED_TRANSACTION" };
  if (!transaction.customerEmail) return { decision: "REJECT", reason: "MISSING_CUSTOMER_EMAIL" };
  if (transaction.items.length === 0) return { decision: "REJECT", reason: "MISSING_ITEM" };
  if (transaction.items.length !== 1) return { decision: "REJECT", reason: "MULTIPLE_ITEMS_UNSUPPORTED" };
  if (!environment.valid) return { decision: "REJECT", reason: "INVALID_PADDLE_ENVIRONMENT" };

  const item = transaction.items[0];
  const offer = findOfferByPriceId(item.priceId, model, environment);
  if (!offer) return { decision: "REJECT", reason: "UNKNOWN_PRICE" };
  const mapping = environment.name === "production" ? offer.paddle.live : offer.paddle.sandbox;
  if (!mapping || offer.verification !== "verified" || !mapping.productId) {
    return { decision: "REJECT", reason: "UNVERIFIED_PRODUCT_MAPPING", offerId: offer.id };
  }
  if (!item.productId) return { decision: "REJECT", reason: "MISSING_PRODUCT", offerId: offer.id };
  if (item.productId !== mapping.productId) {
    return { decision: "REJECT", reason: "PRICE_PRODUCT_MISMATCH", offerId: offer.id };
  }
  if (offer.availability !== "active") {
    return { decision: "REJECT", reason: "INACTIVE_OFFER", offerId: offer.id };
  }

  const policy = findFulfillmentPolicy(offer.id, model);
  if (!policy) return { decision: "REJECT", reason: "MISSING_FULFILLMENT_POLICY", offerId: offer.id };

  return {
    decision: "FULFILL",
    offerId: offer.id,
    policy,
    consent: decideConsent(transaction.marketingConsent),
  };
}
