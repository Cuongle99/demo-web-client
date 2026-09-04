"use client";

import Image from "next/image";
import Link from "next/link";
import { List, Phone, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return <div className={`mobile-nav ${open ? "mobile-nav--open" : ""}`}>
    <button ref={triggerRef} className="mobile-nav__trigger" type="button" aria-expanded={open} aria-controls="mobile-drawer" onClick={() => setOpen(true)}>
      <List weight="bold" aria-hidden="true" /><span>Menu</span>
    </button>
    <button className="mobile-nav__backdrop" type="button" aria-label="Đóng menu" tabIndex={open ? 0 : -1} onClick={close} />
    <aside id="mobile-drawer" className="mobile-nav__drawer" aria-label="Menu chính" aria-modal="true" role="dialog" aria-hidden={!open}>
      <div className="mobile-nav__header">
        <Image src="/assets/logo-header.png" alt="Toàn Tâm Medical" width={150} height={45} />
        <button ref={closeRef} type="button" aria-label="Đóng menu" onClick={close}><X weight="bold" /></button>
      </div>
      <nav aria-label="Điều hướng mobile">
        {siteConfig.nav.map((item) => <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>)}
      </nav>
      <div className="mobile-nav__actions">
        <a href={siteConfig.phoneHref}><Phone weight="fill" /> {siteConfig.phone}</a>
        <Link href="/request-quote" onClick={close}>Yêu cầu báo giá</Link>
      </div>
    </aside>
  </div>;
}
