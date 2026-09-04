import type { DeliveryState } from "./state";
import type { FulfillmentPolicy, NormalizedTransaction } from "./types";

export type ProviderName = "paddle" | "paddle-customer" | "gcs" | "resend" | "mailerlite" | "receipt-store";
export type FailureClass = "retryable" | "permanent";

export interface ProviderFailure {
  readonly provider: ProviderName;
  readonly code: string;
  readonly status?: number;
  readonly retryable?: boolean;
}
export interface ProviderResult {
  readonly accepted: boolean;
  readonly emailId?: string;
  readonly failure?: ProviderFailure;
  readonly outcome?: MailerLiteOutcome;
  readonly subscriberStatus?: MailerLiteSubscriberStatus;
}

export type MailerLiteSubscriberStatus = "active" | "unsubscribed" | "unconfirmed" | "bounced" | "junk" | "unknown";
export type MailerLiteOutcome =
  | "CREATED_ACTIVE"
  | "EXISTING_ACTIVE"
  | "EXISTING_NONACTIVE"
  | "UNSUBSCRIBED"
  | "REJECTED"
  | "RETRYABLE_FAILURE";

export interface PaddleCustomer {
  readonly id: string;
  readonly email: string;
  readonly marketingConsent: boolean | null;
}

export interface PaddleCustomerAdapter {
  getCustomer(customerId: string): Promise<ProviderValue<PaddleCustomer>>;
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

export interface MailerLiteUnsubscribeAdapter {
  unsubscribeMarketingSubscriber(email: string): Promise<ProviderResult>;
}

export interface ReceiptRecord {
  readonly eventId: string;
  readonly notificationId: string | null;
  readonly transactionId: string;
  readonly customerId: string | null;
  readonly priceId: string | null;
  readonly productId: string | null;
  readonly quantity: number;
  readonly itemCount: number;
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
  readonly customerHydratedAt: string | null;
  readonly marketingConsentSnapshot: boolean | null;
  readonly processingLeaseUntil: string | null;
  readonly resendEmailId: string | null;
  readonly resendDeliveryStatus: ResendDeliveryStatus | null;
  readonly resendLastEventId: string | null;
  readonly resendLastEventAt: string | null;
}

export type ResendDeliveryEventType =
  | "email.delivered"
  | "email.bounced"
  | "email.failed"
  | "email.delivery_delayed";

export type ResendDeliveryStatus = "accepted" | "delivered" | "bounced" | "failed" | "delivery_delayed";

export interface ResendDeliveryEventInput {
  readonly svixId: string;
  readonly emailId: string;
  readonly eventType: ResendDeliveryEventType;
  readonly eventCreatedAt: string;
  readonly bounceType: string | null;
  readonly bounceSubtype: string | null;
  readonly providerMessage: string | null;
}

export interface ResendDeliveryEventResult {
  readonly inserted: boolean;
  readonly receiptEventId: string | null;
}

export interface ReceiptEvent {
  readonly eventId: string;
  readonly notificationId: string | null;
  readonly transactionId: string;
  readonly customerId: string | null;
  readonly priceId: string | null;
  readonly productId: string | null;
  readonly quantity: number;
  readonly itemCount: number;
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
  claimProcessing(eventId: string): Promise<ReceiptClaim>;
  releaseProcessing(eventId: string): Promise<void>;
  transition(eventId: string, state: DeliveryState, failure?: ProviderFailure): Promise<void>;
  recordProviderFailure(eventId: string, failure: ProviderFailure): Promise<void>;
  markCustomerHydrated(eventId: string, marketingConsent: boolean | null): Promise<void>;
  markTransactionalEmailAccepted(eventId: string, emailId: string): Promise<void>;
  markTransactionalEmailCompleted(eventId: string): Promise<void>;
  markMarketingRequested(eventId: string, requested: boolean): Promise<void>;
  markMarketingCompleted(eventId: string): Promise<void>;
}

export interface ResendDeliveryStore {
  recordResendDeliveryEvent(input: ResendDeliveryEventInput): Promise<ResendDeliveryEventResult>;
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
