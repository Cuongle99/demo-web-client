"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/shopify/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const [selectedUrl, setSelectedUrl] = useState(images[0]?.url);
  const selectedImage = images.find((image) => image.url === selectedUrl) ?? images[0];

  if (!selectedImage) {
    return <div className="product-gallery__empty">Chưa có hình ảnh sản phẩm</div>;
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <Image
          src={selectedImage.url}
          alt={selectedImage.altText || product.title}
          fill
          priority
          sizes="(max-width: 800px) 100vw, 50vw"
          style={{ objectPosition: selectedImage.focalPosition ?? "center" }}
        />
      </div>

      {images.length > 1 && (
        <div className="product-gallery__thumbs" aria-label="Danh sách ảnh sản phẩm">
          {images.map((image, index) => {
            const isSelected = image.url === selectedImage.url;

            return (
              <button
                className={`product-gallery__thumb${isSelected ? " is-active" : ""}`}
                type="button"
                key={`${image.url}-${index}`}
                aria-label={`Xem ảnh ${index + 1} của ${product.title}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedUrl(image.url)}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${product.title} - ảnh ${index + 1}`}
                  fill
                  sizes="82px"
                  style={{ objectPosition: image.focalPosition ?? "center" }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
