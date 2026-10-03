"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import NextImage from "next/image"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { NavStyles, NavLink, MenuLink, NAV_LINK_GAP } from "../components/NavLinks"
import { FONT_SANS, COLORS, EASE_SPRING, EASE_OUT, HOVER_COLORS, useReducedMotion, useFinePointer, HoverLetters, BracketTag } from "../components/site"

const CURSOR_STYLES = `
  /* Inter Medium Italic for the flyer greeting. Self-hosted under its own
     family name: next/font's Inter (v14) has no italic, and registering a
     face named "Inter" could change other text on the site. */
  @font-face {
    font-family: "Inter Flyer Italic";
    font-style: italic;
    font-weight: 500;
    font-display: swap;
    src: url("/fonts/inter-italic-latin.woff2") format("woff2");
  }
  @keyframes hi-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes hi-wiggle {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-4deg); }
    40% { transform: rotate(4deg); }
    60% { transform: rotate(-3deg); }
    80% { transform: rotate(3deg); }
  }
  @keyframes hi-pop {
    0% { transform: scale(1); }
    40% { transform: scale(1.08); }
    65% { transform: scale(0.96); }
    100% { transform: scale(1); }
  }
  @keyframes bubble-rise {
    0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
    100% { transform: translate(var(--bx), -60px) scale(0.3); opacity: 0; }
  }
  @keyframes illust-float {
    0%, 100% { transform: translateY(0px); }
    40%       { transform: translateY(-5px); }
    70%       { transform: translateY(-3px); }
  }
  @keyframes clip-in {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0% 0 0); }
  }
  html { scroll-behavior: smooth; }
  /* overflow-x: clip, not hidden — hidden without an explicit overflow-y
     forces overflow-y: auto (CSS overflow computed-value fixup), turning
     body into a scroll container that never actually scrolls (the document
     element does). clip prevents horizontal bleed without establishing one. */
  html, body { max-width: 100%; overflow-x: clip; }
  .logo-img {
    transition: opacity 0.35s ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .logo-img:hover { opacity: 0.7; }
  }
  .footer-icon {
    transition: transform 0.25s ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .footer-icon:hover { transform: scale(1.1); }
  }
  .hscroll {
    scrollbar-width: none;
  }
  .hscroll::-webkit-scrollbar {
    display: none;
  }
`

const I = FONT_SANS
const C = COLORS

// Smooths a raw scroll-derived value (0-1 progress, degrees, px — whatever)
// by chasing it each frame instead of snapping to it, so scroll-linked
// transforms trail the scroll position like inertial/smooth-scroll sites
// instead of updating in lockstep with it. Under reduced motion, the same
// loop converges in a single frame (factor 1) instead of gradually — it
// must stay the same continuous loop rather than a one-time snap, since
// callers often set their raw target in a later effect (e.g. to 1 once
// reducedMotion is known), which a one-time snap at mount would miss.
function useLerp(target: number, reducedMotion: boolean, factor: number = 0.12) {
    const [value, setValue] = useState(target)
    const current = useRef(target)
    const targetRef = useRef(target)
    const raf = useRef(0)
    targetRef.current = target
    const effectiveFactor = reducedMotion ? 1 : factor

    useEffect(() => {
        // Runs once and keeps ticking every frame, reading targetRef.current
        // fresh each time — decoupled from target updates so a fast-firing
        // scroll listener can't restart (and starve) the loop.
        const tick = () => {
            const diff = targetRef.current - current.current
            if (Math.abs(diff) > 0.0008) {
                current.current += diff * effectiveFactor
                setValue(current.current)
            } else if (current.current !== targetRef.current) {
                current.current = targetRef.current
                setValue(current.current)
            }
            raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf.current)
    }, [effectiveFactor])

    return value
}

function useBP() {
    const ref = useRef<HTMLDivElement>(null)
    const [w, setW] = useState(1280)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(el)
        setW(el.getBoundingClientRect().width)
        return () => ro.disconnect()
    }, [])

    const phone = w < 768
    const tablet = w >= 768 && w < 1024
    const desktop = w >= 1024 && w <= 1440
    const large = w > 1440

    const px = phone ? 20 : tablet ? 40 : large ? 120 : 80
    const maxW = large ? 1280 : 1040

    const sp = {
        sectionGap: phone ? 64 : tablet ? 96 : 120,
        headerGap: phone ? 24 : tablet ? 40 : 56,
        cardRowGap: phone ? 20 : tablet ? 28 : 36,
        cardColGap: phone ? 0 : tablet ? 20 : 24,
        heroTop: phone ? 40 : tablet ? 64 : 96,
        heroBottom: phone ? 64 : tablet ? 100 : 120,
        colOffset: tablet ? 0 : 80,
    }

    return { ref, w, phone, tablet, desktop, large, px, maxW, sp }
}

const NAV_Z = "Zodiak, 'Times New Roman', serif"

