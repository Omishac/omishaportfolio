"use client"

import React, { useState, useRef, useEffect } from "react"
import { NavStyles, NavLink, MenuLink, NAV_LINK_GAP } from "../../components/NavLinks"
import { FONT_SANS, FONT_SERIF, COLORS, EASE_SPRING, useReducedMotion, BracketTag } from "../../components/site"

// Same tokens as the homepage (components/site.tsx). The case study keeps its
// original olive as the single accent: quieter and more business-like.
const Z = FONT_SERIF
const INTER = FONT_SANS
const C = COLORS
const ACCENT = COLORS.olive

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "role", label: "My Role" },
    { id: "decisions", label: "Decisions" },
    { id: "testing", label: "Testing" },
    { id: "system", label: "System" },
    { id: "outcome", label: "Outcome" },
]

function useResponsive() {
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    const [large, setLarge] = useState(false)
    useEffect(() => {
        // clientWidth, not innerWidth: on mobile, overflowing content widens the
        // layout viewport (and innerWidth), which would lock in the wrong layout.
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

// Same fade-and-rise the homepage uses for its cards (0.6s, 16px, EASE_SPRING).
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, visible } = useInView()
    const reduced = useReducedMotion()
    const shown = visible || reduced
    return (
        <div ref={ref} style={{
            opacity: shown ? 1 : 0, transform: shown ? "none" : "translateY(16px)",
            transition: reduced ? "none" : `opacity 0.6s ${EASE_SPRING} ${delay}ms, transform 0.6s ${EASE_SPRING} ${delay}ms`,
        }}>{children}</div>
    )
}

// ── Type ────────────────────────────────────────────────────────────────────
// One scale for the whole page:
//   H1 light 40–60 · H2 light 28–40 · H3 regular 22–26
//   body 16/1.7 · small 13 · label 12 · caption 12.5

function SectionHead({ tag, title, children }: { tag: string; title: string; children?: React.ReactNode }) {
    return (
        <div style={{ maxWidth: 640 }}>
            <BracketTag style={{ marginBottom: 14 }}>{tag}</BracketTag>
            <h2 style={{ fontFamily: INTER, fontSize: "clamp(28px, 3.2vw, 40px)", fontWeight: 200, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.12, margin: 0 }}>
                {title}
            </h2>
            {children && <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, margin: 0, marginTop: 18 }}>{children}</p>}
        </div>
    )
}

function Body({ children, max = 560, style }: { children: React.ReactNode; max?: number; style?: React.CSSProperties }) {
    return <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink2, maxWidth: max, margin: 0, ...style }}>{children}</p>
}

function Label({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: INTER, fontSize: 12, fontWeight: 300, color: C.muted, margin: 0, marginBottom: 10 }}>{children}</p>
}

function Caption({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: INTER, fontSize: 12.5, lineHeight: 1.55, color: C.muted, margin: 0, marginTop: 14 }}>{children}</p>
}

// Homepage image treatment: square corners, no border, paper mat behind.
const FRAME: React.CSSProperties = { overflow: "hidden", backgroundColor: C.paper }

// ── Content ─────────────────────────────────────────────────────────────────

const OLD_FLOW = [
    { num: "01", title: "Open the drawer", src: "/images/Sort%20Modal.png" },
    { num: "02", title: "Pick values", src: "/images/Sort%20Modal-1.png" },
    { num: "03", title: "Confirm and go back", src: "/images/Sort%20Modal%202.png" },
    { num: "04", title: "Repeat for the next filter", src: "/images/Sort%20Modal-2.png" },
]

