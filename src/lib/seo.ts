import type { BlogArticle, Product, ProductVariant } from "@/lib/shopify/types";
import { siteConfig } from "@/config/site";

export const DEFAULT_SOCIAL_IMAGE = "/assets/logo-toan-tam.png";

export function conciseText(text: string, maxLength = 175) {
  const clean = text.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const fragment = clean.slice(0, maxLength + 1);
  const boundary = fragment.lastIndexOf(" ");
  return `${fragment.slice(0, boundary > maxLength * .65 ? boundary : maxLength).trim()}…`;
}

export function productMetaDescription(product: Product) {
  if (product.seo.description?.trim()) return product.seo.description.trim();
  const title = conciseText(product.title, 105).replace(/…$/, "");
  return conciseText(`${title}. Xem đặc điểm, hình ảnh, giá tham khảo và nhận tư vấn từ ${siteConfig.name}.`, 175);
}

export function productVariantKey(variant: ProductVariant) {
  return variant.id.split("/").at(-1) || variant.id;
}

export function productSchema(product: Product) {
  const url = new URL(`/products/${encodeURIComponent(product.handle)}`, siteConfig.url).href;
  const description = conciseText(product.description || product.seo.description || product.title, 500);
  const images = (product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [])
    .map((image) => new URL(image.url, siteConfig.url).href);
  const brand = product.vendor?.trim() ? { brand: { "@type": "Brand", name: product.vendor.trim() } } : {};
  const variants = product.variants;
  if (!variants.some((variant) => Number.isFinite(Number(variant.price.amount))
    && Number(variant.price.amount) > 0 && variant.price.currencyCode)) return null;

  function offer(variant: ProductVariant, variantUrl: string) {
    const price = Number(variant.price.amount);
    if (!Number.isFinite(price) || price <= 0 || !variant.price.currencyCode) return {};
    return { offers: {
      "@type": "Offer",
      url: variantUrl,
      price,
      priceCurrency: variant.price.currencyCode,
      availability: variant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    } };
  }

  if (variants.length < 2) {
    const variant = variants[0];
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#product`,
      url,
      name: product.title,
      description,
      image: images,
      ...(variant?.sku ? { sku: variant.sku } : {}),
      ...brand,
      ...(variant ? offer(variant, url) : {}),
    };
  }

  const optionProperties: Record<string, string> = {
    color: "color", "màu": "color", "màu sắc": "color",
    size: "size", "kích cỡ": "size", "kích thước": "size",
    material: "material", "chất liệu": "material",
    pattern: "pattern", "họa tiết": "pattern",
  };
  const variesBy = [...new Set(variants.flatMap((variant) => variant.selectedOptions
    .map((option) => optionProperties[option.name.trim().toLocaleLowerCase("vi-VN")])
    .filter((property): property is string => Boolean(property))))]
    .map((property) => `https://schema.org/${property}`);

  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": `${url}#product-group`,
    url,
    name: product.title,
    description,
    image: images,
    ...brand,
    productGroupID: product.id.split("/").at(-1) || product.id,
    ...(variesBy.length ? { variesBy } : {}),
    hasVariant: variants.map((variant) => {
      const variantUrl = new URL(url);
      variantUrl.searchParams.set("variant", productVariantKey(variant));
      const options = variant.selectedOptions.filter((option) => !/^default title$/i.test(option.value.trim()));
      const otherOptions = options.filter((option) => !optionProperties[option.name.trim().toLocaleLowerCase("vi-VN")]);
      return {
        "@type": "Product",
        "@id": `${url}#variant-${encodeURIComponent(productVariantKey(variant))}`,
        url: variantUrl.href,
        name: options.length ? `${product.title} - ${options.map((option) => option.value).join(" / ")}` : `${product.title} - ${variant.title}`,
        description: options.length ? `${description} Phiên bản: ${options.map((option) => option.value).join(" / ")}.` : description,
        image: images,
        ...(variant.sku ? { sku: variant.sku } : {}),
        ...Object.fromEntries(options.flatMap((option) => {
          const property = optionProperties[option.name.trim().toLocaleLowerCase("vi-VN")];
          return property ? [[property, option.value]] : [];
        })),
        ...(otherOptions.length ? { additionalProperty: otherOptions.map((option) => ({
          "@type": "PropertyValue", name: option.name, value: option.value,
        })) } : {}),
        ...offer(variant, variantUrl.href),
      };
    }),
  };
}

export function articleMetaDescription(article: BlogArticle) {
  return conciseText(article.seo.description || article.excerpt || article.contentHtml, 175);
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).href,
    })),
  };
}

export function jsonLdString(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
