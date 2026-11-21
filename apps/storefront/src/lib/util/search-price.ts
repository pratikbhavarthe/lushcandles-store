// Kept free of the SDK import in search-client.ts so it can be unit tested.

/**
 * The currencies the product index holds prices in, one field set each. Keep
 * in sync with `PRICE_CURRENCIES` in the backend's `src/search/helpers/pricing.ts`.
 */
export const SEARCH_PRICE_CURRENCIES = ["inr", "eur", "usd"]

export type PriceField =
  | "min_price"
  | "max_price"
  | "original_price"
  | "on_sale"

/**
 * The indexed currency to read prices in for a region. A region whose currency
 * the index doesn't hold falls back to the first one, so the listing still
 * shows a price rather than none.
 */
export const indexedCurrency = (currencyCode: string) => {
  const code = currencyCode.toLowerCase()
  return SEARCH_PRICE_CURRENCIES.includes(code)
    ? code
    : SEARCH_PRICE_CURRENCIES[0]
}

export const priceAttribute = (field: PriceField, currencyCode: string) =>
  `${field}_${indexedCurrency(currencyCode)}`
