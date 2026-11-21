export type NavItem = { label: string; href: string }

/** Primary destinations, shown inline on desktop and large in the mobile menu. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Shop", href: "/store" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

/** Customer-service links, shown small at the bottom of the mobile menu. */
export const SECONDARY_NAV: NavItem[] = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

/** True when `pathname` (with country prefix) is at or below `href`. */
export const isActivePath = (pathname: string, countryCode: string, href: string) => {
  const target = `/${countryCode}${href}`
  return pathname === target || pathname.startsWith(`${target}/`)
}
