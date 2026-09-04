import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/lib/shopify/types";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

const fallbackPosts = [
  { date: "15/05/2024", title: "5 lưu ý khi chọn mua máy tạo oxy cho gia đình", image: "/assets/home-health.png", position: "75% 72%" },
  { date: "10/05/2024", title: "Hướng dẫn sử dụng máy đo huyết áp đúng cách", image: "/assets/home-health.png", position: "58% 82%" },
  { date: "05/05/2024", title: "Phân biệt các loại giường bệnh nhân hiện nay", image: "/assets/medical-hero.png", position: "65% 65%" },
  { date: "28/04/2024", title: "Bảo trì thiết bị y tế định kỳ quan trọng như thế nào?", image: "/assets/hospital-solutions.png", position: "80% 60%" },
];

export function News({ articles }: { articles: BlogArticle[] }) {
  const posts = articles.length
    ? articles.map((article) => ({
        id: article.id,
        date: new Intl.DateTimeFormat("vi-VN").format(new Date(article.publishedAt)),
        title: article.title,
        image: article.image?.url ?? "/assets/home-health.png",
        position: "center",
        href: `/blogs/${article.blogHandle}/${article.handle}`,
      }))
    : fallbackPosts.map((post) => ({ ...post, id: post.title, href: "/blogs" }));

  return <section id="tin-tuc" className="section news"><div className="section-heading"><h2>Tin tức - Kiến thức y tế</h2><Link href="/blogs">Xem tất cả bài viết →</Link></div><HorizontalCarousel label="bài viết" trackClassName="carousel__track--news">{posts.map((post) => <article className="news-card" key={post.id}><Link className="news-card__image" href={post.href}><Image src={post.image} alt={post.title} fill sizes="(max-width: 700px) 85vw, 265px" style={{ objectPosition: post.position }} /></Link><div><time>{post.date}</time><h3>{post.title}</h3><Link href={post.href}>Xem thêm →</Link></div></article>)}</HorizontalCarousel></section>;
}
