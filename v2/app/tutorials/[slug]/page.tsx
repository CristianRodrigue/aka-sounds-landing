import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("Tutorial | AKA Sounds");
export function generateStaticParams() { return [{ slug: "test" }]; }
export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) { return <RouteHarness route={`/tutorials/${(await params).slug}`} />; }
