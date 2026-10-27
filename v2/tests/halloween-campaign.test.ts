import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { HALLOWEEN_2026, campaignPrice, discountedMinorUnits, formatCampaignMoney, halloweenCheckoutDiscount, isHalloweenSaleActive, type HalloweenCampaign } from "../lib/campaigns/halloween-2026";
import { readCampaignAttribution } from "../lib/campaigns/halloween-analytics";

const enabled: HalloweenCampaign = { ...HALLOWEEN_2026, enabled: true };
const during = Date.parse("2026-10-31T12:00:00-05:00");
const hardtechno = HALLOWEEN_2026.products[0].priceId;
const modern = HALLOWEEN_2026.products[1].priceId;

test("campaign defaults off until explicitly enabled for deployment", () => {
  assert.equal(HALLOWEEN_2026.enabled, process.env.NEXT_PUBLIC_AKA_HALLOWEEN_ENABLED === "true");
  assert.equal(isHalloweenSaleActive(during, { ...enabled, enabled: false }), false);
});
test("before campaign", () => assert.equal(isHalloweenSaleActive(Date.parse("2026-10-26T04:59:59.999Z"), enabled), false));
test("Bogota start boundary", () => assert.equal(isHalloweenSaleActive(Date.parse("2026-10-26T05:00:00Z"), enabled), true));
test("during campaign", () => assert.equal(isHalloweenSaleActive(during, enabled), true));
test("entire final Bogota minute remains valid", () => assert.equal(isHalloweenSaleActive(Date.parse("2026-11-03T04:59:59.999Z"), enabled), true));
test("exact expiration at next Bogota midnight", () => assert.equal(isHalloweenSaleActive(Date.parse("2026-11-03T05:00:00Z"), enabled), false));
test("after expiration", () => assert.equal(isHalloweenSaleActive(Date.parse("2026-11-04T00:00:00Z"), enabled), false));
test("invalid dates fail closed", () => assert.equal(isHalloweenSaleActive(NaN, enabled), false));
test("eligible prices match LIVE Paddle rounding", () => {
  assert.equal(campaignPrice(hardtechno, during, enabled)?.saleAmount, 899);
  assert.equal(campaignPrice(modern, during, enabled)?.saleAmount, 1199);
  assert.equal(discountedMinorUnits(1499), 899);
  assert.equal(discountedMinorUnits(1999), 1199);
});
test("freebies are excluded", () => {
  for (const price of ["pri_01m0zn4mt890s0fp4xym0jpj9s", "pri_01kkd2y0pdsxvg234s8zvfshqj", "pri_01knt149kwqhp35wa0hwb4gwqn", "pri_01kn7gspy845ttqp6m8mn4jgkr", "pri_01kmnmnp5fr08h43fsfa2qbcqt", "pri_01kkwnrqgq7xcd5hhpxg99ae6p"]) {
    assert.equal(campaignPrice(price, during, enabled), null);
    assert.deepEqual(halloweenCheckoutDiscount(price, during, enabled), {});
  }
});
test("Club, recurring, hidden and unknown prices fail closed", () => {
  for (const id of ["club_monthly", "club_annual", "pri_01kr2pnf1hve0afyk0mmrkf5ab", "hidden", "unknown", ""]) {
    assert.equal(campaignPrice(id, during, enabled), null);
    assert.deepEqual(halloweenCheckoutDiscount(id, during, enabled), {});
  }
});
test("only two audited one-time paid products are allowed", () => {
  assert.equal(enabled.products.length, 2);
  for (const product of enabled.products) { assert.equal(product.billingCycle, null); assert.equal(product.kind, "paid"); assert.ok(product.amount > 0); }
});
test("Paddle native discount application retains original price IDs", () => {
  assert.deepEqual(halloweenCheckoutDiscount(modern, during, enabled), { discountId: enabled.discountId });
  assert.equal(campaignPrice(modern, during, enabled)?.priceId, modern);
});
test("expired and disabled checkouts have no campaign parameters", () => {
  assert.deepEqual(halloweenCheckoutDiscount(modern, Date.parse(enabled.endsAt), enabled), {});
  assert.deepEqual(halloweenCheckoutDiscount(modern, during, { ...enabled, enabled: false }), {});
});
test("money remains integer and currency formatted", () => {
  assert.equal(formatCampaignMoney(899, "USD"), "$8.99");
  assert.equal(formatCampaignMoney(1199, "USD"), "$11.99");
  assert.throws(() => discountedMinorUnits(-1), RangeError);
  assert.throws(() => discountedMinorUnits(1.2), RangeError);
  assert.throws(() => discountedMinorUnits(100, 101), RangeError);
});
test("all four campaign attribution fields are preserved", () => {
  assert.deepEqual(readCampaignAttribution("?utm_source=newsletter&utm_medium=email&utm_campaign=halloween_2026&utm_content=launch&email=ignored"), { source: "newsletter", medium: "email", campaign: "halloween_2026", content: "launch" });
  assert.deepEqual(readCampaignAttribution(""), {});
});
test("checkout still passes purchase session and backend READY gates campaign purchase tracking", () => {
  const source = readFileSync(new URL("../components/product-detail/product-purchase-button.tsx", import.meta.url), "utf8");
  assert.ok(source.includes("customData: { purchase_session_id: session.sessionId }"));
  assert.equal((source.match(/if \(status\?\.status === "READY"\) \{\s+reportCampaignPurchase\(\)/g) || []).length, 2);
});
