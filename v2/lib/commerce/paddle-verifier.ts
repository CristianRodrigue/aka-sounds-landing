import { Paddle } from "@paddle/paddle-node-sdk";

export type OfficialVerificationResult =
  | { readonly valid: true; readonly event: unknown }
  | { readonly valid: false; readonly reason: "MISSING_HEADER" | "MISSING_SECRET" | "INVALID_SIGNATURE" };

type Unmarshal = (rawBody: string, secret: string, signature: string) => Promise<unknown>;

let paddle: Paddle | null = null;

function officialUnmarshal(): Unmarshal {
  if (!paddle) paddle = new Paddle(process.env.PADDLE_API_KEY ?? "");
  return paddle.webhooks.unmarshal.bind(paddle.webhooks);
}

export async function verifyOfficialPaddleWebhook(
  rawBody: string,
  signature: string | null,
  secret: string,
  unmarshal?: Unmarshal,
): Promise<OfficialVerificationResult> {
  if (!signature) return { valid: false, reason: "MISSING_HEADER" };
  if (!secret) return { valid: false, reason: "MISSING_SECRET" };
  try {
    const event = await (unmarshal ?? officialUnmarshal())(rawBody, secret, signature);
    return { valid: true, event };
  } catch {
    return { valid: false, reason: "INVALID_SIGNATURE" };
  }
}
