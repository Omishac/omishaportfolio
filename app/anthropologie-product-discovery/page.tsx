"use client"

import React, { useState, useRef, useEffect } from "react"

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
    { id: "challenge", label: "Challenge" },
    { id: "research", label: "Research" },
    { id: "goal", label: "Design Goal" },
    { id: "strategy", label: "Strategy" },
    { id: "prototyping", label: "Prototyping" },
    { id: "validation", label: "Validation" },
    { id: "component", label: "Component" },
    { id: "platforms", label: "Platforms" },
    { id: "live", label: "See It Live" },
    { id: "impact", label: "Impact" },
    { id: "looking-back", label: "Looking Back" },
]

function useResponsive() {
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    useEffect(() => {
        const check = () => { const w = window.innerWidth; setPhone(w < 768); setTablet(w >= 768 && w < 1024) }
        check()
        window.addEventListener("resize", check, { passive: true })
        return () => window.removeEventListener("resize", check)
    }, [])
    return { phone, tablet, desktop: !phone && !tablet }
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
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(32px)",
            transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}>{children}</div>
    )
}

function ImpactCard({ value, label, phone }: { value: string; label: string; phone: boolean }) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                backgroundColor: hov ? C.ink : C.surface,
                borderRadius: 14,
                padding: phone ? "32px 20px" : "44px 28px",
                textAlign: "center",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
                transform: hov ? "translateY(-6px)" : "none",
                boxShadow: hov ? "0 16px 48px rgba(0,0,0,0.10)" : "0 0 0 rgba(0,0,0,0)",
                cursor: "default",
            }}
        >
            <p style={{
                fontFamily: Z, fontSize: phone ? 40 : 52, fontWeight: 700,
                color: hov ? "#fff" : C.ink,
                letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 12,
                transition: "color 0.35s ease",
            }}>{value}</p>
            <p style={{
                fontFamily: INTER, fontSize: 11, fontWeight: 600,
                color: hov ? "rgba(255,255,255,0.5)" : C.muted,
                letterSpacing: "0.06em", textTransform: "uppercase", margin: 0,
                transition: "color 0.35s ease",
            }}>{label}</p>
        </div>
    )
}

function BrandCard({ name, href, phone }: { name: string; href: string; phone: boolean }) {
    const [hov, setHov] = useState(false)
    return (
        <a href={href} target="_blank" rel="noreferrer"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                padding: phone ? "20px 24px" : "28px 36px",
                backgroundColor: hov ? C.ink : C.surface,
                color: hov ? "#fff" : C.ink,
                borderRadius: 12,
                textDecoration: "none",
                transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                transform: hov ? "translateY(-3px)" : "none",
                boxShadow: hov ? "0 8px 32px rgba(0,0,0,0.08)" : "none",
                fontFamily: INTER, fontSize: phone ? 13 : 15, fontWeight: 600,
                letterSpacing: "-0.01em",
            }}
        >
            {name}
            <span style={{
                fontSize: 14, transition: "transform 0.3s ease",
                transform: hov ? "translate(2px, -2px)" : "none",
                display: "inline-block",
            }}>&#8599;</span>
        </a>
    )
}

const STRATEGIES = [
    {
        num: "01", title: "Make Selections More Visible",
        problem: "Selected filters lacked visibility. Users couldn't tell which filters were active.",
        changes: ["Introduced checkboxes", "Improved selected-state visibility", "Repositioned active refinements"],
        why: "Users receive clearer feedback and can immediately understand which filters have been applied.",
        video: "/videos/strategy-01-selections.mov",
    },
    {
        num: "02", title: "Reduce Navigation Friction",
        problem: "Multi-filter workflows felt fragile. Users questioned whether previous selections remained active.",
        changes: ["Introduced accordion architecture", "Improved movement between filter groups", "Reduced backtracking"],
        why: "Users can explore multiple filters without questioning whether previous selections remain active.",
        video: "/videos/strategy-02-navigation.mov",
    },
    {
        num: "03", title: "Create a Clear Exit Path",
        problem: "Exiting the drawer was unclear. Users didn't know how to leave without applying filters.",
        changes: ["Introduced contextual Done behavior", "Clarified exit actions", "Improved drawer navigation"],
        why: "Users always understand how to continue their shopping journey.",
        video: "/videos/strategy-03-exit.mov",
    },
    {
        num: "04", title: "Clarify Store Pickup Availability",
        problem: "Inventory language created confusion. Users read \"Available Within 24 Hours\" as a shipping promise.",
        changes: ["Introduced new pickup toggle behavior", "Improved copy hierarchy", "Supported multiple pickup states"],
        why: "Users can better understand product availability and make more informed decisions.",
        video: "/videos/strategy-04-inventory.mov",
    },
]

