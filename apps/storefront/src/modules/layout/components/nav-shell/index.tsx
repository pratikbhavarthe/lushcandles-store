"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Sticky frame that holds the floating nav card. A sentinel above it reports
 * when the page has scrolled, exposed as `data-scrolled` on a `group` so the
 * card can deepen its shadow without re-rendering children.
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
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <header
        data-scrolled={scrolled}
        className="group sticky inset-x-0 top-0 z-50 h-[72px]"
      >
        {children}
      </header>
    </>
  )
}
