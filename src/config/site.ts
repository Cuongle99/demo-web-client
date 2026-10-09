// Hosting redirects the apex domain to www. Keep all SEO signals on that host,
// including deployments that still have the previous apex URL in their env.
export function resolveSiteUrl(value?: string) {
  const url = new URL(value?.trim() || (process.env.NODE_ENV === "production"
    ? "https://www.thiet-bi-y-te-toan-tam.com"
    : "http://localhost:3000"));
  if (["thiet-bi-y-te-toan-tam.com", "www.thiet-bi-y-te-toan-tam.com"].includes(url.hostname)) {
    url.protocol = "https:";
    url.hostname = "www.thiet-bi-y-te-toan-tam.com";
    url.port = "";
  }
  return url.origin;
}

export const siteConfig = {
  name: "Toàn Tâm Medical",
  shortName: "TOÀN TÂM",
  description:
    "Thiết bị y tế chính hãng cho bệnh viện, phòng khám và gia đình.",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  phone: "0967.088.154",
  phoneHref: "tel:+84967088154",
  email: "thietbiytetoantam@gmail.com",
  address: "Số 2, LK41, KĐT Vân Canh, Xã Sơn Đồng, TP Hà Nội",
  nav: [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/products" },
    { label: "Dịch vụ", href: "/#dich-vu" },
    { label: "Tin tức", href: "/blogs" },
    { label: "Liên hệ", href: "/contact" },
  ],
} as const;
