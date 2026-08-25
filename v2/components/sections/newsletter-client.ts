export type NewsletterUiStatus =
  | "idle"
  | "submitting"
  | "success"
  | "invalid-email"
  | "consent-required"
  | "provider-failure"
  | "retryable-failure";

type NewsletterFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateNewsletterForm(email: string, consent: boolean): "idle" | "invalid-email" | "consent-required" {
  if (!EMAIL_PATTERN.test(email.trim())) return "invalid-email";
  if (!consent) return "consent-required";
  return "idle";
}

export async function submitNewsletterRequest(
  email: string,
  consent: boolean,
  fetchImpl: NewsletterFetch = fetch,
): Promise<Exclude<NewsletterUiStatus, "idle" | "submitting">> {
  const validation = validateNewsletterForm(email, consent);
  if (validation !== "idle") return validation;

  try {
    const response = await fetchImpl("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        consent: true,
      }),
    });

    if (response.ok) return "success";
    if (response.status === 503) return "retryable-failure";
    if (response.status >= 500) return "provider-failure";
    return "provider-failure";
  } catch {
    return "retryable-failure";
  }
}
