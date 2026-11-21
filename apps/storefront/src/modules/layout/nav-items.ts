export type NavItem = { label: string; href: string }

/** Primary destinations, shown large in the mobile menu. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Shop", href: "/store" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

/** Help menu (desktop dropdown) and the small links in the mobile menu. */
export const HELP_NAV: NavItem[] = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Contact us", href: "/contact" },
]

export const LEGAL_NAV: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
]

/** Small uppercase utility links on the right of the desktop bar. */
export const UTILITY_NAV: NavItem[] = [
  { label: "My account", href: "/account" },
  { label: "Contact", href: "/contact" },
]

/** True when `pathname` (with country prefix) is at or below `href`. */
export const isActivePath = (pathname: string, countryCode: string, href: string) => {
  const target = `/${countryCode}${href}`
  return pathname === target || pathname.startsWith(`${target}/`)
}
