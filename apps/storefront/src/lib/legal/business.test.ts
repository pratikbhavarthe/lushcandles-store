import { describe, expect, it } from "vitest"

import { BUSINESS, missingBusinessDetails, type BusinessDetails } from "./business"

const complete: BusinessDetails = {
  ...BUSINESS,
  legalName: "Example Pvt Ltd",
  registeredAddress: "1 Example Road, Mumbai 400001",
  gstin: "27AAAAA0000A1Z5",
  supportEmail: "care@example.com",
  supportPhone: "+91 90000 00000",
  grievanceOfficer: { name: "A. Officer", designation: "Grievance Officer", email: "g@example.com", phone: null },
  jurisdiction: "Mumbai, Maharashtra",
  paymentPartners: "Example Pay",
  logisticsPartners: "Example Courier",
  hosting: "Example Cloud (Mumbai)",
  refundStartDays: 5,
}

describe("missingBusinessDetails", () => {
  it("lists every required detail that is unset", () => {
    const missing = missingBusinessDetails({ ...complete, gstin: null, refundStartDays: null })
    expect(missing).toEqual(["GSTIN", "refund timeline"])
  })

  it("is empty once the required details are filled, so the draft banner hides", () => {
    expect(missingBusinessDetails(complete)).toEqual([])
  })

  it("treats a refund timeline of 0 days as set", () => {
    expect(missingBusinessDetails({ ...complete, refundStartDays: 0 })).toEqual([])
  })
})
