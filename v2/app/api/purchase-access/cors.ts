const ALLOWED_FRONTEND_ORIGIN = "https://akasounds.com";

function corsHeaders(request: Request, allowedMethods: string): Headers {
  const headers = new Headers();
  headers.set("Vary", "Origin");
  if (request.headers.get("origin") === ALLOWED_FRONTEND_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", ALLOWED_FRONTEND_ORIGIN);
    headers.set("Access-Control-Allow-Methods", allowedMethods);
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    headers.set("Access-Control-Max-Age", "600");
  }
  return headers;
}

export function withPurchaseAccessCors(
  request: Request,
  response: Response,
  allowedMethods: string,
): Response {
  const headers = corsHeaders(request, allowedMethods);
  const responseHeaders = new Headers(response.headers);
  headers.forEach((value, key) => responseHeaders.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export function purchaseAccessOptions(request: Request, allowedMethods: string): Response {
  const origin = request.headers.get("origin");
  const status = origin === null || origin === ALLOWED_FRONTEND_ORIGIN ? 204 : 403;
  return withPurchaseAccessCors(request, new Response(null, { status }), allowedMethods);
}
