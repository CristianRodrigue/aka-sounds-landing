"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { C6PurchaseModal, type C6ModalState } from "./c6-purchase-modal";
import { commerceApiUrl } from "./commerce-api";
import {
  isPaddleCheckoutCompletedEvent,
  paddleTransactionId,
  type PaddleCheckoutEvent,
} from "./paddle-checkout-events";

type PaddleCheckout = {
  open: (options: {
    items: Array<{ priceId: string; quantity: number }>;
    customData?: { readonly purchase_session_id: string };
  }) => void;
  close?: () => void;
};

type PaddleApi = {
  Initialize: (options: { token: string; eventCallback: (event: PaddleCheckoutEvent) => void }) => void;
  Checkout: PaddleCheckout;
};

type ActivePaddleCheckout = {
  readonly sessionId: string;
  readonly onCompleted: (event: PaddleCheckoutEvent) => void;
};

type PurchaseSessionResponse = {
  readonly sessionId: string;
  readonly browserSecret: string;
  readonly expiresAt: string;
};

type PurchaseStatusResponse =
  | { readonly status: "PENDING" | "FAILED" }
  | { readonly status: "READY"; readonly productName: string; readonly downloadUrl: string };

declare global {
  interface Window {
    Paddle?: PaddleApi;
    __akaPaddleInitialized?: boolean;
    __akaPaddleActiveCheckout?: ActivePaddleCheckout;
  }
}

const PADDLE_CLIENT_TOKEN = "live_84024e2add60d6337f992cc003a";
const PREPARING_TIMEOUT_MS = 10_000;
const STATUS_POLL_INTERVAL_MS = 1_000;

function dispatchPaddleEvent(event: PaddleCheckoutEvent): void {
  if (!isPaddleCheckoutCompletedEvent(event)) return;
  window.__akaPaddleActiveCheckout?.onCompleted(event);
}

function sessionStorageKey(priceId: string): string {
  return `aka-c6-purchase-session:${priceId}`;
}

function sessionLifecycleStorageKey(priceId: string): string {
  return `${sessionStorageKey(priceId)}:lifecycle`;
}

function readSessionLifecycle(priceId: string): "active" | "completed" | null {
  try {
    const value = window.sessionStorage.getItem(sessionLifecycleStorageKey(priceId));
    return value === "active" || value === "completed" ? value : null;
  } catch {
    return null;
  }
}

function writeSessionLifecycle(priceId: string, lifecycle: "active" | "completed"): void {
  try {
    window.sessionStorage.setItem(sessionLifecycleStorageKey(priceId), lifecycle);
  } catch {
    // In-memory flow state remains sufficient when browser storage is unavailable.
  }
}

function clearStoredSession(priceId: string): void {
  try {
    window.sessionStorage.removeItem(sessionStorageKey(priceId));
    window.sessionStorage.removeItem(sessionLifecycleStorageKey(priceId));
  } catch {
    // Nothing else is required when browser storage is unavailable.
  }
}

function readStoredSession(priceId: string): PurchaseSessionResponse | null {
  try {
    const raw = window.sessionStorage.getItem(sessionStorageKey(priceId));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    if (
      !("sessionId" in value) || typeof value.sessionId !== "string"
      || !("browserSecret" in value) || typeof value.browserSecret !== "string"
      || !("expiresAt" in value) || typeof value.expiresAt !== "string"
      || Date.parse(value.expiresAt) <= Date.now()
    ) return null;
    return value as PurchaseSessionResponse;
  } catch {
    return null;
  }
}

function storeSession(priceId: string, session: PurchaseSessionResponse): void {
  try {
    window.sessionStorage.setItem(sessionStorageKey(priceId), JSON.stringify(session));
  } catch {
    // In-memory sessionRef remains sufficient when browser storage is unavailable.
  }
}

