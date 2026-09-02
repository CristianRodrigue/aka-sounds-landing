import type { NormalizedTransaction, FulfillmentPolicy } from "./types";
import type { ProviderResult, ResendAdapter } from "./providers";

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export const TRANSACTIONAL_EMAIL_BRAND_ASSET_URL = "https://akasounds.com/assets/aka-logo-symbol-white-official.png";

function escapeHtml(value: string): string {
  const replacements: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  };
  return value.replace(/[&<>'"]/g, (character) => replacements[character] ?? character);
}

function classifyStatus(status: number): ProviderResult {
  return {
    accepted: false,
    failure: {
      provider: "resend",
      code: status >= 500 || status === 408 || status === 429 ? "PROVIDER_RETRYABLE" : "PROVIDER_REJECTED",
      status,
      retryable: status >= 500 || status === 408 || status === 429,
    },
  };
}

export interface ResendAdapterOptions {
  readonly fetchImpl?: FetchLike;
  readonly apiKey?: string;
  readonly from?: string;
  readonly safeTestMode?: boolean;
  readonly testRecipient?: string;
}

export function createResendAdapter(options: ResendAdapterOptions = {}): ResendAdapter {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiKey = options.apiKey ?? process.env.RESEND_API_KEY;
  const from = options.from ?? process.env.RESEND_FROM_EMAIL;
  const safeTestMode = options.safeTestMode ?? process.env.V2_SAFE_TEST_MODE === "true";
  const testRecipient = options.testRecipient ?? process.env.RESEND_TEST_RECIPIENT;

  return {
    async sendTransactionEmail(input: {
      readonly email: string;
      readonly transaction: NormalizedTransaction;
      readonly policy: FulfillmentPolicy;
      readonly downloadUrl: string;
    }): Promise<ProviderResult> {
      const configuredTestRecipient = testRecipient?.trim();
      if (safeTestMode && !configuredTestRecipient) {
        return {
          accepted: false,
          failure: { provider: "resend", code: "SAFE_TEST_RECIPIENT_REQUIRED", retryable: false },
        };
      }
      if (!apiKey || !from) {
        return { accepted: false, failure: { provider: "resend", code: "RESEND_NOT_CONFIGURED", retryable: false } };
      }
      const recipient = safeTestMode ? configuredTestRecipient! : input.email;
      const productName = escapeHtml(input.policy.productName);
      const downloadUrl = escapeHtml(input.downloadUrl);
      try {
        const response = await fetchImpl("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + apiKey,
            "Content-Type": "application/json",
            "Idempotency-Key": "aka-sounds-v2-" + input.transaction.transactionId,
          },
          body: JSON.stringify({
            from,
            to: [recipient],
            subject: input.policy.emailSubject,
            html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#111111; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#111111; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Wrapper table for the email content -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color:#000000; border: 1px solid #333333; border-radius: 12px; overflow: hidden;">

          <!-- Header (White background, black typography logo, minimal padding) -->
          <tr>
            <td align="center" style="padding: 25px 20px; background-color: #ffffff; border-bottom: 1px solid #eeeeee;">
              <!-- Highly styled text to match a modern typography logo -->
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: 8px; color: #000000; text-transform: uppercase;">
                AKA SOUNDS
              </div>
            </td>
          </tr>

          <!-- Body (Dark, oversized official AKA geometric symbol background) -->
          <tr>
            <td align="center" background="${TRANSACTIONAL_EMAIL_BRAND_ASSET_URL}" style="background-color: #050505; background-image: url('${TRANSACTIONAL_EMAIL_BRAND_ASSET_URL}'); background-size: 900px auto; background-position: center center; background-repeat: no-repeat; padding: 60px 40px 40px 40px;">
              <!-- We wrap the text in a div with a semi-transparent black background to ensure high readability -->
              <div style="background-color: rgba(5, 5, 5, 0.90); padding: 30px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <h2 style="color: #ffffff; margin: 0 0 24px 0; font-size: 22px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">ACCESS GRANTED</h2>
                <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 35px 0; text-align: center;">
                  Thank you for securing your copy of <br><strong><span style="color:#ffffff;">${productName}</span></strong>.
                  <br><br>
                  Your high-quality audio files are ready. This private download link is uniquely generated for you and will self-destruct in <strong style="color:#ffffff;">24 hours</strong>.
                </p>

                <!-- Button -->
                <table border="0" cellspacing="0" cellpadding="0" align="center">
                  <tr>
                    <td align="center" style="border-radius: 6px; background-color: #ffffff;">
                      <a href="${downloadUrl}" target="_blank" style="font-size: 16px; font-weight: 800; font-family: sans-serif; color: #000000; text-decoration: none; padding: 18px 45px; border-radius: 6px; display: inline-block; text-transform: uppercase; letter-spacing: 2px;">Download Files Now</a>
                    </td>
                  </tr>
                </table>
                <p style="color: #777777; font-size: 12px; margin-top: 25px; margin-bottom: 0; text-transform: uppercase; letter-spacing: 1px;">Secure ZIP Archive</p>
              </div>
            </td>
          </tr>

          <!-- Footer (White background, links in dark grey) -->
          <tr>
            <td align="center" style="padding: 40px 40px; background-color: #ffffff; border-top: 1px solid #eeeeee;">

              <!-- Main Link -->
              <a href="https://www.akasounds.com" style="color: #000000; text-decoration: underline; font-size: 18px; font-weight: 800; display: inline-block; margin-bottom: 25px; letter-spacing: 1px;">www.akasounds.com</a>

              <br>

              <!-- Disclaimer text below links -->
              <p style="color: #555555; font-size: 12px; line-height: 1.6; margin: 0;">
                If you have any issues with your download, simply reply to this email.<br>
                Welcome to the underground.<br><br>
                &copy; ${new Date().getFullYear()} AKA SOUNDS
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
                `
          }),
        });
        if (!response.ok) return classifyStatus(response.status);
        const responseText = await response.text().catch(() => "");
        let emailId: string | undefined;
        try {
          const responseBody: unknown = JSON.parse(responseText);
          if (responseBody && typeof responseBody === "object" && "id" in responseBody && typeof responseBody.id === "string" && responseBody.id.length > 0) {
            emailId = responseBody.id;
          }
        } catch {
          // Preserve the existing accepted semantics when the provider omits a parseable body.
        }
        return emailId ? { accepted: true, emailId } : { accepted: true };
      } catch {
        return { accepted: false, failure: { provider: "resend", code: "NETWORK_OR_TIMEOUT", retryable: true } };
      }
    },
  };
}
