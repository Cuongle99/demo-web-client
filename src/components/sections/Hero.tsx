"use client";

import { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import type { HomepageHeroContent } from "@/lib/shopify/content";

function Arrow({ direction }: { direction: "left" | "right" }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 6 6 6-6 6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Hero({ slides }: { slides: HomepageHeroContent[] }) {
  const items = slides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), 6000);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  const move = (direction: -1 | 1) => setActive((current) => (current + direction + items.length) % items.length);

  if (!items.length) return null;

  const activeSlide = items[active] ?? items[0];
  const desktopImage = activeSlide.desktopImage ?? activeSlide.mobileImage;
  const desktopRatio = desktopImage?.width && desktopImage.height
    ? `${desktopImage.width} / ${desktopImage.height}`
    : undefined;
  const mobileImage = activeSlide.mobileImage ?? activeSlide.desktopImage;
  const mobileRatio = mobileImage?.width && mobileImage.height
    ? `${mobileImage.width} / ${mobileImage.height}`
    : desktopRatio;
  const heroStyle = {
    "--hero-desktop-ratio": desktopRatio,
    "--hero-mobile-ratio": mobileRatio,
  } as CSSProperties;
  const hasImageRatio = Boolean(desktopRatio || mobileRatio);

  return <section className={`hero ${hasImageRatio ? "hero--has-image" : ""}`} style={heroStyle} aria-label="Banner nổi bật" onFocusCapture={(event) => { if (!(event.target as HTMLElement).closest(".hero__pause")) setPaused(true); }}>
    {items.map((slide, index) => {
      const desktopImage = slide.desktopImage ?? slide.mobileImage;
      const mobileImage = slide.mobileImage ?? desktopImage;
      const verifiedBannerAlt: Record<string, string> = {
        "slide-1.webp": "Toàn Tâm – Vì một cuộc sống khỏe hơn mỗi ngày. Thiết bị y tế, dụng cụ hỗ trợ và phục hồi chức năng tại nhà.",
        "slide-2.webp": "Toàn Tâm – Chăm sóc sức khỏe ngay tại nhà: xe lăn, khung tập đi, giường y tế và dụng cụ hỗ trợ vận động.",
      };
      const filename = desktopImage?.url.split("?")[0].split("/").pop() ?? "";
      const alt = desktopImage?.altText || slide.heading || verifiedBannerAlt[filename] || slide.description || "Thiết bị chăm sóc sức khỏe tại Toàn Tâm";
      const desktopProps = desktopImage ? getImageProps({ src: desktopImage.url, alt, width: desktopImage.width || 1440, height: desktopImage.height || 600, sizes: "100vw" }).props : null;
      const mobileProps = mobileImage ? getImageProps({ src: mobileImage.url, alt, width: mobileImage.width || 750, height: mobileImage.height || 320, sizes: "100vw" }).props : null;
      return <article className={`hero__slide ${index === active ? "hero__slide--active" : ""}`} aria-hidden={index !== active} key={slide.id}>
        {index === 0 && desktopProps && mobileProps && <>
          {/* Match picture's mutually exclusive sources so only one banner is preloaded. */}
          {mobileProps.srcSet !== desktopProps.srcSet && <link rel="preload" as="image" href={mobileProps.src} media="(max-width: 700px)" imageSrcSet={mobileProps.srcSet} imageSizes={mobileProps.sizes} fetchPriority="high" />}
          <link rel="preload" as="image" href={desktopProps.src} media={mobileProps.srcSet !== desktopProps.srcSet ? "(width > 700px)" : undefined} imageSrcSet={desktopProps.srcSet} imageSizes={desktopProps.sizes} fetchPriority="high" />
        </>}
        {desktopProps && mobileProps && <picture>
          <source media="(max-width: 700px)" srcSet={mobileProps.srcSet} sizes={mobileProps.sizes} />
          {/* getImageProps supplies optimized srcset while picture downloads only the matching source. */}
          <img {...desktopProps} alt={alt} className="hero__image" loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} />
        </picture>}
        <div className="hero__content">
          {slide.heading && <h2>{slide.heading}</h2>}
          {slide.description && <p className="hero__lead">{slide.description}</p>}
          {slide.ctaLabel && slide.ctaLink && <Button href={slide.ctaLink}>{slide.ctaLabel}</Button>}
        </div>
      </article>;
    })}
    {items.length > 1 && <><button className="hero__arrow hero__arrow--prev" type="button" aria-label="Banner trước" onClick={() => move(-1)}><Arrow direction="left" /></button><button className="hero__arrow hero__arrow--next" type="button" aria-label="Banner tiếp theo" onClick={() => move(1)}><Arrow direction="right" /></button></>}
    <div className="hero__dots" aria-label="Chọn banner">{items.map((slide, index) => <button className={index === active ? "is-active" : ""} type="button" aria-label={`Banner ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} key={slide.id} />)}</div>
    {items.length > 1 && <button className="hero__pause" type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Tiếp tục chuyển banner" : "Tạm dừng chuyển banner"}>{paused ? "Phát" : "Tạm dừng"}</button>}
  </section>;
}
