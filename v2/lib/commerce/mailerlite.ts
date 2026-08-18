import type {
  MailerLiteAdapter,
  MailerLiteOutcome,
  MailerLiteSubscriberStatus,
  ProviderResult,
} from "./providers";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface MailerLiteAdapterOptions {
  readonly fetchImpl?: FetchLike;
  readonly apiKey?: string;
  readonly groupId?: string;
}

function providerFailure(
  status: number,
  outcome: MailerLiteOutcome = status === 429 || status >= 500 ? "RETRYABLE_FAILURE" : "REJECTED",
): ProviderResult {
  return {
    accepted: false,
    failure: {
      provider: "mailerlite",
      code: status >= 500 || status === 408 || status === 429 ? "PROVIDER_RETRYABLE" : "PROVIDER_REJECTED",
      status,
      retryable: status >= 500 || status === 408 || status === 429,
    },
    outcome,
  };
}

function subscriberStatus(payload: unknown): MailerLiteSubscriberStatus {
  if (payload === null || typeof payload !== "object") return "unknown";
  const root = payload as Record<string, unknown>;
  const data = root.data !== null && typeof root.data === "object" ? root.data as Record<string, unknown> : root;
  const raw = typeof data.status === "string" ? data.status.toLowerCase() : "";
  if (raw === "active" || raw === "unsubscribed" || raw === "unconfirmed" || raw === "bounced" || raw === "junk") return raw;
  return "unknown";
}

async function readPayload(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function createMailerLiteAdapter(options: MailerLiteAdapterOptions = {}): MailerLiteAdapter {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiKey = options.apiKey ?? process.env.MAILERLITE_API_KEY;
  const groupId = options.groupId ?? process.env.MAILERLITE_GROUP_ID;

  return {
    async upsertMarketingSubscriber(input): Promise<ProviderResult> {
      if (!apiKey || !groupId) {
        return {
          accepted: false,
          outcome: "REJECTED",
          failure: { provider: "mailerlite", code: "MAILERLITE_NOT_CONFIGURED", retryable: false },
        };
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
        const payload = await readPayload(response);
        const status = subscriberStatus(payload);
        if (response.status === 201 && status === "active") {
          return { accepted: true, outcome: "CREATED_ACTIVE", subscriberStatus: status };
        }
        if (response.status === 200 && status === "active") {
          return { accepted: true, outcome: "EXISTING_ACTIVE", subscriberStatus: status };
        }
        if (response.status === 200 && status !== "active") {
          return {
            accepted: false,
            outcome: "EXISTING_NONACTIVE",
            subscriberStatus: status,
            failure: {
              provider: "mailerlite",
              code: "NON_ACTIVE_SUBSCRIBER",
              status: 200,
              retryable: false,
            },
          };
        }
        return providerFailure(response.status);
      } catch {
        return {
          accepted: false,
          outcome: "RETRYABLE_FAILURE",
          failure: { provider: "mailerlite", code: "NETWORK_OR_TIMEOUT", retryable: true },
        };
      }
    },
  };
}
