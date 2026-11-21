"use client"

import type { RefObject } from "react"

import { MOTION_OK, REVEAL_FROM, REVEAL_TO, ScrollTrigger, gsap, useGSAP } from "./gsap"

/**
 * Reveals a grid's direct children in batches as they scroll into view, so a
 * row enters together with a short stagger instead of card by card. Runs
 * again whenever `key` changes (new results after filtering, sorting or
 * paging), reverting the previous run first.
 */
export function useBatchReveal(container: RefObject<HTMLElement | null>, key: string) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const items = container.current ? Array.from(container.current.children) : []
        if (!items.length) return
        gsap.set(items, REVEAL_FROM)
        ScrollTrigger.batch(items, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { ...REVEAL_TO, stagger: 0.07, overwrite: true }),
        })
      })
      return () => mm.revert()
    },
    { dependencies: [key], revertOnUpdate: true }
  )
}
