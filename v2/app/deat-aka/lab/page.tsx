import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("DEAT AKA Lab | AKA Sounds");
export default function DeatAkaLabPage() { return <RouteHarness route="/deat-aka/lab" note="Reserved for G10B — DEAT AKA LAB. No Lab technology is loaded in G1B." />; }
