import { indexedCurrency, priceAttribute } from "@lib/util/search-price"
import { convertToLocale } from "@lib/util/money"

/** The per-currency price fields a hit may carry, e.g. `min_price_inr`. */
export type HitPricing = Record<string, unknown>

export type HitPrice = {
  /** What the card shows: one price, or "From …" for a price range. */
  label: string
  /** Pre-sale price, only for a single-price product that is on sale. */
  original: string | null
  /** Amount saved, formatted, under the same condition as `original`. */
  savings: string | null
}

const amount = (value: unknown) => (typeof value === "number" ? value : null)

/** Reads a hit's indexed price fields for the region's currency. */
export function getHitPrice(hit: HitPricing, currencyCode: string): HitPrice | null {
  const currency_code = indexedCurrency(currencyCode)
  const min = amount(hit[priceAttribute("min_price", currencyCode)])
  const max = amount(hit[priceAttribute("max_price", currencyCode)]) ?? min
  const original = amount(hit[priceAttribute("original_price", currencyCode)])
  const onSale = hit[priceAttribute("on_sale", currencyCode)] === true

  if (min === null || max === null) {
    return null
  }

  // Whole amounts drop the ".00" (₹1,299 rather than ₹1,299.00).
  const format = (value: number) =>
    convertToLocale({
      amount: value,
      currency_code,
      minimumFractionDigits: Number.isInteger(value) ? 0 : undefined,
      maximumFractionDigits: Number.isInteger(value) ? 0 : undefined,
    })
  const isRange = max > min
  const discounted = !isRange && onSale && original !== null && original > min

  return {
    label: isRange ? `From ${format(min)}` : format(min),
    original: discounted ? format(original) : null,
    savings: discounted ? format(original - min) : null,
  }
}
