import { hasShopifyConfig, shopifyFetch } from "./client";
import { PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY } from "./queries";
import type { Product } from "./types";
import { mockProducts } from "@/lib/mock-data";
import { normalizeProduct, type ShopifyProductRaw } from "./normalize";

interface ProductPayload { product: ShopifyProductRaw | null }
interface ProductsPayload { products: { nodes: ShopifyProductRaw[] } }

export async function getProduct(handle: string): Promise<Product | null> {
  if (!hasShopifyConfig()) return mockProducts.find((item) => item.handle === handle) ?? null;
  const data = await shopifyFetch<ProductPayload>(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.product ? normalizeProduct(data.product) : null;
}

export async function getProducts(first = 12): Promise<Product[]> {
  if (!hasShopifyConfig()) return mockProducts.slice(0, first);
  const data = await shopifyFetch<ProductsPayload>(PRODUCTS_QUERY, { first, query: null });
  return data.products.nodes.map(normalizeProduct);
}

export function getMetafield(product: Product, key: string, namespace = "custom") {
  return product.metafields.find((field) => field?.namespace === namespace && field.key === key);
}
