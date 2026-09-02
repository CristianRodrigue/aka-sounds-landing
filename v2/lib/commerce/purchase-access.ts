import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { findFulfillmentPolicy, findOfferByPriceId } from "./server-catalog";
import { resolvePaddleEnvironment } from "./paddle-customer";
import type { ReceiptRecord } from "./providers";
import type { NormalizedTransaction } from "./types";

export const PURCHASE_SESSION_TTL_MS = 30 * 60 * 1000;
export const DOWNLOAD_GRANT_TTL_MS = 5 * 60 * 1000;

export type PurchaseAccessSessionRecord = {
  readonly sessionId: string;
  readonly browserSecretHash: string;
  readonly fulfillmentOfferId: string;
  readonly priceId: string;
  readonly productId: string;
  readonly boundEventId: string | null;
  readonly boundTransactionId: string | null;
  readonly createdAt: string;
  readonly expiresAt: string;
};

export type DownloadGrantRecord = {
  readonly grantHash: string;
  readonly sessionId: string;
  readonly createdAt: string;
  readonly expiresAt: string;
};

export type PurchaseAccessSessionInput = {
  readonly sessionId: string;
  readonly browserSecretHash: string;
  readonly fulfillmentOfferId: string;
  readonly priceId: string;
  readonly productId: string;
  readonly createdAt: string;
  readonly expiresAt: string;
};

export type PurchaseAccessBindingInput = {
  readonly sessionId: string;
  readonly eventId: string;
  readonly transactionId: string;
  readonly fulfillmentOfferId: string;
  readonly priceId: string;
  readonly productId: string;
};

export type DownloadGrantInput = {
  readonly grantHash: string;
  readonly sessionId: string;
  readonly createdAt: string;
  readonly expiresAt: string;
};

export interface PurchaseAccessStore {
  createPurchaseAccessSession(input: PurchaseAccessSessionInput): Promise<void>;
  getPurchaseAccessSession(sessionId: string): Promise<PurchaseAccessSessionRecord | null>;
  bindPurchaseAccessSession(input: PurchaseAccessBindingInput): Promise<boolean>;
  createDownloadGrant(input: DownloadGrantInput): Promise<void>;
  getDownloadGrant(grantHash: string): Promise<DownloadGrantRecord | null>;
}

export type PurchaseSessionCredentials = {
  readonly sessionId: string;
  readonly browserSecret: string;
  readonly browserSecretHash: string;
  readonly createdAt: string;
  readonly expiresAt: string;
};

export type PurchaseOffer = {
  readonly offerId: string;
  readonly priceId: string;
  readonly productId: string;
  readonly productName: string;
};

export type PurchaseAccessStatus =
  | { readonly status: "UNAUTHORIZED" | "EXPIRED" }
  | { readonly status: "PENDING" }
  | { readonly status: "FAILED" }
  | { readonly status: "READY"; readonly productName: string; readonly downloadUrl: string };

function isoNow(now = Date.now()): string {
  return new Date(now).toISOString();
}

function isLive(value: string, now: number): boolean {
  return Date.parse(value) > now;
}

function token(): string {
  return randomBytes(32).toString("base64url");
}

