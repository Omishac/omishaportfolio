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

export const metadata: Metadata = {
  title: "Omisha Chabria · Product Designer",
  description:
    "Omisha Chabria, product designer bringing together UX, analytics, and the business of fashion. Explore product design and mobile commerce work from URBN and Anthropologie.",
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