// Each testing finding sits next to the change it led to.
const DECISIONS = [
    {
        num: "01",
        title: "Show what’s selected",
        saw: "After making a selection, shoppers couldn’t tell which filters were active.",
        quote: "I can’t tell if that filter actually applied?",
        change: "I added checkboxes to every option, strengthened the selected state and repositioned active refinements.",
        video: "/videos/strategy-01-selections.mp4",
        caption: "Checkboxes and a stronger selected state.",
    },
    {
        num: "02",
        title: "Keep earlier choices in view",
        saw: "Moving between filter groups made people doubt that their earlier picks were still applied.",
        quote: "Are my previous filters still selected?",
        change: "I moved filter groups into an accordion, so shoppers can move between groups without backtracking.",
        video: "/videos/strategy-02-navigation.mp4",
        caption: "Moving between groups in the accordion drawer.",
    },
    {
        num: "03",
        title: "Make the way out obvious",
        saw: "Shoppers weren’t sure how to leave the drawer without applying filters.",
        quote: "How do I close this?",
        change: "I changed the main button from “Done” to “View Results” once a filter is selected, and simplified the exit actions and drawer navigation.",
        video: "/videos/strategy-03-exit.mp4",
        caption: "The main button says what happens next.",
    },
    {
        num: "04",
        title: "Say what pickup actually means",
        saw: "“Available Within 24 Hours” read like a shipping promise, not local store stock.",
        quote: "Does available within 24 hours mean shipping?",
        change: "I introduced a pickup toggle with a clearer copy hierarchy, designed to support every pickup state.",
        video: "/videos/strategy-04-inventory.mp4",
        caption: "The pickup toggle separates store stock from shipping.",
    },
]

const OWNED = [
    "Found where shoppers hesitated, working through usability sessions with UX Research",
    "Designed the four drawer changes as main designer, within URBN’s design system",
    "Vibe coded the test prototype in Builder.io, which got it to UX Research faster",
    "Designed the pickup toggle as a white-label component, adapted it for each brand and documented it for engineering",
]

const BRAND_TOGGLES = [
    { src: "/images/toggle-whitelabel.png", label: "White-label" },
    { src: "/images/toggle-anthropologie.png", label: "Anthropologie" },
    { src: "/images/toggle-urbanoutfitters.png", label: "Urban Outfitters" },
    { src: "/images/toggle-freepeople.png", label: "Free People" },
    { src: "/images/toggle-terrain.png", label: "Terrain (Anthropologie)" },
]

const PICKUP_STATES = [
    { title: "No pickup store selected", desc: "Prompts the shopper to choose a store.", desktop: "/images/state-no-store-desktop.png", mobile: "/images/state-no-store-mobile.png" },
    { title: "Pickup store unavailable", desc: "Explains that nothing is available at that store.", desktop: "/images/state-unavailable-desktop.png", mobile: "/images/state-unavailable-mobile.png" },
]

const BRANDS = [
    { name: "Urban Outfitters", href: "https://www.urbanoutfitters.com/womens-clothing" },
    { name: "Free People", href: "https://www.freepeople.com/clothes" },
    { name: "Anthropologie", href: "https://www.anthropologie.com/womens-clothing" },
]

// ── Blocks ──────────────────────────────────────────────────────────────────

function DecisionBlock({ d, phone, flip }: { d: typeof DECISIONS[number]; phone: boolean; flip: boolean }) {
    const text = (
        <div style={{ maxWidth: 440 }}>
            <p style={{ fontFamily: INTER, fontSize: 12, fontWeight: 300, color: C.muted, margin: 0, marginBottom: 10 }}>{d.num}</p>
            <h3 style={{ fontFamily: INTER, fontSize: phone ? 22 : 26, fontWeight: 400, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0, marginBottom: 20 }}>{d.title}</h3>
            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: 0 }}>{d.saw}</p>
            {/* Participant voice in Zodiak, the site's warm serif */}
            <p style={{ fontFamily: Z, fontStyle: "italic", fontSize: phone ? 17 : 19, lineHeight: 1.45, color: C.ink, margin: "18px 0 26px", paddingLeft: 16, borderLeft: `1.5px solid ${ACCENT}` }}>
                &ldquo;{d.quote}&rdquo;
            </p>
            <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{d.change}</p>
        </div>
    )
    const media = (
        <figure style={{ margin: 0 }}>
            {/* The recordings are full desktop screens; the filter drawer sits on the
                right, so the frame is cropped to it to keep the UI legible. */}
            <div style={{ ...FRAME, position: "relative", aspectRatio: "0.72" }}>
                <video src={d.video} autoPlay loop muted playsInline aria-label={d.caption}
                    style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "auto", maxWidth: "none", display: "block" }} />
            </div>
            <Caption>{d.caption}</Caption>
        </figure>
    )
    // Alternate sides so the four decisions read as a sequence.
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1fr)",
            gap: phone ? 32 : 88,
            alignItems: "center",
        }}>
            {phone || !flip ? <>{text}{media}</> : <>{media}{text}</>}
        </div>
    )
}

