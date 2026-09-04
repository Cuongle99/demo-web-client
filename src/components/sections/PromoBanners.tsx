import Image from "next/image";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";

const banners = [
  { image: "/assets/hospital-solutions.png", title: "Giải pháp thiết bị y tế cho bệnh viện & phòng khám", points: ["Tư vấn thiết kế phòng chức năng", "Cung cấp thiết bị đồng bộ", "Hỗ trợ kỹ thuật trọn gói"], href: "/contact", className: "promo-card--blue" },
  { image: "/assets/home-health.png", title: "Thiết bị y tế cho gia đình", points: ["Sản phẩm chính hãng", "Dễ sử dụng", "An toàn - Hiệu quả"], href: "/collections/y-te-gia-dinh", className: "promo-card--teal" },
];

export function PromoBanners() { return <section className="promo-grid">{banners.map((banner) => <article className={`promo-card ${banner.className}`} key={banner.title}><Image src={banner.image} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" /><div><h2>{banner.title}</h2>{banner.points.map((point) => <p key={point}><CheckCircle weight="fill" />{point}</p>)}<Button href={banner.href} variant="light">Tìm hiểu ngay</Button></div></article>)}</section>; }
