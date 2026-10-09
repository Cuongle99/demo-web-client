"use client";

import { siteConfig } from "@/config/site";

// Header/footer also fetch Shopify data. Their failures are above error.tsx.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <html lang="vi"><head><title>Tạm thời không thể tải trang | Toàn Tâm</title><meta name="robots" content="noindex" /></head><body style={{ margin: 0, padding: "48px 24px", fontFamily: "Arial, sans-serif", lineHeight: 1.6, color: "#172536" }}>
    <main style={{ maxWidth: 640, margin: "auto" }}>
      <h1>Tạm thời không thể tải trang</h1>
      <p>Dữ liệu sản phẩm hiện chưa tải được. Vui lòng thử lại hoặc liên hệ Toàn Tâm để được hỗ trợ.</p>
      <button onClick={retry} style={{ minHeight: 44, padding: "8px 20px", background: "#073e75", color: "white", border: 0, borderRadius: 6, fontSize: 16, cursor: "pointer" }}>Thử lại</button>
      <p>Điện thoại: <a href={siteConfig.phoneHref}>{siteConfig.phone}</a></p>
    </main>
  </body></html>;
}
