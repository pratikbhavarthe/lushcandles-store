/**
 * Demo data only: fills the store with clearly labelled sample candles so the
 * storefront can be previewed before the real catalogue exists. Nothing here
 * is a real product, price or offer.
 *
 *   bunx medusa exec ./src/scripts/seed-demo-candles.ts          # create
 *   bunx medusa exec ./src/scripts/seed-demo-candles.ts remove   # delete it all
 *
 * Creates four demo categories, 16 products (handles `demo-candle-*`) priced
 * in the store's currencies, a "Demo sale" price list discounting a few of
 * them, and simple SVG illustrations written to `static/demo/` and served by
 * the backend. Re-running skips anything that already exists.
 */
import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"

import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  PriceListStatus,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createPriceListsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deletePriceListsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

const HANDLE_PREFIX = "demo-candle"
const CATEGORY_PREFIX = "demo-"
const PRICE_LIST_TITLE = "Demo sale"
const IMAGE_DIR = path.join(process.cwd(), "static", "demo")
const IMAGE_BASE = `${process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"}/static/demo`

const CATEGORIES = [
  { name: "Floral", handle: `${CATEGORY_PREFIX}floral` },
  { name: "Woody", handle: `${CATEGORY_PREFIX}woody` },
  { name: "Fresh", handle: `${CATEGORY_PREFIX}fresh` },
  { name: "Gift sets", handle: `${CATEGORY_PREFIX}gift-sets` },
]

type DemoCandle = {
  title: string
  category: string
  /** Whole rupees; the same number is used for every store currency. */
  price: number
  /** Present for the few products that get Small and Large variants. */
  large?: number
  /** Sale price for the "Demo sale" price list. */
  sale?: number
}

const CANDLES: DemoCandle[] = [
  { title: "Rose & Oud", category: "Floral", price: 1299, sale: 999 },
  { title: "Jasmine Night", category: "Floral", price: 1199 },
  { title: "Peony Blush", category: "Floral", price: 899, large: 1499 },
  { title: "Lavender Field", category: "Floral", price: 999 },
  { title: "Cedar & Smoke", category: "Woody", price: 1399 },
  { title: "Sandalwood Hush", category: "Woody", price: 1499, sale: 1199 },
  { title: "Amber Ember", category: "Woody", price: 1099, large: 1799 },
  { title: "Vetiver Rain", category: "Woody", price: 1249 },
  { title: "Sea Salt Linen", category: "Fresh", price: 949 },
  { title: "Lemongrass Morning", category: "Fresh", price: 799, sale: 649 },
  { title: "Mint & Basil", category: "Fresh", price: 849 },
  { title: "Cucumber Cotton", category: "Fresh", price: 899, large: 1449 },
  { title: "Evening Trio", category: "Gift sets", price: 2499, sale: 1999 },
  { title: "Floral Duo", category: "Gift sets", price: 1899 },
  { title: "Woody Duo", category: "Gift sets", price: 1999 },
  { title: "Discovery Set", category: "Gift sets", price: 1599 },
]

/** Background, wax and label colours per illustration, from the 07 Pink palette. */
const SCENES = [
  { bg: "#FFE4EA", wax: "#FF8FA9", label: "#FFF7F9" },
  { bg: "#FFD1DC", wax: "#FF4F81", label: "#FFF7F9" },
  { bg: "#FFF0F3", wax: "#FF7F7F", label: "#3A3A3A" },
  { bg: "#FDE2E7", wax: "#B3123A", label: "#FFD1DC" },
  { bg: "#FFEAEE", wax: "#FF85A2", label: "#FFF7F9" },
  { bg: "#F9DDE3", wax: "#3A3A3A", label: "#FF8FA9" },
  { bg: "#FFE9EC", wax: "#FF2D55", label: "#FFF7F9" },
  { bg: "#FFF3F5", wax: "#FFD1DC", label: "#B3123A" },
]

const slug = (title: string) =>
  title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** A flat jar-candle illustration, 3:4 to match the listing tiles. */
