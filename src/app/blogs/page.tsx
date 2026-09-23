import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getBlogArticles } from "@/lib/shopify/blogs";
import { getSeoPage } from "@/lib/shopify/seo-content";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoPage("/blogs");
  const title = seo?.title || "Tin tức - Kiến thức";
  const description = seo?.description || "Kiến thức chọn thiết bị chăm sóc sức khỏe, hỗ trợ vận động và phục hồi chức năng tại nhà từ Toàn Tâm Medical.";
  return { title, description, alternates: { canonical: "/blogs" },
    openGraph: { title, description, images: [seo?.socialImage?.url || DEFAULT_SOCIAL_IMAGE] } };
}

export default async function BlogsPage() {
  const [articles, seo] = await Promise.all([getBlogArticles(50), getSeoPage("/blogs")]);
  return <div className="inner-page container"><Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức" }]} /><header className="collection-header"><p className="eyebrow">Tin tức</p><h1>{seo?.heading || "Kiến thức & tư vấn"}</h1><p>{seo?.intro || "Nội dung được cập nhật trực tiếp từ Shopify Blog."}</p></header>{articles.length ? <div className="blog-list-grid">{articles.map((article) => <article className="blog-list-card" key={article.id}><Link className="blog-list-card__image" href={`/blogs/${article.blogHandle}/${article.handle}`}>{article.image && <Image src={article.image.url} alt={article.image.altText || article.title} fill sizes="(max-width: 700px) 100vw, 360px" />}</Link><div><time>{new Intl.DateTimeFormat("vi-VN").format(new Date(article.publishedAt))}</time><h2><Link href={`/blogs/${article.blogHandle}/${article.handle}`}>{article.title}</Link></h2>{article.excerpt && <p>{article.excerpt}</p>}<Link className="text-link" href={`/blogs/${article.blogHandle}/${article.handle}`}>Đọc bài viết →</Link></div></article>)}</div> : <div className="empty-state"><h2>Chưa có bài viết được xuất bản</h2><p>Hãy tạo và xuất bản bài viết trong Shopify Blog.</p></div>}</div>;
}
