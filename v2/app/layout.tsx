import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "AKA SOUNDS V2 — G1B Scaffold", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
