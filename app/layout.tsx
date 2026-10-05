import type { Metadata } from "next"
import { Inter, Instrument_Sans, Yuji_Boku } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

// Instrument Sans: used on the homepage flyer (intro line and two tab labels)
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-sans",
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
    "I design digital products by balancing Creativity & Insights; always grounded in how people experience them.",
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
    <html lang="en" className={`${inter.variable} ${instrumentSans.variable} ${yujiBoku.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=zodiak@700,701,400,300&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
