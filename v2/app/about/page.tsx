import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("About | AKA Sounds");
export default function AboutPage() { return <RouteHarness route="/about" />; }
