import { createGcsAdapter } from "../../../../lib/commerce/gcs";
import { NeonReceiptStore } from "../../../../lib/commerce/receipt-store";
import { authorizePurchaseDownload } from "../../../../lib/commerce/purchase-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const grant = new URL(request.url).searchParams.get("grant") ?? "";
  try {
    const authorization = await authorizePurchaseDownload(new NeonReceiptStore(), grant);
    if (!authorization.authorized) return Response.json({ error: "DOWNLOAD_NOT_AVAILABLE" }, { status: 403 });

    const signedDownload = await createGcsAdapter().createSignedDownload(authorization.policy);
    if (!signedDownload.accepted) return Response.json({ error: "DOWNLOAD_UNAVAILABLE" }, { status: 503 });
    return Response.redirect(signedDownload.value, 302);
  } catch {
    return Response.json({ error: "DOWNLOAD_UNAVAILABLE" }, { status: 503 });
  }
}
