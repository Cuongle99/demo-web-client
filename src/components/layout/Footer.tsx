import Link from "next/link";
import { Clock, EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { getCollections } from "@/lib/shopify/collections";
import { policies } from "@/content/policies";

const columns = [
  { title: "Liên hệ", links: [{ label: "Thông tin liên hệ", href: "/contact" }, { label: "Yêu cầu báo giá", href: "/request-quote" }, { label: "Kiến thức chăm sóc sức khỏe", href: "/blogs" }] },
  { title: "Hỗ trợ khách hàng", links: policies.map((policy) => ({ label: "label" in policy ? policy.label : policy.title, href: `/policies/${policy.slug}` })) },
];

export async function Footer() {
  const collections = await getCollections(5);
  return (
    <footer className="site-footer">
      <div className="footer-contact">
        <div className="container footer-contact__grid">
          <a href={siteConfig.phoneHref}><Phone /><span>Tư vấn miễn phí<strong>{siteConfig.phone}</strong></span></a>
          <a href={`mailto:${siteConfig.email}`}><EnvelopeSimple /><span>Email<strong>{siteConfig.email}</strong></span></a>
          <p><Clock /><span>Thời gian làm việc<strong>T2 - T7: 8:00 - 17:30</strong></span></p>
          <p className="footer-contact__address"><MapPin /><span>Địa chỉ<strong>{siteConfig.address}</strong></span></p>
        </div>
      </div>
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-about"><Logo inverse /><p>Thiết bị y tế Toàn Tâm – đối tác tin cậy cung cấp giải pháp thiết bị y tế toàn diện cho cơ sở y tế và gia đình.</p></div>
          {columns.map((column) => <div className="footer-column" key={column.title}><h3>{column.title}</h3>{column.links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}</div>)}
          <div className="footer-column"><h3>Danh mục sản phẩm</h3>{collections.length ? collections.map((collection) => <Link href={`/collections/${collection.handle}`} key={collection.id}>{collection.title}</Link>) : <Link href="/collections">Xem tất cả danh mục</Link>}</div>
          <div className="footer-newsletter"><h3>Đăng ký nhận tin</h3><p>Nhận thông tin sản phẩm mới và ưu đãi đặc biệt.</p><form><label className="sr-only" htmlFor="newsletter">Email</label><input id="newsletter" type="email" placeholder="Nhập email của bạn" /><button type="submit">Đăng ký</button></form></div>
        </div>
      </div>
      <div className="footer-bottom"><div className="container"><span>© 2026 Toàn Tâm Medical. All rights reserved.</span><span>Thiết kế cho chăm sóc sức khỏe toàn diện.</span></div></div>
    </footer>
  );
}
