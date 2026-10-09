# Toàn Tâm Medical — Headless Shopify Catalog

Production-oriented Next.js catalog based on the supplied visual reference. Shopify is the content backend; the public experience intentionally has no cart, checkout, payment, or order creation.

## Local development

1. Copy `.env.example` to `.env.local` and add Shopify Storefront API credentials. Without credentials, realistic mock catalog data is used.
2. Run `npm run dev`.
3. Open `http://localhost:3000`.

The contact adapter posts to `CONTACT_WEBHOOK_URL` when configured. This keeps Resend, SendGrid, SMTP, HubSpot, Salesforce, or a custom CRM replaceable without changing the UI or route handlers.

Run `npm run lint` and `npm run build` before deployment.
Run `node --test scripts/verify-seo.mjs` for canonical URL and sitemap pagination regression checks.

## Production domain

The production website URL defaults to `https://www.thiet-bi-y-te-toan-tam.com`.
Canonical links, social metadata, structured data, the sitemap, and the robots
sitemap reference use this URL. Local development defaults to `http://localhost:3000`.

If the hosting provider already defines `NEXT_PUBLIC_SITE_URL`, update it to
`https://www.thiet-bi-y-te-toan-tam.com` before rebuilding and deploying. This variable
overrides the default and is resolved at build time. The known production apex
host is normalized to `www`, including older environment values.

Add the domain to the hosting project and point its DNS records to the values
provided by that host. Configure HTTPS and redirect the apex domain to the primary domain
`www.thiet-bi-y-te-toan-tam.com` in the hosting dashboard.
