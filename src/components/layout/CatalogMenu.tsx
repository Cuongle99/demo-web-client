"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";

export function CatalogMenu({ collections }: { collections: ReadonlyArray<{ handle: string; title: string }> }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const closeOutside = (event: Event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.open = false;
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && detailsRef.current?.open) {
        detailsRef.current.open = false;
        detailsRef.current.querySelector("summary")?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <details className="catalog-menu" ref={detailsRef}>
      <summary><List weight="bold" /><span>Danh mục sản phẩm</span></summary>
      <div className="catalog-menu__panel">
        {collections.map((collection) => (
          <Link
            href={`/collections/${collection.handle}`}
            key={collection.handle}
            onClick={() => { if (detailsRef.current) detailsRef.current.open = false; }}
          >
            {collection.title}
          </Link>
        ))}
      </div>
    </details>
  );
}
