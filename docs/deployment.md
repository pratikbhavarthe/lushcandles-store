# Deployment

Nothing is deployed yet. This is the target shape. Production infrastructure
changes need explicit approval.

## Topology

| Piece | Recommendation |
|---|---|
| Storefront | Any Next.js host (Vercel, a Node container). Set the `NEXT_PUBLIC_*` vars at build time. |
| Medusa API | Node 22 container, `MEDUSA_WORKER_MODE=server`, admin enabled. |
| Medusa worker | Same image, `MEDUSA_WORKER_MODE=worker`, `DISABLE_MEDUSA_ADMIN=true`. Processes events, scheduled jobs and workflow retries. |
| PostgreSQL | Managed Postgres 15+ with automated backups. |
| Redis | Managed Redis with persistence. One instance can back all modules; split per module if load requires it. |
| Media | S3-compatible bucket via `@medusajs/file-s3`. |

Running a separate worker requires the Redis modules. They are already
configured whenever `REDIS_URL` is set.

## Build and release

```bash
bun install --frozen-lockfile
```

```bash
bun run build --filter=@dtc/backend
```

The backend build output is `apps/backend/.medusa/server`. Install production
deps there and run `medusa start` with Node. Run migrations as a release step
before switching traffic:

```bash
cd apps/backend/.medusa/server && npx medusa db:migrate
```

The storefront build prerenders pages against the live backend, so build it
after the backend is reachable with a valid publishable key.

## Production checklist

- [ ] Strong `JWT_SECRET`, `COOKIE_SECRET` (the backend refuses known defaults when `NODE_ENV=production`)
- [ ] CORS lists only real origins (no localhost, no docs.medusajs.com)
- [ ] HTTPS everywhere. Cookies are `secure` in production.
- [ ] Admin user with a strong password and MFA (`AUTH_MFA_ENCRYPTION_KEY`)
- [ ] Razorpay live keys stored as secrets on the backend only. Webhook signature verification tested.
- [ ] GST rates, shipping rates, warehouse address and policy text confirmed. Remove `policies_are_placeholders` from the India region metadata.
- [ ] Rate limiting at the edge or proxy for `/store/auth/*`, `/store/customers`, `/store/carts/*/complete`
- [ ] Error tracking (e.g. Sentry) with PII scrubbing. No payment payloads in logs.
- [ ] `next.config.js` `images.unoptimized` reviewed once images come from S3/CDN
- [ ] Database backups and a restore drill
