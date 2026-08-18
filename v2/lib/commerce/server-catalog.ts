import { canonicalOffers, catalogProducts } from "./catalog";
import { fulfillmentPolicies } from "./fulfillment";
import type { CommerceModel, FulfillmentPolicy, Offer } from "./types";
import { resolvePaddleEnvironment } from "./paddle-customer";

export { canonicalOffers, catalogProducts };

export const canonicalCommerceModel: CommerceModel = {
  products: catalogProducts,
  offers: canonicalOffers,
  fulfillmentPolicies,
};

export function findOfferByPriceId(
  priceId: string | null,
  model: CommerceModel = canonicalCommerceModel,
  environment = resolvePaddleEnvironment(),
): Offer | null {
  if (!priceId || !environment.valid) return null;
  const mappingKey = environment.name === "production" ? "live" : "sandbox";
  return model.offers.find((offer) => offer.paddle[mappingKey]?.priceId === priceId) ?? null;
}

export function findFulfillmentPolicy(
  offerId: string,
  model: CommerceModel = canonicalCommerceModel,
): FulfillmentPolicy | null {
  return model.fulfillmentPolicies.find((policy) => policy.offerId === offerId) ?? null;
}

export function validateCommerceModel(model: CommerceModel): string[] {
  const errors: string[] = [];
  const productSlugs = new Set<string>();
  const offerIds = new Set<string>();
  const priceIds = new Set<string>();
  const productBySlug = new Set(model.products.map((product) => product.slug));

  for (const product of model.products) {
    if (!product.slug || productSlugs.has(product.slug)) {
      errors.push(`DUPLICATE_OR_EMPTY_PRODUCT:${product.slug}`);
    }
    productSlugs.add(product.slug);
  }

  for (const offer of model.offers) {
    if (!offer.id || offerIds.has(offer.id)) errors.push(`DUPLICATE_OR_EMPTY_OFFER:${offer.id}`);
    if (offer.paddle.live.priceId !== offer.paddlePriceId) {
      errors.push(`LIVE_PRICE_ALIAS_MISMATCH:${offer.id}`);
    }
    if (offer.paddle.live.productId !== offer.paddleProductId) {
      errors.push(`LIVE_PRODUCT_ALIAS_MISMATCH:${offer.id}`);
    }
    if (!productBySlug.has(offer.catalogProductSlug)) {
      errors.push(`UNKNOWN_CATALOG_PRODUCT:${offer.catalogProductSlug}`);
    }

    for (const [environment, mapping] of [["live", offer.paddle.live], ["sandbox", offer.paddle.sandbox]] as const) {
      if (!mapping) continue;
      if (!mapping.priceId || priceIds.has(mapping.priceId)) {
        errors.push(`DUPLICATE_OR_EMPTY_PRICE:${environment}:${mapping.priceId}`);
      }
      if (!mapping.productId) {
        errors.push(`MISSING_PRODUCT_MAPPING:${environment}:${offer.id}`);
      }
      priceIds.add(mapping.priceId);
    }

    if (offer.verification === "verified" && !offer.paddle.live.productId) {
      errors.push(`VERIFIED_OFFER_WITHOUT_PRODUCT:${offer.id}`);
    }
    if (offer.verification === "verified" && offer.availability !== "active") {
      errors.push(`VERIFIED_OFFER_NOT_ACTIVE:${offer.id}`);
    }
    offerIds.add(offer.id);
  }

  const policyIds = new Set<string>();
  for (const policy of model.fulfillmentPolicies) {
    if (!offerIds.has(policy.offerId)) errors.push(`POLICY_WITHOUT_OFFER:${policy.offerId}`);
    if (policyIds.has(policy.offerId)) errors.push(`DUPLICATE_POLICY:${policy.offerId}`);
    policyIds.add(policy.offerId);
  }

  for (const offer of model.offers) {
    if (!policyIds.has(offer.id)) errors.push(`OFFER_WITHOUT_POLICY:${offer.id}`);
  }

  return errors;
}
