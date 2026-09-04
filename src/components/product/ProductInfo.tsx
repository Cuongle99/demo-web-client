"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle, Phone } from "@phosphor-icons/react";
import type { Money, Product, ProductVariant } from "@/lib/shopify/types";
import { siteConfig } from "@/config/site";

function formatPrice(money?: Money) {
  if (!money || Number(money.amount) === 0) return "Liên hệ để nhận báo giá";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(money.amount));
}

function optionsFor(variant?: ProductVariant) {
  if (!variant) return [];
  if (variant.selectedOptions.length > 0) return variant.selectedOptions;
  if (/^(default title|mặc định)$/i.test(variant.title.trim())) return [];

  const values = variant.title.split(" / ").map((value) => value.trim()).filter(Boolean);
  return values.map((value, index) => ({
    name: values.length === 1 ? "Lựa chọn" : `Lựa chọn ${index + 1}`,
    value,
  }));
}

export function ProductInfo({ product }: { product: Product }) {
  const initialVariant = product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(initialVariant?.id ?? "");
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) ?? initialVariant;

  const optionGroups = useMemo(() => {
    const groups = new Map<string, string[]>();
    product.variants.forEach((variant) => {
      optionsFor(variant).forEach(({ name, value }) => {
        const values = groups.get(name) ?? [];
        if (!values.includes(value)) values.push(value);
        groups.set(name, values);
      });
    });
    return Array.from(groups, ([name, values]) => ({ name, values }));
  }, [product.variants]);

  const selectedOptions = new Map(optionsFor(selectedVariant).map(({ name, value }) => [name, value]));
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const hasDiscount = Boolean(
    compareAtPrice && Number(compareAtPrice.amount) > Number(selectedVariant?.price.amount ?? 0),
  );

  function selectOption(name: string, value: string) {
    const wanted = new Map(selectedOptions);
    wanted.set(name, value);

    const exactMatch = product.variants.find((variant) => {
      const variantOptions = new Map(optionsFor(variant).map((option) => [option.name, option.value]));
      return Array.from(wanted).every(([optionName, optionValue]) => variantOptions.get(optionName) === optionValue);
    });
    const availableMatch = product.variants.find((variant) =>
      variant.availableForSale && optionsFor(variant).some((option) => option.name === name && option.value === value),
    );

    const nextVariant = exactMatch?.availableForSale ? exactMatch : availableMatch ?? exactMatch;
    setSelectedVariantId(nextVariant?.id ?? selectedVariantId);
  }

  function optionIsAvailable(name: string, value: string) {
    return product.variants.some((variant) => {
      if (!variant.availableForSale) return false;
      return optionsFor(variant).some((option) => option.name === name && option.value === value);
    });
  }

  const quoteHref = selectedVariant
    ? `/request-quote?product=${encodeURIComponent(product.handle)}&variant=${encodeURIComponent(selectedVariant.id)}`
    : `/request-quote?product=${encodeURIComponent(product.handle)}`;

  return (
    <div className="product-info">
      <p className="eyebrow">{product.productType || "Thiết bị y tế"}</p>
      <h1>{product.title}</h1>
      <div className="product-info__meta">
        <span>SKU: <strong>{selectedVariant?.sku || "Đang cập nhật"}</strong></span>
        <span>Thương hiệu: <strong>{product.vendor || "Toàn Tâm"}</strong></span>
      </div>
      <div className="product-info__pricing" aria-live="polite">
        <p className="product-info__price">{formatPrice(selectedVariant?.price)}</p>
        {hasDiscount && <del>{formatPrice(compareAtPrice)}</del>}
      </div>

      {optionGroups.length > 0 && (
        <div className="product-variants" aria-label="Lựa chọn phiên bản sản phẩm">
          {optionGroups.map((group) => (
            <fieldset className="product-variants__group" key={group.name}>
              <legend>{group.name}: <strong>{selectedOptions.get(group.name)}</strong></legend>
              <div className="product-variants__options">
                {group.values.map((value) => {
                  const selected = selectedOptions.get(group.name) === value;
                  const available = optionIsAvailable(group.name, value);
                  return (
                    <button
                      className="product-variants__option"
                      data-selected={selected || undefined}
                      disabled={!available && !selected}
                      key={value}
                      onClick={() => selectOption(group.name, value)}
                      type="button"
                      aria-pressed={selected}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <p className={`product-variants__stock ${selectedVariant?.availableForSale ? "is-available" : "is-unavailable"}`} role="status">
            <span aria-hidden="true" />
            {selectedVariant?.availableForSale ? "Còn hàng" : "Tạm hết hàng"}
          </p>
        </div>
      )}

      <ul>
        <li><CheckCircle weight="fill" />Cam kết hàng chính hãng</li>
        <li><CheckCircle weight="fill" />Tư vấn cấu hình phù hợp nhu cầu</li>
        <li><CheckCircle weight="fill" />Bảo hành và hỗ trợ kỹ thuật</li>
      </ul>
      <div className="product-info__actions">
        <Link className="button button--primary" href={quoteHref}>Yêu cầu báo giá</Link>
        <a className="button button--outline" href={siteConfig.phoneHref}><Phone weight="fill" /> {siteConfig.phone}</a>
      </div>
    </div>
  );
}
