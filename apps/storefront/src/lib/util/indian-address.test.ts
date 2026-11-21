import { describe, expect, it } from "vitest"

import {
  indianPhoneSchema,
  pinCodeSchema,
  validateIndianAddress,
} from "./indian-address"

describe("pinCodeSchema", () => {
  it.each(["110001", "560034", " 400001 "])("accepts %j", (pin) => {
    expect(pinCodeSchema.safeParse(pin).success).toBe(true)
  })

  it.each(["011001", "11001", "1100011", "11000A", ""])("rejects %j", (pin) => {
    expect(pinCodeSchema.safeParse(pin).success).toBe(false)
  })
})

describe("indianPhoneSchema", () => {
  it.each(["9876543210", "+91 98765 43210", "09876543210", "6123456789"])(
    "accepts %j",
    (phone) => {
      expect(indianPhoneSchema.safeParse(phone).success).toBe(true)
    }
  )

  it.each(["5876543210", "98765", "+1 4155550100"])("rejects %j", (phone) => {
    expect(indianPhoneSchema.safeParse(phone).success).toBe(false)
  })
})

describe("validateIndianAddress", () => {
  it("ignores addresses outside India", () => {
    expect(
      validateIndianAddress({ country_code: "us", postal_code: "94107" })
    ).toBeNull()
  })

  it("accepts a valid Indian address without a phone", () => {
    expect(
      validateIndianAddress({ country_code: "IN", postal_code: "110001" })
    ).toBeNull()
  })

  it("reports an invalid PIN with the address label", () => {
    expect(
      validateIndianAddress(
        { country_code: "in", postal_code: "12345" },
        "Billing address"
      )
    ).toBe("Billing address: Enter a valid 6-digit PIN code")
  })

  it("reports an invalid phone number", () => {
    expect(
      validateIndianAddress({
        country_code: "in",
        postal_code: "110001",
        phone: "12345",
      })
    ).toBe("Shipping address: Enter a valid 10-digit Indian mobile number")
  })
})
