import { describe, expect, it } from "vitest"

import { jsonLdGraph, toJsonLd } from "./json-ld"

describe("jsonLdGraph", () => {
  const doc = jsonLdGraph([
    { "@type": "Organization", name: "Lush Candles" },
    { "@type": "WebSite", name: "Lush Candles" },
  ])

  it("puts a single @context at the top level", () => {
    expect(doc["@context"]).toBe("https://schema.org")
    expect(doc["@graph"]).toHaveLength(2)
  })

  // Regression: extensions that parse ld+json and read data["@context"]
  // crashed on the homepage's former top-level array.
  it("survives a reader that expects @context on the parsed root", () => {
    const parsed = JSON.parse(toJsonLd(doc))
    expect(() => parsed["@context"].toLowerCase()).not.toThrow()
    expect(Array.isArray(parsed)).toBe(false)
  })
})

describe("toJsonLd", () => {
  it("escapes < so a value cannot close the script tag", () => {
    const out = toJsonLd({ name: "</script><script>alert(1)</script>" })
    expect(out).not.toContain("<")
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>")
  })
})
