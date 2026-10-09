import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { shouldUseMockData } from "./src/lib/shopify/config";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }] },
  devIndicators: false,
  redirects: async () => [
    {
      source: "/products/bong-gai-tap-tay-tap-phuc-hoi-chuc-nang-ban-tay-1735155256187126842",
      destination: "/products/bong-gai-tap-tay-phuc-hoi-chuc-nang",
      permanent: true,
    },
    {
      source: "/products/nep-co-inh-ban-chan-ban-em-nep-chinh-ban-chan-giam-au-got-chan-1736539331283944506",
      destination: "/products/nep-co-dinh-ban-chan-ban-dem-nep-chinh-ban-chan-giam-dau-got-chan",
      permanent: true,
    },
  ],
};

export default function config(phase: string): NextConfig {
  // Type generation does not fetch content and must work without credentials.
  if (phase === PHASE_PRODUCTION_BUILD && !process.argv.includes("typegen")) shouldUseMockData({ ...process.env, NODE_ENV: "production" });
  return nextConfig;
}
