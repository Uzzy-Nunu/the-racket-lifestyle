# Product Requirements Document (PRD)

## 1. Product

**The Racket Lifestyle** is a premium Nigerian racket-sports e-commerce platform for customers who see tennis, badminton and padel as part of their lifestyle, not only an activity.

The product experience should combine:
- performance
- style
- discovery
- convenience
- useful, precise product information
- a strong sense of Nigerian racket-sport culture — real clubs, real leagues, real courts

## 2. Vision

Become Nigeria's definitive digital destination for tennis, badminton and padel gear and lifestyle essentials.

## 3. Target customer

Primary:
- tennis, badminton and padel players/enthusiasts in Nigeria, concentrated in Lagos and Abuja
- club members (e.g. established tennis and social/sports clubs) and state-association badminton players
- tournament/weekend competitors
- early-adopter padel players at hotel/hospitality-led courts
- people buying gifts for racket-sport enthusiasts
- style-conscious customers who want sports products to fit naturally into everyday life

Squash and pickleball are out of scope for V1 — squash is a weaker fit for the brand's fashion-forward direction, and pickleball has no established organized presence in Nigeria at this time. The information architecture should not preclude adding either sport later if the market changes.

The brand uses a more colorful, fashion-forward, premium visual language so the experience feels inclusive and especially appealing to women without becoming gender-segregated.

## 4. Positioning

**Premium gear and lifestyle essentials for tennis, badminton and padel players who take the game — and the life around it — seriously.**

## 5. Customer jobs

Customers should be able to:
1. Discover products by sport and lifestyle need.
2. Understand what a product does without generic hype.
3. Compare options and variants.
4. Buy securely.
5. See realistic delivery expectations.
6. Track an order.
7. Get help when something goes wrong.

## 6. Product structure

Primary navigation:
- Shop
- Tennis
- Badminton
- Padel
- Accessories
- Lifestyle
- Journal

Future:
- Gift Guide
- Club/Team
- Personalization
- Editorial collections
- Squash and/or Pickleball, if and when Nigerian court infrastructure and organized play justify it — the category/sport_code data model already supports adding a sport without a schema change (see `docs/02-database/schema-and-data-dictionary.md`)

## 7. Storefront features

### Homepage
- Announcement bar
- Header/navigation
- Hero
- Shop by sport
- Featured collection
- Lifestyle/editorial section
- Best sellers
- New arrivals
- Gift/occasion module
- Trust section
- Newsletter
- Footer

### Discovery
- Search
- Sport filters
- Category filters
- Price filter
- Availability
- Sorting
- Featured/curated collections

### Product page
- Image gallery
- Product title
- Rating/review framework
- Price
- Compare-at price
- Discount badge
- Variant selector
- Quantity
- Delivery estimate (Nigeria-specific, by state/region)
- Description
- Specifications, using a defined per-sport attribute schema (not free text):
  - Tennis rackets/strings: head size, weight, balance point, string pattern, grip size, swingweight
  - Badminton racquets/shuttlecocks: weight, balance, string tension, flex, shuttle speed/grade
  - Padel paddles: weight, balance, core material, face material, shape
- What's included
- Shipping information
- Returns information
- Related products
- Recently viewed
- Add to bag
- Buy now

### Cart
- Product/variant summary
- Quantity control
- Remove
- Discount
- Shipping estimate
- Total
- Checkout

### Checkout
- Email
- Phone
- Country
- State/region
- City
- Address
- Postal code
- Delivery notes
- Order summary
- Payment
- Terms acceptance
- Confirmation

### Account
- Sign up/login
- Profile
- Saved addresses
- Orders
- Order detail
- Tracking
- Email preferences

## 8. Admin dashboard

### Dashboard
- Orders today
- Gross sales
- Paid orders
- Fulfillment pending
- Supplier orders
- Shipped
- Delivered
- Exceptions
- Refunds
- Estimated gross margin

### Products
- Product CRUD
- Variants
- Images
- Sport/category
- Pricing
- Supplier mapping
- SEO metadata
- Publication status

### Suppliers
- Supplier profiles
- Integration type
- supplier products
- mappings
- destination support
- supplier cost
- preferred/fallback supplier
- connection status

### Orders
- Search
- Filters
- Customer
- Items
- Payment
- Fulfillment
- Supplier
- Tracking
- Timeline
- Notes
- Retry
- Manual intervention

### Agent
- Active runs
- Completed runs
- Failed runs
- Queue
- Exception queue
- Logs
- Retry

## 9. Core order lifecycle

PENDING_PAYMENT
→ PAID
→ FULFILLMENT_PENDING
→ SUPPLIER_ORDER_PENDING
→ SUPPLIER_ORDER_CONFIRMED
→ SHIPPED
→ IN_TRANSIT
→ DELIVERED

Exception states:
PAYMENT_FAILED
FULFILLMENT_FAILED
SUPPLIER_UNAVAILABLE
ADDRESS_EXCEPTION
ORDER_CANCELLED
REFUND_PENDING
REFUNDED
RETURN_REQUESTED
RETURNED

## 10. Fulfillment requirements

- Fulfillment can begin only after server-side payment verification.
- Fulfillment is primarily served from local stock (small-batch bulk-imported and warehoused in Nigeria); the supplier-adapter system exists so a live-sourcing platform can still be plugged in per-SKU where useful, but local stock is the default path.
- Every sellable variant must have an approved sourcing-platform mapping (whichever adapter supplied it — see below).
- Availability is checked against local stock levels before order confirmation.
- Domestic courier selection (e.g. GIG Logistics for nationwide, Kwik for same-day Lagos/Abuja) is rule-based on destination and package profile.
- Supplier/sourcing-order reference must be persisted for every restock batch.
- Tracking must be persisted and synchronized where the courier supports it.
- Failed actions become explicit exceptions.
- AI can recommend a fallback sourcing platform or courier but cannot silently substitute a materially different product.
- Configurable high-value approvals are supported.

## 11. Payment requirements

- Payment provider abstraction (interface-level only — Paystack is the sole implemented provider for V1).
- Paystack integration: initialize, verify, webhook processing.
- Server-side verification.
- Webhook signature verification.
- Idempotent event handling.
- Amount/currency/reference validation.
- No raw card storage.

## 12. Sourcing/supplier requirements

- The system must support connecting multiple sourcing platforms/suppliers concurrently through a common adapter interface, with no platform hard-coded as required.
- Each adapter declares its own capabilities (e.g. live inventory check, order placement, tracking sync) so the system can degrade gracefully when a connected platform doesn't support a given capability.
- Adding, disabling, or removing a sourcing platform is a configuration/admin change, not a code change to the order or fulfillment engine.
- See `docs/06-ai/supplier-strategy.md` and `docs/05-api/api-and-integration-specs.md` for the full adapter/registry design.

## 13. Email

Resend for:
- order confirmation
- payment confirmation
- supplier fulfillment confirmation
- shipping update
- delivery confirmation
- return/refund update
- password reset
- admin exception alert

## 14. Non-functional requirements

- Responsive and mobile-first
- Accessible
- SEO-friendly
- Secure secret management
- Role-based authorization
- Idempotent webhooks
- Structured logs
- Testable services
- Fast public pages
- Production deployment only after local verification
