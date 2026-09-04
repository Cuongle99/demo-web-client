"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product, ProductMedia } from "@/lib/shopify/types";

function PlayIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.6v12.8a1 1 0 0 0 1.55.83l9.13-6.4a1 1 0 0 0 0-1.66L9.55 4.77A1 1 0 0 0 8 5.6Z" /></svg>;
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 6 6 6-6 6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function metafieldVideo(product: Product): ProductMedia | null {
  const field = product.metafields.find((item) => item.key === "video_url" || item.key === "youtube_url");
  const value = field?.value.trim();
  if (!value?.startsWith("http")) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    let embedUrl: string | undefined;

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (host === "youtube.com" || host === "m.youtube.com") {
      const segments = url.pathname.split("/").filter(Boolean);
      const id = url.searchParams.get("v") || (segments[0] === "embed" || segments[0] === "shorts" ? segments[1] : undefined);
      if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean).at(-1);
      if (id) embedUrl = `https://player.vimeo.com/video/${id}`;
    }

    if (embedUrl) return { id: `metafield-video-${embedUrl}`, type: "externalVideo", altText: `Video ${product.title}`, embedUrl };

    const format = url.pathname.split(".").at(-1)?.toLowerCase();
    if (format && ["mp4", "webm", "ogg", "mov"].includes(format)) {
      const mimeFormat = format === "mov" ? "quicktime" : format;
      return { id: `metafield-video-${value}`, type: "video", altText: `Video ${product.title}`, sources: [{ url: value, format, mimeType: `video/${mimeFormat}` }] };
    }
  } catch {
    return null;
  }

  return null;
}

export function ProductGallery({ product }: { product: Product }) {
  const fallbackImages: ProductMedia[] = product.images.map((image, index) => ({ id: `image-${index}-${image.url}`, type: "image", altText: image.altText, image }));
  const shopifyMedia = product.media?.length ? product.media : fallbackImages;
  const fallbackVideo = metafieldVideo(product);
  const items = fallbackVideo && !shopifyMedia.some((item) => item.type !== "image") ? [...shopifyMedia, fallbackVideo] : shopifyMedia;
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [thumbState, setThumbState] = useState({ overflow: false, canGoBack: false, canGoForward: false });

  const updateThumbState = useCallback(() => {
    const viewport = thumbsRef.current;
    if (!viewport) return;
    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    setThumbState({
      overflow: maxScroll > 2,
      canGoBack: viewport.scrollLeft > 2,
      canGoForward: viewport.scrollLeft < maxScroll - 2,
    });
  }, []);

  useEffect(() => {
    const viewport = thumbsRef.current;
    if (!viewport) return;

    updateThumbState();
    viewport.addEventListener("scroll", updateThumbState, { passive: true });
    const observer = new ResizeObserver(updateThumbState);
    observer.observe(viewport);
    Array.from(viewport.children).forEach((child) => observer.observe(child));

    return () => {
      viewport.removeEventListener("scroll", updateThumbState);
      observer.disconnect();
    };
  }, [items.length, updateThumbState]);

  const scrollThumbs = (direction: -1 | 1) => {
    const viewport = thumbsRef.current;
    viewport?.scrollBy({ left: direction * viewport.clientWidth * .8, behavior: "smooth" });
  };

  if (!selectedItem) {
    return <div className="product-gallery__empty">Chưa có hình ảnh sản phẩm</div>;
  }

  return (
    <div className="product-gallery">
      <div className={`product-gallery__main product-gallery__main--${selectedItem.type}`}>
        {selectedItem.type === "image" && (
          <Image src={selectedItem.image.url} alt={selectedItem.altText || product.title} fill priority sizes="(max-width: 800px) 100vw, 50vw" style={{ objectPosition: selectedItem.image.focalPosition ?? "center" }} />
        )}
        {selectedItem.type === "video" && (
          <video key={selectedItem.id} controls playsInline preload="metadata" poster={selectedItem.previewImage?.url} aria-label={selectedItem.altText || `Video ${product.title}`}>
            {selectedItem.sources.map((source) => <source key={source.url} src={source.url} type={source.mimeType} />)}
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        )}
        {selectedItem.type === "externalVideo" && (
          <iframe key={selectedItem.id} src={selectedItem.embedUrl} title={selectedItem.altText || `Video ${product.title}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        )}
      </div>

      {items.length > 1 && (
        <div className={`product-gallery__thumb-carousel${thumbState.overflow ? " has-controls" : ""}`}>
          {thumbState.overflow && (
            <button className="product-gallery__thumb-arrow" type="button" aria-label="Xem thumbnail trước" disabled={!thumbState.canGoBack} onClick={() => scrollThumbs(-1)}><ArrowIcon direction="left" /></button>
          )}
          <div className="product-gallery__thumbs" ref={thumbsRef} aria-label="Danh sách ảnh và video sản phẩm">
            {items.map((item, index) => {
              const isSelected = item.id === selectedItem.id;
              const preview = item.type === "image" ? item.image : item.previewImage;
              const isVideo = item.type !== "image";

              return (
                <button
                  className={`product-gallery__thumb${isSelected ? " is-active" : ""}`}
                  type="button"
                  key={item.id}
                  aria-label={`${isVideo ? "Xem video" : `Xem ảnh ${index + 1}`} của ${product.title}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(item.id)}
                >
                  {preview ? <Image src={preview.url} alt={preview.altText || item.altText || product.title} fill sizes="82px" /> : <span className="product-gallery__thumb-placeholder">Video</span>}
                  {isVideo && <span className="product-gallery__play"><PlayIcon /></span>}
                </button>
              );
            })}
          </div>
          {thumbState.overflow && (
            <button className="product-gallery__thumb-arrow" type="button" aria-label="Xem thumbnail tiếp theo" disabled={!thumbState.canGoForward} onClick={() => scrollThumbs(1)}><ArrowIcon direction="right" /></button>
          )}
        </div>
      )}
    </div>
  );
}
