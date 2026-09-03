import { DeatAkaProfile } from "@/components/deat-aka-profile";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "DEAT AKA | AKA Sounds",
  description: "Know DEAT AKA — producer, artist and the sound behind AKA Sounds.",
  path: "/deat_aka",
  image: "/assets/deat_portrait.png",
  imageAlt: "DEAT AKA portrait",
});

export default function DeatAkaPage() {
  return <DeatAkaProfile />;
}
