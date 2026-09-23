import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { CatalogPagination } from "@/components/product/CatalogPagination";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getProductsPage, type ProductSortKey } from "@/lib/shopify/products";
import { getSeoPage } from "@/lib/shopify/seo-content";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

const FALLBACK_DESCRIPTION = "Tìm kiếm, lọc và sắp xếp sản phẩm thiết bị y tế cho gia đình, bệnh viện và phòng khám tại Toàn Tâm Medical.";

type ProductsSearchParams = {
  q?: string;
  type?: string;
  availability?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

const PAGE_SIZE = 12;

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

export async function generateMetadata({ searchParams }: { searchParams: Promise<ProductsSearchParams> }): Promise<Metadata> {
  const [params, seo] = await Promise.all([searchParams, getSeoPage("/products")]);
  const page = positivePage(params.page);
  const filtered = Boolean(clean(params.q) || clean(params.type) || clean(params.availability) ||
    clean(params.minPrice) || clean(params.maxPrice) || clean(params.sort));
  const title = seo?.title || "Tất cả sản phẩm";
  const description = seo?.description || FALLBACK_DESCRIPTION;
  return {
    title: !filtered && page > 1 ? `${title} - Trang ${page}` : title,
    description,
    alternates: { canonical: !filtered && page > 1 ? `/products?page=${page}` : "/products" },
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: { title, description, images: [seo?.socialImage?.url || DEFAULT_SOCIAL_IMAGE] },
  };
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
  const requestedPage = positivePage(params.page);

  const [result, seo] = await Promise.all([getProductsPage({
    pageSize: PAGE_SIZE,
    page: requestedPage,
    search,
    productType,
    availability,
    minPrice,
    maxPrice,
    sortKey: selectedSort.sortKey,
    reverse: selectedSort.reverse,
  }), getSeoPage("/products")]);
  if (requestedPage > result.totalPages) notFound();
  const currentPage = result.currentPage;

  const hasFilters = Boolean(search || productType || availability || minPrice !== undefined || maxPrice !== undefined);
  const sharedParams = new URLSearchParams();
  if (search) sharedParams.set("q", search);
  if (productType) sharedParams.set("type", productType);
  if (availability) sharedParams.set("availability", availability);
  if (minPrice !== undefined) sharedParams.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) sharedParams.set("maxPrice", String(maxPrice));
  if (selectedSort.value !== sortOptions[0].value) sharedParams.set("sort", selectedSort.value);

  function pageHref(page: number) {
    const nextParams = new URLSearchParams(sharedParams);
    if (page > 1) nextParams.set("page", String(page));
    const query = nextParams.toString();
    return `/products${query ? `?${query}` : ""}#product-results`;
  }

  const firstProduct = result.totalCount ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastProduct = firstProduct ? firstProduct + result.products.length - 1 : 0;

  return (
    <div className="inner-page container product-catalog">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]} />

      <header className="product-catalog__header">
        <div>
          <p className="eyebrow">Danh sách sản phẩm</p>
          <h1>{seo?.heading || "Tất cả sản phẩm"}</h1>
          <p>{seo?.intro || "Tìm sản phẩm phù hợp theo nhu cầu, tình trạng hàng và khoảng giá."}</p>
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

      <div className="catalog-results__heading" id="product-results">
        <h2>{hasFilters ? "Sản phẩm phù hợp" : "Danh sách sản phẩm"}</h2>
        <span>{result.totalCount ? `Hiển thị ${firstProduct}–${lastProduct} / ${result.totalCount} sản phẩm` : "0 sản phẩm"}</span>
      </div>

      <ProductGrid products={result.products} />

      <CatalogPagination currentPage={currentPage} totalPages={result.totalPages} pageHref={pageHref} />
    </div>
  );
}
