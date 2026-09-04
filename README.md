# Toàn Tâm Medical — Headless Shopify Catalog

Production-oriented Next.js catalog based on the supplied visual reference. Shopify is the content backend; the public experience intentionally has no cart, checkout, payment, or order creation.

## Local development

1. Copy `.env.example` to `.env.local` and add Shopify Storefront API credentials. Without credentials, realistic mock catalog data is used.
2. Run `npm run dev`.
3. Open `http://localhost:3000`.

The contact adapter posts to `CONTACT_WEBHOOK_URL` when configured. This keeps Resend, SendGrid, SMTP, HubSpot, Salesforce, or a custom CRM replaceable without changing the UI or route handlers.

Run `npm run lint` and `npm run build` before deployment.
