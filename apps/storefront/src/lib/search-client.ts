import {
  createInstantSearchAdapter,
  type MedusaSdkLike,
} from "@medusajs/instantsearch-adapter"

import { sdk } from "@lib/config"
import { SEARCH_PRICE_CURRENCIES } from "@lib/util/search-price"

export const PRODUCT_INDEX_NAME = "product"

export {
  SEARCH_PRICE_CURRENCIES,
  indexedCurrency,
  priceAttribute,
  type PriceField,
} from "@lib/util/search-price"

/**
 * Shared by the navbar search drawer and the store listing. An empty query
 * searches rather than short-circuiting, which is what the listing needs to
 * show every product before anything is refined.
 */
export const { searchClient } = createInstantSearchAdapter({
  sdk: sdk as unknown as MedusaSdkLike,
  path: "/store/search",
  additionalSearchParameters: {
    search_options: {
      match_strategy: "last",
    },
  },
  // Range widgets read `facets_stats`, which the adapter only produces for
  // fields listed here. The price fields are declared with a `stats` facet on
  // the index, which is what makes the stats available at all.
  numericAttributes: SEARCH_PRICE_CURRENCIES.flatMap((currency) => [
    `min_price_${currency}`,
    `max_price_${currency}`,
  ]),
})
