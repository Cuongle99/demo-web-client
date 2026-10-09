import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

// Load pure TypeScript modules with explicit dependencies, without credentials
// or network calls. Production HTML is verified separately after next build.
function load(file, dependencies = {}, env = {}) {
  const code = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  runInNewContext(code, {
    module: loadedModule, exports: loadedModule.exports, URL, process: { env },
    require: (name) => {
      if (name === "server-only") return {};
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return loadedModule.exports;
}

const config = load("src/config/site.ts", {}, { NODE_ENV: "production" });
const seo = load("src/lib/seo.ts", { "@/config/site": config });

test("production canonical host follows the live redirect, including old env values", () => {
  for (const input of [undefined, "", "https://thiet-bi-y-te-toan-tam.com/", "http://www.thiet-bi-y-te-toan-tam.com/"]) {
    assert.equal(config.resolveSiteUrl(input), "https://www.thiet-bi-y-te-toan-tam.com");
  }
  assert.equal(config.resolveSiteUrl("http://localhost:3107/"), "http://localhost:3107");
  assert.equal(config.resolveSiteUrl("https://preview.example.com/"), "https://preview.example.com");
});

test("Vietnamese paths and pagination have matching canonical and social URLs", () => {
  const metadata = seo.pageMetadata({ title: "Thiết bị - Trang 2", description: "Mô tả", path: "/collections/thiết-bị?page=2" });
  assert.equal(metadata.alternates.canonical, "https://www.thiet-bi-y-te-toan-tam.com/collections/thi%E1%BA%BFt-b%E1%BB%8B?page=2");
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.openGraph.locale, "vi_VN");
  assert.equal(metadata.twitter.title, metadata.openGraph.title);
  assert.equal(metadata.robots, undefined);
  const filtered = seo.pageMetadata({ title: "Lọc", description: "Mô tả", path: "/products", noindex: true });
  assert.equal(filtered.robots.index, false);
  assert.equal(filtered.robots.follow, true);
});

test("structured data links the website to the organization and safely escapes HTML", () => {
  const graph = seo.websiteSchema()["@graph"];
  assert.equal(graph[1].publisher["@id"], graph[0]["@id"]);
  assert.equal(graph[0].url, "https://www.thiet-bi-y-te-toan-tam.com/");
  assert.ok(!seo.jsonLdString({ name: "</script><script>" }).includes("<"));
});

function sitemapWith(fetch) {
  return load("src/lib/shopify/sitemap.ts", {
    "@/lib/mock-data": { mockProducts: [] },
    "./client": { shouldUseMockData: () => false, shopifyFetch: fetch },
  });
}

test("sitemap includes every cursor page for products, collections and articles", async () => {
  const sizes = { products: 501, collections: 252, articles: 251 };
  const calls = { products: 0, collections: 0, articles: 0 };
  const sitemap = sitemapWith(async (query, { after }) => {
    const key = Object.keys(sizes).find((key) => query.includes(`${key}(first:`));
    calls[key]++;
    const start = after ? Number(after) : 0;
    const end = Math.min(start + 250, sizes[key]);
    return { [key]: {
      nodes: Array.from({ length: end - start }, (_, offset) => ({
        handle: `${key}-thiết-bị-${start + offset}`,
        ...(key === "articles" ? { blog: { handle: "tin-tức" } } : { updatedAt: "2026-10-01T00:00:00Z" }),
      })),
      pageInfo: { hasNextPage: end < sizes[key], endCursor: String(end) },
    } };
  });
  const resources = await sitemap.getSitemapResources();
  assert.equal(resources.length, 1004);
  assert.equal(calls.products, 3);
  assert.equal(calls.collections, 2);
  assert.equal(calls.articles, 2);
  assert.ok(resources.some((entry) => entry.path.startsWith("/blogs/tin-t%E1%BB%A9c/")));
  assert.ok(resources.every((entry) => !/[^\x00-\x7F]/.test(entry.path)));
  assert.equal(resources.find((entry) => entry.path.startsWith("/blogs/")).lastModified, undefined);
});

test("broken pagination and API failures cannot silently publish a partial sitemap", async () => {
  const stuck = sitemapWith(async () => Object.fromEntries(["products", "collections", "articles"].map((key) => [key, {
    nodes: [], pageInfo: { hasNextPage: true, endCursor: "same-cursor" },
  }])));
  await assert.rejects(stuck.getSitemapResources(), /did not advance/);
  const failed = sitemapWith(async () => { throw new Error("API unavailable"); });
  await assert.rejects(failed.getSitemapResources(), /API unavailable/);
});
