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
    { id: "context", label: "Context" },
    { id: "where-we-began", label: "Where We Began" },
    { id: "what-we-found", label: "What We Found" },
    { id: "opportunity", label: "Opportunity" },
    { id: "solution", label: "Solution" },
    { id: "validation", label: "Validation" },
    { id: "impact", label: "Impact" },
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

// ── Interactive demos ─────────────────────────────────────────────────────────
function ShoppingModeToggle() {
    const [mode, setMode] = useState<"intent" | "discovery">("intent")
    const modes = {
        intent: { title: "Intent Mode", desc: "Streamlined filtering, fast navigation, reduced friction, efficient product discovery", icon: "🎯", features: ["Quick search", "Smart filters", "Direct checkout", "Saved preferences"] },
        discovery: { title: "Discovery Mode", desc: "Exploration, inspiration, curated recommendations, mood-aware personalization, emotional engagement", icon: "✨", features: ["Mood boards", "Style quiz", "Curator picks", "Surprise me"] },
    }
    return (
        <div style={{ backgroundColor: C.surface, borderRadius: "14px", padding: "40px", marginTop: "8px" }}>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
                {(["intent", "discovery"] as const).map((m) => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        fontFamily: INTER, fontSize: "13px", fontWeight: 600,
                        padding: "12px 32px", borderRadius: "24px", border: "none", cursor: "pointer",
                        backgroundColor: mode === m ? C.ink : "transparent",
                        color: mode === m ? "#fff" : C.ink2,
                        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)", minHeight: 44,
                    }}>
                        {m === "intent" ? "Intent Shopping" : "Discovery Shopping"}
                    </button>
                ))}
            </div>
            <div style={{ backgroundColor: mode === "intent" ? "#F9F8F5" : "#F5F3F9", padding: "32px", borderRadius: "10px", transition: "background 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "32px" }}>{modes[mode].icon}</span>
                    <p style={{ fontFamily: Z, fontSize: "20px", fontWeight: 600, color: C.ink, margin: 0 }}>{modes[mode].title}</p>
                </div>
                <p style={{ fontFamily: INTER, fontSize: "14px", lineHeight: 1.65, color: C.ink3, marginBottom: "20px" }}>{modes[mode].desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {modes[mode].features.map((f, i) => (
                        <div key={i} style={{ fontFamily: INTER, fontSize: "12px", color: C.ink2, padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "6px" }}>• {f}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function MoodCarousel() {
    const moods = [
        { emoji: "😌", label: "Relaxed", color: "#B8D4C8" },
        { emoji: "⚡", label: "Energized", color: "#FFD97D" },
        { emoji: "✨", label: "Confident", color: "#C9B8E4" },
        { emoji: "🌙", label: "Chill", color: "#A8C5DD" },
        { emoji: "🔥", label: "Bold", color: "#FFB4A2" },
        { emoji: "🌸", label: "Romantic", color: "#F5C4D8" },
    ]
    const [currentIndex, setCurrentIndex] = useState(0)
    const next = () => setCurrentIndex((currentIndex + 1) % moods.length)
    const prev = () => setCurrentIndex((currentIndex - 1 + moods.length) % moods.length)
    return (
        <div style={{ backgroundColor: C.surface, borderRadius: "14px", padding: "40px", marginTop: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", justifyContent: "center" }}>
                <button onClick={prev} style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.border}`, backgroundColor: "white", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44 }}>←</button>
                <div style={{ flex: 1, maxWidth: 400, height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    {moods.map((mood, i) => {
                        const offset = i - currentIndex
                        const isActive = i === currentIndex
                        return (
                            <div key={i} style={{
                                position: "absolute", width: isActive ? 180 : 140, height: isActive ? 180 : 140,
                                borderRadius: 16, backgroundColor: mood.color,
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
                                transform: `translateX(${offset * 120}px) scale(${isActive ? 1 : 0.85})`,
                                opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.4,
                                transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)", zIndex: isActive ? 10 : 1,
                            }}>
                                <span style={{ fontSize: isActive ? 56 : 40, transition: "font-size 0.5s" }}>{mood.emoji}</span>
                                <p style={{ fontFamily: Z, fontSize: isActive ? 18 : 15, fontWeight: 600, color: C.ink, margin: 0, transition: "font-size 0.5s" }}>{mood.label}</p>
                            </div>
                        )
                    })}
                </div>
                <button onClick={next} style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.border}`, backgroundColor: "white", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44 }}>→</button>
            </div>
            <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
                Envisioned interaction — mood-first entry point for the discovery experience
            </p>
        </div>
    )
}

// ── Side nav ─────────────────────────────────────────────────────────────────
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
                            borderLeft: isActive ? `2px solid ${C.pink}` : "2px solid transparent",
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
                        <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: C.ink, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
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
export default function RFNDCaseStudy() {
    const { phone, tablet, desktop } = useResponsive()
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))

    const tags = ["Conceptual Capstone", "UX Strategy", "E-Commerce"]

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <CaseStudyNav />

            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                gap: desktop ? 48 : undefined,
                maxWidth: 1400,
                margin: "0 auto",
                padding: `0 ${phone ? 20 : tablet ? 40 : 80}px 180px`,
            }}>
                {/* ── Left rail ── */}
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 80, paddingTop: 40 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}

                {/* ── Content column ── */}
                <div style={{
                    padding: `0 ${phone ? 20 : tablet ? 40 : 0}px 180px`,
                }}>

                    {/* ═══════════════════════ OVERVIEW ═══════════════════════ */}
                    <section id="overview" style={{ scrollMarginTop: 80 }}>
                        <FadeIn>
                            <div style={{ paddingTop: phone ? 48 : 88 }}>
                                {/* Tag pills */}
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
                                    lineHeight: 1.02, letterSpacing: "-0.03em", marginBottom: 32, maxWidth: 880, color: C.ink,
                                }}>
                                    RFND — Reimagining Emotional E-Commerce
                                </h1>

                                {/* Two-column overview */}
                                <div style={{
                                    display: phone ? "block" : "grid",
                                    gridTemplateColumns: phone ? undefined : "1.2fr 1fr",
                                    gap: phone ? 32 : 48,
                                    paddingBottom: 48,
                                    borderBottom: `1px solid ${C.border}`,
                                }}>
                                    <p style={{
                                        fontFamily: Z, fontStyle: "italic", fontWeight: 300,
                                        fontSize: phone ? 17 : 20, color: C.ink3, maxWidth: 560, lineHeight: 1.6, margin: 0,
                                    }}>
                                        A self-initiated conceptual exploration into why emotional engagement is a commerce problem — and what mood-aware design could look like as a solution.
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: phone ? 0 : 4 }}>
                                        {([
                                            ["Role", "Product Strategist · UX Designer · Researcher"],
                                            ["Timeline", "9 Months"],
                                            ["Type", "Speculative Design · Conceptual Exploration"],
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

                        <FadeIn delay={120}>
                            <FullImage src="/slides/rfnd-hero.png" alt="RFND — Reimagining Emotional E-Commerce" radius={16} />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 01 — CONTEXT ═══════════════════════ */}
                    <Divider />
                    <section id="context" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="01 — Context" title="The industry was leaving money on the table" />
                            <BoldLine>Fashion e-commerce generates $700B+ annually. It returns $100–300B of that inventory every year.</BoldLine>
                            <Body>Not a logistics problem. An emotional one.</Body>
                            <BulletList items={[
                                "The industry optimized for transaction speed — and sacrificed emotional connection in the process",
                                "Faster checkout did not reduce buyer's remorse",
                                "Smarter algorithms did not reduce return rates",
                                "Something was missing — and it wasn't a feature",
                            ]} />
                            <Transition text="I started this conceptual exploration with one question: what would it look like if a commerce product finally understood how someone felt when they showed up?" />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 02 — WHERE WE BEGAN ═══════════════════════ */}
                    <Divider />
                    <section id="where-we-began" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="02 — Where We Began" title="I reframed the question before sketching a single screen" />
                            <Body>Most UX briefs frame shopping as an efficiency problem. I reframed it as a psychology problem.</Body>
                            <PullQuote text="How do emotional responses elicited by e-commerce design influence purchasing decisions, impulse behavior, and long-term brand loyalty?" />
                            <Body>This wasn't about designing better filters. It was about investigating the psychology of desire — and whether a digital product could meet that psychology with the same nuance a great in-store experience does.</Body>
                            <Callout
                                type="constraint"
                                title="This was greenfield conceptual work — no existing product to iterate on"
                                body="No live interface, no behavioral data, no product team. Every proposed direction had to be grounded in primary research, behavioral psychology, and analogous product analysis."
                            />
                            <Transition text="Which meant research had to come before design — and that turned out to be the right call." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 03 — WHAT WE FOUND ═══════════════════════ */}
                    <Divider />
                    <section id="what-we-found" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="03 — What We Found" title="Understanding the person before designing the product" />
                            <Body>I spent the first two months not designing. I needed to understand the emotional arc of a shopping session before proposing any solution.</Body>
                            <BulletList items={[
                                "Interviews with frequent online shoppers about browsing and buying behavior",
                                "Diary studies capturing real-time emotional states during shopping sessions",
                                "Behavioral economics research on consumer decision-making and cognitive load",
                                "Analysis of physical retail experiences and what made them emotionally resonant",
                            ]} />
                        </FadeIn>
                        <FadeIn delay={80}>
                            <FullImage src="/slides/Persona.jpg" alt="RFND user persona"
                                caption="Synthesized persona — the emotionally-driven, discovery-oriented modern shopper this concept was designed for" />
                        </FadeIn>
                        <FadeIn>
                            <BoldLine>She wasn't failing because the product was hard to use. She was failing because the product didn't know who she was that day.</BoldLine>
                            <Body>The user this concept was designed for showed up differently on a Sunday afternoon than she did on a Tuesday lunch break. Every existing app treated her exactly the same both times.</Body>
                            <Callout
                                type="insight"
                                title="People don't shop in one mode — they oscillate between two distinct emotional states"
                                body="Intent mode: goal-driven, efficiency-focused, knows what they want. Discovery mode: exploratory, emotionally open, looking for inspiration or surprise. Most platforms serve neither mode well because they assume both are the same person with the same need."
                            />
                            <Transition text="Once I could name the two modes, the design direction became clear — but getting there required a creative exploration that challenged almost every assumption I started with." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 04 — OPPORTUNITY ═══════════════════════ */}
                    <Divider />
                    <section id="opportunity" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="04 — Opportunity" title="Before designing screens, I found an emotional language" />
                            <Body>I deliberately resisted wireframes early. RFND's success as a concept would depend on its emotional register — not just its information architecture.</Body>
                            <BulletList items={[
                                "Built moodboards to define tonal and aesthetic direction",
                                "Studied how luxury brands use negative space, pacing, and atmosphere",
                                "Analyzed the sensory language of physical retail — what slows you down on purpose",
                                "Explored analogous products that created emotional connection without sacrificing utility",
                            ]} />
                        </FadeIn>
                        <FadeIn delay={80}>
                            <FullImage src="/slides/Mood%20board.png" alt="RFND moodboard"
                                caption="Visual and emotional territory — tonal direction and aesthetic reference for the envisioned RFND experience" />
                        </FadeIn>
                        <FadeIn>
                            <BoldLine>The most resonant retail experiences share one thing: they create space. They don't rush you toward a decision. They let you arrive at one.</BoldLine>
                            <Body>That became the organizing design principle: the proposed interface should feel less like a store directory and more like a room.</Body>
                            <Callout
                                type="tradeoff"
                                title="Emotional atmosphere vs. functional speed"
                                body="Designing for feeling is in direct tension with the efficiency metrics that drive e-commerce KPIs. The proposed solution accepted this tradeoff deliberately — Intent mode stays fast, Discovery mode slows down. The concept lives in the tension between both."
                            />
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, margin: "52px 0 16px" }}>
                                Concept Demo — Proposed Mood-Based Entry Point
                            </p>
                            <MoodCarousel />
                            <Transition text="With a creative direction established, the harder work began: making actual product decisions." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 05 — SOLUTION ═══════════════════════ */}
                    <Divider />
                    <section id="solution" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="05 — Solution" title="The one decision that shaped everything else" />
                            <Body>The core product decision in this concept was one I almost didn't make.</Body>
                            <BulletList items={[
                                "Option A: Smarter algorithm — infer emotional intent from past behavioral data",
                                "Option B: Explicit mood input — let the user define their context before browsing",
                                "I chose Option B",
                            ]} />
                            <BoldLine>The difference between "we noticed you like this" and "you told us how you feel tonight" is the difference between surveillance and conversation.</BoldLine>
                            <Callout
                                type="decision"
                                title="Voluntary signal over behavioral inference"
                                body="The envisioned system asks users to set their emotional context before browsing — occasion, mood, aesthetic intent — rather than inferring it. Personalization feels like a conversation. It also adapts to who they are today, not last Tuesday. People trust systems they feel in control of."
                            />
                            <p style={{ fontFamily: INTER, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, margin: "52px 0 16px" }}>
                                Concept Demo — Proposed Dual-Mode Experience
                            </p>
                            <ShoppingModeToggle />
                        </FadeIn>
                        <FadeIn delay={80}>
                            <FullImage src="/slides/homepgexplorations.png" alt="Homepage design explorations"
                                caption="Homepage explorations — iterating on hierarchy, mode entry points, and the first decision a user makes when they open the app" />
                        </FadeIn>
                        <FadeIn>
                            <Transition text="With the core concept defined, I needed to validate that the features built on top of it would hold — not just as ideas, but as behavioral propositions." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 06 — VALIDATION ═══════════════════════ */}
                    <Divider />
                    <section id="validation" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="06 — Validation" title="Every proposed feature was evaluated against two questions" />
                            <BulletList items={[
                                "Does this solve a real behavioral friction I documented in research?",
                                "Does this create lasting value — or just novelty?",
                            ]} />
                            <BoldLine>Novelty drives short-term engagement. Genuine value drives return behavior.</BoldLine>
                            <Body>For a concept competing on emotional loyalty, every feature needed to pass both filters.</Body>
                            <BulletList items={[
                                "Conversational filtering — passed both: reduced decision paralysis, made the experience feel less mechanical",
                                "Digital closet — passed both: addressed fragmented wishlist behavior and style continuity over time",
                                "Mood-based entry point — passed both: made personalization feel like consent, not surveillance",
                                "Gamified discovery mechanic — passed novelty only; required significant rethinking before inclusion",
                            ]} />
                            <Callout
                                type="insight"
                                title="The proposed features that survived were rooted in behavior, not delight"
                                body="Every feature in the final concept addressed a specific gap documented in research — too many choices causing paralysis, fragmented wishlists creating friction, purchases misaligned with how someone felt the day they bought. Delight was a byproduct, not the strategy."
                            />
                            <Transition text="With the feature set validated against research, the concept was ready to be presented as a complete proposed experience." />
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 07 — IMPACT ═══════════════════════ */}
                    <Divider />
                    <section id="impact" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="07 — Impact" title="A proposed product that meets you where you are" />
                            <Body>The concept I proposed was a dual-mode commerce platform built on one principle:</Body>
                            <BoldLine>The interface should adapt to the user's emotional intent — not force the user to adapt to the interface.</BoldLine>
                            <BulletList items={[
                                "Intent mode — fast filtering, direct navigation, reduced density, frictionless checkout",
                                "Discovery mode — editorial curation, mood-based recommendations, conversational filtering, digital closet",
                                "The mode you're in feels legible through layout and pacing — never through a label or onboarding prompt",
                            ]} />
                            <PullQuote text="The best retail experience doesn't ask what you want to buy. It asks how you want to feel." />
                        </FadeIn>
                        <FadeIn delay={80}>
                            <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: 20, margin: "44px 0" }}>
                                {[
                                    { src: "/slides/discover.png", label: "Discover Screen", desc: "Proposed mood-aware discovery — editorial curation adapting to emotional intent and occasion" },
                                    { src: "/slides/profile.png", label: "Profile Screen", desc: "Proposed style hub — digital closet, style history, and preference memory across sessions" },
                                ].map(({ src, label, desc }) => (
                                    <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                                        <img src={src} alt={label} style={{ width: "100%", height: "auto", display: "block", borderRadius: 14, boxShadow: "0 4px 52px rgba(0,0,0,0.10)", maxWidth: "100%" }} />
                                        <div>
                                            <p style={{ fontFamily: INTER, fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ink, margin: "0 0 5px" }}>{label}</p>
                                            <p style={{ fontFamily: YB, fontStyle: "italic", fontWeight: 400, fontSize: 13, color: C.ink3, margin: 0, lineHeight: 1.55 }}>{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ═══════════════════════ 08 — REFLECTION ═══════════════════════ */}
                    <Divider />
                    <section id="reflection" style={{ scrollMarginTop: 100 }}>
                        <FadeIn>
                            <ChapterLabel index="08 — Reflection" title="What this conceptual project taught me" />
                            <Body>RFND clarified how I think about design at a strategic level — as a discipline that sits at the intersection of business, psychology, and behavior. This project concluded with a full concept presentation — a speculative capstone exploring what emotionally-aware commerce could look like if built from first principles.</Body>
                            <BulletList items={[
                                "Knowing what to build is half the work — knowing what not to build is the other half",
                                "Several early concepts didn't survive contact with the research. That's not failure — that's process working correctly",
                                "The transition between modes is where this concept would be stress-tested most with a real team",
                                "Behavioral testing at scale, over time, would be the immediate next step if this were to move beyond a conceptual exploration",
                            ]} />
                            <BoldLine>Every feature decision was downstream of a strategic question. Every visual choice was in service of an emotional outcome.</BoldLine>
                            <Callout
                                type="insight"
                                title="The future of commerce is emotional intelligence — not just artificial intelligence"
                                body="Personalization at scale is already a commodity. What the next generation of commerce concepts needs to explore is harder to replicate: understanding not just what a user is looking for, but what kind of experience they need in that moment. That's the space RFND was designed to occupy."
                            />
                            <div style={{
                                marginTop: 64, display: "flex", gap: 24, alignItems: "flex-start",
                                padding: phone ? "28px 24px" : "56px 60px", backgroundColor: C.ink, borderRadius: 16,
                            }}>
                                <span style={{ fontFamily: Z, fontSize: 52, lineHeight: "0.8", color: C.pink, marginTop: 4, flexShrink: 0, opacity: 0.5 }}>"</span>
                                <p style={{
                                    fontFamily: Z, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px, 2.5vw, 26px)",
                                    lineHeight: 1.55, maxWidth: 680, color: "rgba(255,255,255,0.92)", margin: 0,
                                }}>
                                    Digital experiences can still feel meaningful — when the interface listens before it speaks, and adapts before it assumes.
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ── Back to work ── */}
                    <div style={{
                        paddingTop: 64, marginTop: 80, borderTop: `1px solid ${C.border}`,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                        <a href="/#work"
                            style={{ fontFamily: INTER, fontSize: 14, fontWeight: 500, color: C.muted, textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.18s", minHeight: 44, display: "flex", alignItems: "center" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
                            ← Back to work
                        </a>
                    </div>

                </div>
            </div>
        </div>
    )
}
