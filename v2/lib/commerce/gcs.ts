import type { GcsAdapter, ProviderFailure, ProviderValue } from "./providers";
import type { FulfillmentPolicy } from "./types";

export const SIGNED_URL_TTL_SECONDS = 24 * 60 * 60;

export interface GcsAdapterOptions {
  readonly fetchImpl?: typeof fetch;
  readonly signerUrl?: string;
  readonly signerSecret?: string;
  readonly timeoutMs?: number;
}

function objectNameFor(policy: FulfillmentPolicy): string | null {
  if (policy.storageObject.kind === "static") return policy.storageObject.objectName;
  return process.env[policy.storageObject.variable]?.trim() || null;
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function providerFailure(code: string, status?: number, retryable = false): ProviderFailure {
  return {
    provider: "gcs",
    code,
    ...(status === undefined ? {} : { status }),
    retryable,
  };
}

function failureFromStatus(status: number): ProviderFailure {
  const retryable = status === 408 || status === 429 || status >= 500;
  return providerFailure("SIGNED_URL_FAILED", status, retryable);
}

async function requestSigner(
  fetchImpl: typeof fetch,
  signerUrl: string,
  signerSecret: string,
  objectName: string,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(signerUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${signerSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ objectName }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function failureFromError(error: unknown): ProviderFailure {
  if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
    return providerFailure("TIMEOUT", undefined, true);
  }
  return providerFailure("SIGNED_URL_FAILED");
}

function urlFromResponse(body: unknown): string | null {
  if (!body || typeof body !== "object" || !("url" in body)) return null;
  const url = body.url;
  return isHttpsUrl(url) ? url : null;
}

export function createGcsAdapter(options: GcsAdapterOptions = {}): GcsAdapter {
  const fetchImpl = options.fetchImpl ?? fetch;
  const signerUrl = options.signerUrl ?? process.env.GCS_SIGNER_URL;
  const signerSecret = options.signerSecret ?? process.env.GCS_SIGNER_SECRET;
  const timeoutMs = options.timeoutMs ?? 15_000;

  return {
    async createSignedDownload(policy): Promise<ProviderValue<string>> {
      const objectName = objectNameFor(policy);
      if (!objectName) {
        return { accepted: false, failure: providerFailure("OBJECT_NOT_CONFIGURED") };
      }
      if (!signerUrl || !signerSecret || !isHttpsUrl(signerUrl)) {
        return { accepted: false, failure: providerFailure("SIGNER_NOT_CONFIGURED") };
      }

      try {
        const response = await requestSigner(fetchImpl, signerUrl, signerSecret, objectName, timeoutMs);
        if (response.status !== 200) {
          return { accepted: false, failure: failureFromStatus(response.status) };
        }

        let body: unknown;
        try {
          body = await response.json();
        } catch {
          return { accepted: false, failure: providerFailure("SIGNED_URL_INVALID_RESPONSE") };
        }

        const url = urlFromResponse(body);
        if (!url) {
          return { accepted: false, failure: providerFailure("SIGNED_URL_INVALID_RESPONSE") };
        }
        return { accepted: true, value: url };
      } catch (error) {
        return { accepted: false, failure: failureFromError(error) };
      }
    },
  };
}
