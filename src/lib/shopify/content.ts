import { hasShopifyConfig, shopifyFetch } from "./client";
import { HOMEPAGE_HERO_QUERY } from "./queries";
import type { CatalogImage } from "./types";

export interface HomepageHeroContent {
  id: string;
  handle: string;
  heading?: string;
  description?: string;
  desktopImage?: CatalogImage;
  mobileImage?: CatalogImage;
  ctaLabel?: string;
  ctaLink?: string;
  enabled: boolean;
}

interface MetaobjectFieldRaw {
  key: string;
  value?: string | null;
  reference?: { image?: { url: string; altText?: string | null; width?: number; height?: number } | null } | null;
}

interface HomepageHeroPayload {
  metaobjects: { nodes: Array<{ id: string; handle: string; fields: MetaobjectFieldRaw[] }> };
}

function value(fields: MetaobjectFieldRaw[], key: string) {
  return fields.find((field) => field.key === key)?.value?.trim();
}

function image(fields: MetaobjectFieldRaw[], key: string): CatalogImage | undefined {
  const raw = fields.find((field) => field.key === key)?.reference?.image;
  if (!raw) return undefined;
  return { url: raw.url, altText: raw.altText ?? "", width: raw.width, height: raw.height };
}

export async function getHomepageHeroes(): Promise<HomepageHeroContent[]> {
  if (!hasShopifyConfig()) return [];
  const data = await shopifyFetch<HomepageHeroPayload>(HOMEPAGE_HERO_QUERY);
  return data.metaobjects.nodes.map((entry) => ({
    id: entry.id,
    handle: entry.handle,
    heading: value(entry.fields, "heading"),
    description: value(entry.fields, "description"),
    desktopImage: image(entry.fields, "desktop_image"),
    mobileImage: image(entry.fields, "mobile_image"),
    ctaLabel: value(entry.fields, "cta_label"),
    ctaLink: value(entry.fields, "cta_link"),
    enabled: value(entry.fields, "enabled") !== "false",
  })).filter((entry) => entry.enabled && Boolean(
    entry.heading || entry.description || entry.desktopImage || entry.mobileImage || (entry.ctaLabel && entry.ctaLink),
  ));
}
