import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getSitemapResources } from "@/lib/shopify/sitemap";

// Keep publication changes visible without depending on two layers of ISR.
// Also let upstream failures return an error instead of a partial XML snapshot.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resources = await getSitemapResources();
  const routes = ["/", "/products", "/collections", "/blogs", "/contact", "/request-quote"];
  const entries: MetadataRoute.Sitemap = [
    ...routes.map((path) => ({ url: new URL(path, siteConfig.url).href })),
    ...resources.map(({ path, lastModified }) => ({
      url: new URL(path, siteConfig.url).href,
      ...(lastModified ? { lastModified } : {}),
    })),
  ];
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
