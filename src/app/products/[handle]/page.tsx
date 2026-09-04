import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductSpecifications } from "@/components/product/ProductSpecifications";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { siteConfig } from "@/config/site";
import { getProduct, getProducts } from "@/lib/shopify/products";

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = (await getProducts(12)).filter((item) => item.id !== product.id).slice(0, 10);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((image) => image.url),
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: product.vendor || siteConfig.name },
  };

  return (
    <div className="inner-page container">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Sản phẩm", href: "/collections/thiet-bi-y-te" },
          { label: product.title },
        ]}
      />
      <div className="product-detail">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>
      <section className="product-description">
        <h2>Mô tả sản phẩm</h2>
        <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      </section>
      <ProductSpecifications product={product} />
      {related.length > 0 && (
        <section className="related-products">
          <div className="section-heading"><h2>Sản phẩm liên quan</h2></div>
          {related.length > 5 ? (
            <HorizontalCarousel label="sản phẩm liên quan" trackClassName="carousel__track--products">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </HorizontalCarousel>
          ) : (
            <div className="related-products__grid">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          )}
        </section>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
