"use client"

import React, { useState, useRef, useEffect } from "react"

const Z = "Zodiak, 'Times New Roman', serif"
const INTER = "Inter, system-ui, sans-serif"
const YB = "var(--font-yuji-boku), serif"

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
    { id: "insights", label: "Insights" },
    { id: "strategy", label: "Strategy" },
    { id: "component", label: "Component" },
    { id: "ai", label: "AI Workflow" },
    { id: "validation", label: "Validation" },
    { id: "launch", label: "Launch" },
    { id: "impact", label: "Impact" },
    { id: "reflection", label: "Reflection" },
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
                            <video
                                src="/videos/product-discovery-hero.mp4"
                                autoPlay loop muted playsInline
                                style={{ width: "100%", display: "block", borderRadius: 14 }}
                            />
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
                                        URBN — Anthropologie · Urban Outfitters · Free People
                                    </p>
                                    <h1 style={{
                                        fontFamily: Z, fontWeight: 700, fontSize: "clamp(32px, 4.5vw, 56px)",
                                        lineHeight: 1.05, letterSpacing: "-0.035em", color: C.ink,
                                        marginBottom: desktop ? 0 : 24,
                                    }}>
                                        Designing Confidence in Product Discovery
                                    </h1>
                                </div>
                                <div style={{ paddingTop: desktop ? 36 : 0 }}>
                                    <p style={{
                                        fontFamily: INTER, fontSize: 14, lineHeight: 1.7,
                                        color: C.ink3, marginBottom: 20,
                                    }}>
                                        Redesigning filters across Mobile Web and Desktop to help shoppers feel confident navigating large product catalogs.
                                    </p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                                        {["Product Design", "Design Systems", "E-Commerce"].map(tag => (
                                            <span key={tag} style={{
                                                fontFamily: INTER, fontSize: 11, fontWeight: 500, color: C.ink3,
                                                border: `1px solid ${C.border}`, borderRadius: 20, padding: "6px 14px",
                                            }}>{tag}</span>
                                        ))}
                                    </div>
                                    <a href="#live-experience" style={{
                                        display: "inline-flex", alignItems: "center", gap: 10,
                                        fontFamily: INTER, fontSize: 13, fontWeight: 600, color: C.bg,
                                        backgroundColor: C.ink, padding: "12px 28px", borderRadius: 32,
                                        textDecoration: "none", letterSpacing: "0.02em",
                                    }}>
                                        View Live Experience <span style={{ fontSize: 15 }}>&#8599;</span>
                                    </a>
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

                        <FadeIn delay={160}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(3, 1fr)",
                                gap: 0, marginTop: 56,
                            }}>
                                {[
                                    { value: "30%", label: "Task success increase" },
                                    { value: "100%", label: "Usability test pass rate" },
                                    { value: "45%", label: "Faster prototyping" },
                                ].map((m, i) => (
                                    <div key={i} style={{
                                        textAlign: "center", padding: phone ? "28px 0" : "40px 0",
                                        borderTop: `1px solid ${C.border}`,
                                        borderRight: !phone && i < 2 ? `1px solid ${C.border}` : "none",
                                    }}>
                                        <p style={{ fontFamily: Z, fontSize: phone ? 36 : 48, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>{m.value}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>{m.label}</p>
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
                                Users weren't struggling with filters. They were struggling with confidence.
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.75, color: C.ink3, maxWidth: 520, marginBottom: 56 }}>
                                Usability testing revealed four recurring patterns of uncertainty.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Placeholder label="Current Experience — filter drawer usability testing" aspect="50%" />
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: phone ? 12 : 16, marginTop: 48,
                            }}>
                                {[
                                    { num: "01", q: "Which filters are selected?", desc: "Selection states lacked visibility" },
                                    { num: "02", q: "Were my choices saved?", desc: "Multi-filter workflows felt fragile" },
                                    { num: "03", q: "How do I leave?", desc: "Exit behavior was unclear" },
                                    { num: "04", q: "What does this mean?", desc: "Inventory language confused users" },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        backgroundColor: C.surface, borderRadius: 12, padding: phone ? "24px" : "32px",
                                    }}>
                                        <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive, marginBottom: 14 }}>{item.num}</p>
                                        <p style={{ fontFamily: Z, fontSize: phone ? 18 : 20, fontWeight: 700, color: C.ink, lineHeight: 1.25, marginBottom: 8 }}>{item.q}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 12.5, lineHeight: 1.6, color: C.ink3, margin: 0 }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ INSIGHTS ════════ */}
                    <section id="insights" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Insights</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 56 }}>
                                Four patterns that told the real story
                            </h2>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Placeholder label="Usability Testing Clips — annotated friction moments" aspect="52%" />
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: phone ? 0 : 1, backgroundColor: phone ? "transparent" : C.border,
                                borderRadius: phone ? 0 : 14, overflow: "hidden", marginTop: 48,
                            }}>
                                {[
                                    { title: "Invisible selections", body: "Users couldn't tell which filters were active" },
                                    { title: "Fragile workflows", body: "Previous selections felt unreliable" },
                                    { title: "No clear exit", body: "Users got stuck inside the filter drawer" },
                                    { title: "Confusing language", body: '"Available in 24 Hours" read as shipping speed' },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        backgroundColor: C.bg, padding: phone ? "28px 0" : "36px 40px",
                                        borderBottom: phone ? `1px solid ${C.border}` : "none",
                                    }}>
                                        <p style={{ fontFamily: Z, fontSize: phone ? 17 : 19, fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: 8 }}>{item.title}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 13, lineHeight: 1.6, color: C.ink3, margin: 0 }}>{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <div style={{ margin: "80px 0" }}>
                                <span style={{ fontFamily: Z, fontSize: "clamp(40px, 5vw, 60px)", lineHeight: 0.8, color: C.olive, display: "block", marginBottom: 8, userSelect: "none", opacity: 0.4 }}>"</span>
                                <p style={{
                                    fontFamily: Z, fontStyle: "italic", fontWeight: 300,
                                    fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1.4,
                                    color: C.ink, letterSpacing: "-0.02em", maxWidth: 640,
                                }}>
                                    How might we increase confidence throughout the entire filtering journey?
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ STRATEGY ════════ */}
                    <section id="strategy" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Strategy</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 56 }}>
                                Four pillars that shaped every decision
                            </h2>
                        </FadeIn>

                        <div style={{ display: "flex", flexDirection: "column", gap: phone ? 48 : 80 }}>
                            {[
                                {
                                    num: "01", title: "Clearer Selection States",
                                    before: "Users couldn't identify active filters",
                                    after: "Checkboxes + stronger active-state visibility",
                                    placeholder: "Design Iterations — selection state explorations",
                                },
                                {
                                    num: "02", title: "Reduced Navigation Friction",
                                    before: "Multi-filter workflows felt unstable",
                                    after: "Accordion architecture + sticky filter headers",
                                    placeholder: "Design Iterations — accordion navigation patterns",
                                },
                                {
                                    num: "03", title: "Improved Exit Behavior",
                                    before: "No clear way to leave the filter drawer",
                                    after: "Contextual Done CTA that adapts to state",
                                    placeholder: "Design Iterations — exit behavior states",
                                },
                                {
                                    num: "04", title: "Clearer Inventory Language",
                                    before: "Users misread inventory as shipping speed",
                                    after: "Improved labeling + new interaction patterns",
                                    placeholder: "Design Iterations — inventory filter redesign",
                                },
                            ].map((pillar, i) => (
                                <FadeIn key={i} delay={i * 60}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                            <span style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive }}>{pillar.num}</span>
                                            <span style={{ width: 24, height: 1, backgroundColor: C.border }} />
                                            <span style={{ fontFamily: Z, fontSize: phone ? 22 : 28, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{pillar.title}</span>
                                        </div>
                                        <div style={{
                                            display: phone ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
                                            gap: 16, marginBottom: 24,
                                        }}>
                                            <div style={{ padding: "20px 24px", backgroundColor: C.surface, borderRadius: 10, marginBottom: phone ? 12 : 0 }}>
                                                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>Before</p>
                                                <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, lineHeight: 1.6, margin: 0 }}>{pillar.before}</p>
                                            </div>
                                            <div style={{ padding: "20px 24px", backgroundColor: C.ink, borderRadius: 10 }}>
                                                <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.olive, marginBottom: 8, textTransform: "uppercase" }}>After</p>
                                                <p style={{ fontFamily: INTER, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: 0 }}>{pillar.after}</p>
                                            </div>
                                        </div>
                                        <Placeholder label={pillar.placeholder} aspect="48%" />
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* ════════ COMPONENT ════════ */}
                    <section id="component" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Component</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
                                Building what the design system didn't have
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 14, lineHeight: 1.75, color: C.ink3, maxWidth: 520, marginBottom: 56 }}>
                                The existing system lacked a toggle for inventory filters. I designed one from scratch — accessible, reusable, cross-platform.
                            </p>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Placeholder label="Toggle Component Evolution — problem, explorations, final" aspect="44%" />
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(3, 1fr)",
                                gap: 0, marginTop: 48, borderTop: `1px solid ${C.border}`,
                            }}>
                                {[
                                    { step: "Problem", desc: "No component for binary inventory states" },
                                    { step: "Exploration", desc: "Tested against a11y and touch-target requirements" },
                                    { step: "Shipped", desc: "WCAG-compliant, 44px targets, reusable across contexts" },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding: phone ? "28px 0" : "32px 28px 32px 0",
                                        borderBottom: phone ? `1px solid ${C.border}` : "none",
                                        borderRight: !phone && i < 2 ? `1px solid ${C.border}` : "none",
                                        paddingLeft: !phone && i > 0 ? 28 : 0,
                                    }}>
                                        <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive, marginBottom: 10, textTransform: "uppercase" }}>{item.step}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 13, lineHeight: 1.6, color: C.ink3, margin: 0 }}>{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={180}>
                            <div style={{ marginTop: 48 }}>
                                <Placeholder label="Final Component Specs — states, sizing, color tokens, interaction behavior" aspect="56%" />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ AI WORKFLOW ════════ */}
                    <section id="ai" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>AI Workflow</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 56 }}>
                                Faster prototypes, faster learning
                            </h2>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: phone ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
                                gap: phone ? 12 : 16, marginBottom: 48,
                            }}>
                                <div style={{ backgroundColor: C.surface, borderRadius: 14, padding: phone ? "32px 24px" : "40px 36px", marginBottom: phone ? 12 : 0 }}>
                                    <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.muted, marginBottom: 20, textTransform: "uppercase" }}>Traditional Workflow</p>
                                    <Placeholder label="Traditional prototyping process" aspect="80%" />
                                </div>
                                <div style={{ backgroundColor: C.ink, borderRadius: 14, padding: phone ? "32px 24px" : "40px 36px" }}>
                                    <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: C.olive, marginBottom: 20, textTransform: "uppercase" }}>AI-Assisted Workflow</p>
                                    <Placeholder label="AI-assisted prototyping process" aspect="80%" dark />
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "flex", alignItems: "center", justifyContent: "center",
                                padding: phone ? "48px 24px" : "72px 48px",
                                backgroundColor: C.surface, borderRadius: 14,
                            }}>
                                <div style={{ textAlign: "center" }}>
                                    <p style={{ fontFamily: Z, fontSize: phone ? 56 : 80, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 12 }}>45%</p>
                                    <p style={{ fontFamily: INTER, fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, maxWidth: 320 }}>
                                        Reduction in prototype creation & testing time
                                    </p>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={160}>
                            <div style={{ marginTop: 48 }}>
                                <Placeholder label="AI Prototyping Workflow — concept to interactive prototype" aspect="48%" />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ VALIDATION ════════ */}
                    <section id="validation" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Validation</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 56 }}>
                                100% task completion
                            </h2>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                backgroundColor: C.ink, borderRadius: 16, padding: phone ? "48px 28px" : "72px 64px",
                                textAlign: "center", marginBottom: 48,
                            }}>
                                <p style={{ fontFamily: Z, fontSize: phone ? 64 : 96, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16 }}>100%</p>
                                <p style={{ fontFamily: INTER, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                                    Usability testing success rate
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: 0,
                            }}>
                                {[
                                    "Active selections immediately clear",
                                    "Inventory filters correctly understood",
                                    "Navigation felt intuitive and stable",
                                    "Exit confusion completely eliminated",
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding: phone ? "20px 0" : "20px 24px",
                                        borderBottom: `1px solid ${C.border}`,
                                        display: "flex", alignItems: "center", gap: 14,
                                    }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.olive, flexShrink: 0 }} />
                                        <p style={{ fontFamily: INTER, fontSize: 13.5, color: C.ink2, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={160}>
                            <div style={{ marginTop: 56 }}>
                                <Placeholder label="Usability Testing Results — task completion data and findings" aspect="48%" />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ LAUNCH ════════ */}
                    <section id="launch" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Launch</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 56 }}>
                                Shipped across Mobile Web and Desktop
                            </h2>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <Placeholder label="Final Mobile Experience — shipped filter drawer" aspect="75%" />
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: phone ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
                                gap: 16, marginTop: 24,
                            }}>
                                <Placeholder label="Final Desktop Experience — expanded filter panel" aspect="65%" />
                                <Placeholder label="Live Product Screenshots — Anthropologie.com" aspect="65%" />
                            </div>
                        </FadeIn>

                        <FadeIn delay={160}>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: 56 }}>
                                <a id="live-experience" href="#live-experience" style={{
                                    display: "inline-flex", alignItems: "center", gap: 10,
                                    fontFamily: INTER, fontSize: 14, fontWeight: 600, color: C.bg,
                                    backgroundColor: C.ink, padding: "16px 40px", borderRadius: 32,
                                    textDecoration: "none", letterSpacing: "0.02em",
                                }}>
                                    View Live Experience <span style={{ fontSize: 16 }}>&#8599;</span>
                                </a>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ IMPACT ════════ */}
                    <section id="impact" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Impact</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 700, marginBottom: 56 }}>
                                Measurable outcomes
                            </h2>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(3, 1fr)",
                                gap: 0,
                            }}>
                                {[
                                    { value: "30%", label: "Task success increase", highlight: true },
                                    { value: "100%", label: "Usability test pass rate", highlight: false },
                                    { value: "45%", label: "Faster prototyping", highlight: false },
                                ].map((m, i) => (
                                    <div key={i} style={{
                                        backgroundColor: m.highlight ? C.ink : C.surface,
                                        padding: phone ? "40px 28px" : "56px 36px",
                                        textAlign: "center",
                                        borderRadius: phone ? 14 : i === 0 ? "14px 0 0 14px" : i === 2 ? "0 14px 14px 0" : 0,
                                        marginBottom: phone ? 8 : 0,
                                    }}>
                                        <p style={{
                                            fontFamily: Z, fontSize: phone ? 44 : 56, fontWeight: 700,
                                            color: m.highlight ? "#fff" : C.ink,
                                            letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10,
                                        }}>{m.value}</p>
                                        <p style={{
                                            fontFamily: INTER, fontSize: 11, fontWeight: 500,
                                            color: m.highlight ? "rgba(255,255,255,0.45)" : C.muted,
                                            letterSpacing: "0.06em", textTransform: "uppercase", margin: 0,
                                        }}>{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: 0, marginTop: 48,
                            }}>
                                {[
                                    "Improved confidence across all tested scenarios",
                                    "Reduced uncertainty around active selections",
                                    "Better comprehension of inventory filters",
                                    "Foundation for future A/B testing",
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding: "18px 0", borderBottom: `1px solid ${C.border}`,
                                        paddingLeft: !phone && i % 2 === 1 ? 32 : 0,
                                        paddingRight: !phone && i % 2 === 0 ? 32 : 0,
                                    }}>
                                        <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, margin: 0, lineHeight: 1.6 }}>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={160}>
                            <div style={{ marginTop: 56 }}>
                                <Placeholder label="Results Dashboard — impact metrics visualization" aspect="44%" />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ REFLECTION ════════ */}
                    <section id="reflection" style={{ scrollMarginTop: 80, marginTop: 120 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.olive, marginBottom: 20 }}>Reflection</p>
                            <h2 style={{ fontFamily: Z, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.08, maxWidth: 600, marginBottom: 48 }}>
                                Filters are a confidence tool
                            </h2>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.85, color: C.ink3, maxWidth: 540, marginBottom: 36 }}>
                                Before this project, I viewed filters as a way to organize products. Through research and testing, I realized they're really a confidence tool.
                            </p>
                            <p style={{
                                fontFamily: Z, fontWeight: 700, fontSize: "clamp(18px, 2.4vw, 24px)",
                                color: C.ink, lineHeight: 1.35, letterSpacing: "-0.02em", maxWidth: 600,
                            }}>
                                The biggest gains come from reducing uncertainty — not adding features.
                            </p>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{ width: 40, height: 1, backgroundColor: C.olive, marginTop: 80, marginBottom: 40 }} />
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4, 1fr)",
                                gap: phone ? 16 : 24,
                            }}>
                                {["Research synthesis", "Design exploration", "AI prototyping", "Usability testing", "Component creation", "Design system contribution", "Spec creation", "Engineering handoff"].map((item, i) => (
                                    <p key={i} style={{ fontFamily: INTER, fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                </div>
            </div>
        </div>
    )
}
