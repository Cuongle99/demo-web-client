import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getArticle } from "@/lib/shopify/blogs";

export async function generateMetadata({ params }: PageProps<"/blogs/[blogHandle]/[articleHandle]">): Promise<Metadata> {
  const { blogHandle, articleHandle } = await params;
  const article = await getArticle(blogHandle, articleHandle);
  if (!article) return { title: "Không tìm thấy bài viết" };
  return { title: article.seo.title || article.title, description: article.seo.description || article.excerpt, alternates: { canonical: `/blogs/${blogHandle}/${articleHandle}` }, openGraph: { title: article.seo.title || article.title, description: article.seo.description || article.excerpt, type: "article", publishedTime: article.publishedAt, images: article.image ? [{ url: article.image.url }] : undefined } };
}

export default async function ArticlePage({ params }: PageProps<"/blogs/[blogHandle]/[articleHandle]">) {
  const { blogHandle, articleHandle } = await params;
  const article = await getArticle(blogHandle, articleHandle);
  if (!article) notFound();
  return <article className="article-page container"><Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/blogs" }, { label: article.blogTitle }, { label: article.title }]} /><header><p className="eyebrow">{article.blogTitle}</p><h1>{article.title}</h1><div><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time>{article.author && <span> · {article.author}</span>}</div></header>{article.image && <div className="article-page__hero"><Image src={article.image.url} alt={article.image.altText || article.title} fill priority sizes="(max-width: 900px) 100vw, 900px" /></div>}<div className="article-content" dangerouslySetInnerHTML={{ __html: article.contentHtml }} /></article>;
}
