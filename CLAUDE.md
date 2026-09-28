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

## Hero (current state — matches Figma node 115:4, "Desktop - 6")
- Figma file: https://www.figma.com/design/HT6JZC5NjxGzIoWlNrVllH/Untitled?node-id=115-4
- Tear-off paper flyer (pink `#D33361` + crumpled texture at 38% + clear tape) on a fixed 518×581 stage using Figma coordinates; stage scales down to fit `w - 2*px`
- Assets in `public/hero-flyer/` (tape is cropped out of the `tape-clear.png` sticker sheet)
- Text (all white-ish on pink): "Hi, I'm Omisha!" Inter Bold 16.8px (the h1); role line + "Take what you need:" Inter Medium 9.8px
- Tabs (Inter Light 15.5px, rotated 92.3°): Redesign, Mobile Design, Digital Strategy, Freelancing (italic), Say hello (mailto, dog-eared corner); two tabs shown torn off
- CTA below flyer: "Here's a closer look at what that means" in Zodiak (`NAV_Z`) + pink curved SVG arrow
- Entrance: flyer fade + translateY/rotate settle (EASE_SPRING), CTA fades in after; off under reduced motion
- Tear-off tabs: each tab is its own clipped copy of the paper (`TABS` + `tabGeometry`), styles in `FLYER_TAB_STYLES`. Hover/focus/touch = peel + curl at a hinge + flutter + shadow; click on a tab with `href` = rip, float offscreen, then navigate (mailto tabs return in place; bfcache restore resets). Tabs carry no transforms at rest (`data-live` toggles them) to avoid a hairline seam. Reduced motion: no transforms, click navigates immediately

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
