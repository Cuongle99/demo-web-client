import type { Metadata } from "next";
import { Field, TextareaField } from "@/components/forms/Fields";
import { SubmitForm } from "@/components/forms/SubmitForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/config/site";
import { getSeoPage } from "@/lib/shopify/seo-content";
import { DEFAULT_SOCIAL_IMAGE } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoPage("/contact");
  const title = seo?.title || "Liên hệ";
  const description = seo?.description || "Liên hệ Toàn Tâm Medical để được tư vấn thiết bị y tế cho gia đình, phòng khám hoặc bệnh viện.";
  return { title, description, alternates: { canonical: "/contact" },
    openGraph: { title, description, images: [seo?.socialImage?.url || DEFAULT_SOCIAL_IMAGE] } };
}

export default async function ContactPage() {
  const seo = await getSeoPage("/contact");
  return <div className="inner-page container"><Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]} /><div className="form-layout"><div><p className="eyebrow">Kết nối với chúng tôi</p><h1>{seo?.heading || "Liên hệ Toàn Tâm"}</h1><p>{seo?.intro || "Đội ngũ chuyên viên sẽ phản hồi trong giờ làm việc gần nhất."}</p><address><strong>Hotline</strong><a href={siteConfig.phoneHref}>{siteConfig.phone}</a><strong>Email</strong><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><strong>Địa chỉ</strong><span>{siteConfig.address}</span></address></div><SubmitForm endpoint="/api/contact" successMessage="Cảm ơn bạn. Chúng tôi đã nhận được thông tin và sẽ sớm liên hệ."><div className="form-grid"><Field label="Họ và tên" name="name" required /><Field label="Công ty" name="company" /><Field label="Email" name="email" type="email" required /><Field label="Điện thoại" name="phone" type="tel" /><Field label="Chủ đề" name="subject" required /><TextareaField label="Nội dung" name="message" required /></div></SubmitForm></div></div>;
}
