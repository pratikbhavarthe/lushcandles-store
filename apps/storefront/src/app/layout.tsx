import { getBaseURL } from "@lib/util/env"
import { STORE_NAME } from "@lib/util/site-constants"
import { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "styles/globals.css"

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: STORE_NAME,
    template: `%s | ${STORE_NAME}`,
  },
  description: `${STORE_NAME}: candles for the home.`,
  openGraph: { siteName: STORE_NAME, type: "website", locale: "en_IN" },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-mode="light"
      className={`${display.variable} ${sans.variable}`}
    >
      <head>
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body className="bg-lush-ivory text-lush-ink font-sans antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
