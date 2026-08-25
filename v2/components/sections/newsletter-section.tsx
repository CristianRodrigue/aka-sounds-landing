"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { submitNewsletterRequest, type NewsletterUiStatus } from "./newsletter-client";

const shapeColumns = [0, 156, 312, 468, 624, 720, 876, 1032, 1188, 1344] as const;
const shapeRows = [30, 82, 134, 186, 238, 290, 342, 394, 446, 498] as const;

function NewsletterShapeGrid() {
  return (
    <div className="newsletter-b2-grid shape-grid shape-grid-light" aria-hidden="true">
      {shapeRows.flatMap((top) => shapeColumns.map((left, columnIndex) => (
        <span
          key={String(left) + "-" + String(top)}
          style={{
            left: ((left / 1440) * 100) + "%",
            top: ((top / 550) * 100) + "%",
            transform: "rotate(" + (((columnIndex + shapeRows.indexOf(top)) % 2) ? 180 : 0) + "deg)",
          }}
        />
      )))}
    </div>
  );
}

const statusMessage: Record<NewsletterUiStatus, string> = {
  idle: "",
  submitting: "SIGNING UP…",
  success: "YOU’RE IN.",
  "invalid-email": "ENTER A VALID EMAIL.",
  "consent-required": "CONSENT IS REQUIRED.",
  "provider-failure": "SIGNUP FAILED. TRY AGAIN.",
  "retryable-failure": "SIGNUP FAILED. TRY AGAIN.",
};

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<NewsletterUiStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    const result = await submitNewsletterRequest(email, consent);
    setStatus(result);
  };

  const resetStatus = () => {
    if (status !== "idle" && status !== "submitting") setStatus("idle");
  };

  return (
    <section className="newsletter-b2-section section-light" id="newsletter">
      <NewsletterShapeGrid />
      <svg className="newsletter-b2-signal-lines" viewBox="0 0 1440 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M72 92H560M72 112H414M846 92H1368M934 112H1368" />
        <path d="M72 334H472M968 334H1368" />
        <path d="M612 70V376M828 70V376" />
      </svg>
      <div className="newsletter-b2-heading-mask" aria-hidden="true" />
      <div className="newsletter-b2-form-mask" aria-hidden="true" />

      <div className="newsletter-b2-layout">
        <div className="newsletter-b2-copy" data-motion-reveal data-motion-delay="0">
          <p className="newsletter-b2-index">06 / NEWSLETTER</p>
          <h2>JOIN THE SIGNAL</h2>
          <p className="newsletter-b2-statement">Occasional notes from AKA SOUNDS.</p>
        </div>

        <form
          className="newsletter-b2-form"
          data-motion-reveal
          data-motion-delay="120"
          aria-label="Newsletter signup"
          noValidate
          onSubmit={handleSubmit}
        >
          <label htmlFor="newsletter-email">EMAIL ADDRESS</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="YOUR EMAIL"
            value={email}
            aria-describedby="newsletter-status newsletter-consent"
            aria-invalid={status === "invalid-email"}
            onChange={(event) => {
              setEmail(event.target.value);
              resetStatus();
            }}
          />
          <div className="newsletter-b2-consent">
            <input
              id="newsletter-consent"
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                resetStatus();
              }}
            />
            <label htmlFor="newsletter-consent">I agree to receive occasional emails from AKA SOUNDS.</label>
          </div>
          <button className="motion-cta" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "SIGNING UP" : "SIGN UP"} <span className="motion-cta-arrow">→</span>
          </button>
          <p id="newsletter-status" className={`newsletter-b2-status newsletter-b2-status-${status}`} aria-live="polite" role="status">
            {statusMessage[status]}
          </p>
        </form>
      </div>
    </section>
  );
}
