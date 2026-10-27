import { createGcsAdapter } from "../../../../lib/commerce/gcs";
import { NeonReceiptStore } from "../../../../lib/commerce/receipt-store";
import { purchaseAccessOptions } from "../cors";
import { CORS_METHODS, handlePurchaseDownload } from "./handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: Request): Response {
  return purchaseAccessOptions(request, CORS_METHODS);
}

export async function GET(request: Request): Promise<Response> {
  return handlePurchaseDownload(request, { store: new NeonReceiptStore(), gcs: createGcsAdapter() });
}