// Metric callout: light Inter numerals, nothing else competing.
function Stat({ value, label, phone }: { value: string; label: string; phone: boolean }) {
    return (
        <div>
            <p style={{ fontFamily: INTER, fontSize: phone ? 52 : 72, fontWeight: 200, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1, margin: 0, marginBottom: 14 }}>{value}</p>
            <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.55, color: C.ink3, margin: 0, maxWidth: 240 }}>{label}</p>
        </div>
    )
}

// Section index: lowercase and light, with a short olive mark on the current one.
function SideNav({ active }: { active: string }) {
    return (
        <nav aria-label="Case study sections">
            {SECTIONS.map(({ id, label }) => {
                const isActive = active === id
                return (
                    <a key={id} href={`#${id}`}
                        onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                        aria-current={isActive ? "location" : undefined}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", textDecoration: "none" }}
                    >
                        <span aria-hidden="true" style={{ width: isActive ? 12 : 0, height: 1, backgroundColor: ACCENT, transition: `width 0.3s ${EASE_SPRING}` }} />
                        <span style={{
                            fontFamily: INTER, fontSize: 12, fontWeight: isActive ? 400 : 300,
                            color: isActive ? C.ink : C.muted, textTransform: "lowercase",
                            transition: "color 0.3s ease",
                        }}>
                            {label}
                        </span>
                    </a>
                )
            })}
        </nav>
    )
}

