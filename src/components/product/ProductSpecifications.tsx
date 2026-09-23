import type { Product } from "@/lib/shopify/types";
const labels: Record<string, string> = { specifications: "Thông số kỹ thuật", dimensions: "Kích thước", materials: "Vật liệu", warranty: "Bảo hành", application: "Ứng dụng", certification: "Chứng nhận" };
export function ProductSpecifications({ product, extra = [] }: { product: Product; extra?: Array<{ label: string; value: string }> }) {
  const visible = product.metafields.filter((field) => field?.value && labels[field.key]);
  if (!visible.length && !extra.length) return null;
  return <section className="product-specs"><h2>Thông tin sản phẩm</h2><dl>
    {visible.map((field) => <div key={`${field.namespace}.${field.key}`}><dt>{labels[field.key]}</dt><dd>{field.value}</dd></div>)}
    {extra.map((field, index) => <div key={`${field.label}-${index}`}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}
  </dl></section>;
}
