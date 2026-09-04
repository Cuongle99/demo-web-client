import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/mock-data";
import type { CollectionSummary } from "@/lib/shopify/types";

export function CategoryStrip({ collections }: { collections: CollectionSummary[] }) {
  const items = collections.length
    ? collections.map((collection) => ({ ...collection, image: collection.image?.url ?? "/assets/patient-monitor.png" }))
    : categories;

  return (
    <section className="section category-section">
      <div className="section-heading"><h2>Danh mục sản phẩm nổi bật</h2><Link href="/collections">Xem tất cả danh mục →</Link></div>
      <div className="category-grid">
        {items.map((category) => <Link className="category-card" href={`/collections/${category.handle}`} key={category.handle}><span className="category-card__image"><Image src={category.image} alt={category.title} fill sizes="140px" /></span><strong>{category.title}</strong></Link>)}
      </div>
    </section>
  );
}
