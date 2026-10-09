export const siteConfig = {
  name: "Toàn Tâm Medical",
  shortName: "TOÀN TÂM",
  description:
    "Thiết bị y tế chính hãng cho bệnh viện, phòng khám và gia đình.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://thiet-bi-y-te-toan-tam.com"
      : "http://localhost:3000"),
  phone: "0967.088.154",
  phoneHref: "tel:+84967088154",
  email: "info@toantammedical.vn",
  address: "Số 273, Đ. Lý Thường Kiệt, P.15, Q.11, TP.HCM",
  nav: [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/products" },
    { label: "Dịch vụ", href: "/#dich-vu" },
    { label: "Tin tức", href: "/blogs" },
    { label: "Liên hệ", href: "/contact" },
  ],
} as const;
