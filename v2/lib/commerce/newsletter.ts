import type { MailerLiteAdapter } from "./providers";

export interface NewsletterRequest {
  readonly email: string;
  readonly consent: true;
}

export type NewsletterValidation =
  | { readonly valid: true; readonly request: NewsletterRequest }
  | { readonly valid: false; readonly reason: "INVALID_INPUT" | "INVALID_EMAIL" | "CONSENT_REQUIRED" };

export function validateNewsletterRequest(input: unknown): NewsletterValidation {
  if (input === null || typeof input !== "object") return { valid: false, reason: "INVALID_INPUT" };
  const value = input as Record<string, unknown>;
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, reason: "INVALID_EMAIL" };
  if (value.consent !== true) return { valid: false, reason: "CONSENT_REQUIRED" };
  return { valid: true, request: { email, consent: true } };
}

export type NewsletterSubmission =
  | { readonly accepted: true; readonly outcome: "SUBSCRIBED" | "ALREADY_SUBSCRIBED" }
  | { readonly accepted: false; readonly outcome: "REJECTED" | "PROVIDER_FAILURE" | "RETRYABLE_FAILURE"; readonly reason: string };

export async function submitNewsletter(
  input: unknown,
  adapter: NewsletterAdapter,
): Promise<NewsletterSubmission> {
  const validation = validateNewsletterRequest(input);
  if (!validation.valid) {
    return { accepted: false, outcome: "REJECTED", reason: validation.reason };
  }

  const result = await adapter.upsertMarketingSubscriber({
    email: validation.request.email,
    transactionId: "newsletter-request",
  });
  if (result.accepted) return { accepted: true, outcome: "SUBSCRIBED" };

  const failure = result.failure;
  if (failure?.status === 409 || failure?.code === "ALREADY_SUBSCRIBED") {
    return { accepted: true, outcome: "ALREADY_SUBSCRIBED" };
  }
  if (
    failure?.retryable === true ||
    failure?.status === 408 ||
    failure?.status === 429 ||
    (failure?.status !== undefined && failure.status >= 500)
  ) {
    return { accepted: false, outcome: "RETRYABLE_FAILURE", reason: failure.code };
  }
  return { accepted: false, outcome: "PROVIDER_FAILURE", reason: failure?.code ?? "PROVIDER_REJECTED" };
}
export type NewsletterAdapter = MailerLiteAdapter;
