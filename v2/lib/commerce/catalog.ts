import type { CatalogProduct, CommerceModel, Offer } from "./types";

export const catalogProducts = [
  {
    slug: "hardtechno-essentials-vol-1",
    title: "Hardtechno Essentials Vol. 1",
    kind: "paid",
    source: "legacy-products",
  },
  {
    slug: "hardtechno-essentials-vol-1-free-trial",
    title: "Hardtechno Essentials Vol. 1 FREE TRIAL",
    kind: "free",
    source: "legacy-products",
  },
  {
    slug: "serum-2-reverse-bass-kick",
    title: "Serum 2 Reverse Bass Kick",
    kind: "free",
    source: "legacy-free-packs",
  },
  {
    slug: "serum-2-zaag-kick",
    title: "Serum 2 Zaag Kick",
    kind: "free",
    source: "legacy-free-packs",
  },
  {
    slug: "serum-2-hardtechno-kick",
    title: "Serum 2 Hardtechno Kick",
    kind: "free",
    source: "legacy-free-packs",
  },
  {
    slug: "serum-2-hard-dance-screeches",
    title: "Serum 2 Hard Dance Screeches",
    kind: "free",
    source: "legacy-free-packs",
  },
] as const satisfies readonly CatalogProduct[];

// Paddle product relations are intentionally null until the production API
// key has product.read. A blocked relation is not an invitation to guess.
export const canonicalOffers = [
  {
    id: "offer-hardtechno-essentials-v1",
    catalogProductSlug: "hardtechno-essentials-vol-1",
    paddlePriceId: "pri_01kk855x7wk29gv2d4hgz60k63",
    paddleProductId: null,
    historicalPriceIds: ["pri_01kkcjshgdd9p0yqgexv3nrt2f"],
    verification: "blocked",
    availability: "unverified",
  },
  {
    id: "offer-hardtechno-essentials-free-trial",
    catalogProductSlug: "hardtechno-essentials-vol-1-free-trial",
    paddlePriceId: "pri_01kkd2y0pdsxvg234s8zvfshqj",
    paddleProductId: null,
    historicalPriceIds: [],
    verification: "blocked",
    availability: "unverified",
  },
  {
    id: "offer-serum-2-reverse-bass-kick",
    catalogProductSlug: "serum-2-reverse-bass-kick",
    paddlePriceId: "pri_01kkwnrqgq7xcd5hhpxg99ae6p",
    paddleProductId: null,
    historicalPriceIds: [],
    verification: "blocked",
    availability: "unverified",
  },
  {
    id: "offer-serum-2-zaag-kick",
    catalogProductSlug: "serum-2-zaag-kick",
    paddlePriceId: "pri_01kmnmnp5fr08h43fsfa2qbcqt",
    paddleProductId: null,
    historicalPriceIds: [],
    verification: "blocked",
    availability: "unverified",
  },
  {
    id: "offer-serum-2-hardtechno-kick",
    catalogProductSlug: "serum-2-hardtechno-kick",
    paddlePriceId: "pri_01kn7gspy845ttqp6m8mn4jgkr",
    paddleProductId: null,
    historicalPriceIds: [],
    verification: "blocked",
    availability: "unverified",
  },
  {
    id: "offer-serum-2-hard-dance-screeches",
    catalogProductSlug: "serum-2-hard-dance-screeches",
    paddlePriceId: "pri_01knt149kwqhp35wa0hwb4gwqn",
    paddleProductId: null,
    historicalPriceIds: [],
    verification: "blocked",
    availability: "unverified",
  },
] as const satisfies readonly Offer[];

export const publicCommerceCatalog = catalogProducts.map((product) => ({
  slug: product.slug,
  title: product.title,
  kind: product.kind,
}));

export function createCommerceModel(
  offers: readonly Offer[] = canonicalOffers,
): CommerceModel {
  return {
    products: catalogProducts,
    offers,
    fulfillmentPolicies: [],
  };
}
