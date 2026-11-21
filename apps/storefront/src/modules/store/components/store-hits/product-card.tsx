"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import { getHitPrice, type HitPricing } from "./price"

export type ProductHitFields = {
  title: string | null
  subtitle?: string | null
  handle: string | null
  thumbnail: string | null
  /** Only set for single-variant products; see the backend product index. */
  variant_id?: string | null
} & HitPricing

type ProductCardProps = {
  hit: ProductHitFields
  currencyCode: string
  /** Load the image eagerly for the first row, which is above the fold. */
  priority?: boolean
}

const BAR =
  "flex h-11 w-full items-center justify-between gap-x-2 whitespace-nowrap rounded-full px-3.5 text-[13px] transition-colors small:gap-x-3 small:px-5 small:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lush-ink"

type Status = "idle" | "added" | "error"

/**
 * A listing tile: image, badge, title and subtitle, then a full-width bar that
 * adds a single-variant product straight to the bag with its price on the
 * right. Products with options link to their page to choose one instead.
 */
const ProductCard = ({ hit, currencyCode, priority }: ProductCardProps) => {
  const { countryCode } = useParams<{ countryCode: string }>()
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<Status>("idle")
  const price = getHitPrice(hit, currencyCode)
  const href = `/products/${hit.handle}`

  useEffect(() => {
    if (status === "idle") return
    const timer = window.setTimeout(() => setStatus("idle"), 2500)
    return () => window.clearTimeout(timer)
  }, [status])

  const add = () => {
    if (!hit.variant_id) return
    const variantId = hit.variant_id
    startTransition(async () => {
      try {
        await addToCart({ variantId, quantity: 1, countryCode })
        setStatus("added")
      } catch {
        setStatus("error")
      }
    })
  }

  const priceLabel = price && (
    <span className="flex items-baseline gap-x-2 tabular-nums">
      <span>{price.label}</span>
      {price.original && (
        <span className="hidden text-xs line-through opacity-70 small:inline" data-testid="original-price">
          <span className="sr-only">was </span>
          {price.original}
        </span>
      )}
    </span>
  )

  const barText =
    status === "added" ? "Added to bag" : status === "error" ? "Couldn't add" : pending ? "Adding…" : "Add to bag"

  return (
    <article className="group/card flex h-full flex-col" data-testid="product-wrapper">
      <LocalizedClientLink href={href} className="block focus-visible:outline-none" tabIndex={-1} aria-hidden>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-lush-cotton/35">
          {hit.thumbnail ? (
            <Image
              src={hit.thumbnail}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03] motion-reduce:transition-none"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-lush-umber">
              <PlaceholderImage size={24} />
            </div>
          )}
          {price?.savings && (
            <span className="absolute left-0 top-0 bg-lush-clay px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-white">
              Save {price.savings}
            </span>
          )}
        </div>
      </LocalizedClientLink>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-sm text-lush-ink" data-testid="product-title">
          <LocalizedClientLink
            href={href}
            className="hover:underline focus-visible:underline focus-visible:outline-none"
          >
            {hit.title}
          </LocalizedClientLink>
        </h3>
        {hit.subtitle && <p className="mt-0.5 text-sm text-lush-umber">{hit.subtitle}</p>}

        <div className="mt-auto pt-3" data-testid="product-price">
          {hit.variant_id ? (
            <button
              type="button"
              onClick={add}
              disabled={pending}
              aria-label={`Add ${hit.title ?? "product"} to bag${price ? `, ${price.label}` : ""}`}
              className={`${BAR} bg-lush-ink text-white hover:bg-lush-clay disabled:cursor-wait disabled:opacity-80`}
              data-testid="add-to-bag"
            >
              <span>{barText}</span>
              {priceLabel}
            </button>
          ) : (
            <LocalizedClientLink
              href={href}
              aria-label={`Choose options for ${hit.title ?? "product"}`}
              className={`${BAR} border border-lush-ink text-lush-ink hover:bg-lush-ink hover:text-white`}
            >
              <span>
                <span className="small:hidden">Options</span>
                <span className="hidden small:inline">Choose options</span>
              </span>
              {priceLabel}
            </LocalizedClientLink>
          )}
          <span className="sr-only" aria-live="polite">
            {status === "added" ? `${hit.title ?? "Product"} added to bag` : status === "error" ? "Couldn't add to bag" : ""}
          </span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
