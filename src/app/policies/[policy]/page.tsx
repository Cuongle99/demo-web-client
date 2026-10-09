import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/config/site";
import { getPolicy, policies } from "@/content/policies";
import { breadcrumbSchema, jsonLdString, pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

type Props = { params: Promise<{ policy: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return policies.map(({ slug }) => ({ policy: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const policy = getPolicy((await params).policy);
  if (!policy) notFound();
  return pageMetadata({ title: policy.title, description: policy.description, path: `/policies/${policy.slug}` });
}

export default async function PolicyPage({ params }: Props) {
  const policy = getPolicy((await params).policy);
  if (!policy) notFound();
  const path = `/policies/${policy.slug}`;
  return (
    <div className="inner-page container">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: policy.title }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: policy.title, path }])) }} />
      <article className={styles.article}>
        <header><p className="eyebrow">Thông tin mua hàng</p><h1>{policy.title}</h1><p className={styles.intro}>{policy.intro}</p></header>
        {policy.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
        <section><h2>Liên hệ Toàn Tâm</h2><p>Để nhận báo giá hoặc được hỗ trợ về đơn hàng, gọi <a href={siteConfig.phoneHref}>{siteConfig.phone}</a> hoặc gửi email đến <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p><p><Link href="/request-quote">Gửi yêu cầu báo giá</Link> · <Link href="/contact">Xem thông tin liên hệ</Link></p></section>
      </article>
    </div>
  );
}
