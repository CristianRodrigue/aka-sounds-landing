import { submitNewsletter } from "../../../lib/commerce/newsletter";
import { createMailerLiteAdapter } from "../../../lib/commerce/mailerlite";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let input: unknown;
  try {
    input = (await request.json()) as unknown;
  } catch {
    return Response.json({ status: "validation failure" }, { status: 400 });
  }

  const result = await submitNewsletter(input, createMailerLiteAdapter());
  if (result.accepted) return Response.json({ status: result.outcome }, { status: 200 });
  const providerFailure = result.outcome === "PROVIDER_FAILURE" || result.outcome === "RETRYABLE_FAILURE";
  return Response.json(
    { status: providerFailure ? "provider failure" : "validation failure", reason: result.reason },
    { status: result.outcome === "RETRYABLE_FAILURE" ? 503 : providerFailure ? 502 : 400 },
  );
}
