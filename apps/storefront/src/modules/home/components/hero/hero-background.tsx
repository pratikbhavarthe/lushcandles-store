"use client"

import { ShaderBackground } from "@/components/ui/adisyon-shader"
import { useSyncExternalStore } from "react"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * Animated WebGL waves behind the hero. Visitors who ask for reduced motion
 * get the static gradient underneath instead, which also shows while the
 * canvas starts up and on devices without WebGL.
 */
export default function HeroBackground() {
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => true // server render: no canvas until the client decides
  )

  return (
    <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-[#EAF9FF] via-[#5AD2F4] to-[#031C26]">
      {!reducedMotion && <ShaderBackground className="absolute inset-0" />}
      {/*
        Legibility scrim for the white hero text. Even on mobile (text spans
        the width), fading from the left on desktop so the waves stay vivid
        on the right. Masked off the top 72px so the navbar's dark text keeps
        the light band behind it.
      */}
      <div className="absolute inset-0 bg-[#031C26]/60 [mask-image:linear-gradient(to_bottom,transparent_72px,black_128px)] small:bg-transparent small:bg-gradient-to-r small:from-[#031C26]/85 small:via-[#031C26]/55 small:to-transparent" />
    </div>
  )
}
