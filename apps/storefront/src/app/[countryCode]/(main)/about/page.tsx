import { Metadata } from "next"

import { STORE_NAME } from "@lib/util/site"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PlaceholderNotice, PolicyPage } from "@modules/policies/templates"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: "About us",
  description: `About ${STORE_NAME}.`,
}

export default function AboutPage() {
  return (
    <PolicyPage title={`About ${STORE_NAME}`}>
      <PlaceholderNotice />
      <p>
        [Brand story to be provided: who makes the candles, where, and what
        sets them apart.]
      </p>
      <p>
        [Materials and process to be provided: wax type, wick, fragrance
        sourcing. Only include claims the business can substantiate.]
      </p>
      <p>
        Have a question?{" "}
        <LocalizedClientLink href="/contact" className="underline underline-offset-4">
          Get in touch
        </LocalizedClientLink>
        .
      </p>
    </PolicyPage>
  )
}
