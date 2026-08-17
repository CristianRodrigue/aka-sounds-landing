type RouteHarnessProps = { route: string; note?: string };

export function RouteHarness({ route, note }: RouteHarnessProps) {
  return <main style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 1.5rem" }}><p style={{ letterSpacing: "0.12em", fontSize: "0.75rem" }}>AKA SOUNDS V2</p><h1>G1B ROUTE SCAFFOLD</h1><p>Route: {route}</p>{note ? <p>{note}</p> : null}</main>;
}
