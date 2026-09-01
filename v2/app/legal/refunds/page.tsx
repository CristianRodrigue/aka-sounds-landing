import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("Refund Policy | AKA Sounds");
export default function RefundsPage() { return <RouteHarness route="/legal/refunds" />; }
