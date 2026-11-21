# Commerce data flow

## Request path

1. The browser hits the storefront. `src/middleware.ts` picks the country
   segment (`/in/...`) from the regions Medusa returns, falling back to
   `NEXT_PUBLIC_DEFAULT_REGION`.
2. Server components and server actions in `src/lib/data/*` call Medusa's
   Store API through `@medusajs/js-sdk` with the publishable key. Customer
   auth tokens and the cart id live in httpOnly cookies (`src/lib/data/cookies.ts`).
3. Medusa resolves the publishable key to a sales channel, so only products
   in that channel are returned. It then runs the request through core-flows
   workflows.

## Current store configuration

Set up by `apps/backend/src/scripts/setup-india-market.ts`, which is idempotent:

| Entity | Value |
|---|---|
| Store currency | INR (default, only) |
| Region | India, INR, country `in`, automatic taxes |
| Tax region | `in`, system provider, **no GST rate set** |
| Stock location | "India Warehouse (placeholder address)", linked to Default Sales Channel |
| Shipping | One manual option, "Standard Shipping (rate to be confirmed)", ₹0 |
| Payment | `pp_system_default` only (manual / no capture) |
| Products, collections, categories | none (Medusa demo data removed) |
| Region metadata | Starter policy keys plus `policies_are_placeholders: true`, so the storefront hides shipping/returns details and JSON-LD return policy |

A database dump taken before the demo data was removed is in
`~/Studio/lushcandles-backups/`.

## Cart to order

```
Add to cart     POST /store/carts, POST /store/carts/:id/line-items
Address         POST /store/carts/:id  (storefront validates IN PIN + phone first)
Shipping        GET  /store/shipping-options?cart_id=...
                POST /store/carts/:id/shipping-methods
Payment         POST /store/payment-collections, .../payment-sessions
Complete        POST /store/carts/:id/complete  -> order
```

Cart completion is idempotent on the Medusa side: completing an already
completed cart returns the existing order, and core-flows take a lock on the
cart id (now Redis-backed) to prevent duplicate orders from concurrent
requests.

## India-specific rules

- **PIN code**: 6 digits, first digit 1-9. Validated server-side in the
  `setAddresses` action (`src/lib/util/indian-address.ts`). This checks the
  format only, not serviceability.
- **Phone**: optional; if present it must be a 10-digit Indian mobile
  number, with an optional `+91`, `91` or `0` prefix.
- **GST**: not configured. Set rates per product type in Admin > Settings >
  Tax Regions > India once HSN codes and rates are confirmed. Prices should be
  decided as tax-inclusive or exclusive before products are created
  (region/price preference setting).

## Razorpay (planned)

Implement as a Medusa payment module provider in `apps/backend/src/modules/razorpay`:

- `initiatePayment` creates a Razorpay order server-side. The storefront only
  receives the order id and the public key id.
- `authorizePayment` verifies the `razorpay_signature` HMAC with the key
  secret before marking the session authorized.
- The webhook route verifies `X-Razorpay-Signature` against
  `RAZORPAY_WEBHOOK_SECRET` over the raw body and handles events idempotently
  by payment id.
- No test-mode shortcuts or simulated success in production code.
