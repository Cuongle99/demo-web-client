import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

function load(name, dependencies = {}, env = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(`../src/lib/shopify/${name}.ts`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, process: { env }, ...globals,
    require: (key) => {
      if (key === "server-only") return {};
      if (Object.hasOwn(dependencies, key)) return dependencies[key];
      throw new Error(`Unexpected dependency: ${key}`);
    },
  });
  return loadedModule.exports;
}

const config = load("config");
test("mock data requires explicit local opt-in and never hides partial/production configuration", () => {
  for (const NODE_ENV of [undefined, "production", "development", "test"]) {
    assert.throws(() => config.shouldUseMockData({ NODE_ENV }), /not configured/);
    if (NODE_ENV === "development" || NODE_ENV === "test") assert.equal(config.shouldUseMockData({ NODE_ENV, SHOPIFY_USE_MOCK_DATA: "true" }), true);
    else assert.throws(() => config.shouldUseMockData({ NODE_ENV, SHOPIFY_USE_MOCK_DATA: "true" }), /not configured/);
    assert.throws(() => config.shouldUseMockData({ NODE_ENV, SHOPIFY_USE_MOCK_DATA: "true", SHOPIFY_STORE_DOMAIN: "example.myshopify.com" }), /not configured/);
    assert.equal(config.shouldUseMockData({ NODE_ENV, SHOPIFY_STORE_DOMAIN: "example.myshopify.com", SHOPIFY_STOREFRONT_ACCESS_TOKEN: "test-token" }), false);
  }
});

const calls = {
  products: [["getProduct", "missing"], ["getProducts"], ["getProductsPage"]],
  collections: [["getCollection", "missing"], ["getCollections"], ["getCollectionPage", "missing"]],
  search: [["searchProducts", "nẹp"]],
  blogs: [["getBlogArticles"], ["getArticle", "blog", "missing"]],
  sitemap: [["getSitemapResources"]],
};
function service(name, client) {
  return load(name, { "./client": client, "./queries": {}, "./normalize": {
    normalizeProduct: (x) => x, normalizeCollection: (x) => x, normalizeCollectionSummary: (x) => x, normalizeArticle: (x) => x,
  }, "@/lib/mock-data": { mockProducts: [], mockCollection: {} } });
}

for (const [name, cases] of Object.entries(calls)) {
  test(`${name}: missing configuration and API outage propagate without fake data/404`, async () => {
    for (const failAt of ["config", "fetch"]) {
      const mod = service(name, {
        shouldUseMockData: () => { if (failAt === "config") throw new Error("configuration unavailable"); return false; },
        shopifyFetch: async () => { throw new Error("API unavailable"); },
      });
      for (const [method, ...args] of cases) await assert.rejects(mod[method](...args), /unavailable/);
    }
  });
}

test("real empty responses and missing resources remain distinct from an outage", async () => {
  const client = (data) => ({ shouldUseMockData: () => false, shopifyFetch: async () => data });
  assert.equal(await service("products", client({ product: null })).getProduct("missing"), null);
  assert.equal(await service("collections", client({ collection: null })).getCollection("missing"), null);
  assert.equal(await service("blogs", client({ blog: null })).getArticle("blog", "missing"), null);
  assert.equal((await service("blogs", client({ blogs: { nodes: [] } })).getBlogArticles()).length, 0);
  assert.equal((await service("products", client({ products: { nodes: [] } })).getProducts()).length, 0);
  assert.equal((await service("collections", client({ collections: { nodes: [] } })).getCollections()).length, 0);
  assert.equal((await service("search", client({ products: { nodes: [] } })).searchProducts("unknown")).length, 0);
});

test("GraphQL errors, non-JSON replies, HTTP failures and network failures reject", async () => {
  const env = { SHOPIFY_STORE_DOMAIN: "example.myshopify.com", SHOPIFY_STOREFRONT_ACCESS_TOKEN: "test-token" };
  for (const fetch of [
    async () => ({ ok: true, json: async () => ({ errors: [{ message: "upstream error" }] }) }),
    async () => ({ ok: false, status: 503, json: async () => ({}) }),
    async () => ({ ok: false, status: 502, json: async () => { throw new Error("invalid JSON"); } }),
    async () => { throw new Error("network failure"); },
  ]) {
    const client = load("client", { "./config": config }, env, { fetch });
    await assert.rejects(client.shopifyFetch("query { shop { name } }"));
  }
});

test("catalog pagination does not silently truncate on a repeated cursor", async () => {
  const products = service("products", { shouldUseMockData: () => false, shopifyFetch: async () => ({ products: { edges: [{ cursor: "same" }], pageInfo: { hasNextPage: true, endCursor: "same" } } }) });
  await assert.rejects(products.getProductsPage(), /did not advance/);
  const collections = service("collections", { shouldUseMockData: () => false, shopifyFetch: async () => ({ collection: { products: { edges: [{ cursor: "same", node: { productType: "test" } }], pageInfo: { hasNextPage: true, endCursor: "same" } } } }) });
  await assert.rejects(collections.getCollectionPage("test"), /did not advance/);
});
