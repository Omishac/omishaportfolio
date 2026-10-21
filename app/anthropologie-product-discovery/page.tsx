"use client"

import React, { useState, useRef, useEffect } from "react"
import SharedNav from "../../components/SharedNav"
import { FONT_SANS, COLORS, EASE_SPRING, useReducedMotion, BracketTag } from "../../components/site"

// Landing page tokens (components/site.tsx): Inter only, neutral palette.
const INTER = FONT_SANS
const C = COLORS

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "challenge", label: "Challenge" },
    { id: "research", label: "Research" },
    { id: "goal", label: "Design Goal" },
    { id: "strategy", label: "Strategy" },
    { id: "validation", label: "Results" },
    { id: "component", label: "System" },
    { id: "launch", label: "Launch" },
]

// ── Type scale ──────────────────────────────────────────────────────────────
// Title 34–48 / 300 · Section heading 26–36 / 300 · Subheading 20–22 / 400
// Body 16 / 1.7 · Small 15 · Label 11 uppercase · Caption 12.5

const MEASURE = 620 // comfortable line length for paragraphs

function useResponsive() {
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    const [large, setLarge] = useState(false)
    const [wide, setWide] = useState(false) // room for side-by-side figure + text
    useEffect(() => {
        // clientWidth, not innerWidth: overflowing content widens the layout
        // viewport on phones, which would lock in the desktop layout.
        const check = () => { const w = document.documentElement.clientWidth; setPhone(w < 768); setTablet(w >= 768 && w < 1024); setLarge(w > 1440); setWide(w >= 1200) }
        check()
        window.addEventListener("resize", check, { passive: true })
        return () => window.removeEventListener("resize", check)
    }, [])
    return { phone, tablet, desktop: !phone && !tablet, large, wide }
}

function useInView(threshold = 0.08) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])
    return { ref, visible }
}

function useActiveSection(ids: string[]) {
    const [active, setActive] = useState("")
    useEffect(() => {
        const onScroll = () => {
            let best = ""; let bestDist = Infinity
            for (const id of ids) {
                const el = document.getElementById(id)
                if (el) { const top = el.getBoundingClientRect().top; if (top <= 200 && Math.abs(top) < bestDist) { bestDist = Math.abs(top); best = id } }
            }
            if (best) setActive(best)
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])
    return active
}

function CountUp({ to, suffix = "", duration = 1200 }: { to: number; suffix?: string; duration?: number }) {
    const { ref, visible } = useInView(0.3)
    const reduced = useReducedMotion()
    const [value, setValue] = useState(0)
    useEffect(() => {
        if (!visible) return
        if (reduced) { setValue(to); return }
        const start = performance.now()
        const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            setValue(Math.round((1 - Math.pow(1 - t, 3)) * to))
            if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
    }, [visible, to, duration, reduced])
    return <span ref={ref}>{value}{suffix}</span>
}

// Same fade-and-rise the landing page uses (0.6s, 16px, EASE_SPRING).
function FadeIn({ children, delay = 0, distance = 16, duration = 600, threshold = 0.08 }: { children: React.ReactNode; delay?: number; distance?: number; duration?: number; threshold?: number }) {
    const { ref, visible } = useInView(threshold) // observer disconnects after the first reveal: plays once
    const reduced = useReducedMotion()
    const shown = visible || reduced
    return (
        <div ref={ref} style={{
            opacity: shown ? 1 : 0, transform: shown ? "none" : `translateY(${distance}px)`,
            transition: reduced ? "none" : `opacity ${duration}ms ${EASE_SPRING} ${delay}ms, transform ${duration}ms ${EASE_SPRING} ${delay}ms`,
        }}>{children}</div>
    )
}

// ── Type components ─────────────────────────────────────────────────────────

function SectionHead({ tag, title, intro, phone }: { tag?: string; title: string; intro?: React.ReactNode; phone: boolean }) {
    return (
        <div style={{ marginBottom: phone ? 40 : 56 }}>
            {tag && <BracketTag style={{ marginBottom: 14 }}>{tag}</BracketTag>}
            <h2 style={{ fontFamily: INTER, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 300, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.15, maxWidth: MEASURE, margin: 0, textWrap: "balance" }}>
                {title}
            </h2>
            {intro && <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: MEASURE, margin: 0, marginTop: 16 }}>{intro}</p>}
        </div>
    )
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, margin: 0, marginBottom: 8, ...style }}>{children}</p>
}

function Num({ children }: { children: React.ReactNode }) {
    return <span style={{ fontFamily: INTER, fontSize: 11, fontWeight: 400, letterSpacing: "0.06em", color: C.muted }}>{children}</span>
}

function Caption({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: INTER, fontSize: 12.5, lineHeight: 1.55, color: C.ink3, margin: 0, marginTop: 12 }}>{children}</p>
}

