"use client"

import type { ShopMenuData } from "@lib/data/navigation"
import type { Locale } from "@lib/data/locales"
import { STORE_NAME } from "@lib/util/site-constants"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import MobileMenu from "@modules/layout/components/mobile-menu"
import Search from "@modules/layout/components/search"
import { HELP_NAV, isActivePath, LEGAL_NAV } from "@modules/layout/nav-items"
import { NAV_TEXT_LINK } from "@modules/layout/nav-styles"
import FlameMark from "./flame-mark"
import { useParams, usePathname } from "next/navigation"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { PanelColumn, PanelLink } from "./panel-parts"
import ShopPanel from "./shop-panel"

type MenuId = "shop" | "help"

const OPEN_DELAY_MS = 90
const CLOSE_DELAY_MS = 180

type NavBarProps = {
  shopMenu: ShopMenuData
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  cart: ReactNode
}

export default function NavBar({ shopMenu, regions, locales, currentLocale, cart }: NavBarProps) {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Record<MenuId, HTMLButtonElement | null>>({ shop: null, help: null })
  const pathname = usePathname()
  const { countryCode } = useParams<{ countryCode: string }>()

  const schedule = useCallback((next: MenuId | null, delay: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpenMenu(next), delay)
  }, [])

  const close = useCallback(() => {
    window.clearTimeout(timer.current)
    setOpenMenu(null)
  }, [])

  // Escape closes and returns focus to the trigger; a click outside closes.
  useEffect(() => {
    if (!openMenu) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      triggerRefs.current[openMenu]?.focus()
      close()
    }
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [openMenu, close])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = (id: MenuId) => {
    window.clearTimeout(timer.current)
    setOpenMenu((current) => (current === id ? null : id))
  }

  const trigger = (id: MenuId, label: string) => {
    const open = openMenu === id
    return (
      <button
        ref={(el) => {
          triggerRefs.current[id] = el
        }}
        type="button"
        aria-expanded={open}
        aria-controls={`nav-panel-${id}`}
        onClick={() => toggle(id)}
        onPointerEnter={(e) => e.pointerType === "mouse" && schedule(id, openMenu ? 0 : OPEN_DELAY_MS)}
        className={clx(NAV_TEXT_LINK, "flex items-center gap-x-1.5", open && "text-lush-clay")}
        data-testid={`nav-${id}-trigger`}
      >
        <span
          aria-hidden
          className={clx(
            "inline-block w-2.5 text-center transition-transform duration-300 motion-reduce:transition-none",
            open && "rotate-45"
          )}
        >
          +
        </span>
        {label}
      </button>
    )
  }

  const solid = openMenu !== null

  return (
    <>
      {/* Dims the page while a menu is open; clicking it closes the menu. */}
      <div
        aria-hidden
        onClick={close}
        className={clx(
          "fixed inset-0 bg-lush-ink/25 transition-opacity duration-300 motion-reduce:transition-none",
          openMenu ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/*
        Transparent over the page at the top; a white surface fades in once the
        page scrolls (group-data-[scrolled]) or while a menu is open.
      */}
      <div
        ref={rootRef}
        onPointerLeave={(e) => e.pointerType === "mouse" && openMenu && schedule(null, CLOSE_DELAY_MS)}
        onPointerEnter={(e) => e.pointerType === "mouse" && openMenu && window.clearTimeout(timer.current)}
        className={clx(
          "absolute inset-x-0 top-0 border-b transition-[background-color,border-color] duration-300 motion-reduce:transition-none",
          solid
            ? "border-lush-sand/70 bg-white"
            : "border-transparent bg-transparent group-data-[scrolled=true]:border-lush-sand/70 group-data-[scrolled=true]:bg-white"
        )}
        data-testid="nav-surface"
      >
        <nav
          aria-label="Main"
          className="grid h-[72px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-6 px-4 small:px-8 medium:px-10"
        >
          <div className="flex items-center gap-x-6">
            <MobileMenu
              shopMenu={shopMenu}
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
            <div className="hidden items-center gap-x-6 small:flex medium:gap-x-7">
              {trigger("shop", "Shop")}
              {trigger("help", "Help")}
              {[
                { label: "About", href: "/about", className: "" },
                { label: "Contact", href: "/contact", className: "hidden medium:block" },
              ].map((item) => (
                <LocalizedClientLink
                  key={item.href}
                  href={item.href}
                  onPointerEnter={() => openMenu && schedule(null, CLOSE_DELAY_MS)}
                  aria-current={isActivePath(pathname, countryCode, item.href) ? "page" : undefined}
                  className={clx(NAV_TEXT_LINK, item.className)}
                >
                  {item.label}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          <LocalizedClientLink
            href="/"
            onClick={close}
            aria-label={`${STORE_NAME} home`}
            className="group/logo flex shrink-0 items-center gap-x-2.5 whitespace-nowrap text-lush-ink transition-colors hover:text-lush-clay"
            data-testid="nav-store-link"
          >
            <FlameMark className="h-8 w-8 small:h-9 small:w-9" />
            <span className="font-display text-[1.55rem] leading-none tracking-wide small:text-[1.85rem]">
              {STORE_NAME}
            </span>
          </LocalizedClientLink>

          <div className="flex items-center justify-end gap-x-5 medium:gap-x-6">
            <LocalizedClientLink
              href="/account"
              aria-current={isActivePath(pathname, countryCode, "/account") ? "page" : undefined}
              className={clx(NAV_TEXT_LINK, "hidden small:block")}
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            <div className="hidden medium:block">
              <Search className={NAV_TEXT_LINK}>Search</Search>
            </div>
            {cart}
            <LocalizedClientLink
              href="/store"
              onClick={close}
              className="hidden h-11 shrink-0 items-center gap-x-2 whitespace-nowrap bg-lush-ink px-5 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-lush-umber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lush-ink small:flex"
              data-testid="nav-cta"
            >
              Shop all
              <span aria-hidden>&rarr;</span>
            </LocalizedClientLink>
          </div>
        </nav>

        <Panel id="shop" open={openMenu === "shop"}>
          <ShopPanel data={shopMenu} onNavigate={close} />
        </Panel>

        <Panel id="help" open={openMenu === "help"}>
          <div className="grid grid-cols-12 gap-x-8 px-10 pb-10 pt-8">
            <PanelColumn title="Customer care" className="col-span-3">
              {HELP_NAV.map((item) => (
                <PanelLink key={item.href} href={item.href} onClick={close}>
                  {item.label}
                </PanelLink>
              ))}
            </PanelColumn>
            <PanelColumn title="The fine print" className="col-span-3">
              {LEGAL_NAV.map((item) => (
                <PanelLink key={item.href} href={item.href} onClick={close}>
                  {item.label}
                </PanelLink>
              ))}
            </PanelColumn>
            <div className="col-span-6 flex flex-col justify-between bg-lush-linen p-8">
              <p className="font-display text-3xl leading-tight text-lush-ink">
                Questions about an order or a scent?
              </p>
              <LocalizedClientLink
                href="/contact"
                onClick={close}
                className="mt-6 inline-flex h-11 w-fit items-center gap-x-2 bg-lush-ink px-5 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-lush-umber"
              >
                Get in touch <span aria-hidden>&rarr;</span>
              </LocalizedClientLink>
            </div>
          </div>
        </Panel>
      </div>
    </>
  )
}

/**
 * Collapsible region under the bar. Animates height via grid rows and is
 * `inert` while closed so hidden links are skipped by keyboard and screen
 * readers.
 */
function Panel({ id, open, children }: { id: MenuId; open: boolean; children: ReactNode }) {
  return (
    <div
      id={`nav-panel-${id}`}
      inert={!open}
      className={clx(
        "hidden small:grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="border-t border-lush-sand/70">{children}</div>
      </div>
    </div>
  )
}
