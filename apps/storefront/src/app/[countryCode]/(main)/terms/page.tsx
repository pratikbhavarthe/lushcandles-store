import { Metadata } from "next"

import { LEGAL_UPDATED } from "@lib/legal/business"
import { STORE_NAME } from "@lib/util/site"
import { LegalDocument } from "@modules/legal/components"
import { termsIntro, termsSections } from "@modules/legal/content/terms"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: "Terms of service",
  description: `The terms that apply when you use the ${STORE_NAME} website and buy from us in India.`,
}

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of service"
      updated={LEGAL_UPDATED.terms}
      intro={termsIntro}
      sections={termsSections}
    />
  )
}
