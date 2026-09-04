import { Certificate, Gear, GraduationCap, Wrench } from "@phosphor-icons/react/dist/ssr";

const services = [
  { icon: Certificate, title: "Lắp đặt - Bàn giao", text: "Tận nơi chuyên nghiệp" },
  { icon: Gear, title: "Bảo trì - Bảo dưỡng", text: "Định kỳ, chu đáo" },
  { icon: Wrench, title: "Sửa chữa thiết bị", text: "Nhanh chóng, uy tín" },
  { icon: GraduationCap, title: "Đào tạo - Hướng dẫn", text: "Sử dụng thiết bị" },
];

export function Services() { return <section id="dich-vu" className="services-band"><h2>Dịch vụ của chúng tôi</h2>{services.map(({ icon: Icon, title, text }) => <div key={title}><Icon /><p><strong>{title}</strong><small>{text}</small></p></div>)}</section>; }
