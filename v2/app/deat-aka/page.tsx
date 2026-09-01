import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("DEAT AKA | AKA Sounds");
export default function DeatAkaPage() { return <RouteHarness route="/deat-aka" />; }
