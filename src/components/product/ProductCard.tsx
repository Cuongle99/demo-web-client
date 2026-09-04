import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify/types";

function formatPrice(amount: string, currency: string) {
  const numeric = Number(amount);
  if (!numeric) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency, maximumFractionDigits: 0 }).format(numeric);
}

export function ProductCard({ product }: { product: Product }) {
  const image = product.featuredImage;
  const variant = product.variants[0];
  return (
    <article className="product-card">
      <Link className="product-card__image" href={`/products/${product.handle}`}>
        {image ? <Image src={image.url} alt={image.altText || product.title} fill sizes="(max-width: 700px) 45vw, 220px" style={{ objectPosition: image.focalPosition ?? "center" }} /> : <span>Chưa có hình ảnh</span>}
      </Link>
      <div className="product-card__content"><h3><Link href={`/products/${product.handle}`}>{product.title}</Link></h3><p className="product-card__price">{variant ? formatPrice(variant.price.amount, variant.price.currencyCode) : "Liên hệ"}</p><div className="product-card__actions"><Link href={`/products/${product.handle}`}>Xem sản phẩm</Link><Link href={`/request-quote?product=${encodeURIComponent(product.handle)}`}>Yêu cầu báo giá</Link></div></div>
    </article>
  );
}
