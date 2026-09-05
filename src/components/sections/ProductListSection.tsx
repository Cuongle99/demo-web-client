import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/lib/shopify/types";

export function ProductListSection({ products }: { products: Product[] }) {
  return (
    <section className="section home-product-list">
      <div className="section-heading">
        <h2>Khám phá sản phẩm</h2>
      </div>
      <ProductGrid products={products.slice(0, 10)} />
      {products.length > 0 && (
        <div className="home-product-list__more">
          <Link className="button button--outline" href="/products">Xem thêm</Link>
        </div>
      )}
    </section>
  );
}
