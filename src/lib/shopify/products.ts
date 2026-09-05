import { hasShopifyConfig, shopifyFetch } from "./client";
import { PRODUCT_BY_HANDLE_QUERY, PRODUCTS_PAGE_QUERY, PRODUCTS_QUERY } from "./queries";
import type { Product } from "./types";
import { mockProducts } from "@/lib/mock-data";
import { normalizeProduct, type ShopifyProductRaw } from "./normalize";

interface ProductPayload { product: ShopifyProductRaw | null }
interface ProductsPayload { products: { nodes: ShopifyProductRaw[] } }
interface ProductsPagePayload {
  products: {
    nodes: ShopifyProductRaw[];
    pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string; endCursor?: string };
  };
  productTypes: { nodes: string[] };
}

export type ProductSortKey = "BEST_SELLING" | "CREATED_AT" | "PRICE" | "TITLE";

export interface ProductPageOptions {
  pageSize?: number;
  after?: string;
  before?: string;
  search?: string;
  productType?: string;
  availability?: "available" | "unavailable";
  minPrice?: number;
  maxPrice?: number;
  sortKey?: ProductSortKey;
  reverse?: boolean;
}

export interface ProductPageResult {
  products: Product[];
  productTypes: string[];
  pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor?: string; endCursor?: string };
}

function quoteSearchValue(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function productQuery(options: ProductPageOptions) {
  const terms: string[] = [];
  const search = options.search?.trim();
  const productType = options.productType?.trim();
  if (search) terms.push(quoteSearchValue(search));
  if (productType) terms.push(`product_type:${quoteSearchValue(productType)}`);
  if (options.availability) terms.push(`available_for_sale:${options.availability === "available"}`);
  if (options.minPrice !== undefined) terms.push(`variants.price:>=${options.minPrice}`);
  if (options.maxPrice !== undefined) terms.push(`variants.price:<=${options.maxPrice}`);
  return terms.length ? terms.join(" AND ") : null;
}

function mockCursor(index: number) {
  return `mock:${index}`;
}

function readMockCursor(cursor?: string) {
  if (!cursor?.startsWith("mock:")) return undefined;
  const value = Number(cursor.slice(5));
  return Number.isInteger(value) && value >= 0 ? value : undefined;
}

function mockProductPage(options: ProductPageOptions): ProductPageResult {
  const pageSize = options.pageSize ?? 20;
  const search = options.search?.trim().toLocaleLowerCase("vi-VN");
  const products = mockProducts.filter((product) => {
    const variant = product.variants[0];
    const price = Number(variant?.price.amount ?? 0);
    if (search && !`${product.title} ${product.productType ?? ""} ${product.vendor ?? ""}`.toLocaleLowerCase("vi-VN").includes(search)) return false;
    if (options.productType && product.productType !== options.productType) return false;
    if (options.availability === "available" && !product.variants.some((item) => item.availableForSale)) return false;
    if (options.availability === "unavailable" && product.variants.some((item) => item.availableForSale)) return false;
    if (options.minPrice !== undefined && price < options.minPrice) return false;
    if (options.maxPrice !== undefined && price > options.maxPrice) return false;
    return true;
  });

  products.sort((a, b) => {
    let comparison = 0;
    if (options.sortKey === "PRICE") comparison = Number(a.variants[0]?.price.amount ?? 0) - Number(b.variants[0]?.price.amount ?? 0);
    if (options.sortKey === "TITLE") comparison = a.title.localeCompare(b.title, "vi");
    if (options.sortKey === "CREATED_AT") comparison = a.id.localeCompare(b.id);
    return options.reverse ? -comparison : comparison;
  });

  const afterIndex = readMockCursor(options.after);
  const beforeIndex = readMockCursor(options.before);
  const start = afterIndex !== undefined
    ? afterIndex + 1
    : beforeIndex !== undefined
      ? Math.max(0, beforeIndex - pageSize)
      : 0;
  const pageProducts = products.slice(start, start + pageSize);
  const end = start + pageProducts.length - 1;

  return {
    products: pageProducts,
    productTypes: [...new Set(mockProducts.map((product) => product.productType).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b, "vi")),
    pageInfo: {
      hasPreviousPage: start > 0,
      hasNextPage: end + 1 < products.length,
      startCursor: pageProducts.length ? mockCursor(start) : undefined,
      endCursor: pageProducts.length ? mockCursor(end) : undefined,
    },
  };
}

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

export async function getProductsPage(options: ProductPageOptions = {}): Promise<ProductPageResult> {
  if (!hasShopifyConfig()) return mockProductPage(options);

  const pageSize = options.pageSize ?? 20;
  const backwards = Boolean(options.before);
  const data = await shopifyFetch<ProductsPagePayload>(PRODUCTS_PAGE_QUERY, {
    first: backwards ? null : pageSize,
    last: backwards ? pageSize : null,
    after: backwards ? null : options.after ?? null,
    before: backwards ? options.before : null,
    query: productQuery(options),
    sortKey: options.sortKey ?? "BEST_SELLING",
    reverse: options.reverse ?? false,
  });

  const products = data.products.nodes.map(normalizeProduct);
  const productTypes = new Set([
    ...data.productTypes.nodes,
    ...products.map((product) => product.productType).filter((value): value is string => Boolean(value)),
  ]);

  return {
    products,
    productTypes: [...productTypes].filter(Boolean).sort((a, b) => a.localeCompare(b, "vi")),
    pageInfo: data.products.pageInfo,
  };
}

export function getMetafield(product: Product, key: string, namespace = "custom") {
  return product.metafields.find((field) => field?.namespace === namespace && field.key === key);
}
