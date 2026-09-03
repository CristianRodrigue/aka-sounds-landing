import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const publicPaths = [
  "/",
  "/sounds/hardtechno-essentials-vol-1",
  "/sounds/modern-raw-kick-arsenal-vol-1",
  "/contact",
  "/privacy",
  "/terms",
  "/refunds",
  "/deat_aka",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
