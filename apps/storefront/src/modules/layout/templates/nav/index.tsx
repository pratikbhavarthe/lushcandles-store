import { Suspense } from "react"

import { getLocale } from "@lib/data/locale-actions"
import { listLocales } from "@lib/data/locales"
import { listRegions } from "@lib/data/regions"
import { STORE_NAME } from "@lib/util/site-constants"
import { ShoppingBag, User } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MobileMenu from "@modules/layout/components/mobile-menu"
import NavLinks from "@modules/layout/components/nav-links"
import NavShell from "@modules/layout/components/nav-shell"
import Search from "@modules/layout/components/search"
import { NAV_ICON_CLASS as NAV_ICON_BUTTON } from "@modules/layout/nav-styles"


export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
  ])

  return (
    <NavShell>
      <nav
        aria-label="Main"
        className="content-container grid h-20 grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300 group-data-[scrolled=true]:h-16 motion-reduce:transition-none"
      >
        <div className="flex items-center">
          <MobileMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          <NavLinks />
        </div>

        <LocalizedClientLink
          href="/"
          className="font-display text-[1.65rem] leading-none tracking-wide text-lush-ink transition-[font-size,color] duration-300 hover:text-lush-clay small:text-[2rem] small:group-data-[scrolled=true]:text-[1.65rem] motion-reduce:transition-none"
          data-testid="nav-store-link"
        >
          {STORE_NAME}
        </LocalizedClientLink>

        <div className="flex items-center justify-end gap-x-1">
          <Search />
          <LocalizedClientLink
            href="/account"
            aria-label="Account"
            className={`${NAV_ICON_BUTTON} hidden small:flex`}
            data-testid="nav-account-link"
          >
            <User />
          </LocalizedClientLink>
          <Suspense
            fallback={
              <LocalizedClientLink
                href="/cart"
                aria-label="Cart"
                className={NAV_ICON_BUTTON}
                data-testid="nav-cart-link"
              >
                <ShoppingBag />
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </nav>
    </NavShell>
  )
}
