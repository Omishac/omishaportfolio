"use client"

import React, { useState, useRef, useEffect } from "react"
import { NavStyles, NavLink, MenuLink, NAV_LINK_GAP } from "../../components/NavLinks"

const Z = "Zodiak, 'Times New Roman', serif"
const INTER = "Inter, system-ui, sans-serif"

const C = {
    bg: "#FFFFFF",
    surface: "#F4F3EF",
    ink: "#11120C",
    ink2: "#364025",
    ink3: "#5A5A54",
    muted: "#899064",
    olive: "#899064",
    border: "rgba(17,18,12,0.08)",
}

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

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, visible } = useInView()
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
            transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}>{children}</div>
    )
}

// ── Shared type ─────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, margin: 0, marginBottom: 16 }}>{children}</p>
}

function H2({ children }: { children: React.ReactNode }) {
    return <h2 style={{ fontFamily: Z, fontSize: "clamp(26px, 3.4vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.1, maxWidth: 720, margin: 0, marginBottom: 18 }}>{children}</h2>
}

function Lede({ children, max = 600 }: { children: React.ReactNode; max?: number }) {
    return <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.7, color: C.ink3, maxWidth: max, margin: 0 }}>{children}</p>
}

function Label({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.muted, margin: 0, marginBottom: 8, textTransform: "uppercase" }}>{children}</p>
}

function Caption({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: INTER, fontSize: 12, lineHeight: 1.5, color: C.ink3, margin: 0, marginTop: 10 }}>{children}</p>
}

function Bullets({ items, size = 14 }: { items: string[]; size?: number }) {
    return (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((t, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontFamily: INTER, fontSize: size, lineHeight: 1.6, color: C.ink2, marginBottom: i < items.length - 1 ? 6 : 0 }}>
                    <span aria-hidden="true" style={{ color: C.olive, flexShrink: 0 }}>·</span>
                    <span>{t}</span>
                </li>
            ))}
        </ul>
    )
}

const FRAME: React.CSSProperties = { borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, backgroundColor: C.bg }

// ── Content ─────────────────────────────────────────────────────────────────

const OLD_FLOW = [
    { num: "01", title: "Open the drawer", caption: "Start from the full list of filter categories.", src: "/images/Sort%20Modal.png" },
    { num: "02", title: "Pick values", caption: "Open a category, then choose its options.", src: "/images/Sort%20Modal-1.png" },
    { num: "03", title: "Confirm and go back", caption: "Return to the list to see what changed.", src: "/images/Sort%20Modal%202.png" },
    { num: "04", title: "Repeat", caption: "Do the whole loop again for the next filter.", src: "/images/Sort%20Modal-2.png" },
]

// Each finding from testing sits next to the change it led to.
const DECISIONS = [
    {
        num: "01",
        title: "Show what’s selected",
        saw: "After making a selection, shoppers couldn’t tell which filters were active.",
        quote: "I can’t tell if that filter actually applied?",
        changes: ["Checkboxes on every option", "A stronger selected state", "Active refinements repositioned"],
        video: "/videos/strategy-01-selections.mp4",
        caption: "Checkboxes and a stronger selected state make applied filters easy to spot.",
    },
    {
        num: "02",
        title: "Keep earlier choices in view",
        saw: "Moving between filter groups made people doubt that their earlier picks were still applied.",
        quote: "Are my previous filters still selected?",
        changes: ["An accordion layout for filter groups", "Easier movement between groups", "Less backtracking"],
        video: "/videos/strategy-02-navigation.mp4",
        caption: "Moving between filter groups in the accordion drawer.",
    },
    {
        num: "03",
        title: "Make the way out obvious",
        saw: "Shoppers weren’t sure how to leave the drawer without applying filters.",
        quote: "How do I close this?",
        changes: ["“Done” becomes “View Results” once a filter is selected", "Clearer exit actions", "Simpler drawer navigation"],
        video: "/videos/strategy-03-exit.mp4",
        caption: "The main button says what happens next: “View Results.”",
    },
    {
        num: "04",
        title: "Say what pickup actually means",
        saw: "“Available Within 24 Hours” read like a shipping promise, not local store stock.",
        quote: "Does available within 24 hours mean shipping?",
        changes: ["A new pickup toggle", "A clearer copy hierarchy", "Support for every pickup state"],
        video: "/videos/strategy-04-inventory.mp4",
        caption: "The pickup toggle separates store availability from shipping.",
    },
]

