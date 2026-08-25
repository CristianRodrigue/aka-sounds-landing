import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";

const PRODUCT_SLUG = "hardtechno-essentials-vol-1";

export function generateStaticParams() {
  return [{ slug: PRODUCT_SLUG }];
}

export default async function SoundPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== PRODUCT_SLUG) notFound();
  return <ProductDetailPage />;
}
