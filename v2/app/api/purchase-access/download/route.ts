import { createGcsAdapter } from "../../../../lib/commerce/gcs";
import { NeonReceiptStore } from "../../../../lib/commerce/receipt-store";
import { authorizePurchaseDownload } from "../../../../lib/commerce/purchase-access";
import type { PurchaseAccessStore } from "../../../../lib/commerce/purchase-access";
import type { GcsAdapter, ReceiptRecord } from "../../../../lib/commerce/providers";
import { purchaseAccessOptions, withPurchaseAccessCors } from "../cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS_METHODS = "GET, OPTIONS";

type PurchaseDownloadStore = PurchaseAccessStore & {
  get(eventId: string): Promise<ReceiptRecord | null>;
};

export interface PurchaseDownloadDependencies {
  readonly store: PurchaseDownloadStore;
  readonly gcs: GcsAdapter;
}

export function OPTIONS(request: Request): Response {
  return purchaseAccessOptions(request, CORS_METHODS);
}

export async function handlePurchaseDownload(
  request: Request,
  dependencies: PurchaseDownloadDependencies,
): Promise<Response> {
  const grant = new URL(request.url).searchParams.get("grant") ?? "";
  try {
    const authorization = await authorizePurchaseDownload(dependencies.store, grant);
    if (!authorization.authorized) return withPurchaseAccessCors(request, Response.json({ error: "DOWNLOAD_NOT_AVAILABLE" }, { status: 403 }), CORS_METHODS);

    const signedDownload = await dependencies.gcs.createSignedDownload(authorization.policy);
    if (!signedDownload.accepted) return withPurchaseAccessCors(request, Response.json({ error: "DOWNLOAD_UNAVAILABLE" }, { status: 503 }), CORS_METHODS);
    return withPurchaseAccessCors(request, Response.redirect(signedDownload.value, 302), CORS_METHODS);
  } catch {
    return withPurchaseAccessCors(request, Response.json({ error: "DOWNLOAD_UNAVAILABLE" }, { status: 503 }), CORS_METHODS);
  }
}

export async function GET(request: Request): Promise<Response> {
  return handlePurchaseDownload(request, { store: new NeonReceiptStore(), gcs: createGcsAdapter() });
}
