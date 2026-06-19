"use client"

import React, { useState, useRef, useEffect } from "react"

const Z = "Zodiak, 'Times New Roman', serif"
const INTER = "Inter, system-ui, sans-serif"
const YB = "var(--font-yuji-boku), serif"

const C = {
    bg: "#FFFFFF",
    surface: "#F4F3EF",
    surface2: "#ECEAE4",
    surface3: "#E0DDD6",
    ink: "#1C1C1A",
    ink2: "#383834",
    ink3: "#5A5A54",
    muted: "#8A8A82",
    border: "rgba(28,28,26,0.1)",
    pink: "#E8B4C8",
}

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "challenge", label: "The Challenge" },
    { id: "insights", label: "What We Learned" },
    { id: "reframing", label: "Reframing" },
    { id: "ai-workflow", label: "AI Workflows" },
    { id: "design", label: "Design Strategy" },
    { id: "toggle", label: "Toggle Component" },
    { id: "implementation", label: "Implementation" },
    { id: "validation", label: "Validation" },
    { id: "platforms", label: "Platforms" },
    { id: "shipped", label: "Shipped" },
    { id: "results", label: "Results" },
    { id: "reflection", label: "Reflection" },
]

// ── Responsive ────────────────────────────────────────────────────────────────
function useResponsive() {
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    useEffect(() => {
        const check = () => {
            const w = window.innerWidth
            setPhone(w < 768)
            setTablet(w >= 768 && w < 1024)
        }
        check()
        window.addEventListener("resize", check, { passive: true })
        return () => window.removeEventListener("resize", check)
    }, [])
    return { phone, tablet, desktop: !phone && !tablet }
}

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])
    return { ref, visible }
}

function useActiveSection(sectionIds: string[]) {
    const [active, setActive] = useState("")
    useEffect(() => {
        const onScroll = () => {
            let best = ""
            let bestDist = Infinity
            for (const id of sectionIds) {
                const el = document.getElementById(id)
                if (el) {
                    const top = el.getBoundingClientRect().top
                    if (top <= 200 && Math.abs(top) < bestDist) {
                        bestDist = Math.abs(top)
                        best = id
                    }
                }
            }
            if (best) setActive(best)
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])
    return active
}

function useCounter(target: number, active: boolean, duration = 1200) {
    const [val, setVal] = useState(0)
    useEffect(() => {
        if (!active) return
        let current = 0
        const steps = 60
        const inc = target / steps
        const interval = duration / steps
        const t = setInterval(() => {
            current += inc
            if (current >= target) { setVal(target); clearInterval(t) }
            else setVal(Math.round(current))
        }, interval)
        return () => clearInterval(t)
    }, [active, target, duration])
    return val
}

// ── Animation ─────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, visible } = useInView(0.06)
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(28px)",
            transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}>
            {children}
        </div>
    )
}

function Divider() {
    return <div style={{ width: "100%", height: "1px", backgroundColor: C.border, margin: "140px 0 80px" }} />
}

// ── Typography ────────────────────────────────────────────────────────────────
function ChapterLabel({ index, title }: { index: string; title: string }) {
    return (
        <div style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "20px" }}>
                <span style={{ width: 16, height: 2, backgroundColor: C.pink, display: "block", flexShrink: 0 }} />
                <p style={{
                    fontFamily: INTER, fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: C.muted, margin: 0,
                }}>
                    {index}
                </p>
            </div>
            <h2 style={{
                fontFamily: Z, fontSize: "clamp(26px, 3.6vw, 44px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: C.ink, margin: 0, lineHeight: 1.1, maxWidth: "760px",
            }}>
                {title}
            </h2>
        </div>
    )
}

function Body({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontFamily: INTER, fontSize: "15px", lineHeight: "1.82",
            color: C.ink2, maxWidth: "640px", marginBottom: "18px", letterSpacing: "-0.003em",
        }}>
            {children}
        </p>
    )
}

function BoldLine({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontFamily: Z, fontWeight: 700, fontSize: "clamp(18px, 2.4vw, 24px)",
            color: C.ink, lineHeight: 1.35, letterSpacing: "-0.02em",
            margin: "36px 0", maxWidth: "680px",
        }}>
            {children}
        </p>
    )
}

function PullQuote({ text }: { text: string }) {
    return (
        <div style={{ margin: "64px 0" }}>
            <span style={{
                fontFamily: Z, fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 0.8,
                color: C.pink, display: "block", marginBottom: 4, userSelect: "none",
            }}>"</span>
            <p style={{
                fontFamily: Z, fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(22px, 3.4vw, 38px)", lineHeight: 1.38,
                color: C.ink, letterSpacing: "-0.025em", maxWidth: "800px",
            }}>
                {text}
            </p>
        </div>
    )
}

function BulletList({ items }: { items: string[] }) {
    return (
        <div style={{ margin: "20px 0 24px" }}>
            {items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontFamily: Z, fontSize: "14px", color: C.muted, flexShrink: 0, marginTop: "1px", lineHeight: 1.65 }}>—</span>
                    <p style={{ fontFamily: INTER, fontSize: "14px", color: C.ink2, lineHeight: 1.65, margin: 0 }}>{item}</p>
                </div>
            ))}
        </div>
    )
}

