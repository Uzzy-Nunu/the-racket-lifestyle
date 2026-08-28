# API & Integration Specs

## Stack

- Next.js frontend + admin
- Node.js backend
- Supabase/PostgreSQL
- n8n automation
- Resend
- Vercel

## Core API groups

GET /api/products
GET /api/products/:slug
GET /api/categories
GET /api/search

POST /api/cart
PATCH /api/cart/:itemId
DELETE /api/cart/:itemId

POST /api/checkout/session
POST /api/payments/initialize
POST /api/payments/webhook
GET /api/payments/:reference

POST /api/orders
GET /api/orders/:orderNumber
GET /api/account/orders

POST /api/integrations/n8n/order-paid
GET /api/admin/orders
PATCH /api/admin/orders/:id
GET /api/admin/agent-runs
POST /api/admin/fulfillment/:orderId/retry

## Payment abstraction

```ts
interface PaymentProvider {{
  initializePayment(input: InitializePaymentInput): Promise<PaymentInitialization>;
  verifyPayment(reference: string): Promise<PaymentVerification>;
  refundPayment(input: RefundInput): Promise<RefundResult>;
}}
```

Paystack (sole V1 provider):
- initialize on server
- verify on server
- process webhooks
- validate amount/currency/reference
- idempotency

The `PaymentProvider` interface stays provider-agnostic at the type level so a second provider could be added later, but only Paystack needs an implementation for V1 — there is no cross-border/multi-currency requirement now that the business is Nigeria-only.

## n8n

Webhook:
POST /api/integrations/n8n/order-paid

Payload:
```json
{{
  "event": "order.paid",
  "order_id": "uuid",
  "order_number": "RKL-100001",
  "occurred_at": "ISO-8601"
}}
```

n8n must fetch authoritative order data from the backend.

## Supplier adapter & registry

The system is built to connect any number of sourcing platforms — bulk-import wholesalers, local distributors, or live dropship APIs — without changing the order or fulfillment engine. Every platform implements the same interface and declares which capabilities it actually supports; unsupported operations are never called. See `docs/06-ai/supplier-strategy.md` for the full rationale and candidate-platform list.

```ts
type SupplierCapability =
  | "liveInventory"
  | "liveOrderPlacement"
  | "trackingSync"
  | "bulkOnly"
  | "manualFulfillment";

interface SupplierAdapter {{
  id: string;                          // matches suppliers.integration_type
  capabilities: SupplierCapability[];

  // Only called if the adapter declares the matching capability
  getProduct?(externalProductId: string): Promise<SupplierProduct>;
  getInventory?(externalVariantId: string): Promise<InventoryResult>;
  getShippingQuote?(input: ShippingQuoteInput): Promise<ShippingQuote>;
  createOrder?(input: SupplierOrderInput): Promise<SupplierOrderResult>;
  getOrder?(externalOrderId: string): Promise<SupplierOrderStatus>;
  getTracking?(externalOrderId: string): Promise<TrackingResult>;

  // Used for bulkOnly/manualFulfillment adapters: records a restock batch
  // rather than a live per-order call
  recordRestockBatch?(input: RestockBatchInput): Promise<RestockBatchResult>;
}}

interface SupplierRegistry {{
  register(adapter: SupplierAdapter, config: SupplierConfig): void;
  getActiveAdapters(): SupplierAdapter[];
  getAdapter(supplierId: string): SupplierAdapter;
  resolveForVariant(productVariantId: string): SupplierAdapter[]; // priority-ordered per product_supplier_mappings
}}
```

Adding, disabling, or re-prioritizing a sourcing platform is an admin/config change (a `suppliers` row + adapter registration), never a change to checkout, order, or fulfillment code.

## Email

Resend handles transactional templates and message delivery status.
