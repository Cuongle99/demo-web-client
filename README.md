# Toàn Tâm Medical — Headless Shopify Catalog

Production-oriented Next.js catalog based on the supplied visual reference. Shopify is the content backend; the public experience intentionally has no cart, checkout, payment, or order creation.

## Local development

1. Create `.env.local` with `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. For offline development only, leave both unset and explicitly set `SHOPIFY_USE_MOCK_DATA=true`. Partial configuration always fails; production never uses mock data.
2. Run `npm run dev`.
3. Open `http://localhost:3000`.

The contact adapter posts to `CONTACT_WEBHOOK_URL` when configured. This keeps Resend, SendGrid, SMTP, HubSpot, Salesforce, or a custom CRM replaceable without changing the UI or route handlers.

Run `npm run lint` and `npm run build` before deployment.
Run `npx next typegen` and `npx tsc --noEmit` for type checking without API credentials.
Run `node --test scripts/verify-seo.mjs scripts/verify-shopify.mjs` for metadata, sitemap, configuration and upstream failure checks.
Production builds require both Shopify variables in the target hosting environment. Preview has separate variables; a failed preview with missing variables must not be fixed by enabling mock data. Runtime API failures reach retryable error boundaries; only real missing resources become 404s.

The sitemap intentionally omits `lastModified`: generic Shopify `updatedAt` has not been verified as a meaningful content-change timestamp. Add it only when backed by a reliable editorial timestamp.
Policy drafts stay outside public routes and the sitemap until the owner approves the actual business terms. Do not infer return/shipping schema from placeholders.

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
