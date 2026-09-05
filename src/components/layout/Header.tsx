import Link from "next/link";
import { EnvelopeSimple, List, MagnifyingGlass, Phone, ShoppingCartSimple } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { getCollections } from "@/lib/shopify/collections";
import { categories } from "@/lib/mock-data";

export async function Header() {
  const shopifyCollections = await getCollections(8);
  const menuCollections = shopifyCollections.length ? shopifyCollections : categories;
  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <div className="utility-contact">
            <a className="utility-contact__hotline" href={siteConfig.phoneHref} aria-label={`Gọi ${siteConfig.phone}`}>
              <Phone weight="fill" />
              <span>Hotline</span>
              <strong>{siteConfig.phone}</strong>
            </a>
            <a className="utility-contact__email" href={`mailto:${siteConfig.email}`} aria-label={`Gửi email đến ${siteConfig.email}`}>
              <EnvelopeSimple weight="bold" />
              <span>Email:</span>
              <span className="utility-contact__email-address">{siteConfig.email}</span>
            </a>
          </div>
          <nav aria-label="Tiện ích"><Link href="/contact">Về Toàn Tâm</Link><Link href="/#tin-tuc">Tin tức</Link><Link href="/contact">Liên hệ</Link></nav>
        </div>
      </div>
      <div className="container header-main">
        <Logo />
        <MobileNavigation />
        <form className="header-search" action="/search" role="search">
          <label className="sr-only" htmlFor="header-q">Tìm sản phẩm</label>
          <input id="header-q" name="q" placeholder="Bạn cần tìm sản phẩm gì?" />
          <button type="submit"><MagnifyingGlass aria-hidden="true" /><span>Tìm kiếm</span></button>
        </form>
        <a className="quick-contact" href={siteConfig.phoneHref}><Phone weight="regular" /><span>Tư vấn nhanh<strong>{siteConfig.phone}</strong></span></a>
        <Link className="quote-shortcut" href="/request-quote"><ShoppingCartSimple /><span>Yêu cầu báo giá<small>0 sản phẩm</small></span></Link>
      </div>
      <nav className="main-nav" aria-label="Điều hướng chính">
        <div className="container main-nav__inner">
          <details className="catalog-menu">
            <summary><List weight="bold" /><span>Danh mục sản phẩm</span></summary>
            <div className="catalog-menu__panel">
              {menuCollections.map((collection) => <Link href={`/collections/${collection.handle}`} key={collection.handle}>{collection.title}</Link>)}
            </div>
          </details>
          <div className="desktop-nav">{siteConfig.nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
        </div>
      </nav>
    </header>
  );
}
