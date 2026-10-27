"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { HALLOWEEN_2026, formatCampaignMoney, halloweenProduct, discountedMinorUnits, isHalloweenSaleActive } from "@/lib/campaigns/halloween-2026";
import { trackHalloween } from "@/lib/campaigns/halloween-analytics";
import styles from "./halloween-campaign.module.css";

const CampaignActive = createContext(false);
export function useHalloweenSale() { return useContext(CampaignActive); }

export function HalloweenCampaignProvider({ initialActive, children }: { initialActive: boolean; children: ReactNode }) {
  const [active, setActive] = useState(initialActive);
  useEffect(() => {
    const refresh = () => setActive(isHalloweenSaleActive());
    const boundary = initialActive ? Date.parse(HALLOWEEN_2026.endsAt) : Date.parse(HALLOWEEN_2026.startsAt);
    const delay = Math.min(Math.max(boundary - Date.now(), 0) + 1, 2_147_483_647);
    const timeout = window.setTimeout(refresh, delay);
    const interval = window.setInterval(refresh, 1000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => { window.clearTimeout(timeout); window.clearInterval(interval); document.removeEventListener("visibilitychange", refresh); window.removeEventListener("focus", refresh); };
  }, [initialActive]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (!isHalloweenSaleActive() || !(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.origin !== window.location.origin) return;
      const product = HALLOWEEN_2026.products.find((item) => anchor.pathname === `/sounds/${item.slug}`);
      if (product) trackHalloween("halloween_product_click", { product_id: product.productId, price_id: product.priceId });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return <CampaignActive.Provider value={active}>{children}</CampaignActive.Provider>;
}

export function HalloweenAnnouncement() {
  const active = useHalloweenSale();
  const tracked = useRef(false);
  useEffect(() => {
    const view = () => { if (active && !tracked.current) tracked.current = trackHalloween("halloween_banner_view"); };
    view();
    window.addEventListener("aka:analytics-ready", view);
    return () => window.removeEventListener("aka:analytics-ready", view);
  }, [active]);
  if (!active) return null;
  return <aside className={styles.announcement} aria-label="Halloween sale" data-halloween-announcement>
    <span>HALLOWEEN SALE — <strong>40% OFF</strong> SELECTED AKA SOUNDS PRODUCTS — ENDS NOV 2</span>
    <Link href="/#sample-packs" onClick={() => trackHalloween("halloween_banner_click", { placement: "announcement" })}>SHOP NOW <span aria-hidden="true">→</span></Link>
  </aside>;
}

export function HalloweenFeaturedPrice() {
  const active = useHalloweenSale();
  return active ? <div className={styles.featuredPrice}><HalloweenPrice priceId={HALLOWEEN_2026.products[1].priceId} normalPrice="$19.99" /></div> : null;
}

export function HalloweenLanding() {
  const active = useHalloweenSale();
  if (!active) return null;
  return <section className={styles.landing} aria-labelledby="halloween-title">
    <div><p className={styles.eyebrow}>AKA SOUNDS / OCT 26 – NOV 2</p><h2 id="halloween-title">HALLOWEEN SALE</h2><p className={styles.tagline}>40% OFF <span>HARD DANCE SOUND DESIGN</span></p><p className={styles.dates}>{HALLOWEEN_2026.landingCopy.dates}</p></div>
    <div className={styles.actions}><Link href="#sample-packs" className={styles.primary} onClick={() => trackHalloween("halloween_banner_click", { placement: "landing" })}>{HALLOWEEN_2026.landingCopy.primaryCta} <span aria-hidden="true">→</span></Link><Link href="#featured-product">{HALLOWEEN_2026.landingCopy.secondaryCta} <span aria-hidden="true">↓</span></Link></div>
  </section>;
}

export function HalloweenPrice({ priceId, normalPrice, referencePrice }: { priceId: string; normalPrice: string; referencePrice?: string }) {
  const active = useHalloweenSale();
  const product = halloweenProduct(priceId);
  if (!active || !product) return <><strong>{normalPrice}</strong>{referencePrice ? <del className="product-v2-reference-price">{referencePrice}</del> : null}</>;
  return <span className={styles.price} aria-label={`Normal price ${formatCampaignMoney(product.amount, product.currency)}, Halloween price ${formatCampaignMoney(discountedMinorUnits(product.amount), product.currency)}, 40 percent off`}><del>{formatCampaignMoney(product.amount, product.currency)}</del><strong>{formatCampaignMoney(discountedMinorUnits(product.amount), product.currency)}</strong><span className={styles.badge}>40% OFF</span></span>;
}
