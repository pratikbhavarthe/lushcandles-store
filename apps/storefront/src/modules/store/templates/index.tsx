"use client"

import type { SearchClient } from "instantsearch.js"
import { Configure, InstantSearch, useStats } from "react-instantsearch"

import { PRODUCT_INDEX_NAME, searchClient } from "@lib/search-client"
import CategoryTabs from "@modules/store/components/category-tabs"
import FilterDrawer from "@modules/store/components/filter-drawer"
import SortMenu from "@modules/store/components/sort-menu"
import StoreHits from "@modules/store/components/store-hits"

const PRODUCT_LIMIT = 24

const ResultCount = () => {
  const { nbHits } = useStats()
  return (
    <p className="text-sm text-lush-umber" aria-live="polite">
      {nbHits} {nbHits === 1 ? "candle" : "candles"}
    </p>
  )
}

/**
 * Shop all: a category tab row, a Filter drawer and Sort menu, then a
 * full-width product grid. Everything refines one InstantSearch state, which
 * `routing` mirrors to the URL so filtered views can be shared and restored.
 */
const StoreTemplate = ({ currencyCode }: { currencyCode: string }) => {
  return (
    <div className="w-full px-4 pb-20 pt-8 small:px-8 medium:px-10" data-testid="category-container">
      <h1 className="sr-only" data-testid="store-page-title">
        Shop all candles
      </h1>
      <InstantSearch
        indexName={PRODUCT_INDEX_NAME}
        searchClient={searchClient as unknown as SearchClient}
        routing
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure hitsPerPage={PRODUCT_LIMIT} />
        <CategoryTabs />
        <div className="mb-6 mt-6 flex items-center justify-between gap-x-4">
          <ResultCount />
          <div className="flex items-center gap-x-2">
            <FilterDrawer currencyCode={currencyCode} />
            <SortMenu currencyCode={currencyCode} />
          </div>
        </div>
        <StoreHits hitsPerPage={PRODUCT_LIMIT} currencyCode={currencyCode} />
      </InstantSearch>
    </div>
  )
}

export default StoreTemplate