function StrategyBlock({ s, phone }: { s: typeof STRATEGIES[number]; phone: boolean }) {
    if (phone) {
        return (
            <div>
                <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)", marginBottom: 28 }}>
                    <video src={s.video} autoPlay loop muted playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive }}>{s.num}</span>
                    <span style={{ width: 24, height: 1, backgroundColor: C.border }} />
                </div>
                <h3 style={{ fontFamily: Z, fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 16 }}>{s.title}</h3>
                <p style={{ fontFamily: INTER, fontSize: 13.5, color: C.ink3, lineHeight: 1.65, marginBottom: 20 }}>{s.problem}</p>
                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>What We Changed</p>
                {s.changes.map((c, ci) => (
                    <p key={ci} style={{ fontFamily: INTER, fontSize: 13.5, color: C.ink2, lineHeight: 1.65, margin: 0, marginBottom: ci < s.changes.length - 1 ? 4 : 0 }}>{c}</p>
                ))}
                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 16 }}>
                    <p style={{ fontFamily: Z, fontSize: 16, fontWeight: 500, fontStyle: "italic", color: C.ink, lineHeight: 1.45, margin: 0 }}>{s.why}</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48, alignItems: "center" }}>
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <span style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive }}>{s.num}</span>
                    <span style={{ width: 24, height: 1, backgroundColor: C.border }} />
                </div>
                <h3 style={{ fontFamily: Z, fontSize: 28, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 18 }}>{s.title}</h3>

                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>Problem</p>
                <p style={{ fontFamily: INTER, fontSize: 13.5, color: C.ink3, lineHeight: 1.65, marginBottom: 24 }}>{s.problem}</p>

                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>What We Changed</p>
                {s.changes.map((c, ci) => (
                    <p key={ci} style={{ fontFamily: INTER, fontSize: 13.5, color: C.ink2, lineHeight: 1.65, margin: 0, marginBottom: ci < s.changes.length - 1 ? 4 : 0 }}>{c}</p>
                ))}

                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 18 }}>
                    <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>Why It Matters</p>
                    <p style={{ fontFamily: Z, fontSize: 18, fontWeight: 500, fontStyle: "italic", color: C.ink, lineHeight: 1.45, margin: 0 }}>{s.why}</p>
                </div>
            </div>

            <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)" }}>
                <video src={s.video} autoPlay loop muted playsInline style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
        </div>
    )
}

function ResearchCard({ num, title, desc, quote, phone }: { num: string; title: string; desc: string; quote: string; phone: boolean }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ position: "relative", paddingTop: phone ? 0 : 40 }}
        >
            {!phone && (
                <div style={{
                    position: "absolute", top: 0, left: 28, right: 28,
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    pointerEvents: "none", zIndex: 2,
                }}>
                    <div style={{
                        backgroundColor: "#FAFAF7",
                        borderRadius: 10,
                        padding: "10px 16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}>
                        <span style={{
                            fontFamily: Z, fontSize: 20, fontWeight: 400, color: C.olive,
                            lineHeight: 1, marginRight: 6, verticalAlign: "top",
                        }}>"</span>
                        <span style={{
                            fontFamily: Z, fontSize: 13.5, fontStyle: "italic", color: C.ink3,
                            lineHeight: 1.5,
                        }}>{quote.replace(/“|”|"/g, "")}</span>
                    </div>
                </div>
            )}
            <div style={{
                backgroundColor: hovered && !phone ? C.ink : C.surface, borderRadius: 14,
                padding: phone ? "28px 24px" : "36px 32px",
                transform: hovered && !phone ? "translateY(-3px)" : "none",
                boxShadow: hovered && !phone ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                transition: "background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
            }}>
                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: hovered && !phone ? "rgba(255,255,255,0.4)" : C.olive, marginBottom: 12, transition: "color 0.3s ease" }}>{num}</p>
                <p style={{ fontFamily: Z, fontSize: phone ? 18 : 21, fontWeight: 600, color: hovered && !phone ? "#fff" : C.ink, lineHeight: 1.25, marginBottom: 12, transition: "color 0.3s ease" }}>{title}</p>
                <p style={{ fontFamily: INTER, fontSize: 13.5, lineHeight: 1.65, color: hovered && !phone ? "rgba(255,255,255,0.6)" : C.ink3, margin: 0, transition: "color 0.3s ease" }}>{desc}</p>
            </div>
        </div>
    )
}