const OBSERVED = [
    "Shoppers selected several filters before applying them",
    "Checkboxes made selections easy to see and control",
    "“View Results” cleared up how to leave the drawer",
    "The pickup toggle was clearly understood",
    "Reordered selections felt easy to follow",
]

const BRAND_TOGGLES = [
    { src: "/images/toggle-whitelabel.png", label: "White-label" },
    { src: "/images/toggle-anthropologie.png", label: "Anthropologie" },
    { src: "/images/toggle-urbanoutfitters.png", label: "Urban Outfitters" },
    { src: "/images/toggle-freepeople.png", label: "Free People" },
]

const PICKUP_STATES = [
    { title: "No pickup store selected", desc: "Default state. Prompts the shopper to choose a store.", desktop: "/images/state-no-store-desktop.png", mobile: "/images/state-no-store-mobile.png" },
    { title: "Pickup store unavailable", desc: "Disabled state. Explains that nothing is available at that store.", desktop: "/images/state-unavailable-desktop.png", mobile: "/images/state-unavailable-mobile.png" },
]

const BRANDS = [
    { name: "Urban Outfitters", href: "https://www.urbanoutfitters.com/womens-clothing", brandColor: "#11120C" },
    { name: "Free People", href: "https://www.freepeople.com/clothes", brandColor: "#D52975" },
    { name: "Anthropologie", href: "https://www.anthropologie.com/womens-clothing", brandColor: "#167A92" },
]

// ── Blocks ──────────────────────────────────────────────────────────────────

function DecisionBlock({ d, phone }: { d: typeof DECISIONS[number]; phone: boolean }) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1.1fr)",
            gap: phone ? 24 : 56,
            alignItems: "center",
        }}>
            <div>
                <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 600, color: C.olive, letterSpacing: "0.06em", margin: 0, marginBottom: 8 }}>{d.num}</p>
                <h3 style={{ fontFamily: Z, fontSize: phone ? 22 : 28, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0, marginBottom: 18 }}>{d.title}</h3>
                <Label>What testing showed</Label>
                <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.65, color: C.ink3, margin: 0, marginBottom: 12 }}>{d.saw}</p>
                <p style={{ fontFamily: Z, fontStyle: "italic", fontSize: phone ? 16 : 18, lineHeight: 1.4, color: C.ink, margin: 0, marginBottom: 24, paddingLeft: 14, borderLeft: `2px solid ${C.olive}` }}>
                    &ldquo;{d.quote}&rdquo;
                </p>
                <Label>What I changed</Label>
                <Bullets items={d.changes} />
            </div>
            <figure style={{ margin: 0 }}>
                {/* The recordings are full desktop screens; the filter drawer sits on the
                    right, so the frame is cropped to it to keep the UI legible. */}
                <div style={{ ...FRAME, position: "relative", aspectRatio: "0.72", boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05)" }}>
                    <video src={d.video} autoPlay loop muted playsInline aria-label={d.caption}
                        style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "auto", maxWidth: "none", display: "block" }} />
                </div>
                <Caption>{d.caption}</Caption>
            </figure>
        </div>
    )
}

