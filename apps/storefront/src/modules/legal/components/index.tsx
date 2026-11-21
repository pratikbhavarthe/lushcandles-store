import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { ReactNode } from "react"

import { BUSINESS, missingBusinessDetails } from "@lib/legal/business"

export type LegalSection = {
  id: string
  title: string
  body: ReactNode
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${iso}T00:00:00+05:30`)
  )

/**
 * A seller detail, or a visible marker while it is unset, so a missing value
 * is never silently dropped from a legal document.
 */
export const Detail = ({ value, label }: { value: string | number | null; label: string }) =>
  value == null || value === "" ? (
    <mark className="rounded bg-lush-cotton px-1 py-0.5 text-lush-clay">[{label}: to be confirmed]</mark>
  ) : (
    <>{value}</>
  )

export const InternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <LocalizedClientLink href={href} className="text-lush-clay underline underline-offset-2 hover:text-lush-ink">
    {children}
  </LocalizedClientLink>
)

export const ExternalLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-lush-clay underline underline-offset-2 hover:text-lush-ink"
  >
    {children}
  </a>
)

/** Name, address and contact block for the seller and grievance officer. */
export const GrievanceOfficer = () => {
  const g = BUSINESS.grievanceOfficer
  return (
    <dl className="grid grid-cols-1 gap-y-1 rounded-2xl border border-lush-sand bg-white/60 p-5 small:grid-cols-[10rem_1fr] small:gap-x-6">
      <dt className="text-lush-umber">Name</dt>
      <dd><Detail value={g.name} label="Grievance officer name" /></dd>
      <dt className="text-lush-umber">Designation</dt>
      <dd><Detail value={g.designation} label="Designation" /></dd>
      <dt className="text-lush-umber">Email</dt>
      <dd><Detail value={g.email} label="Grievance email" /></dd>
      <dt className="text-lush-umber">Phone</dt>
      <dd><Detail value={g.phone} label="Grievance phone" /></dd>
      <dt className="text-lush-umber">Address</dt>
      <dd><Detail value={BUSINESS.registeredAddress} label="Registered address" /></dd>
    </dl>
  )
}

type LegalDocumentProps = {
  title: string
  updated: string
  intro: ReactNode
  sections: LegalSection[]
}

/**
 * Long-form legal page: title and effective date, a short summary, a table of
 * contents (sticky beside the text on wide screens) and numbered sections with
 * linkable anchors.
 */
export const LegalDocument = ({ title, updated, intro, sections }: LegalDocumentProps) => {
  const missing = missingBusinessDetails()

  return (
    <div className="w-full px-4 pb-24 pt-10 small:px-8 medium:px-10" data-testid="policy-page">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-lush-clay">Legal</p>
          <h1 className="mt-3 text-4xl text-lush-ink small:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-lush-umber">
            Last updated <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
          <div className="mt-6 text-lg leading-relaxed text-lush-ink/90">{intro}</div>
        </header>

        {missing.length > 0 && (
          <div
            role="note"
            className="mt-8 max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900"
            data-testid="policy-placeholder"
          >
            <p className="font-medium">Draft: not yet in force</p>
            <p className="mt-1">
              Some seller details are still to be confirmed ({missing.join(", ")}). They are marked in
              the text below.
            </p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-12 medium:grid-cols-[15rem_minmax(0,1fr)]">
          <nav aria-label="On this page" className="medium:sticky medium:top-28 medium:self-start">
            <p className="text-xs uppercase tracking-[0.16em] text-lush-umber">On this page</p>
            <ol className="mt-4 flex flex-col gap-2 text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-x-2 text-lush-umber transition-colors hover:text-lush-ink"
                  >
                    <span className="w-5 shrink-0 tabular-nums">{index + 1}.</span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-3xl">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-28 border-t border-lush-sand py-10 first:border-t-0 first:pt-0"
              >
                <h2 id={`${section.id}-title`} className="flex gap-x-3 text-2xl text-lush-ink">
                  <span className="tabular-nums text-lush-clay">{index + 1}.</span>
                  {section.title}
                </h2>
                <div className="legal-prose mt-5">{section.body}</div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </div>
  )
}