function CaseStudyNav() {
    const [scrolled, setScrolled] = useState(false)
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        const onResize = () => {
            const w = window.innerWidth
            setPhone(w < 768)
            setTablet(w >= 768 && w < 1024)
        }
        onResize()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onResize, { passive: true })
        return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize) }
    }, [])
    const links = [
        { label: "Work", href: "/#work" },
        { label: "Playground", href: "/playground" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
        { label: "Resume", href: "/slides/resume.pdf", ext: true },
    ]
    return (
        <>
            <NavStyles />
            <nav style={{
                position: "sticky", top: 0, zIndex: 100, width: "100%", height: phone ? 54 : 64,
                backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : C.bg,
                backdropFilter: scrolled ? "blur(20px)" : "none", WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.09)" : C.border}`,
                transition: "background 0.25s, border-color 0.25s",
            }}>
                <div style={{ maxWidth: 1400, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${phone ? 20 : tablet ? 40 : 80}px`, boxSizing: "border-box" }}>
                <a href="/" style={{ display: "block", lineHeight: 0 }}>
                    <img src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png" alt="OC" style={{ width: phone ? 48 : 58, height: phone ? 48 : 58, objectFit: "contain", display: "block" }} />
                </a>
                {phone ? (
                    <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5, minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" }} aria-label="Open menu">
                        <span style={{ width: 22, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block" }} />
                        <span style={{ width: 22, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block" }} />
                        <span style={{ width: 14, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block", alignSelf: "flex-end" }} />
                    </button>
                ) : (
                    <div style={{ display: "flex", gap: NAV_LINK_GAP, alignItems: "center" }}>
                        {links.map(({ label, href, ext }) => (
                            <NavLink key={label} label={label} href={href} ext={ext} />
                        ))}
                    </div>
                )}
                </div>
            </nav>
            {menuOpen && (
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 999, backgroundColor: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", display: "flex", flexDirection: "column", padding: "24px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
                        <img src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png" alt="OC" style={{ width: 48, height: 48, objectFit: "contain" }} />
                        <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: C.ink, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>&#10005;</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {links.map(({ label, href, ext }) => (
                            <MenuLink key={label} label={label} href={href} ext={ext} onClick={() => setMenuOpen(false)}
                                style={{ minHeight: 52, display: "flex", alignItems: "center", borderBottom: `1px solid ${C.border}`, padding: "12px 0" }} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default function AnthropologieProductDiscovery() {
    const { phone, tablet, desktop } = useResponsive()
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))
    const px = phone ? 20 : tablet ? 40 : 80
    const gap = phone ? 112 : 176        // between sections
    const inner = phone ? 48 : 72        // between a section head and its content

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <CaseStudyNav />

            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                gap: desktop ? 56 : undefined,
                maxWidth: 1400,
                margin: "0 auto",
                padding: `0 ${px}px 160px`,
            }}>
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 96, paddingTop: 56 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}

                <main style={{ minWidth: 0, maxWidth: 1080 }}>

                    {/* ════════ OVERVIEW ════════ */}
                    <section id="overview" style={{ scrollMarginTop: 96, paddingTop: phone ? 48 : 72 }}>
                        <FadeIn>
                            <BracketTag style={{ marginBottom: 18 }}>URBN · Anthropologie, Urban Outfitters, Free People</BracketTag>
                            <h1 style={{
                                fontFamily: INTER, fontWeight: 200, fontSize: "clamp(38px, 4.8vw, 60px)",
                                lineHeight: 1.06, letterSpacing: "-0.03em", color: C.ink,
                                maxWidth: 780, margin: 0, marginBottom: 24,
                            }}>
                                Redesigning product filters across three URBN brands
                            </h1>
                            <Body max={600} style={{ fontSize: phone ? 16 : 18, color: C.ink3 }}>
                                Shoppers kept second-guessing the filter drawer. I redesigned it around four moments of doubt found in usability testing, then turned the new pickup toggle into one component that works for every brand.
                            </Body>
                            <p style={{ fontFamily: INTER, fontSize: 13, lineHeight: 1.6, color: C.muted, margin: 0, marginTop: 20 }}>
                                UX Designer, main designer on the project · 5 months · Mobile Web and Desktop · with PM, Engineering, UX Research and Brand
                            </p>
                        </FadeIn>

                        <FadeIn delay={80}>
                            <figure style={{ margin: 0, marginTop: phone ? 48 : 72 }}>
                                <img src="/images/filter-comparison.webp" alt="The redesigned filter drawer on Free People, Urban Outfitters and Anthropologie mobile web" style={{ width: "100%", display: "block" }} />
                                <Caption>The redesigned filter drawer, live on Free People, Urban Outfitters and Anthropologie.</Caption>
                            </figure>
                        </FadeIn>

                        {/* The one-minute read */}
                        <FadeIn delay={80}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))",
                                gap: phone ? 32 : 56,
                                marginTop: phone ? 56 : 80,
                            }}>
                                {[
                                    { k: "problem", v: "Filtering meant hopping between screens, and shoppers couldn’t tell what was selected, how to leave, or what “Available Within 24 Hours” meant." },
                                    { k: "my role", v: "Main designer. Synthesis with UX Research, the four drawer changes, a vibe coded prototype and a reusable pickup component." },
                                    { k: "outcome", v: "100% task completion in prototype testing. Live on Urban Outfitters, Free People and Anthropologie." },
                                ].map(({ k, v }) => (
                                    <div key={k}>
                                        <Label>{k}</Label>
                                        <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink2, margin: 0 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ PROBLEM ════════ */}
                    <section id="problem" style={{ scrollMarginTop: 96, marginTop: gap }}>
                        <FadeIn>
                            <SectionHead tag="01 · The problem" title="One filter took four steps, and every extra filter repeated them">
                                Applying a single filter meant opening the drawer, picking a category, confirming and going back. Shoppers did that loop once per filter.
                            </SectionHead>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr) minmax(0, 1fr)" : "repeat(4, minmax(0, 1fr))",
                                gap: phone ? 16 : 24,
                                marginTop: inner,
                            }}>
                                {OLD_FLOW.map((step) => (
                                    <figure key={step.num} style={{ margin: 0 }}>
                                        <div style={{ ...FRAME, padding: phone ? 10 : 16 }}>
                                            <img src={step.src} alt={`Old flow, step ${step.num}: ${step.title}`} style={{ width: "100%", height: "auto", display: "block", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }} />
                                        </div>
                                        <figcaption style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, marginTop: 12 }}>
                                            <span style={{ color: C.muted, marginRight: 8 }}>{step.num}</span>{step.title}
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                            <Caption>The filter flow before the redesign, on mobile web.</Caption>
                        </FadeIn>
                    </section>

                    {/* ════════ ROLE ════════ */}
                    <section id="role" style={{ scrollMarginTop: 96, marginTop: gap }}>
                        <FadeIn>
                            <SectionHead tag="02 · My role" title="What I owned" />
                        </FadeIn>
                        <FadeIn delay={60}>
                            <div style={{ marginTop: phone ? 36 : 48, maxWidth: 720 }}>
                                {OWNED.map((t, i) => (
                                    <div key={i} style={{ display: "flex", gap: 20, alignItems: "baseline", padding: "18px 0", borderTop: `1px solid ${C.border}` }}>
                                        <span style={{ fontFamily: INTER, fontSize: 12, fontWeight: 300, color: C.muted, width: 20, flexShrink: 0 }}>0{i + 1}</span>
                                        <span style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.6, color: C.ink2 }}>{t}</span>
                                    </div>
                                ))}
                            </div>
                            <Body max={600} style={{ marginTop: phone ? 36 : 48, color: C.ink3, fontSize: 15 }}>
                                The constraints: three brands with different visual languages had to share one pattern, across Mobile Web and Desktop, in five months. URBN’s design system had no pattern for the pickup toggle.
                            </Body>
                        </FadeIn>
                    </section>

                    {/* ════════ DECISIONS ════════ */}
                    <section id="decisions" style={{ scrollMarginTop: 96, marginTop: gap }}>
                        <FadeIn>
                            <SectionHead tag="03 · What testing revealed" title="Four moments of doubt, four decisions">
                                The same four hesitations kept showing up in usability sessions. None were missing features. Each became a specific change.
                            </SectionHead>
                        </FadeIn>

                        <div style={{ display: "flex", flexDirection: "column", gap: phone ? 96 : 144, marginTop: phone ? 64 : 96 }}>
                            {DECISIONS.map((d, i) => (
                                <FadeIn key={d.num}>
                                    <DecisionBlock d={d} phone={phone} flip={i % 2 === 1} />
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* ════════ TESTING ════════ */}
                    <section id="testing" style={{ scrollMarginTop: 96, marginTop: gap }}>
                        <FadeIn>
                            <SectionHead tag="04 · Testing the whole flow" title="All four changes, tested as one flow">
                                I combined the changes into a single prototype so UX Research could test the complete experience before development, not isolated fixes.
                            </SectionHead>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 260px) minmax(0, 1fr)",
                                gap: phone ? 56 : 96,
                                alignItems: "center",
                                marginTop: inner,
                            }}>
                                <figure style={{ margin: 0, maxWidth: phone ? 240 : undefined, order: phone ? 2 : 0 }}>
                                    <div style={{ ...FRAME, padding: 16 }}>
                                        <video src="/videos/prototype-walkthrough.mp4" autoPlay muted loop playsInline aria-label="Walkthrough of the interactive prototype" style={{ width: "100%", height: "auto", display: "block" }} />
                                    </div>
                                    <Caption>The prototype, vibe coded in Builder.io from URBN design system components.</Caption>
                                </figure>

                                <div>
                                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: phone ? 24 : 48 }}>
                                        <Stat phone={phone} value="100%" label="task completion in usability testing of the combined prototype" />
                                        <Stat phone={phone} value="45%" label="shorter prototype timeline, by vibe coding it in Builder.io" />
                                    </div>
                                    <Body max={520} style={{ marginTop: phone ? 40 : 56, color: C.ink3, fontSize: 15 }}>
                                        In testing, shoppers selected several filters before applying them. Checkboxes made selections easy to see, “View Results” made the way out clear, the pickup toggle was understood, and reordered selections felt easy to follow.
                                    </Body>
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ SYSTEM ════════ */}
                    <section id="system" style={{ scrollMarginTop: 96, marginTop: gap }}>
                        <FadeIn>
                            <SectionHead tag="05 · Scaling across brands" title="One component, three brands">
                                The pickup toggle had no equivalent in URBN’s design system, so I designed it once as a white-label component and adapted it to each brand. The interaction stays the same; color follows the brand.
                            </SectionHead>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <figure style={{ margin: 0, marginTop: inner }}>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: phone ? "minmax(0, 1fr) minmax(0, 1fr)" : "repeat(5, minmax(0, 1fr))",
                                    gap: phone ? 16 : 20,
                                }}>
                                    {BRAND_TOGGLES.map((b) => (
                                        <div key={b.label}>
                                            <div style={FRAME}>
                                                <img src={b.src} alt={`${b.label} pickup toggle: default, selected and hover states`} style={{ width: "100%", height: "auto", display: "block" }} />
                                            </div>
                                            <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, margin: 0, marginTop: 10 }}>{b.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <Caption>Default, selected and hover states: white-label first, then each brand.</Caption>
                            </figure>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{ marginTop: phone ? 80 : 120 }}>
                                <h3 style={{ fontFamily: INTER, fontSize: phone ? 22 : 26, fontWeight: 400, color: C.ink, letterSpacing: "-0.02em", margin: 0, marginBottom: 12 }}>
                                    Designed for every pickup state
                                </h3>
                                <Body max={520} style={{ color: C.ink3, fontSize: 15 }}>
                                    The interaction had to hold up when no store was chosen, and when the chosen store had nothing available.
                                </Body>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: phone ? 48 : 64, marginTop: phone ? 32 : 44 }}>
                                {PICKUP_STATES.map((st) => (
                                    <figure key={st.title} style={{ margin: 0 }}>
                                        <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 2.2fr) minmax(0, 1fr)" : "minmax(0, 3fr) minmax(0, 1fr)", gap: phone ? 8 : 20, alignItems: "start" }}>
                                            <div style={FRAME}>
                                                <img src={st.desktop} alt={`${st.title}, desktop`} style={{ width: "100%", height: "auto", display: "block" }} />
                                            </div>
                                            <div style={FRAME}>
                                                <img src={st.mobile} alt={`${st.title}, mobile`} style={{ width: "100%", height: "auto", display: "block" }} />
                                            </div>
                                        </div>
                                        <Caption><span style={{ color: C.ink2 }}>{st.title}.</span> {st.desc}</Caption>
                                    </figure>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{ marginTop: phone ? 80 : 120 }}>
                                <h3 style={{ fontFamily: INTER, fontSize: phone ? 22 : 26, fontWeight: 400, color: C.ink, letterSpacing: "-0.02em", margin: 0, marginBottom: 12 }}>
                                    From exploration to handoff
                                </h3>
                                <Body max={560} style={{ color: C.ink3, fontSize: 15 }}>
                                    I explored several toggle treatments before settling on one pattern, then documented every state, the interaction logic and copy variations, and handed it to engineering.
                                </Body>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1fr)",
                                gap: phone ? 40 : 40,
                                alignItems: "start",
                                marginTop: phone ? 32 : 44,
                            }}>
                                <figure style={{ margin: 0 }}>
                                    <div style={{ ...FRAME, padding: phone ? 16 : 32 }}>
                                        {/* transparent PNG: white card on the paper mat */}
                                        <img src="/images/toggle-explorations.png" alt="Early toggle explorations: filled, outline and colored treatments" style={{ width: "100%", height: "auto", display: "block", backgroundColor: C.bg }} />
                                    </div>
                                    <Caption>Early toggle explorations.</Caption>
                                </figure>
                                <figure style={{ margin: 0 }}>
                                    <div style={{ ...FRAME, padding: phone ? 16 : 32 }}>
                                        <img src="/images/toggle-specs.png" alt="Spec for the proposed web toggle: sizes, knob fill, checkmark and knob placement" style={{ width: "100%", height: "auto", display: "block", backgroundColor: C.bg }} />
                                    </div>
                                    <Caption>Part of the engineering spec: size, knob fill, checkmark and placement.</Caption>
                                </figure>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ OUTCOME ════════ */}
                    <section id="outcome" style={{ scrollMarginTop: 96, marginTop: gap }}>
                        <FadeIn>
                            <SectionHead tag="06 · Outcome" title="Live on all three brands">
                                The redesigned drawer and the pickup toggle are live on Urban Outfitters, Free People and Anthropologie, on Mobile Web and Desktop.
                            </SectionHead>
                            <div style={{ display: "flex", gap: phone ? 20 : 32, flexWrap: "wrap", marginTop: 28 }}>
                                {BRANDS.map((brand) => (
                                    <NavLink key={brand.name} label={`${brand.name} ↗`} href={brand.href} ext size={15} />
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{ marginTop: phone ? 96 : 144, maxWidth: 680 }}>
                                <p style={{
                                    fontFamily: Z, fontStyle: "italic", fontWeight: 400,
                                    fontSize: "clamp(24px, 3vw, 34px)", lineHeight: 1.3,
                                    color: C.ink, letterSpacing: "-0.02em", margin: 0, marginBottom: 20,
                                }}>
                                    Designing better filters wasn&rsquo;t the goal. Building confidence was.
                                </p>
                                <Body max={520} style={{ color: C.ink3, fontSize: 15 }}>
                                    Most problems in testing were moments of uncertainty, not missing features.
                                </Body>
                            </div>
                        </FadeIn>
                    </section>

                    {/* Back to work */}
                    <div style={{ paddingTop: 40, marginTop: phone ? 96 : 144, borderTop: `1px solid ${C.border}` }}>
                        <NavLink label="← back to work" href="/#work" size={14} />
                    </div>

                </main>
            </div>
        </div>
    )
}
