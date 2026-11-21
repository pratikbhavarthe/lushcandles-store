"use client"

import type { ShopMenuData } from "@lib/data/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { PanelColumn, PanelLink } from "./panel-parts"

// Soft tints behind product cards, cycled in order.
const CARD_TINTS = ["bg-lush-linen", "bg-[#EFE3D3]", "bg-[#E8E6DA]"]

export default function ShopPanel({
  data,
  onNavigate,
}: {
  data: ShopMenuData
  onNavigate: () => void
}) {
  const { categories, collections, newArrivals } = data

  return (
    <div className="grid grid-cols-12 gap-x-8 px-10 pb-10 pt-8" data-testid="nav-shop-panel">
      <div className="col-span-5 flex flex-col justify-between gap-y-10">
        <div className="grid grid-cols-2 gap-x-8">
          <PanelColumn title="Shop by type">
            {categories.length ? (
              categories.map((c) => (
                <PanelLink key={c.href} href={c.href} onClick={onNavigate}>
                  {c.label}
                </PanelLink>
              ))
            ) : (
              <PanelLink href="/store" onClick={onNavigate}>
                All candles
              </PanelLink>
            )}
          </PanelColumn>

          {collections.length > 0 && (
            <PanelColumn title="Collections">
              {collections.map((c) => (
                <PanelLink key={c.href} href={c.href} onClick={onNavigate}>
                  {c.label}
                </PanelLink>
              ))}
            </PanelColumn>
          )}
        </div>

        <LocalizedClientLink
          href="/store"
          onClick={onNavigate}
          className="inline-flex h-11 w-fit items-center gap-x-2 bg-lush-ink px-5 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-lush-umber focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lush-ink"
          data-testid="nav-shop-all"
        >
          Shop all candles <span aria-hidden>&rarr;</span>
        </LocalizedClientLink>
      </div>

      <div className="col-span-7">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-lush-umber">
          New arrivals
        </p>
        {newArrivals.length ? (
          <ul className="grid grid-cols-3 gap-x-4">
            {newArrivals.map((p, i) => (
              <li key={p.href}>
                <LocalizedClientLink href={p.href} onClick={onNavigate} className="group block">
                  <div
                    className={`relative aspect-[4/5] overflow-hidden border border-lush-sand/60 ${CARD_TINTS[i % CARD_TINTS.length]}`}
                  >
                    {p.thumbnail && (
                      <Image
                        src={p.thumbnail}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 18vw, 0px"
                        className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    )}
                  </div>
                  <p className="mt-3 font-display text-xl leading-snug text-lush-ink group-hover:text-lush-clay">
                    {p.title}
                  </p>
                  {p.price && <p className="mt-0.5 text-sm text-lush-umber">{p.price}</p>}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex aspect-[3/1] flex-col items-center justify-center border border-dashed border-lush-sand bg-lush-linen/60 text-center">
            <p className="font-display text-2xl text-lush-ink">New candles are on their way</p>
            <p className="mt-1 text-sm text-lush-umber">Check back soon, or browse everything available now.</p>
          </div>
        )}
      </div>
    </div>
  )
}
