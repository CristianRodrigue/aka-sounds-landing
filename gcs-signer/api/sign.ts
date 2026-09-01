import { timingSafeEqual } from "node:crypto";
import { Storage } from "@google-cloud/storage";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SIGNED_URL_TTL_SECONDS = 24 * 60 * 60;

const ALLOWED_OBJECTS = new Set([
  "AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1.zip",
  "AKA_SOUNDS_HARDTECHNO-ESSENTIALS-VOL.-1-FREE-TRIAL 1.zip",
  "AKA Sounds Free Serum 2 Reverse Bass Kick.zip",
  "AKA Sounds Free Serum 2 Zaag Kick.zip",
  "AKA Sounds Free Serum 2 Hardtechno Kick.zip",
  "AKA Sounds Free Serum 2 Hard Dance Screeches.zip",
  "AKA_SOUNDS_MODERN_RAW_KICK_ARSENAL_VOL_1_FULL_EDITION.zip",
  "AKA_SOUNDS_MODERN_RAW_KICK_ARSENAL_VOL_1_FREE_EDITION.zip",
]);

function normalizeClientEmail(value: string | undefined): string | undefined {
  return value?.trim() || undefined;
}

function normalizePrivateKey(value: string | undefined): string | undefined {
  return value
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n") || undefined;
}

function safeEqual(left: string | undefined, right: string | undefined): boolean {
  if (!left || !right) return false;
  const leftBytes = Buffer.from(left, "utf8");
  const rightBytes = Buffer.from(right, "utf8");
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function hasBearerToken(request: VercelRequest): boolean {
  const header = request.headers.authorization;
  const token = typeof header === "string" && header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : undefined;
  return safeEqual(token, process.env.GCS_SIGNER_SECRET);
}

function requestBody(request: VercelRequest): unknown {
  if (typeof request.body === "string") {
    try {
      return JSON.parse(request.body);
    } catch {
      return undefined;
    }
  }
  return request.body;
}

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  if (request.method !== "POST") {
    response.status(405).json({ error: "METHOD_NOT_ALLOWED" });
    return;
  }

  if (!hasBearerToken(request)) {
    response.status(401).json({ error: "UNAUTHORIZED" });
    return;
  }

  const body = requestBody(request);
  const objectName = body && typeof body === "object" && "objectName" in body && typeof body.objectName === "string"
    ? body.objectName
    : undefined;

  if (!objectName) {
    response.status(400).json({ error: "OBJECT_NAME_REQUIRED" });
    return;
  }

  if (!ALLOWED_OBJECTS.has(objectName)) {
    response.status(403).json({ error: "OBJECT_NOT_ALLOWED" });
    return;
  }

  const clientEmail = normalizeClientEmail(process.env.GCP_CLIENT_EMAIL);
  const privateKey = normalizePrivateKey(process.env.GCP_PRIVATE_KEY);
  const bucketName = process.env.GCP_BUCKET_NAME?.trim();

  if (!clientEmail || !privateKey || !bucketName) {
    response.status(500).json({ error: "SIGNER_NOT_CONFIGURED" });
    return;
  }

  try {
    const storage = new Storage({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
    const [url] = await storage.bucket(bucketName).file(objectName).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + SIGNED_URL_TTL_SECONDS * 1000,
    });
    response.status(200).json({ url });
  } catch {
    response.status(500).json({ error: "SIGNING_FAILED" });
  }
}
