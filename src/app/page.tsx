import { Hero } from "@/components/sections/Hero";
import { CategoryStrip } from "@/components/sections/CategoryStrip";
import { TrustBand } from "@/components/sections/TrustBand";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Services } from "@/components/sections/Services";
import { PromoBanners } from "@/components/sections/PromoBanners";
import { News } from "@/components/sections/News";
import { getProducts } from "@/lib/shopify/products";
import { getCollections } from "@/lib/shopify/collections";
import { getBlogArticles } from "@/lib/shopify/blogs";
import { getHomepageHeroes } from "@/lib/shopify/content";

export default async function Home() {
  const [products, collections, articles, heroes] = await Promise.all([
    getProducts(12),
    getCollections(8),
    getBlogArticles(12),
    getHomepageHeroes(),
  ]);

  return (
    <div className="page-shell">
      <Hero slides={heroes} />
      <CategoryStrip collections={collections} />
      <TrustBand />
      <FeaturedProducts products={products} />
      <Services />
      <PromoBanners />
      <News articles={articles} />
    </div>
  );
}
