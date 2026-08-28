# Project delivery checklist

Last updated: 2026-08-21

## Completed in this starter

- [x] Organized the supplied project documentation and brand references.
- [x] Next.js + TypeScript + Tailwind project configuration.
- [x] Responsive premium storefront: home, sport collections, product details, cart and checkout.
- [x] Client cart interactions and server-validated checkout request.
- [x] Product APIs and Paystack initialization / signed webhook foundations.
- [x] Supabase schema baseline, RLS starter policies and protected admin route pattern.
- [x] Versioned Supabase migration and local Supabase configuration.
- [x] Admin dashboard shell for orders, products and supplier mappings.
- [x] Resend transactional order-confirmation service.
- [x] Environment template and setup documentation.

## Required before production

- [ ] Create or link a hosted Supabase project, then apply `supabase/migrations/20260821120000_initial_schema.sql`.
- [ ] Replace `lib/products.ts` seed data with Supabase catalogue queries and add admin CRUD forms.
- [ ] Add Supabase Auth signup, password reset, profile, saved addresses and customer order-history pages.
- [ ] Persist orders and payment attempts before payment initialization; verify amount, currency and reference in the Paystack webhook.
- [ ] Store processed webhook IDs / references to make payment and fulfillment events idempotent.
- [ ] Implement courier quotes, stock reservations, shipment tracking and explicit order state transitions.
- [ ] Build supplier adapter registry and a mock local-stock/manual-fulfillment adapter before any live supplier integration.
- [x] Add protected `POST /api/integrations/n8n/order-paid` input endpoint.
- [ ] Build the n8n workflow and have it fetch authoritative order data before queuing fulfillment.
- [ ] Configure Resend domain, complete all event templates, and persist notification delivery outcomes.
- [ ] Add product search/filter UI backed by Supabase, category FAQs and JSON-LD schema.
- [ ] Add unit, API, accessibility and Playwright end-to-end coverage; run local acceptance checklist.
- [ ] Configure production RLS policies for admin / operations mutations and perform a security review.

## Deliberately deferred (V2)

- [ ] Rackets and paddles (fit-sensitive / higher return category).
- [ ] Live dropship supplier integrations.
- [ ] AI fulfillment decision support after deterministic workflow is complete.
