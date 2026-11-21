const SCHEMA_CONTEXT = "https://schema.org"

type JsonLdNode = { "@type": string } & Record<string, unknown>

/**
 * Wraps several schema.org nodes in one JSON-LD document with a single
 * top-level `@context` and an `@graph`.
 *
 * A bare top-level array is valid JSON-LD, but many browser extensions and
 * simple crawlers read `data["@context"]` straight off the parsed script and
 * crash on an array (seen as "undefined is not an object (evaluating
 * 'r["@context"].toLowerCase')"). `@graph` is equivalent for search engines
 * and safe for those readers.
 */
export const jsonLdGraph = (nodes: JsonLdNode[]) => ({
  "@context": SCHEMA_CONTEXT,
  "@graph": nodes,
})

/** Serializes JSON-LD for a `<script>` tag without allowing `</script>` breakouts. */
export const toJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c")