function Metric({ value, label, phone }: { value: React.ReactNode; label: string; phone: boolean }) {
    return (
        <div>
            <p style={{ fontFamily: INTER, fontSize: phone ? 52 : 64, fontWeight: 200, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>{value}</p>
            <p style={{ fontFamily: INTER, fontSize: 12, fontWeight: 500, color: C.ink2, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.5, margin: 0, marginTop: 12, maxWidth: 320 }}>{label}</p>
        </div>
    )
}

// Images sit on the landing page's paper mat: square corners, no shadow.
const MAT: React.CSSProperties = { backgroundColor: C.paper, overflow: "hidden" }
const IMG: React.CSSProperties = { width: "100%", height: "auto", display: "block" }

// ── Content ─────────────────────────────────────────────────────────────────

// Each concept answers the research finding with the same number.
// before/after replace the old Problem/Why paragraphs (they restated the
// research findings); chips show the real CTA copy change for 03.
const STRATEGIES = [
    {
        num: "01", title: "Make Selections More Visible",
        before: "Users couldn\u2019t tell which filters were active.",
        after: "Clear feedback on which filters have been applied.",
        changes: ["Introduced checkboxes", "Improved selected-state visibility", "Repositioned active refinements"],
        video: "/videos/strategy-01-selections.mp4",
    },
    {
        num: "02", title: "Reduce Navigation Friction",
        before: "Users questioned whether earlier selections were still active.",
        after: "Users explore multiple filters without second-guessing earlier selections.",
        changes: ["Introduced accordion architecture", "Improved movement between filter groups", "Reduced backtracking"],
        video: "/videos/strategy-02-navigation.mp4",
    },
    {
        num: "03", title: "Create a Clear Exit Path",
        before: "No clear way to leave without applying filters.",
        after: "A clear way to continue shopping.",
        beforeChip: "Done", afterChip: "View Results",
        changes: ["CTA reads \u201cView Results\u201d once a filter is selected", "Clarified exit actions", "Improved drawer navigation"],
        video: "/videos/strategy-03-exit.mp4",
    },
    {
        num: "04", title: "Clarify Store Pickup Availability",
        before: "\u201cAvailable Within 24 Hours\u201d read as a shipping promise.",
        after: "Clearer availability, so users make more informed decisions.",
        changes: ["Introduced new pickup toggle behavior", "Improved copy hierarchy", "Supported multiple pickup states"],
        video: "/videos/strategy-04-inventory.mp4",
    },
] as { num: string; title: string; before: string; after: string; beforeChip?: string; afterChip?: string; changes: string[]; video: string }[]

// Research findings, pinned to where each friction lives in the old filter
// (the Challenge screens). `where` is the callout label on the screenshot.
const FINDINGS = [
    { num: "01", title: "Selected Filters Lacked Visibility", where: "Selections shrink to a count badge or faint highlight", quote: "I can\u2019t tell if that filter actually applied?" },
    { num: "02", title: "Multi-Filter Workflows Felt Fragile", where: "One screen per group, Back to switch", quote: "Are my previous filters still selected?" },
    { num: "03", title: "Exiting the Drawer Was Unclear", where: "No close, only \u201cclear all\u201d or \u201cview results\u201d", quote: "How do I close this?" },
    { num: "04", title: "Inventory Language Created Confusion", where: "Read as shipping, not local inventory", quote: "Does available within 24 hours mean shipping?" },
]

// Callout markers on the two old screens (375×716), in % of the image so
// they scale. Positions measured from the PNGs.
const ANNOTATED_SCREENS = [
    {
        src: "/images/Sort%20Modal.png", alt: "Old Filter & Sort screen: a list of filter groups, Color showing a count badge of 10, Availability at the bottom",
        marks: [{ num: "01", left: 68, top: 32 }, { num: "04", left: 42, top: 86.5 }],
    },
    {
        src: "/images/Sort%20Modal-1.png", alt: "Old Color filter screen: Back link, one faintly highlighted selected row, clear all and view results buttons",
        marks: [{ num: "02", left: 31, top: 4.9 }, { num: "01", left: 62, top: 14 }, { num: "03", left: 50, top: 88.5 }],
    },
]

// Launch recap: every value is stated elsewhere on the page.
const RECAP = [
    { value: "4", label: "friction patterns found in usability testing" },
    { value: "4", label: "concepts in one tested prototype" },
    { value: "100%", label: "task completion in retesting" },
    { value: "3", label: "URBN brands live" },
]

const ROSE = "#A4425C" // site accent: callout markers only

const OLD_FLOW = [
    { num: "01", title: "Open Filter Modal", caption: "Users open the centralized filter drawer.", src: "/images/Sort%20Modal.png" },
    { num: "02", title: "Select & Refine", caption: "Choose a filter category and refine options.", src: "/images/Sort%20Modal-1.png" },
    { num: "03", title: "Confirm & Go Back", caption: "Confirm selections and return to the list.", src: "/images/Sort%20Modal%202.png" },
    { num: "04", title: "Apply Other Filters", caption: "Repeat the process for additional filters.", src: "/images/Sort%20Modal-2.png" },
]

const RESULTS = [
    "Users successfully selected multiple filters before applying",
    "Checkbox interactions improved visibility and control",
    "Updated CTA removed confusion around exiting the drawer",
    "Inventory toggles were clearly understood",
    "Reordered selections felt intuitive and easy to follow",
]

const BRANDS = [
    // brandColor: the original hover fills, from git history (pre-refinement page)
    { name: "Urban Outfitters", href: "https://www.urbanoutfitters.com/womens-clothing", brandColor: "#11120C" },
    { name: "Free People", href: "https://www.freepeople.com/clothes", brandColor: "#D52975" },
    { name: "Anthropologie", href: "https://www.anthropologie.com/womens-clothing", brandColor: "#167A92" },
]

// ── Blocks ──────────────────────────────────────────────────────────────────

// The recordings are 2940×1602 desktop screens with the filter drawer docked
// on the right. The drawer starts at 61.6% of the width (measured from the
// frames); start the crop just past it so no page content shows.
const DRAWER_LEFT = 0.618
const DRAWER_ASPECT = `${Math.round((1 - DRAWER_LEFT) * 2940)} / 1602`

function DrawerVideo({ src, label }: { src: string; label: string }) {
    return (
        <div style={{ ...MAT, position: "relative", aspectRatio: DRAWER_ASPECT }}>
            {/* Full height, pinned right: the frame shows only the drawer, unstretched */}
            <video src={src} autoPlay loop muted playsInline aria-label={label}
                style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "auto", maxWidth: "none", display: "block" }} />
        </div>
    )
}

