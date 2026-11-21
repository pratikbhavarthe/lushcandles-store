import RidgelineDitherFooter, {
  type RidgelineColumn,
} from "@/components/ui/ridgeline-dither-footer"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { STORE_NAME } from "@lib/util/site-constants"
import FlameMark from "@modules/layout/components/nav-bar/flame-mark"

// Lush Candles palette for the dithered ridges: ivory paper through sand and
// clay to the deepest umber. The luminance steps follow the component's
// "glacier" demo ramp so the range keeps the same depth in warm colours.
// Text colours checked against the paper for WCAG AA: ink 14.3:1,
// muted 6.2:1, link-hover accent (tones[4]) 6.1:1.
const PALETTE = {
  paper: "#FAF7F2",
  ink: "#2A2420",
  muted: "#6B5A4A",
  line: "#E6DCCC",
  heart: "#7C5535",
  tones: ["#FAF7F2", "#EEE1CE", "#D8BC96", "#B0865C", "#7C5535", "#4A3221", "#22160E"],
}

const FIGTREE = "var(--font-figtree), ui-sans-serif, system-ui, sans-serif"

const settle = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
  try {
    return await promise
  } catch {
    return fallback
  }
}

export default async function Footer({ countryCode }: { countryCode: string }) {
  const [categories, collections] = await Promise.all([
    settle(listCategories({ fields: "id,name,handle,parent_category_id", limit: 50 }), []),
    settle(
      listCollections({ fields: "id,handle,title", limit: "6" }).then((r) => r.collections),
      []
    ),
  ])

  // The component renders plain anchors, so every href carries the country prefix.
  const to = (path: string) => `/${countryCode}${path}`

  const columns: RidgelineColumn[] = [
    {
      title: "Shop",
      links: [
        { label: "All candles", href: to("/store") },
        ...categories
          .filter((c) => !c.parent_category_id)
          .slice(0, 5)
          .map((c) => ({ label: c.name, href: to(`/categories/${c.handle}`) })),
      ],
    },
    ...(collections.length
      ? [
          {
            title: "Collections",
            links: collections.map((c) => ({ label: c.title, href: to(`/collections/${c.handle}`) })),
          },
        ]
      : []),
    {
      title: "Help",
      links: [
        { label: "Shipping", href: to("/shipping") },
        { label: "Returns", href: to("/returns") },
        { label: "Contact", href: to("/contact") },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: to("/about") },
        { label: "Privacy policy", href: to("/privacy") },
        { label: "Terms of service", href: to("/terms") },
      ],
    },
  ]

  return (
    <RidgelineDitherFooter
      name={STORE_NAME}
      brandHref={to("")}
      logo={<FlameMark className="h-7 w-7" />}
      tagline="Candles for quieter evenings."
      columns={columns}
      socials={[]}
      copyright={`© ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.`}
      credit={null}
      preset="sepia"
      palette={PALETTE}
      seed={23}
      ridges={7}
      altimeter={false}
      // Full-bleed range; the text columns are re-centred at the site width
      // by the .lush-footer rules in styles/globals.css.
      maxWidth="100%"
      className="lush-footer"
      fontFamily={FIGTREE}
      monoFamily={FIGTREE}
    />
  )
}
