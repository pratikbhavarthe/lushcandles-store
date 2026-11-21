import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HeroBackground from "./hero-background"

/**
 * Typographic hero. No stock photography or marketing claims: swap in real
 * product photography and approved copy once the brand assets exist.
 */
const Hero = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate -mt-[72px] w-full overflow-hidden pt-[72px]"
    >
      <HeroBackground />
      <div className="content-container grid min-h-[70vh] items-center gap-12 py-20 small:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-6 motion-safe:animate-fade-in-top">
          <p className="text-xs uppercase tracking-[0.3em] text-white">
            Lush Candles
          </p>
          <h1
            id="hero-heading"
            className="font-display text-5xl leading-[1.05] text-white small:text-7xl"
          >
            Candles for
            <br />
            quieter evenings.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/85">
            Browse the collection, choose your scent and size, and have it
            delivered to your door.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <LocalizedClientLink
              href="/store"
              className="inline-flex h-11 items-center rounded-full bg-white px-7 text-sm text-lush-ink transition-colors hover:bg-lush-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Shop all candles
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/about"
              className="inline-flex h-11 items-center rounded-full border border-white/60 px-7 text-sm text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Our story
            </LocalizedClientLink>
          </div>
        </div>
        <CandleIllustration />
      </div>
    </section>
  )
}

const CandleIllustration = () => (
  <div aria-hidden className="relative mx-auto hidden h-80 w-56 small:block">
    <div className="absolute inset-x-0 bottom-0 mx-auto h-52 w-40 rounded-t-[2.5rem] rounded-b-xl bg-gradient-to-b from-lush-ivory to-lush-sand shadow-[inset_0_-12px_24px_rgba(90,70,54,0.08)]" />
    <div className="absolute bottom-52 left-1/2 h-5 w-[2px] -translate-x-1/2 bg-lush-umber" />
    <div className="absolute bottom-[14.5rem] left-1/2 h-10 w-5 -translate-x-1/2 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-amber-500 via-amber-300 to-amber-100 motion-safe:animate-[flicker_3s_ease-in-out_infinite]" />
    <div className="absolute bottom-48 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-amber-200/30 blur-2xl" />
  </div>
)

export default Hero
