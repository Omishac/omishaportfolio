# Omisha Portfolio — Claude Context

## Active branch
`redesign-1` — all homepage work goes here. Never touch case study pages.

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

## Hero (current state — matches Figma node 83:2, "Desktop - 5")
- Figma file: https://www.figma.com/design/HT6JZC5NjxGzIoWlNrVllH/Untitled?node-id=83-2
- Tear-off paper flyer (blue `#94BDD3` + crumpled texture + tape) on a fixed 540×590 stage using Figma coordinates; stage scales down to fit `w - 2*px`
- Assets in `public/hero-flyer/` (tape PNG is rotated −21.8° in CSS to match Figma's rotated image fill)
- Text: role line + "Take what you need:" Inter Bold 10.2px `#365144`; intro Inter Light 16.1px `#303432` ("Hi, I'm Omisha!" is the h1)
- Tabs (Inter SemiBold 16.1px, rotated 92.3°): Redesign, Mobile Design, Digital Strategy, Freelancing, Say hello (mailto); two tabs shown torn off
- Entrance: fade + translateY/rotate settle (EASE_SPRING), off under reduced motion

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
- Push to `redesign-1` branch
- Always `git push -u origin redesign-1`
