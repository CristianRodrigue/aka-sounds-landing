import { after } from "next/server";
import { createGcsAdapter } from "../../../lib/commerce/gcs";
import { createMailerLiteAdapter } from "../../../lib/commerce/mailerlite";
import { createPaddleCustomerAdapter } from "../../../lib/commerce/paddle-customer";
import { verifyOfficialPaddleWebhook } from "../../../lib/commerce/paddle-verifier";
import { NeonReceiptStore } from "../../../lib/commerce/receipt-store";
import { createResendAdapter } from "../../../lib/commerce/resend";
import { processReceiptEvent } from "../../../lib/commerce/fulfillment-service";
import { handleV2Webhook } from "../../../lib/commerce/webhook-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const receiptStore = new NeonReceiptStore();
  return handleV2Webhook(request, {
    verify: verifyOfficialPaddleWebhook,
    receiptStore,
    processReceipt: (eventId) =>
      processReceiptEvent(eventId, {
        receiptStore,
        customer: createPaddleCustomerAdapter(),
        gcs: createGcsAdapter(),
        resend: createResendAdapter(),
        mailerlite: createMailerLiteAdapter(),
      }),
    schedule: (task) => after(task),
  });
}
