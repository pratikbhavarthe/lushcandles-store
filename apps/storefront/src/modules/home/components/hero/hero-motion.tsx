"use client"

import { useRef, type ReactNode } from "react"

import { MOTION_OK, gsap, useGSAP } from "@lib/motion/gsap"

/**
 * Scroll-linked depth for the hero: as it scrolls away, the copy rises and
 * fades a little faster than the page and the candle drifts slower, so the
 * two separate. Scrubbed to the scroll position, so it reverses on the way
 * back up. Static with reduced motion.
 */
export default function HeroMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const scrollTrigger = {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
        gsap.to("[data-hero-text]", { y: -90, autoAlpha: 0.15, ease: "none", scrollTrigger })
        gsap.to("[data-hero-candle]", { y: 50, ease: "none", scrollTrigger })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return <div ref={root}>{children}</div>
}
