import { RouteHarness } from "@/components/route-harness";
import { createNoindexMetadata } from "@/lib/seo";
export const metadata = createNoindexMetadata("Free Edition | AKA Sounds");
export function generateStaticParams() { return [{ slug: "test" }]; }
export default async function FreeDetailPage({ params }: { params: Promise<{ slug: string }> }) { return <RouteHarness route={`/free/${(await params).slug}`} />; }
