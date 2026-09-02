export type C6FlowState = "closed" | "preparing" | "ready" | "delay";
export type C6AccessStatus = "PENDING" | "READY" | "FAILED";

export function beginC6Flow(): C6FlowState {
  return "preparing";
}

export function stateAfterPreparingStatus(status: C6AccessStatus, timedOut: boolean): C6FlowState {
  if (status === "READY") return "ready";
  if (timedOut || status === "FAILED") return "delay";
  return "preparing";
}

export function stateAfterDelayCheck(status: C6AccessStatus): C6FlowState {
  return status === "READY" ? "ready" : "delay";
}

export function canDismissC6(state: C6FlowState, initialVerificationComplete: boolean): boolean {
  return state === "ready" || state === "delay" || initialVerificationComplete;
}
