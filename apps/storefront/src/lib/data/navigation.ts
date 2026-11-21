import "server-only"

import { getProductPrice } from "@lib/util/get-product-price"
import { listCategories } from "./categories"
import { listCollections } from "./collections"
import { listProducts } from "./products"
import { getRegion } from "./regions"

export type NavLink = { label: string; href: string }

export type NavProduct = {
  title: string
  href: string
  thumbnail: string | null
  price: string | null
}

export type ShopMenuData = {
  categories: NavLink[]
  collections: NavLink[]
  newArrivals: NavProduct[]
}

const settle = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
  try {
    return await promise
  } catch {
    return fallback
  }
}

/**
 * Everything the Shop mega-menu shows, read from Medusa. Each part fails soft
 * to an empty list so a backend hiccup never breaks the header.
 */
export async function getShopMenu(countryCode: string): Promise<ShopMenuData> {
  const [categories, collections, products] = await Promise.all([
    settle(
      listCategories({ fields: "id,name,handle,parent_category_id", limit: 50 }),
      []
    ),
    settle(
      listCollections({ fields: "id,title,handle", limit: "10" }).then(
        (r) => r.collections
      ),
      []
    ),
    settle(
      listProducts({
        countryCode,
        queryParams: { limit: 3, order: "-created_at" },
      }).then((r) => r.response.products),
      []
    ),
  ])

  return {
    categories: categories
      .filter((c) => !c.parent_category_id)
      .slice(0, 8)
      .map((c) => ({ label: c.name, href: `/categories/${c.handle}` })),
    collections: collections.map((c) => ({
      label: c.title,
      href: `/collections/${c.handle}`,
    })),
    newArrivals: products.map((p) => ({
      title: p.title,
      href: `/products/${p.handle}`,
      thumbnail: p.thumbnail ?? p.images?.[0]?.url ?? null,
      price: getProductPrice({ product: p }).cheapestPrice?.calculated_price ?? null,
    })),
  }
}

/**
 * Optional announcement shown above the header. Set it per region in Medusa
 * Admin (Settings > Regions > [region] > Metadata, key `announcement`).
 * Nothing is shown when the key is absent, so the site never displays an
 * offer the business has not configured.
 */
export async function getAnnouncement(countryCode: string): Promise<string | null> {
  const region = await settle(getRegion(countryCode), null)
  const value = region?.metadata?.announcement
  return typeof value === "string" && value.trim() ? value.trim() : null
}
