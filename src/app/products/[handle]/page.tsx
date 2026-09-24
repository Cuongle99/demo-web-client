import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductSpecifications } from "@/components/product/ProductSpecifications";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { getProduct, getProducts } from "@/lib/shopify/products";
import { metafieldValue, parseReferences, parseTechnicalSpecs } from "@/lib/shopify/item-content";
import { breadcrumbSchema, jsonLdString, productMetaDescription, productSchema, productVariantKey } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const shopifyTitle = product.seo.title?.trim();
  const title = shopifyTitle || product.title;
  const description = productMetaDescription(product);

  return {
    title: shopifyTitle ? { absolute: shopifyTitle } : title,
    description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      title,
      description,
      images: [product.featuredImage?.url || "/assets/logo-toan-tam.png"],
    },
  };
}

export default async function ProductPage({ params, searchParams }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const { variant: variantParam } = await searchParams;
  const product = await getProduct(handle);
  if (!product) notFound();

  const related = (await getProducts(12)).filter((item) => item.id !== product.id).slice(0, 10);
  const initialVariant = product.variants.find((variant) =>
    typeof variantParam === "string" && productVariantKey(variant) === variantParam,
  ) ?? product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const productPath = `/products/${encodeURIComponent(product.handle)}`;
  const technicalSpecs = parseTechnicalSpecs(metafieldValue(product.metafields, "technical_specs"));
  const references = parseReferences(metafieldValue(product.metafields, "seo_references"));
  const structuredProduct = productSchema(product);

  return (
    <div className="inner-page container">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Sản phẩm", href: "/products" },
          { label: product.title },
        ]}
      />
      <div className="product-detail">
        <ProductGallery product={product} />
        <ProductInfo key={initialVariant?.id} product={product} initialVariantId={initialVariant?.id} />
      </div>
      <section className="product-description">
        <div className="product-description__header">
          <span className="product-description__eyebrow">Thông tin chi tiết</span>
          <h2>Mô tả sản phẩm</h2>
        </div>
        <div className="product-description__content" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      </section>
      <ProductSpecifications product={product} extra={technicalSpecs} />
      {references.length ? <section className="product-sources"><h2>Nguồn tham khảo</h2><ul>{references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label}</a></li>)}</ul></section> : null}
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
      {structuredProduct && <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(structuredProduct) }}
      />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema([
        { name: "Trang chủ", path: "/" },
        { name: "Sản phẩm", path: "/products" },
        { name: product.title, path: productPath },
      ])) }} />
    </div>
  );
}