// ── Content blocks ────────────────────────────────────────────────────────────
function Callout({ type, title, body }: {
    type: "insight" | "decision" | "constraint" | "tradeoff"
    title: string; body: string
}) {
    const config = {
        insight: { bg: C.ink, label: "Key Insight", labelColor: "rgba(255,255,255,0.38)", titleColor: "#fff", bodyColor: "rgba(255,255,255,0.7)", border: "none", br: "12px" },
        decision: { bg: C.surface, label: "Design Decision", labelColor: C.muted, titleColor: C.ink, bodyColor: C.ink2, border: `3px solid ${C.ink}`, br: "0 12px 12px 0" },
        constraint: { bg: "#FBF7F2", label: "Constraint", labelColor: "#A0683A", titleColor: "#4A2E10", bodyColor: "#7A5030", border: "3px solid #D4956A", br: "0 12px 12px 0" },
        tradeoff: { bg: C.surface2, label: "Tradeoff", labelColor: C.muted, titleColor: C.ink, bodyColor: C.ink2, border: `3px solid ${C.muted}`, br: "0 12px 12px 0" },
    }
    const s = config[type]
    return (
        <div style={{ backgroundColor: s.bg, borderLeft: s.border, borderRadius: s.br, padding: "32px 36px", margin: "40px 0" }}>
            <p style={{ fontFamily: INTER, fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: s.labelColor, marginBottom: "12px" }}>{s.label}</p>
            <p style={{ fontFamily: Z, fontSize: "19px", fontWeight: 700, color: s.titleColor, marginBottom: "10px", lineHeight: 1.35 }}>{title}</p>
            <p style={{ fontFamily: INTER, fontSize: "13.5px", lineHeight: 1.7, color: s.bodyColor, margin: 0 }}>{body}</p>
        </div>
    )
}

function FullImage({ src, alt, caption, radius = 14 }: { src: string; alt: string; caption?: string; radius?: number }) {
    return (
        <div style={{ margin: "56px 0" }}>
            <img src={src} alt={alt} style={{
                width: "100%", height: "auto", display: "block", borderRadius: radius,
                boxShadow: "0 4px 52px rgba(0,0,0,0.10)", maxWidth: "100%",
            }} />
            {caption && (
                <p style={{
                    fontFamily: YB, fontStyle: "italic", fontWeight: 400, fontSize: 13,
                    color: C.ink3, textAlign: "center", margin: "16px 0 0", lineHeight: 1.6,
                }}>{caption}</p>
            )}
        </div>
    )
}

function Transition({ text }: { text: string }) {
    return (
        <p style={{
            fontFamily: YB, fontStyle: "italic", fontWeight: 400,
            fontSize: "15px", color: C.ink3, marginTop: "48px", lineHeight: 1.75,
            maxWidth: "600px", borderTop: `1px solid ${C.border}`, paddingTop: "28px",
        }}>
            {text}
        </p>
    )
}

// ── Insight card ─────────────────────────────────────────────────────────────
function InsightCard({ number, title, body, phone }: { number: string; title: string; body: string; phone: boolean }) {
    return (
        <div style={{
            backgroundColor: C.surface, borderRadius: 12, padding: phone ? "28px 24px" : "36px 40px",
            display: "flex", flexDirection: "column", gap: 12,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                    fontFamily: INTER, fontSize: 10, fontWeight: 700, color: C.pink,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                }}>Insight {number}</span>
            </div>
            <p style={{ fontFamily: Z, fontSize: phone ? 18 : 20, fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: 0 }}>{title}</p>
            <p style={{ fontFamily: INTER, fontSize: 13.5, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{body}</p>
        </div>
    )
}

// ── Pillar card ──────────────────────────────────────────────────────────────
function PillarCard({ number, title, features, body, phone }: {
    number: string; title: string; features: string[]; body: string; phone: boolean
}) {
    return (
        <div style={{
            borderLeft: `3px solid ${C.pink}`, borderRadius: "0 12px 12px 0",
            padding: phone ? "28px 24px" : "36px 40px", backgroundColor: C.surface,
        }}>
            <p style={{
                fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                textTransform: "uppercase", color: C.pink, marginBottom: 12,
            }}>Pillar {number}</p>
            <p style={{ fontFamily: Z, fontSize: phone ? 20 : 24, fontWeight: 700, color: C.ink, lineHeight: 1.25, marginBottom: 16 }}>{title}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {features.map((f, i) => (
                    <span key={i} style={{
                        fontFamily: INTER, fontSize: 11, fontWeight: 500, color: C.ink3,
                        padding: "5px 14px", border: `1px solid ${C.border}`, borderRadius: 20, backgroundColor: C.bg,
                    }}>{f}</span>
                ))}
            </div>
            <p style={{ fontFamily: INTER, fontSize: 13.5, lineHeight: 1.7, color: C.ink2, margin: 0 }}>{body}</p>
        </div>
    )
}

// ── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ value, label }: { value: string; label: string }) {
    const { ref, visible } = useInView(0.2)
    return (
        <div ref={ref} style={{
            textAlign: "center", padding: "32px 20px",
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
            <p style={{
                fontFamily: Z, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700,
                color: C.ink, letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1,
            }}>{value}</p>
            <p style={{
                fontFamily: INTER, fontSize: 12, fontWeight: 500, color: C.muted,
                letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.5, margin: 0,
            }}>{label}</p>
        </div>
    )
}

// ── Check item ───────────────────────────────────────────────────────────────
function CheckItem({ text }: { text: string }) {
    return (
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
            <span style={{
                fontFamily: INTER, fontSize: 14, color: "#4CAF50", flexShrink: 0,
                marginTop: 1, lineHeight: 1.65, fontWeight: 600,
            }}>&#10003;</span>
            <p style={{ fontFamily: INTER, fontSize: 14, color: C.ink2, lineHeight: 1.65, margin: 0 }}>{text}</p>
        </div>
    )
}

// ── Side chapter nav ──────────────────────────────────────────────────────────
function SideChapterNav({ active }: { active: string }) {
    return (
        <nav style={{
            position: "sticky", top: 80, paddingTop: 0, paddingLeft: 0,
            alignSelf: "start",
        }}>
            {SECTIONS.map(({ id, label }) => {
                const isActive = active === id
                return (
                    <a key={id} href={`#${id}`}
                        onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                        style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
                            textDecoration: "none", opacity: isActive ? 1 : 0.35, transition: "opacity 0.3s ease",
                        }}
                    >
                        <span style={{
                            width: isActive ? 24 : 14, height: 1.5,
                            backgroundColor: isActive ? C.pink : C.ink,
                            transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), background-color 0.3s",
                            flexShrink: 0,
                        }} />
                        <span style={{
                            fontFamily: INTER, fontSize: 10, fontWeight: isActive ? 600 : 400,
                            color: isActive ? C.pink : C.ink,
                            letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
                            transition: "color 0.3s",
                        }}>
                            {label}
                        </span>
                    </a>
                )
            })}
        </nav>
    )
}

