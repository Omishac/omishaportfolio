# Omisha Portfolio — Claude Context

## Active branch
`redesign-1` — all homepage work goes here. Never touch case study pages.

## Stack
Next.js 14 App Router, TypeScript, inline styles (no Tailwind), "use client" components.

## Key files
- `app/page.tsx` — homepage only. All hero/section changes live here.
- `components/site.tsx` — shared design language: tokens (FONT_SANS/FONT_SERIF, COLORS incl. `paper` #F4F2EF and `pink` #D33361, HOVER_COLORS, EASE_*), hooks (useReducedMotion, useFinePointer) and small pieces (HoverLetters, BracketTag, Squiggle). Homepage, NavLinks and the URBN filter case study import from here; don't redefine these values locally.
- `components/NavLinks.tsx` — nav link styling shared by EVERY page's nav (homepage `HomeNav` and `SharedNav`). Change nav typography/states here so all pages stay in sync.
- `components/SharedNav.tsx` — the nav bar for the playground and all four case studies (same geometry as the homepage `HomeNav`: 64/54px tall, logo at page padding 20/40/80/120px, 14px links above 1440px). Change it here, not per page.
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
- Text (all white-ish on pink): "Hi, I'm Omisha!" Inter Bold 20.6px (the h1); role line Inter Medium 12px; "Take what you need:" Inter Bold 10.4px `#FFE2ED`
- Nav links on all pages (`components/NavLinks.tsx`, Figma 115:42): Inter ExtraLight 12.9px, black, lowercase, 19.5px gaps; pink hand-drawn underline on hover/focus/current page, dashed pink focus ring; phone menu 34px
- Tabs (Inter Light 15.5px, rotated 92.3°): Redesign, Mobile Design, Digital Strategy, Freelancing (italic), Say hello (mailto, dog-eared corner); two tabs shown torn off
- CTA below flyer: "Interested? Learn more" in Zodiak (`NAV_Z`) + pink curved SVG arrow
- Entrance: flyer fade + translateY/rotate settle (EASE_SPRING), CTA fades in after; off under reduced motion
- Tear-off tabs: each tab is its own clipped copy of the paper (`TABS` + `tabGeometry`), styles in `FLYER_TAB_STYLES`. Hover/focus/touch = peel + curl + flutter + shadow. Destinations: Redesign → /anthropologie-product-discovery, Mobile Design → /ios-review-accessibility, Digital Strategy → /anthropologie-mcommerce, Freelancing → /playground, Say hello → LinkedIn (new tab). Click = crumple: the tab is swapped for `.ft-wad` whose clip-path morphs from the tab outline to a jagged wad (`WAD_GEOMETRY`), then it's tossed up and the link opens (~0.8s). New-tab/mailto tabs return in place; bfcache restore resets. Reduced motion: click navigates immediately

## Footer game (`FooterGame`, Figma 129:226)
- Hidden "secret level" under the footer: `FooterGame` renders the Footer (passed as `footer` prop) followed by an 85svh game section (80svh on phone) so the footer row stays visible above it at the bottom of the page; white bg
- Reveal uses framer-motion `useScroll` (target = game section, offset ["start end", "end end"]) + function-form `useTransform` (array form let framer hand opacity to a native scroll timeline and the stage stayed invisible). Footer recedes gently (−3° tilt, 98.5% scale, 85% opacity), soft seam shadow at the section top, game stage comes forward from translateZ(-220) rotateX(16°) and is identity from p=0.88
- Playable only at p >= 0.96 (`playable` → pointer-events + handler guards); an in-progress aim is cancelled if the visitor scrolls back. Only a back-and-down pull launches, so swipes on the ball can't throw it
- Assets in `public/footer-game/` (pile = decorative, ball = interactive, can drawn twice: back layer + `CAN_FRONT_CLIP` front layer so a scored ball drops behind the rim)
- Flow: note → "Crumple it" → pull back & release → `tossStep` physics → scored / missed. "Toss it for me" = keyboard throw. Geometry measured from live rects at throw time
- Reduced motion: reveal is a plain fade (no 3D), no crumple/flight animation, throws resolve instantly

## Keyframes (in CURSOR_STYLES string at top of page.tsx)
- `illust-float` — 5px vertical float, 5.5s cycle
- `clip-in` — horizontal wipe reveal
- `marquee` — logo strip scroll

## CRITICAL SCOPE RULE
(Exception: the nav links are intentionally shared site-wide via `components/NavLinks.tsx`.)
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
