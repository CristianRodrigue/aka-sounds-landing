import { createHmac, timingSafeEqual } from "node:crypto";

export type SignatureFailure =
  | "MISSING_HEADER"
  | "MISSING_SECRET"
  | "MALFORMED_HEADER"
  | "INVALID_TIMESTAMP"
  | "TIMESTAMP_OUT_OF_RANGE"
  | "INVALID_SIGNATURE";

export type SignatureResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: SignatureFailure };

function parseSignatureHeader(header: string): { timestamp: string; hash: string } | null {
  const parts = header.split(";").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("ts="))?.slice(3);
  const hash = parts.find((part) => part.startsWith("h1="))?.slice(3);
  if (!timestamp || !hash || !/^\d+$/.test(timestamp) || !/^[a-f0-9]{64}$/i.test(hash)) return null;
  return { timestamp, hash };
}

export function verifyPaddleSignature(
  rawBody: string | Uint8Array,
  signatureHeader: string | null | undefined,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = 300,
): SignatureResult {
  if (!signatureHeader) return { valid: false, reason: "MISSING_HEADER" };
  if (!secret) return { valid: false, reason: "MISSING_SECRET" };
  const parsed = parseSignatureHeader(signatureHeader);
  if (!parsed) return { valid: false, reason: "MALFORMED_HEADER" };

  const timestamp = Number(parsed.timestamp);
  if (!Number.isSafeInteger(timestamp)) return { valid: false, reason: "INVALID_TIMESTAMP" };
  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
    return { valid: false, reason: "TIMESTAMP_OUT_OF_RANGE" };
  }

  const body = typeof rawBody === "string" ? rawBody : Buffer.from(rawBody).toString("utf8");
  const expected = createHmac("sha256", secret).update(`${parsed.timestamp}:${body}`).digest("hex");
  const actualBuffer = Buffer.from(parsed.hash.toLowerCase(), "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return { valid: false, reason: "INVALID_SIGNATURE" };
  }
  return { valid: true };
}
