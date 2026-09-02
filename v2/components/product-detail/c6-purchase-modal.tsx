"use client";

import { createPortal } from "react-dom";
import { useEffect, useSyncExternalStore } from "react";
import styles from "./c6-purchase-modal.module.css";

export type C6ModalState = "preparing" | "ready" | "delay";

type C6PurchaseModalProps = {
  readonly state: C6ModalState | null;
  readonly productName: string;
  readonly downloadUrl: string | null;
  readonly checking: boolean;
  readonly allowEscape: boolean;
  readonly onCheckAgain: () => void;
  readonly onDone: () => void;
};

export function C6PurchaseModal({
  state,
  productName,
  downloadUrl,
  checking,
  allowEscape,
  onCheckAgain,
  onDone,
}: C6PurchaseModalProps) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!state) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [state]);

  useEffect(() => {
    if (!state || !allowEscape) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDone();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [allowEscape, onDone, state]);

  if (!mounted || !state) return null;

  const ready = state === "ready" && downloadUrl;
  const title = state === "ready" ? "YOUR SOUNDS ARE READY" : state === "delay" ? "PAYMENT CONFIRMED" : "PAYMENT CONFIRMED";

  return createPortal(
    <div className={styles.backdrop} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="c6-purchase-title">
        <header className={styles.header}>
          <span className={styles.eyebrow}>06 / PURCHASE COMPLETE</span>
          <span className={styles.status}>{state === "ready" ? "READY" : state === "delay" ? "DELAYED" : "VERIFYING"}</span>
        </header>

        <div className={styles.content}>
          <p className={styles.kicker}>{state === "ready" ? "YOUR SOUNDS ARE READY" : "PAYMENT CONFIRMED"}</p>
          <h2 id="c6-purchase-title" className={styles.title}>{title}</h2>

          {state === "ready" && ready ? (
            <>
              <p className={styles.productName}>{productName}</p>
              <p className={styles.bodyCopy}>Your download is ready.</p>
              <p className={styles.bodyCopy}>A download link has also been sent to your email.</p>
              <p className={styles.supportCopy}>If you don&apos;t see it within a few minutes,<br />check your Spam or Junk folder.</p>
              <div className={styles.actions}>
                <a className="product-v2-buy-button" href={ready} target="_blank" rel="noreferrer">
                  DOWNLOAD YOUR PACK <span aria-hidden="true">→</span>
                </a>
                <button type="button" className={styles.textAction} onClick={onDone}>DONE</button>
              </div>
            </>
          ) : state === "delay" ? (
            <>
              <p className={styles.bodyCopy}>We&apos;re still preparing your download.</p>
              <p className={styles.bodyCopy}>Your purchase was successful.<br />Your download link will also arrive by email.</p>
              <div className={styles.actions}>
                <button type="button" className={styles.textAction} onClick={onCheckAgain} disabled={checking}>
                  {checking ? "CHECKING..." : "CHECK AGAIN"}
                </button>
                <button type="button" className={styles.textAction} onClick={onDone}>DONE</button>
              </div>
            </>
          ) : (
            <>
              <p className={styles.bodyCopy}>Preparing your download...</p>
              <p className={styles.bodyCopy}>Your payment was successful.<br />We&apos;re verifying your download access.</p>
              <div className={styles.loadingTrack} role="status" aria-label="Verifying download access"><span /></div>
            </>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}
