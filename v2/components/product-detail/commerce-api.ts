const configuredCommerceApiOrigin = process.env.NEXT_PUBLIC_COMMERCE_API_ORIGIN?.trim().replace(/\/+$/, "") ?? "";

export function buildCommerceApiUrl(path: string, origin = configuredCommerceApiOrigin): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${normalizedPath}` : normalizedPath;
}

export function commerceApiUrl(path: string): string {
  return buildCommerceApiUrl(path);
}
