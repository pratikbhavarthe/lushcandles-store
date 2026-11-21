# Environment variables

Templates live next to each app: `apps/backend/.env.template` and
`apps/storefront/.env.template`. Real values go in `.env` / `.env.local`,
which git ignores. Never commit them.

## Backend (`apps/backend/.env`)

| Variable | Required | Example (local) | Notes |
|---|---|---|---|
| `DATABASE_URL` | yes | `postgres://postgres@localhost:5432/medusa-lushcandles-store` | |
| `REDIS_URL` | recommended | `redis://localhost:6379` | Enables the Redis event bus, workflow engine, locking and sessions. Without it Medusa uses in-memory fallbacks. |
| `STORE_CORS` | yes | `http://localhost:3000` | Storefront origin(s), comma-separated. |
| `ADMIN_CORS` | yes | `http://localhost:5173,http://localhost:9000` | Admin UI origin(s). |
| `AUTH_CORS` | yes | `http://localhost:5173,http://localhost:9000,http://localhost:3000` | Union of admin and storefront origins. |
| `JWT_SECRET` | yes | `openssl rand -hex 32` | Startup fails in production if missing or `supersecret`. |
| `COOKIE_SECRET` | yes | `openssl rand -hex 32` | Same production check. |
| `AUTH_MFA_ENCRYPTION_KEY` | optional | `openssl rand -hex 32` | Encrypts admin MFA secrets. |
| `MEDUSA_WORKER_MODE` | optional | `shared` | `server` / `worker` when the API and background workers are split in production. |
| `MEDUSA_BACKEND_URL` | production | `https://api.example.com` | Public backend URL used by the admin build. |
| `DISABLE_MEDUSA_ADMIN` | optional | `false` | `true` on worker-only instances. |

## Storefront (`apps/storefront/.env.local`)

Everything prefixed `NEXT_PUBLIC_` is compiled into the browser bundle. Only
public values belong there.

| Variable | Required | Example (local) | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | yes | `pk_...` | Public by design. It scopes requests to a sales channel. |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | yes | `http://localhost:9000` | |
| `NEXT_PUBLIC_DEFAULT_REGION` | yes | `in` | Fallback country code for routing. |
| `NEXT_PUBLIC_BASE_URL` | production | `http://localhost:3000` | Canonical URLs, sitemap, robots. |
| `NEXT_PUBLIC_STRIPE_KEY` / `NEXT_PUBLIC_ADYEN_*` / `NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY` | no | empty | Starter payment UIs. Unused for the Indian market. |
| `MEDUSA_CLOUD_S3_HOSTNAME` / `MEDUSA_CLOUD_S3_PATHNAME` | no | empty | Allows remote product images from S3. |

## Planned (not yet used)

| Variable | For |
|---|---|
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` | Razorpay payment provider. The secret and webhook secret are backend-only. `NEXT_PUBLIC_RAZORPAY_KEY_ID` is the only public one. |
| `S3_FILE_URL`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_BUCKET`, `S3_ENDPOINT` | `@medusajs/file-s3` media storage |
