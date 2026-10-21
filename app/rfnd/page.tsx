"use client"

import React, { useState, useRef, useEffect } from "react"
import SharedNav from "../../components/SharedNav"
import { COLORS, EASE_SPRING, FONT_SANS } from "../../components/site"

const Z = "Zodiak, 'Times New Roman', serif"
const INTER = FONT_SANS

const C = {
    bg: "#FFFFFF",
    surface: "#F4F3EF",
    surface2: "#ECEAE4",
    ink: "#1C1C1A",
    ink2: "#383834",
    ink3: "#5A5A54",
    muted: "#8A8A82",
    border: "rgba(28,28,26,0.1)",
}

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "context", label: "Context" },
    { id: "research", label: "Research" },
    { id: "opportunity", label: "Opportunity" },
    { id: "solution", label: "Solution" },
    { id: "results", label: "Results" },
    { id: "reflection", label: "Reflection" },
]

function useResponsive() {
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    useEffect(() => {
        const check = () => {
            const w = document.documentElement.clientWidth
            setPhone(w < 768)
            setTablet(w >= 768 && w < 1024)
        }
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

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, visible } = useInView()
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(32px)",
            transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}>
            {children}
        </div>
    )
}

function CountUp({ to, suffix = "", duration = 1200 }: { to: number; suffix?: string; duration?: number }) {
    const { ref, visible } = useInView(0.3)
    const [value, setValue] = useState(0)
    useEffect(() => {
        if (!visible) return
        const start = performance.now()
        const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(eased * to))
            if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
    }, [visible, to, duration])
    return <span ref={ref}>{value}{suffix}</span>
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
                fontFamily: INTER, fontSize: phone ? 40 : 52, fontWeight: 200,
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

function BoldLine({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontFamily: INTER, fontWeight: 300, fontSize: "clamp(18px, 2.4vw, 24px)",
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
                color: C.muted, display: "block", marginBottom: 4, userSelect: "none", opacity: 0.4,
            }}>&ldquo;</span>
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
                    <span style={{ fontFamily: INTER, fontSize: "15px", color: C.muted, flexShrink: 0, marginTop: "1px", lineHeight: 1.65 , fontWeight: 400}}>&ndash;</span>
                    <p style={{ fontFamily: INTER, fontSize: "15px", color: C.ink3, lineHeight: 1.65, margin: 0 }}>{item}</p>
                </div>
            ))}
        </div>
    )
}

function Callout({ type, title, body }: {
    type: "insight" | "decision"
    title: string; body: string
}) {
    const config = {
        insight: { bg: C.ink, label: "Key Insight", labelColor: "rgba(255,255,255,0.38)", titleColor: "#fff", bodyColor: "rgba(255,255,255,0.7)", border: "none", br: "12px" },
        decision: { bg: C.surface, label: "Design Decision", labelColor: C.muted, titleColor: C.ink, bodyColor: C.ink2, border: `3px solid ${C.ink}`, br: "0 12px 12px 0" },
    }
    const s = config[type]
    return (
        <div style={{ backgroundColor: s.bg, borderLeft: s.border, borderRadius: s.br, padding: "32px 36px", margin: "40px 0" }}>
            <p style={{ fontFamily: INTER, fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: s.labelColor, marginBottom: "12px" }}>{s.label}</p>
            <p style={{ fontFamily: INTER, fontSize: "19px", fontWeight: 400, color: s.titleColor, marginBottom: "10px", lineHeight: 1.35 }}>{title}</p>
            <p style={{ fontFamily: INTER, fontSize: "15px", lineHeight: 1.7, color: s.bodyColor, margin: 0 }}>{body}</p>
        </div>
    )
}

function FullImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
    return (
        <div style={{ margin: "56px 0" }}>
            <img src={src} alt={alt} style={{
                width: "100%", height: "auto", display: "block",
                boxShadow: "0 4px 52px rgba(0,0,0,0.10)", maxWidth: "100%",
            }} />
            {caption && (
                <p style={{
                    fontFamily: Z, fontStyle: "italic", fontWeight: 400, fontSize: 13,
                    color: C.ink3, textAlign: "center", margin: "16px 0 0", lineHeight: 1.6,
                }}>{caption}</p>
            )}
        </div>
    )
}

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
                    <p style={{ fontFamily: INTER, fontSize: "20px", fontWeight: 300, color: C.ink, margin: 0 }}>{modes[mode].title}</p>
                </div>
                <p style={{ fontFamily: INTER, fontSize: "15px", lineHeight: 1.65, color: C.ink3, marginBottom: "20px" }}>{modes[mode].desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {modes[mode].features.map((f, i) => (
                        <div key={i} style={{ fontFamily: INTER, fontSize: "12px", color: C.ink2, padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "6px" }}>&bull; {f}</div>
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
                <button onClick={prev} style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.border}`, backgroundColor: "white", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44 }}>&larr;</button>
                <div style={{ flex: 1, maxWidth: 400, height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
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
                                <p style={{ fontFamily: INTER, fontSize: isActive ? 18 : 15, fontWeight: 400, color: C.ink, margin: 0, transition: "font-size 0.5s" }}>{mood.label}</p>
                            </div>
                        )
                    })}
                </div>
                <button onClick={next} style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.border}`, backgroundColor: "white", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44 }}>&rarr;</button>
            </div>
            <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
                Envisioned interaction: mood-first entry point for the discovery experience
            </p>
        </div>
    )
}

const ROSE = "#A4425C"

const EYEBROW: React.CSSProperties = { fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ink3, margin: "0 0 12px" }

type ComparePane = { eyebrow: string; title: string; items: string[]; note?: string; chosen?: boolean }

