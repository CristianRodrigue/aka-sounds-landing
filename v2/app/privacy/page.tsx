import { SupportPage, SupportSection } from "@/components/support-page";

export default function PrivacyPage() {
  return (
    <SupportPage index="07 / PRIVACY" title="Privacy Policy" description="How AKA SOUNDS handles information needed to provide the site, purchases, downloads, and newsletter." updated="FEBRUARY 2026">
      <SupportSection heading="AKA SOUNDS">
        <p>Welcome to AKA SOUNDS. We are committed to protecting your privacy and ensuring you have a secure experience on our website.</p>
      </SupportSection>
      <SupportSection heading="1 / Information We Collect">
        <p>We may collect personal information such as your name, email address, and payment details when you purchase our sample packs or sign up for our newsletter. This information is processed securely through our payment providers.</p>
      </SupportSection>
      <SupportSection heading="2 / How We Use Your Information">
        <p>Your information is used solely to process your transactions, deliver your purchased digital goods, and provide customer support. We may occasionally send promotional emails about new releases, which you can opt out of at any time.</p>
      </SupportSection>
      <SupportSection heading="3 / Cookies and Tracking">
        <p>We use essential cookies to maintain your session and ensure the website functions correctly.</p>
      </SupportSection>
      <SupportSection heading="4 / Data Sharing">
        <p>We do not sell, trade, or rent your personal information to third parties. Your data is only shared with necessary third-party service providers, such as payment processors, to complete your transactions.</p>
      </SupportSection>
    </SupportPage>
  );
}