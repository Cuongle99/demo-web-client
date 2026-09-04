import type { Collection, Product } from "@/lib/shopify/types";

function product(
  handle: string,
  title: string,
  price: string,
  sku: string,
  imagePath: string,
  type: string,
): Product {
  const image = { url: imagePath, altText: title, focalPosition: "center" };
  return {
    id: `mock-${handle}`,
    handle,
    title,
    description: `${title} chính hãng, phù hợp cho nhu cầu chăm sóc và theo dõi sức khỏe chuyên nghiệp.`,
    descriptionHtml: `<p>${title} được tuyển chọn theo tiêu chuẩn chất lượng nghiêm ngặt, vận hành ổn định và dễ sử dụng.</p>`,
    featuredImage: image,
    images: [image],
    variants: [
      {
        id: `mock-${handle}-default`,
        title: "Mặc định",
        sku,
        availableForSale: true,
        price: { amount: price, currencyCode: "VND" },
      },
    ],
    productType: type,
    vendor: "Toàn Tâm Medical",
    tags: ["Chính hãng", "Bảo hành"],
    collections: [{ handle: "thiet-bi-y-te", title: "Thiết bị y tế" }],
    metafields: [
      { namespace: "custom", key: "materials", value: "Vật liệu y tế cao cấp", type: "single_line_text_field" },
      { namespace: "custom", key: "warranty", value: "Bảo hành 12 tháng", type: "single_line_text_field" },
      { namespace: "custom", key: "application", value: "Bệnh viện, phòng khám và chăm sóc tại nhà", type: "multi_line_text_field" },
    ],
    seo: { title: `${title} | Toàn Tâm Medical`, description: `${title} chính hãng, tư vấn chuyên sâu và giao hàng toàn quốc.` },
  };
}

export const mockProducts: Product[] = [
  product("may-do-huyet-ap-hem-7121", "Máy đo huyết áp bắp tay Omron HEM-7121", "690000", "HEM-7121", "/assets/blood-pressure.png", "Thiết bị chẩn đoán"),
  product("may-tao-oxy-jay-5aw", "Máy tạo oxy 5 lít JAY-5AW", "9500000", "JAY-5AW", "/assets/oxygen-concentrator.png", "Thiết bị điều trị"),
  product("giuong-benh-nhan-5-chuc-nang", "Giường bệnh nhân 5 chức năng", "18500000", "TT-G5", "/assets/hospital-bed.png", "Nội thất bệnh viện"),
  product("may-sieu-am-4d-dc70", "Máy siêu âm 4D Mindray DC-70", "0", "DC-70", "/assets/ultrasound.png", "Thiết bị chẩn đoán"),
  product("may-theo-doi-benh-nhan", "Máy theo dõi bệnh nhân BeneVision N1", "0", "BENVISION-N1", "/assets/patient-monitor.png", "Thiết bị chẩn đoán"),
  product("may-dien-tim-3-kenh", "Máy điện tim 3 kênh Contec 300G", "12800000", "ECG-300G", "/assets/ecg.png", "Thiết bị chẩn đoán"),
];

export const mockCollection: Collection = {
  id: "mock-collection",
  handle: "thiet-bi-y-te",
  title: "Thiết bị y tế",
  description: "Danh mục thiết bị y tế chính hãng cho bệnh viện, phòng khám và gia đình.",
  seo: {},
  products: mockProducts,
  pageInfo: { hasNextPage: false },
};

export const categories = [
  { title: "Thiết bị chẩn đoán", handle: "thiet-bi-chan-doan", image: "/assets/patient-monitor.png" },
  { title: "Thiết bị điều trị", handle: "thiet-bi-dieu-tri", image: "/assets/oxygen-concentrator.png" },
  { title: "Thiết bị hồi sức cấp cứu", handle: "hoi-suc-cap-cuu", image: "/assets/ecg.png" },
  { title: "Thiết bị phòng mổ", handle: "thiet-bi-phong-mo", image: "/assets/ultrasound.png" },
  { title: "Thiết bị phục hồi chức năng", handle: "phuc-hoi-chuc-nang", image: "/assets/hospital-bed.png" },
  { title: "Thiết bị y tế gia đình", handle: "y-te-gia-dinh", image: "/assets/blood-pressure.png" },
  { title: "Vật tư tiêu hao y tế", handle: "vat-tu-y-te", image: "/assets/ecg.png" },
  { title: "Nội thất bệnh viện", handle: "noi-that-benh-vien", image: "/assets/hospital-bed.png" },
] as const;
