"use client"

import { clx } from "@modules/common/components/ui"
import { useMenu } from "react-instantsearch"

import { CATEGORY_ATTRIBUTE } from "@modules/store/components/store-refinements/attributes"

/**
 * "Shop all" plus one tab per category that has products, read from the
 * category facet, so the row only ever lists categories a shopper can land on.
 * Selecting a tab refines the listing in place (single choice), and the choice
 * lives in the URL through InstantSearch routing.
 */
const CategoryTabs = () => {
  const { items, refine } = useMenu({
    attribute: CATEGORY_ATTRIBUTE,
    limit: 20,
    sortBy: ["count:desc", "name:asc"],
  })

  const active = items.find((item) => item.isRefined)

  const tab = (label: string, isActive: boolean, onClick: () => void, key: string) => (
    <li key={key} className="shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isActive}
        className={clx(
          "whitespace-nowrap pb-1 text-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lush-ink small:text-2xl",
          isActive
            ? "text-lush-ink underline decoration-1 underline-offset-[6px]"
            : "text-lush-umber hover:text-lush-ink"
        )}
        data-testid="category-tab"
      >
        {label}
      </button>
    </li>
  )

  return (
    <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] small:-mx-8 small:px-8 medium:-mx-10 medium:px-10 [&::-webkit-scrollbar]:hidden">
      <ul className="flex items-baseline gap-x-6">
        {tab("Shop all", !active, () => active && refine(active.value), "all")}
        {items.map((item) =>
          tab(item.label, item.isRefined, () => refine(item.value), item.value)
        )}
      </ul>
    </nav>
  )
}

export default CategoryTabs
