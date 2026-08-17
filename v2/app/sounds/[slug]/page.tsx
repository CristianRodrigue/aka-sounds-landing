import { RouteHarness } from "@/components/route-harness";
export function generateStaticParams() { return [{ slug: "test" }]; }
export default async function SoundPage({ params }: { params: Promise<{ slug: string }> }) { return <RouteHarness route={`/sounds/${(await params).slug}`} />; }
