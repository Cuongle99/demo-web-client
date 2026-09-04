import { mockProducts } from "@/lib/mock-data";
import { hasShopifyConfig, shopifyFetch } from "./client";
import { PRODUCTS_QUERY } from "./queries";
import type { Product } from "./types";
import { normalizeProduct, type ShopifyProductRaw } from "./normalize";

interface SearchPayload { products: { nodes: ShopifyProductRaw[] } }

export async function searchProducts(query: string, first = 24): Promise<Product[]> {
  const cleaned = query.trim();
  if (!cleaned) return [];
  if (!hasShopifyConfig()) {
    const needle = cleaned.toLocaleLowerCase("vi");
    return mockProducts.filter((product) => [product.title, product.description, product.handle].some((value) => value.toLocaleLowerCase("vi").includes(needle)));
  }
  const search = `title:*${cleaned}* OR handle:*${cleaned}*`;
  const data = await shopifyFetch<SearchPayload>(PRODUCTS_QUERY, { first, query: search });
  return data.products.nodes.map(normalizeProduct);
}
