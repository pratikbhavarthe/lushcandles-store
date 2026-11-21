# Local development

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 22.22 or newer (Medusa runs on Node) | `node -v` |
| Bun | 1.3.14 (package manager / script runner) | `bun -v` |
| PostgreSQL | 14+ | `brew services list` |
| Redis | 7+ | `redis-cli ping` |

Start the services with Homebrew:

```bash
brew services start postgresql@14
```

```bash
brew services start redis
```

Or with Docker instead:

```bash
docker compose -f infra/docker/compose.yml up -d
```

## First-time setup

```bash
bun install
```

```bash
cp apps/backend/.env.template apps/backend/.env
```

```bash
cp apps/storefront/.env.template apps/storefront/.env.local
```

Fill in `JWT_SECRET` and `COOKIE_SECRET` (`openssl rand -hex 32`), then:

```bash
cd apps/backend && bunx medusa db:migrate
```

```bash
cd apps/backend && bunx medusa exec ./src/scripts/setup-india-market.ts
```

Create an admin user (choose your own password):

```bash
cd apps/backend && bunx medusa user -e you@example.com -p '<password>'
```

Copy the publishable key from Admin > Settings > Publishable API Keys into
`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in `apps/storefront/.env.local`.

## Daily commands (repo root)

| Command | What it does |
|---|---|
| `bun run dev` | Backend on :9000 and storefront on :3000 |
| `bun run dev:backend` | Backend only. Admin at http://localhost:9000/app |
| `bun run dev:storefront` | Storefront only, http://localhost:3000. Needs the backend running |
| `bun run build` | Production builds of both apps |
| `bun run typecheck` | `tsc --noEmit` in both apps |
| `bun run lint` | `medusa lint` (backend) and ESLint (storefront) |
| `bun run test` | Backend Jest unit tests and storefront Vitest |

Backend integration suites need a live Postgres:

```bash
cd apps/backend && bun run test:integration:http
```

## Ports

| Service | Port |
|---|---|
| Storefront | 3000 |
| Medusa API + Admin | 9000 (`/app`) |
| PostgreSQL | 5432 |
| Redis | 6379 |

Port 8000 (the starter's old storefront port) is no longer used.

## Expected startup output

The backend should log the Redis connections for `event-bus-redis`,
`workflow-engine-redis` and `locking-redis`, then
`Server is ready on port: 9000`. These messages are normal and safe to ignore:

- `No link/workflow/subscriber/job to load from ... skipped.` These are
  informational lines for plugins that ship no such files.
- `DeprecationWarning: Calling client.query() when the client is already
  executing a query` comes from `pg` inside Medusa and needs no action.
- Storefront ESLint reports about 28 `react-hooks/*` **warnings** in starter
  components. These are React Compiler advisories, not errors.

If you see `redisUrl not found. A fake redis instance will be used`, then
`REDIS_URL` is missing from `apps/backend/.env`.

## Changing the search index

The product search index is defined in `apps/backend/src/search/`. Changing
its fields (for example adding a price currency) is a schema change, and
reloading the dev server does not apply it. Until it is applied, the store page
fails with `Field "…" is not facetable on the postgres search provider`. Apply
it, then restart the backend so the new index is filled:

```bash
cd apps/backend && bunx medusa db:migrate:search
```

`medusa db:migrate` runs the same step, so deployments pick it up
automatically.
