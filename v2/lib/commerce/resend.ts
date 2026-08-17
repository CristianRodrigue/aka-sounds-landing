import type { NormalizedTransaction, FulfillmentPolicy } from "./types";
import type { ProviderResult, ResendAdapter } from "./providers";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

function escapeHtml(value: string): string {
  const replacements: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  };
  return value.replace(/[&<>'"]/g, (character) => replacements[character] ?? character);
}

function classifyStatus(status: number): ProviderResult {
  return {
    accepted: false,
    failure: {
      provider: "resend",
      code: status >= 500 || status === 408 || status === 429 ? "PROVIDER_RETRYABLE" : "PROVIDER_REJECTED",
      status,
      retryable: status >= 500 || status === 408 || status === 429,
    },
  };
}

export interface ResendAdapterOptions {
  readonly fetchImpl?: FetchLike;
  readonly apiKey?: string;
  readonly from?: string;
  readonly safeTestMode?: boolean;
  readonly testRecipient?: string;
}

export function createResendAdapter(options: ResendAdapterOptions = {}): ResendAdapter {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiKey = options.apiKey ?? process.env.RESEND_API_KEY;
  const from = options.from ?? process.env.RESEND_FROM_EMAIL;
  const safeTestMode = options.safeTestMode ?? process.env.V2_SAFE_TEST_MODE === "true";
  const testRecipient = options.testRecipient ?? process.env.RESEND_TEST_RECIPIENT;

  return {
    async sendTransactionEmail(input: {
      readonly email: string;
      readonly transaction: NormalizedTransaction;
      readonly policy: FulfillmentPolicy;
      readonly downloadUrl: string;
    }): Promise<ProviderResult> {
      if (!apiKey || !from) {
        return { accepted: false, failure: { provider: "resend", code: "RESEND_NOT_CONFIGURED", retryable: false } };
      }
      const recipient = safeTestMode && testRecipient ? testRecipient : input.email;
      try {
        const response = await fetchImpl("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + apiKey,
            "Content-Type": "application/json",
            "Idempotency-Key": "aka-sounds-v2-" + input.transaction.transactionId,
          },
          body: JSON.stringify({
            from,
            to: [recipient],
            subject: input.policy.emailSubject,
            html:
              "<p>Your product: <strong>" +
              escapeHtml(input.policy.productName) +
              "</strong></p><p><a href=\"" +
              escapeHtml(input.downloadUrl) +
              "\">Download your files</a></p>",
          }),
        });
        return response.ok ? { accepted: true } : classifyStatus(response.status);
      } catch {
        return { accepted: false, failure: { provider: "resend", code: "NETWORK_OR_TIMEOUT", retryable: true } };
      }
    },
  };
}
