export const deliveryStates = [
  "RECEIVED",
  "SIGNATURE_VERIFIED",
  "VALIDATED",
  "FULFILLMENT_PENDING",
  "FULFILLED",
  "REJECTED",
  "RETRYABLE_FAILURE",
  "PERMANENT_FAILURE",
] as const;

export type DeliveryState = (typeof deliveryStates)[number];

const transitions: Record<DeliveryState, readonly DeliveryState[]> = {
  RECEIVED: ["SIGNATURE_VERIFIED", "REJECTED", "PERMANENT_FAILURE"],
  SIGNATURE_VERIFIED: ["VALIDATED", "REJECTED", "RETRYABLE_FAILURE", "PERMANENT_FAILURE"],
  VALIDATED: ["FULFILLMENT_PENDING", "REJECTED", "PERMANENT_FAILURE"],
  FULFILLMENT_PENDING: ["FULFILLED", "RETRYABLE_FAILURE", "PERMANENT_FAILURE"],
  FULFILLED: [],
  REJECTED: [],
  RETRYABLE_FAILURE: ["SIGNATURE_VERIFIED", "FULFILLMENT_PENDING", "PERMANENT_FAILURE"],
  PERMANENT_FAILURE: [],
};

export function canTransition(from: DeliveryState, to: DeliveryState): boolean {
  return transitions[from].includes(to);
}

export function isDuplicateReceipt(existing: { readonly eventId: string } | null, eventId: string): boolean {
  return existing?.eventId === eventId;
}

export function isTerminalState(state: DeliveryState): boolean {
  return state === "FULFILLED" || state === "REJECTED" || state === "PERMANENT_FAILURE";
}
