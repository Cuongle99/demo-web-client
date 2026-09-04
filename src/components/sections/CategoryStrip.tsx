import Image from "next/image";
import Link from "next/link";
import { CollectionIcon } from "@/components/collection/CollectionIcon";
import { categories } from "@/lib/mock-data";
import type { CollectionSummary } from "@/lib/shopify/types";

export function CategoryStrip({ collections }: { collections: CollectionSummary[] }) {
  const items = collections.length
    ? collections
    : categories.map((category) => ({
        id: `mock-${category.handle}`,
        handle: category.handle,
        title: category.title,
        description: "",
        image: { url: category.image, altText: category.title },
        seo: {},
      }));

  return (
    <section className="section category-section">
      <div className="section-heading"><h2>Danh mục sản phẩm nổi bật</h2><Link href="/collections">Xem tất cả danh mục →</Link></div>
      <div className="category-grid">
        {items.map((category, index) => (
          <Link className="category-card" href={`/collections/${category.handle}`} key={category.handle}>
            <span className={`category-card__image collection-list-card__media--tone-${(index % 4) + 1}`}>
              {category.image ? (
                <Image src={category.image.url} alt={category.image.altText || category.title} fill sizes="140px" />
              ) : (
                <span className="collection-list-card__icon" aria-hidden="true">
                  <CollectionIcon handle={category.handle} title={category.title} />
                </span>
              )}
            </span>
            <strong>{category.title}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}
