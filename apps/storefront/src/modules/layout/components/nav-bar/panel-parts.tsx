"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ReactNode } from "react"

export function PanelColumn({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-lush-umber">{title}</p>
      <ul className="flex flex-col gap-y-2.5">{children}</ul>
    </div>
  )
}

export function PanelLink({
  href,
  onClick,
  children,
}: {
  href: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <li>
      <LocalizedClientLink
        href={href}
        onClick={onClick}
        className="text-[17px] text-lush-ink transition-colors hover:text-lush-clay"
      >
        {children}
      </LocalizedClientLink>
    </li>
  )
}
