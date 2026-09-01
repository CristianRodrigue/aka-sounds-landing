import { SupportPage, SupportSection } from "@/components/support-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact AKA Sounds",
  description: "Contact AKA Sounds for support with sample packs, downloads and the AKA Sounds archive.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <SupportPage index="07 / CONTACT" title="Contact AKA SOUNDS" description="Support for sample packs, downloads, and questions about the AKA SOUNDS archive.">
      <SupportSection heading="Support">
        <p>Need support or have a question about a pack?</p>
        <p>You can reach out to us at any time. We usually respond within 24-48 hours.</p>
      </SupportSection>
      <SupportSection heading="Email">
        <p><a className="support-page-inline-link" href="mailto:contact@akasounds.com">contact@akasounds.com</a></p>
      </SupportSection>
      <SupportSection heading="Instagram">
        <p><a className="support-page-inline-link" href="https://www.instagram.com/aka_sounds/" target="_blank" rel="noopener noreferrer">@aka_sounds <span aria-hidden="true">→</span></a></p>
      </SupportSection>
    </SupportPage>
  );
}
