import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("Privacy Policy | AKA Sounds");
export default function PrivacyPage() { return <RouteHarness route="/legal/privacy" />; }
