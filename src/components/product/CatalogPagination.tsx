import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

function paginationItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  const pages = new Set([1, totalPages]);
  for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) pages.add(page);
  if (currentPage <= 3) for (let page = 2; page <= Math.min(3, totalPages); page++) pages.add(page);
  if (currentPage >= totalPages - 2) for (let page = Math.max(2, totalPages - 2); page < totalPages; page++) pages.add(page);

  const sorted = [...pages].sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  sorted.forEach((page, index) => {
    const gap = page - (sorted[index - 1] ?? page);
    if (gap === 2) items.push(page - 1);
    if (gap > 2) items.push("ellipsis");
    items.push(page);
  });
  return items;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  pageHref,
}: {
  currentPage: number;
  totalPages: number;
  pageHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="catalog-pagination" aria-label="Phân trang sản phẩm">
      {currentPage > 1 ? (
        <Link className="catalog-pagination__button" href={pageHref(currentPage - 1)} aria-label="Trang trước">
          <ArrowLeft weight="bold" />
        </Link>
      ) : <button className="catalog-pagination__button" type="button" aria-label="Trang trước" disabled><ArrowLeft weight="bold" /></button>}
      <div className="catalog-pagination__pages">
        {paginationItems(currentPage, totalPages).map((item, index) => item === "ellipsis" ? (
          <span className="catalog-pagination__ellipsis" key={`ellipsis-${index}`} aria-hidden="true">…</span>
        ) : item === currentPage ? (
          <span className="catalog-pagination__button is-active" key={item} aria-current="page" aria-label={`Trang ${item}`}>{item}</span>
        ) : (
          <Link className="catalog-pagination__button" href={pageHref(item)} key={item} aria-label={`Trang ${item}`}>{item}</Link>
        ))}
      </div>
      {currentPage < totalPages ? (
        <Link className="catalog-pagination__button" href={pageHref(currentPage + 1)} aria-label="Trang sau">
          <ArrowRight weight="bold" />
        </Link>
      ) : <button className="catalog-pagination__button" type="button" aria-label="Trang sau" disabled><ArrowRight weight="bold" /></button>}
    </nav>
  );
}
