"use client";

import { useEffect, useRef, useState } from "react";

type PaddleCheckout = { open: (options: { items: Array<{ priceId: string; quantity: number }> }) => void };
type PaddleApi = {
  Initialize: (options: { token: string }) => void;
  Checkout: PaddleCheckout;
};

declare global {
  interface Window {
    Paddle?: PaddleApi;
    __akaPaddleInitialized?: boolean;
  }
}

const PADDLE_CLIENT_TOKEN = "live_84024e2add60d6337f992cc003a";

type ProductPurchaseButtonProps = {
  priceId: string;
  compact?: boolean;
  label?: string;
  variant?: "button" | "text" | "custom";
  buttonClassName?: string;
};

export function ProductPurchaseButton({
  priceId,
  compact = false,
  label = "BUY NOW",
  variant = "button",
  buttonClassName,
}: ProductPurchaseButtonProps) {
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [message, setMessage] = useState("");
  const pendingCheckoutRef = useRef(false);
  const isTextVariant = variant === "text";
  const isCustomVariant = variant === "custom";
  const isLinkLikeVariant = isTextVariant || isCustomVariant;

  useEffect(() => {
    const initialize = () => {
      if (!window.Paddle) return;
      if (!window.__akaPaddleInitialized) {
        window.Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN });
        window.__akaPaddleInitialized = true;
      }
      setCheckoutReady(true);
      if (pendingCheckoutRef.current) {
        pendingCheckoutRef.current = false;
        window.Paddle.Checkout.open({ items: [{ priceId, quantity: 1 }] });
      }
    };

    if (window.Paddle) {
      initialize();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-aka-paddle="true"]');
    if (existing) {
      existing.addEventListener("load", initialize, { once: true });
      return () => existing.removeEventListener("load", initialize);
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.dataset.akaPaddle = "true";
    script.addEventListener("load", initialize, { once: true });
    document.head.appendChild(script);
    return () => script.removeEventListener("load", initialize);
  }, []);

  const openCheckout = () => {
    if (!window.Paddle) {
      pendingCheckoutRef.current = true;
      setMessage("CHECKOUT LOADING");
      return;
    }
    window.Paddle.Checkout.open({ items: [{ priceId, quantity: 1 }] });
  };

  const actionClassName = isTextVariant
    ? "product-v2-text-link product-v2-text-button"
    : isCustomVariant
      ? buttonClassName || "product-v2-text-button"
      : "product-v2-buy-button";
  const actionStyle = isLinkLikeVariant
    ? { padding: 0, border: 0, background: "transparent", cursor: "pointer", textAlign: "left" as const }
    : undefined;

  return (
    <div
      className={`product-v2-purchase${compact ? " is-compact" : ""}${isTextVariant ? " is-text-variant" : ""}`}
      style={isLinkLikeVariant ? { marginTop: 0 } : undefined}
    >
      <button type="button" className={actionClassName} style={actionStyle} onClick={openCheckout}>
        {label} <span aria-hidden="true">→</span>
      </button>
      {message ? (
        <span className="product-v2-checkout-note" aria-live="polite">{message}</span>
      ) : !isLinkLikeVariant ? (
        <span className="product-v2-checkout-note" aria-live="polite">
          {checkoutReady ? "SECURE PADDLE CHECKOUT" : "PADDLE CHECKOUT"}
        </span>
      ) : null}
    </div>
  );
}
