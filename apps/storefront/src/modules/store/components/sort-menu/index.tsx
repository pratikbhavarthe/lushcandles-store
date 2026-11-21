"use client"

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { CheckMini, ChevronDownMini } from "@medusajs/icons"
import { useSortBy } from "react-instantsearch"

import { getSortOptions } from "@modules/store/components/store-refinements/attributes"

const SortMenu = ({ currencyCode }: { currencyCode: string }) => {
  const items = getSortOptions(currencyCode)
  const { currentRefinement, refine } = useSortBy({ items })
  const current = items.find((item) => item.value === currentRefinement)

  return (
    <Listbox value={currentRefinement} onChange={refine}>
      <div className="relative" data-testid="sort-by-container">
        <ListboxButton
          className="group flex h-10 items-center gap-x-2 rounded-full border border-lush-ink/30 px-4 text-sm text-lush-ink transition-colors hover:border-lush-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lush-ink data-[open]:border-lush-ink"
          aria-label={`Sort products, currently ${current?.label ?? "Relevance"}`}
        >
          Sort
          <ChevronDownMini className="transition-transform group-data-[open]:rotate-180" aria-hidden />
        </ListboxButton>
        <ListboxOptions
          anchor={{ to: "bottom end", gap: 8 }}
          transition
          className="z-50 w-56 rounded-2xl border border-lush-sand bg-white p-1.5 shadow-lg outline-none transition duration-150 ease-out data-[closed]:-translate-y-1 data-[closed]:opacity-0 motion-reduce:transition-none"
        >
          {items.map((item) => (
            <ListboxOption
              key={item.value}
              value={item.value}
              className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-lush-ink data-[focus]:bg-lush-cotton/50"
            >
              {item.label.replace("->", "→")}
              <CheckMini className="invisible text-lush-clay group-data-[selected]:visible" aria-hidden />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}

export default SortMenu
