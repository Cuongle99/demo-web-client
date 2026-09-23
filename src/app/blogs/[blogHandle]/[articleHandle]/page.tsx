import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getArticle } from "@/lib/shopify/blogs";
import { getSeoPage } from "@/lib/shopify/seo-content";
import { articleMetaDescription, breadcrumbSchema, DEFAULT_SOCIAL_IMAGE, jsonLdString } from "@/lib/seo";
import { siteConfig } from "@/config/site";

function normalizeArticleHeadings(html: string) {
  if (/<h2\b/i.test(html)) return html;
  const firstLevel = Number(html.match(/<h([3-6])\b/i)?.[1]);
  if (!firstLevel) return html;
  return html.replace(/<(\/?)h([3-6])\b/gi, (_tag, slash: string, level: string) =>
    `<${slash}h${Math.max(2, Number(level) - firstLevel + 2)}`);
}

export async function generateMetadata({ params }: PageProps<"/blogs/[blogHandle]/[articleHandle]">): Promise<Metadata> {
  const { blogHandle, articleHandle } = await params;
  const path = `/blogs/${decodeURIComponent(blogHandle)}/${decodeURIComponent(articleHandle)}`;
  const [article, seo] = await Promise.all([getArticle(decodeURIComponent(blogHandle), decodeURIComponent(articleHandle)), getSeoPage(path)]);
  if (!article) notFound();
  const title = seo?.title || article.seo.title || article.title;
  const description = seo?.description || articleMetaDescription(article);
  return { title, description, alternates: { canonical: path },
    openGraph: { title, description, type: "article", publishedTime: article.publishedAt,
      images: [seo?.socialImage?.url || article.image?.url || DEFAULT_SOCIAL_IMAGE] } };
}

export default async function ArticlePage({ params }: PageProps<"/blogs/[blogHandle]/[articleHandle]">) {
  const { blogHandle, articleHandle } = await params;
  const path = `/blogs/${decodeURIComponent(blogHandle)}/${decodeURIComponent(articleHandle)}`;
  const [article, seo] = await Promise.all([getArticle(decodeURIComponent(blogHandle), decodeURIComponent(articleHandle)), getSeoPage(path)]);
  if (!article) notFound();
  const fullUrl = new URL(path, siteConfig.url).href;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: seo?.description || articleMetaDescription(article),
    mainEntityOfPage: fullUrl,
    datePublished: article.publishedAt,
    ...(article.author ? { author: { "@type": "Person", name: article.author } } : {}),
    ...(article.image ? { image: article.image.url } : {}),
    publisher: { "@type": "Organization", name: siteConfig.name },
  };
  return <article className="article-page container">
    <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/blogs" }, { label: article.blogTitle }, { label: article.title }]} />
    <header>
      <p className="eyebrow">{article.blogTitle}</p>
      <h1>{seo?.heading || article.title}</h1>
      <div><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time>{article.author && <span> · {article.author}</span>}</div>
      {seo?.reviewerName && <p className="article-page__reviewer">Rà soát nội dung: {seo.reviewerName}{seo.reviewerRole ? ` — ${seo.reviewerRole}` : ""}{seo.reviewedAt ? ` · ${seo.reviewedAt}` : ""}</p>}
    </header>
    {article.image && <div className="article-page__hero"><Image src={article.image.url} alt={article.image.altText || article.title} fill priority sizes="(max-width: 900px) 100vw, 900px" /></div>}
    {seo?.intro && <p className="article-page__intro">{seo.intro}</p>}
    <div className="article-content" dangerouslySetInnerHTML={{ __html: normalizeArticleHeadings(article.contentHtml) }} />
    <p className="article-page__note">Nội dung cung cấp thông tin tham khảo về thiết bị hỗ trợ. Việc lựa chọn và sử dụng trong điều trị cần theo hướng dẫn của nhân viên y tế.</p>
    {seo?.references.length ? <section className="article-page__sources"><h2>Nguồn tham khảo</h2><ul>{seo.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label}</a></li>)}</ul></section> : null}
    {seo?.relatedLinks.length ? <section className="article-page__related"><h2>Khám phá thêm</h2><ul>{seo.relatedLinks.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></section> : null}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema([
      { name: "Trang chủ", path: "/" },
      { name: "Tin tức", path: "/blogs" },
      { name: article.title, path },
    ])) }} />
  </article>;
}
