"use client"

import React, { useState, useRef, useEffect } from "react"


const Z = "Zodiak, 'Times New Roman', serif"
const INTER = "Inter, system-ui, sans-serif"

const C = {
    bg: "#FFFFFF",
    surface: "#F5F4F0",
    surface2: "#ECEAE4",
    surface3: "#E0DDD6",
    ink: "#111111",
    ink2: "#383834",
    ink3: "#5A5A54",
    muted: "#8A8A82",
    border: "rgba(0,0,0,0.07)",
}

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "goal", label: "Goal" },
    { id: "strategy", label: "Strategy" },
    { id: "targeting", label: "Targeting" },
    { id: "creative", label: "Creative" },
    { id: "results", label: "Results" },
    { id: "insights", label: "Insights" },
    { id: "reflection", label: "Reflection" },
]

// ── Responsive hook ────────────────────────────────────────────────────────────
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

// ── Utilities ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true)
                    obs.disconnect()
                }
            },
            { threshold }
        )
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
            if (current >= target) {
                setVal(target)
                clearInterval(t)
            } else setVal(Math.round(current))
        }, interval)
        return () => clearInterval(t)
    }, [active, target, duration])
    return val
}

function FadeIn({
    children,
    delay = 0,
}: {
    children: React.ReactNode
    delay?: number
}) {
    const { ref, visible } = useInView(0.06)
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
                transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            }}
        >
            {children}
        </div>
    )
}

function Divider() {
    return (
        <div
            style={{
                width: "100%",
                height: "1px",
                backgroundColor: C.border,
                margin: "80px 0 48px",
            }}
        />
    )
}

// ── Section label ──────────────────────────────────────────────────────────────
function SectionLabel({
    step,
    title,
    sub,
}: {
    step: string
    title: string
    sub?: string
}) {
    return (
        <div style={{ marginBottom: 28 }}>
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.muted,
                    marginBottom: "12px",
                }}
            >
                {step}
            </p>
            <h2
                style={{
                    fontFamily: Z,
                    fontSize: "clamp(22px,3vw,32px)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color: C.ink,
                    margin: "0 0 8px",
                    lineHeight: 1.08,
                }}
            >
                {title}
            </h2>
            {sub && (
                <p
                    style={{
                        fontFamily: Z,
                        fontStyle: "italic",
                        fontWeight: 300,
                        fontSize: "17px",
                        color: C.ink3,
                        margin: 0,
                        lineHeight: 1.55,
                        maxWidth: 640,
                    }}
                >
                    {sub}
                </p>
            )}
        </div>
    )
}

function Body({ children }: { children: React.ReactNode }) {
    return (
        <p
            style={{
                fontFamily: INTER,
                fontSize: "14.5px",
                lineHeight: "1.8",
                color: C.ink2,
                maxWidth: "720px",
                marginBottom: "16px",
                letterSpacing: "-0.005em",
            }}
        >
            {children}
        </p>
    )
}

