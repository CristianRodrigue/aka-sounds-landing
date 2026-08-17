import { RouteHarness } from "@/components/route-harness";
export function generateStaticParams() { return [{ slug: "test" }]; }
export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) { return <RouteHarness route={`/tutorials/${(await params).slug}`} />; }
