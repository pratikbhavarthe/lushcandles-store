"use client"

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { Locale } from "@lib/data/locales"
import useToggleState from "@lib/hooks/use-toggle-state"
import { STORE_NAME } from "@lib/util/site-constants"
import { BarsThree, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "@modules/layout/components/country-select"
import LanguageSelect from "@modules/layout/components/language-select"
import type { ShopMenuData } from "@lib/data/navigation"
import { HELP_NAV, isActivePath, LEGAL_NAV, PRIMARY_NAV } from "@modules/layout/nav-items"
import { useParams, usePathname } from "next/navigation"
import { useState } from "react"

type MobileMenuProps = {
  shopMenu: ShopMenuData
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

export default function MobileMenu({ shopMenu, regions, locales, currentLocale }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const pathname = usePathname()
  const { countryCode } = useParams<{ countryCode: string }>()
  const countryToggle = useToggleState()
  const languageToggle = useToggleState()

  const showCountry = (regions?.length ?? 0) > 1
  const showLanguage = (locales?.length ?? 0) > 0

  return (
    <div className="small:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-lush-ink transition-colors hover:bg-lush-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-lush-ink"
        data-testid="nav-menu-button"
      >
        <BarsThree />
      </button>

      <Dialog open={open} onClose={close} className="relative z-[60] small:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-lush-ink/25 backdrop-blur-[2px] transition-opacity duration-300 ease-out data-[closed]:opacity-0 motion-reduce:transition-none"
        />
        <DialogPanel
          transition
          className="group fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-lush-ivory px-6 pb-8 pt-4 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[closed]:-translate-x-full motion-reduce:transition-none"
          data-testid="nav-menu-popup"
        >
          <div className="flex h-12 items-center justify-between">
            <DialogTitle className="font-display text-2xl text-lush-ink">{STORE_NAME}</DialogTitle>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-lush-ink hover:bg-lush-linen focus-visible:outline focus-visible:outline-2 focus-visible:outline-lush-ink"
              data-testid="close-menu-button"
            >
              <XMark />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-y-1">
              {[{ label: "Home", href: "/" }, ...PRIMARY_NAV].map((item, i) => {
                const active =
                  item.href === "/"
                    ? pathname === `/${countryCode}`
                    : isActivePath(pathname, countryCode, item.href)
                return (
                  <li
                    key={item.href}
                    style={{ transitionDelay: `${120 + i * 60}ms` }}
                    className="transition duration-500 ease-out group-data-[closed]:translate-y-3 group-data-[closed]:opacity-0 motion-reduce:transition-none"
                  >
                    <LocalizedClientLink
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="flex items-baseline justify-between border-b border-lush-sand/70 py-4 font-display text-4xl text-lush-ink transition-colors hover:text-lush-clay aria-[current=page]:text-lush-clay"
                      data-testid={`${item.label.toLowerCase()}-link`}
                    >
                      {item.label}
                      <span aria-hidden className="font-sans text-xs tracking-[0.2em] text-lush-taupe">
                        0{i + 1}
                      </span>
                    </LocalizedClientLink>
                  </li>
                )
              })}
            </ul>

            {[
              { title: "Shop by type", links: shopMenu.categories },
              { title: "Collections", links: shopMenu.collections },
            ]
              .filter((group) => group.links.length > 0)
              .map((group) => (
                <div key={group.title} className="mt-8">
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-lush-umber">
                    {group.title}
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <LocalizedClientLink
                          href={link.href}
                          onClick={close}
                          className="text-[15px] text-lush-ink hover:text-lush-clay"
                        >
                          {link.label}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            <ul className="mt-8 flex gap-x-6 text-sm text-lush-umber">
              <li>
                <LocalizedClientLink href="/account" onClick={close} className="hover:text-lush-ink" data-testid="account-link">
                  Account
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/cart" onClick={close} className="hover:text-lush-ink" data-testid="cart-link">
                  Cart
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/search" onClick={close} className="hover:text-lush-ink">
                  Search
                </LocalizedClientLink>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-y-4 border-t border-lush-sand pt-6 text-xs text-lush-umber">
            {showLanguage && (
              <LanguageSelect toggleState={languageToggle} locales={locales!} currentLocale={currentLocale} />
            )}
            {showCountry && <CountrySelect toggleState={countryToggle} regions={regions!} />}
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {[...HELP_NAV.filter((i) => i.href !== "/contact"), ...LEGAL_NAV].map((item) => (
                <li key={item.href}>
                  <LocalizedClientLink href={item.href} onClick={close} className="hover:text-lush-ink">
                    {item.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
            <p className="text-lush-taupe">
              © {new Date().getFullYear()} {STORE_NAME}
            </p>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  )
}
