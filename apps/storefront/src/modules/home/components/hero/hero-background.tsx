"use client"

import { ShaderBackground } from "@/components/ui/poba-shade"
import { useSyncExternalStore } from "react"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * Animated WebGL waves behind the hero: mostly white, with a pink wave rising
 * from the bottom that bends around the pointer. Visitors who ask for reduced
 * motion get the static white-to-pink gradient underneath instead, which also
 * shows while the canvas starts up and on devices without WebGL.
 */
export default function HeroBackground() {
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true // server render: no canvas until the client decides
  )

  return (
    <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white to-lush-candy">
      {!reducedMotion && <ShaderBackground className="absolute inset-0" />}
    </div>
  )
}
