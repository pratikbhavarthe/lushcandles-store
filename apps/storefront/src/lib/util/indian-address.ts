import { z } from "zod"

/**
 * India Post PIN codes are six digits and never start with 0.
 * This checks the format only; it does not prove the PIN exists or is
 * serviceable. Serviceability belongs to the shipping provider integration.
 */
export const pinCodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code")

/**
 * Indian phone numbers: optional +91 / 91 / 0 prefix, then a 10-digit mobile
 * number starting with 6-9. Spaces and hyphens are ignored.
 */
export const indianPhoneSchema = z
  .string()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .pipe(
    z
      .string()
      .regex(
        /^(?:\+91|91|0)?[6-9][0-9]{9}$/,
        "Enter a valid 10-digit Indian mobile number"
      )
  )

type AddressInput = {
  country_code?: string | null
  postal_code?: string | null
  phone?: string | null
}

/**
 * Validates the India-specific parts of an address. Returns the first error
 * message, or null when the address is valid (or not in India).
 */
export function validateIndianAddress(
  address: AddressInput,
  label = "Shipping address"
): string | null {
  if (address.country_code?.toLowerCase() !== "in") {
    return null
  }

  const pin = pinCodeSchema.safeParse(address.postal_code ?? "")
  if (!pin.success) {
    return `${label}: ${pin.error.issues[0].message}`
  }

  if (address.phone) {
    const phone = indianPhoneSchema.safeParse(address.phone)
    if (!phone.success) {
      return `${label}: ${phone.error.issues[0].message}`
    }
  }

  return null
}
