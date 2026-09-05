import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getProductsPage, type ProductSortKey } from "@/lib/shopify/products";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description: "Tìm kiếm, lọc và sắp xếp toàn bộ sản phẩm thiết bị y tế tại Toàn Tâm Medical.",
  alternates: { canonical: "/products" },
};

type ProductsSearchParams = {
  q?: string;
  type?: string;
  availability?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  after?: string;
  before?: string;
  page?: string;
};

const sortOptions: Array<{ value: string; label: string; sortKey: ProductSortKey; reverse: boolean }> = [
  { value: "best-selling", label: "Bán chạy nhất", sortKey: "BEST_SELLING", reverse: false },
  { value: "newest", label: "Mới nhất", sortKey: "CREATED_AT", reverse: true },
  { value: "price-asc", label: "Giá: thấp đến cao", sortKey: "PRICE", reverse: false },
  { value: "price-desc", label: "Giá: cao đến thấp", sortKey: "PRICE", reverse: true },
  { value: "title-asc", label: "Tên: A–Z", sortKey: "TITLE", reverse: false },
  { value: "title-desc", label: "Tên: Z–A", sortKey: "TITLE", reverse: true },
];

function clean(value?: string) {
  return value?.trim() ?? "";
}

function price(value?: string) {
  const numeric = Number(value);
  return value && Number.isFinite(numeric) && numeric >= 0 ? numeric : undefined;
}

function positivePage(value?: string) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : 1;
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductsSearchParams> }) {
  const params = await searchParams;
  const search = clean(params.q);
  const productType = clean(params.type);
  const availability = params.availability === "available" || params.availability === "unavailable"
    ? params.availability
    : undefined;
  const minPrice = price(params.minPrice);
  const maxPrice = price(params.maxPrice);
  const selectedSort = sortOptions.find((option) => option.value === params.sort) ?? sortOptions[0];
  const currentPage = positivePage(params.page);

  const result = await getProductsPage({
    pageSize: 8,
    after: clean(params.after) || undefined,
    before: clean(params.before) || undefined,
    search,
    productType,
    availability,
    minPrice,
    maxPrice,
    sortKey: selectedSort.sortKey,
    reverse: selectedSort.reverse,
  });

  const hasFilters = Boolean(search || productType || availability || minPrice !== undefined || maxPrice !== undefined);
  const sharedParams = new URLSearchParams();
  if (search) sharedParams.set("q", search);
  if (productType) sharedParams.set("type", productType);
  if (availability) sharedParams.set("availability", availability);
  if (minPrice !== undefined) sharedParams.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) sharedParams.set("maxPrice", String(maxPrice));
  if (selectedSort.value !== sortOptions[0].value) sharedParams.set("sort", selectedSort.value);

  function pageHref(direction: "previous" | "next", cursor: string) {
    const nextParams = new URLSearchParams(sharedParams);
    nextParams.set(direction === "next" ? "after" : "before", cursor);
    nextParams.set("page", String(direction === "next" ? currentPage + 1 : Math.max(1, currentPage - 1)));
    return `/products?${nextParams.toString()}`;
  }

  return (
    <div className="inner-page container product-catalog">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]} />

      <header className="product-catalog__header">
        <div>
          <p className="eyebrow">Danh sách sản phẩm</p>
          <h1>Tất cả sản phẩm</h1>
          <p>Tìm sản phẩm phù hợp theo nhu cầu, tình trạng hàng và khoảng giá.</p>
        </div>
      </header>

      <form className="catalog-controls" action="/products" method="get" aria-label="Lọc và sắp xếp sản phẩm">
        <label className="catalog-controls__search">
          <span>Tìm kiếm</span>
          <span className="catalog-controls__input-wrap">
            <MagnifyingGlass aria-hidden="true" />
            <input name="q" type="search" defaultValue={search} placeholder="Tên hoặc loại sản phẩm" />
          </span>
        </label>

        {result.productTypes.length > 0 && (
          <label>
            <span>Loại sản phẩm</span>
            <select name="type" defaultValue={productType}>
              <option value="">Tất cả loại</option>
              {result.productTypes.map((type) => <option value={type} key={type}>{type}</option>)}
            </select>
          </label>
        )}

        <label>
          <span>Tình trạng</span>
          <select name="availability" defaultValue={availability ?? ""}>
            <option value="">Tất cả</option>
            <option value="available">Còn hàng</option>
            <option value="unavailable">Tạm hết hàng</option>
          </select>
        </label>

        <label>
          <span>Giá từ</span>
          <input name="minPrice" type="number" min="0" step="1000" defaultValue={minPrice} placeholder="0" />
        </label>

        <label>
          <span>Giá đến</span>
          <input name="maxPrice" type="number" min="0" step="1000" defaultValue={maxPrice} placeholder="Không giới hạn" />
        </label>

        <label>
          <span>Sắp xếp</span>
          <select name="sort" defaultValue={selectedSort.value}>
            {sortOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
        </label>

        <div className="catalog-controls__actions">
          {hasFilters && <Link href="/products">Xóa bộ lọc</Link>}
          <button className="button button--primary" type="submit"><FunnelSimple weight="bold" /> Áp dụng</button>
        </div>
      </form>

      <div className="catalog-results__heading">
        <h2>{hasFilters ? "Sản phẩm phù hợp" : "Danh sách sản phẩm"}</h2>
        <span>{result.products.length} sản phẩm · Trang {currentPage}</span>
      </div>

      <ProductGrid products={result.products} />

      {(result.pageInfo.hasPreviousPage || result.pageInfo.hasNextPage) && (
        <nav className="catalog-pagination" aria-label="Phân trang sản phẩm">
          {result.pageInfo.hasPreviousPage && result.pageInfo.startCursor ? (
            <Link className="button button--outline" href={pageHref("previous", result.pageInfo.startCursor)}>
              <ArrowLeft weight="bold" /> Trang trước
            </Link>
          ) : <span />}
          <strong>Trang {currentPage}</strong>
          {result.pageInfo.hasNextPage && result.pageInfo.endCursor ? (
            <Link className="button button--outline" href={pageHref("next", result.pageInfo.endCursor)}>
              Trang sau <ArrowRight weight="bold" />
            </Link>
          ) : <span />}
        </nav>
      )}
    </div>
  );
}
