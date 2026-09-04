import { Ambulance, Medal, ShieldCheck, UserFocus } from "@phosphor-icons/react/dist/ssr";

const items = [
  { icon: ShieldCheck, title: "Sản phẩm chính hãng", text: "Cam kết 100% chính hãng, đầy đủ chứng từ" },
  { icon: Medal, title: "Giá cạnh tranh", text: "Giá tốt nhất thị trường, nhiều ưu đãi hấp dẫn" },
  { icon: UserFocus, title: "Tư vấn chuyên nghiệp", text: "Đội ngũ giàu kinh nghiệm, tư vấn tận tâm" },
  { icon: Ambulance, title: "Giao hàng toàn quốc", text: "Giao hàng nhanh chóng, đúng hẹn" },
  { icon: ShieldCheck, title: "Bảo hành uy tín", text: "Bảo hành chính hãng, hỗ trợ kỹ thuật 24/7" },
];

export function TrustBand() {
  return <section className="trust-section"><h2>Vì sao chọn Toàn Tâm?</h2><div className="trust-grid">{items.map(({ icon: Icon, title, text }) => <div key={title}><span><Icon /></span><p><strong>{title}</strong><small>{text}</small></p></div>)}</div></section>;
}
