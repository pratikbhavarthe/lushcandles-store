"use client"

import { useRef, type ReactNode } from "react"

import { MOTION_OK, REVEAL_FROM, REVEAL_TO, gsap, useGSAP } from "./gsap"

type RevealProps = {
  children: ReactNode
  className?: string
  /**
   * CSS selector for the children to reveal one after another. Without it the
   * wrapper itself is revealed as one block.
   */
  stagger?: string
  /** Seconds between staggered children. */
  gap?: number
}

/**
 * Fades and lifts content in the first time it scrolls into view. Server
 * components can be passed as children. With reduced motion, or before the
 * script loads, the content is simply shown: nothing is hidden by CSS.
 */
export default function Reveal({ children, className, stagger, gap = 0.08 }: RevealProps) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const el = root.current
        if (!el) return
        const targets = stagger ? el.querySelectorAll(stagger) : el
        gsap.fromTo(targets, REVEAL_FROM, {
          ...REVEAL_TO,
          stagger: stagger ? gap : 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
