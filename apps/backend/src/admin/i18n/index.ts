/**
 * Admin translations. The dashboard deep-merges these over its built-in
 * strings, so a key here overrides the matching core text: the sign-in and
 * invite screens greet "Welcome to Lush Candles" instead of "Welcome to
 * Medusa". English is the dashboard's fallback language.
 *
 * Defined in TypeScript rather than imported JSON: the backend typecheck
 * covers src/admin and its module setting rejects JSON import attributes.
 */
const en = {
  login: {
    title: "Welcome to Lush Candles",
  },
  invite: {
    title: "Welcome to Lush Candles",
  },
}

export default {
  en: {
    translation: en,
  },
}
