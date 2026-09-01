import { SupportPage, SupportSection } from "@/components/support-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Service | AKA Sounds",
  description: "The usage terms for AKA Sounds digital audio products and this website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <SupportPage index="07 / TERMS" title="Terms of Service" description="The usage terms for AKA SOUNDS digital audio products and this website." updated="FEBRUARY 2026">
      <SupportSection heading="Agreement">
        <p>By accessing and using the AKA SOUNDS website, you accept and agree to be bound by the terms and provisions of this agreement.</p>
      </SupportSection>
      <SupportSection heading="1 / License and Usage">
        <p>All sample packs, presets, and audio files are 100% royalty-free. This means you can use them in your commercial and non-commercial musical productions without paying any royalties.</p>
        <p><strong>You may not:</strong></p>
        <ul>
          <li>Resell, distribute, or share the files as they are, or slightly modified, as another sample pack.</li>
          <li>Upload the raw isolated samples to platforms like Splice or similar services.</li>
        </ul>
      </SupportSection>
      <SupportSection heading="2 / Digital Goods">
        <p>We provide digital audio downloads. Please ensure hardware and software compatibility before purchase. Refunds are governed by the existing 14-day Refund Policy.</p>
      </SupportSection>
    </SupportPage>
  );
}
