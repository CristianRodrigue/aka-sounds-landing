import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("Free Sounds | AKA Sounds");
export default function FreePage() { return <RouteHarness route="/free" />; }
