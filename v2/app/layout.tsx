import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "AKA SOUNDS — Sound Design for the Harder Side of Music", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