function Placeholder({ label, aspect = "56.25%", dark = false }: { label: string; aspect?: string; dark?: boolean }) {
    return (
        <div style={{
            width: "100%", paddingTop: aspect, position: "relative", borderRadius: 14, overflow: "hidden",
            backgroundColor: dark ? C.ink : C.surface, border: dark ? "none" : `1px solid ${C.border}`,
        }}>
            <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <span style={{
                    fontFamily: INTER, fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.25)" : C.muted,
                }}>{label}</span>
            </div>
        </div>
    )
}

function SideNav({ active }: { active: string }) {
    return (
        <nav>
            {SECTIONS.map(({ id, label }) => {
                const isActive = active === id
                return (
                    <a key={id} href={`#${id}`}
                        onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                        style={{
                            display: "block", padding: "6px 0",
                            textDecoration: "none", transition: "opacity 0.3s ease",
                            opacity: isActive ? 1 : 0.3,
                        }}
                    >
                        <span style={{
                            fontFamily: INTER, fontSize: 10, fontWeight: isActive ? 700 : 400,
                            color: C.ink, letterSpacing: "0.06em", textTransform: "uppercase",
                            transition: "font-weight 0.2s",
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
    const [menuOpen, setMenuOpen] = useState(false)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        const onResize = () => setPhone(window.innerWidth < 768)
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
            <nav style={{
                position: "sticky", top: 0, zIndex: 100, width: "100%", height: phone ? 54 : 64,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: `0 ${phone ? 20 : 80}px`, boxSizing: "border-box",
                backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : C.bg,
                backdropFilter: scrolled ? "blur(20px)" : "none", WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.09)" : C.border}`,
                transition: "background 0.25s, border-color 0.25s",
            }}>
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
                    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                        {links.map(({ label, href, ext }) => (
                            <a key={label} href={href} target={ext ? "_blank" : "_self"} rel="noreferrer"
                                style={{ fontFamily: INTER, fontSize: 14, fontWeight: 500, color: C.ink3, textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.18s", minHeight: 44, display: "flex", alignItems: "center" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = C.ink3)}>
                                {label}
                            </a>
                        ))}
                    </div>
                )}
            </nav>
            {menuOpen && (
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 999, backgroundColor: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", display: "flex", flexDirection: "column", padding: "24px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
                        <img src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png" alt="OC" style={{ width: 48, height: 48, objectFit: "contain" }} />
                        <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: C.ink, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>&#10005;</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {links.map(({ label, href, ext }) => (
                            <a key={label} href={href} target={ext ? "_blank" : "_self"} rel="noreferrer" onClick={() => setMenuOpen(false)}
                                style={{ fontFamily: INTER, fontSize: 28, fontWeight: 600, color: C.ink, textDecoration: "none", letterSpacing: "-0.02em", minHeight: 52, display: "flex", alignItems: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 12, paddingTop: 12 }}>
                                {label}
                            </a>
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

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <CaseStudyNav />

            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                gap: desktop ? 48 : undefined,
                maxWidth: 1400,
                margin: "0 auto",
                padding: `0 ${px}px 180px`,
            }}>
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 80, paddingTop: 40 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}

                <div>

                    {/* ════════ OVERVIEW ════════ */}
                    <section id="overview" style={{ scrollMarginTop: 80, paddingTop: phone ? 48 : 40 }}>
                        <FadeIn>
                            <img src="/images/filter-comparison.png" alt="Filter experience across Free People, Urban Outfitters, and Anthropologie" style={{ width: "100%", display: "block", borderRadius: 14 }} />
                        </FadeIn>

                        <FadeIn delay={80}>
                            <div style={{
                                display: desktop ? "grid" : "block",
                                gridTemplateColumns: desktop ? "1.3fr 1fr" : undefined,
                                gap: desktop ? 64 : 0,
                                marginTop: 48,
                            }}>
                                <div>
                                    <p style={{
                                        fontFamily: INTER, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
                                        textTransform: "uppercase", color: C.olive, marginBottom: 20,
                                    }}>
                                        URBN: Anthropologie · Urban Outfitters · Free People
                                    </p>
                                    <h1 style={{
                                        fontFamily: Z, fontWeight: 700, fontSize: "clamp(32px, 4.5vw, 56px)",
                                        lineHeight: 1.05, letterSpacing: "-0.035em", color: C.ink,
                                        marginBottom: desktop ? 0 : 24,
                                    }}>
                                        Redesigning Product Filters Across the URBN Ecosystem
                                    </h1>
                                </div>
                                <div style={{ paddingTop: desktop ? 36 : 0 }}>
                                    <p style={{
                                        fontFamily: INTER, fontSize: 14, lineHeight: 1.7,
                                        color: C.ink3, marginBottom: 20,
                                    }}>
                                        Improving product discovery across Mobile Web and Desktop for Anthropologie, Urban Outfitters, and Free People.
                                    </p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                                        {["Product Design", "Design Systems", "E-Commerce"].map(tag => (
                                            <span key={tag} style={{
                                                fontFamily: INTER, fontSize: 11, fontWeight: 500, color: C.ink3,
                                                border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px",
                                            }}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4, 1fr)",
                                gap: phone ? 16 : 32, marginTop: 40,
                                paddingTop: 32, borderTop: `1px solid ${C.border}`,
                            }}>
                                {([["Role", "UX Designer"], ["Timeline", "5 Months"], ["Company", "URBN"], ["Team", "PM · Eng · Research · Brand"]] as const).map(([k, v]) => (
                                    <div key={k}>
                                        <p style={{ fontFamily: INTER, fontWeight: 700, fontSize: 9, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>{k}</p>
                                        <p style={{ fontFamily: Z, fontWeight: 400, fontSize: 14, color: C.ink2, margin: 0 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                    </section>

                    {/* ════════ CHALLENGE ════════ */}
                    <section id="challenge" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Challenge</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
                                The existing filtering experience
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 600, marginBottom: 24 }}>
                                Product filters play a critical role in helping shoppers navigate large product catalogs. As assortments expanded across URBN brands, we wanted to better understand how the filtering experience supported product discovery across Mobile Web and Desktop.
                            </p>
                            <p style={{
                                fontFamily: Z, fontSize: phone ? 20 : 24, fontWeight: 600, color: C.ink,
                                lineHeight: 1.4, maxWidth: 520, letterSpacing: "-0.01em", marginBottom: 56,
                            }}>
                                Users moved between multiple screens to apply and review filters.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "1fr" : "1fr auto 1fr auto 1fr auto 1fr",
                                gap: phone ? 32 : 0,
                                alignItems: "start",
                            }}>
                                {[
                                    { num: "01", title: "Open Filters", caption: "Start from a centralized filter drawer.", src: "/images/Sort%20Modal.png" },
                                    { num: "02", title: "Choose Filter", caption: "Select a category to refine results.", src: "/images/Sort%20Modal-1.png" },
                                    { num: "03", title: "Make Selection", caption: "Apply filter options.", src: "/images/Sort%20Modal%202.png" },
                                    { num: "04", title: "Return & Review", caption: "Review applied selections.", src: "/images/Sort%20Modal-2.png" },
                                ].map((screen, i) => (
                                    <React.Fragment key={i}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                            <div style={{
                                                borderRadius: 10, overflow: "hidden",
                                                border: `1px solid ${C.border}`,
                                            }}>
                                                <img
                                                    src={screen.src}
                                                    alt={screen.title}
                                                    style={{ width: "100%", height: "auto", display: "block" }}
                                                />
                                            </div>
                                            <div style={{ padding: "0 2px" }}>
                                                <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.olive, marginBottom: 5 }}>{screen.num}</p>
                                                <p style={{ fontFamily: Z, fontSize: phone ? 15 : 16, fontWeight: 600, color: C.ink, lineHeight: 1.3, marginBottom: 4 }}>{screen.title}</p>
                                                <p style={{ fontFamily: INTER, fontSize: 12.5, lineHeight: 1.55, color: C.ink3 }}>{screen.caption}</p>
                                            </div>
                                        </div>
                                        {i < 3 && !phone && (
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px", marginTop: "38%" }}>
                                                <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                                                    <path d="M0 6h22M18 1l5 5-5 5" stroke={C.muted} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                                                </svg>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </FadeIn>

                    </section>

                    {/* ════════ RESEARCH FINDINGS ════════ */}
                    <section id="research" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Research Findings</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
                                Four patterns that shaped our direction
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 560, marginBottom: 56 }}>
                                Partnering with the UX Research team, we analyzed usability testing sessions to understand where users experienced friction throughout the filtering journey. Across participants, four recurring patterns emerged.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: phone ? 16 : 20,
                            }}>
                                {[
                                    { num: "01", title: "Selected Filters Lacked Visibility", desc: "Users struggled to determine which filters were currently active after making a selection.", quote: "“I can’t tell if that filter actually applied?”" },
                                    { num: "02", title: "Multi-Filter Workflows Felt Fragile", desc: "Participants questioned whether previous selections remained active while navigating between filter groups.", quote: "“Are my previous filters still selected?”" },
                                    { num: "03", title: "Exiting the Drawer Was Unclear", desc: "Users struggled to understand how to leave the filtering experience without applying filters.", quote: "“How do I close this?”" },
                                    { num: "04", title: "Inventory Language Created Confusion", desc: "Participants frequently interpreted “Available Within 24 Hours” as a shipping promise rather than local inventory availability.", quote: "“Does available within 24 hours mean shipping?”" },
                                ].map((item, i) => (
                                    <ResearchCard key={i} num={item.num} title={item.title} desc={item.desc} quote={item.quote} phone={phone} />
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ DESIGN GOAL ════════ */}
                    <section id="goal" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <div style={{ padding: phone ? "64px 0" : "100px 0" }}>
                                <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 28 }}>Design Goal</p>
                                <p style={{
                                    fontFamily: Z, fontStyle: "italic", fontWeight: 400,
                                    fontSize: "clamp(24px, 3.5vw, 42px)", lineHeight: 1.3,
                                    color: C.ink, letterSpacing: "-0.025em", maxWidth: 720, margin: 0,
                                }}>
                                    How might we create a filtering experience that feels clear, predictable, and easy to navigate?
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ STRATEGY ════════ */}
                    <section id="strategy" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Strategy</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
                                Four concepts tested and refined
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 560, marginBottom: 72 }}>
                                Based on the research findings, the redesign focused on reducing uncertainty throughout the filtering experience by making interactions clearer, more predictable, and easier to navigate.
                            </p>
                        </FadeIn>

                        <div style={{ display: "flex", flexDirection: "column", gap: phone ? 64 : 96 }}>
                            {STRATEGIES.map((s, i) => (
                                <FadeIn key={i} delay={60}>
                                    <StrategyBlock s={s} phone={phone} />
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* ════════ PROTOTYPING FOR VALIDATION ════════ */}
                    <section id="prototyping" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Prototyping for Validation</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
                                Accelerating learning through rapid prototyping
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 560, marginBottom: 56 }}>
                                Once the design direction was established, the next step was validating it with users. Using Builder.io and URBN's existing design system components, I rapidly transformed design concepts into a testable experience, reducing prototype creation and testing preparation time by 45%.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Placeholder label="Interactive prototype: redesigned filter experience" aspect="56%" />
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
                                gap: phone ? 8 : 12, marginTop: 48,
                                padding: phone ? "36px 20px" : "48px 40px",
                                backgroundColor: C.surface, borderRadius: 14,
                            }}>
                                {["Research Findings", "Design Strategy", "Builder Prototype", "User Testing", "Iteration", "Final Design"].map((step, i) => (
                                    <React.Fragment key={i}>
                                        <span style={{
                                            fontFamily: INTER, fontSize: phone ? 11 : 13, fontWeight: 600,
                                            color: C.ink2, letterSpacing: "-0.01em",
                                            padding: phone ? "8px 14px" : "10px 20px",
                                            backgroundColor: C.bg, borderRadius: 8,
                                            border: `1px solid ${C.border}`,
                                        }}>{step}</span>
                                        {i < 5 && <span style={{ fontFamily: INTER, fontSize: 14, color: C.muted }}>&#8594;</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={160}>
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                padding: phone ? "48px 24px" : "64px 48px",
                                backgroundColor: C.ink, borderRadius: 14, marginTop: 24,
                            }}>
                                <div style={{ textAlign: "center" }}>
                                    <p style={{ fontFamily: Z, fontSize: phone ? 56 : 80, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 12 }}>45%</p>
                                    <p style={{ fontFamily: INTER, fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, maxWidth: 320 }}>
                                        Faster prototype validation
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ VALIDATION ════════ */}
                    <section id="validation" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Validation</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
                                100% task completion
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 560, marginBottom: 48 }}>
                                The redesigned experience was tested with users to evaluate whether the proposed solutions addressed the friction identified during research.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                backgroundColor: C.ink, borderRadius: 16, padding: phone ? "48px 28px" : "72px 64px",
                                textAlign: "center", marginBottom: 48,
                            }}>
                                <p style={{ fontFamily: Z, fontSize: phone ? 64 : 96, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16 }}>100%</p>
                                <p style={{ fontFamily: INTER, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                                    Task completion rate
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                {[
                                    "Users successfully selected multiple filters before applying",
                                    "Checkbox interactions improved visibility and control",
                                    "Updated CTA removed confusion around exiting the drawer",
                                    "Inventory toggles were clearly understood",
                                    "Reordered selections felt intuitive and easy to follow",
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding: phone ? "18px 0" : "18px 24px",
                                        borderBottom: `1px solid ${C.border}`,
                                        display: "flex", alignItems: "center", gap: 14,
                                    }}>
                                        <span style={{
                                            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                            backgroundColor: "rgba(137,144,100,0.15)", display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <span style={{ fontFamily: INTER, fontSize: 10, color: C.olive }}>&#10003;</span>
                                        </span>
                                        <p style={{ fontFamily: INTER, fontSize: 14, color: C.ink2, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ COMPONENT DESIGN ════════ */}
                    <section id="component" style={{ scrollMarginTop: 80, marginTop: 120 }}>

                        {/* Intro */}
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Component Design</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
                                Designing a Clearer Pickup Experience
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 560, marginBottom: 80 }}>
                                Store pickup options were one of the most misunderstood parts of the filtering experience. Users often struggled to understand whether products were available nearby and what different pickup states meant. To address this, I designed a new toggle pattern that clarified store availability while supporting multiple pickup scenarios across Mobile Web and Desktop.
                            </p>
                        </FadeIn>

                        {/* ── Part 1: The Problem ── */}
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>The Problem</p>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 560, marginBottom: 32 }}>
                                Usability testing revealed confusion around pickup availability and store-specific inventory states. Existing filtering patterns did not clearly communicate these scenarios.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Placeholder label="Current pickup filter experience: user confusion points" aspect={phone ? "56%" : "40%"} />
                        </FadeIn>

                        {/* ── Part 2: Exploring Solutions ── */}
                        <FadeIn>
                            <div style={{ marginTop: 80 }}>
                                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Exploring Solutions</p>
                                <h3 style={{ fontFamily: Z, fontSize: phone ? 24 : 32, fontWeight: 700, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.1, marginBottom: 32 }}>
                                    Testing different interaction patterns
                                </h3>
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4, 1fr)",
                                gap: phone ? 12 : 16,
                            }}>
                                {["Version 1", "Version 2", "Version 3", "Final Direction"].map((v, i) => (
                                    <div key={i} style={{
                                        backgroundColor: i === 3 ? C.ink : C.surface,
                                        borderRadius: 12, overflow: "hidden",
                                    }}>
                                        <div style={{
                                            width: "100%", paddingTop: "120%", position: "relative",
                                        }}>
                                            <div style={{
                                                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <span style={{
                                                    fontFamily: INTER, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                                                    textTransform: "uppercase", color: i === 3 ? "rgba(255,255,255,0.25)" : C.muted,
                                                }}>Iteration</span>
                                            </div>
                                        </div>
                                        <div style={{ padding: phone ? "14px" : "16px 20px" }}>
                                            <p style={{
                                                fontFamily: INTER, fontSize: 11, fontWeight: 600,
                                                color: i === 3 ? "#fff" : C.ink, margin: 0,
                                            }}>{v}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={90}>
                            <p style={{
                                fontFamily: INTER, fontSize: 13, lineHeight: 1.7, color: C.ink3,
                                marginTop: 24, maxWidth: 600,
                            }}>
                                Multiple interaction patterns were explored to improve clarity, reduce ambiguity, and align with existing filtering behaviors.
                            </p>
                        </FadeIn>

                        {/* ── Part 3: Final Component ── */}
                        <FadeIn>
                            <div style={{ marginTop: 80 }}>
                                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Final Component</p>
                                <h3 style={{ fontFamily: Z, fontSize: phone ? 24 : 32, fontWeight: 700, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.1, marginBottom: 32 }}>
                                    The selected direction
                                </h3>
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Placeholder label="Final pickup toggle: default, active, and production states in context" aspect={phone ? "80%" : "50%"} />
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                backgroundColor: C.surface, borderRadius: 14,
                                padding: phone ? "24px" : "32px 36px",
                                marginTop: 24,
                                display: "flex", flexDirection: phone ? "column" : "row",
                                alignItems: phone ? "flex-start" : "center",
                                gap: phone ? 16 : 32,
                            }}>
                                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive, textTransform: "uppercase", margin: 0, flexShrink: 0 }}>Designed for</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: phone ? 12 : 24 }}>
                                    {["Store Availability", "Pickup Visibility", "Cross-Platform Consistency"].map((item, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{
                                                width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                                                backgroundColor: "rgba(137,144,100,0.15)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <span style={{ fontFamily: INTER, fontSize: 8, color: C.olive }}>&#10003;</span>
                                            </span>
                                            <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink2, margin: 0 }}>{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* ── Part 4: Supporting Different Pickup States ── */}
                        <FadeIn>
                            <div style={{ marginTop: 80 }}>
                                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Pickup States</p>
                                <h3 style={{ fontFamily: Z, fontSize: phone ? 24 : 32, fontWeight: 700, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.1, marginBottom: 32 }}>
                                    Supporting Different Pickup States
                                </h3>
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: phone ? 16 : 20,
                            }}>
                                {[
                                    { num: "01", title: "No Pickup Store Selected", desc: "The toggle remains hidden until a pickup location has been selected." },
                                    { num: "02", title: "Pickup Store Selected", desc: "Users can filter products available at their selected pickup location." },
                                    { num: "03", title: "Pickup Store Unavailable", desc: "Updated messaging explains why pickup is unavailable while maintaining clarity around availability." },
                                    { num: "04", title: "Hidden Toggle State", desc: "The component is removed when the functionality is not relevant to the user's context." },
                                ].map((state, i) => (
                                    <div key={i} style={{
                                        borderRadius: 14, overflow: "hidden",
                                        border: `1px solid ${C.border}`,
                                    }}>
                                        <div style={{
                                            width: "100%", paddingTop: "65%", position: "relative",
                                            backgroundColor: C.surface,
                                        }}>
                                            <div style={{
                                                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <span style={{
                                                    fontFamily: INTER, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                                                    textTransform: "uppercase", color: C.muted,
                                                }}>Pickup state screenshot</span>
                                            </div>
                                        </div>
                                        <div style={{ padding: phone ? "20px" : "24px 28px" }}>
                                            <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive, marginBottom: 10 }}>State {state.num}</p>
                                            <p style={{ fontFamily: Z, fontSize: phone ? 17 : 19, fontWeight: 700, color: C.ink, lineHeight: 1.25, marginBottom: 8 }}>{state.title}</p>
                                            <p style={{ fontFamily: INTER, fontSize: 12.5, lineHeight: 1.6, color: C.ink3, margin: 0 }}>{state.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        {/* ── Part 5: Implementation Ready ── */}
                        <FadeIn>
                            <div style={{ marginTop: 80 }}>
                                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Implementation Ready</p>
                                <h3 style={{ fontFamily: Z, fontSize: phone ? 24 : 32, fontWeight: 700, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.1, marginBottom: 32 }}>
                                    Documented for development
                                </h3>
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: phone ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
                                gap: phone ? 16 : 20,
                            }}>
                                <Placeholder label="Component specifications: interaction behavior, state logic" aspect={phone ? "65%" : "85%"} />
                                <Placeholder label="Annotations: copy variations, component documentation" aspect={phone ? "65%" : "85%"} />
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                backgroundColor: C.surface, borderRadius: 14,
                                padding: phone ? "28px" : "32px 36px",
                                marginTop: 20,
                                display: "flex", flexDirection: phone ? "column" : "row",
                                alignItems: phone ? "flex-start" : "flex-start",
                                gap: phone ? 20 : 48,
                            }}>
                                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive, textTransform: "uppercase", margin: 0, flexShrink: 0, paddingTop: 2 }}>Implementation Ready</p>
                                <div style={{
                                    display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                    gap: phone ? 10 : 12, flex: 1,
                                }}>
                                    {[
                                        "States documented",
                                        "Copy variations defined",
                                        "Interaction logic mapped",
                                        "Edge cases considered",
                                        "Engineering handoff completed",
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{
                                                width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                                                backgroundColor: "rgba(137,144,100,0.15)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <span style={{ fontFamily: INTER, fontSize: 8, color: C.olive }}>&#10003;</span>
                                            </span>
                                            <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink2, margin: 0, lineHeight: 1.4 }}>{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ DESIGNING ACROSS PLATFORMS ════════ */}
                    <section id="platforms" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Designing Across Platforms</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
                                Extending the solution beyond mobile
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 560, marginBottom: 56 }}>
                                The research findings and design strategy informed recommendations across Mobile Web, Desktop, and future native app considerations. Consistency across platforms was a core design principle throughout the project.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Placeholder label="Mobile Web: final filter drawer experience" aspect="75%" />
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: phone ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
                                gap: 16, marginTop: 24,
                            }}>
                                <Placeholder label="Desktop: expanded filter panel recommendations" aspect="65%" />
                                <Placeholder label="Cross-platform: inventory visibility consistency" aspect="65%" />
                            </div>
                        </FadeIn>

                        <FadeIn delay={160}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(3, 1fr)",
                                gap: 0, marginTop: 48, borderTop: `1px solid ${C.border}`,
                            }}>
                                {[
                                    { platform: "Mobile Web", desc: "Redesigned filter drawer shipped across all three brands" },
                                    { platform: "Desktop", desc: "Filter panel recommendations informed by mobile learnings" },
                                    { platform: "Future Native", desc: "Component specs designed for cross-platform reuse" },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding: phone ? "24px 0" : "28px 24px 28px 0",
                                        borderBottom: phone ? `1px solid ${C.border}` : "none",
                                        borderRight: !phone && i < 2 ? `1px solid ${C.border}` : "none",
                                        paddingLeft: !phone && i > 0 ? 24 : 0,
                                    }}>
                                        <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive, marginBottom: 10, textTransform: "uppercase" }}>{item.platform}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 13, lineHeight: 1.6, color: C.ink3, margin: 0 }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ SEE IT LIVE ════════ */}
                    <section id="live" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>See It Live</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 16 }}>
                                This redesign is live
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.75, color: C.ink3, maxWidth: 520, marginBottom: 48 }}>
                                This redesign is currently powering product filtering across Urban Outfitters, Free People, and Anthropologie. Visit any product listing page and open Filters to explore the redesigned experience.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(3, 1fr)",
                                gap: phone ? 12 : 16,
                            }}>
                                <BrandCard name="Urban Outfitters" href="https://www.urbanoutfitters.com/womens-clothing" phone={phone} />
                                <BrandCard name="Free People" href="https://www.freepeople.com/clothes" phone={phone} />
                                <BrandCard name="Anthropologie" href="https://www.anthropologie.com/clothing" phone={phone} />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ IMPACT ════════ */}
                    <section id="impact" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Impact</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 56 }}>
                                From uncertainty to clarity
                            </h2>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: phone ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
                                gap: 0, borderRadius: 16, overflow: "hidden", marginBottom: 48,
                            }}>
                                <div style={{
                                    backgroundColor: C.surface, padding: phone ? "36px 28px" : "48px 40px",
                                }}>
                                    <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.muted, marginBottom: 28, textTransform: "uppercase" }}>Before</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {[
                                            "Users questioned whether filters were applied",
                                            "Inventory language caused confusion",
                                            "Multi-filtering created uncertainty",
                                            "Exiting the drawer felt unclear",
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                <span style={{
                                                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                                                    backgroundColor: "rgba(17,18,12,0.06)", display: "flex", alignItems: "center", justifyContent: "center",
                                                }}>
                                                    <span style={{ fontFamily: INTER, fontSize: 10, color: C.ink3 }}>&#10005;</span>
                                                </span>
                                                <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{
                                    backgroundColor: C.ink, padding: phone ? "36px 28px" : "48px 40px",
                                }}>
                                    <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive, marginBottom: 28, textTransform: "uppercase" }}>After</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {[
                                            "100% task completion during testing",
                                            "Improved inventory comprehension",
                                            "More intuitive navigation",
                                            "30% increase in task success",
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                <span style={{
                                                    width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                                                    backgroundColor: "rgba(137,144,100,0.25)", display: "flex", alignItems: "center", justifyContent: "center",
                                                }}>
                                                    <span style={{ fontFamily: INTER, fontSize: 10, color: C.olive }}>&#10003;</span>
                                                </span>
                                                <p style={{ fontFamily: INTER, fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.5 }}>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4, 1fr)",
                                gap: phone ? 12 : 16,
                            }}>
                                <ImpactCard value="30%" label="Increase in Task Success" phone={phone} />
                                <ImpactCard value="100%" label="Task Completion in Testing" phone={phone} />
                                <ImpactCard value="45%" label="Faster Prototype Validation" phone={phone} />
                                <ImpactCard value="Shipped" label="Mobile Web + Desktop" phone={phone} />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ LOOKING BACK ════════ */}
                    <section id="looking-back" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Looking Back</p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{ margin: "0 0 48px" }}>
                                <span style={{ fontFamily: Z, fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 0.8, color: C.olive, display: "block", marginBottom: 12, userSelect: "none", opacity: 0.35 }}>&ldquo;</span>
                                <p style={{
                                    fontFamily: Z, fontStyle: "italic", fontWeight: 400,
                                    fontSize: "clamp(24px, 3.5vw, 40px)", lineHeight: 1.3,
                                    color: C.ink, letterSpacing: "-0.025em", maxWidth: 680, marginBottom: 0,
                                }}>
                                    The biggest challenge wasn't organizing products. It was helping users trust the system.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{ width: 40, height: 1, backgroundColor: C.olive, marginBottom: 36 }} />
                            <div style={{ maxWidth: 560 }}>
                                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.85, color: C.ink3, marginBottom: 20 }}>
                                    This project changed how I think about product discovery.
                                </p>
                                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.85, color: C.ink3, marginBottom: 20 }}>
                                    The original experience technically worked, but usability testing showed that small moments of uncertainty were slowing users down. A missing state, unclear label, or confusing action can create hesitation that compounds throughout an experience.
                                </p>
                                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.85, color: C.ink3, margin: 0 }}>
                                    The redesign reinforced that effective product design isn't always about introducing new functionality. Often the greatest impact comes from making existing interactions feel clearer, more predictable, and easier to trust.
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                </div>
            </div>
        </div>
    )
}
