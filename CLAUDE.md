# Omisha Portfolio — Claude Context

## Active branch
`landing-page-redesign` — all homepage work goes here. Never touch case study pages.

## Stack
Next.js 14 App Router, TypeScript, inline styles (no Tailwind), "use client" components.

## Key files
- `app/page.tsx` — homepage only. All hero/section changes live here.
- `components/SharedNav.tsx` — shared nav, do NOT modify (affects case studies).
- `app/globals.css` — global resets, easing tokens, keyframes.
- `public/images/` — character SVGs: `image 8.svg`, `image 8-1.svg`, `image 9.svg`, `image 10.svg`

## Design tokens (app/page.tsx)
```
const I  = "Inter, system-ui, sans-serif"
const Z  = "Zodiak, 'Times New Roman', serif"
const YB = "var(--font-yuji-boku), serif"
const C  = { ink: "#111111", ink2: "#3A3A3A", ink3: "#6B6B6B", muted: "#9A9A9A", border: "rgba(0,0,0,0.08)", bg: "#FFFFFF" }
const EASE_SPRING = "cubic-bezier(0.22,1,0.36,1)"
const EASE_OUT    = "cubic-bezier(0.23,1,0.32,1)"
```

## Breakpoints (`useBP` hook)
- phone < 768 | tablet 768–1024 | desktop 1024–1440 | large > 1440
- px: phone=20, tablet=40, large=120, desktop=80
- maxW: large=1280, else=1040

## Hero (current state — matches Figma node 41:2)
- Figma file: https://www.figma.com/design/HT6JZC5NjxGzIoWlNrVllH/Untitled?node-id=41-2
- Centered headline, no floating characters around text
- Font: Inter Black (900), color `#303432`, normal line-height and letter-spacing
- Font size: `clamp(52px, 5.2vw, 75px)` desktop — matches Figma's 74.6px at 1440px
- Three lines: "product designer," / "digital analyst," / "brand storyteller."
- Staggered entrance animation (opacity + translateY, EASE_SPRING)
- Scroll parallax on text block (`-scrollY * 0.03`)
- CTA: "Here's a closer look at what that means" + `image 8.svg` ghost (scaleX mirrored, 31px) inline + pink curved SVG arrow below

## Keyframes (in CURSOR_STYLES string at top of page.tsx)
- `illust-float` — 5px vertical float, 5.5s cycle
- `clip-in` — horizontal wipe reveal
- `marquee` — logo strip scroll

## CRITICAL SCOPE RULE
Do NOT modify case study pages or shared components in ways that affect them:
- `/anthropologie-product-discovery`
- `/anthropologie-mcommerce`
- `/ios-review-accessibility`
- `/rfnd`
- `/playground`

If a shared component needs a homepage-specific change, create a homepage-only variant instead.

## Git
- Push to `landing-page-redesign` branch
- Always `git push -u origin landing-page-redesign`
