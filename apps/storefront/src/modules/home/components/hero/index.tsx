import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HeroMotion from "./hero-motion"

// The original photo is 4032×3024. Smaller copies are high-quality (q90,
// 4:4:4) resizes so phones don't download the full file, and the browser picks
// the original on large and high-density screens. Images are served
// unoptimised (next.config.js), so nothing here is recompressed at runtime.
const PHOTO = {
  src: "/hero-bg/hero-bg-1920.jpg",
  srcSet: [
    "/hero-bg/hero-bg-1280.jpg 1280w",
    "/hero-bg/hero-bg-1920.jpg 1920w",
    "/hero-bg/hero-bg-2560.jpg 2560w",
    "/hero-bg/hero-bg.jpeg 4032w",
  ].join(", "),
  width: 4032,
  height: 3024,
}

/**
 * Full-screen hero over a photo of our teddy bear candles. The copy sits over
 * the light wall in the top of the frame, with a soft ivory wash behind it for
 * contrast, and the candles fill the lower half.
 */
const Hero = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate -mt-[72px] w-full overflow-hidden"
    >
      {/* Plain <img> so the srcset above is used as-is; next/image with
          `unoptimized` would only ever send one file. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PHOTO.src}
        srcSet={PHOTO.srcSet}
        // object-cover fills the height on screens narrower than the photo's
        // 4:3, so it renders 4/3 of the viewport height wide, not 100vw.
        sizes="(max-aspect-ratio: 4/3) 134vh, 100vw"
        width={PHOTO.width}
        height={PHOTO.height}
        alt="Rows of handmade teddy bear candles"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-top"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-lush-ivory/85 via-lush-ivory/45 via-40% to-transparent to-60%"
      />

      <HeroMotion>
        <div className="flex min-h-[100svh] w-full px-4 small:px-8 medium:px-10 flex-col pb-16 pt-[calc(72px+2.5rem)] small:pt-[calc(72px+4rem)]">
          <div data-hero-text className="max-w-2xl">
            <div className="flex flex-col gap-5 motion-safe:animate-fade-in-top">
              <p className="text-xs uppercase tracking-[0.3em] text-lush-clay">
                Lush Candles
              </p>
              <h1
                id="hero-heading"
                className="font-display text-5xl leading-[1.05] text-lush-ink small:text-7xl"
              >
                Candles for
                <br />
                quieter evenings.
              </h1>
              <p className="max-w-md text-base leading-relaxed text-lush-ink">
                Browse the collection, choose your scent and size, and have it
                delivered to your door.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <LocalizedClientLink
                  href="/store"
                  className="inline-flex h-11 items-center rounded-full bg-lush-clay px-7 text-sm text-white transition-colors hover:bg-lush-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lush-ink"
                >
                  Shop all candles
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/about"
                  className="inline-flex h-11 items-center rounded-full border border-lush-ink/40 bg-white/80 px-7 text-sm text-lush-ink backdrop-blur-sm transition-colors hover:border-lush-ink hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lush-ink"
                >
                  Our story
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </HeroMotion>
    </section>
  )
}

export default Hero
