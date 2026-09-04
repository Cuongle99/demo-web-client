import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getCollections } from "@/lib/shopify/collections";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm",
  description: "Khám phá các danh mục sản phẩm được quản lý trực tiếp trên Shopify.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await getCollections(50);
  return <div className="inner-page container"><Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Danh mục" }]} /><header className="collection-header"><p className="eyebrow">Danh mục</p><h1>Tất cả danh mục sản phẩm</h1></header>{collections.length ? <div className="collection-list-grid">{collections.map((collection) => <Link href={`/collections/${collection.handle}`} className="collection-list-card" key={collection.id}><span>{collection.image && <Image src={collection.image.url} alt={collection.image.altText || collection.title} fill sizes="(max-width: 700px) 50vw, 320px" />}</span><div><h2>{collection.title}</h2>{collection.description && <p>{collection.description}</p>}</div></Link>)}</div> : <div className="empty-state"><h2>Chưa có danh mục được xuất bản</h2><p>Hãy xuất bản collection vào kênh Headless trong Shopify.</p></div>}</div>;
}
