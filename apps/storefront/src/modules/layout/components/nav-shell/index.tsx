"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Sticky header frame. A sentinel just above the header tells us when the
 * page has scrolled; the header then condenses (shorter, translucent, with a
 * hairline border). Exposed as `data-scrolled` so children can style off the
 * `group` without re-rendering.
 */
export default function NavShell({ children }: { children: React.ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting)
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="absolute inset-x-0 top-0 h-6" />
      <div className="sticky inset-x-0 top-0 z-50">
        <header
          data-scrolled={scrolled}
          className="group border-b border-transparent bg-lush-ivory transition-[background-color,border-color,box-shadow] duration-300 data-[scrolled=true]:border-lush-sand data-[scrolled=true]:bg-lush-ivory/85 data-[scrolled=true]:shadow-[0_8px_24px_-18px_rgba(42,36,32,0.35)] data-[scrolled=true]:backdrop-blur-md motion-reduce:transition-none"
        >
          {children}
        </header>
      </div>
    </>
  )
}
