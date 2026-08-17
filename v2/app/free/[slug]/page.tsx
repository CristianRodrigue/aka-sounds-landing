import { RouteHarness } from "@/components/route-harness";
export function generateStaticParams() { return [{ slug: "test" }]; }
export default async function FreeDetailPage({ params }: { params: Promise<{ slug: string }> }) { return <RouteHarness route={`/free/${(await params).slug}`} />; }
