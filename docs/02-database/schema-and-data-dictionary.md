# Database Schema & Data Dictionary

## 1. Database approach

Supabase/PostgreSQL is the system of record.

Money:
- store integer minor units
- always store ISO currency code

Timestamps:
- UTC

External IDs:
- store separately from internal UUIDs

## 2. Tables

### users
id, email, first_name, last_name, phone, role, created_at, updated_at

Roles:
customer, admin, operations

### customer_addresses
id, user_id, label, recipient_name, phone, country_code, region, city, address_line1, address_line2, postal_code, delivery_notes, is_default, created_at, updated_at

### categories
id, name, slug, sport_code, parent_id, description, image_url, is_active, created_at, updated_at

### products
id, slug, name, short_description, description, sport_code, category_id, brand_name, status, featured, seo_title, seo_description, created_at, updated_at

### product_images
id, product_id, url, alt_text, sort_order, is_primary

### product_variants
id, product_id, sku, variant_name, size, color, other_attributes JSONB, selling_price_minor, compare_at_price_minor, currency, status, created_at, updated_at

`other_attributes` is JSONB for flexibility, but its keys follow a **fixed schema per sport_code** so faceted search/filtering works — not free-form:
- Tennis: `head_size_sq_in`, `weight_g`, `balance_point_mm`, `string_pattern`, `grip_size`, `swingweight`
- Badminton: `weight_g`, `balance`, `string_tension_lbs`, `flex`, `shuttle_speed_grade` (shuttlecocks)
- Padel: `weight_g`, `balance`, `core_material`, `face_material`, `shape`

### supplier_restock_batches
id, supplier_id, batch_reference, sourcing_platform, cif_cost_minor, duty_minor, surcharge_minor, ciss_minor, etls_minor, vat_minor, landed_cost_minor, currency, status, received_at, created_at, updated_at

Used for the local-stock/bulk-import fulfillment model: one row per restock batch, capturing the full Nigerian import cost stack (see `docs/06-ai/supplier-strategy.md`) so landed cost — not FOB/supplier cost — is what pricing and margin reporting are based on.

### suppliers
id, name, platform_type, base_url, integration_type, status, priority, created_at, updated_at

### supplier_products
id, supplier_id, external_product_id, external_variant_id, title, source_url, supplier_cost_minor, supplier_currency, shipping_cost_minor, availability_status, destination_countries, raw_payload JSONB, last_synced_at

### product_supplier_mappings
id, product_variant_id, supplier_product_id, priority, is_preferred, active, max_allowed_cost_minor, last_verified_at

### orders
id, order_number, user_id, customer_email, customer_phone, currency, subtotal_minor, shipping_minor, discount_minor, total_minor, payment_status, fulfillment_status, shipping_address_snapshot JSONB, billing_address_snapshot JSONB, notes, created_at, paid_at, updated_at

### order_items
id, order_id, product_id, product_variant_id, product_name_snapshot, variant_snapshot JSONB, quantity, unit_price_minor, line_total_minor

### payments
id, order_id, provider, provider_transaction_id, provider_reference, amount_minor, currency, status, paid_at, raw_response JSONB, created_at, updated_at

### supplier_orders
id, order_id, supplier_id, supplier_order_reference, status, supplier_total_minor, supplier_currency, shipping_method, tracking_number, tracking_url, placed_at, confirmed_at, raw_response JSONB, created_at, updated_at

### shipments
id, order_id, supplier_order_id, carrier, tracking_number, tracking_url, status, shipped_at, delivered_at, last_synced_at

### agent_tasks
id, order_id, task_type, status, priority, input JSONB, output JSONB, error JSONB, attempts, created_at, started_at, completed_at

### agent_logs
id, agent_task_id, order_id, event_type, level, message, metadata JSONB, created_at

### notifications
id, user_id, order_id, channel, template_key, recipient, status, provider_message_id, sent_at, error, created_at

### returns
id, order_id, status, reason, customer_notes, resolution, created_at, updated_at

### refunds
id, order_id, payment_id, amount_minor, currency, provider_refund_id, status, reason, created_at, completed_at

## 3. Security model

Public:
- published catalogue fields only

Customer:
- own data and orders

Admin/operations:
- operational data according to role

Server/service role only:
- supplier secrets
- payment secrets
- sensitive integration data
- fulfillment operations

## 4. Integrity

- Server recalculates totals.
- Paid events are idempotent.
- Supplier order creation is idempotent.
- Historical order item information is snapshot-based.
- Address snapshot is immutable after order creation unless an admin explicitly corrects an operational error and records an audit note.
