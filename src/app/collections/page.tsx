import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CollectionIcon } from "@/components/collection/CollectionIcon";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCollections } from "@/lib/shopify/collections";
import { getSeoPage } from "@/lib/shopify/seo-content";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";
import { categories } from "@/lib/mock-data";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoPage("/collections");
  const title = seo?.title || "Danh mục sản phẩm";
  const description = seo?.description || "Khám phá các danh mục thiết bị chăm sóc sức khỏe và hỗ trợ phục hồi chức năng tại Toàn Tâm Medical.";
  return { title, description, alternates: { canonical: "/collections" },
    openGraph: { title, description, images: [seo?.socialImage?.url || DEFAULT_SOCIAL_IMAGE] } };
}

export default async function CollectionsPage() {
  const [collections, seo] = await Promise.all([getCollections(50), getSeoPage("/collections")]);
  const displayCollections = collections.length
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
    <div className="inner-page container collections-page">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Danh mục" }]} />

      <header className="collections-hero">
        <div>
          <p className="eyebrow">Danh mục sản phẩm</p>
          <h1>{seo?.heading || "Chọn sản phẩm theo nhu cầu"}</h1>
          <p className="collections-hero__lead">
            {seo?.intro || "Khám phá các nhóm sản phẩm chăm sóc sức khỏe, phục hồi chức năng và tiện ích gia đình đang có tại Toàn Tâm."}
          </p>
        </div>
        <div className="collections-hero__summary" aria-label={`${displayCollections.length} danh mục đang hiển thị`}>
          <strong>{displayCollections.length}</strong>
          <span>Danh mục<br />đang hiển thị</span>
        </div>
      </header>

      {displayCollections.length ? (
        <section aria-labelledby="collection-grid-title">
          <div className="collection-list-intro">
            <div>
              <h2 id="collection-grid-title">Khám phá theo danh mục</h2>
              <p>Chọn một danh mục để xem toàn bộ sản phẩm phù hợp.</p>
            </div>
          </div>
          <div className="collection-list-grid">
            {displayCollections.map((collection, index) => (
              <Link href={`/collections/${collection.handle}`} className="collection-list-card" key={collection.id}>
                <span className={`collection-list-card__media collection-list-card__media--tone-${(index % 4) + 1}`}>
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 25vw"
                    />
                  ) : (
                    <span className="collection-list-card__icon" aria-hidden="true">
                      <CollectionIcon handle={collection.handle} title={collection.title} />
                    </span>
                  )}
                </span>
                <span className="collection-list-card__content">
                  <span className="collection-list-card__label">Danh mục sản phẩm</span>
                  <h2>{collection.title}</h2>
                  <p>{collection.description || "Xem các sản phẩm hiện có trong danh mục này."}</p>
                  <span className="collection-list-card__link">Khám phá <ArrowRight weight="bold" /></span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-state">
          <h2>Chưa có danh mục được xuất bản</h2>
          <p>Hãy xuất bản collection vào kênh Headless trong Shopify.</p>
        </div>
      )}
    </div>
  );
}