function candleSvg(title: string, index: number) {
  const s = SCENES[index % SCENES.length]
  const set = title.includes("Trio") || title.includes("Duo") || title.includes("Set")
  const jar = (x: number, scale: number) => `
    <g transform="translate(${x} ${520 - 300 * scale}) scale(${scale})">
      <ellipse cx="0" cy="-118" rx="10" ry="22" fill="#FFB347"/>
      <ellipse cx="0" cy="-110" rx="5" ry="12" fill="#FFF3C4"/>
      <rect x="-2" y="-96" width="4" height="22" rx="2" fill="#3A3A3A"/>
      <rect x="-120" y="-80" width="240" height="300" rx="34" fill="${s.wax}"/>
      <rect x="-120" y="-80" width="240" height="40" rx="20" fill="#FFFFFF" opacity="0.25"/>
      <rect x="-86" y="30" width="172" height="110" rx="10" fill="${s.label}"/>
      <rect x="-60" y="62" width="120" height="8" rx="4" fill="${s.wax}" opacity="0.7"/>
      <rect x="-40" y="84" width="80" height="6" rx="3" fill="${s.wax}" opacity="0.45"/>
    </g>`
  const jars = set ? jar(200, 0.78) + jar(400, 0.78) : jar(300, 1)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-label="${escapeXml(title)} (demo illustration)">
  <rect width="600" height="800" fill="${s.bg}"/>
  <ellipse cx="300" cy="${set ? 760 : 772}" rx="${set ? 250 : 170}" ry="22" fill="#3A3A3A" opacity="0.08"/>
  <g transform="translate(0 ${set ? 300 : 320})">${jars}</g>
  <text x="300" y="120" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" letter-spacing="6" fill="#3A3A3A" opacity="0.55">DEMO</text>
</svg>
`
}

export default async function seedDemoCandles({ container, args }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const demoProducts = existingProducts.filter((p) => p.handle?.startsWith(`${HANDLE_PREFIX}-`))

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })
  const { data: existingPriceLists } = await query.graph({
    entity: "price_list",
    fields: ["id", "title"],
  })
  const demoPriceLists = existingPriceLists.filter((list) => list.title === PRICE_LIST_TITLE)

  if (args?.includes("remove")) {
    if (demoPriceLists.length) {
      await deletePriceListsWorkflow(container).run({ input: { ids: demoPriceLists.map((l) => l.id) } })
    }
    if (demoProducts.length) {
      await deleteProductsWorkflow(container).run({ input: { ids: demoProducts.map((p) => p.id) } })
    }
    const demoCategories = existingCategories.filter((c) => c.handle?.startsWith(CATEGORY_PREFIX))
    if (demoCategories.length) {
      await deleteProductCategoriesWorkflow(container).run({ input: demoCategories.map((c) => c.id) })
    }
    await rm(IMAGE_DIR, { recursive: true, force: true })
    logger.info(
      `Removed ${demoProducts.length} demo product(s), ${demoCategories.length} categories and ${demoPriceLists.length} price list(s).`
    )
    return
  }

  // ---- Prerequisites --------------------------------------------------------

  const { data: salesChannels } = await query.graph({ entity: "sales_channel", fields: ["id", "name"] })
  const { data: shippingProfiles } = await query.graph({ entity: "shipping_profile", fields: ["id"] })
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["supported_currencies.currency_code"],
  })

  const salesChannel = salesChannels[0]
  const shippingProfile = shippingProfiles[0]
  const currencies: string[] = (stores[0]?.supported_currencies ?? [])
    .map((c: { currency_code?: string | null } | null) => c?.currency_code)
    .filter((code: string | null | undefined): code is string => Boolean(code))

  if (!salesChannel || !shippingProfile || !currencies.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Needs a sales channel, a shipping profile and a store currency. Run setup-india-market.ts first."
    )
  }

  // ---- Images ---------------------------------------------------------------

  await mkdir(IMAGE_DIR, { recursive: true })
  await Promise.all(
    CANDLES.map((candle, index) =>
      writeFile(path.join(IMAGE_DIR, `${slug(candle.title)}.svg`), candleSvg(candle.title, index))
    )
  )

  // ---- Categories -----------------------------------------------------------

  const missingCategories = CATEGORIES.filter(
    (category) => !existingCategories.some((c) => c.handle === category.handle)
  )
  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((c) => ({
          ...c,
          is_active: true,
          metadata: { demo: true },
        })),
      },
    })
  }
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle"],
  })
  const categoryId = (name: string) =>
    categories.find((c) => c.name === name && c.handle?.startsWith(CATEGORY_PREFIX))?.id

  // ---- Products -------------------------------------------------------------

  const taken = new Set(existingProducts.map((p) => p.handle))
  const prices = (amount: number) => currencies.map((currency_code) => ({ amount, currency_code }))

  const products = CANDLES.map((candle) => {
    const handle = `${HANDLE_PREFIX}-${slug(candle.title)}`
    if (taken.has(handle)) return null
    const image = `${IMAGE_BASE}/${slug(candle.title)}.svg`
    const sizes = candle.large
      ? [
          { title: "Small", options: { Size: "Small" }, prices: prices(candle.price) },
          { title: "Large", options: { Size: "Large" }, prices: prices(candle.large) },
        ]
      : [{ title: "Standard", options: { Size: "Standard" }, prices: prices(candle.price) }]

    return {
      title: candle.title,
      handle,
      subtitle: `${candle.category} candle · demo product`,
      description: `${candle.title} is sample data for previewing the store. It is not a real product.`,
      status: ProductStatus.PUBLISHED,
      thumbnail: image,
      images: [{ url: image }],
      shipping_profile_id: shippingProfile.id,
      category_ids: [categoryId(candle.category)].filter((id): id is string => Boolean(id)),
      sales_channels: [{ id: salesChannel.id }],
      metadata: { demo: true },
      options: [{ title: "Size", values: sizes.map((s) => s.title) }],
      variants: sizes.map((size) => ({
        ...size,
        sku: `${handle}-${size.title}`.toUpperCase(),
        manage_inventory: false,
      })),
    }
  }).filter((product): product is NonNullable<typeof product> => product !== null)

  if (products.length) {
    await createProductsWorkflow(container).run({ input: { products } })
    logger.info(`Created ${products.length} demo candle(s)`)
  } else {
    logger.info("Every demo candle already exists.")
  }

  // ---- Sale price list --------------------------------------------------------

  if (!demoPriceLists.length) {
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: ["id", "product.handle"],
    })
    const salePrices = CANDLES.filter((c) => c.sale).flatMap((candle) => {
      const handle = `${HANDLE_PREFIX}-${slug(candle.title)}`
      const variant = variants.find((v) => v.product?.handle === handle)
      return variant
        ? currencies.map((currency_code) => ({ amount: candle.sale!, currency_code, variant_id: variant.id }))
        : []
    })

    await createPriceListsWorkflow(container).run({
      input: {
        price_lists_data: [
          {
            title: PRICE_LIST_TITLE,
            description: "Demo data: sample discounts for previewing sale badges.",
            status: PriceListStatus.ACTIVE,
            prices: salePrices,
          },
        ],
      },
    })
    logger.info(`Created the "${PRICE_LIST_TITLE}" price list`)
  }

  // ---- Search index ---------------------------------------------------------

  // Price lists emit no events and `medusa exec` can exit before async event
  // handlers run, so replay ingestion for the demo products explicitly.
  const { data: seeded } = await query.graph({ entity: "product", fields: ["id", "handle"] })
  const ids = seeded.filter((p) => p.handle?.startsWith(`${HANDLE_PREFIX}-`)).map((p) => ({ id: p.id }))
  const search = container.resolve(Modules.SEARCH)
  await search.ingest({ name: "product.updated", data: ids } as never)

  logger.info(`Search index updated for ${ids.length} demo product(s). Open /in/store to see them.`)
}
