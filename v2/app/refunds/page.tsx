import { SupportPage, SupportSection } from "@/components/support-page";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Refund Policy | AKA Sounds",
  description: "The AKA Sounds 14-day unconditional refund policy for digital sample pack purchases.",
  path: "/refunds",
});

export default function RefundsPage() {
  return (
    <SupportPage index="07 / REFUNDS" title="Refund Policy" description="The refund information currently present in the AKA SOUNDS legal source." updated="MARCH 2026">
      <SupportSection heading="14-Day Unconditional Refund Policy">
        <p>We offer a full, unconditional refund within 14 days of your purchase date. You can request a refund for any reason.</p>
        <p>To request a refund, please contact us at <a href="mailto:contact@akasounds.com">contact@akasounds.com</a> with your order details within 14 days of purchase. We will process your return promptly. There are absolutely no qualifiers, conditions, or exceptions to this policy.</p>
      </SupportSection>

    </SupportPage>
  );
}