export function hashPurchaseAccessSecret(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function secretMatchesHash(secret: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashPurchaseAccessSecret(secret), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function hashDownloadGrant(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function createPurchaseSessionCredentials(now = Date.now()): PurchaseSessionCredentials {
  const createdAt = isoNow(now);
  const browserSecret = token();
  return {
    sessionId: token(),
    browserSecret,
    browserSecretHash: hashPurchaseAccessSecret(browserSecret),
    createdAt,
    expiresAt: isoNow(now + PURCHASE_SESSION_TTL_MS),
  };
}

export function createDownloadGrantCredentials(now = Date.now()): {
  readonly token: string;
  readonly grantHash: string;
  readonly createdAt: string;
  readonly expiresAt: string;
} {
  const grant = token();
  return {
    token: grant,
    grantHash: hashDownloadGrant(grant),
    createdAt: isoNow(now),
    expiresAt: isoNow(now + DOWNLOAD_GRANT_TTL_MS),
  };
}

export function purchaseOfferForPrice(priceId: string | null): PurchaseOffer | null {
  if (!priceId) return null;
  const environment = resolvePaddleEnvironment();
  if (!environment.valid) return null;
  const offer = findOfferByPriceId(priceId, undefined, environment);
  if (!offer || offer.verification !== "verified" || offer.availability !== "active") return null;
  const mapping = environment.name === "production" ? offer.paddle.live : offer.paddle.sandbox;
  const policy = findFulfillmentPolicy(offer.id);
  if (!mapping?.productId || !policy) return null;
  return {
    offerId: offer.id,
    priceId: mapping.priceId,
    productId: mapping.productId,
    productName: policy.productName,
  };
}

export function compatiblePurchaseOffer(transaction: NormalizedTransaction): PurchaseOffer | null {
  if (transaction.status !== "completed" || transaction.items.length !== 1) return null;
  const item = transaction.items[0];
  const offer = purchaseOfferForPrice(item?.priceId ?? null);
  if (!offer || item?.productId !== offer.productId) return null;
  return offer;
}

function sessionReceiptMatches(session: PurchaseAccessSessionRecord, receipt: ReceiptRecord): boolean {
  return receipt.eventId === session.boundEventId
    && receipt.transactionId === session.boundTransactionId
    && receipt.priceId === session.priceId
    && receipt.productId === session.productId
    && receipt.fulfillmentOfferId === session.fulfillmentOfferId;
}

export async function readPurchaseAccessStatus(
  store: PurchaseAccessStore & { get(eventId: string): Promise<ReceiptRecord | null> },
  sessionId: string,
  browserSecret: string,
  now = Date.now(),
): Promise<PurchaseAccessStatus> {
  const session = await store.getPurchaseAccessSession(sessionId);
  if (!session || !secretMatchesHash(browserSecret, session.browserSecretHash)) return { status: "UNAUTHORIZED" };
  if (!isLive(session.expiresAt, now)) return { status: "EXPIRED" };
  if (!session.boundEventId || !session.boundTransactionId) return { status: "PENDING" };

  const receipt = await store.get(session.boundEventId);
  if (!receipt || !sessionReceiptMatches(session, receipt)) return { status: "FAILED" };
  if (receipt.state === "REJECTED" || receipt.state === "PERMANENT_FAILURE") return { status: "FAILED" };
  if (receipt.state !== "FULFILLED") return { status: "PENDING" };

  const offer = purchaseOfferForPrice(session.priceId);
  if (!offer || offer.offerId !== session.fulfillmentOfferId || offer.productId !== session.productId) {
    return { status: "FAILED" };
  }

  const grant = createDownloadGrantCredentials(now);
  await store.createDownloadGrant({
    grantHash: grant.grantHash,
    sessionId: session.sessionId,
    createdAt: grant.createdAt,
    expiresAt: grant.expiresAt,
  });
  return {
    status: "READY",
    productName: offer.productName,
    downloadUrl: `/api/purchase-access/download?grant=${encodeURIComponent(grant.token)}`,
  };
}

export async function authorizePurchaseDownload(
  store: PurchaseAccessStore & { get(eventId: string): Promise<ReceiptRecord | null> },
  grantToken: string,
  now = Date.now(),
): Promise<{ readonly authorized: true; readonly policy: NonNullable<ReturnType<typeof findFulfillmentPolicy>> } | { readonly authorized: false }> {
  if (!grantToken) return { authorized: false };
  const grant = await store.getDownloadGrant(hashDownloadGrant(grantToken));
  if (!grant || !isLive(grant.expiresAt, now)) return { authorized: false };

  const session = await store.getPurchaseAccessSession(grant.sessionId);
  if (!session || !isLive(session.expiresAt, now) || !session.boundEventId || !session.boundTransactionId) {
    return { authorized: false };
  }
  const receipt = await store.get(session.boundEventId);
  if (!receipt || receipt.state !== "FULFILLED" || !sessionReceiptMatches(session, receipt)) return { authorized: false };

  const offer = purchaseOfferForPrice(session.priceId);
  if (!offer || offer.offerId !== session.fulfillmentOfferId || offer.productId !== session.productId) {
    return { authorized: false };
  }
  const policy = findFulfillmentPolicy(offer.offerId);
  return policy ? { authorized: true, policy } : { authorized: false };
}

export function isValidPurchaseSessionId(value: string): boolean {
  return /^[A-Za-z0-9_-]{40,80}$/.test(value);
}