// Numbered rose callout marker (white on #A4425C ≈ 6.4:1).
function Marker({ num, size = 22 }: { num: string; size?: number }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            width: size, height: size, borderRadius: "50%", backgroundColor: ROSE, color: "#fff",
            fontFamily: INTER, fontSize: size > 20 ? 11 : 10, fontWeight: 600, lineHeight: 1, letterSpacing: "0.02em",
            fontVariantNumeric: "tabular-nums",
        }}>{num}</span>
    )
}

// Old filter screens with markers that match the findings list.
function AnnotatedScreens({ phone }: { phone: boolean }) {
    return (
        <figure style={{ margin: 0 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: phone ? 10 : 14 }}>
                {ANNOTATED_SCREENS.map((screen) => (
                    <div key={screen.src} style={{ ...MAT, padding: phone ? 10 : 14 }}>
                        <div style={{ position: "relative" }}>
                            <img src={screen.src} alt={screen.alt} width={375} height={716} style={{ ...IMG, outline: `1px solid ${C.border}` }} />
                            {screen.marks.map((m) => (
                                <span key={m.num + m.left} aria-hidden="true" style={{
                                    position: "absolute", left: `${m.left}%`, top: `${m.top}%`, transform: "translate(-50%, -50%)",
                                    display: "flex", borderRadius: "50%", boxShadow: "0 0 0 2px #fff, 0 1px 4px rgba(0,0,0,0.18)",
                                }}>
                                    <Marker num={m.num} size={phone ? 18 : 22} />
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Caption>The original filter. Markers match the findings.</Caption>
        </figure>
    )
}

function BeforeAfter({ s, phone, stack }: { s: typeof STRATEGIES[number]; phone: boolean; stack: boolean }) {
    const cell: React.CSSProperties = { padding: phone ? "16px 16px 18px" : "18px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }
    const text: React.CSSProperties = { fontFamily: INTER, fontSize: 15, color: C.ink2, lineHeight: 1.5, margin: 0 }
    const tag = (color: string): React.CSSProperties => ({ fontFamily: INTER, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color, margin: 0 })
    const chip = (label: string, muted: boolean) => (
        <span style={{
            alignSelf: "flex-start", fontFamily: INTER, fontSize: 12, fontWeight: 600, lineHeight: 1,
            padding: "8px 14px", backgroundColor: muted ? "#fff" : C.ink, color: muted ? C.ink2 : "#fff",
            border: `1px solid ${muted ? "rgba(0,0,0,0.18)" : C.ink}`,
        }}>{label}</span>
    )
    return (
        <div style={{ display: "grid", gridTemplateColumns: stack ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))", gap: 1, backgroundColor: C.border, border: `1px solid ${C.border}` }}>
            <div style={{ ...cell, backgroundColor: C.paper }}>
                <p style={tag(C.ink3)}>Before</p>
                <p style={text}>{s.before}</p>
                {s.beforeChip && chip(s.beforeChip, true)}
            </div>
            <div style={{ ...cell, backgroundColor: "#fff" }}>
                <p style={tag(ROSE)}>After</p>
                <p style={text}>{s.after}</p>
                {s.afterChip && chip(s.afterChip, false)}
            </div>
        </div>
    )
}

function StrategyBlock({ s, phone, wide }: { s: typeof STRATEGIES[number]; phone: boolean; wide: boolean }) {
    const body: React.CSSProperties = { fontFamily: INTER, fontSize: 15, fontWeight: 400, color: C.ink2, lineHeight: 1.65, margin: 0 }
    return (
        <div style={{
            display: "grid",
            // Video column capped at 400px (320 below 1200px so the text keeps room)
            gridTemplateColumns: phone ? "minmax(0, 1fr)" : `minmax(0, 1fr) minmax(0, ${wide ? 400 : 320}px)`,
            columnGap: wide ? 64 : 48, rowGap: 32,
            alignItems: "center",
        }}>
            <div style={{ maxWidth: 480 }}>
                <Num>{s.num}</Num>
                <h3 style={{ fontFamily: INTER, fontSize: phone ? 24 : 28, fontWeight: 300, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0, marginTop: 10, marginBottom: 28 }}>{s.title}</h3>

                <BeforeAfter s={s} phone={phone} stack={phone || !wide} />

                <div style={{ marginTop: 28 }}>
                    <p style={{ fontFamily: INTER, fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.4, margin: 0, marginBottom: 8 }}>What I Changed</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {s.changes.map((c, ci) => (
                            <li key={ci} style={{ ...body, padding: "7px 0", borderTop: `1px solid ${C.border}` }}>{c}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={{ width: "100%", maxWidth: phone ? 400 : undefined }}>
                <DrawerVideo src={s.video} label={`${s.title} recording`} />
            </div>
        </div>
    )
}

// Findings → concepts → retest → launch, as step boxes with arrows.
function RecapFlow({ phone }: { phone: boolean }) {
    // Light editorial row: hairline above each step, thin arrows between, no boxes.
    const arrow = (
        <span aria-hidden="true" style={{ display: "flex", alignItems: "center", color: C.ink3, opacity: 0.6, paddingTop: phone ? 0 : 22 }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 6h13" /><path d="M10 2l4 4-4 4" />
            </svg>
        </span>
    )
    return (
        <ol aria-label="From research to launch" style={{
            listStyle: "none", padding: 0, margin: 0,
            display: "grid",
            gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)",
            columnGap: phone ? 0 : 16,
            alignItems: "start",
        }}>
            {RECAP.map((step, i) => (
                <React.Fragment key={i}>
                    {i > 0 && !phone && <li aria-hidden="true">{arrow}</li>}
                    <li style={{
                        borderTop: `1px solid ${C.border}`,
                        padding: phone ? "14px 0" : "16px 0 0",
                        display: phone ? "flex" : "block", alignItems: "baseline", gap: 16,
                    }}>
                        <p style={{ fontFamily: INTER, fontSize: phone ? 22 : 26, fontWeight: 200, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1, margin: 0, minWidth: phone ? 56 : undefined }}>{step.value}</p>
                        <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, lineHeight: 1.45, margin: 0, marginTop: phone ? 0 : 8 }}>{step.label}</p>
                    </li>
                </React.Fragment>
            ))}
        </ol>
    )
}

function SideNav({ active }: { active: string }) {
    return (
        <nav aria-label="Case study sections">
            {SECTIONS.map(({ id, label }) => {
                const isActive = active === id
                return (
                    <a key={id} href={`#${id}`}
                        onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                        aria-current={isActive ? "location" : undefined}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", textDecoration: "none" }}
                    >
                        <span aria-hidden="true" style={{ width: isActive ? 12 : 0, height: 1, backgroundColor: C.ink, transition: `width 0.3s ${EASE_SPRING}` }} />
                        <span style={{ fontFamily: INTER, fontSize: 12, fontWeight: isActive ? 500 : 400, color: isActive ? C.ink : C.muted, transition: "color 0.3s ease" }}>
                            {label}
                        </span>
                    </a>
                )
            })}
        </nav>
    )
}

export default function AnthropologieProductDiscovery() {
    const { phone, tablet, desktop, large, wide } = useResponsive()
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))
    // Same page padding and content width as the landing page.
    const px = phone ? 20 : tablet ? 40 : large ? 120 : 80
    const contentMax = large ? 1120 : 960
    const sectionGap = phone ? 96 : tablet ? 128 : 160
    const sub = phone ? 64 : 88 // between sub-parts inside a section

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <SharedNav />

            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? `140px minmax(0, ${contentMax}px)` : undefined,
                justifyContent: "center",
                columnGap: desktop ? 64 : undefined,
                margin: "0 auto",
                padding: `0 ${px}px 160px`,
            }}>
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 96, paddingTop: 48 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}

                <main style={{ minWidth: 0 }}>

                    {/* ════════ OVERVIEW ════════ */}
                    <section id="overview" style={{ scrollMarginTop: 96, paddingTop: phone ? 32 : 48 }}>
                        {/* Header image shows straight away (no fade-in wait) and is fetched first */}
                        <div style={MAT}>
                            <img src="/images/filter-comparison.webp" alt="Filter experience across Free People, Urban Outfitters, and Anthropologie" width={2400} height={1200} loading="eager" decoding="async" fetchPriority="high" style={IMG} />
                        </div>

                        <FadeIn delay={80}>
                            <div style={{ marginTop: phone ? 36 : 56 }}>
                                <BracketTag style={{ marginBottom: 16 }}>URBN: Anthropologie · Urban Outfitters · Free People</BracketTag>
                                <h1 style={{
                                    fontFamily: INTER, fontWeight: 300, fontSize: "clamp(34px, 4vw, 48px)",
                                    lineHeight: 1.1, letterSpacing: "-0.03em", color: C.ink, margin: 0, maxWidth: 760, textWrap: "balance",
                                }}>
                                    Redesigning Product Filters Across the URBN Ecosystem
                                </h1>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 18 }}>
                                    {["Product Design", "Design Systems", "E-Commerce"].map(tag => (
                                        <span key={tag} style={{ fontFamily: INTER, fontSize: 11, color: C.muted, backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 40, padding: "4px 10px" }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* Summary: three aligned columns on desktop/tablet, stacked on phone */}
                        <FadeIn delay={100}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))",
                                columnGap: tablet ? 32 : 48, rowGap: 28,
                                marginTop: phone ? 36 : 48,
                            }}>
                                {[
                                    { k: "Problem", v: "Shoppers struggled to track filter selections and understand pickup availability." },
                                    { k: "What I Did", v: "Redesigned selection feedback, navigation, and pickup controls to reduce uncertainty." },
                                    { k: "Impact", v: "100% task completion in usability retesting. Launched across three brands." },
                                ].map(({ k, v }) => (
                                    <div key={k}>
                                        <p style={{ fontFamily: INTER, fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.4, margin: 0, marginBottom: 8 }}>{k}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 15, fontWeight: 400, color: C.ink2, lineHeight: 1.6, margin: 0, maxWidth: 340 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
                                columnGap: 32, rowGap: 24, marginTop: phone ? 36 : 48,
                                paddingTop: 24, borderTop: `1px solid ${C.border}`,
                            }}>
                                {([["Role", "UX Designer"], ["Timeline", "5 Months"], ["Company", "URBN"], ["Team", "PM · Eng · Research · Brand"]] as const).map(([k, v]) => (
                                    <div key={k}>
                                        <Label>{k}</Label>
                                        <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.45, color: C.ink2, margin: 0 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ CHALLENGE ════════ */}
                    <section id="challenge" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Challenge" title="The existing filtering experience"
                                intro="Product filters play a critical role in helping shoppers navigate large product catalogs. As assortments expanded across URBN brands, we wanted to better understand how the filtering experience supported product discovery across Mobile Web and Desktop." />
                            <p style={{ fontFamily: INTER, fontSize: phone ? 18 : 20, fontWeight: 400, color: C.ink, lineHeight: 1.45, maxWidth: phone ? 520 : "none", whiteSpace: phone ? "normal" : "nowrap", letterSpacing: "-0.01em", margin: 0, marginTop: phone ? -16 : -24, marginBottom: phone ? 40 : 56 }}>
                                Users moved between multiple screens to apply and review filters.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr)" : tablet ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
                                columnGap: 24, rowGap: phone ? 40 : 48,
                            }}>
                                {OLD_FLOW.map((screen) => (
                                    <figure key={screen.num} style={{ margin: 0, maxWidth: phone ? 300 : undefined }}>
                                        <div style={{ ...MAT, padding: phone ? 16 : 20 }}>
                                            <img src={screen.src} alt={screen.title} style={IMG} />
                                        </div>
                                        <figcaption style={{ marginTop: 14 }}>
                                            <Num>{screen.num}</Num>
                                            <p style={{ fontFamily: INTER, fontSize: 15, fontWeight: 500, color: C.ink, lineHeight: 1.35, margin: 0, marginTop: 4, marginBottom: 4 }}>{screen.title}</p>
                                            <p style={{ fontFamily: INTER, fontSize: 13, lineHeight: 1.55, color: C.ink3, margin: 0 }}>{screen.caption}</p>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ RESEARCH FINDINGS ════════ */}
                    <section id="research" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Research Findings" title="Four patterns that shaped our direction"
                                intro="Usability sessions we analyzed with the UX Research team surfaced four recurring friction patterns." />
                        </FadeIn>

                        <FadeIn delay={60}>
                            {/* Annotated old screens beside the findings they illustrate */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: wide ? "minmax(0, 5fr) minmax(0, 6fr)" : "minmax(0, 1fr)",
                                columnGap: large ? 72 : 48, rowGap: phone ? 32 : 40, alignItems: "start",
                            }}>
                                <div style={{ maxWidth: wide ? undefined : 460 }}>
                                    <AnnotatedScreens phone={phone} />
                                </div>
                                <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {FINDINGS.map((f) => (
                                        <li key={f.num} style={{ display: "flex", gap: 14, borderTop: `1px solid ${C.border}`, padding: phone ? "18px 0 20px" : "20px 0 22px" }}>
                                            <span style={{ paddingTop: 1 }}><Marker num={f.num} /></span>
                                            <div style={{ minWidth: 0 }}>
                                                <h3 style={{ fontFamily: INTER, fontSize: phone ? 17 : 18, fontWeight: 400, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0 }}>{f.title}</h3>
                                                <p style={{ fontFamily: INTER, fontSize: 13.5, lineHeight: 1.5, color: C.ink3, margin: 0, marginTop: 4 }}>{f.where}</p>
                                                <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.5, color: C.ink2, margin: 0, marginTop: 10, paddingLeft: 12, borderLeft: `1px solid ${C.ink3}` }}>&ldquo;{f.quote}&rdquo;</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ DESIGN GOAL ════════ */}
                    <section id="goal" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: phone ? "40px 0" : "56px 0" }}>
                                <BracketTag style={{ marginBottom: 18 }}>Design Goal</BracketTag>
                                <p style={{ fontFamily: INTER, fontWeight: 300, fontSize: "clamp(22px, 2.6vw, 30px)", lineHeight: 1.35, color: C.ink, letterSpacing: "-0.02em", maxWidth: 720, margin: 0, textWrap: "balance" }}>
                                    How might we create a filtering experience that feels clear, predictable, and easy to navigate?
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ STRATEGY ════════ */}
                    <section id="strategy" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Strategy" title="Four concepts tested and refined"
                                intro="Each concept answers the research finding with the same number, aiming to make filtering clearer and more predictable." />
                        </FadeIn>

                        <div style={{ display: "flex", flexDirection: "column", gap: phone ? 88 : 128 }}>
                            {STRATEGIES.map((s) => (
                                <FadeIn key={s.num} distance={12} duration={450} threshold={0.15}>
                                    <StrategyBlock s={s} phone={phone} wide={wide} />
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* ════════ BRINGING SOLUTIONS TOGETHER ════════ */}
                    <section id="prototyping" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} title="Bringing the solutions together"
                                intro="The four design improvements were combined into one interactive prototype and tested as a complete filtering experience before development." />
                        </FadeIn>

                        <FadeIn delay={40}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 300px)",
                                columnGap: 64, rowGap: 40,
                                alignItems: "center",
                            }}>
                                <div>
                                    <Metric phone={phone} value={<CountUp to={45} suffix="%" />} label="Reduced Design Iteration Time" />
                                    <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: 0, marginTop: 20, maxWidth: 440 }}>
                                        Using Builder.io and URBN's existing design system components, I turned Figma concepts into coded prototypes, so concepts were validated before development.
                                    </p>
                                </div>
                                <figure style={{ margin: 0, maxWidth: phone ? 280 : undefined }}>
                                    <div style={{ ...MAT, padding: 16 }}>
                                        <video src="/videos/prototype-walkthrough.mp4" autoPlay muted loop playsInline aria-label="Interactive prototype walkthrough" style={IMG} />
                                    </div>
                                    <Caption>Interactive prototype used for usability testing.</Caption>
                                </figure>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ VALIDATION ════════ */}
                    <section id="validation" style={{ scrollMarginTop: 96, marginTop: phone ? 72 : 96 }}>
                        <FadeIn>
                            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: phone ? 40 : 56 }}>
                                <p style={{ fontFamily: INTER, fontSize: 14, color: C.muted, margin: 0, marginBottom: 12 }}>Leading to&hellip;</p>
                                <Metric phone={phone} value={<CountUp to={100} suffix="%" duration={1400} />} label="Task Completion Rate" />
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Label style={{ marginTop: phone ? 40 : 56, marginBottom: 4 }}>Seen Through</Label>
                            <div style={{ maxWidth: 720 }}>
                                {RESULTS.map((item, i) => (
                                    <div key={i} style={{ padding: "14px 0", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "baseline", gap: 14 }}>
                                        <span aria-hidden="true" style={{ fontFamily: INTER, fontSize: 12, color: C.ink3, flexShrink: 0 }}>&#10003;</span>
                                        <p style={{ fontFamily: INTER, fontSize: 15, color: C.ink2, margin: 0, lineHeight: 1.55 }}>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ COMPONENT DESIGN ════════ */}
                    <section id="component" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="From Solution to System" title="Building a reusable component"
                                intro="The redesigned pickup experience introduced a new interaction pattern that wasn't supported by the existing design system. Rather than creating a one-off solution, I designed a reusable component that could support future filtering experiences across URBN brands." />
                        </FadeIn>

                        {/* 01 Designing the Core Pattern */}
                        <FadeIn>
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1fr)", columnGap: 56, rowGap: 24, alignItems: "start" }}>
                                <div>
                                    <Num>01</Num>
                                    <h3 style={{ fontFamily: INTER, fontSize: phone ? 20 : 22, fontWeight: 400, letterSpacing: "-0.015em", color: C.ink, lineHeight: 1.3, margin: 0, marginTop: 8, marginBottom: 10 }}>
                                        Designing the Core Pattern
                                    </h3>
                                    <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: 0, maxWidth: 440 }}>
                                        The component was first designed as a white-label pattern before being adapted across individual brand experiences.
                                    </p>
                                </div>
                                <div style={{ ...MAT, padding: phone ? 16 : 24 }}>
                                    <img src="/images/toggle-whitelabel.png" alt="White-label toggle component" style={IMG} />
                                </div>
                            </div>
                        </FadeIn>

                        {/* 02 Adapting Across Brands */}
                        <FadeIn>
                            <div style={{ marginTop: sub }}>
                                <Num>02</Num>
                                <h3 style={{ fontFamily: INTER, fontSize: phone ? 20 : 22, fontWeight: 400, letterSpacing: "-0.015em", color: C.ink, lineHeight: 1.3, margin: 0, marginTop: 8, marginBottom: 10 }}>
                                    Adapting Across Brands
                                </h3>
                                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: 0, maxWidth: MEASURE, marginBottom: 32 }}>
                                    While the interaction remained consistent, visual treatments were adapted to align with each brand's established design language.
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))", columnGap: 24, rowGap: 28 }}>
                                    {[
                                        { src: "/images/toggle-anthropologie.png", label: "Anthropologie" },
                                        { src: "/images/toggle-urbanoutfitters.png", label: "Urban Outfitters" },
                                        { src: "/images/toggle-freepeople.png", label: "Free People" },
                                    ].map((brand) => (
                                        <figure key={brand.label} style={{ margin: 0 }}>
                                            <div style={{ ...MAT, padding: phone ? 16 : 20 }}>
                                                <img src={brand.src} alt={`${brand.label} toggle states`} style={IMG} />
                                            </div>
                                            <figcaption style={{ fontFamily: INTER, fontSize: 13, fontWeight: 500, color: C.ink2, marginTop: 12 }}>{brand.label}</figcaption>
                                        </figure>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* 03 Supporting Different States */}
                        <FadeIn>
                            <div style={{ marginTop: sub }}>
                                <Num>03</Num>
                                <h3 style={{ fontFamily: INTER, fontSize: phone ? 20 : 22, fontWeight: 400, letterSpacing: "-0.015em", color: C.ink, lineHeight: 1.3, margin: 0, marginTop: 8, marginBottom: 10 }}>
                                    Supporting Different States
                                </h3>
                                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: 0, maxWidth: MEASURE, marginBottom: 40 }}>
                                    The component was designed to adapt to multiple pickup and availability scenarios while maintaining a consistent interaction model.
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: phone ? 48 : 64 }}>
                                    {[
                                        { title: "No Pickup Store Selected", desc: "Default state prompting users to select a store", desktop: "/images/state-no-store-desktop.png", mobile: "/images/state-no-store-mobile.png" },
                                        { title: "Pickup Store Unavailable", desc: "Disabled state communicating limited availability", desktop: "/images/state-unavailable-desktop.png", mobile: "/images/state-unavailable-mobile.png" },
                                    ].map((state) => (
                                        <figure key={state.title} style={{ margin: 0 }}>
                                            <figcaption style={{ marginBottom: 20 }}>
                                                <h4 style={{ fontFamily: INTER, fontSize: phone ? 17 : 18, fontWeight: 400, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.35, margin: 0, marginBottom: 4 }}>{state.title}</h4>
                                                <p style={{ fontFamily: INTER, fontSize: 14, color: C.ink3, margin: 0, lineHeight: 1.55 }}>{state.desc}</p>
                                            </figcaption>
                                            {/* Desktop and mobile side by side, top-aligned */}
                                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 3fr) minmax(0, 1fr)", gap: phone ? 16 : 24, alignItems: "start" }}>
                                                <div style={MAT}>
                                                    <img src={state.desktop} alt={`${state.title}, desktop`} style={IMG} />
                                                </div>
                                                <div style={{ ...MAT, maxWidth: phone ? 240 : undefined }}>
                                                    <img src={state.mobile} alt={`${state.title}, mobile`} style={IMG} />
                                                </div>
                                            </div>
                                        </figure>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* 04 Implementation Ready */}
                        <FadeIn>
                            <div style={{ marginTop: sub }}>
                                <Num>04</Num>
                                <h3 style={{ fontFamily: INTER, fontSize: phone ? 20 : 22, fontWeight: 400, letterSpacing: "-0.015em", color: C.ink, lineHeight: 1.3, margin: 0, marginTop: 8, marginBottom: 10 }}>
                                    Implementation Ready
                                </h3>
                                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: 0, maxWidth: MEASURE, marginBottom: 24 }}>
                                    Full specifications were documented and handed off to engineering for production implementation.
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))", columnGap: 56, maxWidth: 720 }}>
                                    {["States documented", "Interaction logic defined", "Copy variations documented", "Engineering handoff completed"].map((item) => (
                                        <div key={item} style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "12px 0", borderTop: `1px solid ${C.border}` }}>
                                            <span aria-hidden="true" style={{ fontFamily: INTER, fontSize: 12, color: C.ink3 }}>&#10003;</span>
                                            <p style={{ fontFamily: INTER, fontSize: 14, color: C.ink2, margin: 0 }}>{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ LAUNCH & REFLECTION ════════ */}
                    <section id="launch" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Launch & Reflection" title="Shipping across three brands"
                                intro={<span style={{ whiteSpace: phone ? "normal" : "nowrap" }}>Live on all three brands, helping shoppers navigate large catalogs with more confidence.</span>} />
                        </FadeIn>

                        <FadeIn delay={40}>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: phone ? -16 : -24 }}>
                                {BRANDS.map((brand) => {
                                    const on = (el: HTMLElement) => { el.style.backgroundColor = brand.brandColor; el.style.borderColor = brand.brandColor; el.style.color = "#fff" }
                                    const off = (el: HTMLElement) => { el.style.backgroundColor = "transparent"; el.style.borderColor = C.border; el.style.color = C.ink2 }
                                    return (
                                        <a key={brand.name} href={brand.href} target="_blank" rel="noopener noreferrer" style={{
                                            fontFamily: INTER, fontSize: 14, fontWeight: 400, color: C.ink2,
                                            textDecoration: "none", padding: "10px 18px",
                                            borderRadius: 100, border: `1px solid ${C.border}`,
                                            transition: "background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease",
                                        }}
                                            onMouseEnter={e => on(e.currentTarget)}
                                            onMouseLeave={e => { if (document.activeElement !== e.currentTarget) off(e.currentTarget) }}
                                            onFocus={e => on(e.currentTarget)}
                                            onBlur={e => off(e.currentTarget)}
                                        >
                                            {brand.name} &nbsp;&#8599;
                                        </a>
                                    )
                                })}
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{ marginTop: phone ? 48 : 64 }}>
                                <RecapFlow phone={phone} />
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{ marginTop: phone ? 64 : 88, paddingTop: phone ? 40 : 56, borderTop: `1px solid ${C.border}` }}>
                                <p style={{ fontFamily: INTER, fontWeight: 300, fontSize: "clamp(22px, 2.6vw, 30px)", lineHeight: 1.35, color: C.ink, letterSpacing: "-0.02em", maxWidth: 720, margin: 0, marginBottom: 24, textWrap: "balance" }}>
                                    Designing better filters wasn't the goal.{" "}<br />Building confidence was.
                                </p>
                                <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: MEASURE, margin: 0 }}>
                                    The biggest friction wasn&rsquo;t functionality, it was uncertainty: small hesitations that compounded until users questioned whether the system was working. Good product design is often less about new features than about feeling clear, predictable, and trustworthy.
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* Back to work */}
                    <div style={{ paddingTop: 40, marginTop: phone ? 80 : 120, borderTop: `1px solid ${C.border}` }}>
                        <a href="/#work"
                            style={{ fontFamily: INTER, fontSize: 14, color: C.ink3, textDecoration: "none", minHeight: 44, display: "inline-flex", alignItems: "center", transition: "color 0.18s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = C.ink3)}
                        >
                            ← Back to work
                        </a>
                    </div>

                </main>
            </div>
        </div>
    )
}
