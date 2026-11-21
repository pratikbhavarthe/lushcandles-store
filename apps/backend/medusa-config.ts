import { loadEnv, defineConfig, MedusaError } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const isProduction = process.env.NODE_ENV === "production"
const REDIS_URL = process.env.REDIS_URL

const KNOWN_WEAK_SECRETS = new Set(["", "supersecret", "secret"])

function requireSecret(name: "JWT_SECRET" | "COOKIE_SECRET"): string {
  const value = process.env[name] ?? ""
  if (isProduction && KNOWN_WEAK_SECRETS.has(value)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${name} is missing or set to a known default. Generate one with: openssl rand -hex 32`
    )
  }
  return value || "supersecret"
}

/**
 * Infrastructure modules backed by Redis. They are only registered when
 * REDIS_URL is set; otherwise Medusa keeps its in-memory defaults, which
 * are fine for a single local process but lose events, locks and
 * long-running workflow state on restart.
 */
const redisModules = REDIS_URL
  ? [
      {
        resolve: "@medusajs/medusa/event-bus-redis",
        options: {
          redisUrl: REDIS_URL,
          jobOptions: { attempts: 3, removeOnComplete: { age: 3600 } },
        },
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-redis",
        options: {
          redis: { redisUrl: REDIS_URL },
        },
      },
      {
        resolve: "@medusajs/medusa/locking",
        options: {
          providers: [
            {
              resolve: "@medusajs/medusa/locking-redis",
              id: "locking-redis",
              is_default: true,
              options: { redisUrl: REDIS_URL },
            },
          ],
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Backs admin/customer sessions with Redis instead of a fake in-memory store
    redisUrl: REDIS_URL,
    workerMode:
      (process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server") ||
      "shared",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: requireSecret("JWT_SECRET"),
      cookieSecret: requireSecret("COOKIE_SECRET"),
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: redisModules,
})
