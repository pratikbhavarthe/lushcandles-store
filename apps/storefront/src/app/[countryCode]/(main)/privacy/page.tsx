import { Metadata } from "next"

import { LEGAL_UPDATED } from "@lib/legal/business"
import { STORE_NAME } from "@lib/util/site"
import { LegalDocument } from "@modules/legal/components"
import { privacyIntro, privacySections } from "@modules/legal/content/privacy"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${STORE_NAME} collects, uses and protects your personal data under India's DPDP Act, 2023.`,
}

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      updated={LEGAL_UPDATED.privacy}
      intro={privacyIntro}
      sections={privacySections}
    />
  )
}