// ── Animated stat ──────────────────────────────────────────────────────────────
function AnimStat({
    num,
    suffix,
    label,
    sub,
    bg,
}: {
    num: number
    suffix: string
    label: string
    sub?: string
    bg: string
}) {
    const { ref, visible } = useInView(0.4)
    const val = useCounter(num, visible)
    const [hov, setHov] = useState(false)
    return (
        <div
            ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                backgroundColor: hov ? C.ink : bg,
                padding: "36px 28px",
                borderRadius: "10px",
                transition:
                    "background 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                transform: hov ? "translateY(-6px)" : "none",
                boxShadow: hov ? "0 24px 48px rgba(0,0,0,0.15)" : "none",
                cursor: "default",
                border: `1px solid ${C.border}`,
            }}
        >
            <p
                style={{
                    fontFamily: Z,
                    fontWeight: 700,
                    fontSize: "52px",
                    letterSpacing: "-0.04em",
                    color: hov ? "#fff" : C.ink,
                    lineHeight: 1,
                    marginBottom: "10px",
                    transition: "color 0.3s",
                }}
            >
                {val}
                {suffix}
            </p>
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "12px",
                    fontWeight: 500,
                    color: hov ? "rgba(255,255,255,0.8)" : C.ink2,
                    marginBottom: "4px",
                    transition: "color 0.3s",
                    lineHeight: 1.5,
                }}
            >
                {label}
            </p>
            {sub && (
                <p
                    style={{
                        fontFamily: INTER,
                        fontSize: "11px",
                        color: hov ? "rgba(255,255,255,0.45)" : C.muted,
                        margin: 0,
                        transition: "color 0.3s",
                    }}
                >
                    {sub}
                </p>
            )}
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
                            borderLeft: isActive ? `2px solid ${C.muted}` : "2px solid transparent",
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
    const [hovNav, setHovNav] = useState<string | null>(null)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        const onResize = () => setPhone(window.innerWidth < 768)
        onResize()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onResize, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
        }
    }, [])

    const allLinks = [
        { label: "Work", href: "/#work" },
        { label: "Playground", href: "/playground" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
        { label: "Resume", href: "#" },
    ]

    const F = "Inter, system-ui, sans-serif"
    return (
        <>
            <nav style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                width: "100%",
                height: phone ? 54 : 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `0 ${phone ? 20 : 80}px`,
                boxSizing: "border-box",
                backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : C.bg,
                backdropFilter: scrolled ? "blur(20px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.09)" : C.border}`,
                transition: "background 0.25s, border-color 0.25s",
            }}>
                <a href="/" style={{ display: "block", lineHeight: 0 }}>
                    <img
                        src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png"
                        alt="OC"
                        style={{ width: phone ? 48 : 58, height: phone ? 48 : 58, objectFit: "contain", display: "block" }}
                    />
                </a>
                {phone ? (
                    <button
                        onClick={() => setMenuOpen(true)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 8,
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                            minHeight: 44,
                            minWidth: 44,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        aria-label="Open menu"
                    >
                        <span style={{ width: 22, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block" }} />
                        <span style={{ width: 22, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block" }} />
                        <span style={{ width: 14, height: 2, backgroundColor: C.ink, borderRadius: 1, display: "block", alignSelf: "flex-end" }} />
                    </button>
                ) : (
                    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                        {allLinks.map(({ label, href, ext }) => (
                            <a key={label} href={href} target={ext ? "_blank" : "_self"} rel="noreferrer"
                                style={{ position: "relative", fontFamily: F, fontSize: 14, fontWeight: 500, color: hovNav === label ? C.ink : C.ink3, textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.25s", minHeight: 44, display: "flex", alignItems: "center" }}
                                onMouseEnter={() => setHovNav(label)}
                                onMouseLeave={() => setHovNav(null)}>
                                <span style={{ opacity: hovNav === label ? 0 : 1, transition: "opacity 0.25s ease" }}>{label}</span>
                                <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-yuji-boku), serif", fontSize: 15, fontWeight: 700, fontStyle: "italic", color: C.ink, whiteSpace: "nowrap", opacity: hovNav === label ? 1 : 0, transition: "opacity 0.25s ease", pointerEvents: "none" }}>{label}</span>
                            </a>
                        ))}
                    </div>
                )}
            </nav>

            {menuOpen && (
                <div
                    onClick={() => setMenuOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 999,
                        backgroundColor: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        display: "flex",
                        flexDirection: "column",
                        padding: "24px 20px",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
                        <img
                            src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png"
                            alt="OC"
                            style={{ width: 48, height: 48, objectFit: "contain" }}
                        />
                        <button
                            onClick={() => setMenuOpen(false)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 24,
                                color: C.ink,
                                minHeight: 44,
                                minWidth: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            ✕
                        </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {allLinks.map(({ label, href, ext }) => (
                            <a
                                key={label}
                                href={href}
                                target={ext ? "_blank" : "_self"}
                                rel="noreferrer"
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    fontFamily: F,
                                    fontSize: 28,
                                    fontWeight: 600,
                                    color: C.ink,
                                    textDecoration: "none",
                                    letterSpacing: "-0.02em",
                                    minHeight: 52,
                                    display: "flex",
                                    alignItems: "center",
                                    borderBottom: `1px solid ${C.border}`,
                                    paddingBottom: 12,
                                    paddingTop: 12,
                                }}
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

// ── MetricCard ─────────────────────────────────────────────────────────────────
function MetricCard({
    label,
    value,
    unit,
    active,
}: {
    label: string
    value: number
    unit: string
    active: boolean
}) {
    const animatedValue = useCounter(value, active)
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                padding: "28px 24px",
                backgroundColor: hov ? C.ink : C.surface,
                borderRadius: "10px",
                border: `1px solid ${C.border}`,
                transition: "background 0.3s, transform 0.25s",
                transform: hov ? "translateY(-4px)" : "none",
                cursor: "default",
            }}
        >
            <p
                style={{
                    fontFamily: Z,
                    fontSize: "44px",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: hov ? "#fff" : C.ink,
                    lineHeight: 1,
                    marginBottom: "8px",
                    transition: "color 0.25s",
                }}
            >
                {animatedValue}
                {unit}
            </p>
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "12px",
                    color: hov ? "rgba(255,255,255,0.6)" : C.ink3,
                    lineHeight: 1.55,
                    transition: "color 0.25s",
                    margin: 0,
                }}
            >
                {label}
            </p>
        </div>
    )
}

// ── Ad comparison ──────────────────────────────────────────────────────────────
function AdComparisonCard({
    type,
    stats,
    highlight,
}: {
    type: string
    stats: any
    highlight?: boolean
}) {
    return (
        <div
            style={{
                flex: 1,
                backgroundColor: highlight ? C.ink : C.surface,
                borderRadius: "12px",
                padding: "28px 24px",
                border: highlight ? "none" : `1px solid ${C.border}`,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "20px",
                }}
            >
                {highlight && (
                    <div
                        style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: "#fff",
                            opacity: 0.5,
                        }}
                    />
                )}
                <p
                    style={{
                        fontFamily: INTER,
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: highlight ? "#fff" : C.ink,
                        margin: 0,
                    }}
                >
                    {type}
                </p>
                {highlight && (
                    <span
                        style={{
                            fontFamily: INTER,
                            fontSize: "9px",
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.04em",
                        }}
                    >
                        ← Best performer
                    </span>
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                }}
            >
                {Object.entries(stats).map(([key, value]) => (
                    <div key={key}>
                        <p
                            style={{
                                fontFamily: INTER,
                                fontSize: "9px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                color: highlight
                                    ? "rgba(255,255,255,0.3)"
                                    : C.muted,
                                marginBottom: "3px",
                            }}
                        >
                            {key}
                        </p>
                        <p
                            style={{
                                fontFamily: Z,
                                fontSize: "22px",
                                fontWeight: 600,
                                color: highlight ? "#fff" : C.ink,
                                lineHeight: 1.2,
                                margin: 0,
                            }}
                        >
                            {String(value)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Insight card ───────────────────────────────────────────────────────────────
function InsightCard({
    num,
    title,
    body,
    icon,
}: {
    num: string
    title: string
    body: string
    icon: string
}) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                borderRadius: "10px",
                padding: "28px 22px",
                backgroundColor: hov ? C.ink : C.surface,
                border: hov ? "none" : `1px solid ${C.border}`,
                transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
                transform: hov ? "translateY(-6px)" : "none",
                boxShadow: hov ? "0 16px 36px rgba(0,0,0,0.13)" : "none",
                cursor: "default",
            }}
        >
            <span
                style={{
                    fontSize: "24px",
                    display: "block",
                    marginBottom: "12px",
                }}
            >
                {icon}
            </span>
            <p
                style={{
                    fontFamily: INTER,
                    fontWeight: 700,
                    fontSize: "10px",
                    color: hov ? "rgba(255,255,255,0.3)" : C.muted,
                    marginBottom: "6px",
                    letterSpacing: "0.08em",
                }}
            >
                {num}
            </p>
            <p
                style={{
                    fontFamily: Z,
                    fontSize: "15px",
                    color: hov ? "#fff" : C.ink,
                    marginBottom: "8px",
                    lineHeight: 1.4,
                }}
            >
                {title}
            </p>
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "13px",
                    lineHeight: "1.65",
                    color: hov ? "rgba(255,255,255,0.65)" : C.ink3,
                    margin: 0,
                }}
            >
                {body}
            </p>
        </div>
    )
}

// ── Recommendation accordion ───────────────────────────────────────────────────
function RecommendationRow({ num, title, body, detail, open, onClick, phone }: any) {
    return (
        <div>
            <div
                onClick={onClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: phone ? 14 : "28px",
                    padding: "28px 0",
                    cursor: "pointer",
                }}
            >
                <span
                    style={{
                        fontFamily: Z,
                        fontWeight: 400,
                        fontSize: phone ? "28px" : "44px",
                        lineHeight: "1",
                        color: open ? C.ink : "rgba(0,0,0,0.07)",
                        minWidth: phone ? "40px" : "64px",
                        userSelect: "none" as const,
                        transition: "color 0.25s",
                    }}
                >
                    {num}
                </span>
                <div style={{ flex: 1 }}>
                    <p
                        style={{
                            fontFamily: Z,
                            fontSize: "17px",
                            marginBottom: "5px",
                            color: C.ink,
                            margin: "0 0 5px",
                        }}
                    >
                        {title}
                    </p>
                    <p
                        style={{
                            fontFamily: INTER,
                            fontSize: "13px",
                            lineHeight: "1.65",
                            color: C.ink3,
                            margin: 0,
                        }}
                    >
                        {body}
                    </p>
                </div>
                <div
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: `1.5px solid rgba(0,0,0,${open ? 1 : 0.15})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition:
                            "transform 0.4s cubic-bezier(0.22,1,0.36,1), background 0.25s, border-color 0.25s",
                        transform: open ? "rotate(45deg)" : "none",
                        backgroundColor: open ? C.ink : "transparent",
                        flexShrink: 0,
                    }}
                >
                    <span
                        style={{
                            fontSize: "18px",
                            color: open ? "#fff" : C.ink,
                            lineHeight: 1,
                            marginTop: "-1px",
                        }}
                    >
                        +
                    </span>
                </div>
            </div>
            <div
                style={{
                    overflow: "hidden",
                    maxHeight: open ? "400px" : "0",
                    transition: "max-height 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <div style={{ paddingBottom: "40px", paddingLeft: phone ? "0" : "92px" }}>
                    <p
                        style={{
                            fontFamily: INTER,
                            fontSize: "13.5px",
                            lineHeight: "1.8",
                            color: C.ink3,
                            maxWidth: "680px",
                        }}
                    >
                        {detail}
                    </p>
                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: C.border,
                }}
            />
        </div>
    )
}

