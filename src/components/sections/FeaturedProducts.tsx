import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/ProductCard";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return <section className="section"><div className="section-heading"><h2>Sản phẩm bán chạy</h2><Link href="/collections">Xem tất cả sản phẩm →</Link></div>{products.length ? <HorizontalCarousel label="sản phẩm" trackClassName="carousel__track--products">{products.map((product) => <ProductCard key={product.id} product={product} />)}</HorizontalCarousel> : <div className="empty-state"><h2>Chưa có sản phẩm</h2></div>}</section>;
}
