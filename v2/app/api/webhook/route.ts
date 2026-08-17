import { createGcsAdapter } from "../../../lib/commerce/gcs";
import { processFulfillmentEvent } from "../../../lib/commerce/fulfillment-service";
import { createMailerLiteAdapter } from "../../../lib/commerce/mailerlite";
import { verifyOfficialPaddleWebhook } from "../../../lib/commerce/paddle-verifier";
import { NeonReceiptStore } from "../../../lib/commerce/receipt-store";
import { createResendAdapter } from "../../../lib/commerce/resend";
import { handleV2Webhook } from "../../../lib/commerce/webhook-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleV2Webhook(request, {
    verify: verifyOfficialPaddleWebhook,
    process: (transaction) =>
      processFulfillmentEvent(transaction, {
        receiptStore: new NeonReceiptStore(),
        gcs: createGcsAdapter(),
        resend: createResendAdapter(),
        mailerlite: createMailerLiteAdapter(),
      }),
  });
}
