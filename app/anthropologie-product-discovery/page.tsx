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
    useEffect(() => {
        // clientWidth, not innerWidth: overflowing content widens the layout
        // viewport on phones, which would lock in the desktop layout.
        const check = () => { const w = document.documentElement.clientWidth; setPhone(w < 768); setTablet(w >= 768 && w < 1024); setLarge(w > 1440) }
        check()
        window.addEventListener("resize", check, { passive: true })
        return () => window.removeEventListener("resize", check)
    }, [])
    return { phone, tablet, desktop: !phone && !tablet, large }
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

const STRATEGIES = [
    {
        num: "01", title: "Make Selections More Visible",
        problem: "Selected filters lacked visibility. Users couldn't tell which filters were active.",
        changes: ["Introduced checkboxes", "Improved selected-state visibility", "Repositioned active refinements"],
        why: "Users receive clearer feedback and can immediately understand which filters have been applied.",
        video: "/videos/strategy-01-selections.mp4",
    },
    {
        num: "02", title: "Reduce Navigation Friction",
        problem: "Multi-filter workflows felt fragile. Users questioned whether previous selections remained active.",
        changes: ["Introduced accordion architecture", "Improved movement between filter groups", "Reduced backtracking"],
        why: "Users can explore multiple filters without questioning whether previous selections remain active.",
        video: "/videos/strategy-02-navigation.mp4",
    },
    {
        num: "03", title: "Create a Clear Exit Path",
        problem: "Exiting the drawer was unclear. Users didn't know how to leave without applying filters.",
        changes: ["Changed CTA copy from \"Done\" to \"View Results\" when a filter is selected", "Clarified exit actions", "Improved drawer navigation"],
        why: "Users always understand how to continue their shopping journey.",
        video: "/videos/strategy-03-exit.mp4",
    },
    {
        num: "04", title: "Clarify Store Pickup Availability",
        problem: "Inventory language created confusion. Users read \"Available Within 24 Hours\" as a shipping promise.",
        changes: ["Introduced new pickup toggle behavior", "Improved copy hierarchy", "Supported multiple pickup states"],
        why: "Users can better understand product availability and make more informed decisions.",
        video: "/videos/strategy-04-inventory.mp4",
    },
]

const FINDINGS = [
    { num: "01", title: "Selected Filters Lacked Visibility", desc: "Users struggled to determine which filters were currently active after making a selection.", quote: "I can’t tell if that filter actually applied?" },
    { num: "02", title: "Multi-Filter Workflows Felt Fragile", desc: "Participants questioned whether previous selections remained active while navigating between filter groups.", quote: "Are my previous filters still selected?" },
    { num: "03", title: "Exiting the Drawer Was Unclear", desc: "Users struggled to understand how to leave the filtering experience without applying filters.", quote: "How do I close this?" },
    { num: "04", title: "Inventory Language Created Confusion", desc: "Participants frequently interpreted “Available Within 24 Hours” as a shipping promise rather than local inventory availability.", quote: "Does available within 24 hours mean shipping?" },
]

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

// Bold label on its own line, regular supporting copy below.
function StrategyLabel({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: INTER, fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.4, margin: 0, marginBottom: 8 }}>{children}</p>
}

