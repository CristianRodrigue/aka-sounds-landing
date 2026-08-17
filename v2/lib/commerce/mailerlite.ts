import type { MailerLiteAdapter, ProviderResult } from "./providers";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface MailerLiteAdapterOptions {
  readonly fetchImpl?: FetchLike;
  readonly apiKey?: string;
  readonly groupId?: string;
}

function providerFailure(status: number): ProviderResult {
  return {
    accepted: false,
    failure: {
      provider: "mailerlite",
      code: status === 409 ? "ALREADY_SUBSCRIBED" : status >= 500 || status === 408 || status === 429 ? "PROVIDER_RETRYABLE" : "PROVIDER_REJECTED",
      status,
      retryable: status >= 500 || status === 408 || status === 429,
    },
  };
}

export function createMailerLiteAdapter(options: MailerLiteAdapterOptions = {}): MailerLiteAdapter {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiKey = options.apiKey ?? process.env.MAILERLITE_API_KEY;
  const groupId = options.groupId ?? process.env.MAILERLITE_GROUP_ID;

  return {
    async upsertMarketingSubscriber(input): Promise<ProviderResult> {
      if (!apiKey || !groupId) {
        return { accepted: false, failure: { provider: "mailerlite", code: "MAILERLITE_NOT_CONFIGURED", retryable: false } };
      }
      try {
        const response = await fetchImpl("https://connect.mailerlite.com/api/subscribers", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + apiKey,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: input.email, groups: [groupId] }),
        });
        if (response.ok) return { accepted: true };
        return providerFailure(response.status);
      } catch {
        return { accepted: false, failure: { provider: "mailerlite", code: "NETWORK_OR_TIMEOUT", retryable: true } };
      }
    },
  };
}
