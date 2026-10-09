type Environment = Record<string, string | undefined>;

export function hasShopifyConfig(env: Environment = process.env) {
  return Boolean(env.SHOPIFY_STORE_DOMAIN?.trim() && env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim());
}

/** Missing credentials are an outage, never an empty catalog or a missing URL. */
export function shouldUseMockData(env: Environment = process.env): boolean {
  if (hasShopifyConfig(env)) return false;
  const isLocal = env.NODE_ENV === "development" || env.NODE_ENV === "test";
  const hasPartialConfig = Boolean(env.SHOPIFY_STORE_DOMAIN || env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
  if (isLocal && env.SHOPIFY_USE_MOCK_DATA === "true" && !hasPartialConfig) return true;
  throw new Error("Shopify Storefront API is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN. Mock data requires SHOPIFY_USE_MOCK_DATA=true in development/test only.");
}
