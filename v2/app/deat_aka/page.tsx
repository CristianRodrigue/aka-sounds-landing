import { DeatAkaProfile } from "@/components/deat-aka-profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "DEAT AKA | AKA Sounds",
  description: "Know DEAT AKA — producer, artist and the sound behind AKA Sounds.",
  path: "/deat_aka",
  image: "/deat-aka/WhatDidUComeFor.jpg",
  imageAlt: "What Did U Come For? single artwork by DEAT AKA",
});

export default function DeatAkaPage() {
  return <DeatAkaProfile />;
}
