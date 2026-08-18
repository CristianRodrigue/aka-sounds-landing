export type CatalogProductKind = "paid" | "free";
export type OfferVerification = "verified" | "blocked";
export type OfferAvailability = "active" | "inactive" | "unverified";

export interface CatalogProduct {
  readonly slug: string;
  readonly title: string;
  readonly kind: CatalogProductKind;
  readonly source: "legacy-products" | "legacy-free-packs";
}

export interface PaddleCatalogMapping {
  readonly priceId: string;
  readonly productId: string;
}

export interface PaddleEnvironmentMappings {
  readonly live: PaddleCatalogMapping;
  readonly sandbox: PaddleCatalogMapping | null;
}

export interface Offer {
  readonly id: string;
  readonly catalogProductSlug: string;
  readonly paddle: PaddleEnvironmentMappings;
  readonly paddlePriceId: string;
  readonly paddleProductId: string | null;
  readonly historicalPriceIds: readonly string[];
  readonly verification: OfferVerification;
  readonly availability: OfferAvailability;
}

export interface FulfillmentPolicy {
  readonly offerId: string;
  readonly productName: string;
  readonly emailSubject: string;
  readonly storageObject:
    | { readonly kind: "environment"; readonly variable: "GCP_FILE_NAME" }
    | { readonly kind: "static"; readonly objectName: string };
}

export interface CommerceModel {
  readonly products: readonly CatalogProduct[];
  readonly offers: readonly Offer[];
  readonly fulfillmentPolicies: readonly FulfillmentPolicy[];
}

export type MarketingConsent = true | false | null;

export interface NormalizedTransactionItem {
  readonly priceId: string | null;
  readonly productId: string | null;
  readonly quantity: number;
}

export interface NormalizedTransaction {
  readonly eventId: string;
  readonly notificationId: string | null;
  readonly occurredAt: string | null;
  readonly transactionId: string;
  readonly status: string;
  readonly customerId: string | null;
  readonly customerEmail: string | null;
  readonly marketingConsent: MarketingConsent;
  readonly items: readonly NormalizedTransactionItem[];
}
