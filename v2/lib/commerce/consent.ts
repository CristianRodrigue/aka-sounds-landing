import type { MarketingConsent } from "./types";

export interface ConsentDecision {
  readonly transactionalEmailAllowed: true;
  readonly marketingSubscriptionAllowed: boolean;
  readonly reason: "EXPLICIT_OPT_IN" | "EXPLICIT_OPT_OUT" | "CONSENT_ABSENT";
}

export function decideConsent(consent: MarketingConsent): ConsentDecision {
  if (consent === true) {
    return {
      transactionalEmailAllowed: true,
      marketingSubscriptionAllowed: true,
      reason: "EXPLICIT_OPT_IN",
    };
  }

  if (consent === false) {
    return {
      transactionalEmailAllowed: true,
      marketingSubscriptionAllowed: false,
      reason: "EXPLICIT_OPT_OUT",
    };
  }

  return {
    transactionalEmailAllowed: true,
    marketingSubscriptionAllowed: false,
    reason: "CONSENT_ABSENT",
  };
}
