import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("Tutorials | AKA Sounds");
export default function TutorialsPage() { return <RouteHarness route="/tutorials" />; }
