import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, dependencies = {}, env = {}, globals = {}) {
  const code = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  runInNewContext(code, {
    module: mod, exports: mod.exports, process: { env }, URL, Request, Response,
    TextDecoder, Uint8Array, AbortSignal, setTimeout, clearTimeout, ...globals,
    require: (name) => {
      if (name === "server-only") return {};
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      if (name === "sanitize-html") return require(name);
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return mod.exports;
}

const origin = "https://www.thiet-bi-y-te-toan-tam.com";
const validation = load("src/lib/validation.ts", { "@/config/site": { siteConfig: { url: origin } } });
const richText = load("src/lib/safe-html.ts");
const payload = { name: "Nguyễn Văn An", email: "TEST@example.com", phone: "0900000000", subject: "Tư vấn", productTitle: "Nẹp tay", message: "Nhờ tư vấn sản phẩm" };
function request(body = JSON.stringify(payload), headers = {}, url = origin + "/api/contact") {
  return new Request(url, { method: "POST", body, headers: { origin, "content-type": "application/json", ...headers }, ...(body instanceof ReadableStream ? { duplex: "half" } : {}) });
}

test("forms accept same-origin JSON including Vietnamese and the current preview host", async () => {
  assert.equal((await validation.requestData(request())).name, payload.name);
  const preview = "https://project-demo-preview.vercel.app";
  assert.equal((await validation.requestData(request(undefined, { origin: preview }, preview + "/api/contact"))).name, payload.name);
  assert.equal((await validation.requestData(request(undefined, {
    origin: "http://127.0.0.1:3107", host: "127.0.0.1:3107",
  }, "http://localhost:3107/api/contact"))).name, payload.name);
});

test("cross-site, opaque and missing origins cannot submit browser inquiries", async () => {
  for (const badOrigin of ["https://untrusted.example", "null", "", origin + ".untrusted.example"]) {
    await assert.rejects(validation.requestData(request(undefined, { origin: badOrigin })), { status: 403 });
  }
  const missing = request();
  missing.headers.delete("origin");
  await assert.rejects(validation.requestData(missing), { status: 403 });
  await assert.rejects(validation.requestData(request(undefined, { "sec-fetch-site": "cross-site" })), { status: 403 });
});

test("malformed JSON, invalid UTF-8 and non-JSON forms fail with client errors", async () => {
  await assert.rejects(validation.requestData(request("{")), { status: 400 });
  await assert.rejects(validation.requestData(request(new Uint8Array([0xff]))), { status: 400 });
  for (const type of ["text/plain", "application/x-www-form-urlencoded", "multipart/form-data", "application/json-fake"]) {
    await assert.rejects(validation.requestData(request("name=test", { "content-type": type })), { status: 415 });
  }
  assert.equal(await validation.requestData(request("[]")), null);
  assert.equal(await validation.requestData(request("null")), null);
});

test("body cap counts bytes for absent, spoofed and chunked content lengths", async () => {
  const oversized = JSON.stringify({ message: "ệ".repeat(validation.MAX_INQUIRY_BYTES / 2) });
  await assert.rejects(validation.requestData(request(oversized)), { status: 413 });
  await assert.rejects(validation.requestData(request(oversized, { "content-length": "1" })), { status: 413 });
  await assert.rejects(validation.requestData(request("{}", { "content-length": "99999999" })), { status: 413 });
  let cancelled = false;
  const chunks = new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(16385)); },
    cancel() { cancelled = true; },
  });
  await assert.rejects(validation.requestData(request(chunks)), { status: 413 });
  assert.equal(cancelled, true);
});

test("both inquiry routes reject unsafe input before delivery and still deliver valid forms", async () => {
  for (const route of ["contact", "request-quote"]) {
    let delivered = 0;
    const mod = load(`src/app/api/${route}/route.ts`, {
      "@/lib/validation": validation,
      "@/lib/contact-provider": { deliverInquiry: async (_kind, data) => {
        delivered++;
        assert.equal(data.email, "test@example.com");
        return { delivered: true };
      } },
    });
    assert.equal((await mod.POST(request("{", { origin: "https://untrusted.example" }))).status, 403);
    assert.equal((await mod.POST(request("{"))).status, 400);
    assert.equal((await mod.POST(request(JSON.stringify({ name: "Only name" })))).status, 422);
    assert.equal(delivered, 0);
    assert.equal((await mod.POST(request())).status, 202);
    assert.equal(delivered, 1);
  }
});

test("rich text removes executable content, unsafe URL schemes and overlay styles", () => {
  const unsafe = '<script>alert(1)</script><img src="https://cdn.shopify.com/a.jpg" onerror="alert(2)"><a href="jav&#x61;script:alert(3)">link</a><iframe src="https://untrusted.example"></iframe><svg onload="alert(4)"></svg><form action="https://untrusted.example"><input name="password"></form><p style="position:fixed;z-index:99999;background:url(javascript:alert(5));text-align:center">Nội dung</p>';
  const cleaned = richText.safeRichText(unsafe);
  assert.doesNotMatch(cleaned, /script|onerror|onload|iframe|<svg|<form|<input|javascript|position|z-index|background/i);
  assert.match(cleaned, /Nội dung/);
  assert.match(cleaned, /text-align:center/);
});

test("rich text preserves product tables, headings, images and safe links", () => {
  const clean = richText.safeRichText('<h2>Thông số</h2><table><tr><td colspan="2">Nẹp tay</td></tr></table><img src="https://cdn.shopify.com/a.jpg" alt="Sản phẩm"><a href="https://example.com" target="_blank" rel="opener">Nguồn</a>');
  assert.match(clean, /<h2>Thông số<\/h2>/);
  assert.match(clean, /colspan="2"/);
  assert.match(clean, /src="https:\/\/cdn.shopify.com\/a.jpg"/);
  assert.match(clean, /rel="noopener noreferrer"/);
});

test("webhook uses a timeout, rejects redirects and insecure destinations", async () => {
  const env = { NODE_ENV: "production", CONTACT_WEBHOOK_URL: "https://example.com/inquiries", CONTACT_WEBHOOK_TOKEN: "test-only" };
  let calls = 0;
  const fetch = async (_url, options) => {
    calls++;
    assert.equal(options.redirect, "error");
    assert.equal(options.cache, "no-store");
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.headers.Authorization, "Bearer test-only");
    assert.equal(JSON.parse(options.body).kind, "contact");
    return { ok: true };
  };
  const provider = (values) => load("src/lib/contact-provider.ts", {}, values, { fetch });
  assert.equal((await provider(env).deliverInquiry("contact", payload)).delivered, true);
  for (const url of ["http://example.com/inquiries", "https://user:password@example.com/inquiries", "file:///tmp/test"]) {
    await assert.rejects(provider({ ...env, CONTACT_WEBHOOK_URL: url }).deliverInquiry("contact", payload));
  }
  assert.equal(calls, 1);
  assert.equal((await provider({ NODE_ENV: "production" }).deliverInquiry("contact", payload)).delivered, false);
});

test("API errors do not expose provider details or tokens", async () => {
  const response = validation.inquiryError(new Error("secret-token internal-host"), "Gửi không thành công.");
  assert.equal(response.status, 500);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.doesNotMatch(await response.text(), /secret-token|internal-host/);
});
