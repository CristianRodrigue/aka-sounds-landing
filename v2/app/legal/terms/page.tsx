import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("Terms of Service | AKA Sounds");
export default function TermsPage() { return <RouteHarness route="/legal/terms" />; }
