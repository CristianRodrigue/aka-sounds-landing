import { handleResendWebhook } from "../../../../lib/commerce/resend-webhook";
import { createMailerLiteAdapter } from "../../../../lib/commerce/mailerlite";
import { NeonReceiptStore } from "../../../../lib/commerce/receipt-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleResendWebhook(request, {
    deliveryStore: new NeonReceiptStore(),
    mailerlite: createMailerLiteAdapter(),
    secret: process.env.RESEND_WEBHOOK_SECRET,
  });
}
