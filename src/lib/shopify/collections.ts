import { mockCollection } from "@/lib/mock-data";
import { hasShopifyConfig, shopifyFetch } from "./client";
import { COLLECTION_QUERY, COLLECTIONS_QUERY } from "./queries";
import type { Collection, CollectionSummary } from "./types";
import { normalizeCollection, normalizeCollectionSummary, type ShopifyCollectionRaw, type ShopifyCollectionSummaryRaw } from "./normalize";

interface CollectionPayload { collection: ShopifyCollectionRaw | null }
interface CollectionsPayload { collections: { nodes: ShopifyCollectionSummaryRaw[] } }

export async function getCollection(handle: string, first = 24, after?: string): Promise<Collection | null> {
  if (!hasShopifyConfig()) return handle ? { ...mockCollection, handle } : null;
  const data = await shopifyFetch<CollectionPayload>(COLLECTION_QUERY, { handle, first, after: after ?? null });
  return data.collection ? normalizeCollection(data.collection) : null;
}

export async function getCollections(first = 8): Promise<CollectionSummary[]> {
  if (!hasShopifyConfig()) return [];
  const data = await shopifyFetch<CollectionsPayload>(COLLECTIONS_QUERY, { first });
  return data.collections.nodes.map(normalizeCollectionSummary);
}
