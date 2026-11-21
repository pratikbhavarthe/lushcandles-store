import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

// Mirrors the tsconfig path aliases so tests can import modules that use them.
export default defineConfig({
  resolve: {
    alias: {
      "@lib": src("lib"),
      "@modules": src("modules"),
      "@/": src(""),
    },
  },
})
