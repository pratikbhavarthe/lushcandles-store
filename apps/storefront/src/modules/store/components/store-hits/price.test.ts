import { describe, expect, it } from "vitest"

import { getHitPrice } from "./price"

describe("getHitPrice", () => {
  it("reads the region currency's fields and drops .00 on whole amounts", () => {
    const price = getHitPrice({ min_price_inr: 1299, max_price_inr: 1299 }, "inr")
    expect(price).toEqual({ label: "₹1,299", original: null, savings: null })
  })

  it("shows a range as From the lowest price", () => {
    expect(getHitPrice({ min_price_inr: 899, max_price_inr: 1499 }, "INR")?.label).toBe("From ₹899")
  })

  it("adds the original price and savings for a discounted single price", () => {
    const price = getHitPrice(
      { min_price_inr: 1299, max_price_inr: 1299, original_price_inr: 1599, on_sale_inr: true },
      "inr"
    )
    expect(price).toMatchObject({ original: "₹1,599", savings: "₹300" })
  })

  it("shows no sale details for a range, even when on sale", () => {
    const price = getHitPrice(
      { min_price_inr: 899, max_price_inr: 1499, original_price_inr: 1599, on_sale_inr: true },
      "inr"
    )
    expect(price).toMatchObject({ original: null, savings: null })
  })

  it("keeps decimals on fractional amounts", () => {
    expect(getHitPrice({ min_price_usd: 12.5 }, "usd")?.label).toBe("$12.50")
  })

  it("returns null when the product has no price", () => {
    expect(getHitPrice({}, "inr")).toBeNull()
  })
})
