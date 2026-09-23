import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FunnelSimple } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CatalogPagination } from "@/components/product/CatalogPagination";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCollection, getCollectionPage, type CollectionSortKey } from "@/lib/shopify/collections";
import { getSeoPage } from "@/lib/shopify/seo-content";
import { breadcrumbSchema, DEFAULT_SOCIAL_IMAGE, jsonLdString } from "@/lib/seo";

const PAGE_SIZE = 12;

const sortOptions: Array<{ value: string; label: string; sortKey: CollectionSortKey; reverse: boolean }> = [
  { value: "default", label: "Mặc định", sortKey: "COLLECTION_DEFAULT", reverse: false },
  { value: "best-selling", label: "Bán chạy nhất", sortKey: "BEST_SELLING", reverse: false },
  { value: "newest", label: "Mới nhất", sortKey: "CREATED", reverse: true },
  { value: "price-asc", label: "Giá: thấp đến cao", sortKey: "PRICE", reverse: false },
  { value: "price-desc", label: "Giá: cao đến thấp", sortKey: "PRICE", reverse: true },
  { value: "title-asc", label: "Tên: A–Z", sortKey: "TITLE", reverse: false },
  { value: "title-desc", label: "Tên: Z–A", sortKey: "TITLE", reverse: true },
];

function single(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function price(value: string) {
  const numeric = Number(value);
  return value && Number.isFinite(numeric) && numeric >= 0 ? numeric : undefined;
}

function positivePage(value: string) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : 1;
}

export async function generateMetadata({ params, searchParams }: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const [{ handle }, query] = await Promise.all([params, searchParams]);
  const decodedHandle = decodeURIComponent(handle);
  const path = `/collections/${decodedHandle}`;
  const [collection, seo] = await Promise.all([getCollection(decodedHandle, 1), getSeoPage(path)]);

  if (!collection) notFound();
  const page = positivePage(single(query.page));
  const filtered = Boolean(single(query.type) || single(query.availability) || single(query.minPrice) ||
    single(query.maxPrice) || single(query.sort));
  const title = seo?.title || collection.seo.title || collection.title;
  const description = seo?.description || collection.seo.description || collection.description ||
    `Khám phá sản phẩm trong danh mục ${collection.title} tại Toàn Tâm Medical. Xem đặc điểm, giá và nhận tư vấn lựa chọn phù hợp.`;
  const canonicalPath = `/collections/${encodeURIComponent(collection.handle)}`;
  return {
    title: !filtered && page > 1 ? `${title} - Trang ${page}` : title,
    description,
    alternates: { canonical: !filtered && page > 1 ? `${canonicalPath}?page=${page}` : canonicalPath },
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: { title, description, images: [seo?.socialImage?.url || DEFAULT_SOCIAL_IMAGE] },
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps<"/collections/[handle]">) {
  const [{ handle }, paramsQuery] = await Promise.all([params, searchParams]);
  const productType = single(paramsQuery.type);
  const availabilityValue = single(paramsQuery.availability);
  const availability = availabilityValue === "available" || availabilityValue === "unavailable" ? availabilityValue : undefined;
  const minPrice = price(single(paramsQuery.minPrice));
  const maxPrice = price(single(paramsQuery.maxPrice));
  const selectedSort = sortOptions.find((option) => option.value === single(paramsQuery.sort)) ?? sortOptions[0];
  const requestedPage = positivePage(single(paramsQuery.page));

  const decodedHandle = decodeURIComponent(handle);
  const [result, seo] = await Promise.all([getCollectionPage(decodedHandle, {
    pageSize: PAGE_SIZE,
    page: requestedPage,
    productType,
    availability,
    minPrice,
    maxPrice,
    sortKey: selectedSort.sortKey,
    reverse: selectedSort.reverse,
  }), getSeoPage(`/collections/${decodedHandle}`)]);
  if (!result) notFound();
  if (requestedPage > result.totalPages) notFound();

  const { collection, currentPage } = result;
  const collectionPath = `/collections/${encodeURIComponent(collection.handle)}`;
  const hasFilters = Boolean(productType || availability || minPrice !== undefined || maxPrice !== undefined);
  const sharedParams = new URLSearchParams();
  if (productType) sharedParams.set("type", productType);
  if (availability) sharedParams.set("availability", availability);
  if (minPrice !== undefined) sharedParams.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) sharedParams.set("maxPrice", String(maxPrice));
  if (selectedSort.value !== sortOptions[0].value) sharedParams.set("sort", selectedSort.value);

  function pageHref(page: number) {
    const nextParams = new URLSearchParams(sharedParams);
    if (page > 1) nextParams.set("page", String(page));
    const query = nextParams.toString();
    return `${collectionPath}${query ? `?${query}` : ""}#product-results`;
  }

  const firstProduct = result.totalCount ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const lastProduct = firstProduct ? firstProduct + collection.products.length - 1 : 0;

  return (
    <div className="inner-page container product-catalog collection-catalog">
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Danh mục" }, { label: collection.title }]} />
      <header className="collection-header">
        <p className="eyebrow">Danh mục sản phẩm</p>
        <h1>{seo?.heading || collection.title}</h1>
        <p>{seo?.intro || collection.description || `Khám phá các sản phẩm ${collection.title.toLocaleLowerCase("vi-VN")} và lựa chọn theo nhu cầu sử dụng.`}</p>
      </header>

      <form className="catalog-controls catalog-controls--collection" action={collectionPath} method="get" aria-label="Lọc và sắp xếp sản phẩm trong danh mục">
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
          {hasFilters && <Link href={collectionPath}>Xóa bộ lọc</Link>}
          <button className="button button--primary" type="submit"><FunnelSimple weight="bold" /> Áp dụng</button>
        </div>
      </form>

      <div className="catalog-results__heading" id="product-results">
        <h2>{hasFilters ? "Sản phẩm phù hợp" : "Danh sách sản phẩm"}</h2>
        <span>{result.totalCount ? `Hiển thị ${firstProduct}–${lastProduct} / ${result.totalCount} sản phẩm` : "0 sản phẩm"}</span>
      </div>
      <ProductGrid products={collection.products} />
      <CatalogPagination currentPage={currentPage} totalPages={result.totalPages} pageHref={pageHref} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbSchema([
        { name: "Trang chủ", path: "/" },
        { name: "Danh mục", path: "/collections" },
        { name: collection.title, path: collectionPath },
      ])) }} />
    </div>
  );
}
