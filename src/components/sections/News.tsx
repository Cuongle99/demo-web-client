import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/lib/shopify/types";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

export function News({ articles }: { articles: BlogArticle[] }) {
  if (!articles.length) return null;
  const posts = articles.map((article) => ({
        id: article.id,
        date: new Intl.DateTimeFormat("vi-VN").format(new Date(article.publishedAt)),
        title: article.title,
        image: article.image?.url ?? "/assets/home-health.png",
        position: "center",
        href: `/blogs/${article.blogHandle}/${article.handle}`,
      }));

  return <section id="tin-tuc" className="section news"><div className="section-heading"><h2>Tin tức - Kiến thức y tế</h2><Link href="/blogs">Xem tất cả bài viết →</Link></div><HorizontalCarousel label="bài viết" trackClassName="carousel__track--news">{posts.map((post) => <article className="news-card" key={post.id}><Link className="news-card__image" href={post.href}><Image src={post.image} alt={post.title} fill sizes="(max-width: 700px) 85vw, 265px" style={{ objectPosition: post.position }} /></Link><div><time>{post.date}</time><h3>{post.title}</h3><Link href={post.href} aria-label={`Đọc bài: ${post.title}`}>Xem thêm →</Link></div></article>)}</HorizontalCarousel></section>;
}
