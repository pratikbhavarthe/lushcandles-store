"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { isActivePath, PRIMARY_NAV } from "@modules/layout/nav-items"
import { useParams, usePathname } from "next/navigation"

/** Desktop primary links with a drawn-in underline on hover and for the current page. */
export default function NavLinks() {
  const pathname = usePathname()
  const { countryCode } = useParams<{ countryCode: string }>()

  return (
    <ul className="hidden items-center gap-x-8 small:flex">
      {PRIMARY_NAV.map((item) => {
        const active = isActivePath(pathname, countryCode, item.href)
        return (
          <li key={item.href}>
            <LocalizedClientLink
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative py-2 text-[13px] uppercase tracking-[0.18em] text-lush-umber transition-colors hover:text-lush-ink aria-[current=page]:text-lush-ink after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 focus-visible:outline-none focus-visible:after:scale-x-100"
            >
              {item.label}
            </LocalizedClientLink>
          </li>
        )
      })}
    </ul>
  )
}