function StrategyBlock({ s, phone }: { s: typeof STRATEGIES[number]; phone: boolean }) {
    const group = { marginTop: 28 } // same gap between Problem, What I Changed and Why
    const body: React.CSSProperties = { fontFamily: INTER, fontSize: 15, fontWeight: 400, color: C.ink2, lineHeight: 1.65, margin: 0 }
    return (
        <div style={{
            display: "grid",
            // Video column capped at 400px: smaller, still legible at drawer scale
            gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 400px)",
            columnGap: 72, rowGap: 32,
            alignItems: "center",
        }}>
            <div style={{ maxWidth: 460 }}>
                <Num>{s.num}</Num>
                <h3 style={{ fontFamily: INTER, fontSize: phone ? 24 : 28, fontWeight: 300, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0, marginTop: 10 }}>{s.title}</h3>

                <div style={{ marginTop: 32 }}>
                    <StrategyLabel>Problem</StrategyLabel>
                    <p style={body}>{s.problem}</p>
                </div>

                <div style={group}>
                    <StrategyLabel>What I Changed</StrategyLabel>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {s.changes.map((c, ci) => (
                            <li key={ci} style={{ ...body, padding: "7px 0", borderTop: `1px solid ${C.border}` }}>{c}</li>
                        ))}
                    </ul>
                </div>

                <div style={group}>
                    <StrategyLabel>Why</StrategyLabel>
                    <p style={body}>{s.why}</p>
                </div>
            </div>

            <div style={{ width: "100%", maxWidth: phone ? 400 : undefined }}>
                <DrawerVideo src={s.video} label={`${s.title} recording`} />
            </div>
        </div>
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
    const { phone, tablet, desktop, large } = useResponsive()
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
                        <FadeIn>
                            <div style={MAT}>
                                <img src="/images/filter-comparison.webp" alt="Filter experience across Free People, Urban Outfitters, and Anthropologie" style={IMG} />
                            </div>
                        </FadeIn>

                        <FadeIn delay={80}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: desktop ? "minmax(0, 1.4fr) minmax(0, 1fr)" : "minmax(0, 1fr)",
                                columnGap: 64, rowGap: 20,
                                marginTop: phone ? 36 : 56,
                                alignItems: "end",
                            }}>
                                <div>
                                    <BracketTag style={{ marginBottom: 16 }}>URBN: Anthropologie · Urban Outfitters · Free People</BracketTag>
                                    <h1 style={{
                                        fontFamily: INTER, fontWeight: 300, fontSize: "clamp(34px, 4vw, 48px)",
                                        lineHeight: 1.1, letterSpacing: "-0.03em", color: C.ink, margin: 0, textWrap: "balance",
                                    }}>
                                        Redesigning Product Filters Across the URBN Ecosystem
                                    </h1>
                                </div>
                                <div>
                                    <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.65, color: C.ink3, margin: 0, marginBottom: 16 }}>
                                        Improving product discovery across Mobile Web and Desktop for Anthropologie, Urban Outfitters, and Free People.
                                    </p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                        {["Product Design", "Design Systems", "E-Commerce"].map(tag => (
                                            <span key={tag} style={{ fontFamily: INTER, fontSize: 11, color: C.muted, backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 40, padding: "4px 10px" }}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
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
                            <p style={{ fontFamily: INTER, fontSize: phone ? 18 : 20, fontWeight: 400, color: C.ink, lineHeight: 1.45, maxWidth: 520, letterSpacing: "-0.01em", margin: 0, marginTop: phone ? -16 : -24, marginBottom: phone ? 40 : 56 }}>
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
                                intro="Partnering with the UX Research team, we analyzed usability testing sessions to understand where users experienced friction throughout the filtering journey. Across participants, four recurring patterns emerged." />
                        </FadeIn>

                        <FadeIn delay={60}>
                            {/* Numbered list on a two-column grid, separated by hairlines */}
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))", columnGap: 56 }}>
                                {FINDINGS.map((f) => (
                                    <div key={f.num} style={{ borderTop: `1px solid ${C.border}`, padding: phone ? "24px 0 32px" : "28px 0 44px" }}>
                                        <Num>{f.num}</Num>
                                        <h3 style={{ fontFamily: INTER, fontSize: phone ? 18 : 20, fontWeight: 400, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.3, margin: 0, marginTop: 8, marginBottom: 10 }}>{f.title}</h3>
                                        <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: 0, marginBottom: 14 }}>{f.desc}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.55, color: C.ink2, margin: 0, paddingLeft: 12, borderLeft: `1px solid ${C.ink3}` }}>&ldquo;{f.quote}&rdquo;</p>
                                    </div>
                                ))}
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
                                intro="Based on the research findings, the redesign focused on reducing uncertainty throughout the filtering experience by making interactions clearer, more predictable, and easier to navigate." />
                        </FadeIn>

                        <div style={{ display: "flex", flexDirection: "column", gap: phone ? 104 : 168 }}>
                            {STRATEGIES.map((s) => (
                                <FadeIn key={s.num} distance={12} duration={450} threshold={0.15}>
                                    <StrategyBlock s={s} phone={phone} />
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
                                    <Metric phone={phone} value={<CountUp to={45} suffix="%" />} label="Faster Prototype Creation & Testing Preparation" />
                                    <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: 0, marginTop: 20, maxWidth: 440 }}>
                                        Using Builder.io and URBN's existing design system components, I rapidly transformed concepts into a testable experience, allowing faster validation before development.
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
                                intro="This redesign is now live across Urban Outfitters, Free People, and Anthropologie, helping shoppers navigate large product catalogs with greater clarity and confidence." />
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
                            <div style={{ marginTop: phone ? 64 : 96, paddingTop: phone ? 40 : 56, borderTop: `1px solid ${C.border}` }}>
                                <p style={{ fontFamily: INTER, fontWeight: 300, fontSize: "clamp(22px, 2.6vw, 30px)", lineHeight: 1.35, color: C.ink, letterSpacing: "-0.02em", maxWidth: 720, margin: 0, marginBottom: 32, textWrap: "balance" }}>
                                    Designing better filters wasn't the goal.{" "}<br />Building confidence was.
                                </p>
                                <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: MEASURE, margin: 0 }}>
                                    Usability testing revealed that the biggest friction wasn't functionality. It was uncertainty. Small moments of hesitation compounded throughout the experience, causing users to question whether the system was working as expected.
                                </p>
                                <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: MEASURE, margin: 0, marginTop: 20 }}>
                                    This project reinforced that effective product design is often less about adding new features and more about creating experiences that feel clear, predictable, and trustworthy.
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