function Stat({ value, label, phone }: { value: string; label: string; phone: boolean }) {
    return (
        <div>
            <p style={{ fontFamily: Z, fontSize: phone ? 44 : 56, fontWeight: 700, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1, margin: 0, marginBottom: 8 }}>{value}</p>
            <p style={{ fontFamily: INTER, fontSize: 13, lineHeight: 1.5, color: C.ink3, margin: 0, maxWidth: 260 }}>{label}</p>
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
                        style={{
                            display: "block", padding: "6px 0",
                            textDecoration: "none", transition: "opacity 0.3s ease",
                            opacity: isActive ? 1 : 0.35,
                        }}
                    >
                        <span style={{
                            fontFamily: INTER, fontSize: 10, fontWeight: isActive ? 700 : 400,
                            color: C.ink, letterSpacing: "0.06em", textTransform: "uppercase",
                            borderLeft: isActive ? `2px solid ${C.olive}` : "2px solid transparent",
                            paddingLeft: 12,
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
    const gap = phone ? 88 : 128

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <CaseStudyNav />

            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                gap: desktop ? 48 : undefined,
                maxWidth: 1400,
                margin: "0 auto",
                padding: `0 ${px}px 160px`,
            }}>
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 80, paddingTop: 40 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}

                <main style={{ minWidth: 0 }}>

                    {/* ════════ OVERVIEW ════════ */}
                    <section id="overview" style={{ scrollMarginTop: 80, paddingTop: phone ? 40 : 48 }}>
                        <FadeIn>
                            <Eyebrow>URBN · Anthropologie, Urban Outfitters, Free People</Eyebrow>
                            <h1 style={{
                                fontFamily: Z, fontWeight: 700, fontSize: "clamp(34px, 4.6vw, 58px)",
                                lineHeight: 1.04, letterSpacing: "-0.035em", color: C.ink,
                                maxWidth: 820, margin: 0, marginBottom: 20,
                            }}>
                                Redesigning product filters across three URBN brands
                            </h1>
                            <p style={{ fontFamily: INTER, fontSize: phone ? 15 : 17, lineHeight: 1.6, color: C.ink3, maxWidth: 640, margin: 0 }}>
                                Shoppers kept second-guessing the filter drawer. I redesigned it around four moments of doubt found in usability testing, then turned the new pickup toggle into one component that works for every brand.
                            </p>
                        </FadeIn>

                        {/* At a glance: the one-minute read */}
                        <FadeIn delay={80}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "1fr" : "repeat(3, minmax(0, 1fr))",
                                gap: phone ? 12 : 16,
                                marginTop: phone ? 32 : 44,
                            }}>
                                {[
                                    { k: "Problem", v: "Applying filters meant hopping between screens. Shoppers couldn’t tell what was selected, how to leave, or what “Available Within 24 Hours” meant." },
                                    { k: "My role", v: "UX Designer. I worked through testing with UX Research, designed the fixes, prototyped them in Builder.io, and designed and documented the pickup component." },
                                    { k: "Outcome", v: "100% task completion when the combined prototype was tested. Now live on Urban Outfitters, Free People and Anthropologie." },
                                ].map(({ k, v }) => (
                                    <div key={k} style={{ backgroundColor: C.surface, borderRadius: 14, padding: phone ? "20px 20px" : "24px 24px" }}>
                                        <Label>{k}</Label>
                                        <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.6, color: C.ink2, margin: 0 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{ marginTop: phone ? 32 : 48 }}>
                                <img src="/images/filter-comparison.webp" alt="The redesigned filter drawer on Free People, Urban Outfitters and Anthropologie mobile web" style={{ width: "100%", display: "block", borderRadius: 14 }} />
                                <Caption>The redesigned filter drawer, live on Free People, Urban Outfitters and Anthropologie.</Caption>
                            </div>
                        </FadeIn>

                        <FadeIn delay={140}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr) minmax(0, 1fr)" : "repeat(4, minmax(0, 1fr))",
                                gap: phone ? 16 : 32, marginTop: 36,
                                paddingTop: 28, borderTop: `1px solid ${C.border}`,
                            }}>
                                {([["Role", "UX Designer"], ["Timeline", "5 months"], ["Team", "PM, Engineering, UX Research, Brand"], ["Platforms", "Mobile Web and Desktop"]] as const).map(([k, v]) => (
                                    <div key={k}>
                                        <Label>{k}</Label>
                                        <p style={{ fontFamily: Z, fontWeight: 400, fontSize: 14, lineHeight: 1.4, color: C.ink2, margin: 0 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ PROBLEM ════════ */}
                    <section id="problem" style={{ scrollMarginTop: 80, marginTop: gap }}>
                        <FadeIn>
                            <Eyebrow>01 · The problem</Eyebrow>
                            <H2>One filter took four steps, and every extra filter repeated them</H2>
                            <Lede>
                                As catalogs grew across URBN brands, the filter drawer became the main way to narrow large catalogs. But applying a single filter meant opening the drawer, picking a category, confirming, and going back. Shoppers did that loop once per filter.
                            </Lede>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr) minmax(0, 1fr)" : "repeat(4, minmax(0, 1fr))",
                                gap: phone ? 16 : 24,
                                marginTop: phone ? 32 : 44,
                                alignItems: "start",
                            }}>
                                {OLD_FLOW.map((step) => (
                                    <figure key={step.num} style={{ margin: 0 }}>
                                        <div style={FRAME}>
                                            <img src={step.src} alt={`Old flow, step ${step.num}: ${step.title}`} style={{ width: "100%", height: "auto", display: "block" }} />
                                        </div>
                                        <figcaption style={{ marginTop: 12 }}>
                                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: C.olive, margin: 0, marginBottom: 4 }}>{step.num}</p>
                                            <p style={{ fontFamily: Z, fontSize: 15, fontWeight: 600, color: C.ink, lineHeight: 1.3, margin: 0, marginBottom: 3 }}>{step.title}</p>
                                            <p style={{ fontFamily: INTER, fontSize: 12.5, lineHeight: 1.5, color: C.ink3, margin: 0 }}>{step.caption}</p>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                            <Caption>The filter flow before the redesign, on mobile web.</Caption>
                        </FadeIn>
                    </section>

                    {/* ════════ ROLE & CONSTRAINTS ════════ */}
                    <section id="role" style={{ scrollMarginTop: 80, marginTop: gap }}>
                        <FadeIn>
                            <Eyebrow>02 · My role and constraints</Eyebrow>
                            <H2>What I owned, and what I had to work within</H2>
                        </FadeIn>
                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
                                gap: phone ? 28 : 56,
                                marginTop: phone ? 24 : 32,
                                paddingTop: 28, borderTop: `1px solid ${C.border}`,
                            }}>
                                <div>
                                    <Label>What I owned</Label>
                                    <Bullets items={[
                                        "Worked through the usability sessions with the UX Research team to find where shoppers hesitated",
                                        "Designed the four changes to the filter drawer",
                                        "Built the test prototype in Builder.io from existing design system components",
                                        "Designed the pickup toggle as a white-label component, adapted it for each brand, and documented it for engineering",
                                    ]} />
                                </div>
                                <div>
                                    <Label>Constraints</Label>
                                    <Bullets items={[
                                        "One pattern had to work for three brands with different visual languages",
                                        "Mobile Web and Desktop",
                                        "Built from URBN’s existing design system, which had no pattern for the new pickup toggle",
                                        "Five months, alongside PM, Engineering, UX Research and Brand",
                                    ]} />
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ WHAT TESTING REVEALED → DECISIONS ════════ */}
                    <section id="decisions" style={{ scrollMarginTop: 80, marginTop: gap }}>
                        <FadeIn>
                            <Eyebrow>03 · What testing revealed</Eyebrow>
                            <H2>Four moments of doubt, four design decisions</H2>
                            <Lede>
                                The same four hesitations kept showing up across usability sessions. None of them were missing features. Each one was a moment where shoppers stopped trusting what the drawer was doing, and each became a specific change.
                            </Lede>
                        </FadeIn>

                        <div style={{ display: "flex", flexDirection: "column", gap: phone ? 72 : 104, marginTop: phone ? 48 : 64 }}>
                            {DECISIONS.map((d) => (
                                <FadeIn key={d.num}>
                                    <DecisionBlock d={d} phone={phone} />
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* ════════ TESTING THE WHOLE FLOW ════════ */}
                    <section id="testing" style={{ scrollMarginTop: 80, marginTop: gap }}>
                        <FadeIn>
                            <Eyebrow>04 · Testing the whole flow</Eyebrow>
                            <H2>All four changes, tested as one flow before development</H2>
                            <Lede>
                                I combined the four changes into a single interactive prototype so we could test the complete filtering experience, not isolated fixes.
                            </Lede>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "1fr" : "minmax(220px, 280px) minmax(0, 1fr)",
                                gap: phone ? 36 : 64,
                                alignItems: "start",
                                marginTop: phone ? 32 : 44,
                            }}>
                                <figure style={{ margin: 0, maxWidth: phone ? 260 : undefined }}>
                                    <div style={{ ...FRAME, backgroundColor: C.surface }}>
                                        <video src="/videos/prototype-walkthrough.mp4" autoPlay muted loop playsInline aria-label="Walkthrough of the interactive prototype" style={{ width: "100%", height: "auto", display: "block" }} />
                                    </div>
                                    <Caption>The Builder.io prototype used in usability testing.</Caption>
                                </figure>

                                <div>
                                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: phone ? 20 : 32, marginBottom: phone ? 32 : 44 }}>
                                        <Stat phone={phone} value="100%" label="task completion in usability testing of the combined prototype" />
                                        <Stat phone={phone} value="45%" label="faster to build a testable prototype, using Builder.io and existing design system components" />
                                    </div>
                                    <Label>What we observed</Label>
                                    <div>
                                        {OBSERVED.map((item, i) => (
                                            <div key={i} style={{ padding: "12px 0", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "baseline", gap: 12 }}>
                                                <span aria-hidden="true" style={{ fontFamily: INTER, fontSize: 11, color: C.olive, flexShrink: 0 }}>&#10003;</span>
                                                <p style={{ fontFamily: INTER, fontSize: 14, color: C.ink2, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ SCALING ACROSS BRANDS ════════ */}
                    <section id="system" style={{ scrollMarginTop: 80, marginTop: gap }}>
                        <FadeIn>
                            <Eyebrow>05 · Scaling across brands</Eyebrow>
                            <H2>One component, three brands</H2>
                            <Lede>
                                The pickup toggle had no equivalent in URBN’s design system. Instead of a one-off, I designed it as a white-label component first, then adapted it to each brand. The interaction stays the same everywhere. Color follows the brand.
                            </Lede>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr) minmax(0, 1fr)" : "repeat(4, minmax(0, 1fr))",
                                gap: phone ? 12 : 20,
                                marginTop: phone ? 32 : 44,
                            }}>
                                {BRAND_TOGGLES.map((b) => (
                                    <figure key={b.label} style={{ margin: 0 }}>
                                        <div style={FRAME}>
                                            <img src={b.src} alt={`${b.label} pickup toggle: default, selected and hover states`} style={{ width: "100%", height: "auto", display: "block" }} />
                                        </div>
                                        <figcaption style={{ fontFamily: INTER, fontSize: 12, fontWeight: 600, color: C.ink, marginTop: 10 }}>{b.label}</figcaption>
                                    </figure>
                                ))}
                            </div>
                            <Caption>Default, selected and hover states, white-label first, then each brand.</Caption>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <h3 style={{ fontFamily: Z, fontSize: phone ? 20 : 24, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", margin: 0, marginTop: phone ? 56 : 80, marginBottom: 8 }}>
                                Designed for every pickup state
                            </h3>
                            <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.65, color: C.ink3, margin: 0, maxWidth: 540, marginBottom: 28 }}>
                                The same interaction had to hold up when no store was chosen and when the chosen store had nothing available.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: phone ? 40 : 48 }}>
                                {PICKUP_STATES.map((st) => (
                                    <figure key={st.title} style={{ margin: 0 }}>
                                        <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "minmax(0, 3fr) minmax(0, 1fr)", gap: phone ? 12 : 20, alignItems: "start" }}>
                                            <div style={{ ...FRAME, backgroundColor: C.surface }}>
                                                <img src={st.desktop} alt={`${st.title}, desktop`} style={{ width: "100%", height: "auto", display: "block" }} />
                                            </div>
                                            <div style={{ ...FRAME, backgroundColor: C.surface, maxWidth: phone ? 220 : undefined }}>
                                                <img src={st.mobile} alt={`${st.title}, mobile`} style={{ width: "100%", height: "auto", display: "block" }} />
                                            </div>
                                        </div>
                                        <figcaption style={{ marginTop: 12 }}>
                                            <p style={{ fontFamily: Z, fontSize: 16, fontWeight: 600, color: C.ink, margin: 0, marginBottom: 2 }}>{st.title}</p>
                                            <p style={{ fontFamily: INTER, fontSize: 12.5, lineHeight: 1.5, color: C.ink3, margin: 0 }}>{st.desc} Desktop and mobile.</p>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
                                gap: phone ? 28 : 56,
                                alignItems: "start",
                                marginTop: phone ? 56 : 80,
                            }}>
                                <div>
                                    <h3 style={{ fontFamily: Z, fontSize: phone ? 20 : 24, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", margin: 0, marginBottom: 8 }}>
                                        From exploration to handoff
                                    </h3>
                                    <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.65, color: C.ink3, margin: 0, marginBottom: 20, maxWidth: 440 }}>
                                        I explored several toggle treatments before settling on the final pattern, then specified it for engineering.
                                    </p>
                                    <Bullets items={["Every state documented", "Interaction logic defined", "Copy variations documented", "Handed off to engineering for production"]} />
                                    <figure style={{ margin: 0, marginTop: 28, maxWidth: 420 }}>
                                        <div style={FRAME}>
                                            <img src="/images/toggle-explorations.png" alt="Early toggle explorations: filled, outline and colored treatments" style={{ width: "100%", height: "auto", display: "block" }} />
                                        </div>
                                        <Caption>Early toggle explorations.</Caption>
                                    </figure>
                                </div>
                                <figure style={{ margin: 0 }}>
                                    <div style={FRAME}>
                                        <img src="/images/toggle-specs.png" alt="Spec for the proposed web toggle: sizes, knob fill, checkmark and knob placement" style={{ width: "100%", height: "auto", display: "block" }} />
                                    </div>
                                    <Caption>Part of the spec handed to engineering: size, knob fill, checkmark and placement.</Caption>
                                </figure>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ OUTCOME ════════ */}
                    <section id="outcome" style={{ scrollMarginTop: 80, marginTop: gap }}>
                        <FadeIn>
                            <Eyebrow>06 · Outcome</Eyebrow>
                            <H2>Live on all three brands</H2>
                            <Lede>
                                The redesigned drawer and the pickup toggle are live on Urban Outfitters, Free People and Anthropologie, on Mobile Web and Desktop.
                            </Lede>
                        </FadeIn>

                        <FadeIn delay={40}>
                            <div style={{ display: "flex", gap: phone ? 10 : 16, flexWrap: "wrap", marginTop: 28 }}>
                                {BRANDS.map((brand) => (
                                    <a key={brand.name} href={brand.href} target="_blank" rel="noopener noreferrer" style={{
                                        fontFamily: INTER, fontSize: 14, fontWeight: 600, color: C.ink,
                                        textDecoration: "none", padding: "12px 24px",
                                        borderRadius: 100, border: `1px solid ${C.border}`,
                                        transition: "all 0.25s ease",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = brand.brandColor; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = brand.brandColor }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = C.ink; e.currentTarget.style.borderColor = C.border }}
                                    >
                                        {brand.name} &nbsp;&#8599;
                                    </a>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "1fr" : "repeat(3, minmax(0, 1fr))",
                                gap: phone ? 24 : 32,
                                marginTop: phone ? 48 : 64,
                                paddingTop: 28, borderTop: `1px solid ${C.border}`,
                            }}>
                                <Stat phone={phone} value="100%" label="task completion in prototype testing" />
                                <Stat phone={phone} value="3" label="brands live with the redesigned drawer" />
                                <Stat phone={phone} value="1" label="pickup component shared by every brand" />
                            </div>
                        </FadeIn>

                        <FadeIn delay={80}>
                            <div style={{ marginTop: phone ? 64 : 96, maxWidth: 720 }}>
                                <p style={{
                                    fontFamily: Z, fontStyle: "italic", fontWeight: 400,
                                    fontSize: "clamp(24px, 3.2vw, 38px)", lineHeight: 1.25,
                                    color: C.ink, letterSpacing: "-0.025em", margin: 0, marginBottom: 20,
                                }}>
                                    Designing better filters wasn&rsquo;t the goal. Building confidence was.
                                </p>
                                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.7, color: C.ink3, margin: 0, maxWidth: 560 }}>
                                    Almost every problem in testing was a moment of uncertainty, not a missing feature. Clear selected states, honest copy and an obvious way out did more than anything new would have.
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* Back to work */}
                    <div style={{
                        paddingTop: 48,
                        marginTop: 96,
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <a
                            href="/#work"
                            style={{
                                fontFamily: INTER,
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#8A8A82",
                                textDecoration: "none",
                                letterSpacing: "-0.01em",
                                transition: "color 0.18s",
                                minHeight: 44,
                                display: "flex",
                                alignItems: "center",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#111111")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8A82")}
                        >
                            ← Back to work
                        </a>
                    </div>

                </main>
            </div>
        </div>
    )
}
