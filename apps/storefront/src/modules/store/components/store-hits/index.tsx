"use client"

import type { Hit } from "instantsearch.js"
import { useEffect, useRef } from "react"
import { useCurrentRefinements, useHits, useInstantSearch } from "react-instantsearch"

import useSearchSettled from "@lib/hooks/use-search-settled"
import repeat from "@lib/util/repeat"
import { Text } from "@modules/common/components/ui"
import SearchPagination from "./pagination"
import ProductCard, { type ProductHitFields } from "./product-card"

type ProductHit = Hit<ProductHitFields>

// Edge-to-edge grid with narrow gutters; the skeleton shares it so the layout
// doesn't jump when results arrive.
const GRID =
  "grid w-full grid-cols-2 gap-x-2 gap-y-10 small:gap-x-3 medium:grid-cols-3 large:grid-cols-4"

const SkeletonGrid = ({ count }: { count: number }) => (
  <ul className={GRID} data-testid="products-list-loader" aria-hidden>
    {repeat(count).map((index) => (
      <li key={index} className="animate-pulse">
        <div className="aspect-[3/4] w-full bg-lush-cotton/35" />
        <div className="mt-3 h-4 w-3/5 bg-lush-cotton/50" />
        <div className="mt-2 h-4 w-2/5 bg-lush-cotton/40" />
        <div className="mt-3 h-11 w-full rounded-full bg-lush-cotton/50" />
      </li>
    ))}
  </ul>
)

type StoreHitsProps = {
  hitsPerPage: number
  currencyCode: string
}

const StoreHits = ({ hitsPerPage, currencyCode }: StoreHitsProps) => {
  const { items } = useHits<ProductHit>()
  // Registers an error listener so a failed search is reported through
  // `status`/`error` below rather than raised by InstantSearch.
  const { status, error, indexUiState } = useInstantSearch({ catchError: true })
  const { isSearching, hasNoResultsYet } = useSearchSettled()
  const { items: activeRefinements } = useCurrentRefinements()
  const isUnfiltered = !activeRefinements.length && !indexUiState.query

  const { page, ...refinements } = indexUiState
  const currentPage = page ?? 1
  const refinementKey = JSON.stringify(refinements)

  const settled = useRef({ page: currentPage, refinementKey })

  useEffect(() => {
    if (!isSearching) {
      settled.current = { page: currentPage, refinementKey }
    }
  }, [isSearching, currentPage, refinementKey])

  const isPagingOnly =
    refinementKey === settled.current.refinementKey &&
    currentPage !== settled.current.page

  const showSkeleton = hasNoResultsYet || (isSearching && isPagingOnly)

  // SearchPagination stays mounted in every state, the error included.
  // Unmounting a widget makes InstantSearch search again, so returning early
  // on error caused a loop: error, unmount, search, loading, remount, search,
  // error, at dozens of requests a second.
  return (
    <>
      {status === "error" ? (
        <Text
          className="py-24 text-center text-ui-fg-error"
          data-testid="products-error"
        >
          Couldn&apos;t load products
          {error?.message ? `: ${error.message}` : "."}
        </Text>
      ) : showSkeleton ? (
        <SkeletonGrid count={hitsPerPage} />
      ) : !items.length ? (
        <Text
          className="py-24 text-center text-lush-umber"
          data-testid="no-products"
        >
          {isUnfiltered
            ? "No candles are available yet."
            : "No candles matched these filters."}
        </Text>
      ) : (
        <ul className={GRID} data-testid="products-list">
          {items.map((hit, index) =>
            hit.handle ? (
              <li key={hit.objectID}>
                <ProductCard
                  hit={hit}
                  currencyCode={currencyCode}
                  priority={index < 4}
                />
              </li>
            ) : null
          )}
        </ul>
      )}
      <SearchPagination />
    </>
  )
}

export default StoreHits