// Homepage-only nav: same links as every other page (components/NavLinks), but
// instead of sticking to the top permanently, it hides on scroll-down and
// slides back in on scroll-up (SharedNav and the case study navs stay
// always-sticky).
function HomeNav({ phone, tablet, large, px }: { phone: boolean; tablet: boolean; large: boolean; px: number }) {
    const [scrolled, setScrolled] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const lastY = useRef(0)
    const overlayRef = useRef<HTMLDivElement>(null)
    const reducedMotion = useReducedMotion()

    useEffect(() => {
        lastY.current = window.scrollY
        const onScroll = () => {
            const y = window.scrollY
            setScrolled(y > 12)
            const goingDown = y > lastY.current
            if (y < 80) {
                setHidden(false)
            } else if (goingDown && y - lastY.current > 2) {
                setHidden(true)
            } else if (!goingDown && lastY.current - y > 2) {
                setHidden(false)
            }
            lastY.current = y
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useEffect(() => { if (!phone) setMenuOpen(false) }, [phone])

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [menuOpen])

    const navH = phone ? 54 : 64
    const allLinks = [
        { label: "Work",       href: "#work" },
        { label: "Playground", href: "/playground" },
        { label: "LinkedIn",   href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
        { label: "Resume",     href: "/slides/resume.pdf", ext: true },
    ]

    return (
        <>
            <NavStyles />
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 200,
                    width: "100%",
                    height: navH,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: `0 ${px}px`,
                    boxSizing: "border-box",
                    backgroundColor: scrolled || menuOpen ? "rgba(255,255,255,0.98)" : C.bg,
                    backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
                    WebkitBackdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
                    borderBottom: `1px solid ${scrolled || menuOpen ? "rgba(0,0,0,0.09)" : C.border}`,
                    transform: `translateY(${hidden && !menuOpen ? -110 : 0}%)`,
                    transition: reducedMotion
                        ? "background 0.25s, border-color 0.25s"
                        : "background 0.25s, border-color 0.25s, transform 0.3s ease",
                }}
            >
                <a href="/" style={{ display: "block", lineHeight: 0, zIndex: 201 }}>
                    <img
                        src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png"
                        alt="OC"
                        style={{ width: phone ? 48 : 58, height: phone ? 48 : 58, objectFit: "contain", display: "block" }}
                    />
                </a>

                {!phone && (
                    <div style={{ display: "flex", gap: large ? 24 : NAV_LINK_GAP, alignItems: "center" }}>
                        {allLinks.map(({ label, href, ext }) => (
                            <NavLink key={label} label={label} href={href} ext={ext} size={large ? 14 : undefined} />
                        ))}
                    </div>
                )}

                {phone && (
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "10px",
                            margin: "-10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 201,
                            minWidth: 44,
                            minHeight: 44,
                        }}
                    >
                        {menuOpen ? (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M2 2 L16 16" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round"/>
                                <path d="M16 2 L2 16" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg width="5" height="21" viewBox="0 0 5 21" fill="none">
                                <circle cx="2.5" cy="2.5" r="2.5" fill={C.ink}/>
                                <circle cx="2.5" cy="10.5" r="2.5" fill={C.ink}/>
                                <circle cx="2.5" cy="18.5" r="2.5" fill={C.ink}/>
                            </svg>
                        )}
                    </button>
                )}
            </nav>

            {phone && (
                <div
                    ref={overlayRef}
                    onClick={(e) => { if (e.target === overlayRef.current) setMenuOpen(false) }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 199,
                        backgroundColor: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: "0 32px",
                        gap: 0,
                        opacity: menuOpen ? 1 : 0,
                        pointerEvents: menuOpen ? "auto" : "none",
                        transition: "opacity 0.25s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    {allLinks.map(({ label, href, ext }, i) => (
                        <MenuLink
                            key={label}
                            label={label}
                            href={href}
                            ext={ext}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                minHeight: 68,
                                width: "100%",
                                borderBottom: `1px solid ${C.border}`,
                                opacity: menuOpen ? 1 : 0,
                                transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                                transition: `opacity 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms, transform 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Reserves the flow space the fixed nav no longer occupies, so
                Hero/LogoTicker's `calc(100svh - navH)` sizing still lands
                exactly under the initial (visible) nav position. */}
            <div style={{ width: "100%", height: navH, flexShrink: 0 }} aria-hidden="true" />
        </>
    )
}

// Tear-off flyer hero — Figma node 115:4 ("Desktop - 6"), group 115:7.
// The flyer is a rotated paper collage, so it's laid out on a fixed stage
// using the Figma coordinates (relative to the group origin, shifted down by
// TAPE_OVERHANG so the tape poking above the paper stays inside the stage),
// and the whole stage is scaled down to fit narrower viewports.
const TAPE_OVERHANG = 33.28
const FLYER_W = 518
const FLYER_H = 548 + TAPE_OVERHANG
const FLYER_PINK = COLORS.pink

type Pt = [number, number]
const rad = (deg: number) => (deg * Math.PI) / 180

// Figma exports each rotated layer as a bounding box with a rotated child of
// its own size centered inside it; `rotBox` reproduces that placement.
function rotBox(
    box: { l: number; t: number; w: number; h: number },
    inner: { w: number; h: number },
    deg: number,
): React.CSSProperties {
    return {
        position: "absolute",
        left: box.l + box.w / 2 - inner.w / 2,
        top: box.t + box.h / 2 - inner.h / 2,
        width: inner.w,
        height: inner.h,
        transform: `rotate(${deg}deg)`,
    }
}

// Same placement as rotBox, but maps points from the layer's own coordinate
// space onto the stage — used to turn Figma's white cover shapes into clip paths.
function rotBoxPoints(
    box: { l: number; t: number; w: number; h: number },
    inner: { w: number; h: number },
    deg: number,
    pts: Pt[],
): Pt[] {
    const cx = box.l + box.w / 2
    const cy = box.t + box.h / 2
    const c = Math.cos(rad(deg))
    const s = Math.sin(rad(deg))
    return pts.map(([x, y]) => {
        const dx = x - inner.w / 2
        const dy = y - inner.h / 2
        return [cx + dx * c - dy * s, cy + dx * s + dy * c]
    })
}

// Centered text layer: (cx, cy) is the center of Figma's bounding box.
function rotText(cx: number, cy: number, deg: number): React.CSSProperties {
    return {
        position: "absolute",
        left: cx,
        top: cy,
        transform: `translate(-50%, -50%) rotate(${deg}deg)`,
        margin: 0,
        fontFamily: I,
        lineHeight: "normal",
        textAlign: "center",
        whiteSpace: "nowrap",
    }
}

const clipPoly = (pts: Pt[]) => `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(", ")})`

const FILL: React.CSSProperties = { position: "absolute", inset: 0, display: "block" }

// Perforations between tabs (vertical dashed lines).
const PERFS = [
    { src: "/hero-flyer/perf-a.svg", l: 76.54,  t: 325.48, h: 201.256, len: 201.457, deg: -87.44 },
    { src: "/hero-flyer/perf-b.svg", l: 149.65, t: 328.18, h: 198.55,  len: 198.753, deg: -87.41 },
    { src: "/hero-flyer/perf-a.svg", l: 222.75, t: 330.89, h: 201.256, len: 201.457, deg: -87.44 },
    { src: "/hero-flyer/perf-c.svg", l: 295.85, t: 330.89, h: 201.256, len: 201.458, deg: -87.43 },
    { src: "/hero-flyer/perf-a.svg", l: 368.95, t: 333.6,  h: 201.256, len: 201.457, deg: -87.44 },
    { src: "/hero-flyer/perf-d.svg", l: 442.05, t: 336.31, h: 201.255, len: 201.457, deg: -87.43 },
]

// ── Tab geometry ─────────────────────────────────────────────────────────────
// Each tab is its own copy of the paper, clipped to the column between two
// perforations (or a perforation and the paper edge) below the tear line, so
// it can lift, curl and rip away independently of the poster.
const TEAR = { cx: 7.05 + 497.271 / 2, cy: 322.77 + 16.274 / 2, slope: Math.tan(rad(1.87)) }
const tearY = (x: number) => TEAR.cy + TEAR.slope * (x - TEAR.cx)

type Edge = (y: number) => number
const perfEdge = (i: number): Edge => {
    const p = PERFS[i]
    const cx = p.l + 4.505
    const cy = p.t + p.h / 2
    const dx = (Math.cos(rad(p.deg)) * p.len) / 2
    const dy = (Math.sin(rad(p.deg)) * p.len) / 2
    const [x1, y1, x2, y2] = [cx + dx, cy + dy, cx - dx, cy - dy]
    return (y) => x1 + ((y - y1) * (x2 - x1)) / (y2 - y1)
}
const PAPER_LEFT: Edge = () => -30
const PAPER_RIGHT: Edge = () => FLYER_W + 30
// Where an edge meets the tear line.
const edgeTop = (edge: Edge): Pt => {
    let y = TEAR.cy
    for (let i = 0; i < 3; i++) y = tearY(edge(y))
    return [edge(y), y]
}

// Figma's "Rectangle 6": white cover giving the Mobile Design tab its ragged bottom.
const MOBILE_TORN_BOTTOM = rotBoxPoints(
    { l: 76.14, t: 508.62, w: 72.999, h: 27.521 }, { w: 71.971, h: 24.281 }, 2.6,
    [[0, 0.04], [10, -0.18], [21.18, -0.2], [30, 1.2], [36.92, 2.57], [46, 4.6], [58.18, 6.33], [71.8, 8.74]],
)
// Figma's "Rectangle 9": white cover that cuts the dog-ear corner off Say hello.
const SAY_HELLO_CORNER = (() => {
    const [a, b] = rotBoxPoints(
        { l: 475.48, t: 522.63, w: 24.448, h: 17.085 }, { w: 23.977, h: 16.388 }, 1.7,
        [[4.954, 13.021], [23.977, 0]],
    )
    const d: Pt = [b[0] - a[0], b[1] - a[1]]
    return { a: [a[0] - d[0] * 0.6, a[1] - d[1] * 0.6] as Pt, b: [b[0] + d[0] * 2, b[1] + d[1] * 2] as Pt }
})()

type TabSpec = {
    label: string
    cx: number
    cy: number
    color: string
    italic?: boolean
    href?: string
    ext?: boolean         // opens in a new tab
    left: number | null   // perforation index, null = paper edge
    right: number | null
    bottom?: "mobile" | "sayHello"
    tilt: number          // hover lean, deg
    spin: number          // rotation while floating away, deg
    drift: number         // sideways drift while floating away, px
    flutter: number       // flutter period, s
}

const TABS: TabSpec[] = [
    { label: "Redesign",         cx: 41.2,   cy: 419.83, color: "#FEEFF5", href: "/anthropologie-product-discovery", left: null, right: 0, tilt: -1.1, spin: -9,  drift: -40, flutter: 1.5 },
    { label: "Mobile Design",    cx: 117,    cy: 420.77, color: "#FFF1F7", href: "/ios-review-accessibility", left: 0, right: 1, bottom: "mobile", tilt: 0.8, spin: 7, drift: 30, flutter: 1.8 },
    { label: "Digital Strategy", cx: 189.21, cy: 421.64, color: "#FFF1F6", href: "/anthropologie-mcommerce", left: 1, right: 2, tilt: -0.6, spin: -12, drift: -55, flutter: 1.35 },
    { label: "Freelancing",      cx: 337.17, cy: 431.99, color: "#FFF6F9", italic: true, href: "/playground", left: 3, right: 4, tilt: 1.2, spin: 10, drift: 45, flutter: 1.7 },
    { label: "Say hello",        cx: 476.19, cy: 434.67, color: "#FFF1F6", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true, left: 5, right: null, bottom: "sayHello", tilt: -0.9, spin: -6, drift: -30, flutter: 1.55 },
]

// Clip polygons (stage coords) for one tab: the part above the curl hinge,
// the part below it, and the untransformed hit area.
function tabGeometry(tab: TabSpec) {
    const L = tab.left === null ? PAPER_LEFT : perfEdge(tab.left)
    const R = tab.right === null ? PAPER_RIGHT : perfEdge(tab.right)
    const tl = edgeTop(L)
    const tr = edgeTop(R)
    const topY = (tl[1] + tr[1]) / 2
    const hingeY = topY + 88
    const pivot: Pt = [(L(topY) + R(topY)) / 2, topY]
    const pad = 0.6 // overlap neighbours slightly so shared perforations show on both tabs
    const far = 620

    let bottom: Pt[]
    if (tab.bottom === "mobile") {
        const first = MOBILE_TORN_BOTTOM[0]
        const last = MOBILE_TORN_BOTTOM[MOBILE_TORN_BOTTOM.length - 1]
        bottom = [[R(last[1]) + pad, last[1]], ...[...MOBILE_TORN_BOTTOM].reverse(), [L(first[1]) - pad, first[1]]]
    } else if (tab.bottom === "sayHello") {
        const { a, b } = SAY_HELLO_CORNER
        bottom = [[R(b[1]), b[1]], b, a, [a[0], far], [L(far) - pad, far]]
    } else {
        bottom = [[R(far) + pad, far], [L(far) - pad, far]]
    }

    const top: Pt[] = [[tl[0] - pad, tl[1]], [tr[0] + pad, tr[1]]]
    const full: Pt[] = [...top, ...bottom]
    const upper: Pt[] = [...top, [R(hingeY) + pad, hingeY + 0.5], [L(hingeY) - pad, hingeY + 0.5]]
    const lower: Pt[] = [[L(hingeY) - pad, hingeY - 0.5], [R(hingeY) + pad, hingeY - 0.5], ...bottom]
    const hit: Pt[] = [tl, tr, ...bottom]

    return { pivot, hingeY, fullPts: full, full: clipPoly(full), upper: clipPoly(upper), lower: clipPoly(lower), hit: clipPoly(hit) }
}

// Crumple: the tab's outline (sampled to a fixed number of points) morphs into
// a jagged paper wad around the middle of the tab. Same point count and the
// same angular order on both shapes, so the clip-path interpolates cleanly.
const WAD_POINTS = 18
const WAD_R = 27
const WAD_JITTER = [1, 0.84, 1.08, 0.9, 1.12, 0.86, 1.02, 0.8, 1.06, 0.92, 1.1, 0.85, 1.04, 0.88, 1.09, 0.83, 1.01, 0.9]
function samplePerimeter(pts: Pt[], n: number): Pt[] {
    const segs = pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return { p, q, len: Math.hypot(q[0] - p[0], q[1] - p[1]) } })
    const total = segs.reduce((t, sg) => t + sg.len, 0)
    const out: Pt[] = []
    for (let k = 0; k < n; k++) {
        let d = (k / n) * total
        for (const sg of segs) {
            if (d <= sg.len) { const t = d / sg.len; out.push([sg.p[0] + (sg.q[0] - sg.p[0]) * t, sg.p[1] + (sg.q[1] - sg.p[1]) * t]); break }
            d -= sg.len
        }
    }
    return out
}
function wadGeometry(tab: TabSpec, g: ReturnType<typeof tabGeometry>) {
    const center: Pt = [g.pivot[0], g.pivot[1] + 96]
    const from = samplePerimeter(g.fullPts, WAD_POINTS)
    const to = from.map(([x, y], i): Pt => {
        const a = Math.atan2(y - center[1], x - center[0])
        const r = WAD_R * WAD_JITTER[i % WAD_JITTER.length]
        return [center[0] + Math.cos(a) * r, center[1] + Math.sin(a) * r]
    })
    return { center, from, to }
}

const TAB_GEOMETRY = TABS.map(tabGeometry)
const WAD_GEOMETRY = TABS.map((t, i) => wadGeometry(t, TAB_GEOMETRY[i]))

// Pink paper + crumpled texture, in stage coordinates.
function PaperFace() {
    return (
        <>
            <span style={{ ...rotBox({ l: 0, t: 3.16, w: 514.919, h: 536.236 }, { w: 498.775, h: 520.797 }, 1.8), display: "block", backgroundColor: FLYER_PINK }} />
            <span style={{ ...rotBox({ l: 0.64, t: 0, w: 517.35, h: 541.176 }, { w: 502.18, h: 526.734 }, 1.67), display: "block", opacity: 0.38, overflow: "hidden" }}>
                <img src="/hero-flyer/paper-texture.png" alt=""
                    style={{ position: "absolute", left: "-1.62%", top: "-20.7%", width: "103.15%", height: "141.73%", maxWidth: "none" }} />
            </span>
        </>
    )
}

function TabFace({ tab }: { tab: TabSpec }) {
    return (
        <>
            <PaperFace />
            {[tab.left, tab.right].map((i) => {
                if (i === null) return null
                const p = PERFS[i]
                return <img key={i} src={p.src} alt=""
                    style={{ ...rotBox({ l: p.l, t: p.t, w: 9.01, h: p.h }, { w: p.len, h: 0.902 }, p.deg), display: "block" }} />
            })}
            <span className="ft-label" style={{
                ...rotText(tab.cx, tab.cy, 92.31),
                fontSize: 15.458,
                fontWeight: 300,
                fontStyle: tab.italic ? "italic" : "normal",
                color: tab.color,
            }}>
                {tab.label}
            </span>
            {tab.bottom === "sayHello" && (
                // Dog-eared corner flap
                <img src="/hero-flyer/fold-a.svg" alt=""
                    style={{ position: "absolute", left: 475, top: 523.63, width: 24, height: 15, display: "block" }} />
            )}
        </>
    )
}

// Hover/focus: the tab peels up from the perforation, curls at a hinge and
// flutters. Click: a quick rip, then it floats up and away. --ft-amp is a
// registered property so the flutter can fade in/out instead of snapping.
const FLYER_TAB_STYLES = `
@property --ft-amp { syntax: "<number>"; inherits: true; initial-value: 0; }
.ft-tab {
    position: absolute; inset: 0; display: block;
    pointer-events: none; outline: none; text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    --ft-amp: 0;
    filter: drop-shadow(0 0 0 rgba(110, 18, 48, 0));
    transition: filter 360ms ${EASE_OUT}, --ft-amp 420ms ${EASE_OUT};
}
.ft-hit { position: absolute; inset: 0; display: block; pointer-events: auto; }
a.ft-tab .ft-hit { cursor: pointer; }
.ft-lift, .ft-hinge, .ft-flutter, .ft-piece { position: absolute; inset: 0; display: block; }
/* At rest a tab is one whole piece; it only splits at the curl hinge while live,
   so no seam shows on a resting tab. */
.ft-piece-upper { clip-path: var(--ft-clip-full); }
.ft-piece-lower { visibility: hidden; }
.ft-tab:is([data-live], [data-state]) .ft-piece-upper { clip-path: var(--ft-clip-upper); }
.ft-tab:is([data-live], [data-state]) .ft-piece-lower { visibility: visible; }
.ft-lift { transition: transform 440ms ${EASE_OUT}; }
.ft-hinge { transition: transform 560ms ${EASE_OUT}; }
/* Resting tabs carry no transforms at all (even identity 3D transforms leave a
   hairline where the two halves meet). data-live is set while a tab is being
   touched and for a moment afterwards, so it can settle before they're dropped. */
.ft-tab[data-live] .ft-lift { transform: perspective(650px) translate(0, 0) rotateX(0deg) rotateZ(0deg); }
.ft-tab[data-live] .ft-hinge { transform: perspective(500px) rotateX(0deg); }
.ft-tab[data-live] .ft-flutter {
    animation: ft-flutter var(--ft-period, 1.6s) ease-in-out infinite alternate;
    animation-play-state: paused;
}
@keyframes ft-flutter {
    from { transform: perspective(500px) rotateX(calc(var(--ft-amp) * -4deg)) skewX(calc(var(--ft-amp) * 0.5deg)); }
    to   { transform: perspective(500px) rotateX(calc(var(--ft-amp) * 5deg)) skewX(calc(var(--ft-amp) * -0.7deg)); }
}
.ft-tab:is(:hover, :focus-visible, :active) {
    z-index: 2;
    --ft-amp: 1;
    filter: drop-shadow(0 7px 5px rgba(110, 18, 48, 0.22));
}
.ft-tab[data-live]:is(:hover, :focus-visible, :active) .ft-lift {
    transform: perspective(650px) translate(0, -2px) rotateX(11deg) rotateZ(var(--ft-tilt));
}
.ft-tab[data-live]:is(:hover, :focus-visible, :active) .ft-hinge { transform: perspective(500px) rotateX(17deg); }
.ft-tab[data-live]:is(:hover, :focus-visible, :active) .ft-flutter { animation-play-state: running; }
.ft-tab:focus-visible .ft-label { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }

.ft-tab[data-state="ripping"] {
    z-index: 3;
    --ft-amp: 1.8;
    filter: drop-shadow(0 12px 9px rgba(110, 18, 48, 0.16));
}
/* On click the tab is swapped for its crumple wad (animated from JS). */
.ft-wad { position: absolute; inset: 0; display: none; pointer-events: none; }
.ft-crease { position: absolute; inset: 0; display: block; opacity: 0; }
.ft-tab[data-state="ripping"] .ft-lift { opacity: 0; } /* not visibility: the curl's lower half sets its own */
.ft-tab[data-state="ripping"] .ft-wad { display: block; }
.ft-tab[data-state="returning"] .ft-lift { animation: ft-return 480ms ${EASE_OUT}; }
@keyframes ft-return {
    from { opacity: 0; transform: perspective(650px) translate(0, 6px) rotateX(-8deg) rotateZ(0deg); }
    to   { opacity: 1; transform: perspective(650px) translate(0, 0) rotateX(0deg) rotateZ(0deg); }
}
.ft-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
    .ft-lift, .ft-hinge, .ft-flutter { transition: none !important; animation: none !important; transform: none !important; }
}
`

function Hero({
    phone,
    tablet,
    px,
    w,
}: {
    phone: boolean
    tablet: boolean
    px: number
    w: number
}) {
    const [revealed, setRevealed] = useState(false)
    const [ripping, setRipping] = useState<string | null>(null)
    const [returning, setReturning] = useState<string | null>(null)
    const timers = useRef<ReturnType<typeof setTimeout>[]>([])
    const reducedMotion = useReducedMotion()

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 80)
        return () => clearTimeout(t)
    }, [])

    // Put ripped tabs back when the visitor comes back (bfcache restore).
    useEffect(() => {
        const pending = timers.current
        const onPageShow = (e: PageTransitionEvent) => {
            if (!e.persisted) return
            pending.forEach(clearTimeout)
            pending.length = 0
            setRipping(null)
            setReturning(null)
        }
        window.addEventListener("pageshow", onPageShow)
        return () => {
            window.removeEventListener("pageshow", onPageShow)
            pending.forEach(clearTimeout)
        }
    }, [])

    // Mark a tab live while it's engaged, and keep it live briefly afterwards so
    // the lift and flutter can ease out before its transforms are removed.
    const settleTimers = useRef(new Map<Element, ReturnType<typeof setTimeout>>())
    const engage = (e: React.SyntheticEvent<HTMLElement>) => {
        const el = e.currentTarget
        clearTimeout(settleTimers.current.get(el))
        el.dataset.live = ""
    }
    const release = (e: React.SyntheticEvent<HTMLElement>) => {
        const el = e.currentTarget
        clearTimeout(settleTimers.current.get(el))
        settleTimers.current.set(el, setTimeout(() => {
            if (!el.matches(":hover, :focus-visible") && el.dataset.state !== "ripping") delete el.dataset.live
        }, 700))
    }
    const liveHandlers = {
        onPointerEnter: engage,
        onPointerLeave: release,
        onFocus: engage,
        onBlur: release,
        onTouchStart: engage,
        onTouchEnd: release,
    }

    const wadRefs = useRef<Record<string, HTMLSpanElement | null>>({})

    // Crumple the clicked tab into a paper wad, toss it up and away, then go.
    useEffect(() => {
        if (!ripping) return
        const i = TABS.findIndex((t) => t.label === ripping)
        const wad = wadRefs.current[ripping]
        if (i < 0 || !wad) return
        const tab = TABS[i]
        const { from, to } = WAD_GEOMETRY[i]
        const mix = (t: number) => clipPoly(from.map(([x, y], k): Pt => [x + (to[k][0] - x) * t, y + (to[k][1] - y) * t]))
        const wadAnim = wad.animate([
            { clipPath: mix(0), transform: "translate(0px, 0px) rotate(0deg)", easing: "cubic-bezier(0.4, 0, 0.7, 1)" },
            { clipPath: mix(0.16), transform: `translate(0px, 4px) rotate(${tab.tilt * -2.5}deg)`, offset: 0.12, easing: "cubic-bezier(0.3, 0.7, 0.4, 1)" },
            { clipPath: mix(1), transform: `translate(0px, -8px) rotate(${tab.spin * 2.5}deg)`, offset: 0.52, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" },
            { clipPath: mix(1), transform: `translate(${tab.drift * 0.12}px, -34px) rotate(${tab.spin * 3.5}deg)`, offset: 0.64, easing: "cubic-bezier(0.55, 0, 0.85, 0.45)" },
            { clipPath: mix(1), transform: `translate(${tab.drift * 1.4}px, -1050px) rotate(${tab.spin * 9}deg)` },
        ], { duration: 920, fill: "forwards" })
        const crease = wad.querySelector<HTMLElement>(".ft-crease")
        const creaseAnim = crease?.animate([{ opacity: 0 }, { opacity: 0, offset: 0.12 }, { opacity: 1, offset: 0.5 }, { opacity: 1 }], { duration: 920, fill: "forwards" })
        return () => { wadAnim.cancel(); creaseAnim?.cancel() }
    }, [ripping])

    const onTabClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: TabSpec) => {
        // Let modified clicks (new tab/window) and reduced motion go straight through.
        if (!tab.href || reducedMotion || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        if (ripping) return
        const href = tab.href
        const putBack = () => timers.current.push(setTimeout(() => {
            setRipping(null)
            setReturning(tab.label)
            timers.current.push(setTimeout(() => setReturning(null), 500))
        }, 1200))
        setReturning(null)
        setRipping(tab.label)
        timers.current.push(setTimeout(() => {
            if (tab.ext) {
                // New tab (still inside the click's activation window); this page
                // stays, so put the tab back afterwards.
                const win = window.open(href, "_blank")
                if (win) { win.opener = null; putBack() } else window.location.assign(href)
                return
            }
            window.location.assign(href)
            // mailto:/tel: leave us on the page too
            if (!/^https?:|^\//.test(href)) putBack()
        }, 780))
    }

    const scale = Math.min(1, (w - px * 2) / FLYER_W)
    const padTop = phone ? 12 : 16
    const padBottom = phone ? 32 : tablet ? 24 : 16

    return (
        <section
            style={{
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: C.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: padTop,
                paddingBottom: padBottom,
                overflow: "hidden",
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: FLYER_TAB_STYLES }} />
            {/* Outer box reserves the scaled footprint; inner stage keeps Figma coordinates */}
            <div
                style={{
                    width: FLYER_W * scale,
                    height: FLYER_H * scale,
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? "none" : "translateY(16px) rotate(-1deg)",
                    transition: reducedMotion
                        ? "none"
                        : `opacity 0.6s ${EASE_SPRING}, transform 0.8s ${EASE_SPRING}`,
                }}
            >
                <div
                    style={{
                        position: "relative",
                        width: FLYER_W,
                        height: FLYER_H,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    }}
                >
                    <div style={{ position: "absolute", left: 0, top: TAPE_OVERHANG, width: FLYER_W, height: FLYER_H - TAPE_OVERHANG }}>
                        {/* Poster body: the paper above the tear line (below it, only the tabs remain) */}
                        <span aria-hidden="true" style={{ ...FILL, clipPath: clipPoly([[-30, -60], [FLYER_W + 30, -60], [FLYER_W + 30, tearY(FLYER_W + 30) + 0.5], [-30, tearY(-30) + 0.5]]) }}>
                            <PaperFace />
                        </span>

                        {/* Tear line above the tabs */}
                        <img src="/hero-flyer/tear-line.svg" alt="" aria-hidden="true"
                            style={{ ...rotBox({ l: 7.05, t: 322.77, w: 497.271, h: 16.274 }, { w: 497.537, h: 0.902 }, 1.87), display: "block" }} />

                        <h1 style={{ ...rotText(263.2, 156, 2.74), fontFamily: "'Inter Flyer Italic', var(--font-inter), system-ui, sans-serif", fontStyle: "italic", fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", color: "#A3214A" /* deep rose */ }}>
                            Hi, I&rsquo;m Omisha!
                        </h1>

                        <p style={{ ...rotText(266, 72, 2.0), fontSize: 12.03, fontWeight: 500, color: "#FFFFFF" }}>
                            product designer . digital analyst . brand storyteller.
                        </p>

                        {/* Intro line: sits between the role line and "Take what you need:",
                            angled between their two rotations so it reads as part of the paper */}
                        <p style={{ ...rotText(261, 226, 2.4), width: 340, whiteSpace: "normal", textWrap: "balance", fontSize: 12.5, fontWeight: 400, lineHeight: 1.5, color: "#FFF1F6" }}>
                            Analytics-driven product designer creating intuitive, customer-centered digital experiences for <span style={{ whiteSpace: "nowrap" }}>consumer-facing</span> brands.
                        </p>

                        <p style={{ ...rotText(256.03, 306.98, 1.89), fontSize: 10.393, fontWeight: 700, color: "#FFE2ED" }}>
                            Take what you need:
                        </p>

                        {/* Ragged edges left behind by the two tabs already torn off */}
                        <img src="/hero-flyer/torn-edge-1.svg" alt="" aria-hidden="true"
                            style={{ ...rotBox({ l: 232, t: 328.63, w: 71.475, h: 12.567 }, { w: 71.375, h: 12.384 }, 0.87), display: "block" }} />
                        <img src="/hero-flyer/torn-edge-2.svg" alt="" aria-hidden="true"
                            style={{ ...rotBox({ l: 378.93, t: 325.77, w: 70.679, h: 13.136 }, { w: 70.728, h: 12.934 }, 179.1), display: "block" }} />

                        {TABS.map((tab, i) => {
                            const g = TAB_GEOMETRY[i]
                            const vars = {
                                "--ft-tilt": `${tab.tilt}deg`,
                                "--ft-spin": `${tab.spin}deg`,
                                "--ft-drift": `${tab.drift}px`,
                                "--ft-period": `${tab.flutter}s`,
                                "--ft-clip-full": g.full,
                                "--ft-clip-upper": g.upper,
                                "--ft-clip-lower": g.lower,
                            } as React.CSSProperties
                            const state = ripping === tab.label ? "ripping" : returning === tab.label ? "returning" : undefined
                            const body = (
                                <>
                                    <span className="ft-sr">{tab.label}</span>
                                    <span className="ft-lift" aria-hidden="true" style={{ transformOrigin: `${g.pivot[0]}px ${g.pivot[1]}px` }}>
                                        <span className="ft-piece ft-piece-upper"><TabFace tab={tab} /></span>
                                        <span className="ft-hinge" style={{ transformOrigin: `${g.pivot[0]}px ${g.hingeY}px` }}>
                                            <span className="ft-flutter" style={{ transformOrigin: `${g.pivot[0]}px ${g.hingeY}px` }}>
                                                <span className="ft-piece ft-piece-lower" style={{ clipPath: "var(--ft-clip-lower)" }}><TabFace tab={tab} /></span>
                                            </span>
                                        </span>
                                    </span>
                                    {/* Crumple wad: the same paper, clip-path morphed from the tab's outline to a ball */}
                                    <span className="ft-wad" aria-hidden="true" ref={(el) => { wadRefs.current[tab.label] = el }}
                                        style={{ clipPath: g.full, transformOrigin: `${WAD_GEOMETRY[i].center[0]}px ${WAD_GEOMETRY[i].center[1]}px` }}>
                                        <TabFace tab={tab} />
                                        {/* faceted shading so the wad reads as crumpled */}
                                        <span className="ft-crease" style={{
                                            background: `conic-gradient(from 20deg at ${WAD_GEOMETRY[i].center[0]}px ${WAD_GEOMETRY[i].center[1]}px, rgba(80,10,30,0.22), rgba(80,10,30,0) 10%, rgba(255,255,255,0.22) 18%, rgba(80,10,30,0) 27%, rgba(80,10,30,0.18) 40%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.2) 61%, rgba(80,10,30,0) 70%, rgba(80,10,30,0.24) 83%, rgba(255,255,255,0.1) 92%, rgba(80,10,30,0.22))`,
                                        }} />
                                    </span>
                                    {/* Untransformed hit area, so the tab stays easy to hover and click while it moves */}
                                    <span className="ft-hit" style={{ clipPath: g.hit }} />
                                </>
                            )
                            return tab.href ? (
                                <a key={tab.label} className="ft-tab" href={tab.href} data-state={state} style={vars}
                                    target={tab.ext ? "_blank" : undefined} rel={tab.ext ? "noreferrer" : undefined}
                                    onClick={(e) => onTabClick(e, tab)} {...liveHandlers}>
                                    {body}
                                </a>
                            ) : (
                                <span key={tab.label} className="ft-tab" style={vars} {...liveHandlers}>
                                    {body}
                                </span>
                            )
                        })}
                    </div>

                    {/* Clear tape */}
                    <div style={{ position: "absolute", left: 177, top: 0, width: 201.344, height: 76.329, overflow: "hidden", pointerEvents: "none" }}>
                        <img src="/hero-flyer/tape-clear.png" alt="" aria-hidden="true"
                            style={{ position: "absolute", left: "-149.32%", top: "-101.63%", width: "292.24%", height: "439.02%", maxWidth: "none" }} />
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: phone ? 32 : 56,
                    opacity: revealed ? 1 : 0,
                    transition: reducedMotion ? "none" : `opacity 0.5s ${EASE_OUT} 500ms`,
                }}
            >
                <span style={{ fontFamily: NAV_Z, fontSize: phone ? 13 : 14, color: C.ink2, whiteSpace: "nowrap" }}>
                    Interested? Learn more
                </span>
                <svg width="30" height="30" viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0, marginTop: 22 }}>
                    <path d="M 8 6 C 12 6, 40 14, 40 40" stroke="#E8B4C8" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M 33 32 L 40 42 L 47 32" stroke="#E8B4C8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
            </div>
        </section>
    )
}

function SectionLabel({
    tag,
    title,
    phone,
    tablet,
    large,
}: {
    tag: string
    title: string
    phone: boolean
    tablet: boolean
    large: boolean
}) {
    const titleSize = phone ? 26 : tablet ? 30 : large ? 44 : 36
    return (
        <div style={{ marginBottom: phone ? 28 : tablet ? 40 : 52 }}>
            <BracketTag style={{ marginBottom: 10 }}>{tag}</BracketTag>
            <h2
                style={{
                    fontFamily: I,
                    fontWeight: 200,
                    fontSize: titleSize,
                    color: C.ink,
                    margin: 0,
                    lineHeight: 1.08,
                    letterSpacing: "-0.02em",
                }}
            >
                <HoverLetters text={title} />
            </h2>
        </div>
    )
}

type CaseStudy = {
    href?: string          // leave empty until the case study page exists — the card renders unlinked
    image: string
    video?: string
    title: string
    tags: string[]
    company: string
    desc: string
    live?: boolean
    comingSoon?: boolean   // shows the "Currently building" badge on the cover
}

// Case study grid, in display order: 2 × 2 on tablet/desktop, one column on phone.
// The in-progress Aurevion case study sits last.
const CARDS: CaseStudy[] = [
    {
        href: "/anthropologie-product-discovery",
        image: "/case-studies/product-filter-cover.gif",
        title: "Product Filter Redesign",
        tags: ["Product Design", "Design Systems", "E-Commerce"],
        company: "URBN",
        desc: "Redesigning the filter experience across four retail brands, balancing discoverability with speed for millions of shoppers.",
        live: true,
    },
    {
        href: "/ios-review-accessibility",
        image: "/case-studies/ios-review-cover.png",
        title: "iOS Review Accessibility",
        tags: ["Research", "UX/UI", "iOS"],
        company: "URBN",
        desc: "Improving how shoppers read and trust customer reviews inside the iOS app.",
        live: true,
    },
    {
        href: "/anthropologie-mcommerce",
        image: "https://framerusercontent.com/images/vE5NBaasSteSM6lORQbcDZsAU.png",
        title: "Anthropologie M-Commerce",
        tags: ["A/B Testing", "Strategy", "iOS"],
        company: "URBN",
        desc: "Testing and refining the mobile shopping journey to lift conversion across the app.",
    },
    // ── Aurevion: add the case study URL to `href` and drop `comingSoon` when it goes live ──
    {
        href: "",                                     // TODO: case study URL, e.g. "/aurevion"
        image: "/case-studies/aurevion-cover.png",   // cover from Figma node 120:203
        title: "Aurevion Diagnostics",
        tags: ["Brand Identity", "Web Design"],
        company: "Aurevion",
        desc: "Built a visual identity and responsive website that helped an early-stage diagnostics company present its vision to investors.",
        comingSoon: true,                             // remove once the case study is live
    },
]

function CoverCard({
    href,
    image,
    video,
    title,
    tags,
    desc,
    live,
    comingSoon,
    titleSize,
    tilt = 0,
    phone,
}: CaseStudy & { titleSize: number; tilt?: number; phone?: boolean }) {
    const videoContainerRef = useRef<HTMLDivElement>(null)
    const [hov, setHov] = useState(false)
    const finePointer = useFinePointer()
    const reducedMotion = useReducedMotion()
    const linked = Boolean(href)
    const lifted = hov && linked

    useEffect(() => {
        if (!video || !videoContainerRef.current) return
        const v = document.createElement("video")
        v.src = video
        v.setAttribute("autoplay", "")
        v.setAttribute("loop", "")
        v.setAttribute("muted", "")
        v.setAttribute("playsinline", "")
        v.setAttribute("preload", "auto")
        v.muted = true
        v.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;"
        videoContainerRef.current.appendChild(v)
        v.play().catch(() => {})
        return () => { v.pause(); v.remove() }
    }, [video])

    // Every cover sits in the same 4:3 frame (the existing covers are ~4:3
    // already) and lifts off the page like a sheet of paper on hover/focus.
    const media = (
        <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 3",
            overflow: "hidden",
            backgroundColor: C.paper,
            transform: lifted && !reducedMotion ? `translateY(-5px) rotate(${tilt}deg)` : "none",
            boxShadow: lifted
                ? "0 18px 28px -18px rgba(17,17,17,0.28), 0 2px 6px rgba(17,17,17,0.06)"
                : "0 0 0 rgba(17,17,17,0), 0 0 0 rgba(17,17,17,0)",
            transition: `transform 0.5s ${EASE_OUT}, box-shadow 0.5s ${EASE_OUT}`,
        }}>
            {video ? (
                <div ref={videoContainerRef} style={{ width: "100%", height: "100%" }} />
            ) : (
                <NextImage
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 640px"
                    style={{ objectFit: "cover" }}
                />
            )}
            {comingSoon && (
                <span style={{
                    position: "absolute",
                    top: 0,
                    left: phone ? 12 : 15,
                    padding: phone ? "6px 10px" : "7px 11px",
                    backgroundColor: "rgba(0,0,0,0.61)",
                    borderRadius: "0 0 3.5px 3.5px",
                    fontFamily: I,
                    fontSize: phone ? 13 : 14.7,
                    lineHeight: 1.2,
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                }}>
                    Currently building
                </span>
            )}
        </div>
    )

    const caption = (
        <div style={{ marginTop: phone ? 14 : 18 }}>
            {live && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#6EBF8B", display: "inline-block" }} />
                    <span style={{ fontFamily: I, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#6EBF8B" }}>
                        Live
                    </span>
                </div>
            )}
            <div style={{
                fontFamily: I,
                fontWeight: 200,
                fontSize: titleSize,
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
                color: C.ink,
            }}>
                {title}
            </div>
            <p style={{
                fontFamily: I,
                fontSize: 12.5,
                lineHeight: 1.55,
                color: C.ink3,
                margin: "5px 0 0",
                maxWidth: 460,
            }}>
                {desc}
            </p>
            {tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, marginTop: 10 }}>
                    {tags.map((t, i) => (
                        <span key={i} style={{
                            fontFamily: I,
                            fontSize: 10,
                            color: C.muted,
                            backgroundColor: "rgba(0,0,0,0.04)",
                            borderRadius: 40,
                            padding: "3px 9px",
                        }}>
                            {t}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )

    if (!linked) {
        return <div>{media}{caption}</div>
    }

    return (
        <a
            href={href}
            className="card-link"
            style={{ textDecoration: "none", display: "block" }}
            onMouseEnter={() => finePointer && setHov(true)}
            onMouseLeave={() => setHov(false)}
            onFocus={() => setHov(true)}
            onBlur={() => setHov(false)}
        >
            {media}
            {caption}
        </a>
    )
}


function WorkSection({
    phone,
    tablet,
    large,
    px,
    maxW,
    sp,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
    sp: ReturnType<typeof useBP>["sp"]
}) {
    const cardTitleSize = phone ? 16 : tablet ? 17 : large ? 21 : 19
    const colGap = tablet ? 28 : large ? 56 : 40
    const rowGap = phone ? 44 : tablet ? 56 : large ? 80 : 68
    const sectionRef = useRef<HTMLElement>(null)
    const [cardsShown, setCardsShown] = useState(false)
    const [parallaxY, setParallaxY] = useState(0)
    const reducedMotion = useReducedMotion()

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setCardsShown(true); obs.disconnect() }
        }, { threshold: 0.05 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    // Cards rise to meet you as you scroll toward them, recede as you scroll past.
    useEffect(() => {
        if (reducedMotion) { setParallaxY(0); return }
        const onScroll = () => {
            const el = sectionRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const elMid = rect.top + rect.height / 2
            const vMid = window.innerHeight / 2
            const progress = (vMid - elMid) / window.innerHeight
            setParallaxY(Math.max(-90, Math.min(90, -progress * 170)))
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [reducedMotion])

    const reveal = (idx: number) => ({
        opacity: cardsShown ? 1 : 0,
        transform: cardsShown ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ${EASE_SPRING} ${idx * 100}ms, transform 0.6s ${EASE_SPRING} ${idx * 100}ms`,
    })

    return (
        <section
            ref={sectionRef}
            id="work"
            style={{
                position: "relative",
                width: "100%",
                padding: `0 ${px}px ${sp.sectionGap}px`,
                boxSizing: "border-box",
                backgroundColor: C.bg,
                overflow: "hidden",
            }}
        >
            <div style={{
                position: "relative",
                maxWidth: maxW,
                width: "100%",
                margin: "0 auto",
                transform: `translateY(${parallaxY}px)`,
                willChange: "transform",
            }}>
                <SectionLabel
                    tag="UX Strategy · Research · Digital Commerce"
                    title="inside my work"
                    phone={phone}
                    tablet={tablet}
                    large={large}
                />
                <div style={{
                    display: "grid",
                    gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                    columnGap: colGap,
                    rowGap,
                    alignItems: "start",
                }}>
                    {CARDS.map((card, i) => (
                        <div key={card.title} style={reveal(i)}>
                            {/* alternate the lift tilt so the grid feels hand-placed */}
                            <CoverCard {...card} titleSize={cardTitleSize} tilt={i % 2 ? 0.45 : -0.45} phone={phone} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const LOGOS = [
    { src: "/slides/anthro.png",    alt: "Anthropologie" },
    { src: "/slides/budweiser.png", alt: "Budweiser" },
    { src: "/slides/drexel.png",    alt: "Drexel University" },
    { src: "/slides/jnj.png",       alt: "Johnson & Johnson" },
    { src: "/slides/lakme.png",     alt: "Lakmé" },
    { src: "/slides/urbn.png",      alt: "URBN" },
]

function LogoTicker({
    phone,
    tablet,
    large,
    px,
    maxW,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
}) {
    const outerRef = useRef<HTMLDivElement>(null)
    const logoRefs = useRef<(HTMLDivElement | null)[]>([])
    const [tickerY, setTickerY] = useState(0)
    const [logoProgress, setLogoProgress] = useState<number[]>(() => LOGOS.map(() => 0))
    const reducedMotion = useReducedMotion()
    const navH = phone ? 54 : 64

    useEffect(() => {
        if (reducedMotion) { setTickerY(0); return }
        const onScroll = () => {
            const el = outerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const elMid = rect.top + rect.height / 2
            const vMid = window.innerHeight / 2
            const progress = (vMid - elMid) / window.innerHeight
            setTickerY(Math.max(-70, Math.min(70, progress * 240)))
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [reducedMotion])

    // Each logo fades and scales in as it scrolls toward the vertical center
    // of the viewport, then fades and scales back out as it continues past —
    // the same continuous, scroll-position-driven technique as the hero's
    // fade/scale, just mirrored on both sides instead of running one way, so
    // it plays as a scroll-in *and* scroll-out on every logo individually.
    useEffect(() => {
        if (reducedMotion) { setLogoProgress(LOGOS.map(() => 1)); return }
        const onScroll = () => {
            setLogoProgress(
                logoRefs.current.map((el) => {
                    if (!el) return 0
                    const rect = el.getBoundingClientRect()
                    const elMid = rect.top + rect.height / 2
                    const vMid = window.innerHeight / 2
                    const dist = Math.abs(elMid - vMid)
                    return Math.max(0, 1 - dist / (window.innerHeight * 0.55))
                })
            )
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll, { passive: true })
        onScroll()
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [reducedMotion])

    const logoScrollStyle = (idx: number) => ({
        opacity: logoProgress[idx] ?? 0,
        transform: `scale(${0.75 + (logoProgress[idx] ?? 0) * 0.25})`,
        willChange: "transform, opacity",
    })

    // Positions (top%, left%) matching Figma node 54:24's fixed layout: a
    // 2-3-2 grid — Anthropologie/J&J on top, Budweiser-title-Drexel in the
    // middle row, URBN/Lakmé on bottom. Percentages are relative to the
    // section's background rect (Figma y=63..672 of a 786-tall frame).
    // Order matches LOGOS: Anthropologie, Budweiser, Drexel, J&J, Lakmé, URBN.
    const SCATTER = [
        { top: "23%", left: "32%" },
        { top: "54%", left: "17%" },
        { top: "54%", left: "83%" },
        { top: "24%", left: "75%" },
        { top: "76%", left: "65%" },
        { top: "76%", left: "36%" },
    ]
    const logoH = phone ? 26 : tablet ? 32 : large ? 46 : 40
    // Lakmé and URBN read small next to the wordmarks around them — scale them up.
    const SIZE_MULT = [1, 1, 1, 1, 1.7, 1.7]

    return (
        <section
            ref={outerRef}
            style={{
                position: "relative",
                width: "100%",
                minHeight: `calc(100svh - ${navH}px)`,
                boxSizing: "border-box",
                backgroundColor: C.bg,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translateY(${tickerY}px)`,
                    willChange: "transform",
                }}
            >
                {phone ? (
                    // Scattering six logos across a phone-width viewport reads as
                    // clutter, not a composition — keep the simple centered cluster.
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: `calc(100% - ${px * 2}px)`,
                        }}
                    >
                        <SectionLabel tag="Application" title="Industry Experience" phone={phone} tablet={tablet} large={large} />
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                alignItems: "center",
                                columnGap: 28,
                                rowGap: 22,
                                width: "100%",
                                marginTop: 16,
                            }}
                        >
                            {LOGOS.map(({ src, alt }, i) => (
                                <div key={alt} ref={(el) => { logoRefs.current[i] = el }} style={logoScrollStyle(i)}>
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="logo-img"
                                        style={{
                                            height: logoH,
                                            width: "auto",
                                            display: "block",
                                            animation: reducedMotion
                                                ? "none"
                                                : `illust-float ${5.5 + (i % 3) * 0.6}s ease-in-out infinite ${i * 0.35}s`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ position: "absolute", top: "54%", left: "50%", transform: "translate(-50%, -50%)" }}>
                            <SectionLabel tag="Application" title="Industry Experience" phone={phone} tablet={tablet} large={large} />
                        </div>
                        {LOGOS.map(({ src, alt }, i) => (
                            // Positioning transform lives on this wrapper, not the img — the
                            // img's own transform gets overwritten each frame by the
                            // illust-float keyframes, which would otherwise fight the centering.
                            // The scroll-in/out fade+scale (no translate, so it doesn't fight
                            // either transform) lives on the middle wrapper, which is also what
                            // its own scroll position is measured from.
                            <div
                                key={alt}
                                style={{
                                    position: "absolute",
                                    top: SCATTER[i].top,
                                    left: SCATTER[i].left,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <div ref={(el) => { logoRefs.current[i] = el }} style={logoScrollStyle(i)}>
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="logo-img"
                                        style={{
                                            height: logoH * SIZE_MULT[i],
                                            width: "auto",
                                            display: "block",
                                            animation: reducedMotion
                                                ? "none"
                                                : `illust-float ${5.5 + (i % 3) * 0.6}s ease-in-out infinite ${i * 0.35}s`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

const SKILLS = [
    { num: "01", title: "Data Analytics & AI", sub: "Google Analytics · Excel · Confluence · LLMs · Prompt Engineering" },
    { num: "02", title: "User Experience Design", sub: "Research · UX/UI · Design Systems" },
    { num: "03", title: "Digital Marketing", sub: "Research · Strategy · A/B Testing" },
    { num: "04", title: "Branding & Content Creation", sub: "Brand kits · Photography · Video Content" },
]

function SkillRow({ num, title, sub, phone, tablet, revealDelay }: { num: string; title: string; sub: string; phone: boolean; tablet: boolean; revealDelay: number }) {
    const [hov, setHov] = useState(false)
    const [lineColor, setLineColor] = useState(C.ink)
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const isColumn = phone

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold: 0.15 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            onMouseEnter={() => {
                setHov(true)
                setLineColor(HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)])
            }}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: phone ? "14px 0" : "18px 0",
                borderBottom: `1px solid ${C.border}`,
                position: "relative",
                display: "flex",
                flexDirection: isColumn ? "column" : "row",
                alignItems: isColumn ? "flex-start" : "center",
                justifyContent: "space-between",
                gap: isColumn ? 5 : 0,
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ${EASE_OUT} ${revealDelay}ms`,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: I, fontSize: 10, color: C.muted, letterSpacing: "0.06em", width: 24, flexShrink: 0 }}>
                    {num}
                </span>
                <span
                    style={{
                        fontFamily: I,
                        fontSize: phone ? 13 : tablet ? 14 : 15,
                        fontWeight: 500,
                        color: hov ? C.ink : C.ink2,
                        transition: "color 0.2s",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {title}
                </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, paddingLeft: isColumn ? 40 : 0, justifyContent: isColumn ? "flex-start" : "flex-end" }}>
                {sub.split("·").map((s, i) => (
                    <span key={i} style={{ fontFamily: I, fontSize: phone ? 11 : 12, color: C.muted }}>
                        {i > 0 && <span style={{ margin: "0 5px", opacity: 0.3 }}>·</span>}
                        {s.trim()}
                    </span>
                ))}
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    width: hov ? "100%" : "0%",
                    backgroundColor: lineColor,
                    transition: "width 0.4s cubic-bezier(0.22,1,0.36,1), background-color 0.2s ease",
                }}
            />
        </div>
    )
}

function SkillsSection({
    phone,
    tablet,
    large,
    px,
    maxW,
    sp,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
    sp: ReturnType<typeof useBP>["sp"]
}) {
    const sectionPad = phone ? 64 : tablet ? 80 : large ? 120 : 100
    const sectionRef = useRef<HTMLElement>(null)
    const [skillsY, setSkillsY] = useState(0)
    const reducedMotion = useReducedMotion()

    // Same "rise to meet you, recede as you pass" parallax as Work/Brands,
    // so the skills block feels like it's on its own layer sliding up over
    // the section above rather than just appearing in place.
    useEffect(() => {
        if (reducedMotion) { setSkillsY(0); return }
        const onScroll = () => {
            const el = sectionRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const elMid = rect.top + rect.height / 2
            const vMid = window.innerHeight / 2
            const progress = (vMid - elMid) / window.innerHeight
            setSkillsY(Math.max(-90, Math.min(90, -progress * 170)))
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [reducedMotion])

    return (
        <section
            ref={sectionRef}
            style={{
                position: "relative",
                width: "100%",
                paddingTop: sectionPad,
                paddingBottom: phone ? 16 : 40,
                paddingLeft: px,
                paddingRight: px,
                boxSizing: "border-box",
                backgroundColor: C.bg,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "relative",
                    maxWidth: maxW,
                    width: "100%",
                    margin: "0 auto",
                    transform: `translateY(${skillsY}px)`,
                    willChange: "transform",
                }}
            >
                <SectionLabel tag="Skills" title="What I offer" phone={phone} tablet={tablet} large={large} />
                <div>
                    {SKILLS.map((s, i) => (
                        <SkillRow key={s.num} {...s} phone={phone} tablet={tablet} revealDelay={i * 80} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function Footer({
    phone,
    tablet,
    large,
    px,
    maxW,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
}) {
    const logoW = phone ? 75 : tablet ? 85 : 90
    const iconSize = phone ? 26 : 30
    return (
        <footer
            style={{
                width: "100%",
                padding: `${phone ? 24 : 32}px ${px}px`,
                boxSizing: "border-box",
                backgroundColor: C.bg,
            }}
        >
            <div
                style={{
                    maxWidth: maxW,
                    width: "100%",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: phone ? "flex-start" : "center",
                    flexDirection: phone ? "column" : "row",
                    justifyContent: "space-between",
                    gap: phone ? 20 : 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <img
                        src="https://framerusercontent.com/images/NdNFLxKwhpMzm0XHgjDRNkrRRg.png"
                        alt="OC"
                        style={{ width: logoW, objectFit: "contain", display: "block", flexShrink: 0 }}
                    />
                    <p style={{ fontFamily: I, fontSize: 12, color: C.muted, margin: 0, whiteSpace: "nowrap" as const }}>
                        © {new Date().getFullYear()} Omisha Chabria
                    </p>
                </div>
                <div style={{ display: "flex", gap: phone ? 18 : 22, alignItems: "center" }}>
                    {[
                        { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true, icon: "/icons/linkedin.png" },
                        { label: "Email", href: "mailto:omishachabria3@gmail.com", ext: false, icon: "/icons/mail.png" },
                    ].map(({ label, href, ext, icon }) => (
                        <a
                            key={label}
                            href={href}
                            target={ext ? "_blank" : "_self"}
                            rel="noreferrer"
                            aria-label={label}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <img
                                src={icon}
                                alt=""
                                aria-hidden="true"
                                className="footer-icon"
                                style={{ width: iconSize, height: iconSize, display: "block" }}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

const FOLDERS = [
    { id: "restaurants", label: "my eats",                     icon: "/explore/icon-eats.png" },
    { id: "travel",      label: "travels",                     icon: "/explore/icon-travel.png" },
    { id: "songs",       label: "my recent fav songs",         icon: "/explore/icon-music.png" },
    { id: "film",        label: "recent film photos",          icon: "/explore/icon-film.png" },
    { id: "moodboard",   label: "my moodboard (aka pinterest)", icon: "/explore/icon-moodboard.png" },
]

function Folder({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
    const [hov, setHov] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                width: 140,
            }}
        >
            <img
                src={icon}
                alt=""
                aria-hidden="true"
                style={{
                    width: 84,
                    height: "auto",
                    display: "block",
                    transform: hov ? "scale(1.08)" : "scale(1)",
                    transition: `transform 0.3s ${EASE_SPRING}`,
                }}
            />
            <span style={{
                fontFamily: I,
                fontSize: 12,
                fontWeight: 400,
                color: C.ink2,
                textAlign: "center",
                lineHeight: 1.4,
            }}>
                {label}
            </span>
        </button>
    )
}

// Horizontally scrollable strip of images, used by the "eats" and "film"
// folder contents — snaps per-card and hides the scrollbar (.hscroll, in
// CURSOR_STYLES) while staying native-scrollable for touch/trackpad.
function HScrollGallery({ images }: { images: { src: string; alt: string }[] }) {
    return (
        <div
            className="hscroll"
            style={{
                display: "flex",
                gap: 12,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                // scroll-padding tells the snap algorithm to treat this inset
                // as reserved space rather than scrollable slack — without it,
                // the mandatory snap resolves an initial scrollLeft that eats
                // the left padding entirely, leaving the first photo flush
                // with the card edge instead of aligned under the title.
                scrollPaddingLeft: 28,
                margin: "0 -28px",
                padding: "0 28px",
            }}
        >
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img.src}
                    alt={img.alt}
                    style={{
                        height: 260,
                        width: "auto",
                        flexShrink: 0,
                        borderRadius: 10,
                        objectFit: "cover",
                        scrollSnapAlign: "start",
                        display: "block",
                    }}
                />
            ))}
        </div>
    )
}

const FILM_PHOTOS = [1, 2, 3, 4, 5, 6].map((n) => ({ src: `/explore/film-${n}.jpg`, alt: `Film photo ${n}` }))

// Two stacked summary cards on the left (dining map + diner stats), the
// three city Top 10 guides scrolling on the right — matches Omisha's
// original mockup layout rather than one flat row of five.
function EatsGallery() {
    return (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 270, flexShrink: 0 }}>
                <img
                    src="/explore/beli-dining-map.png"
                    alt="Beli: Your Dining Map"
                    style={{ width: "100%", height: "auto", borderRadius: 10, objectFit: "cover", display: "block" }}
                />
                <img
                    src="/explore/beli-top-diner.png"
                    alt="Beli: Top 62% Diner"
                    style={{ width: "100%", height: "auto", borderRadius: 10, objectFit: "cover", display: "block" }}
                />
            </div>
            <div className="hscroll" style={{ display: "flex", gap: 10, overflowX: "auto", flex: "1 1 300px", minWidth: 0 }}>
                {[
                    { src: "/explore/beli-top10-mumbai.png", alt: "Beli: Top 10 Mumbai" },
                    { src: "/explore/beli-top10-philly.png", alt: "Beli: Top 10 Philadelphia" },
                    { src: "/explore/beli-top10-nyc.png",    alt: "Beli: Top 10 New York" },
                ].map((img) => (
                    <img
                        key={img.src}
                        src={img.src}
                        alt={img.alt}
                        style={{ height: 390, width: "auto", flexShrink: 0, borderRadius: 10, objectFit: "cover", display: "block" }}
                    />
                ))}
            </div>
        </div>
    )
}

const OLIVE = "#BDC762"

function KeychainIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="3.4" stroke={C.ink3} strokeWidth="1.3" />
            <path d="M8.4 8.4 15 15" stroke={C.ink3} strokeWidth="1.3" strokeLinecap="round" />
            <path d="M13 13l2.5-1 1 2.5-1.8 1.8-2.5-1z" stroke={C.ink3} strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
    )
}

function TravelDashboard() {
    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[
                    { value: "200+", label: "flights" },
                    { value: "7", label: "countries" },
                    { value: "PHL", label: "home base" },
                ].map((s) => (
                    <div
                        key={s.label}
                        style={{
                            flex: 1,
                            border: `1px solid ${C.border}`,
                            borderRadius: 10,
                            padding: "12px 8px",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontFamily: I, fontWeight: 700, fontSize: 20, color: OLIVE }}>{s.value}</div>
                        <div style={{ fontFamily: I, fontSize: 10, color: C.ink3, marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 12,
            }}>
                <img
                    src="/explore/tuktuk.png"
                    alt="Driving a tuk-tuk in Mumbai"
                    style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                />
                <div>
                    <div style={{ fontFamily: I, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.ink3, marginBottom: 4 }}>
                        favorite memory
                    </div>
                    <div style={{ fontFamily: I, fontSize: 14, color: C.ink }}>is driving a tuk-tuk in mumbai</div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <KeychainIcon />
                <span style={{ fontFamily: I, fontSize: 11, color: C.muted }}>
                    collecting keychains &amp; beli ratings
                </span>
            </div>
        </div>
    )
}


function PinterestButton() {
    const [hov, setHov] = useState(false)
    return (
        <a
            href="https://pin.it/Y5vM7o1m2"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "inline-block",
                fontFamily: I,
                fontSize: 13,
                fontWeight: 500,
                color: C.bg,
                backgroundColor: hov ? "#E60023" : C.ink,
                borderRadius: 40,
                padding: "10px 22px",
                textDecoration: "none",
                transition: "background-color 0.2s ease",
            }}
        >
            explore
        </a>
    )
}

function FolderModalContent({ id }: { id: string }) {
    if (id === "restaurants") return <EatsGallery />
    if (id === "film") return <HScrollGallery images={FILM_PHOTOS} />

    if (id === "songs") {
        // Spotify integration is pending API credentials — see prior
        // conversation. Placeholder until that's wired up.
        return <p style={{ fontFamily: I, fontSize: 13, color: C.muted, margin: 0 }}>Coming soon.</p>
    }

    if (id === "travel") return <TravelDashboard />

    if (id === "moodboard") {
        return (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
                <p style={{ fontFamily: I, fontWeight: 500, fontSize: 15, color: C.ink, margin: "0 0 4px" }}>
                    interested in my inspo?
                </p>
                <p style={{ fontFamily: I, fontSize: 14, color: C.ink2, margin: "0 0 20px" }}>
                    explore my pinterest page!
                </p>
                {/* TODO: swap in Omisha's real Pinterest URL */}
                <PinterestButton />
            </div>
        )
    }

    return null
}

function FolderModal({ folder, onClose }: { folder: (typeof FOLDERS)[0] | null; onClose: () => void }) {
    useEffect(() => {
        if (!folder) return
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        document.addEventListener("keydown", onKey)
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", onKey)
            document.body.style.overflow = ""
        }
    }, [folder, onClose])

    if (!folder) return null

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 300,
                backgroundColor: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    backgroundColor: C.bg,
                    borderRadius: 16,
                    width: "100%",
                    maxWidth: folder.id === "restaurants" ? 720 : 620,
                    maxHeight: "80vh",
                    overflow: "auto",
                    padding: "32px 28px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                }}
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 8,
                        fontSize: 18,
                        color: C.ink3,
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>
                <h3 style={{
                    fontFamily: I,
                    fontWeight: 500,
                    fontSize: 20,
                    color: C.ink,
                    margin: "0 24px 16px 0",
                }}>
                    {folder.label}
                </h3>
                <FolderModalContent id={folder.id} />
            </div>
        </div>
    )
}

function ExploreSection({
    phone,
    px,
    maxW,
}: {
    phone: boolean
    px: number
    maxW: number
}) {
    const [open, setOpen] = useState(false)
    const [shown, setShown] = useState(false)
    const [activeFolder, setActiveFolder] = useState<(typeof FOLDERS)[0] | null>(null)
    const reducedMotion = useReducedMotion()

    useEffect(() => {
        if (!open) { setShown(false); return }
        const t = setTimeout(() => setShown(true), 20)
        return () => clearTimeout(t)
    }, [open])

    return (
        <section
            style={{
                width: "100%",
                paddingTop: phone ? 12 : 32,
                paddingBottom: phone ? 48 : 72,
                paddingLeft: px,
                paddingRight: px,
                boxSizing: "border-box",
                backgroundColor: C.bg,
            }}
        >
            <div style={{ maxWidth: maxW, width: "100%", margin: "0 auto", textAlign: "center" }}>
                <button
                    onClick={() => setOpen((o) => !o)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <span style={{ fontFamily: I, fontSize: 14, color: C.ink2 }}>
                        want to learn more about Omisha?
                    </span>
                    <span style={{
                        fontFamily: I,
                        fontSize: 13,
                        fontWeight: 500,
                        color: C.ink,
                        textDecoration: "underline",
                        textUnderlineOffset: 3,
                    }}>
                        {open ? "done exploring" : "click to explore"}
                    </span>
                </button>

                {open && (
                    <div
                        style={{
                            marginTop: 56,
                            opacity: shown || reducedMotion ? 1 : 0,
                            transform: shown || reducedMotion ? "translateY(0)" : "translateY(16px)",
                            transition: `opacity 0.5s ${EASE_OUT}, transform 0.5s ${EASE_OUT}`,
                        }}
                    >
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap" as const,
                            justifyContent: "center",
                            gap: phone ? 28 : 40,
                        }}>
                            {FOLDERS.map((f) => (
                                <Folder
                                    key={f.id}
                                    label={f.label}
                                    icon={f.icon}
                                    onClick={() => setActiveFolder(f)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <FolderModal folder={activeFolder} onClose={() => setActiveFolder(null)} />
        </section>
    )
}

// ── Footer paper-toss game ──────────────────────────────────────────────────
// Write a thought, crumple it into the paper ball, then pull back and release
// to toss it into the can. Aiming and hit detection use the measured on-screen
// positions of the ball and can at throw time, so they follow any layout.
const GAME_PINK = COLORS.pink

// Transparent space under each asset, as a fraction of its height, so the
// visible paper/can sits on the floor line.
const PILE_FOOT = 79 / 1024
const BALL_FOOT = 71 / 1203
const CAN_FOOT = 91 / 1254
const BALL_ASPECT = 1203 / 1308
const BALL_R = 0.41 // visible radius, as a fraction of the ball box width

// Trash can geometry, as fractions of the (square) can image, measured from the art.
const CAN = {
    openL: 0.2, openR: 0.8,       // inside of the opening
    rimL: 0.167, rimR: 0.833,     // outer edge of the rim
    rimY: 0.205,                  // mid-line of the opening
    frontY: 0.25,                 // lowest point of the front rim's inner edge
    bodyL: 0.19, bodyR: 0.81,
}
// The can drawn again on top of the ball, minus the opening, so a ball that
// goes in drops behind the front rim.
const CAN_FRONT_CLIP = "polygon(0% 19.1%, 19.1% 19.4%, 20.7% 20.3%, 27.9% 22.6%, 35.9% 24.1%, 50% 25%, 63.8% 24.6%, 71.8% 23.1%, 78.9% 20.7%, 80.9% 19.5%, 100% 19.1%, 100% 100%, 0% 100%)"

type GamePhase = "writing" | "crumpling" | "ready" | "aiming" | "flying" | "scored" | "missed"
type Vec = { x: number; y: number }
type TossWorld = {
    W: number; floorY: number; r: number; g: number
    openL: number; openR: number; rimL: number; rimR: number; rimY: number; sinkY: number
    bodyL: number; bodyR: number; canCx: number
}
type TossState = { x: number; y: number; vx: number; vy: number; angle: number; inside: boolean; t: number; done: null | "scored" | "missed" }

const TOSS_DT = 1 / 120

// One fixed physics step. Shared by the animated throw and the reduced-motion
// instant throw so both land the same way.
function tossStep(s: TossState, w: TossWorld) {
    const prevY = s.y
    s.t += TOSS_DT
    s.vy += w.g * TOSS_DT
    s.x += s.vx * TOSS_DT
    s.y += s.vy * TOSS_DT
    s.angle += (s.vx * TOSS_DT * 180) / (Math.PI * w.r)

    if (s.inside) {
        s.x = Math.min(Math.max(s.x, w.openL + w.r * 0.2), w.openR - w.r * 0.2)
        if (s.y >= w.sinkY) { s.y = w.sinkY; s.done = "scored" }
        return
    }

    // Crossing the opening on the way down
    if (prevY < w.rimY && s.y >= w.rimY && s.vy > 0) {
        if (s.x > w.openL + w.r * 0.35 && s.x < w.openR - w.r * 0.35) {
            s.inside = true
            s.vx *= 0.25
            return
        }
        if (s.x > w.rimL - w.r * 0.6 && s.x < w.rimR + w.r * 0.6) {
            // Clipped the rim: pop up and away from the can
            s.y = w.rimY - 0.5
            s.vy = -Math.abs(s.vy) * 0.35
            s.vx = (s.x < w.canCx ? -1 : 1) * Math.max(Math.abs(s.vx) * 0.5, 70)
        }
    }
    // Side of the can
    if (s.y > w.rimY && s.x + w.r > w.bodyL && s.x - w.r < w.bodyR) {
        if (s.x < w.canCx) { s.x = w.bodyL - w.r; s.vx = -Math.abs(s.vx) * 0.3 }
        else { s.x = w.bodyR + w.r; s.vx = Math.abs(s.vx) * 0.3 }
    }
    // Edges of the play area
    if (s.x < w.r) { s.x = w.r; s.vx = Math.abs(s.vx) * 0.4 }
    if (s.x > w.W - w.r) { s.x = w.W - w.r; s.vx = -Math.abs(s.vx) * 0.4 }
    // Floor: a low bounce, then roll to a stop
    if (s.y >= w.floorY) {
        s.y = w.floorY
        if (s.vy > 140) { s.vy = -s.vy * 0.32; s.vx *= 0.7 }
        else { s.vy = 0; s.vx *= 1 - 3.2 * TOSS_DT }
        if (s.vy === 0 && Math.abs(s.vx) < 8) s.done = "missed"
    }
    if (s.t > 6) s.done = "missed"
}

const shortThought = (t: string) => (t.length > 34 ? `${t.slice(0, 32).trimEnd()}…` : t)

const GAME_STYLES = `
.toss-btn {
    font-family: ${I};
    font-size: 12.5px;
    line-height: 1;
    padding: 9px 15px;
    border-radius: 999px;
    border: 1px solid rgba(17,17,17,0.18);
    background: transparent;
    color: ${C.ink};
    cursor: pointer;
    transition: background-color 0.2s ${EASE_OUT}, border-color 0.2s ${EASE_OUT}, transform 0.15s ${EASE_OUT};
    -webkit-tap-highlight-color: transparent;
}
.toss-btn:hover { background: rgba(17,17,17,0.04); border-color: rgba(17,17,17,0.3); }
.toss-btn:active { transform: translateY(1px); }
.toss-btn--primary { background: ${GAME_PINK}; border-color: ${GAME_PINK}; color: #FFFFFF; }
.toss-btn--primary:hover { background: #BE2B55; border-color: #BE2B55; }
.toss-btn:focus-visible, .toss-input:focus-visible { outline: 1.5px dashed ${GAME_PINK}; outline-offset: 3px; }
.toss-input::placeholder { color: ${C.muted}; }
.toss-ball { cursor: grab; touch-action: none; }
.toss-ball[data-dragging] { cursor: grabbing; }
@media (prefers-reduced-motion: reduce) {
    .toss-btn { transition: none; }
    .toss-btn:active { transform: none; }
}
`

function FooterGame({
    phone,
    tablet,
    px,
    maxW,
    footer,
}: {
    phone: boolean
    tablet: boolean
    px: number
    maxW: number
    footer: React.ReactNode
}) {
    const [phase, setPhase] = useState<GamePhase>("writing")
    const [thought, setThought] = useState("")
    const [aim, setAim] = useState<{ from: Vec; pull: Vec; dots: Vec[] } | null>(null)
    const reducedMotion = useReducedMotion()

    const areaRef = useRef<HTMLDivElement>(null)
    const ballRef = useRef<HTMLDivElement>(null)
    const canRef = useRef<HTMLDivElement>(null)
    const noteRef = useRef<HTMLFormElement>(null)
    const actionRef = useRef<HTMLButtonElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const focusInputNext = useRef(false)
    const drag = useRef<{ id: number; rest: Vec; world: TossWorld; power: number; maxPull: number; pull: Vec } | null>(null)
    const raf = useRef(0)
    const sectionRef = useRef<HTMLElement>(null)

    // ── Hidden-level reveal ──
    // The footer reads as the end of the page; scrolling on opens into this
    // section. p runs from the section's top entering the viewport (0) to its
    // bottom reaching the viewport bottom, i.e. the end of the page (1).
    const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ["start end", "end end"] })
    // Function-form transforms keep these on framer's JS scroll tracking; the
    // array form lets framer hand opacity to a native scroll timeline, which
    // left the stage stuck invisible in testing.
    const range = (a: number, b: number, from: number, to: number) =>
        (v: number) => from + (to - from) * Math.min(1, Math.max(0, (v - a) / (b - a)))
    // Footer recedes: tips back a touch, shrinks and fades as it scrolls away.
    // (kept gentle: the footer row stays in view above the game)
    const footerY = useTransform(p, range(0, 0.6, 0, -10))
    const footerScale = useTransform(p, range(0, 0.6, 1, 0.985))
    const footerTilt = useTransform(p, range(0, 0.6, 0, -3))
    const footerOpacity = useTransform(p, range(0, 0.6, 1, 0.85))
    // A soft shadow where the page "opens", strongest mid-reveal.
    const seamOpacity = useTransform(p, (v) => (v < 0.3 ? range(0, 0.3, 0, 1)(v) : range(0.3, 0.85, 1, 0)(v)))
    // Game comes forward from below and settles flat; identity from p = 0.88.
    const stageZ = useTransform(p, range(0.1, 0.88, -220, 0))
    const stageY = useTransform(p, range(0.1, 0.88, 90, 0))
    const stageTilt = useTransform(p, range(0.1, 0.88, 16, 0))
    const stageOpacity = useTransform(p, range(0.05, 0.6, 0, 1))
    const fadeIn = useTransform(p, range(0.2, 0.8, 0, 1)) // reduced motion: fade only

    // Playable only once the reveal has fully settled, so a throw is never
    // measured against a moving stage and scrolling past can't grab the ball.
    const [playable, setPlayable] = useState(false)
    const playableRef = useRef(false)
    const updatePlayable = (v: number) => {
        const next = v >= 0.96
        if (next === playableRef.current) return
        playableRef.current = next
        setPlayable(next)
        if (!next && drag.current) {
            drag.current = null
            setAim(null)
            setBall(0, 0)
            setPhase("ready")
        }
    }
    useMotionValueEvent(p, "change", updatePlayable)
    useEffect(() => { updatePlayable(p.get()) }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const playH = phone ? 260 : tablet ? 320 : 360
    const pileW = phone ? 120 : tablet ? 170 : 200
    const ballS = phone ? 44 : tablet ? 56 : 62
    const canW = phone ? 108 : tablet ? 140 : 160
    const noteW = phone ? 236 : 240

    // Measure the world from the live layout (relative to the play area).
    const measure = (): { world: TossWorld; rest: Vec } | null => {
        const area = areaRef.current, ball = ballRef.current, can = canRef.current
        if (!area || !ball || !can) return null
        const a = area.getBoundingClientRect()
        const b = ball.getBoundingClientRect()
        const c = can.getBoundingClientRect()
        const rest = { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height * 0.511 }
        const cx = (f: number) => c.left - a.left + c.width * f
        const cy = (f: number) => c.top - a.top + c.height * f
        const r = b.width * BALL_R
        return {
            rest,
            world: {
                W: a.width, floorY: rest.y, r, g: playH * 5.5,
                openL: cx(CAN.openL), openR: cx(CAN.openR), rimL: cx(CAN.rimL), rimR: cx(CAN.rimR),
                rimY: cy(CAN.rimY), sinkY: cy(CAN.frontY) + r * 1.15,
                bodyL: cx(CAN.bodyL), bodyR: cx(CAN.bodyR), canCx: cx(0.5),
            },
        }
    }

    const setBall = (dx: number, dy: number, angle = 0, inside = false) => {
        const el = ballRef.current
        if (!el) return
        el.style.transform = dx || dy || angle ? `translate(${dx}px, ${dy}px) rotate(${angle}deg)` : ""
        el.style.zIndex = inside ? "2" : "4"
    }

    const resetBall = () => {
        cancelAnimationFrame(raf.current)
        setBall(0, 0)
        if (ballRef.current) ballRef.current.style.visibility = ""
    }

    useEffect(() => () => cancelAnimationFrame(raf.current), [])

    // If the layout changes while the ball is resting somewhere, put it back in
    // its spot (positions are re-measured at the next throw anyway).
    useEffect(() => {
        const area = areaRef.current
        if (!area) return
        let lastW = area.getBoundingClientRect().width
        const ro = new ResizeObserver(([e]) => {
            if (Math.abs(e.contentRect.width - lastW) < 1) return
            lastW = e.contentRect.width
            if (phase === "missed" || phase === "ready") setBall(0, 0)
        })
        ro.observe(area)
        return () => ro.disconnect()
    }, [phase])

    // Keep keyboard focus somewhere sensible as the controls change.
    useEffect(() => {
        if (phase === "ready" || phase === "scored" || phase === "missed") actionRef.current?.focus({ preventScroll: true })
        if (phase === "writing" && focusInputNext.current) {
            focusInputNext.current = false
            inputRef.current?.focus({ preventScroll: true })
        }
    }, [phase])

    const throwBall = (world: TossWorld, start: Vec, rest: Vec, v: Vec) => {
        const s: TossState = { x: start.x, y: start.y, vx: v.x, vy: v.y, angle: 0, inside: false, t: 0, done: null }
        const finish = (outcome: "scored" | "missed") => {
            setBall(s.x - rest.x, s.y - rest.y, s.angle, s.inside)
            if (outcome === "scored" && ballRef.current) ballRef.current.style.visibility = "hidden"
            setPhase(outcome)
        }
        if (reducedMotion) {
            while (!s.done) tossStep(s, world)
            finish(s.done)
            return
        }
        setPhase("flying")
        let last = performance.now()
        let acc = 0
        const frame = (now: number) => {
            acc += Math.min(0.05, (now - last) / 1000)
            last = now
            while (acc >= TOSS_DT && !s.done) { tossStep(s, world); acc -= TOSS_DT }
            setBall(s.x - rest.x, s.y - rest.y, s.angle, s.inside)
            if (s.done) { finish(s.done); return }
            raf.current = requestAnimationFrame(frame)
        }
        raf.current = requestAnimationFrame(frame)
    }

    // ── Crumple ──
    const crumple = (e: React.FormEvent) => {
        e.preventDefault()
        if (phase !== "writing" || !playableRef.current) return
        const note = noteRef.current, ball = ballRef.current
        if (reducedMotion || !note || !ball) { setPhase("ready"); return }
        setPhase("crumpling")
        const n = note.getBoundingClientRect()
        const b = ball.getBoundingClientRect()
        const dx = b.left + b.width / 2 - (n.left + n.width / 2)
        const dy = b.top + b.height / 2 - (n.top + n.height / 2)
        note.animate([
            { transform: "rotate(-1.2deg)", borderRadius: "2px", opacity: 1 },
            { transform: "rotate(3deg) scale(0.8, 0.66)", borderRadius: "22%", opacity: 1, offset: 0.35 },
            { transform: `translate(${dx}px, ${dy}px) rotate(-32deg) scale(0.14)`, borderRadius: "50%", opacity: 0 },
        ], { duration: 560, easing: "cubic-bezier(0.5, 0, 0.75, 0.4)", fill: "forwards" })
        ball.animate([
            { opacity: 0, transform: "scale(0.45) rotate(-50deg)" },
            { opacity: 1, transform: "scale(1) rotate(0deg)" },
        ], { duration: 300, delay: 400, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" })
            .finished.then(() => setPhase("ready")).catch(() => setPhase("ready"))
    }

    // ── Pull back and release ──
    const predict = (world: TossWorld, start: Vec, v: Vec) => {
        const s: TossState = { x: start.x, y: start.y, vx: v.x, vy: v.y, angle: 0, inside: false, t: 0, done: null }
        const dots: Vec[] = []
        for (let i = 1; i <= 42 && !s.done; i++) {
            tossStep(s, world)
            if (i % 6 === 0) dots.push({ x: s.x, y: s.y })
        }
        return dots
    }

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (phase !== "ready" || !e.isPrimary || !playableRef.current) return
        const m = measure()
        if (!m) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        e.currentTarget.dataset.dragging = ""
        const maxPull = Math.min(120, playH * 0.44)
        // Scale launch power to the real distance, so a full pull can clear the can.
        const reach = Math.max(120, (m.world.canCx - m.rest.x) * 1.9)
        const power = Math.sqrt(reach * m.world.g) / maxPull
        drag.current = { id: e.pointerId, rest: m.rest, world: m.world, power, maxPull, pull: { x: 0, y: 0 } }
        setPhase("aiming")
    }

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const d = drag.current
        if (!d || e.pointerId !== d.id) return
        const a = areaRef.current!.getBoundingClientRect()
        const p = { x: e.clientX - a.left, y: e.clientY - a.top }
        let px_ = d.rest.x - p.x
        let py = d.rest.y - p.y
        const len = Math.hypot(px_, py)
        if (len > d.maxPull) { px_ *= d.maxPull / len; py *= d.maxPull / len }
        d.pull = { x: px_, y: py }
        // The ball gives a little toward your finger (never below the floor).
        const off = { x: -px_ * 0.22, y: Math.min(0, -py * 0.22) }
        setBall(off.x, off.y)
        const start = { x: d.rest.x + off.x, y: d.rest.y + off.y }
        setAim({ from: start, pull: { x: start.x - px_ * 0.6, y: start.y - py * 0.6 }, dots: len > 12 ? predict(d.world, start, { x: px_ * d.power, y: py * d.power }) : [] })
    }

    const endDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
        const d = drag.current
        if (!d || e.pointerId !== d.id) return
        drag.current = null
        delete e.currentTarget.dataset.dragging
        setAim(null)
        // Only a real pull (back and down, launching up toward the can) throws;
        // a stray swipe or scroll-like gesture on the ball just puts it back.
        if (cancelled || Math.hypot(d.pull.x, d.pull.y) < 16 || d.pull.x < 8 || d.pull.y > -4) { setBall(0, 0); setPhase("ready"); return }
        const off = { x: -d.pull.x * 0.22, y: Math.min(0, -d.pull.y * 0.22) }
        throwBall(d.world, { x: d.rest.x + off.x, y: d.rest.y + off.y }, d.rest, { x: d.pull.x * d.power, y: d.pull.y * d.power })
    }

    // ── Keyboard / no-drag throw: a clean shot at the can ──
    const autoToss = () => {
        if (phase !== "ready" || !playableRef.current) return
        const m = measure()
        if (!m) return
        const { world, rest } = m
        const target = { x: world.canCx, y: world.rimY - 1 }
        const T = Math.min(1, Math.max(0.6, 0.55 + (target.x - rest.x) / 1400))
        throwBall(world, rest, rest, {
            x: (target.x - rest.x) / T,
            y: (target.y - rest.y - 0.5 * world.g * T * T) / T,
        })
    }

    const tryAgain = () => { resetBall(); setPhase("ready") }
    const writeAnother = () => { resetBall(); setThought(""); focusInputNext.current = true; setPhase("writing") }

    const t = shortThought(thought.trim())
    const status: { text: string; sub?: string; action?: { label: string; onClick: () => void } } | null =
        phase === "ready" ? { text: "Pull the ball back, aim, and let go.", action: { label: "Toss it for me", onClick: autoToss } }
        : phase === "aiming" ? { text: "Aim for the can, then let go." }
        : phase === "flying" ? { text: " " }
        : phase === "scored" ? { text: t ? `“${t}”, binned.` : "Nothing but bin.", sub: "Feel lighter?", action: { label: "Write another", onClick: writeAnother } }
        : phase === "missed" ? { text: "So close.", action: { label: "Try again", onClick: tryAgain } }
        : null

    const pileH = pileW * (1024 / 1536)
    const ballH = ballS * BALL_ASPECT

    return (
        <>
        <motion.div
            style={reducedMotion
                ? { width: "100%" }
                : { width: "100%", y: footerY, scale: footerScale, rotateX: footerTilt, opacity: footerOpacity, transformPerspective: 900, transformOrigin: "50% 0%" }}
        >
            {footer}
        </motion.div>
        <section
            ref={sectionRef}
            aria-labelledby="toss-heading"
            style={{
                position: "relative",
                width: "100%",
                minHeight: phone ? "80svh" : "85svh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: C.bg,
                padding: `${phone ? 32 : 48}px ${px}px ${phone ? 40 : 64}px`,
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: GAME_STYLES }} />
            {!reducedMotion && (
                <motion.div aria-hidden="true" style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 96, pointerEvents: "none",
                    background: "linear-gradient(to bottom, rgba(17,17,17,0.07), rgba(17,17,17,0))",
                    opacity: seamOpacity,
                }} />
            )}
            <motion.div
                style={reducedMotion
                    ? { width: "100%", opacity: fadeIn }
                    : { width: "100%", z: stageZ, y: stageY, rotateX: stageTilt, opacity: stageOpacity, transformPerspective: 1100, transformOrigin: "50% 100%" }}
            >
            <div style={{ maxWidth: Math.min(maxW, 880), width: "100%", margin: "0 auto" }}>
                <div>
                <BracketTag style={{ marginBottom: 8 }}>before you go</BracketTag>
                <h2 id="toss-heading" style={{ fontFamily: I, fontWeight: 200, fontSize: phone ? 24 : 30, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.ink, margin: 0 }}>
                    clear your head
                </h2>
                <p style={{ fontFamily: I, fontSize: 13, lineHeight: 1.55, color: C.ink3, margin: "8px 0 0", maxWidth: 420 }}>
                    Write down what&rsquo;s on your mind, crumple it, then pull the ball back and let go to toss it in the can.
                </p>
                </div>

                <div>
                <div
                    ref={areaRef}
                    role="group"
                    aria-label="Paper toss"
                    style={{ position: "relative", height: playH, marginTop: phone ? 24 : 36, borderBottom: "1px solid rgba(17,17,17,0.08)", pointerEvents: playable ? "auto" : "none" }}
                >
                    {/* Decorative pile */}
                    <NextImage src="/footer-game/paper-pile.png" alt="" aria-hidden="true" draggable={false}
                        width={1536} height={1024} sizes={`${pileW}px`}
                        style={{ position: "absolute", left: phone ? -10 : -16, bottom: -pileH * PILE_FOOT, width: pileW, height: pileH, zIndex: 1, userSelect: "none" }} />

                    {/* Can: back layer, then (after the ball) the front rim/body */}
                    <div ref={canRef} aria-hidden="true"
                        style={{ position: "absolute", right: phone ? 0 : "4%", bottom: -canW * CAN_FOOT, width: canW, height: canW, zIndex: 1 }}>
                        <NextImage src="/footer-game/trash-can.png" alt="" draggable={false} width={1254} height={1254} sizes={`${canW}px`} style={{ width: "100%", height: "100%", display: "block", userSelect: "none" }} />
                    </div>

                    {/* The one interactive ball */}
                    <div
                        ref={ballRef}
                        className="toss-ball"
                        aria-hidden="true"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={(e) => endDrag(e, false)}
                        onPointerCancel={(e) => endDrag(e, true)}
                        style={{
                            position: "absolute",
                            left: pileW * (phone ? 0.84 : 0.86),
                            bottom: -ballH * BALL_FOOT,
                            width: ballS,
                            height: ballH,
                            zIndex: 4,
                            visibility: phase === "writing" ? "hidden" : "visible",
                            willChange: "transform",
                        }}
                    >
                        {/* larger, invisible grab area */}
                        <span style={{ position: "absolute", inset: -16, borderRadius: "50%" }} />
                        <NextImage src="/footer-game/paper-ball.png" alt="" draggable={false}
                            width={1308} height={1203} sizes={`${ballS}px`}
                            style={{ position: "relative", width: "100%", height: "100%", display: "block", userSelect: "none", pointerEvents: "none" }} />
                    </div>

                    <div aria-hidden="true"
                        style={{ position: "absolute", right: phone ? 0 : "4%", bottom: -canW * CAN_FOOT, width: canW, height: canW, zIndex: 3, clipPath: CAN_FRONT_CLIP, pointerEvents: "none" }}>
                        <NextImage src="/footer-game/trash-can.png" alt="" draggable={false} width={1254} height={1254} sizes={`${canW}px`} style={{ width: "100%", height: "100%", display: "block" }} />
                    </div>

                    {/* Aiming cue */}
                    {aim && (
                        <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 5 }}>
                            <line x1={aim.from.x} y1={aim.from.y} x2={aim.pull.x} y2={aim.pull.y}
                                stroke="rgba(17,17,17,0.28)" strokeWidth={1.2} strokeDasharray="3 4" strokeLinecap="round" />
                            {aim.dots.map((d, i) => (
                                <circle key={i} cx={d.x} cy={d.y} r={Math.max(1.4, 3 - i * 0.25)} fill={GAME_PINK} opacity={0.55 - i * 0.06} />
                            ))}
                        </svg>
                    )}

                    {/* Note */}
                    {(phase === "writing" || phase === "crumpling") && (
                        <form
                            ref={noteRef}
                            onSubmit={crumple}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: phone ? 0 : 8,
                                width: noteW,
                                maxWidth: "100%",
                                boxSizing: "border-box",
                                padding: "14px 14px 12px",
                                backgroundColor: "#FFFDF8",
                                borderRadius: 2,
                                boxShadow: "0 10px 22px -14px rgba(60,40,20,0.35), 0 1px 2px rgba(60,40,20,0.08)",
                                transform: "rotate(-1.2deg)",
                                zIndex: 6,
                            }}
                        >
                            <label htmlFor="toss-thought" style={{ display: "block", fontFamily: NAV_Z, fontSize: phone ? 15 : 16, color: C.ink }}>
                                Something on your mind?
                            </label>
                            <input
                                id="toss-thought"
                                ref={inputRef}
                                className="toss-input"
                                value={thought}
                                onChange={(e) => setThought(e.target.value)}
                                maxLength={60}
                                autoComplete="off"
                                placeholder="a worry, a to-do, a bad idea…"
                                disabled={phase !== "writing"}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    margin: "8px 0 12px",
                                    padding: "6px 0",
                                    border: "none",
                                    borderBottom: "1px dashed rgba(17,17,17,0.25)",
                                    background: "transparent",
                                    fontFamily: I,
                                    fontWeight: 300,
                                    fontSize: 14,
                                    color: C.ink,
                                    outline: "none",
                                }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <button type="submit" className="toss-btn toss-btn--primary" disabled={phase !== "writing"}>Crumple it</button>
                            </div>
                        </form>
                    )}

                    {/* Status + actions */}
                    <div
                        aria-live="polite"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 10,
                            textAlign: "center",
                            zIndex: 6,
                            pointerEvents: "none",
                            visibility: status ? "visible" : "hidden",
                            // globals.css gives everything a 0.01ms transition under reduced
                            // motion, which would keep this hidden for a frame and swallow focus
                            transition: "none",
                        }}
                    >
                        {status && (
                            <>
                                <p style={{ margin: 0, fontFamily: NAV_Z, fontSize: phone ? 16 : 18, color: C.ink, minHeight: "1.2em" }}>
                                    {status.text}
                                    {status.sub && <span style={{ display: "block", fontFamily: I, fontSize: 12.5, color: C.ink3, marginTop: 4 }}>{status.sub}</span>}
                                </p>
                                {status.action && (
                                    <button ref={actionRef} type="button" className="toss-btn" onClick={status.action.onClick} style={{ pointerEvents: "auto" }}>
                                        {status.action.label}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                </div>
            </div>
            </motion.div>
        </section>
        </>
    )
}

// "want to learn more about Omisha?" section is hidden for now; the code is
// kept (ExploreSection, FOLDERS, etc.) — flip to true to bring it back.
const SHOW_EXPLORE = false

export default function ResponsiveHome() {
    const { ref, w, phone, tablet, desktop, large, px, maxW, sp } = useBP()

    return (
        <>
            <div
                ref={ref}
                style={{
                    width: "100%",
                    backgroundColor: C.bg,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <style dangerouslySetInnerHTML={{ __html: CURSOR_STYLES }} />
                <HomeNav phone={phone} tablet={tablet} large={large} px={px} />
                <Hero phone={phone} tablet={tablet} px={px} w={w} />
                <WorkSection phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <LogoTicker phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} />
                <SkillsSection phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                {SHOW_EXPLORE && <ExploreSection phone={phone} px={px} maxW={maxW} />}
                <FooterGame phone={phone} tablet={tablet} px={px} maxW={maxW}
                    footer={<Footer phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} />} />
            </div>
        </>
    )
}
