import { Paddle } from "@paddle/paddle-node-sdk";
import type { PaddleCustomer, PaddleCustomerAdapter, ProviderValue } from "./providers";

interface CustomerResource {
  readonly id: string;
  readonly email: string;
  readonly marketingConsent?: boolean | null;
}

export interface PaddleCustomerClient {
  get(customerId: string): Promise<CustomerResource>;
}

export interface PaddleCustomerAdapterOptions {
  readonly apiKey?: string;
  readonly client?: PaddleCustomerClient;
}

function statusFromError(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const value = error as { status?: unknown; statusCode?: unknown; code?: unknown };
  const raw = value.status ?? value.statusCode ?? value.code;
  if (typeof raw === "number") return raw;
  return typeof raw === "string" && /^\d+$/.test(raw) ? Number(raw) : undefined;
}

function customerFailure(error: unknown): ProviderValue<PaddleCustomer> {
  const status = statusFromError(error);
  const retryable = status === undefined || status === 408 || status === 429 || status >= 500;
  return {
    accepted: false,
    failure: {
      provider: "paddle-customer",
      code: status === 404 ? "CUSTOMER_NOT_FOUND" : retryable ? "CUSTOMER_LOOKUP_RETRYABLE" : "CUSTOMER_LOOKUP_REJECTED",
      ...(status === undefined ? {} : { status }),
      retryable,
    },
  };
}

function invalidCustomer(code: string): ProviderValue<PaddleCustomer> {
  return {
    accepted: false,
    failure: { provider: "paddle-customer", code, retryable: false },
  };
}

function officialClient(apiKey: string): PaddleCustomerClient {
  const paddle = new Paddle(apiKey);
  return {
    get: (customerId) => paddle.customers.get(customerId),
  };
}

export function createPaddleCustomerAdapter(
  options: PaddleCustomerAdapterOptions = {},
): PaddleCustomerAdapter {
  const client = options.client ?? officialClient(options.apiKey ?? process.env.PADDLE_API_KEY ?? "");

  return {
    async getCustomer(customerId: string): Promise<ProviderValue<PaddleCustomer>> {
      if (!customerId) return invalidCustomer("CUSTOMER_ID_MISSING");
      try {
        const customer = await client.get(customerId);
        if (customer.id !== customerId) return invalidCustomer("CUSTOMER_ID_MISMATCH");
        if (typeof customer.email !== "string" || customer.email.length === 0) {
          return invalidCustomer("CUSTOMER_EMAIL_MISSING");
        }
        return {
          accepted: true,
          value: {
            id: customer.id,
            email: customer.email,
            marketingConsent: typeof customer.marketingConsent === "boolean" ? customer.marketingConsent : null,
          },
        };
      } catch (error) {
        return customerFailure(error);
      }
    },
  };
}
