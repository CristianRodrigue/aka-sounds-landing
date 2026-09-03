"use client";

import { useEffect, useState } from "react";
import { initializeAnalytics } from "@/lib/analytics";

const CONSENT_COOKIE = "akasounds_cookie_consent";
const ACCEPTED_VALUE = "accepted";

function hasAcceptedConsent() {
  return document.cookie.split("; ").some((cookie) => cookie === `${CONSENT_COOKIE}=${ACCEPTED_VALUE}`);
}

function persistConsent() {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${CONSENT_COOKIE}=${ACCEPTED_VALUE}; expires=${expires}; path=/; SameSite=Lax`;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hasAcceptedConsent()) {
      initializeAnalytics();
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  const accept = () => {
    persistConsent();
    setVisible(false);
    initializeAnalytics();
  };

  if (!visible) return null;

  return (
    <aside className="aka-cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="aka-cookie-inner">
        <div>
          <p className="aka-cookie-kicker">DATA FOR ANNIHILATION.</p>
          <p className="aka-cookie-copy">We use cookies to keep the site fast, stable, and tuned for the AKA SOUNDS experience.</p>
        </div>
        <button type="button" onClick={accept}>ACCEPT &amp; CONTINUE</button>
      </div>
    </aside>
  );
}
