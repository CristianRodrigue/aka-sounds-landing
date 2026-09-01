import { AkaHomepage } from "@/components/homepage";
import { StructuredData } from "@/components/structured-data";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "AKA SOUNDS — Sound Design for the Harder Side of Music",
  description: "AKA Sounds creates sound design and sample packs for hard dance, rawstyle, hardstyle and hard techno producers.",
  path: "/",
  imageAlt: "Modern Raw Kick Arsenal Vol. 1 artwork",
});

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "AKA Sounds",
              url: SITE_URL,
              description: "Sound design and sample packs for hard dance, rawstyle, hardstyle and hard techno producers.",
              logo: `${SITE_URL}/assets/aka-logo-symbol-white-official.png`,
              sameAs: [
                "https://www.youtube.com/@Aka_sounds",
                "https://soundcloud.com/deat_aka",
                "https://www.instagram.com/aka_sounds/",
                "https://open.spotify.com/intl-es/artist/2J50ThxDETbxoqoT4KP9bU?si=e1WUj9Z6TfOckAKzqED8hg",
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "AKA Sounds",
              url: SITE_URL,
              description: "Sound design and sample packs for hard dance, rawstyle, hardstyle and hard techno producers.",
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ],
        }}
      />
      <AkaHomepage />
    </>
  );
}
