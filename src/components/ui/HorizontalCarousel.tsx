"use client";

import { useRef, type ReactNode } from "react";

function Arrow({ direction }: { direction: "left" | "right" }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 6 6 6-6 6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function HorizontalCarousel({ children, label, trackClassName = "" }: { children: ReactNode; label: string; trackClassName?: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => viewportRef.current?.scrollBy({ left: direction * viewportRef.current.clientWidth * 0.85, behavior: "smooth" });

  return <div className="carousel" aria-label={label} role="region"><button className="carousel__arrow carousel__arrow--prev" type="button" aria-label={`Xem ${label} trước`} onClick={() => move(-1)}><Arrow direction="left" /></button><div className="carousel__viewport" ref={viewportRef}><div className={`carousel__track ${trackClassName}`}>{children}</div></div><button className="carousel__arrow carousel__arrow--next" type="button" aria-label={`Xem ${label} tiếp theo`} onClick={() => move(1)}><Arrow direction="right" /></button></div>;
}
