import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import type { PaddleCustomer, PaddleCustomerAdapter, ProviderValue } from "./providers";

interface CustomerResource {
  readonly id: string;
  readonly email: string;
  readonly marketingConsent?: boolean | null;
}

export interface PaddleCustomerClient {
  get(customerId: string): Promise<CustomerResource>;
}

export type PaddleEnvironmentName = "sandbox" | "production";

export type PaddleEnvironmentConfig =
  | { readonly valid: true; readonly name: PaddleEnvironmentName; readonly sdkEnvironment: Environment }
  | { readonly valid: false; readonly reason: "INVALID_PADDLE_ENVIRONMENT" };

export type PaddleCustomerClientFactory = (apiKey: string, environment: Environment) => PaddleCustomerClient;

export interface PaddleCustomerAdapterOptions {
  readonly apiKey?: string;
  readonly client?: PaddleCustomerClient;
  readonly paddleFactory?: PaddleCustomerClientFactory;
}

export function resolvePaddleEnvironment(value = process.env.PADDLE_ENVIRONMENT): PaddleEnvironmentConfig {
  if (value === "sandbox") return { valid: true, name: "sandbox", sdkEnvironment: Environment.sandbox };
  if (value === "production" || value === undefined || value === "") {
    return { valid: true, name: "production", sdkEnvironment: Environment.production };
  }
  return { valid: false, reason: "INVALID_PADDLE_ENVIRONMENT" };
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

function officialClient(apiKey: string, environment: Environment): PaddleCustomerClient {
  const paddle = new Paddle(apiKey, { environment });
  return {
    get: (customerId) => paddle.customers.get(customerId),
  };
}

export function createPaddleCustomerAdapter(
  options: PaddleCustomerAdapterOptions = {},
): PaddleCustomerAdapter {
  const environment = resolvePaddleEnvironment();
  const client = environment.valid
    ? options.client ?? (options.paddleFactory ?? officialClient)(options.apiKey ?? process.env.PADDLE_API_KEY ?? "", environment.sdkEnvironment)
    : undefined;

  return {
    async getCustomer(customerId: string): Promise<ProviderValue<PaddleCustomer>> {
      if (!customerId) return invalidCustomer("CUSTOMER_ID_MISSING");
      if (!environment.valid) return invalidCustomer(environment.reason);
      try {
        const customer = await client!.get(customerId);
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
