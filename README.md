# Lush Candles

E-commerce platform for Lush Candles: a Next.js storefront on a Medusa v2
commerce backend, in a Bun workspace monorepo.

```text
apps/
  backend/      Medusa 2.23 API + Admin (Node 22), :9000, admin at /app
  storefront/   Next.js 16 App Router storefront, :3000
docs/           Architecture, setup, env vars, data flow, deployment
infra/docker/   Optional Postgres + Redis compose file
.github/        CI: typecheck, lint, test, backend build
```

## Quick start

See [docs/local-development.md](docs/local-development.md) for the full setup.

```bash
bun install
```

```bash
bun run dev
```

Storefront: http://localhost:3000 · Admin: http://localhost:9000/app

## Scripts

| | |
|---|---|
| `bun run dev` / `dev:backend` / `dev:storefront` | Development servers |
| `bun run build` | Production builds |
| `bun run typecheck` | TypeScript in both apps |
| `bun run lint` | Medusa lint + ESLint |
| `bun run test` | Jest (backend) + Vitest (storefront) |

## Documentation

- [Architecture](docs/architecture.md)
- [Local development](docs/local-development.md)
- [Environment variables](docs/environment-variables.md)
- [Commerce data flow](docs/commerce-data-flow.md)
- [Deployment](docs/deployment.md)

## Status

Implemented: Bun workspaces, Redis-backed Medusa infrastructure modules,
India region (INR), branded storefront, Indian PIN/phone validation, CI.

Before launch, business inputs are still needed: products and photography,
GST rates, shipping rates and warehouse address, policy text, the About page
copy, and Razorpay credentials. Pages that still contain placeholder text show
a visible notice.
