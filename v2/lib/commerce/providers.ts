import type { FulfillmentPolicy, NormalizedTransaction } from "./types";

export type ProviderName = "paddle" | "gcs" | "resend" | "mailerlite" | "receipt-store";
export type FailureClass = "retryable" | "permanent";

export interface ProviderFailure {
  readonly provider: ProviderName;
  readonly code: string;
  readonly status?: number;
  readonly retryable?: boolean;
}

export interface ProviderResult {
  readonly accepted: boolean;
  readonly failure?: ProviderFailure;
}

export interface PaddleCustomer {
  readonly id: string;
  readonly email: string;
  readonly marketingConsent: boolean | null;
}

export interface PaddleAdapter {
  getCustomer(customerId: string): Promise<PaddleCustomer>;
}

export interface GcsAdapter {
  createSignedDownload(policy: FulfillmentPolicy): Promise<string>;
}

export interface ResendAdapter {
  sendTransactionEmail(input: {
    readonly email: string;
    readonly transaction: NormalizedTransaction;
    readonly policy: FulfillmentPolicy;
    readonly downloadUrl: string;
  }): Promise<ProviderResult>;
}

export interface MailerLiteAdapter {
  upsertMarketingSubscriber(input: {
    readonly email: string;
    readonly transactionId: string;
  }): Promise<ProviderResult>;
}

export interface ReceiptRecord {
  readonly eventId: string;
  readonly transactionId: string;
  readonly state: string;
}

export interface ReceiptStore {
  get(eventId: string): Promise<ReceiptRecord | null>;
  createPending(input: { readonly eventId: string; readonly transactionId: string }): Promise<void>;
  transition(eventId: string, state: string): Promise<void>;
}

export function classifyProviderFailure(failure: ProviderFailure): FailureClass {
  if (failure.retryable === true) return "retryable";
  if (failure.retryable === false) return "permanent";
  if (failure.status === 408 || failure.status === 409 || failure.status === 425 || failure.status === 429) {
    return "retryable";
  }
  if (failure.status !== undefined && failure.status >= 500) return "retryable";
  return "permanent";
}
