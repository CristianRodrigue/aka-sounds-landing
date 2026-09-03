import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { CookieConsent } from "@/components/cookie-consent";
import { HashRouteCompatibility } from "@/components/hash-route-compatibility";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AKA SOUNDS — Sound Design for the Harder Side of Music",
  description: "AKA Sounds creates sound design and sample packs for hard dance, rawstyle, hardstyle and hard techno producers.",
  applicationName: "AKA Sounds",
  keywords: [
    "rawstyle samples",
    "rawstyle kicks",
    "hardstyle samples",
    "hard dance samples",
    "hardtechno samples",
    "kick samples",
    "sound design",
    "Serum 2 presets",
    "FL Studio kick projects",
    "sample packs",
    "royalty-free samples",
  ],
  creator: "AKA Sounds",
  publisher: "AKA Sounds",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "AKA Sounds",
    title: "AKA SOUNDS — Sound Design for the Harder Side of Music",
    description: "Sound design and sample packs for hard dance, rawstyle, hardstyle and hard techno producers.",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Modern Raw Kick Arsenal Vol. 1 artwork" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AKA SOUNDS — Sound Design for the Harder Side of Music",
    description: "Sound design and sample packs for hard dance, rawstyle, hardstyle and hard techno producers.",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: { icon: "/assets/aka-logo-symbol-white-official.png" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><HashRouteCompatibility />{children}<CookieConsent /></body></html>;
}