// ── Top nav ───────────────────────────────────────────────────────────────────
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

    const allLinks = [
        { label: "Work", href: "/#work" },
        { label: "Playground", href: "/playground" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
        { label: "Resume", href: "/slides/resume.pdf", ext: true },
    ]

    return (
        <>
            <nav style={{
                position: "sticky", top: 0, zIndex: 100, width: "100%",
                height: phone ? 54 : 64, display: "flex", alignItems: "center",
                justifyContent: "space-between", padding: `0 ${phone ? 20 : 80}px`,
                boxSizing: "border-box",
                backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : C.bg,
                backdropFilter: scrolled ? "blur(20px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.09)" : C.border}`,
                transition: "background 0.25s, border-color 0.25s",
            }}>
                <a href="/" style={{ display: "block", lineHeight: 0 }}>
                    <img src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png" alt="OC"
                        style={{ width: phone ? 48 : 58, height: phone ? 48 : 58, objectFit: "contain", display: "block" }} />
                </a>
                {phone ? (
                    <button onClick={() => setMenuOpen(true)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5, minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" }}
                        aria-label="Open menu">
                        <span style={{ width: 22, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block" }} />
                        <span style={{ width: 22, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block" }} />
                        <span style={{ width: 14, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block", alignSelf: "flex-end" }} />
                    </button>
                ) : (
                    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                        {allLinks.map(({ label, href, ext }) => (
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
                <div onClick={() => setMenuOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 999, backgroundColor: "rgba(255,255,255,0.98)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", display: "flex", flexDirection: "column", padding: "24px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
                        <img src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png" alt="OC" style={{ width: 48, height: 48, objectFit: "contain" }} />
                        <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: C.ink, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>&#10005;</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {allLinks.map(({ label, href, ext }) => (
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AnthropologieProductDiscovery() {
    const { phone, tablet, desktop } = useResponsive()
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))

    const tags = ["Product Design", "Design Systems", "E-Commerce", "URBN"]

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <CaseStudyNav />

            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                maxWidth: desktop ? 1140 : 1040,
                margin: "0 auto",
                padding: desktop ? "0 40px" : undefined,
                gap: desktop ? "0 40px" : undefined,
            }}>
                {desktop && (
                    <aside style={{ position: "relative" }}>
                        <SideChapterNav active={activeSection} />
                    </aside>
                )}

                <div style={{
                    padding: phone ? "0 20px 160px" : tablet ? "0 40px 160px" : "0 0 160px",
                    maxWidth: desktop ? 920 : 1040,
                }}>

                    {/* ═══════════════════════ OVERVIEW ═══════════════════════ */}
                    <section id="overview" style={{ scrollMarginTop: 80 }}>
                        <FadeIn>
                            <div style={{ paddingTop: phone ? 48 : 88 }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                                    {tags.map(tag => (
                                        <span key={tag} style={{
                                            fontFamily: INTER, fontSize: 11, fontWeight: 500, color: C.ink3,
                                            padding: "5px 14px", border: `1px solid ${C.border}`, borderRadius: 20,
                                        }}>{tag}</span>
                                    ))}
                                </div>

                                <h1 style={{
                                    fontFamily: Z, fontWeight: 700, fontSize: "clamp(32px, 5.5vw, 66px)",
                                    lineHeight: 1.02, letterSpacing: "-0.03em", marginBottom: 20, maxWidth: 880, color: C.ink,
                                }}>
                                    Designing Confidence in Product Discovery
                                </h1>

                                <p style={{
                                    fontFamily: INTER, fontSize: phone ? 14 : 16, lineHeight: 1.7,
                                    color: C.ink3, maxWidth: 680, marginBottom: 36, letterSpacing: "-0.005em",
                                }}>
                                    Redesigning product discovery across Mobile Web and Desktop to increase user confidence and improve filtering efficiency.
                                </p>

                                <a
                                    href="#live-experience"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 10,
                                        fontFamily: INTER, fontSize: 13, fontWeight: 600, color: C.bg,
                                        backgroundColor: C.ink, padding: "14px 32px", borderRadius: 32,
                                        textDecoration: "none", letterSpacing: "0.02em",
                                        transition: "background-color 0.25s, transform 0.25s",
                                        marginBottom: 48,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.ink2 }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.ink }}
                                >
                                    View Live Experience
                                    <span style={{ fontSize: 16 }}>&#8599;</span>
                                </a>

                                <div style={{
                                    display: phone ? "block" : "grid",
                                    gridTemplateColumns: phone ? undefined : "1.2fr 1fr",
                                    gap: phone ? 32 : 48,
                                    paddingBottom: 48,
                                    borderBottom: `1px solid ${C.border}`,
                                }}>
                                    <div>
                                        <p style={{
                                            fontFamily: Z, fontStyle: "italic", fontWeight: 300,
                                            fontSize: phone ? 17 : 20, color: C.ink3, maxWidth: 560, lineHeight: 1.6, margin: 0, marginBottom: phone ? 24 : 0,
                                        }}>
                                            This project isn't about redesigning filters. It's about helping shoppers feel confident while navigating large product catalogs — across Anthropologie, Urban Outfitters, and Free People.
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: phone ? 0 : 4 }}>
                                        {([
                                            ["Role", "UX Designer"],
                                            ["Timeline", "5 Months"],
                                            ["Company", "URBN"],
                                            ["Team", "Product Manager · Engineering · UX Research · Brand Design"],
                                        ] as const).map(([k, v]) => (
                                            <div key={k}>
                                                <p style={{ fontFamily: INTER, fontWeight: 700, fontSize: 9, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>{k}</p>
                                                <p style={{ fontFamily: Z, fontStyle: "italic", fontWeight: 300, fontSize: 14, color: C.ink2, margin: 0 }}>{v}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Key metrics strip */}
                        <FadeIn delay={100}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4, 1fr)",
                                gap: 1, backgroundColor: C.border, borderRadius: 14, overflow: "hidden",
                                margin: "48px 0",
                            }}>
                                {[
                                    { value: "30%", label: "Increase in Task Success" },
                                    { value: "100%", label: "Usability Test Success Rate" },
                                    { value: "45%", label: "Faster Prototype Workflows" },
                                    { value: "2", label: "Platforms Shipped" },
                                ].map((m, i) => (
                                    <div key={i} style={{ backgroundColor: C.surface, padding: phone ? "24px 16px" : "32px 20px", textAlign: "center" }}>
                                        <p style={{ fontFamily: Z, fontSize: phone ? 28 : 36, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", marginBottom: 6, lineHeight: 1 }}>{m.value}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 500, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.4, margin: 0 }}>{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={160}>
                            <FullImage src="/slides/anthro-discovery-hero.png" alt="Anthropologie product discovery redesign — filter experience across mobile and desktop" radius={16} />
                        </FadeIn>

                        {/* My Contributions */}
                        <FadeIn delay={200}>
                            <div style={{ marginTop: 24 }}>
                                <p style={{
                                    fontFamily: INTER, fontWeight: 700, fontSize: 9, color: C.muted,
                                    marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.12em",
                                }}>My Contributions</p>
                                <BulletList items={[
                                    "Synthesized usability testing findings",
                                    "Identified key friction points across the filter experience",
                                    "Led design explorations and solution development",
                                    "Designed a new toggle component from scratch",
                                    "Created implementation-ready specifications",
                                    "Partnered with PMs, engineers, researchers, and brand teams",
                                    "Leveraged AI to accelerate prototype creation and validation",
                                    "Recommended A/B testing strategy",
                                ]} />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 01 — THE CHALLENGE ═══════════════════════ */}
                    <Divider />
                    <section id="challenge" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="01 — The Challenge" title="Product discovery is the front door of e-commerce" />
                            <Body>
                                Filters are one of the most critical tools shoppers use to navigate large product catalogs. They shape every browsing session — from the first tap to the final purchase decision.
                            </Body>
                            <Body>
                                But usability testing revealed recurring moments of uncertainty throughout the experience. Users weren't struggling because features were missing. They were struggling because the interface wasn't giving them enough confidence to move forward.
                            </Body>
                            <BoldLine>The problem wasn't functionality. It was trust, clarity, and confidence.</BoldLine>

                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: 16, margin: "40px 0",
                            }}>
                                {[
                                    { icon: "?", label: "Which filters are selected?" },
                                    { icon: "?", label: "Were previous selections saved?" },
                                    { icon: "?", label: "How do I exit this drawer?" },
                                    { icon: "?", label: "What does this filter mean?" },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        backgroundColor: C.surface, borderRadius: 10, padding: "24px 28px",
                                        display: "flex", alignItems: "center", gap: 16,
                                    }}>
                                        <span style={{
                                            width: 36, height: 36, borderRadius: "50%", backgroundColor: C.pink + "30",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontFamily: Z, fontSize: 18, fontWeight: 700, color: C.pink, flexShrink: 0,
                                        }}>{item.icon}</span>
                                        <p style={{ fontFamily: INTER, fontSize: 13.5, color: C.ink2, lineHeight: 1.5, margin: 0 }}>{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            <Transition text="These weren't edge cases. They were patterns — repeated across sessions, across users, across every part of the filter journey." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 02 — WHAT WE LEARNED ═══════════════════════ */}
                    <Divider />
                    <section id="insights" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="02 — What We Learned" title="Four patterns that told the real story" />
                            <Body>
                                Usability testing didn't just surface complaints — it revealed structural gaps in how the experience communicated state, progress, and control back to users.
                            </Body>
                        </FadeIn>

                        <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr", gap: 20, margin: "40px 0" }}>
                            <FadeIn>
                                <InsightCard phone={phone}
                                    number="01"
                                    title="Selected filters lacked visibility"
                                    body="Users often struggled to determine which filters were currently active. The visual treatment of selected states didn't create enough contrast to signal clearly that a filter had been applied."
                                />
                            </FadeIn>
                            <FadeIn delay={80}>
                                <InsightCard phone={phone}
                                    number="02"
                                    title="Multi-filter workflows felt fragile"
                                    body="Users weren't always confident that previous selections remained active when navigating between filter categories. The experience didn't reassure them that earlier choices had been preserved."
                                />
                            </FadeIn>
                            <FadeIn delay={160}>
                                <InsightCard phone={phone}
                                    number="03"
                                    title="Exiting the drawer wasn't intuitive"
                                    body="When no filters were selected, users struggled to understand how to leave the filter experience. The absence of a clear exit path created hesitation and uncertainty."
                                />
                            </FadeIn>
                            <FadeIn delay={240}>
                                <InsightCard phone={phone}
                                    number="04"
                                    title="Inventory language created confusion"
                                    body='Users interpreted "Available Within 24 Hours" as shipping speed rather than local inventory availability. The language gap created a fundamental misunderstanding of what the filter actually controlled.'
                                />
                            </FadeIn>
                        </div>

                        <FadeIn>
                            <FullImage src="/slides/anthro-usability-findings.png" alt="Usability testing findings — filter pain points across user sessions" caption="Synthesized findings from usability testing sessions revealing consistent friction patterns" />
                        </FadeIn>

                        <FadeIn>
                            <Transition text="The data was clear. Users weren't failing at filtering — they were losing confidence in the process." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 03 — REFRAMING ═══════════════════════ */}
                    <Divider />
                    <section id="reframing" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="03 — Reframing the Challenge" title="This wasn't a visual refresh. It was a confidence problem." />
                            <PullQuote text="How might we increase confidence throughout the entire filtering journey?" />
                            <Body>
                                Instead of redesigning filters for visual modernization, the focus became reducing cognitive effort and increasing confidence at every interaction point.
                            </Body>
                            <Body>
                                Every filter state needed to communicate clearly. Every interaction needed to feel predictable. Every exit point needed to feel safe. The experience needed to earn trust — not just look modern.
                            </Body>
                            <Callout
                                type="decision"
                                title="Confidence over aesthetics"
                                body="The redesign strategy prioritized reducing uncertainty over visual polish. Every design decision was evaluated against a single question: does this make the user more confident in what just happened?"
                            />
                            <Transition text="With the problem reframed, we needed to move fast — and that meant rethinking how we prototyped and validated." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 04 — AI WORKFLOW ═══════════════════════ */}
                    <Divider />
                    <section id="ai-workflow" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="04 — Leveraging AI to Accelerate Validation" title="Faster prototypes, faster learning" />
                            <Body>
                                Traditionally, high-fidelity prototypes required significant manual effort and slowed iteration cycles. Each variant took hours to construct, configure, and prepare for testing.
                            </Body>
                            <Body>
                                To accelerate testing and learning, I leveraged AI-assisted prototyping tools to rapidly transform concepts into interactive experiences — turning rough explorations into testable prototypes in a fraction of the time.
                            </Body>
                            <BoldLine>This wasn't about replacing design thinking. It was about removing the bottleneck between idea and validation.</BoldLine>
                        </FadeIn>

                        <FadeIn>
                            <div style={{
                                backgroundColor: C.ink, borderRadius: 14, padding: phone ? "32px 24px" : "48px 52px",
                                margin: "48px 0",
                            }}>
                                <p style={{
                                    fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                                    textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 28,
                                }}>Workflow Impact</p>
                                <div style={{
                                    display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                    gap: phone ? 20 : 28,
                                }}>
                                    {[
                                        { value: "45%", desc: "Reduction in prototype creation and testing preparation time" },
                                        { value: "3x", desc: "Increase in design exploration speed" },
                                        { value: "Faster", desc: "Stakeholder feedback loops and earlier validation" },
                                        { value: "Higher", desc: "Iteration velocity across the entire design process" },
                                    ].map((item, i) => (
                                        <div key={i} style={{ borderLeft: `2px solid ${C.pink}`, paddingLeft: 20 }}>
                                            <p style={{ fontFamily: Z, fontSize: phone ? 24 : 30, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1 }}>{item.value}</p>
                                            <p style={{ fontFamily: INTER, fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.6)", margin: 0 }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <FullImage src="/slides/anthro-ai-workflow.png" alt="AI-assisted prototyping workflow — from concept to interactive prototype" caption="AI-assisted workflow — transforming design concepts into testable prototypes at higher velocity" />
                        </FadeIn>

                        <FadeIn>
                            <Callout
                                type="insight"
                                title="AI as a workflow tool, not a design tool"
                                body="The value wasn't in AI generating design decisions — it was in AI removing the mechanical overhead between a design decision and a testable prototype. The thinking remained human. The execution became faster."
                            />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 05 — DESIGN STRATEGY ═══════════════════════ */}
                    <Divider />
                    <section id="design" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="05 — Designing for Confidence" title="Four pillars that shaped every decision" />
                            <Body>
                                The design strategy was organized around four pillars — each targeting a specific confidence gap identified during research. Every solution was evaluated against these pillars before moving to implementation.
                            </Body>
                        </FadeIn>

                        <div style={{ display: "flex", flexDirection: "column", gap: 24, margin: "40px 0" }}>
                            <FadeIn>
                                <PillarCard phone={phone}
                                    number="01"
                                    title="Clearer Selection States"
                                    features={["Checkboxes", "Active-state visibility", "Repositioned refinements"]}
                                    body="Stronger visual feedback at every selection point. Users should never have to guess whether a filter is active. Checkboxes, better contrast, and repositioned refinement indicators create immediate, unambiguous confirmation."
                                />
                            </FadeIn>
                            <FadeIn delay={80}>
                                <PillarCard phone={phone}
                                    number="02"
                                    title="Reduced Navigation Friction"
                                    features={["Accordion architecture", "Sticky filter headers"]}
                                    body="Accordion-based category navigation with sticky headers so users maintain context while exploring deep filter trees. Multi-filter workflows feel stable — previous selections stay visible and accessible."
                                />
                            </FadeIn>
                            <FadeIn delay={160}>
                                <PillarCard phone={phone}
                                    number="03"
                                    title="Improved Exit Behavior"
                                    features={["Contextual Done CTA"]}
                                    body={"A contextual \"Done\" button that adapts to state — resolving the confusion users experienced when no filters were selected and they couldn't find a clear way to leave the drawer."}
                                />
                            </FadeIn>
                            <FadeIn delay={240}>
                                <PillarCard phone={phone}
                                    number="04"
                                    title="Clearer Inventory Communication"
                                    features={["Improved labeling", "Better hierarchy", "New interaction patterns"]}
                                    body="Redesigned inventory-related filters with clearer language, better visual hierarchy, and interaction patterns that reduce ambiguity. Users understand what they're filtering — not just how to filter."
                                />
                            </FadeIn>
                        </div>

                        <FadeIn>
                            <FullImage src="/slides/anthro-design-pillars.png" alt="Design strategy — four pillars of confidence-driven filter design" />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 06 — TOGGLE COMPONENT ═══════════════════════ */}
                    <Divider />
                    <section id="toggle" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="06 — Creating a New Toggle Component" title="When the design system doesn't have what you need, you build it" />
                            <Body>
                                The existing design system lacked a component capable of supporting the inventory-filter behavior required for the redesign. Rather than forcing existing components into a role they weren't designed for, I designed a new toggle component from scratch.
                            </Body>
                        </FadeIn>

                        <FadeIn>
                            <div style={{
                                backgroundColor: C.surface, borderRadius: 14,
                                padding: phone ? "28px 24px" : "48px 52px", margin: "40px 0",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                                    <span style={{ width: 16, height: 2, backgroundColor: C.pink }} />
                                    <p style={{ fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, margin: 0 }}>Component Journey</p>
                                </div>

                                <div style={{
                                    display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(4, 1fr)",
                                    gap: phone ? 20 : 16,
                                }}>
                                    {[
                                        { step: "Problem", desc: "Existing toggle couldn't support binary inventory states with clear labeling" },
                                        { step: "Explorations", desc: "Tested multiple toggle patterns against accessibility and touch-target requirements" },
                                        { step: "Final Component", desc: "Custom toggle with clear on/off states, accessible contrast, and semantic labeling" },
                                        { step: "Specifications", desc: "Full spec including states, sizing, color tokens, and interaction behavior" },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, color: C.pink, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{item.step}</p>
                                            <p style={{ fontFamily: INTER, fontSize: 13, lineHeight: 1.65, color: C.ink2, margin: 0 }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <FullImage src="/slides/anthro-toggle-component.png" alt="Toggle component design — from problem to specification" caption="From identifying the gap to delivering a reusable, accessible component" />
                        </FadeIn>

                        <FadeIn>
                            <Body>This wasn't just a UI element. It was a design system contribution — built to be reusable, accessible, and consistent across platforms.</Body>
                            <BulletList items={[
                                "WCAG-compliant contrast ratios across all states",
                                "Minimum 44px touch targets on mobile",
                                "Clear state transitions between on, off, and disabled",
                                "Reusable across filter contexts beyond inventory",
                                "Consistent behavior across Mobile Web and Desktop",
                            ]} />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 07 — IMPLEMENTATION ═══════════════════════ */}
                    <Divider />
                    <section id="implementation" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="07 — From Design to Development" title="Ownership extended beyond interface design" />
                            <Body>
                                Design doesn't end at the final mockup. This project spanned the full product design lifecycle — from research synthesis through engineering handoff and testing strategy.
                            </Body>
                        </FadeIn>

                        <FadeIn>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: 16, margin: "40px 0",
                            }}>
                                {[
                                    { label: "Specifications", items: ["Final component specs", "Interaction documentation", "State logic diagrams"] },
                                    { label: "Edge Cases", items: ["Empty states", "Error handling", "Loading behaviors"] },
                                    { label: "Responsive", items: ["Mobile Web breakpoints", "Desktop adaptations", "Touch vs. pointer behavior"] },
                                    { label: "Handoff", items: ["Developer-ready annotations", "Redline documentation", "Component token mapping"] },
                                ].map((card, i) => (
                                    <div key={i} style={{
                                        border: `1px solid ${C.border}`, borderRadius: 12,
                                        padding: phone ? "24px 20px" : "28px 32px",
                                    }}>
                                        <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>{card.label}</p>
                                        {card.items.map((item, j) => (
                                            <div key={j} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                                                <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.pink, flexShrink: 0 }} />
                                                <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink2, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <FullImage src="/slides/anthro-specs.png" alt="Implementation specifications — developer handoff documentation" caption="Implementation-ready specifications bridging design intent and engineering execution" />
                        </FadeIn>

                        <FadeIn>
                            <Callout
                                type="decision"
                                title="Full lifecycle ownership"
                                body="This project required involvement at every stage — research synthesis, design exploration, AI-assisted prototyping, usability testing, component creation, design system contributions, spec creation, engineering handoff, and testing strategy recommendations."
                            />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 08 — VALIDATION ═══════════════════════ */}
                    <Divider />
                    <section id="validation" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="08 — Validation" title="The redesigned experience achieved a 100% success rate" />
                            <Body>
                                The redesigned experience achieved a 100% task completion rate during usability testing — demonstrating that users could confidently complete filtering tasks without encountering the friction observed in the original experience.
                            </Body>
                        </FadeIn>

                        <FadeIn>
                            <div style={{
                                backgroundColor: C.surface, borderRadius: 14,
                                padding: phone ? "32px 24px" : "48px 52px", margin: "40px 0",
                            }}>
                                <p style={{
                                    fontFamily: INTER, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                                    textTransform: "uppercase", color: C.muted, marginBottom: 28,
                                }}>Testing Outcomes</p>

                                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                    <CheckItem text="100% task completion rate across all filtering scenarios" />
                                    <CheckItem text="Users successfully completed all filtering tasks without assistance" />
                                    <CheckItem text="Active filter selections became immediately clear and easy to identify" />
                                    <CheckItem text="Inventory-related filters were correctly understood by all participants" />
                                    <CheckItem text="Navigation between filter categories felt intuitive and stable" />
                                    <CheckItem text='The updated "Done" CTA completely eliminated exit confusion' />
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <FullImage src="/slides/anthro-validation.png" alt="Usability testing results — 100% task completion rate" caption="Testing confirmed that the redesigned experience eliminated the core friction patterns" />
                        </FadeIn>

                        <FadeIn>
                            <PullQuote text="Users didn't just complete the tasks. They completed them with confidence." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 09 — PLATFORMS ═══════════════════════ */}
                    <Divider />
                    <section id="platforms" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="09 — Designing Across Platforms" title="What started as mobile web became an ecosystem" />
                            <Body>
                                Although the project began as a Mobile Web initiative, the findings and solutions translated directly to Desktop experiences. The confidence gaps we identified weren't platform-specific — they were structural.
                            </Body>
                            <Body>
                                Recommendations extended across Mobile Web, Desktop, and laid the groundwork for future native app considerations.
                            </Body>
                        </FadeIn>

                        <FadeIn>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                                gap: 16, margin: "40px 0",
                            }}>
                                {[
                                    { platform: "Mobile Web", items: ["Touch-optimized filter drawer", "Accordion navigation", "Sticky category headers", "Contextual Done CTA"] },
                                    { platform: "Desktop", items: ["Expanded filter panel", "Inline filter visibility", "Keyboard-accessible interactions", "Hover state refinements"] },
                                ].map((p, i) => (
                                    <div key={i} style={{
                                        border: `1px solid ${C.border}`, borderRadius: 12,
                                        padding: phone ? "28px 24px" : "36px 40px",
                                    }}>
                                        <p style={{ fontFamily: Z, fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20 }}>{p.platform}</p>
                                        {p.items.map((item, j) => (
                                            <div key={j} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                                                <span style={{ width: 6, height: 1.5, backgroundColor: C.pink, flexShrink: 0 }} />
                                                <p style={{ fontFamily: INTER, fontSize: 13.5, color: C.ink2, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <BulletList items={[
                                "Desktop filter drawers adapted the accordion architecture for wider viewports",
                                "Inventory visibility patterns maintained consistent language across platforms",
                                "Faced-out filter architecture provided at-a-glance selection state on desktop",
                                "Cross-platform consistency ensured a unified experience regardless of device",
                            ]} />
                        </FadeIn>

                        <FadeIn>
                            <FullImage src="/slides/anthro-cross-platform.png" alt="Cross-platform filter experience — Mobile Web and Desktop" caption="The same confidence principles applied across Mobile Web and Desktop" />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 10 — SHIPPED ═══════════════════════ */}
                    <Divider />
                    <section id="shipped" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="10 — The Shipped Experience" title="From research to production" />
                            <Body>
                                The redesigned product discovery experience successfully shipped into the live ecosystem — launching across Mobile Web and Desktop for Anthropologie, Urban Outfitters, and Free People.
                            </Body>
                        </FadeIn>

                        <FadeIn>
                            <FullImage src="/slides/anthro-shipped.png" alt="The shipped product discovery experience — live across URBN brands" radius={16} />
                        </FadeIn>

                        <FadeIn>
                            <div style={{
                                display: "flex", justifyContent: "center", margin: "32px 0 0",
                            }}>
                                <a
                                    id="live-experience"
                                    href="#live-experience"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 10,
                                        fontFamily: INTER, fontSize: 14, fontWeight: 600, color: C.bg,
                                        backgroundColor: C.ink, padding: "16px 40px", borderRadius: 32,
                                        textDecoration: "none", letterSpacing: "0.02em",
                                        transition: "background-color 0.25s",
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.ink2 }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.ink }}
                                >
                                    View Live Experience
                                    <span style={{ fontSize: 17 }}>&#8599;</span>
                                </a>
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <Transition text="What began as a usability audit became a shipped product — proving that confidence is as important as functionality in product discovery." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 11 — RESULTS ═══════════════════════ */}
                    <Divider />
                    <section id="results" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="11 — Results" title="Measurable impact across users and workflows" />
                        </FadeIn>

                        <FadeIn>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr" : "repeat(3, 1fr)",
                                gap: 1, backgroundColor: C.border, borderRadius: 16, overflow: "hidden",
                                margin: "20px 0 48px",
                            }}>
                                <div style={{ backgroundColor: C.ink, padding: phone ? "36px 24px" : "44px 32px", textAlign: "center", gridColumn: phone ? undefined : "span 3" }}>
                                    <p style={{ fontFamily: Z, fontSize: phone ? 44 : 64, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1 }}>30%</p>
                                    <p style={{ fontFamily: INTER, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Increase in Task Success</p>
                                </div>
                                {[
                                    { value: "100%", label: "Usability Test Success Rate" },
                                    { value: "45%", label: "Faster Prototyping Workflows" },
                                    { value: "2", label: "Platforms Shipped" },
                                ].map((m, i) => (
                                    <div key={i} style={{ backgroundColor: C.surface, padding: phone ? "28px 20px" : "36px 24px", textAlign: "center" }}>
                                        <p style={{ fontFamily: Z, fontSize: phone ? 28 : 36, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em", marginBottom: 6, lineHeight: 1 }}>{m.value}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 500, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.4, margin: 0 }}>{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <BulletList items={[
                                "Improved confidence during product discovery across all tested scenarios",
                                "Reduced uncertainty around active filter selections",
                                "Better comprehension of inventory-related filters",
                                "More intuitive multi-filter workflows with preserved selection state",
                                "Foundation for future A/B testing initiatives across URBN brands",
                            ]} />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ REFLECTION ═══════════════════════ */}
                    <Divider />
                    <section id="reflection" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="Reflection" title="Filters are a confidence tool" />
                            <Body>
                                Before this project, I viewed filters primarily as a way to organize products.
                            </Body>
                            <Body>
                                Through research and testing, I realized they're really a confidence tool. Every interaction communicates whether a system is responding as expected. When that feedback is unclear, users slow down, second-guess themselves, and lose momentum.
                            </Body>
                            <BoldLine>
                                Improving usability isn't always about adding more features. Often, the biggest gains come from reducing uncertainty and helping users feel confident in the decisions they're already trying to make.
                            </BoldLine>
                        </FadeIn>

                        <FadeIn>
                            <Callout
                                type="insight"
                                title="Confidence compounds"
                                body="When users trust that a filter is working as expected, they explore more. They apply more filters. They narrow results more precisely. They buy with more conviction. Confidence in the tool becomes confidence in the purchase."
                            />
                        </FadeIn>

                        {/* Closing mark */}
                        <FadeIn>
                            <div style={{ margin: "80px 0 0", textAlign: "center" }}>
                                <span style={{
                                    fontFamily: Z, fontSize: 64, color: C.pink,
                                    lineHeight: 1, userSelect: "none", opacity: 0.5,
                                }}>"</span>
                            </div>
                        </FadeIn>
                    </section>

                </div>
            </div>
        </div>
    )
}