// ── Reflection row ─────────────────────────────────────────────────────────────
function ReflectionRow({ text }: { text: string }) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            <div
                style={{
                    display: "flex",
                    gap: "18px",
                    alignItems: "flex-start",
                    padding: "18px 0",
                    paddingLeft: hov ? "6px" : "0",
                    transition: "padding 0.22s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <span
                    style={{
                        fontFamily: Z,
                        fontSize: "15px",
                        marginTop: "1px",
                        color: hov ? C.ink : "rgba(0,0,0,0.2)",
                        transition: "color 0.18s",
                        flexShrink: 0,
                    }}
                >
                    —
                </span>
                <span
                    style={{
                        fontFamily: INTER,
                        fontSize: "14px",
                        color: hov ? C.ink : C.ink2,
                        transition: "color 0.18s",
                        lineHeight: 1.65,
                    }}
                >
                    {text}
                </span>
            </div>
            <div
                style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: C.border,
                }}
            />
        </div>
    )
}


function InstaPhoneCard({ src, label, filename }: { src?: string; label: string; filename: string }) {
    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div
                style={{
                    width: "100%",
                    maxWidth: 220,
                    backgroundColor: "#0E0E0E",
                    borderRadius: 36,
                    padding: "10px 7px 18px",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.07)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                    <div style={{ width: 52, height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2 }} />
                </div>
                <div style={{ backgroundColor: "#FAFAFA", borderRadius: 20, overflow: "hidden" }}>
                    <div
                        style={{
                            padding: "8px 10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#fff",
                            borderBottom: "1px solid rgba(0,0,0,0.05)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    background: "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#fff" }} />
                            </div>
                            <span style={{ fontFamily: INTER, fontWeight: 700, fontSize: 8, color: "#111" }}>boardandbrew</span>
                        </div>
                        <span style={{ fontFamily: INTER, fontSize: 11, color: "#111", letterSpacing: "0.08em" }}>···</span>
                    </div>
                    {src ? (
                        <img src={src} alt={label} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                aspectRatio: "1/1",
                                backgroundColor: C.surface,
                                display: "flex",
                                flexDirection: "column" as const,
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.16)" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="M21 15l-5-5L5 21" />
                            </svg>
                            <span
                                style={{
                                    fontFamily: INTER,
                                    fontSize: 7,
                                    color: "rgba(0,0,0,0.22)",
                                    textAlign: "center" as const,
                                    lineHeight: 1.4,
                                    maxWidth: 80,
                                }}
                            >
                                {filename}
                            </span>
                        </div>
                    )}
                    <div style={{ padding: "8px 10px 10px", backgroundColor: "#fff" }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "center" }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}>
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </div>
                        <p style={{ fontFamily: INTER, fontSize: 7.5, fontWeight: 700, color: "#111", margin: "0 0 2px" }}>boardandbrew</p>
                        <p style={{ fontFamily: INTER, fontSize: 7.5, color: "#555", margin: 0, lineHeight: 1.3 }}>Happy hour vibes ✨</p>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                    <div style={{ width: 40, height: 3, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 2 }} />
                </div>
            </div>
            <p
                style={{
                    fontFamily: INTER,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                    color: C.ink,
                    textAlign: "center" as const,
                    margin: 0,
                }}
            >
                {label}
            </p>
        </div>
    )
}

