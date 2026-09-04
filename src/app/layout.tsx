import type { Metadata } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import { Header } from "@/components/layout/Header"; import { Footer } from "@/components/layout/Footer"; import { siteConfig } from "@/config/site";
import "@/styles/reset.css"; import "@/styles/variables.css"; import "@/styles/globals.css"; import "@/styles/utilities.css";
const roboto = Roboto({ subsets: ["latin", "vietnamese"], variable: "--font-body", display: "swap" });
const condensed = Roboto_Condensed({ subsets: ["latin", "vietnamese"], variable: "--font-heading", display: "swap" });
export const metadata: Metadata = { metadataBase: new URL(siteConfig.url), title: { default: `${siteConfig.shortName} | Thiết bị y tế chính hãng`, template: `%s | ${siteConfig.shortName}` }, description: siteConfig.description, alternates: { canonical: "/" }, openGraph: { type: "website", locale: "vi_VN", siteName: siteConfig.name, title: siteConfig.name, description: siteConfig.description } };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="vi" data-scroll-behavior="smooth" className={`${roboto.variable} ${condensed.variable}`}><body><a className="skip-link" href="#main-content">Bỏ qua đến nội dung</a><Header /><main id="main-content">{children}</main><Footer /></body></html>; }
