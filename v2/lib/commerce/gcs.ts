import { Storage } from "@google-cloud/storage";
import type { GcsAdapter, ProviderValue } from "./providers";
import type { FulfillmentPolicy } from "./types";

export const SIGNED_URL_TTL_SECONDS = 24 * 60 * 60;

type GcsFile = {
  getSignedUrl(options: { version: "v4"; action: "read"; expires: Date }): Promise<[string]>;
};

type GcsBucket = { file(objectName: string): GcsFile };

export interface GcsClient {
  bucket(name: string): GcsBucket;
}

function objectNameFor(policy: FulfillmentPolicy): string | null {
  if (policy.storageObject.kind === "static") return policy.storageObject.objectName;
  return process.env[policy.storageObject.variable]?.trim() || null;
}

function statusFromError(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const value = error as { code?: unknown; statusCode?: unknown };
  const raw = typeof value.code === "number" ? value.code : value.statusCode;
  return typeof raw === "number" ? raw : typeof raw === "string" && /^\d+$/.test(raw) ? Number(raw) : undefined;
}

function providerFailure(error: unknown): { provider: "gcs"; code: string; status?: number; retryable: boolean } {
  const status = statusFromError(error);
  const retryable = status === 408 || status === 429 || (status !== undefined && status >= 500);
  return {
    provider: "gcs",
    code: status === 404 ? "OBJECT_NOT_FOUND" : error instanceof Error && error.name === "TimeoutError" ? "TIMEOUT" : "SIGNED_URL_FAILED",
    ...(status === undefined ? {} : { status }),
    retryable,
  };
}

function createGcsClient(): GcsClient {
  const projectId = process.env.GCP_PROJECT_ID;
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storage = new Storage({
    ...(projectId ? { projectId } : {}),
    ...(clientEmail && privateKey ? { credentials: { client_email: clientEmail, private_key: privateKey } } : {}),
  });
  return storage as unknown as GcsClient;
}

export function createGcsAdapter(client: GcsClient = createGcsClient(), bucketName = process.env.GCP_BUCKET_NAME): GcsAdapter {
  return {
    async createSignedDownload(policy): Promise<ProviderValue<string>> {
      const objectName = objectNameFor(policy);
      if (!bucketName) {
        return { accepted: false, failure: { provider: "gcs", code: "BUCKET_NOT_CONFIGURED", retryable: false } };
      }
      if (!objectName) {
        return { accepted: false, failure: { provider: "gcs", code: "OBJECT_NOT_CONFIGURED", retryable: false } };
      }

      try {
        const [url] = await client.bucket(bucketName).file(objectName).getSignedUrl({
          version: "v4",
          action: "read",
          expires: new Date(Date.now() + SIGNED_URL_TTL_SECONDS * 1000),
        });
        return { accepted: true, value: url };
      } catch (error) {
        return { accepted: false, failure: providerFailure(error) };
      }
    },
  };
}
