# The Racket Lifestyle — Project Context

## 1. Purpose

The Racket Lifestyle is a global e-commerce brand for people who live racket sports. It combines performance gear with the culture around play: court time, style, travel, social life, training, recovery and the rituals around the match.

The customer buys from The Racket Lifestyle. After verified payment, the fulfillment system places the corresponding supplier order using the customer's shipping information. The supplier ships directly to the customer. The brand earns a margin between its selling price and the combined supplier/fulfillment cost.

## 2. Market

- Geographic scope: Nigeria (Lagos and Abuja primary, national shipping via domestic courier).
- Core audience: racket-sport enthusiasts and club players.
- Primary sports: tennis, badminton and padel.
  - Tennis carries the brand's premium, club-heritage positioning — Nigeria has an established, prestige-coded tennis culture (clubs, leagues, an active ITF Pro Circuit event).
  - Badminton carries reach and volume — Nigeria's most organized and geographically distributed racket-sport federation, with strong current international relevance.
  - Padel is the growth bet — nascent but real infrastructure in Lagos and Abuja (hotel-led courts), positioned as an early-mover opportunity within a small but rapidly expanding player base.
  - Squash and pickleball are explicitly out of scope for now: squash is a weaker fit for the brand's fashion-forward direction, and pickleball has no confirmed organized presence in Nigeria at this time.
- Audience expression: gender-inclusive, with a brighter, fashion-aware, premium visual language designed to resonate strongly with women while remaining attractive to men who value style, gifting, lifestyle and quality.
- The initial catalogue favors products that are lightweight, easy to ship, easy to explain online, and low-return: grips, strings, shuttlecocks, balls, bags, apparel and court accessories. Rackets and paddles (higher return risk due to fit/feel/grip-size preference) are a deliberate V2 category, introduced once the brand has enough direct community touchpoints (club partnerships, in-person fittings) to support them responsibly.

## 3. Brand idea

**Gear and lifestyle for people who live the sport.**

The brand is not a generic sports marketplace and not a discount warehouse. It should feel like a knowledgeable club member with excellent taste: confident, warm, sharp and grounded.

## 4. Technology

- Website + admin dashboard: Next.js
- Backend/application services: Node.js
- Database: Supabase / PostgreSQL
- Workflow automation + AI agent: n8n
- Transactional email: Resend
- Hosting: Vercel
- Development order: local verification first; production deployment to Vercel only after MVP acceptance tests pass.

## 5. Payment

Payment is Paystack-native. The business operates as a single Nigeria-registered entity, and Paystack is the sole payment provider for V1 — no cross-border/Stripe requirement. The architecture still uses a provider-abstraction interface (see API spec) so a second provider can be added later without a checkout rewrite, but only Paystack needs to be implemented for launch.

The backend must verify payment server-side before fulfillment.

## 6. Fulfillment

Fulfillment model: small-batch bulk import + local stock, not live per-order dropship. Inventory is sourced in modest batches, cleared through Nigerian customs once per batch, held in local storage, and shipped domestically via a Nigerian courier (e.g. GIG Logistics for nationwide, Kwik for same-day Lagos/Abuja). This is the only fulfillment model that can support the brand's "clear delivery estimates, no guesswork" promise — live per-parcel dropship from overseas suppliers direct to Nigerian addresses has unreliable customs/postal handling and undermines that promise.

Supplier strategy is deliberately **platform-agnostic**: no single supplier is hard-wired as "primary." The application is built around a supplier-adapter/registry pattern (see `docs/06-ai/supplier-strategy.md` and `docs/05-api/api-and-integration-specs.md`) so any combination of the following can be connected, swapped, or run in parallel, purely through configuration:
- Bulk-sourcing platforms (Alibaba/1688, CJdropshipping's bulk/wholesale flow) for imported goods.
- Local Nigerian wholesalers/distributors, once identified, for faster-turnaround domestic stock.
- Secondary global platforms (Syncee, Spocket, DSers) where they fit a specific product need.
- Direct brand-authorized wholesale relationships (for the V2 racket/paddle category).

The application must use a supplier-adapter interface so adding, removing, or switching any supplier or sourcing platform never requires rewriting the order or fulfillment system.

## 7. Product architecture principle

The database and deterministic backend rules are the source of truth.

n8n controls workflows.

AI assists with classification, matching, exception handling and recommendations. AI must not be authoritative for payment status, order state, money values, supplier IDs or customer permissions.

## 8. MVP objective

Build a fully functioning local MVP with:
- public storefront
- product and variant catalogue
- search/filtering
- cart
- checkout
- payment integration abstraction
- customer accounts
- order history/tracking
- admin dashboard
- supplier records and mappings
- fulfillment records
- n8n order-paid webhook
- controlled supplier-order workflow using a mock/sandbox connector first
- Resend transactional emails
- audit logs and exception handling
