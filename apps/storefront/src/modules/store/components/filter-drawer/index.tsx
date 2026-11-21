"use client"

import { Adjustments, XMark } from "@medusajs/icons"
import { useEffect, useRef, useState } from "react"
import { useClearRefinements, useCurrentRefinements, useStats } from "react-instantsearch"

import { CATEGORY_ATTRIBUTE, LABELS_ATTRIBUTE } from "@modules/store/components/store-refinements/attributes"
import CurrentRefinements from "@modules/store/components/store-refinements/current-refinements"
import OnSaleToggle from "@modules/store/components/store-refinements/on-sale-toggle"
import OptionRefinements from "@modules/store/components/store-refinements/option-refinements"
import PriceRange from "@modules/store/components/store-refinements/price-range"
import RefinementGroup from "@modules/store/components/store-refinements/refinement-group"

// Categories are refined by the tab row, not from the drawer.
const EXCLUDED = [CATEGORY_ATTRIBUTE]

/**
 * The refinements live in a side drawer opened from the toolbar. The panel
 * stays mounted while closed (hidden with `inert`) rather than unmounting like
 * a Headless UI Dialog would: InstantSearch only applies a filter restored from
 * the URL when its widget is mounted, so unmounting would drop `?price=…`
 * links until the drawer was opened.
 */
const FilterDrawer = ({ currencyCode }: { currencyCode: string }) => {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  const { items } = useCurrentRefinements({ excludedAttributes: EXCLUDED })
  const { refine: clearAll, canRefine: canClear } = useClearRefinements({
    excludedAttributes: EXCLUDED,
  })
  const { nbHits } = useStats()
  const activeCount = items.reduce((sum, item) => sum + item.refinements.length, 0)

  const close = () => {
    setOpen(false)
    trigger.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    closeButton.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setOpen(false)
      trigger.current?.focus()
    }
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
    }
  }, [open])

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="store-filters"
        className="flex h-10 items-center gap-x-2 rounded-full border border-lush-ink/30 px-4 text-sm text-lush-ink transition-colors hover:border-lush-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lush-ink"
        data-testid="filter-button"
      >
        Filter
        {activeCount > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lush-clay px-1.5 text-[11px] text-white">
            {activeCount}
          </span>
        ) : (
          <Adjustments aria-hidden />
        )}
      </button>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close filters"
          onClick={close}
          className="absolute inset-0 h-full w-full cursor-default bg-lush-ink/25 backdrop-blur-[2px]"
        />
      </div>

      <aside
        id="store-filters"
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-filters-title"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-sm flex-col bg-lush-ivory transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "translate-x-0 shadow-2xl" : "translate-x-full"}`}
        data-testid="filter-drawer"
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-lush-sand px-6">
          <h2 id="store-filters-title" className="text-lg text-lush-ink">
            Filter
          </h2>
          <button
            ref={closeButton}
            type="button"
            onClick={close}
            aria-label="Close filters"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-lush-ink hover:bg-lush-cotton/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lush-ink"
          >
            <XMark />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-10 overflow-y-auto px-6 py-8">
          {nbHits === 0 && activeCount === 0 && (
            <p className="text-sm text-lush-umber">Filters appear here once there are candles to filter.</p>
          )}
          <CurrentRefinements currencyCode={currencyCode} />
          <OptionRefinements />
          <PriceRange currencyCode={currencyCode} />
          <OnSaleToggle currencyCode={currencyCode} />
          <RefinementGroup attribute={LABELS_ATTRIBUTE} title="Labels" />
        </div>

        <div className="flex shrink-0 items-center gap-x-3 border-t border-lush-sand px-6 py-4">
          <button
            type="button"
            onClick={clearAll}
            disabled={!canClear}
            className="h-11 flex-1 rounded-full border border-lush-ink/30 text-sm text-lush-ink transition-colors hover:border-lush-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={close}
            className="h-11 flex-[1.4] rounded-full bg-lush-clay text-sm text-white transition-colors hover:bg-lush-ink"
          >
            Show {nbHits} {nbHits === 1 ? "result" : "results"}
          </button>
        </div>
      </aside>
    </>
  )
}

export default FilterDrawer