function ComparePanel({ label, panes, footer, phone }: { label?: string; panes: [ComparePane, ComparePane]; footer?: string; phone: boolean }) {
    return (
        <div style={{ margin: "40px 0" }}>
            {label && <p style={{ ...EYEBROW, color: C.muted, marginBottom: 16 }}>{label}</p>}
            <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr", gap: phone ? 12 : 16 }}>
                {panes.map((p) => (
                    <div key={p.title} style={{
                        backgroundColor: p.chosen ? C.bg : C.surface,
                        border: p.chosen ? `1.5px solid ${C.ink}` : `1.5px solid transparent`,
                        borderRadius: 14, padding: phone ? "24px 22px" : "28px 30px", position: "relative",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <p style={EYEBROW}>{p.eyebrow}</p>
                            {p.chosen && (
                                <span style={{ fontFamily: INTER, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", backgroundColor: ROSE, borderRadius: 20, padding: "3px 10px", flexShrink: 0 }}>Chosen</span>
                            )}
                        </div>
                        <p style={{ fontFamily: INTER, fontSize: 19, fontWeight: 400, color: C.ink, lineHeight: 1.35, margin: "0 0 16px" }}>{p.title}</p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                            {p.items.map((it) => (
                                <li key={it} style={{ display: "flex", gap: 10, fontFamily: INTER, fontSize: 14, lineHeight: 1.55, color: C.ink2 }}>
                                    <span aria-hidden="true" style={{ color: C.muted, flexShrink: 0 }}>&ndash;</span>{it}
                                </li>
                            ))}
                        </ul>
                        {p.note && (
                            <p style={{ fontFamily: Z, fontStyle: "italic", fontWeight: 400, fontSize: 15, color: C.ink2, margin: "18px 0 0", paddingTop: 14, borderTop: `1px solid ${C.border}`, lineHeight: 1.5 }}>{p.note}</p>
                        )}
                    </div>
                ))}
            </div>
            {footer && (
                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.65, color: C.ink3, margin: "18px 0 0", maxWidth: 600 }}>{footer}</p>
            )}
        </div>
    )
}

function FlowArrow({ vertical, label }: { vertical: boolean; label?: string }) {
    return (
        <div aria-hidden="true" style={{
            display: "flex", flexDirection: vertical ? "row" : "column", alignItems: "center", justifyContent: "center",
            gap: 6, padding: vertical ? "4px 0 4px 22px" : "0 4px", flexShrink: 0,
        }}>
            <svg width={vertical ? 12 : 28} height={vertical ? 22 : 12} viewBox={vertical ? "0 0 12 22" : "0 0 28 12"} fill="none">
                {vertical
                    ? <path d="M6 1v18M1.5 14.5L6 20l4.5-5.5" stroke={C.ink3} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    : <path d="M1 6h24M19.5 1.5L26 6l-6.5 4.5" stroke={C.ink3} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
            {label && <span style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, color: C.ink3, letterSpacing: "0.04em" }}>{label}</span>}
        </div>
    )
}

function FlowStep({ n, title, sub, tone = "plain" }: { n?: string; title: string; sub?: string; tone?: "plain" | "pass" | "fail" }) {
    const bg = tone === "pass" ? C.ink : C.surface
    return (
        <li style={{
            listStyle: "none", flex: 1, minWidth: 0, backgroundColor: bg, borderRadius: 12,
            border: tone === "fail" ? "1.5px dashed rgba(200,60,60,0.45)" : "1.5px solid transparent",
            padding: "18px 18px", display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
            {n && <p style={{ ...EYEBROW, margin: "0 0 6px", color: tone === "pass" ? "rgba(255,255,255,0.72)" : C.ink3 }}>{n}</p>}
            <p style={{ fontFamily: INTER, fontSize: 15, fontWeight: 500, lineHeight: 1.4, margin: 0, color: tone === "pass" ? "#fff" : C.ink }}>{title}</p>
            {sub && <p style={{ fontFamily: INTER, fontSize: 13, lineHeight: 1.5, margin: "6px 0 0", color: tone === "pass" ? "rgba(255,255,255,0.78)" : tone === "fail" ? "#A33030" : C.ink3 }}>{sub}</p>}
        </li>
    )
}

function FeatureFilterFlow({ phone }: { phone: boolean }) {
    const vertical = phone
    return (
        <figure style={{ margin: "0 0 56px" }}>
            <ol aria-label="Feature filter: each proposed feature passed through two questions before it was kept" style={{
                display: "flex", flexDirection: vertical ? "column" : "row", alignItems: "stretch", padding: 0, margin: 0,
            }}>
                <FlowStep n="Input" title="Proposed feature" sub="6 candidates" />
                <FlowArrow vertical={vertical} />
                <FlowStep n="Filter 1" title="Solves a friction documented in research?" />
                <FlowArrow vertical={vertical} />
                <FlowStep n="Filter 2" title="Creates lasting value, not just novelty?" />
                <FlowArrow vertical={vertical} />
                <li style={{ listStyle: "none", flex: 1, minWidth: 0 }}>
                    <ul style={{ padding: 0, margin: 0, display: "flex", flexDirection: vertical ? "row" : "column", gap: 8, height: "100%" }}>
                        <FlowStep tone="pass" n="Passed both" title="5 validated" />
                        <FlowStep tone="fail" n="Novelty only" title="1 eliminated" sub="Gamified discovery mechanic" />
                    </ul>
                </li>
            </ol>
        </figure>
    )
}

type Note = { x: number; y: number; label: string }

function AnnotatedShot({ src, alt, title, notes, phone }: { src: string; alt: string; title: string; notes: Note[]; phone: boolean }) {
    const size = phone ? 18 : 20
    return (
        <figure style={{ flex: 1, minWidth: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ position: "relative" }}>
                <img src={src} alt={alt} style={{ width: "100%", height: "auto", display: "block", boxShadow: "0 4px 52px rgba(0,0,0,0.10)" }} />
                {notes.map((n, i) => (
                    <span key={i} aria-hidden="true" style={{
                        position: "absolute", left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)",
                        width: size, height: size, borderRadius: "50%", backgroundColor: ROSE, color: "#fff",
                        fontFamily: INTER, fontSize: phone ? 10 : 11, fontWeight: 600, lineHeight: `${size}px`, textAlign: "center",
                        boxShadow: "0 0 0 2px #fff, 0 2px 8px rgba(0,0,0,0.18)",
                    }}>{i + 1}</span>
                ))}
            </div>
            <figcaption>
                <p style={{ fontFamily: INTER, fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ink, margin: "0 0 10px" }}>{title}</p>
                <ol style={{ padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {notes.map((n, i) => (
                        <li key={i} style={{ listStyle: "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: "50%", border: `1px solid ${ROSE}`, color: ROSE, fontFamily: INTER, fontSize: 10, fontWeight: 600, lineHeight: "16px", textAlign: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                            <span style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, lineHeight: 1.5 }}><span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{`Callout ${i + 1}: `}</span>{n.label}</span>
                        </li>
                    ))}
                </ol>
            </figcaption>
        </figure>
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
                        <span aria-hidden="true" style={{ width: isActive ? 12 : 0, height: 1, backgroundColor: COLORS.ink, transition: `width 0.3s ${EASE_SPRING}` }} />
                        <span style={{ fontFamily: INTER, fontSize: 12, fontWeight: isActive ? 500 : 400, color: isActive ? COLORS.ink : COLORS.muted, transition: "color 0.3s ease" }}>
                            {label}
                        </span>
                    </a>
                )
            })}
        </nav>
    )
}

export default function RFNDCaseStudy() {
    const { phone, tablet, desktop } = useResponsive()
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))

    const tags = ["Conceptual Capstone", "UX Strategy", "E-Commerce"]

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <SharedNav />

            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                gap: desktop ? 48 : undefined,
                maxWidth: 1400,
                margin: "0 auto",
                padding: `0 ${phone ? 20 : tablet ? 40 : 80}px 180px`,
            }}>
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 96, paddingTop: 48 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}

                <div>

                    {/* ════════ OVERVIEW ════════ */}
                    <section id="overview" style={{ scrollMarginTop: 96, paddingTop: phone ? 48 : 40 }}>
                        <FadeIn>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                                {tags.map(tag => (
                                    <span key={tag} style={{
                                        fontFamily: INTER, fontSize: 11, fontWeight: 500, color: C.ink3,
                                        padding: "5px 14px", border: `1px solid ${C.border}`, borderRadius: 20,
                                    }}>{tag}</span>
                                ))}
                            </div>

                            <h1 style={{
                                fontFamily: INTER, fontWeight: 300, fontSize: "clamp(32px, 5.5vw, 66px)",
                                lineHeight: 1.02, letterSpacing: "-0.03em", marginBottom: 32, maxWidth: 880, color: C.ink,
                            }}>
                                RFND: Reimagining Emotional E-Commerce
                            </h1>

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
                                    A self-initiated conceptual exploration into why emotional engagement is a commerce problem, and what mood-aware design could look like as a solution.
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: phone ? 0 : 4 }}>
                                    {([
                                        ["Role", "Product Strategist · UX Designer · Researcher"],
                                        ["Timeline", "9 Months"],
                                        ["Type", "Speculative Design · Conceptual Exploration"],
                                    ] as const).map(([k, v]) => (
                                        <div key={k}>
                                            <p style={{ fontFamily: INTER, fontWeight: 500, fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{k}</p>
                                            <p style={{ fontFamily: Z, fontStyle: "italic", fontWeight: 300, fontSize: 14, color: C.ink2, margin: 0 }}>{v}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <FullImage src="/images/rfnd-hero.webp" alt="RFND: Reimagining Emotional E-Commerce" />
                        </FadeIn>
                    </section>

                    {/* ════════ CONTEXT ════════ */}
                    <section id="context" style={{ scrollMarginTop: 96, marginTop: phone ? 96 : 144 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>Context</p>
                            <h2 style={{ fontFamily: INTER, fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 200, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.12, maxWidth: 680, marginBottom: 20 }}>
                                The industry was optimizing for speed and sacrificing connection
                            </h2>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: phone ? 12 : 16, maxWidth: 680, margin: "8px 0 0" }}>
                                {([
                                    ["$700B+", "Fashion e-commerce revenue, every year"],
                                    ["$100–300B", "Of that inventory, returned every year"],
                                ] as const).map(([v, l]) => (
                                    <div key={v} style={{ borderTop: `1px solid ${C.ink}`, paddingTop: 14 }}>
                                        <p style={{ fontFamily: INTER, fontSize: phone ? 30 : 44, fontWeight: 200, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1, margin: "0 0 10px" }}>{v}</p>
                                        <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, lineHeight: 1.5, margin: 0 }}>{l}</p>
                                    </div>
                                ))}
                            </div>
                            <BoldLine>Not a logistics problem. An emotional one.</BoldLine>

                            <ComparePanel phone={phone} label="The reframe" panes={[
                                { eyebrow: "How the industry framed it", title: "Shopping as an efficiency problem", items: ["Faster checkout did not reduce buyer’s remorse", "Smarter algorithms did not reduce return rates"] },
                                { eyebrow: "How I framed it", title: "Shopping as a psychology problem", items: ["What if a commerce product understood how someone felt when they showed up?", "Could it meet the psychology of desire with the nuance of a great in-store experience?"] },
                            ]} />

                            <PullQuote text="How do emotional responses elicited by e-commerce design influence purchasing decisions, impulse behavior, and long-term brand loyalty?" />
                        </FadeIn>
                    </section>

                    {/* ════════ RESEARCH ════════ */}
                    <section id="research" style={{ scrollMarginTop: 96, marginTop: phone ? 96 : 144 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>Research</p>
                            <h2 style={{ fontFamily: INTER, fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 200, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.12, maxWidth: 680, marginBottom: 20 }}>
                                Understanding the person before designing the product
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: 600, marginBottom: 24 }}>
                                I spent the first two months not designing, mapping the emotional arc of a shopping session instead.
                            </p>
                            <ul aria-label="Research methods" style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr", gap: phone ? 10 : 12 }}>
                                {([
                                    ["Interviews", "Frequent online shoppers on browsing and buying"],
                                    ["Diary studies", "Real-time emotional states during sessions"],
                                    ["Behavioral economics", "Decision-making and cognitive load"],
                                    ["Physical retail analysis", "What made in-store experiences resonate"],
                                ] as const).map(([t, d], i) => (
                                    <li key={t} style={{ display: "flex", gap: 14, alignItems: "baseline", backgroundColor: C.surface, borderRadius: 12, padding: "16px 18px" }}>
                                        <span aria-hidden="true" style={{ fontFamily: INTER, fontSize: 12, fontWeight: 500, color: C.ink3, flexShrink: 0 }}>0{i + 1}</span>
                                        <span>
                                            <span style={{ display: "block", fontFamily: INTER, fontSize: 15, fontWeight: 500, color: C.ink, lineHeight: 1.4 }}>{t}</span>
                                            <span style={{ display: "block", fontFamily: INTER, fontSize: 13, color: C.ink3, lineHeight: 1.5, marginTop: 2 }}>{d}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>

                        <FadeIn delay={80}>
                            <div style={{ maxWidth: 560, margin: "56px 0" }}>
                                <img src="/images/rfnd-persona.webp" alt="RFND user persona" style={{
                                    width: "100%", height: "auto", display: "block",
                                    boxShadow: "0 4px 52px rgba(0,0,0,0.10)",
                                }} />
                                <p style={{ fontFamily: Z, fontStyle: "italic", fontWeight: 400, fontSize: 13, color: C.ink3, textAlign: "center", margin: "16px 0 0", lineHeight: 1.6 }}>
                                    Synthesized persona: the emotionally-driven, discovery-oriented shopper this concept was designed for
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <BoldLine>She wasn't failing because the product was hard to use. She was failing because the product didn't know who she was that day.</BoldLine>
                            <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: 600, marginBottom: 0 }}>
                                She showed up differently on a Sunday afternoon than on a Tuesday lunch break. Every existing app treated her the same both times.
                            </p>
                            <ComparePanel phone={phone} label="Key insight: one shopper, two emotional states" panes={[
                                { eyebrow: "Intent mode", title: "Knows what she wants", items: ["Goal-driven", "Efficiency-focused"] },
                                { eyebrow: "Discovery mode", title: "Looking for inspiration or surprise", items: ["Exploratory", "Emotionally open"] },
                            ]} footer="Most platforms serve neither mode well because they assume both are the same person with the same need." />
                        </FadeIn>
                    </section>

                    {/* ════════ OPPORTUNITY ════════ */}
                    <section id="opportunity" style={{ scrollMarginTop: 96, marginTop: phone ? 96 : 144 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>Opportunity</p>
                            <h2 style={{ fontFamily: INTER, fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 200, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.12, maxWidth: 680, marginBottom: 20 }}>
                                Before designing screens, I found an emotional language
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: 600, marginBottom: 24 }}>
                                I deliberately resisted wireframes early. RFND's success as a concept would depend on its emotional register, not just its information architecture.
                            </p>
                            <BulletList items={[
                                "Built moodboards to define tonal and aesthetic direction",
                                "Studied how luxury brands use negative space, pacing, and atmosphere",
                                "Analyzed the sensory language of physical retail: what slows you down on purpose",
                                "Explored analogous products that created emotional connection without sacrificing utility",
                            ]} />
                        </FadeIn>

                        <FadeIn delay={80}>
                            <div style={{ maxWidth: 560, margin: "56px 0" }}>
                                <img src="/images/rfnd-moodboard.webp" alt="RFND moodboard" style={{
                                    width: "100%", height: "auto", display: "block",
                                    boxShadow: "0 4px 52px rgba(0,0,0,0.10)",
                                }} />
                                <p style={{ fontFamily: Z, fontStyle: "italic", fontWeight: 400, fontSize: 13, color: C.ink3, textAlign: "center", margin: "16px 0 0", lineHeight: 1.6 }}>
                                    Visual and emotional territory: tonal direction and aesthetic reference for the envisioned RFND experience
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <BoldLine>The most resonant retail experiences share one thing: they create space. They don't rush you toward a decision. They let you arrive at one.</BoldLine>
                            <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: 600, marginBottom: 24 }}>
                                That became the organizing design principle: the proposed interface should feel less like a store directory and more like a room.
                            </p>
                            <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, margin: "52px 0 16px" }}>
                                Concept Demo: Proposed Mood-Based Entry Point
                            </p>
                            <MoodCarousel />
                        </FadeIn>
                    </section>

                    {/* ════════ SOLUTION ════════ */}
                    <section id="solution" style={{ scrollMarginTop: 96, marginTop: phone ? 96 : 144 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>Solution</p>
                            <h2 style={{ fontFamily: INTER, fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 200, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.12, maxWidth: 680, marginBottom: 20 }}>
                                The one decision that shaped everything else
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: 600, marginBottom: 24 }}>
                                The core product decision in this concept was one I almost didn&apos;t make.
                            </p>
                            <ComparePanel phone={phone} panes={[
                                { eyebrow: "Option A", title: "A smarter algorithm infers emotional intent from past behavior", items: ["Built on behavioral data", "Reflects who they were last Tuesday"], note: "“We noticed you like this” — surveillance" },
                                { eyebrow: "Option B", title: "The shopper sets her context before browsing", items: ["Occasion, mood, aesthetic intent", "Adapts to who they are today"], note: "“You told us how you feel tonight” — conversation", chosen: true },
                            ]} />
                            <Callout
                                type="decision"
                                title="Voluntary signal over behavioral inference"
                                body="People trust systems they feel in control of."
                            />
                            <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, margin: "52px 0 16px" }}>
                                Concept Demo: Proposed Dual-Mode Experience
                            </p>
                            <ShoppingModeToggle />
                        </FadeIn>
                        <FadeIn delay={80}>
                            <FullImage src="/images/rfnd-homepage-explorations.webp" alt="Homepage design explorations"
                                caption="Homepage explorations: iterating on hierarchy, mode entry points, and the first decision a user makes when they open the app" />
                        </FadeIn>
                    </section>

                    {/* ════════ RESULTS ════════ */}
                    <section id="results" style={{ scrollMarginTop: 96, marginTop: phone ? 96 : 144 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>Results</p>
                            <h2 style={{ fontFamily: INTER, fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 200, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.12, maxWidth: 680, marginBottom: 20 }}>
                                Validating every feature against real behavior
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: 600, marginBottom: 48 }}>
                                Novelty drives short-term engagement; genuine value drives return behavior. So every proposed feature had to pass two filters.
                            </p>
                        </FadeIn>

                        <FadeIn delay={40}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4, 1fr)",
                                gap: phone ? 16 : 20, marginBottom: 64,
                            }}>
                                <ImpactCard value={`${12}`} label="Research Participants" phone={phone} />
                                <ImpactCard value={`${2}`} label="Shopping Modes Identified" phone={phone} />
                                <ImpactCard value={`${5}`} label="Features Validated" phone={phone} />
                                <ImpactCard value={`${9}`} label="Months of Research" phone={phone} />
                            </div>
                        </FadeIn>

                        <FadeIn delay={60}>
                            <FeatureFilterFlow phone={phone} />

                            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                                {[
                                    { feature: "Conversational filtering", result: "Validated", desc: "Reduced decision paralysis, made the experience feel less mechanical" },
                                    { feature: "Digital closet", result: "Validated", desc: "Addressed fragmented wishlist behavior and style continuity over time" },
                                    { feature: "Mood-based entry point", result: "Validated", desc: "Made personalization feel like consent, not surveillance" },
                                    { feature: "Style profile memory", result: "Validated", desc: "Connected browsing sessions into a coherent personal experience" },
                                    { feature: "Editorial curation feed", result: "Validated", desc: "Supported discovery mode with emotionally resonant content" },
                                    { feature: "Gamified discovery mechanic", result: "Eliminated", desc: "Passed novelty filter only, and required significant rethinking" },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding: phone ? "16px 0" : "16px 24px",
                                        borderBottom: `1px solid ${C.border}`,
                                        display: "flex", alignItems: "center", gap: 14,
                                    }}>
                                        <span style={{
                                            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                            backgroundColor: item.result === "Validated" ? "rgba(138,138,130,0.15)" : "rgba(200,60,60,0.1)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <span style={{ fontFamily: INTER, fontSize: 10, color: item.result === "Validated" ? C.muted : "#C83C3C" }}>
                                                {item.result === "Validated" ? "✓" : "✕"}
                                            </span>
                                        </span>
                                        <div>
                                            <p style={{ fontFamily: INTER, fontSize: 14, fontWeight: 600, color: C.ink, margin: 0, lineHeight: 1.5 }}>{item.feature}</p>
                                            <p style={{ fontFamily: INTER, fontSize: 13, color: C.ink3, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={80}>
                            <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: phone ? 40 : 24, margin: "64px 0 44px" }}>
                                <AnnotatedShot phone={phone} src="/images/rfnd-discover.webp" title="Discover screen"
                                    alt="Proposed RFND Discover screen: 'Discover Your Style' with chips to select type, values and mood"
                                    notes={[
                                        { x: 12.2, y: 43.9, label: "Type: what she is shopping for" },
                                        { x: 36.6, y: 43.9, label: "Values, e.g. sustainable, timeless" },
                                        { x: 61, y: 43.9, label: "Mood: the explicit, voluntary signal (Option B)" },
                                    ]} />
                                <AnnotatedShot phone={phone} src="/images/rfnd-profile.webp" title="Profile screen"
                                    alt="Proposed RFND Profile screen for Maya: sizes, values, saved items and a Digital Closet tab"
                                    notes={[
                                        { x: 37.2, y: 40.2, label: "Style profile memory: sizes and values carried across sessions" },
                                        { x: 83.4, y: 24.4, label: "Saved items, gathered in one place" },
                                        { x: 27.6, y: 58.8, label: "Digital closet: style continuity over time" },
                                    ]} />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ REFLECTION ════════ */}
                    <section id="reflection" style={{ scrollMarginTop: 96, marginTop: phone ? 96 : 144 }}>
                        <FadeIn>
                            <p style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: 20 }}>Reflection</p>
                            <h2 style={{ fontFamily: INTER, fontSize: "clamp(28px, 3.4vw, 42px)", fontWeight: 200, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.12, maxWidth: 680, marginBottom: 20 }}>
                                What this project taught me
                            </h2>
                            <p style={{ fontFamily: INTER, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: 600, marginBottom: 24 }}>
                                RFND ended as a full concept presentation, and clarified how I see design: a discipline at the intersection of business, psychology, and behavior.
                            </p>
                            <BulletList items={[
                                "Knowing what not to build is half the work. Early concepts that didn't survive the research were the process working",
                                "The transition between modes is where a real team would stress-test this concept most",
                                "Next step beyond concept: behavioral testing at scale, over time",
                            ]} />
                        </FadeIn>

                        <FadeIn delay={60}>
                            <div style={{
                                marginTop: 64, display: "flex", gap: 24, alignItems: "flex-start",
                                padding: phone ? "28px 24px" : "56px 60px", backgroundColor: C.ink, borderRadius: 16,
                            }}>
                                <span style={{ fontFamily: Z, fontSize: 52, lineHeight: "0.8", color: C.muted, marginTop: 4, flexShrink: 0, opacity: 0.5 }}>&ldquo;</span>
                                <p style={{
                                    fontFamily: Z, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(18px, 2.5vw, 26px)",
                                    lineHeight: 1.55, maxWidth: 680, color: "rgba(255,255,255,0.92)", margin: 0,
                                }}>
                                    Digital experiences can still feel meaningful when the interface listens before it speaks, and adapts before it assumes.
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ── Back to work ── */}
                    <div style={{
                        paddingTop: 64, marginTop: 120, borderTop: `1px solid ${C.border}`,
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                        <a href="/#work"
                            style={{ fontFamily: INTER, fontSize: 14, fontWeight: 500, color: C.muted, textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.18s", minHeight: 44, display: "flex", alignItems: "center" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
                            &larr; Back to work
                        </a>
                    </div>

                </div>
            </div>
        </div>
    )
}
