import "server-only";
import { mockProducts } from "@/lib/mock-data";
import { shouldUseMockData, shopifyFetch } from "./client";

export const SITEMAP_PRODUCTS_QUERY = `#graphql
  query SitemapProducts($after: String) {
    products(first: 250, after: $after, sortKey: ID) {
      nodes { handle }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const SITEMAP_COLLECTIONS_QUERY = `#graphql
  query SitemapCollections($after: String) {
    collections(first: 250, after: $after, sortKey: ID) {
      nodes { handle }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const SITEMAP_ARTICLES_QUERY = `#graphql
  query SitemapArticles($after: String) {
    articles(first: 250, after: $after, sortKey: ID) {
      nodes { handle blog { handle } }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

type SitemapNode = { handle: string; updatedAt?: string; blog?: { handle: string } };
type Connection = { nodes: SitemapNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
export type SitemapResource = { path: string; lastModified?: string };

export async function getSitemapResources(): Promise<SitemapResource[]> {
  if (shouldUseMockData()) {
    return mockProducts.map((product) => ({ path: `/products/${encodeURIComponent(product.handle)}` }));
  }

  async function collect(key: "products" | "collections" | "articles", query: string) {
    const resources: SitemapResource[] = [];
    const seenCursors = new Set<string>();
    let after: string | null = null;
    while (true) {
      const data: Record<string, Connection> = await shopifyFetch<Record<string, Connection>>(query, { after });
      const connection: Connection = data[key];
      for (const node of connection.nodes) {
        const handle = encodeURIComponent(node.handle);
        if (key === "articles" && !node.blog?.handle) throw new Error("Sitemap article is missing its blog handle.");
        resources.push({
          path: key === "articles" ? `/blogs/${encodeURIComponent(node.blog!.handle)}/${handle}` : `/${key}/${handle}`,
        });
      }
      if (!connection.pageInfo.hasNextPage) break;
      const cursor: string | null = connection.pageInfo.endCursor;
      // Fail instead of caching an apparently successful but truncated sitemap.
      if (!cursor || seenCursors.has(cursor)) throw new Error(`Sitemap pagination did not advance for ${key}.`);
      seenCursors.add(cursor);
      after = cursor;
    }
    return resources;
  }

  return (await Promise.all([
    collect("products", SITEMAP_PRODUCTS_QUERY),
    collect("collections", SITEMAP_COLLECTIONS_QUERY),
    collect("articles", SITEMAP_ARTICLES_QUERY),
  ])).flat();
}
