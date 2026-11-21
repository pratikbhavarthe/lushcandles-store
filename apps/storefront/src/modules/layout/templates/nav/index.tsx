import { Suspense } from "react"

import { getLocale } from "@lib/data/locale-actions"
import { listLocales } from "@lib/data/locales"
import { getAnnouncement, getShopMenu } from "@lib/data/navigation"
import { listRegions } from "@lib/data/regions"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import CartButton from "@modules/layout/components/cart-button"
import NavBar from "@modules/layout/components/nav-bar"
import NavShell from "@modules/layout/components/nav-shell"
import { NAV_TEXT_LINK } from "@modules/layout/nav-styles"

export default async function Nav({ countryCode }: { countryCode: string }) {
  const [regions, locales, currentLocale, shopMenu, announcement] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
    getShopMenu(countryCode),
    getAnnouncement(countryCode),
  ])

  return (
    <>
      <AnnouncementBar text={announcement} />
      <NavShell>
        <NavBar
          shopMenu={shopMenu}
          regions={regions}
          locales={locales}
          currentLocale={currentLocale}
          cart={
            <Suspense
              fallback={
                <LocalizedClientLink href="/cart" className={NAV_TEXT_LINK} data-testid="nav-cart-link">
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          }
        />
      </NavShell>
    </>
  )
}
