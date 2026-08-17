import { canonicalOffers, catalogProducts } from "./catalog";
import { fulfillmentPolicies } from "./fulfillment";
import type { CommerceModel, FulfillmentPolicy, Offer } from "./types";

export { canonicalOffers, catalogProducts };

export const canonicalCommerceModel: CommerceModel = {
  products: catalogProducts,
  offers: canonicalOffers,
  fulfillmentPolicies,
};

export function findOfferByPriceId(
  priceId: string | null,
  model: CommerceModel = canonicalCommerceModel,
): Offer | null {
  if (!priceId) return null;
  return model.offers.find((offer) => offer.paddlePriceId === priceId) ?? null;
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
    if (!offer.paddlePriceId || priceIds.has(offer.paddlePriceId)) {
      errors.push(`DUPLICATE_OR_EMPTY_PRICE:${offer.paddlePriceId}`);
    }
    if (!productBySlug.has(offer.catalogProductSlug)) {
      errors.push(`UNKNOWN_CATALOG_PRODUCT:${offer.catalogProductSlug}`);
    }
    if (offer.verification === "verified" && !offer.paddleProductId) {
      errors.push(`VERIFIED_OFFER_WITHOUT_PRODUCT:${offer.id}`);
    }
    if (offer.verification === "verified" && offer.availability !== "active") {
      errors.push(`VERIFIED_OFFER_NOT_ACTIVE:${offer.id}`);
    }
    offerIds.add(offer.id);
    priceIds.add(offer.paddlePriceId);
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
