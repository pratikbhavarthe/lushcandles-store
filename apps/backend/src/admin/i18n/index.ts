import en from "./json/en.json" with { type: "json" }

/**
 * Admin translations. The dashboard deep-merges these over its built-in
 * strings, so a key here overrides the matching core text: the sign-in and
 * invite screens greet "Welcome to Lush Candles" instead of "Welcome to
 * Medusa". English is the dashboard's fallback language.
 */
export default {
  en: {
    translation: en,
  },
}
