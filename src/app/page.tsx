import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CategoryStrip } from "@/components/sections/CategoryStrip";
import { TrustBand } from "@/components/sections/TrustBand";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Services } from "@/components/sections/Services";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { ProductListSection } from "@/components/sections/ProductListSection";
import { News } from "@/components/sections/News";
import { getProducts } from "@/lib/shopify/products";
import { getCollections } from "@/lib/shopify/collections";
import { getBlogArticles } from "@/lib/shopify/blogs";
import { getHomepageHeroes } from "@/lib/shopify/content";
import { getSeoPage } from "@/lib/shopify/seo-content";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoPage("/");
  const description = seo?.description || "Thiết bị y tế chính hãng cho gia đình, bệnh viện và phòng khám. Khám phá sản phẩm và nhận tư vấn từ Toàn Tâm Medical.";
  return {
    title: { absolute: seo?.title || "TOÀN TÂM | Thiết bị y tế chính hãng" },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: seo?.title || "Toàn Tâm Medical",
      description,
      images: [seo?.socialImage?.url || DEFAULT_SOCIAL_IMAGE],
    },
  };
}

export default async function Home() {
  const [products, collections, articles, heroes, seo] = await Promise.all([
    getProducts(12),
    getCollections(8),
    getBlogArticles(12),
    getHomepageHeroes(),
    getSeoPage("/"),
  ]);

  return (
    <div className="page-shell">
      <Hero slides={heroes} />
      <section className="home-intro" aria-labelledby="home-title">
        <p className="eyebrow">Toàn Tâm Medical</p>
        <h1 id="home-title">{seo?.heading || "Thiết bị y tế cho gia đình và cơ sở y tế"}</h1>
        <p>{seo?.intro || "Khám phá thiết bị chăm sóc sức khỏe, hỗ trợ phục hồi chức năng và giải pháp cho bệnh viện, phòng khám. Toàn Tâm tư vấn lựa chọn sản phẩm theo nhu cầu sử dụng."}</p>
      </section>
      <CategoryStrip collections={collections} />
      <TrustBand />
      <FeaturedProducts products={products} />
      <Services />
      <PromoBanners />
      <ProductListSection products={products} />
      <News articles={articles} />
    </div>
  );
}
