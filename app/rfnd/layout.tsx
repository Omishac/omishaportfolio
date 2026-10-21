import type { Metadata } from "next"

// RFND isn't a published case study yet: reachable by direct link, but kept out
// of search results. Remove this `robots` block when it goes live.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function RfndLayout({ children }: { children: React.ReactNode }) {
  return children
}
