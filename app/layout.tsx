import type { Metadata } from "next"
import { Inter, Yuji_Boku } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const yujiBoku = Yuji_Boku({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yuji-boku",
  display: "swap",
})

const TITLE = "Omisha Chabria · Product Designer"
const DESCRIPTION =
  "Omisha Chabria, product designer bringing together UX, analytics, and the business of fashion. Explore product design and mobile commerce work from URBN and Anthropologie."
// Absolute URLs for the social preview: Vercel's production domain, else the
// deployment URL (previews), else local dev.
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"
const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "Omisha Chabria's portfolio: a pink tear-off flyer reading \"Hi, I'm Omisha!\"" }

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Omisha Chabria",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${yujiBoku.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=zodiak@300,301,400,401,700,701,800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
