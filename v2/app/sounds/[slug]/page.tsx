import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { ProductDetailPage } from "@/components/product-detail/product-detail-page";
import { getProductDetailBySlug, productDetails } from "@/components/product-detail/product-data";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);
  if (!product) return { title: "Product not found | AKA Sounds", robots: { index: false, follow: false } };

  return createPageMetadata({
    title: product.displayName,
    description: product.description,
    path: `/sounds/${product.slug}`,
    image: product.artwork,
    imageAlt: `${product.displayName} artwork`,
  });
}

export function generateStaticParams() {
  return productDetails.map((product) => ({ slug: product.slug }));
}

export default async function SoundPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);
  if (!product) notFound();

  const productUrl = `${SITE_URL}/sounds/${product.slug}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} ${product.volume}`,
    description: product.description,
    image: [`${SITE_URL}${product.artwork}`],
    url: productUrl,
    brand: { "@type": "Brand", name: "AKA Sounds" },
    category: product.genre,
    additionalProperty: product.includedContent.map((item) => ({
      "@type": "PropertyValue",
      name: item.title,
      value: item.detail,
    })),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: product.currentPrice.replace(/[^0-9.]/g, ""),
      availability: "https://schema.org/InStock",
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AKA Sounds", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sample Packs", item: `${SITE_URL}/#sample-packs` },
      { "@type": "ListItem", position: 3, name: product.displayName, item: productUrl },
    ],
  };

  return (
    <>
      <StructuredData data={productJsonLd} />
      <StructuredData data={breadcrumbJsonLd} />
      <ProductDetailPage product={product} />
    </>
  );
}