function isCurrentSessionResponse(value: unknown): value is PurchaseSessionResponse {
  return Boolean(
    value && typeof value === "object"
      && "sessionId" in value && typeof value.sessionId === "string"
      && "browserSecret" in value && typeof value.browserSecret === "string"
      && "expiresAt" in value && typeof value.expiresAt === "string",
  );
}

function isStatusResponse(value: unknown): value is PurchaseStatusResponse {
  return Boolean(value && typeof value === "object" && "status" in value && ["PENDING", "READY", "FAILED"].includes(value.status as string));
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

type ProductPurchaseButtonProps = {
  priceId: string;
  productName?: string;
  compact?: boolean;
  label?: string;
  variant?: "button" | "text" | "custom";
  buttonClassName?: string;
};

export function ProductPurchaseButton({
  priceId,
  productName = "YOUR SOUNDS",
  compact = false,
  label = "BUY NOW",
  variant = "button",
  buttonClassName,
}: ProductPurchaseButtonProps) {
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [message, setMessage] = useState("");
  const [modalState, setModalState] = useState<C6ModalState | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [readyProductName, setReadyProductName] = useState(productName);
  const [checking, setChecking] = useState(false);
  const pendingCheckoutRef = useRef(false);
  const sessionRef = useRef<PurchaseSessionResponse | null>(null);
  const flowIdRef = useRef(0);
  const transactionIdRef = useRef<string | null>(null);
  const isTextVariant = variant === "text";
  const isCustomVariant = variant === "custom";
  const isLinkLikeVariant = isTextVariant || isCustomVariant;

  const ensureSession = useCallback(async (): Promise<PurchaseSessionResponse | null> => {
    const stored = sessionRef.current ?? readStoredSession(priceId);
    if (stored && readSessionLifecycle(priceId) === "active" && Date.parse(stored.expiresAt) > Date.now()) {
      sessionRef.current = stored;
      return stored;
    }

    try {
      const response = await fetch(commerceApiUrl("/api/purchase-access/session"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!response.ok) return null;
      const body: unknown = await response.json();
      if (!isCurrentSessionResponse(body)) return null;
      sessionRef.current = body;
      storeSession(priceId, body);
      return body;
    } catch {
      return null;
    }
  }, [priceId]);

  const fetchStatus = useCallback(async (session: PurchaseSessionResponse): Promise<PurchaseStatusResponse | null> => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3_000);
    try {
      const response = await fetch(commerceApiUrl("/api/purchase-access/status"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.sessionId, browserSecret: session.browserSecret }),
        signal: controller.signal,
      });
      const body: unknown = await response.json().catch(() => null);
      return response.ok && isStatusResponse(body) ? body : null;
    } catch {
      return null;
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  const pollUntilSettled = useCallback(async (session: PurchaseSessionResponse, flowId: number) => {
    const deadline = Date.now() + PREPARING_TIMEOUT_MS;
    while (flowIdRef.current === flowId && Date.now() < deadline) {
      const status = await fetchStatus(session);
      if (flowIdRef.current !== flowId) return;
      if (status?.status === "READY") {
        setReadyProductName(status.productName);
        setDownloadUrl(commerceApiUrl(status.downloadUrl));
        setModalState("ready");
        return;
      }
      if (status?.status === "FAILED") {
        setModalState("delay");
        return;
      }
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      await wait(Math.min(STATUS_POLL_INTERVAL_MS, remaining));
    }
    if (flowIdRef.current === flowId) setModalState("delay");
  }, [fetchStatus]);

  const handlePaddleEvent = useCallback((event: PaddleCheckoutEvent) => {
    if (!isPaddleCheckoutCompletedEvent(event)) return;
    const session = sessionRef.current;
    if (!session) return;
    transactionIdRef.current = paddleTransactionId(event);
    if (window.__akaPaddleActiveCheckout?.sessionId === session.sessionId) {
      window.__akaPaddleActiveCheckout = undefined;
    }
    try {
      window.Paddle?.Checkout.close?.();
    } catch {
      // The C6 confirmation flow must still surface if Paddle is already closing.
    }
    writeSessionLifecycle(priceId, "completed");
    const flowId = flowIdRef.current + 1;
    flowIdRef.current = flowId;
    setDownloadUrl(null);
    setReadyProductName(productName);
    setModalState("preparing");
    void pollUntilSettled(session, flowId);
  }, [pollUntilSettled, priceId, productName]);

  const beginCheckout = useCallback(async () => {
    const session = await ensureSession();
    if (!session) {
      setMessage("PURCHASE SESSION UNAVAILABLE");
      return;
    }
    if (!window.Paddle) {
      pendingCheckoutRef.current = true;
      setMessage("CHECKOUT LOADING");
      return;
    }
    setMessage("");
    writeSessionLifecycle(priceId, "active");
    window.__akaPaddleActiveCheckout = {
      sessionId: session.sessionId,
      onCompleted: handlePaddleEvent,
    };
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { purchase_session_id: session.sessionId },
    });
  }, [ensureSession, handlePaddleEvent, priceId]);

  const initializePaddle = useCallback(() => {
    if (!window.Paddle) return;
    if (!window.__akaPaddleInitialized) {
      window.Paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: dispatchPaddleEvent,
      });
      window.__akaPaddleInitialized = true;
    }
    setCheckoutReady(true);
    if (pendingCheckoutRef.current) {
      pendingCheckoutRef.current = false;
      void beginCheckout();
    }
  }, [beginCheckout]);

  useEffect(() => {
    if (window.Paddle) {
      const timer = window.setTimeout(initializePaddle, 0);
      return () => window.clearTimeout(timer);
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-aka-paddle="true"]');
    if (existing) {
      existing.addEventListener("load", initializePaddle, { once: true });
      return () => existing.removeEventListener("load", initializePaddle);
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.dataset.akaPaddle = "true";
    script.addEventListener("load", initializePaddle, { once: true });
    document.head.appendChild(script);
    return () => script.removeEventListener("load", initializePaddle);
  }, [initializePaddle]);

  useEffect(() => () => {
    if (window.__akaPaddleActiveCheckout?.sessionId === sessionRef.current?.sessionId) {
      window.__akaPaddleActiveCheckout = undefined;
    }
  }, []);

  const openCheckout = () => {
    if (!window.Paddle) {
      pendingCheckoutRef.current = true;
      setMessage("CHECKOUT LOADING");
      void beginCheckout();
      return;
    }
    void beginCheckout();
  };

  const checkAgain = useCallback(async () => {
    const session = sessionRef.current;
    if (!session || checking) return;
    setChecking(true);
    try {
      const status = await fetchStatus(session);
      if (status?.status === "READY") {
        setReadyProductName(status.productName);
        setDownloadUrl(commerceApiUrl(status.downloadUrl));
        setModalState("ready");
      }
    } finally {
      setChecking(false);
    }
  }, [checking, fetchStatus]);

  const closeModal = useCallback(() => {
    if (window.__akaPaddleActiveCheckout?.sessionId === sessionRef.current?.sessionId) {
      window.__akaPaddleActiveCheckout = undefined;
    }
    flowIdRef.current += 1;
    sessionRef.current = null;
    transactionIdRef.current = null;
    clearStoredSession(priceId);
    setModalState(null);
    setChecking(false);
  }, [priceId]);

  const actionClassName = isTextVariant
    ? "product-v2-text-link product-v2-text-button"
    : isCustomVariant
      ? buttonClassName || "product-v2-text-button"
      : "product-v2-buy-button";
  const actionStyle = isLinkLikeVariant
    ? { padding: 0, border: 0, background: "transparent", cursor: "pointer", textAlign: "left" as const }
    : undefined;

  return (
    <>
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
      <C6PurchaseModal
        state={modalState}
        productName={readyProductName}
        downloadUrl={downloadUrl}
        checking={checking}
        allowEscape={modalState !== "preparing"}
        onCheckAgain={checkAgain}
        onDone={closeModal}
      />
    </>
  );
}
