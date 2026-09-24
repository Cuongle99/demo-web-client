import type { BlogArticle, Product } from "@/lib/shopify/types";
import { siteConfig } from "@/config/site";

export const DEFAULT_SOCIAL_IMAGE = "/assets/logo-toan-tam.png";

export function conciseText(text: string, maxLength = 175) {
  const clean = text.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const fragment = clean.slice(0, maxLength + 1);
  const boundary = fragment.lastIndexOf(" ");
  return `${fragment.slice(0, boundary > maxLength * .65 ? boundary : maxLength).trim()}…`;
}

export function productMetaDescription(product: Product) {
  if (product.seo.description?.trim()) return product.seo.description.trim();
  const title = conciseText(product.title, 105).replace(/…$/, "");
  return conciseText(`${title}. Xem đặc điểm, hình ảnh, giá tham khảo và nhận tư vấn từ ${siteConfig.name}.`, 175);
}

export function articleMetaDescription(article: BlogArticle) {
  return conciseText(article.seo.description || article.excerpt || article.contentHtml, 175);
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).href,
    })),
  };
}

export function jsonLdString(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
