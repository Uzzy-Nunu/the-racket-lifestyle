# User Journey & Flowcharts

## 1. Discovery

Landing → Shop/Collection → Search/Filter → Product → Variant → Add to Bag → Cart

## 2. Checkout

Cart → Checkout → Customer details → Shipping details → Payment → Server verification → Paid order → Confirmation

## 3. Fulfillment

Paid order → Fulfillment task → n8n webhook → Load order → Load supplier mapping → Validate → Supplier availability → Place supplier order → Save supplier reference → Update status → Email customer

## 4. Exception

Agent failure → Admin exception queue → Review → Retry / change mapping / contact customer / refund / cancel → Resume or close

## 5. Mermaid

```mermaid
flowchart TD
A[Homepage] --> B[Shop / Collection]
B --> C[Product Page]
C --> D[Select Variant]
D --> E[Add to Bag]
E --> F[Cart]
F --> G[Checkout]
G --> H[Payment Gateway]
H -->|Success| I[Server-side Verification]
H -->|Failure| J[Retry Payment]
I --> K[Create PAID Order]
K --> L[Trigger Fulfillment]
L --> M[n8n Workflow]
M --> N[Supplier Order]
N --> O[Tracking]
O --> P[Delivered]
```

```mermaid
flowchart TD
A[Paid Order] --> B[Load Mapping]
B --> C{Exact Mapping?}
C -->|No| D[Exception]
C -->|Yes| E[Check Supplier]
E --> F{Available?}
F -->|No| G[Fallback Supplier Rules]
F -->|Yes| H[Create Supplier Order]
G --> I{Approved Fallback?}
I -->|No| D
I -->|Yes| H
H --> J[Save Supplier Order ID]
J --> K[Notify Customer]
```
