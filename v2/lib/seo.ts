import type { Metadata } from "next";

export const SITE_URL = "https://akasounds.com";
export const DEFAULT_OG_IMAGE = "/assets/modern-raw-kick-arsenal-vol-1-cover.png";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = "AKA Sounds sample pack artwork",
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: new URL(path, SITE_URL),
      siteName: "AKA Sounds",
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function createNoindexMetadata(title: string): Metadata {
  return { title, robots: { index: false, follow: false } };
}
