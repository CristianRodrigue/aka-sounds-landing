/** Verified against Paddle LIVE on 2026-10-26. Amounts are integer minor units. */
export const HALLOWEEN_2026 = {
  id: "halloween_2026",
  name: "AKA Sounds Halloween Sale 2026",
  enabled: process.env.NEXT_PUBLIC_AKA_HALLOWEEN_ENABLED === "true",
  startsAt: "2026-10-26T00:00:00-05:00",
  endsAt: "2026-11-03T00:00:00-05:00", // Exclusive: includes all of Nov 2, 23:59 Bogota.
  timezone: "America/Bogota",
  discountPercent: 40,
  promoCode: "HALLOWEEN40",
  discountId: "dsc_01m5wr17x05h7qcr131cr25m74",
  utmCampaign: "halloween_2026",
  verifiedAt: "2026-10-26T18:37:15.040Z",
  landingCopy: {
    title: "HALLOWEEN SALE",
    description: "40% OFF HARD DANCE SOUND DESIGN",
    dates: "Oct 26 – Nov 2 · Ends 23:59 America/Bogota",
    primaryCta: "SHOP HALLOWEEN SALE",
    secondaryCta: "EXPLORE AKA SOUNDS",
  },
  products: [
    { slug: "hardtechno-essentials-vol-1", productId: "pro_01kk852aee3nqfj046d1ht4wb5", priceId: "pri_01kk855x7wk29gv2d4hgz60k63", amount: 1499, currency: "USD", billingCycle: null, kind: "paid" },
    { slug: "modern-raw-kick-arsenal-vol-1", productId: "pro_01m0zn4m2yj1b1a6hcec11762f", priceId: "pri_01m0zn4mcma11bnywpvcp2qfk0", amount: 1999, currency: "USD", billingCycle: null, kind: "paid" },
  ],
} as const;

export type HalloweenCampaign = Omit<typeof HALLOWEEN_2026, "enabled"> & { readonly enabled: boolean };

export function isHalloweenSaleActive(now: Date | number = Date.now(), campaign: HalloweenCampaign = HALLOWEEN_2026): boolean {
  const timestamp = Number(now);
  return campaign.enabled && Number.isFinite(timestamp)
    && timestamp >= Date.parse(campaign.startsAt) && timestamp < Date.parse(campaign.endsAt);
}

export function halloweenProduct(priceId: string) {
  return HALLOWEEN_2026.products.find((product) => product.priceId === priceId);
}

export function discountedMinorUnits(amount: number, percent: number = HALLOWEEN_2026.discountPercent): number {
  if (!Number.isSafeInteger(amount) || amount < 0 || !Number.isInteger(percent) || percent < 0 || percent > 100) {
    throw new RangeError("Invalid money amount or percentage");
  }
  // Discount is rounded first, matching the payment provider's currency minor units.
  return amount - Math.round(amount * percent / 100);
}

export function campaignPrice(priceId: string, now: Date | number = Date.now(), campaign: HalloweenCampaign = HALLOWEEN_2026) {
  const product = halloweenProduct(priceId);
  if (!product || !isHalloweenSaleActive(now, campaign)) return null;
  return { ...product, saleAmount: discountedMinorUnits(product.amount, campaign.discountPercent) };
}

export function halloweenCheckoutDiscount(priceId: string, now: Date | number = Date.now(), campaign: HalloweenCampaign = HALLOWEEN_2026) {
  return campaignPrice(priceId, now, campaign) ? { discountId: campaign.discountId } : {};
}

export function formatCampaignMoney(amount: number, currency: string) {
  const digits = new Intl.NumberFormat("en-US", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 10 ** digits);
}
