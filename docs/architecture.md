# Architecture

Lush Candles is a headless commerce monorepo: a Next.js storefront in front of
a Medusa v2 backend. Medusa is the single source of truth for catalogue,
pricing, inventory, carts, customers and orders. The storefront holds no
business logic of its own beyond presentation and input validation.

```mermaid
flowchart LR
  subgraph Client
    B[Customer browser]
    A[Merchant browser]
  end

  subgraph Storefront["apps/storefront (Next.js 16, :3000)"]
    RSC[Server components and server actions<br/>src/lib/data/*]
    MW[Proxy middleware<br/>country routing]
  end

  subgraph Backend["apps/backend (Medusa 2.23, Node 22, :9000)"]
    STORE[Store API /store/*]
    ADMIN[Admin API /admin/* + Admin UI /app]
    WF[Workflows and modules]
  end

  PG[(PostgreSQL 14<br/>:5432)]
  RD[(Redis 8<br/>:6379)]

  subgraph Planned["Planned (not implemented)"]
    RZP[Razorpay payments]
    S3[S3-compatible media storage]
    SHIP[Domestic shipping provider]
  end

  B --> MW --> RSC
  RSC -- "js-sdk + publishable key" --> STORE
  A --> ADMIN
  STORE --> WF
  ADMIN --> WF
  WF --> PG
  WF -- "event bus, workflow engine,<br/>locking, sessions" --> RD

  WF -. payment provider .-> RZP
  WF -. file provider .-> S3
  WF -. fulfillment provider .-> SHIP

  classDef planned stroke-dasharray: 5 5,fill:#f6f1e8;
  class RZP,S3,SHIP planned;
```

## Components

| Component | Status | Notes |
|---|---|---|
| Bun workspaces + Turborepo | Implemented | `bun.lock`; Turbo runs per-app tasks. |
| Next.js storefront | Implemented | Medusa DTC starter, rebranded; App Router, Tailwind, `@medusajs/ui`. |
| Medusa backend + Admin | Implemented | Runs on **Node.js**, not the Bun runtime. Bun is only the package manager and script runner. |
| PostgreSQL | Implemented | Homebrew `postgresql@14` locally. |
| Redis | Implemented | Event bus, workflow engine, locking and session store. |
| Redis caching module | Not enabled | Requires the `MEDUSA_FF_CACHING` feature flag in Medusa 2.23. Revisit when it is stable. |
| Razorpay | Planned | Needs credentials and a provider package. See the backlog in the README. |
| S3 media | Planned | `@medusajs/file-s3` is already installed and only needs configuration. |
| Shipping provider | Planned | Currently one manual shipping option with a placeholder rate. |

## Key decisions

- **Starter kept, not rewritten.** The Medusa DTC starter already covers
  listing, PDP, cart, checkout, account and order flows against supported
  Medusa APIs. Work focuses on branding, India defaults and hardening.
- **No shadcn/ui or Lucide yet.** The starter is built on `@medusajs/ui` and
  `@medusajs/icons`. Adding a second component system would duplicate
  primitives. Introduce shadcn/ui only for components `@medusajs/ui` lacks.
- **No `packages/*` yet.** Nothing is shared between the apps today, so the
  workspace only lists `apps/*`. Add `packages/<name>` when real shared code
  appears.
- **Commerce mutations go through core-flows workflows**, both in
  backend scripts (see `apps/backend/src/scripts/setup-india-market.ts`) and
  via the Store API from the storefront.
