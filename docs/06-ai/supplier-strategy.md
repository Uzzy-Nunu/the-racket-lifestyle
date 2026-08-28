# Supplier & Sourcing Strategy

## Principle: platform-agnostic by design

No single sourcing platform is hard-wired into the application. The order and fulfillment system talks only to a **supplier adapter interface** (see `docs/05-api/api-and-integration-specs.md`); every actual platform — bulk-import marketplace, local wholesaler, or global dropship/fulfillment network — is a pluggable implementation of that interface, registered and configured through the admin dashboard, not through code changes.

This matters for three concrete reasons:
1. **The Nigeria-focus fulfillment model (local stock, small-batch bulk import) is the default path today, but the sourcing platform behind any given restock can change** — from Alibaba/1688 wholesale, to CJdropshipping's bulk-order flow, to a local Nigerian distributor — without touching the order engine.
2. **Different product categories may need different platforms.** Consumable accessories (grips, strings, shuttlecocks) may source well from bulk-import wholesale; the V2 racket/paddle category will likely need direct brand-authorized wholesale relationships instead. The registry supports both running side by side.
3. **The business can absorb a change in fulfillment strategy** (e.g. moving from pure local-stock to a hybrid with live regional dropship for a specific product line) without an architecture rewrite.

## Supplier registry pattern

```
SupplierRegistry
├── register(adapter: SupplierAdapter, config: SupplierConfig)
├── getActiveAdapters(): SupplierAdapter[]
├── getAdapter(supplierId): SupplierAdapter
└── resolveForVariant(productVariantId): SupplierAdapter[] (priority-ordered, per product_supplier_mappings)
```

- Each connected platform is a row in the `suppliers` table (already in the schema) plus a registered adapter instance keyed by `suppliers.integration_type`.
- `product_supplier_mappings` (already in the schema) continues to define, per variant, which supplier(s) can fulfill it and in what priority order — this is what lets two different SKUs use two different platforms simultaneously.
- Adapters declare a **capability flag set** on registration (see below) so the system knows what it can and can't ask a given platform to do, and degrades gracefully rather than assuming every platform supports every operation.

## Adapter capability flags

Not every sourcing platform supports every operation. Each adapter declares which of these it implements:

| Capability | Description | Typical for |
|---|---|---|
| `liveInventory` | Real-time stock check before order placement | Live dropship/API platforms |
| `liveOrderPlacement` | Can place an order programmatically | API-integrated platforms (e.g. CJdropshipping API) |
| `trackingSync` | Can return/sync shipment tracking | Most fulfillment platforms |
| `bulkOnly` | Sourcing is batch/wholesale only — no per-order placement | Alibaba/1688-style wholesale, most local distributors |
| `manualFulfillment` | No API; restock and fulfillment are recorded manually by an operator | Local Nigerian wholesalers without API access |

A platform used only for bulk restocking (the default V1 pattern) will typically declare `bulkOnly` + `manualFulfillment` — the adapter still exists and is tracked in the same `suppliers`/`supplier_orders` tables, but represents a restock batch rather than a live per-customer order. A future live dropship integration would declare `liveInventory` + `liveOrderPlacement` + `trackingSync` instead. The order engine checks capability flags before attempting an operation rather than assuming a fixed integration type.

## Candidate platforms (evaluated, not hard-wired)

### Local stock / bulk import (primary model for V1)
- **Alibaba / 1688 wholesale** — broad catalogue, bulk pricing, requires a freight-forwarding and customs step (see legal/import notes in the project context doc). `bulkOnly`.
- **CJdropshipping (bulk/wholesale order flow, not live per-order dropship)** — usable as a bulk-sourcing option for consumable accessories where its catalogue fits. `bulkOnly`.
- **Local Nigerian wholesalers/distributors** (to be identified) — fastest replenishment once relationships exist, ideally with no import step at all for at least some SKUs. `bulkOnly` + `manualFulfillment` until/unless a distributor offers an API.

### Live/API dropship (optional, per-SKU, not the default)
- **CJdropshipping API** — direct product/inventory/order/tracking endpoints exist; usable later for specific SKUs if live cross-border fulfillment ever makes sense for a category local stock doesn't cover well. `liveInventory`, `liveOrderPlacement`, `trackingSync`.
- **Syncee** — strong supplier discovery and automated tracking, but built around supported store platforms/its own marketplace flow; treat as a secondary option pending confirmation of direct integration fit.
- **Spocket** — curated suppliers with worldwide shipping capability; secondary channel unless direct API access for the exact order flow is confirmed.
- **DSers / AliExpress** — broad catalogue sourcing; secondary channel, not a core dependency.
- **Zendrop** — managed fulfillment where its supported integrations and product economics fit; kept behind the same adapter interface.

### V2: direct brand-authorized wholesale (rackets/paddles)
- Wilson, Yonex, Babolat, Head, and similar brand-authorized distributors (local-to-Nigeria relationships to be researched) for the high-touch racket/paddle category, once the brand has enough direct customer touchpoints to responsibly support fit-sensitive, higher-return items. `bulkOnly` + `manualFulfillment` in most cases, since these relationships are typically account-based rather than API-driven.

## Supplier selection logic (per restock or per order, where live sourcing applies)

1. Approved (active mapping in `product_supplier_mappings`)
2. Capability match (adapter supports the operation being attempted)
3. Destination supported (for any platform shipping direct rather than via local stock)
4. Exact variant match
5. Inventory available (live check where `liveInventory` is supported; local stock level otherwise)
6. Cost within margin policy
7. Shipping/lead time acceptable
8. Delivery estimate acceptable
9. Reliability score
10. Fallback rules, respecting capability flags

AI may recommend among approved, capability-matched options. Deterministic business rules validate and execute — AI is never authoritative for the final selection, per the project-wide AI guardrails in `AGENTS.md`.
