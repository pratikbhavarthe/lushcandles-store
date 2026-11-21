import Image from "next/image"

import { STORE_NAME } from "@lib/util/site-constants"
import { clx } from "@modules/common/components/ui"

// One-line melted-script "lush candles" in charcoal, sized for the web.
// Print-resolution files in every colour are in /public/brand.
const LOGO = { src: "/brand/web-inline-ink.png", width: 846, height: 176 }

type BrandLogoProps = {
  /** Sets the rendered height; the width follows the artwork's ratio. */
  className?: string
  priority?: boolean
  /** Pass "" where the store name is already announced next to the logo. */
  alt?: string
}

/** The Lush Candles logo, with the store name as its accessible text. */
export default function BrandLogo({ className, priority, alt = STORE_NAME }: BrandLogoProps) {
  return (
    <Image
      src={LOGO.src}
      width={LOGO.width}
      height={LOGO.height}
      alt={alt}
      priority={priority}
      draggable={false}
      className={clx("w-auto select-none", className)}
    />
  )
}