export default function BoardAndBrewCaseStudy() {
    const { phone, tablet, desktop } = useResponsive()
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))
    const pad = phone ? 20 : tablet ? 40 : 80

    const { ref: metricsRef, visible: metricsVisible } = useInView(0.2)
    const [activeRec, setActiveRec] = useState<number | null>(null)

    const recommendations = [
        {
            num: "01",
            title: "Prioritize Story Ads Over Feed Posts",
            body: "Story format achieved 24% higher impressions and 221% more clicks than feed posts.",
            detail: "The full-screen, immersive Story format captured attention more effectively than scrollable feed posts. Story ads delivered 5,206 impressions vs 4,182 for posts, and 193 clicks vs 60 clicks — demonstrating significantly stronger engagement per dollar spent. For future campaigns, allocate budget heavily toward Stories.",
        },
        {
            num: "02",
            title: "Build Organic Presence Before Paid Campaigns",
            body: "Establish credibility with organic content to improve ad performance and trust.",
            detail: "Before launching paid ads, we created three organic posts showcasing food, drinks, and board games. This pre-campaign content built social proof — making the account feel active and trustworthy when new users clicked on ads. Pages with existing engagement appear more credible and drive higher interaction rates.",
        },
        {
            num: "03",
            title: "Hyper-Local Targeting Drives Relevance",
            body: "1-mile radius targeting in University City and Center City maximized local foot traffic.",
            detail: "By narrowing geographic targeting to within 1 mile of campus and downtown Philadelphia, the campaign reached audiences most likely to visit in person. Interest-based layering (board games, happy hour, food & drink) further refined the audience to college students and young professionals.",
        },
        {
            num: "04",
            title: "Design Mobile-First Creatives",
            body: "Vertical, fast-loading visuals optimized for quick scrolling behavior.",
            detail: "The campaign creative was designed specifically for mobile consumption — bright colors, minimal text, playful imagery of drinks and board games. Story ads particularly benefited from this approach, as they required no rotation or zooming to view. Mobile-first design reduces friction and increases engagement.",
        },
    ]

    return (
        <div style={{ width: "100%", backgroundColor: C.bg, fontFamily: Z }}>
            <CaseStudyNav />
            <div
                style={{
                    display: desktop ? "grid" : "block",
                    gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                    gap: desktop ? 48 : undefined,
                    maxWidth: 1400,
                    margin: "0 auto",
                    padding: `0 ${pad}px 180px`,
                }}
            >
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 80, paddingTop: 40 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}
                <div>
                {/* ── HERO ── */}
                <div id="overview" style={{ scrollMarginTop: 80 }}>
                <FadeIn>
                    <div style={{ paddingTop: phone ? "48px" : "80px", paddingBottom: "64px" }}>
                        <p
                            style={{
                                fontFamily: INTER,
                                fontSize: "10px",
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: C.muted,
                                marginBottom: "20px",
                            }}
                        >
                            Marketing Campaign · MKTG 367
                        </p>
                        <h1
                            style={{
                                fontFamily: Z,
                                fontWeight: 700,
                                fontSize: "clamp(28px, 5vw, 58px)",
                                lineHeight: "1.04",
                                letterSpacing: "-0.03em",
                                marginBottom: "18px",
                                maxWidth: "820px",
                                color: C.ink,
                            }}
                        >
                            Increasing Evening Engagement at The Board & Brew
                        </h1>
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: "19px",
                                marginBottom: "48px",
                                color: C.ink3,
                                maxWidth: "640px",
                                lineHeight: 1.6,
                            }}
                        >
                            A localized Instagram campaign to drive awareness of
                            alcoholic beverages and dinner offerings through
                            strategic audience targeting and paid social
                            advertising
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: phone ? 20 : "48px",
                                paddingBottom: "40px",
                                borderBottom: `1px solid ${C.border}`,
                            }}
                        >
                            {[
                                ["Role", "Digital Marketing Strategist"],
                                ["Timeline", "3 weeks"],
                                [
                                    "Tools",
                                    "Instagram Ads Manager · Canva · Analytics",
                                ],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <p
                                        style={{
                                            fontFamily: INTER,
                                            fontWeight: 700,
                                            fontSize: "9px",
                                            color: C.muted,
                                            marginBottom: "7px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.12em",
                                        }}
                                    >
                                        {k}
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: Z,
                                            fontStyle: "italic",
                                            fontWeight: 300,
                                            fontSize: "14px",
                                            color: C.ink2,
                                            margin: 0,
                                        }}
                                    >
                                        {v}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Key Metrics */}
                        <div
                            ref={metricsRef}
                            style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "1fr 1fr" : "repeat(4, 1fr)",
                                gap: "10px",
                                marginTop: 40,
                            }}
                        >
                            <MetricCard
                                label="Total Impressions"
                                value={9388}
                                unit=""
                                active={metricsVisible}
                            />
                            <MetricCard
                                label="Combined Reach"
                                value={6144}
                                unit=""
                                active={metricsVisible}
                            />
                            <MetricCard
                                label="Total Clicks"
                                value={253}
                                unit=""
                                active={metricsVisible}
                            />
                            <MetricCard
                                label="Estimated ROI"
                                value={440}
                                unit="%"
                                active={metricsVisible}
                            />
                        </div>
                    </div>
                </FadeIn>
                <img
                    src="/slides/brew-hero.jpg"
                    alt="Board and Brew campaign"
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: 18,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                        maxWidth: "100%",
                    }}
                />
                </div>

                {/* ── 01 PROBLEM ── */}
                <div id="problem" style={{ scrollMarginTop: 80 }}>
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="01 — Problem"
                        title="Limited visibility around evening offerings"
                        sub="Customers knew the café for coffee and games — not cocktails or dinner"
                    />
                    <Body>
                        The Board & Brew had a strong in-person experience but
                        limited online visibility around evening menu items.
                        While customers associated the business with coffee and
                        board games, awareness around cocktails, happy hour
                        promotions, and dinner offerings was significantly
                        lower.
                    </Body>
                    <Body>
                        Another major challenge was the restaurant's Instagram
                        account lacked consistent activity and engagement.
                        Immediately launching paid advertisements could reduce
                        credibility and trust for new users discovering the
                        brand for the first time.
                    </Body>
                </FadeIn>
                </div>

                {/* ── 02 GOAL ── */}
                <div id="goal" style={{ scrollMarginTop: 80 }}>
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="02 — Goal"
                        title="Increase awareness and drive evening traffic"
                        sub="Focus on reach to showcase diverse menu options"
                    />
                    <Body>
                        The primary objective was to increase awareness and
                        engagement surrounding alcoholic beverages, happy hour
                        promotions, and evening menu items. The campaign focused
                        on maximizing reach, engagement, and local brand
                        awareness among audiences most likely to visit the
                        restaurant in person.
                    </Body>
                    <Body>
                        The KPI was <strong>Reach</strong> — showcasing diverse
                        menu options to new audiences who didn't yet know The
                        Board & Brew served dinner and drinks.
                    </Body>
                </FadeIn>
                </div>

                {/* ── 03 STRATEGY ── */}
                <div id="strategy" style={{ scrollMarginTop: 80 }}>
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="03 — Strategy"
                        title="Two-phase campaign: Organic revival, then paid ads"
                        sub="Build credibility before introducing paid traffic"
                    />
                    <Body>
                        Instead of immediately running ads to a low-activity
                        account, I developed a phased campaign strategy to first
                        revive the restaurant's Instagram presence organically,
                        then launch targeted paid advertisements.
                    </Body>
                    <div
                        style={{
                            backgroundColor: C.surface,
                            padding: "28px 32px",
                            borderRadius: "10px",
                            marginTop: "20px",
                            border: `1px solid ${C.border}`,
                        }}
                    >
                        {[
                            {
                                phase: "Phase 1 — Nov 2–11",
                                title: "Organic Social Revival",
                                body: "Created three engaging organic posts featuring food photography, seasonal drinks, and board game culture to increase account activity and establish visual consistency before paid promotion.",
                            },
                            {
                                phase: "Phase 2 — Nov 15–24",
                                title: "Paid Advertising Launch",
                                body: "Launched targeted Instagram Story and Feed advertisements after the page appeared more active, ensuring users clicking on ads would land on an account that felt current and trustworthy.",
                            },
                        ].map((p, i) => (
                            <div
                                key={i}
                                style={{ marginBottom: i === 0 ? 24 : 0 }}
                            >
                                <p
                                    style={{
                                        fontFamily: INTER,
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: C.muted,
                                        marginBottom: "8px",
                                    }}
                                >
                                    {p.phase}
                                </p>
                                <p
                                    style={{
                                        fontFamily: Z,
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        color: C.ink,
                                        marginBottom: "6px",
                                    }}
                                >
                                    {p.title}
                                </p>
                                <p
                                    style={{
                                        fontFamily: INTER,
                                        fontSize: "13.5px",
                                        color: C.ink3,
                                        lineHeight: 1.7,
                                        margin: 0,
                                    }}
                                >
                                    {p.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
                </div>

                {/* ── 04 TARGETING ── */}
                <div id="targeting" style={{ scrollMarginTop: 80 }}>
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="04 — Targeting"
                        title="Hyper-local, interest-based audience strategy"
                        sub="Ages 21–35 within 1 mile of campus and downtown"
                    />
                    <Body>
                        The campaign targeted locals aged 21–35 in University
                        City and Center City Philadelphia, focusing on older
                        college students and young business professionals
                        interested in board games, happy hour culture, food &
                        drink, and social nightlife experiences.
                    </Body>
                    <Body>
                        By narrowing the geographic radius to 1 mile and
                        layering interest-based targeting, the campaign
                        maximized relevance while staying within budget
                        constraints.
                    </Body>
                </FadeIn>
                </div>

                {/* ── 05 CREATIVE ── */}
                <div id="creative" style={{ scrollMarginTop: 80 }}>
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="05 — Creative"
                        title="Playful visuals combining food, drinks, and gaming culture"
                        sub="Designed to feel casual, social, and experience-driven"
                    />
                    <Body>
                        The creative direction centered around combining food,
                        drinks, and gaming culture into a playful and social
                        visual identity. The campaign intentionally avoided
                        feeling overly corporate or promotional — instead,
                        visuals were designed to feel casual, inviting, and
                        experience-driven.
                    </Body>
                    <Body>
                        The main paid ad featured a Happy Hour promotion (25%
                        off beer, wine & cocktails) with bright colors and clear
                        messaging that The Board & Brew sold alcoholic beverages
                        and had board games to play.
                    </Body>
                </FadeIn>

                {/* ── ORGANIC CONTENT ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="03 — Organic Content"
                        title="Three posts published before launching paid ads to build credibility"
                    />
                    <Body>
                        Before running paid ads, I revived The Board & Brew's
                        Instagram presence with three organic posts — establishing
                        social proof so new users discovering the account through
                        ads would trust what they saw.
                    </Body>
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: 20, marginTop: 36, alignItems: "flex-start" }}>
                        {[
                            {
                                src: "/slides/bb1.png",
                                caption: "Explore the Forbidden Jungle, where every sip is an adventure! 🌴✨ Come grab this seasonal delight and let the good times roll. Who's in for a round? #CocktailOClock",
                            },
                            {
                                src: "/slides/bb2.png",
                                caption: "Meet your new favorite lunch: our Chicken Pesto Sandwich paired with a fresh side salad! 🥪🥗 What's your go-to order when you visit Board and Brew? Let us know!",
                            },
                            {
                                src: "/slides/bb3.png",
                                caption: "Building settlements and devouring nachos—now that's our kind of multitasking! 🏗️🧀 What's your favorite board game to pair with good food? Let's hear your picks!",
                            },
                        ].map((post, i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    backgroundColor: "#fff",
                                    borderRadius: 12,
                                    border: `1px solid ${C.border}`,
                                    overflow: "hidden",
                                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                                }}
                            >
                                <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}` }}>
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            background: "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            padding: 2,
                                        }}
                                    >
                                        <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#fff" }} />
                                    </div>
                                    <div>
                                        <p style={{ fontFamily: INTER, fontWeight: 700, fontSize: 12, color: C.ink, margin: 0, lineHeight: 1.3 }}>boardandbrew</p>
                                        <p style={{ fontFamily: INTER, fontSize: 10, color: C.muted, margin: 0 }}>Philadelphia, PA</p>
                                    </div>
                                    <span style={{ marginLeft: "auto", fontFamily: INTER, fontSize: 14, color: C.ink, letterSpacing: "0.1em" }}>···</span>
                                </div>
                                <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
                                    <img
                                        src={post.src}
                                        alt={`Board and Brew post ${i + 1}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                </div>
                                <div style={{ padding: "10px 14px 14px" }}>
                                    <div style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "center" }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto" }}>
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </div>
                                    <p style={{ fontFamily: Z, fontSize: 11.5, lineHeight: 1.6, color: C.ink3, margin: 0, fontStyle: "italic" }}>
                                        <span style={{ fontFamily: INTER, fontWeight: 700, fontStyle: "normal", fontSize: 11.5, color: C.ink, marginRight: 5 }}>boardandbrew</span>
                                        {post.caption}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                        <a
                            href="https://www.instagram.com/theboardandbrewpa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                fontFamily: INTER,
                                fontSize: 13,
                                fontWeight: 600,
                                color: C.ink,
                                textDecoration: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "8px 18px",
                                borderRadius: 20,
                                border: `1px solid ${C.border}`,
                                transition: "background 0.18s, border-color 0.18s",
                                minHeight: 44,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surface; e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = C.border; }}
                        >
                            View on Instagram →
                        </a>
                    </div>
                </FadeIn>

                {/* ── THE AD ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="04 — The Ad Creative"
                        title="The hero ad — Happy Hour promotion"
                    />
                    <Body>
                        The primary paid creative featured a Happy Hour promotion
                        offering 25% off beer, wine & cocktails. It ran as both
                        an Instagram Story and Feed placement, designed to be
                        eye-catching and immediately legible while scrolling.
                    </Body>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 24,
                            marginTop: 32,
                        }}
                    >
                        <video
                            src="/slides/bb-vid.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: phone ? "100%" : "60%",
                                display: "block",
                                borderRadius: 20,
                                boxShadow: "0 8px 48px rgba(0,0,0,0.14)",
                                maxWidth: "100%",
                            }}
                        />
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: 14,
                                color: C.ink3,
                                textAlign: "center",
                                maxWidth: 520,
                                lineHeight: 1.65,
                                margin: 0,
                            }}
                        >
                            Happy Hour promotion ad — 25% off beer, wine & cocktails — designed for Instagram Story and Feed placements
                        </p>
                    </div>
                </FadeIn>
                </div>

                {/* ── 06 RESULTS ── */}
                <div id="results" style={{ scrollMarginTop: 80 }}>
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="06 — Results"
                        title="Story ads significantly outperformed feed posts"
                        sub="Higher engagement, lower cost per click, better reach efficiency"
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: phone ? "column" : "row",
                            gap: "10px",
                            marginBottom: "28px",
                        }}
                    >
                        <AdComparisonCard
                            type="Instagram Story Ad"
                            highlight
                            stats={{
                                Impressions: "5,206",
                                Reach: "3,725",
                                Clicks: "193",
                                CPM: "$9.53",
                            }}
                        />
                        <AdComparisonCard
                            type="Instagram Feed Post"
                            stats={{
                                Impressions: "4,182",
                                Reach: "2,419",
                                Clicks: "60",
                                CPM: "$11.83",
                            }}
                        />
                    </div>
                    <Body>
                        The immersive, full-screen Story format captured
                        attention more effectively than traditional feed
                        placement. Story ads delivered 24% more impressions, 54%
                        greater reach, and 221% more clicks — all at a lower
                        cost per thousand impressions.
                    </Body>
                </FadeIn>
                </div>

                {/* ── 07 KEY INSIGHTS ── */}
                <div id="insights" style={{ scrollMarginTop: 80 }}>
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="07 — Key Insights"
                        title="What the campaign revealed about mobile behavior"
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: phone ? "column" : "row",
                            gap: "10px",
                            marginBottom: "10px",
                        }}
                    >
                        <InsightCard
                            num="01"
                            title="Story Ads Drive Stronger Engagement"
                            body="The immersive vertical format captured attention more effectively and encouraged higher interaction rates compared to feed ads."
                            icon="📱"
                        />
                        <InsightCard
                            num="02"
                            title="Organic + Paid Content Work Together"
                            body="Reviving the Instagram page before launching paid ads created stronger social proof and credibility."
                            icon="🔄"
                        />
                        <InsightCard
                            num="03"
                            title="Local Targeting Increased Relevance"
                            body="Narrow geographic targeting improved engagement quality and reached users most likely to visit physically."
                            icon="📍"
                        />
                    </div>
                </FadeIn>

                {/* ── 08 ROI ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="08 — ROI Projection"
                        title="Estimated 439.8% return on investment"
                        sub="Based on conservative conversion assumptions"
                    />
                    <Body>
                        Using projected conversion estimates — 9,388 total
                        impressions, 10% click-through rate (850 website
                        visitors), and 3% in-person conversion rate — the
                        campaign was estimated to generate 25 customer visits
                        over the 1.5-week period.
                    </Body>
                    <Body>
                        With an average combined purchase value of $21.59
                        (dinner + drinks), the projected best-case ROI was{" "}
                        <strong>439.8%</strong> on a $100 total budget. Even at
                        break-even, only 10 sales were needed to recover costs.
                    </Body>
                </FadeIn>

                {/* ── 09 RECOMMENDATIONS ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="09 — Recommendations"
                        title="Four strategic takeaways for future campaigns"
                        sub="Click each to expand"
                    />
                    <div
                        style={{
                            width: "100%",
                            height: "1px",
                            backgroundColor: C.border,
                        }}
                    />
                    {recommendations.map((r, i) => (
                        <RecommendationRow
                            key={i}
                            {...r}
                            phone={phone}
                            open={activeRec === i}
                            onClick={() =>
                                setActiveRec(activeRec === i ? null : i)
                            }
                        />
                    ))}
                </FadeIn>
                </div>

                {/* ── 10 REFLECTION ── */}
                <div id="reflection" style={{ scrollMarginTop: 80 }}>
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="10 — Reflection"
                        title="Lessons in audience targeting and platform behavior"
                    />
                    <Body>
                        This project strengthened my understanding of paid
                        social strategy, audience segmentation, localized
                        marketing, and the interplay between organic and paid
                        content ecosystems.
                    </Body>
                    <div
                        style={{
                            width: "100%",
                            height: "1px",
                            backgroundColor: C.border,
                            margin: "24px 0 0",
                        }}
                    />
                    {[
                        "Platform-specific creative matters — Story ads require vertical, immersive design",
                        "Organic content builds credibility that paid ads amplify",
                        "Hyper-local targeting maximizes relevance for neighborhood businesses",
                        "Testing ad formats reveals where budget should be allocated",
                    ].map((t, i) => (
                        <ReflectionRow key={i} text={t} />
                    ))}
                    <div
                        style={{
                            marginTop: "64px",
                            display: "flex",
                            gap: "24px",
                            alignItems: "flex-start",
                            padding: phone ? "24px 20px" : "48px",
                            backgroundColor: C.ink,
                            borderRadius: "12px",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: Z,
                                fontSize: "32px",
                                lineHeight: "1",
                                color: "rgba(255,255,255,0.15)",
                                marginTop: "4px",
                                flexShrink: 0,
                            }}
                        >
                            "
                        </span>
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: phone ? "18px" : "22px",
                                lineHeight: "1.55",
                                maxWidth: "660px",
                                color: "rgba(255,255,255,0.92)",
                                margin: 0,
                            }}
                        >
                            The most effective local campaigns don't just drive
                            awareness — they make it easy for customers to say
                            yes.
                        </p>
                    </div>
                </FadeIn>
                </div>
                </div>
            </div>

            {/* ── FINAL PRESENTATION ── */}
            <FadeIn>
                <div
                    style={{
                        backgroundColor: C.ink,
                        padding: phone ? "60px 20px 80px" : "100px 80px 120px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 48,
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <p
                            style={{
                                fontFamily: INTER,
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.28)",
                                marginBottom: 16,
                            }}
                        >
                            Final Deliverable
                        </p>
                        <h2
                            style={{
                                fontFamily: Z,
                                fontSize: "clamp(28px,4vw,48px)",
                                fontWeight: 700,
                                letterSpacing: "-0.03em",
                                color: "#fff",
                                margin: 0,
                                lineHeight: 1.06,
                            }}
                        >
                            Full Campaign Presentation
                        </h2>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            maxWidth: 860,
                            borderRadius: 16,
                            overflow: "hidden",
                            boxShadow: "0 24px 72px rgba(0,0,0,0.45)",
                        }}
                    >
                        <object
                            data="/slides/boardbrew-finalppt.pdf"
                            type="application/pdf"
                            style={{ width: "100%", height: phone ? 300 : 560, display: "block", border: "none" }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: phone ? 300 : 560,
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 12,
                                }}
                            >
                                <p style={{ fontFamily: INTER, fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>PDF preview unavailable in this browser.</p>
                                <a
                                    href="/slides/boardbrew-finalppt.pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontFamily: INTER, fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}
                                >
                                    Open PDF directly →
                                </a>
                            </div>
                        </object>
                    </div>
                    <a
                        href="/slides/boardbrew-finalppt.pdf"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            fontFamily: INTER,
                            fontSize: 14,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.9)",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 28px",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.2)",
                            transition: "background 0.2s, border-color 0.2s",
                            minHeight: 44,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                    >
                        View Full Presentation →
                    </a>
                    <p
                        style={{
                            fontFamily: Z,
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: 17,
                            color: "rgba(255,255,255,0.4)",
                            textAlign: "center",
                            maxWidth: 540,
                            lineHeight: 1.65,
                            margin: 0,
                        }}
                    >
                        Complete campaign strategy, creative assets, and performance analysis
                    </p>
                </div>
            </FadeIn>

            {/* Back to work */}
            <div style={{
                borderTop: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: phone ? "48px 20px 0" : "64px 80px 0",
                marginBottom: 80,
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

        </div>
    )
}
