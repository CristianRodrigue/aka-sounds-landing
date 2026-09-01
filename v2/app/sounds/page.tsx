import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("Sample Packs | AKA Sounds");
export default function SoundsPage() { return <RouteHarness route="/sounds" />; }
