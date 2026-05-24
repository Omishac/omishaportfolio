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
  title: "Omisha Chabria — Product Designer",
  description:
    "I design digital products by balancing Creativity & Insights; always grounded in how people experience them.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${yujiBoku.variable}`}>
      <body>{children}</body>
    </html>
  )
}
