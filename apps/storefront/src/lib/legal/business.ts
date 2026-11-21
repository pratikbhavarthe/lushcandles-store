/**
 * The seller details the legal pages print. Indian law requires an online
 * seller to show most of these (Consumer Protection (E-Commerce) Rules, 2020,
 * rule 6; Digital Personal Data Protection Act, 2023), so fill them in before
 * launch. Never guess one: a `null` renders as a visible "to be confirmed"
 * marker, and the pages show a draft banner until every required value is set.
 */
export type BusinessDetails = {
  tradeName: string
  /** Legal name of the proprietorship, LLP or company that sells. */
  legalName: string | null
  /** e.g. "sole proprietorship", "LLP", "private limited company". */
  entityType: string | null
  registeredAddress: string | null
  gstin: string | null
  /** Company or LLP identification number, if incorporated. */
  cin: string | null
  supportEmail: string | null
  supportPhone: string | null
  supportHours: string | null
  grievanceOfficer: {
    name: string | null
    designation: string | null
    email: string | null
    phone: string | null
  }
  /** City whose courts have jurisdiction, e.g. "Mumbai, Maharashtra". */
  jurisdiction: string | null
  /** Payment gateway(s) used at checkout, e.g. "Razorpay". */
  paymentPartners: string | null
  /** Courier partner(s), e.g. "Delhivery and Blue Dart". */
  logisticsPartners: string | null
  /** Hosting provider and data location, e.g. "AWS (Mumbai region)". */
  hosting: string | null
  /** Working days to start a refund once a cancellation or return is approved. */
  refundStartDays: number | null
}

export const BUSINESS: BusinessDetails = {
  tradeName: "Lush Candles",
  legalName: null,
  entityType: null,
  registeredAddress: null,
  gstin: null,
  cin: null,
  supportEmail: null,
  supportPhone: null,
  supportHours: null,
  grievanceOfficer: {
    name: null,
    designation: null,
    email: null,
    phone: null,
  },
  jurisdiction: null,
  paymentPartners: null,
  logisticsPartners: null,
  hosting: null,
  refundStartDays: null,
}

/** Dates the current versions of the documents took effect. */
export const LEGAL_UPDATED = {
  terms: "2026-11-22",
  privacy: "2026-11-22",
}

const REQUIRED: [string, (b: BusinessDetails) => unknown][] = [
  ["legal name", (b) => b.legalName],
  ["registered address", (b) => b.registeredAddress],
  ["GSTIN", (b) => b.gstin],
  ["support email", (b) => b.supportEmail],
  ["support phone", (b) => b.supportPhone],
  ["grievance officer name", (b) => b.grievanceOfficer.name],
  ["grievance officer email", (b) => b.grievanceOfficer.email],
  ["jurisdiction", (b) => b.jurisdiction],
  ["payment partner", (b) => b.paymentPartners],
  ["courier partner", (b) => b.logisticsPartners],
  ["hosting provider", (b) => b.hosting],
  ["refund timeline", (b) => b.refundStartDays],
]

/** Labels of the required details that are still unset. */
export const missingBusinessDetails = (business: BusinessDetails = BUSINESS) =>
  REQUIRED.filter(([, read]) => read(business) == null).map(([label]) => label)
