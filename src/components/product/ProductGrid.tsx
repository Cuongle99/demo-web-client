import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, compact = false }: { products: Product[]; compact?: boolean }) {
  if (!products.length) return <div className="empty-state"><h2>Chưa tìm thấy sản phẩm</h2><p>Hãy thử một từ khóa khác hoặc liên hệ đội ngũ tư vấn.</p></div>;
  return <div className={`product-grid ${compact ? "product-grid--compact" : ""}`}>{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
