"use client";

import { HALLOWEEN_2026 } from "./halloween-2026";

const attributionKeys = ["source", "medium", "campaign", "content"] as const;
type Attribution = Partial<Record<typeof attributionKeys[number], string>>;
type CampaignEvent = "halloween_banner_view" | "halloween_banner_click" | "halloween_product_click" | "halloween_checkout_start" | "halloween_purchase";
type CampaignWindow = Window & { gtag?: (...args: unknown[]) => void };

export function readCampaignAttribution(search: string): Attribution {
  const params = new URLSearchParams(search);
  return Object.fromEntries(attributionKeys.flatMap((key) => {
    const value = params.get(`utm_${key}`);
    return value ? [[key, value.slice(0, 150)]] : [];
  }));
}

export function trackHalloween(event: CampaignEvent, detail: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || !document.cookie.split("; ").includes("akasounds_cookie_consent=accepted")) return false;
  const gtag = (window as CampaignWindow).gtag;
  if (!gtag) return false;
  let attribution: Attribution = {};
  try {
    attribution = JSON.parse(window.sessionStorage.getItem("aka-campaign-attribution") || "{}");
    const current = readCampaignAttribution(window.location.search);
    if (current.campaign) {
      attribution = current;
      window.sessionStorage.setItem("aka-campaign-attribution", JSON.stringify(attribution));
    }
  } catch { /* Analytics/storage must never block a purchase. */ }
  try { gtag("event", event, { ...attribution, campaign: HALLOWEEN_2026.utmCampaign, ...detail }); return true; } catch { return false; }
}
