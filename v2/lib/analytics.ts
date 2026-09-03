"use client";

const GOOGLE_ANALYTICS_ID = "G-LV0HHXVPZT";
const META_PIXEL_ID = "868470356186101";
let analyticsInitialized = false;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  _fbq?: (...args: unknown[]) => void;
};

export function initializeAnalytics() {
  if (analyticsInitialized || typeof window === "undefined") return;
  const analyticsWindow = window as AnalyticsWindow;
  if (document.documentElement.dataset.akaAnalyticsInitialized === "true") {
    analyticsInitialized = true;
    return;
  }
  analyticsInitialized = true;
  document.documentElement.dataset.akaAnalyticsInitialized = "true";

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = analyticsWindow.gtag || ((...args: unknown[]) => analyticsWindow.dataLayer?.push(args));
  analyticsWindow.gtag("js", new Date());
  analyticsWindow.gtag("config", GOOGLE_ANALYTICS_ID);
  if (!document.querySelector(`script[data-aka-analytics="google"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    script.dataset.akaAnalytics = "google";
    document.head.appendChild(script);
  }

  if (!analyticsWindow.fbq) {
    const fbq = (...args: unknown[]) => {
      (fbq as typeof fbq & { queue?: unknown[] }).queue = (fbq as typeof fbq & { queue?: unknown[] }).queue || [];
      (fbq as typeof fbq & { queue?: unknown[] }).queue?.push(args);
    };
    analyticsWindow.fbq = fbq;
    analyticsWindow._fbq = fbq;
  }
  analyticsWindow.fbq("init", META_PIXEL_ID);
  analyticsWindow.fbq("track", "PageView");
  if (!document.querySelector(`script[data-aka-analytics="meta"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.dataset.akaAnalytics = "meta";
    document.head.appendChild(script);
  }
}
