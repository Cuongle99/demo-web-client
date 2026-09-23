import "server-only";

import { createHash } from "node:crypto";
import { hasShopifyConfig, shopifyFetch } from "./client";
import type { CatalogImage } from "./types";

export interface SeoPageContent {
  pagePath: string;
  title?: string;
  description?: string;
  heading?: string;
  intro?: string;
  socialImage?: CatalogImage;
  reviewerName?: string;
  reviewerRole?: string;
  reviewedAt?: string;
  references: Array<{ label: string; url: string }>;
  relatedLinks: Array<{ label: string; href: string }>;
  technicalSpecs: Array<{ label: string; value: string }>;
}

interface SeoPagePayload {
  metaobject: {
    fields: Array<{
      key: string;
      value: string | null;
      reference: { image?: { url: string; altText?: string | null; width?: number; height?: number } | null } | null;
    }>;
  } | null;
}

const SEO_PAGE_QUERY = `#graphql
  query SeoPage($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      fields {
        key value
        reference {
          ... on MediaImage { image { url altText width height } }
        }
      }
    }
  }
`;

export function normalizeSeoPath(path: string) {
  let decoded = path;
  try { decoded = decodeURIComponent(path); } catch { /* Retain the original path. */ }
  return (decoded.split("?")[0].replace(/\/$/, "") || "/").normalize("NFC");
}

export function seoPageHandle(path: string) {
  return `seo-${createHash("sha256").update(normalizeSeoPath(path)).digest("hex").slice(0, 20)}`;
}

function lines(value?: string) {
  return value?.split(/\r?\n/).map((line) => line.trim()).filter(Boolean) ?? [];
}

function parseReferences(value?: string) {
  return lines(value).flatMap((line) => {
    const [label, rawUrl] = line.split("|", 2).map((part) => part.trim());
    try {
      const url = new URL(rawUrl);
      return url.protocol === "https:" ? [{ label: label || url.hostname, url: url.href }] : [];
    } catch { return []; }
  });
}

function parseRelatedLinks(value?: string) {
  return lines(value).flatMap((line) => {
    const [label, href] = line.split("|", 2).map((part) => part.trim());
    return label && href?.startsWith("/") && !href.startsWith("//") ? [{ label, href }] : [];
  });
}

function parseTechnicalSpecs(value?: string) {
  return lines(value).flatMap((line) => {
    const [label, specValue] = line.split("|", 2).map((part) => part.trim());
    return label && specValue ? [{ label, value: specValue }] : [];
  });
}

export async function getSeoPage(path: string): Promise<SeoPageContent | null> {
  if (!hasShopifyConfig()) return null;
  const pagePath = normalizeSeoPath(path);
  try {
    const data = await shopifyFetch<SeoPagePayload>(SEO_PAGE_QUERY, {
      handle: { type: "seo_page", handle: seoPageHandle(pagePath) },
    });
    if (!data.metaobject) return null;
    const fields = data.metaobject.fields;
    const field = (key: string) => fields.find((item) => item.key === key);
    const value = (key: string) => field(key)?.value?.trim() || undefined;
    if (value("page_path") !== pagePath) return null;
    const rawImage = field("social_image")?.reference?.image;
    return {
      pagePath,
      title: value("seo_title"),
      description: value("meta_description"),
      heading: value("heading"),
      intro: value("intro"),
      socialImage: rawImage ? {
        url: rawImage.url,
        altText: rawImage.altText ?? "",
        width: rawImage.width,
        height: rawImage.height,
      } : undefined,
      reviewerName: value("reviewer_name"),
      reviewerRole: value("reviewer_role"),
      reviewedAt: value("reviewed_at"),
      references: parseReferences(value("references")),
      relatedLinks: parseRelatedLinks(value("related_links")),
      technicalSpecs: parseTechnicalSpecs(value("technical_specs")),
    };
  } catch (error) {
    console.error(`Could not load Shopify SEO Page for ${pagePath}:`, error);
    return null;
  }
}
