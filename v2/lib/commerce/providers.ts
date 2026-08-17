import type { DeliveryState } from "./state";
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
  createSignedDownload(policy: FulfillmentPolicy): Promise<ProviderValue<string>>;
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
  readonly notificationId: string | null;
  readonly transactionId: string;
  readonly customerId: string | null;
  readonly occurredAt: string | null;
  readonly state: DeliveryState;
  readonly attemptCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastErrorCode: string | null;
  readonly lastErrorClass: FailureClass | null;
  readonly fulfillmentOfferId: string | null;
  readonly fulfillmentCompletedAt: string | null;
  readonly transactionalEmailCompletedAt: string | null;
  readonly marketingRequested: boolean;
  readonly marketingCompletedAt: string | null;
}

export interface ReceiptEvent {
  readonly eventId: string;
  readonly notificationId: string | null;
  readonly transactionId: string;
  readonly customerId: string | null;
  readonly occurredAt: string | null;
  readonly fulfillmentOfferId?: string | null;
}

export interface ReceiptClaim {
  readonly owner: boolean;
  readonly duplicate: boolean;
  readonly record: ReceiptRecord;
}

export interface ReceiptStore {
  get(eventId: string): Promise<ReceiptRecord | null>;
  claimEvent(input: ReceiptEvent): Promise<ReceiptClaim>;
  transition(eventId: string, state: DeliveryState, failure?: ProviderFailure): Promise<void>;
  recordProviderFailure(eventId: string, failure: ProviderFailure): Promise<void>;
  markTransactionalEmailCompleted(eventId: string): Promise<void>;
  markMarketingRequested(eventId: string, requested: boolean): Promise<void>;
  markMarketingCompleted(eventId: string): Promise<void>;
}

export type ProviderValue<T> =
  | { readonly accepted: true; readonly value: T }
  | { readonly accepted: false; readonly failure: ProviderFailure };

export function classifyProviderFailure(failure: ProviderFailure): FailureClass {
  if (failure.retryable === true) return "retryable";
  if (failure.retryable === false) return "permanent";
  if (failure.status === 408 || failure.status === 409 || failure.status === 425 || failure.status === 429) {
    return "retryable";
  }
  if (failure.status !== undefined && failure.status >= 500) return "retryable";
  return "permanent";
}
