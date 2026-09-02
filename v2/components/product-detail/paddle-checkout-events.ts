export type PaddleCheckoutEvent = {
  readonly name?: unknown;
  readonly data?: {
    readonly transaction_id?: unknown;
    readonly transactionId?: unknown;
  };
};

export function isPaddleCheckoutCompletedEvent(value: unknown): value is PaddleCheckoutEvent {
  return Boolean(
    value
      && typeof value === "object"
      && "name" in value
      && (value as { readonly name?: unknown }).name === "checkout.completed",
  );
}

export function paddleTransactionId(event: PaddleCheckoutEvent): string | null {
  const transactionId = event.data?.transaction_id ?? event.data?.transactionId;
  return typeof transactionId === "string" && transactionId.length > 0 ? transactionId : null;
}
