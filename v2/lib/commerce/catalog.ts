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

// Product relations below are verified from Paddle live read-only catalog data.
export const canonicalOffers = [
  {
    id: "offer-hardtechno-essentials-v1",
    catalogProductSlug: "hardtechno-essentials-vol-1",
    paddlePriceId: "pri_01kk855x7wk29gv2d4hgz60k63",
    paddleProductId: "pro_01kk852aee3nqfj046d1ht4wb5",
    historicalPriceIds: ["pri_01kkcjshgdd9p0yqgexv3nrt2f"],
    verification: "verified",
    availability: "active",
  },
  {
    id: "offer-hardtechno-essentials-free-trial",
    catalogProductSlug: "hardtechno-essentials-vol-1-free-trial",
    paddlePriceId: "pri_01kkd2y0pdsxvg234s8zvfshqj",
    paddleProductId: "pro_01kkd2v46gh17agp418540s9b7",
    historicalPriceIds: [],
    verification: "verified",
    availability: "active",
  },
  {
    id: "offer-serum-2-reverse-bass-kick",
    catalogProductSlug: "serum-2-reverse-bass-kick",
    paddlePriceId: "pri_01kkwnrqgq7xcd5hhpxg99ae6p",
    paddleProductId: "pro_01kkwhw131933xnm3c8yhcqrps",
    historicalPriceIds: [],
    verification: "verified",
    availability: "active",
  },
  {
    id: "offer-serum-2-zaag-kick",
    catalogProductSlug: "serum-2-zaag-kick",
    paddlePriceId: "pri_01kmnmnp5fr08h43fsfa2qbcqt",
    paddleProductId: "pro_01kmnmhnth6nz30geqrfrfvj82",
    historicalPriceIds: [],
    verification: "verified",
    availability: "active",
  },
  {
    id: "offer-serum-2-hardtechno-kick",
    catalogProductSlug: "serum-2-hardtechno-kick",
    paddlePriceId: "pri_01kn7gspy845ttqp6m8mn4jgkr",
    paddleProductId: "pro_01kn7gqyc33erxrypv628qak5t",
    historicalPriceIds: [],
    verification: "verified",
    availability: "active",
  },
  {
    id: "offer-serum-2-hard-dance-screeches",
    catalogProductSlug: "serum-2-hard-dance-screeches",
    paddlePriceId: "pri_01knt149kwqhp35wa0hwb4gwqn",
    paddleProductId: "pro_01knt11by8qqzskg701zgd7k2c",
    historicalPriceIds: [],
    verification: "verified",
    availability: "active",
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
