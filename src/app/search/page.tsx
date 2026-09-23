import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { searchProducts } from "@/lib/shopify/search";

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm",
  description: "Tìm sản phẩm thiết bị y tế phù hợp tại Toàn Tâm Medical.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

async function Results({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const products = await searchProducts(query);
  return <>
    <header className="collection-header">
      <p className="eyebrow">Tìm kiếm sản phẩm</p>
      <h1>{query ? `Kết quả cho “${query}”` : "Bạn đang tìm sản phẩm nào?"}</h1>
      <p>{query ? `Tìm thấy ${products.length} sản phẩm phù hợp.` : "Nhập tên hoặc mã sản phẩm để bắt đầu."}</p>
    </header>
    {query && <ProductGrid products={products} />}
  </>;
}

export default function SearchPage(props: PageProps<"/search">) {
  return <div className="inner-page container">
    <Suspense fallback={<div className="loading-state">Đang tìm kiếm...</div>}>
      <Results searchParams={props.searchParams} />
    </Suspense>
  </div>;
}
