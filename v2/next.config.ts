import type { NextConfig } from "next";

const pageCacheHeader = {
  key: "Cache-Control",
  value: "no-cache, max-age=0, must-revalidate",
};

const pageRoutes = [
  "/",
  "/about",
  "/contact",
  "/deat_aka",
  "/deat-aka",
  "/deat-aka/lab",
  "/free",
  "/free/:path*",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/terms",
  "/privacy",
  "/refunds",
  "/sounds",
  "/sounds/:path*",
  "/terms",
  "/tutorials",
  "/tutorials/:path*",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { qualities: [75, 90, 100] },
  async headers() {
    return pageRoutes.map((source) => ({
      source,
      headers: [pageCacheHeader],
    }));
  },
};

export default nextConfig;
