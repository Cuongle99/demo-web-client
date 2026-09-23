import { mockCollection } from "@/lib/mock-data";
import { hasShopifyConfig, shopifyFetch } from "./client";
import { COLLECTION_CURSOR_QUERY, COLLECTION_PAGE_QUERY, COLLECTION_QUERY, COLLECTIONS_QUERY } from "./queries";
import type { Collection, CollectionSummary, Product } from "./types";
import { normalizeCollection, normalizeCollectionSummary, type ShopifyCollectionRaw, type ShopifyCollectionSummaryRaw } from "./normalize";

interface CollectionPayload { collection: ShopifyCollectionRaw | null }
interface CollectionsPayload { collections: { nodes: ShopifyCollectionSummaryRaw[] } }
interface CollectionCursorsPayload {
  collection: {
    id: string;
    handle: string;
    title: string;
    description: string;
    seo?: { title?: string | null; description?: string | null };
    products: {
      edges: Array<{ cursor: string; node: { productType: string } }>;
      pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    };
  } | null;
}

export type CollectionSortKey = "COLLECTION_DEFAULT" | "BEST_SELLING" | "CREATED" | "PRICE" | "TITLE";

export interface CollectionPageOptions {
  page?: number;
  pageSize?: number;
  productType?: string;
  availability?: "available" | "unavailable";
  minPrice?: number;
  maxPrice?: number;
  sortKey?: CollectionSortKey;
  reverse?: boolean;
}

export interface CollectionPageResult {
  collection: Collection;
  productTypes: string[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

function collectionFilters(options: CollectionPageOptions) {
  const filters: Array<Record<string, unknown>> = [];
  if (options.productType) filters.push({ productType: options.productType });
  if (options.availability) filters.push({ available: options.availability === "available" });
  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    filters.push({ price: { min: options.minPrice ?? 0, ...(options.maxPrice !== undefined ? { max: options.maxPrice } : {}) } });
  }
  return filters;
}

function mockCollectionPage(handle: string, options: CollectionPageOptions): CollectionPageResult | null {
  if (!handle) return null;
  const pageSize = options.pageSize ?? 12;
  const products = mockCollection.products.filter((product) => {
    const prices = product.variants.map((variant) => Number(variant.price.amount));
    if (options.productType && product.productType !== options.productType) return false;
    if (options.availability === "available" && !product.variants.some((variant) => variant.availableForSale)) return false;
    if (options.availability === "unavailable" && product.variants.some((variant) => variant.availableForSale)) return false;
    if ((options.minPrice !== undefined || options.maxPrice !== undefined) &&
      !prices.some((price) => price >= (options.minPrice ?? 0) && price <= (options.maxPrice ?? Infinity))) return false;
    return true;
  });
  products.sort((a: Product, b: Product) => {
    let comparison = 0;
    if (options.sortKey === "PRICE") comparison = Number(a.variants[0]?.price.amount ?? 0) - Number(b.variants[0]?.price.amount ?? 0);
    if (options.sortKey === "TITLE") comparison = a.title.localeCompare(b.title, "vi");
    if (options.sortKey === "CREATED") comparison = a.id.localeCompare(b.id);
    return options.reverse ? -comparison : comparison;
  });
  const totalCount = products.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(options.page ?? 1, totalPages);
  return {
    collection: { ...mockCollection, handle, products: products.slice((currentPage - 1) * pageSize, currentPage * pageSize) },
    productTypes: [...new Set(mockCollection.products.map((product) => product.productType).filter((type): type is string => Boolean(type)))].sort((a, b) => a.localeCompare(b, "vi")),
    totalCount,
    totalPages,
    currentPage,
  };
}

export async function getCollection(handle: string, first = 24, after?: string): Promise<Collection | null> {
  if (!hasShopifyConfig()) return handle ? { ...mockCollection, handle } : null;
  const data = await shopifyFetch<CollectionPayload>(COLLECTION_QUERY, { handle, first, after: after ?? null });
  return data.collection ? normalizeCollection(data.collection) : null;
}

export async function getCollectionPage(handle: string, options: CollectionPageOptions = {}): Promise<CollectionPageResult | null> {
  if (!hasShopifyConfig()) return mockCollectionPage(handle, options);

  const pageSize = options.pageSize ?? 12;
  const sortKey = options.sortKey ?? "COLLECTION_DEFAULT";
  const reverse = options.reverse ?? false;
  const filters = collectionFilters(options);

  async function scan(activeFilters: Array<Record<string, unknown>>) {
    const cursors: string[] = [];
    const productTypes = new Set<string>();
    let after: string | null = null;
    let collection: NonNullable<CollectionCursorsPayload["collection"]> | null = null;
    while (true) {
      const data: CollectionCursorsPayload = await shopifyFetch<CollectionCursorsPayload>(COLLECTION_CURSOR_QUERY, {
        handle, after, filters: activeFilters, sortKey, reverse,
      });
      if (!data.collection) return null;
      collection = data.collection;
      for (const edge of collection.products.edges) {
        cursors.push(edge.cursor);
        if (edge.node.productType) productTypes.add(edge.node.productType);
      }
      const nextCursor = collection.products.pageInfo.endCursor;
      if (!collection.products.pageInfo.hasNextPage || !nextCursor || nextCursor === after) break;
      after = nextCursor;
    }
    return { collection, cursors, productTypes };
  }

  const all = await scan([]);
  if (!all) return null;
  const filtered = filters.length ? await scan(filters) : all;
  if (!filtered) return null;

  const totalCount = filtered.cursors.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(options.page ?? 1, totalPages);
  const pageAfter = currentPage > 1 ? filtered.cursors[(currentPage - 1) * pageSize - 1] : null;
  const data = await shopifyFetch<CollectionPayload>(COLLECTION_PAGE_QUERY, {
    handle, first: pageSize, after: pageAfter, filters, sortKey, reverse,
  });
  if (!data.collection) return null;

  return {
    collection: normalizeCollection(data.collection),
    productTypes: [...all.productTypes].sort((a, b) => a.localeCompare(b, "vi")),
    totalCount,
    totalPages,
    currentPage,
  };
}

export async function getCollections(first = 8): Promise<CollectionSummary[]> {
  if (!hasShopifyConfig()) return [];
  const data = await shopifyFetch<CollectionsPayload>(COLLECTIONS_QUERY, { first });
  return data.collections.nodes.map(normalizeCollectionSummary);
}
