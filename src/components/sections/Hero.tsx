"use client";

import Image from "next/image";
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

  useEffect(() => {
    if (items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), 6000);
    return () => window.clearInterval(timer);
  }, [items.length]);

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

  return <section className={`hero ${hasImageRatio ? "hero--has-image" : ""}`} style={heroStyle} aria-label="Banner nổi bật">
    {items.map((slide, index) => {
      const desktopImage = slide.desktopImage ?? slide.mobileImage;
      return <article className={`hero__slide ${index === active ? "hero__slide--active" : ""}`} aria-hidden={index !== active} key={slide.id}>
        {desktopImage && <Image className="hero__image hero__image--desktop" src={desktopImage.url} alt={desktopImage.altText || slide.heading || ""} fill priority={index === 0} loading={index === 0 ? "eager" : "lazy"} sizes="100vw" />}
        {slide.desktopImage && slide.mobileImage && <Image className="hero__image hero__image--mobile" src={slide.mobileImage.url} alt={slide.mobileImage.altText || slide.heading || ""} fill priority={index === 0} loading={index === 0 ? "eager" : "lazy"} sizes="100vw" />}
        <div className="hero__content">
          {slide.heading && <h1>{slide.heading}</h1>}
          {slide.description && <p className="hero__lead">{slide.description}</p>}
          {slide.ctaLabel && slide.ctaLink && <Button href={slide.ctaLink}>{slide.ctaLabel}</Button>}
        </div>
      </article>;
    })}
    {items.length > 1 && <><button className="hero__arrow hero__arrow--prev" type="button" aria-label="Banner trước" onClick={() => move(-1)}><Arrow direction="left" /></button><button className="hero__arrow hero__arrow--next" type="button" aria-label="Banner tiếp theo" onClick={() => move(1)}><Arrow direction="right" /></button></>}
    <div className="hero__dots" aria-label="Chọn banner">{items.map((slide, index) => <button className={index === active ? "is-active" : ""} type="button" aria-label={`Banner ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} key={slide.id} />)}</div>
  </section>;
}
