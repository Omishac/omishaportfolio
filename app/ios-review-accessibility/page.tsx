"use client"

import React, { useState, useEffect, useRef } from "react"


const Z = "Zodiak, 'Times New Roman', serif"
const I = "Inter, system-ui, sans-serif"

const C = {
    bg: "#FFFFFF",
    warm: "#FAF9F7",
    ink: "#111111",
    ink2: "#383834",
    ink3: "#5A5A54",
    muted: "#8A8A82",
    border: "rgba(0,0,0,0.07)",
    cream: "#FFF2D6",
    surface: "#F5F5F3",
}

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "ecosystem", label: "Ecosystem" },
    { id: "problem", label: "Problem" },
    { id: "friction", label: "Friction Points" },
    { id: "exploration", label: "Exploration" },
    { id: "why-it-matters", label: "Why It Matters" },
    { id: "solution", label: "Solution" },
    { id: "experience", label: "Experience" },
    { id: "outcome", label: "Outcome" },
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
    return {
        ref,
        style: {
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transition:
                "opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)",
        },
    }
}

function Counter({
    target,
    suffix = "",
    active,
}: {
    target: number
    suffix?: string
    active: boolean
}) {
    const [val, setVal] = useState(0)
    useEffect(() => {
        if (!active) return
        let cur = 0
        const steps = 60
        const inc = target / steps
        const t = setInterval(() => {
            cur += inc
            if (cur >= target) {
                setVal(target)
                clearInterval(t)
            } else setVal(Math.round(cur))
        }, 20)
        return () => clearInterval(t)
    }, [active, target])
    return (
        <>
            {val}
            {suffix}
        </>
    )
}

function Slot({
    src,
    label,
    height = 360,
    radius = 14,
    dark = false,
}: {
    src?: string
    label: string
    height?: number
    radius?: number
    dark?: boolean
}) {
    if (src)
        return (
            <div
                style={{
                    width: "100%",
                    height,
                    borderRadius: radius,
                    overflow: "hidden",
                }}
            >
                <img
                    src={src}
                    alt={label}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            </div>
        )
    return (
        <div
            style={{
                width: "100%",
                height,
                borderRadius: radius,
                backgroundColor: dark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.025)",
                border: `1.5px dashed ${dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.11)"}`,
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
            }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.16)"}
                strokeWidth="1.5"
            >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
            </svg>
            <p
                style={{
                    fontFamily: Z,
                    fontStyle: "italic",
                    fontSize: 12,
                    color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)",
                    textAlign: "center" as const,
                    maxWidth: 200,
                    lineHeight: 1.4,
                    margin: 0,
                }}
            >
                {label}
            </p>
        </div>
    )
}

function Divider() {
    return (
        <div
            style={{
                width: "100%",
                height: 1,
                backgroundColor: C.border,
                margin: "80px 0 48px",
            }}
        />
    )
}

function Pill({ label }: { label: string }) {
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                backgroundColor: C.surface,
                borderRadius: 20,
                padding: "5px 12px",
                marginBottom: 18,
            }}
        >
            <div
                style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: C.muted,
                }}
            />
            <span
                style={{
                    fontFamily: I,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: C.muted,
                }}
            >
                {label}
            </span>
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
                            fontFamily: I, fontSize: 10, fontWeight: isActive ? 700 : 400,
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

// ── Nav ────────────────────────────────────────────────────────────────────────
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
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
        }
    }, [])

    const allLinks = [
        { label: "Work", href: "/#work" },
        { label: "Playground", href: "/playground" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
        { label: "Resume", href: "/slides/resume.pdf", ext: true },
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
                            <a
                                key={label}
                                href={href}
                                target={ext ? "_blank" : "_self"}
                                rel="noreferrer"
                                style={{
                                    fontFamily: F,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: C.ink3,
                                    textDecoration: "none",
                                    letterSpacing: "-0.01em",
                                    transition: "color 0.18s",
                                    minHeight: 44,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = C.ink3)}
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                )}
            </nav>

            {/* Mobile full-screen overlay */}
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

// ── Lightbox ───────────────────────────────────────────────────────────────────
function Lightbox({
    src,
    title,
    caption,
    onClose,
}: {
    src: string
    title: string
    caption: string
    onClose: () => void
}) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])
    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed" as const,
                inset: 0,
                zIndex: 9999,
                backgroundColor: "rgba(0,0,0,0.82)",
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
            }}
        >
            <button
                onClick={onClose}
                style={{
                    position: "absolute" as const,
                    top: 24,
                    right: 28,
                    background: "rgba(255,255,255,0.1)",
                    border: "none",
                    borderRadius: 20,
                    cursor: "pointer",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 16,
                }}
            >
                ✕
            </button>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: "86vw",
                    maxHeight: "78vh",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
                }}
            >
                <img
                    src={src}
                    alt={title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                        maxHeight: "78vh",
                        maxWidth: "100%",
                    }}
                />
            </div>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    marginTop: 18,
                    textAlign: "center" as const,
                    maxWidth: 580,
                }}
            >
                <p
                    style={{
                        fontFamily: I,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        color: "rgba(255,255,255,0.3)",
                        marginBottom: 5,
                    }}
                >
                    {title}
                </p>
                <p
                    style={{
                        fontFamily: Z,
                        fontStyle: "italic",
                        fontWeight: 300,
                        fontSize: 14,
                        color: "rgba(255,255,255,0.65)",
                        lineHeight: 1.6,
                        margin: 0,
                    }}
                >
                    {caption}
                </p>
                <p
                    style={{
                        fontFamily: I,
                        fontSize: 10,
                        color: "rgba(255,255,255,0.22)",
                        marginTop: 12,
                    }}
                >
                    Click anywhere or press Esc to close
                </p>
            </div>
        </div>
    )
}

// ── Artifact card ──────────────────────────────────────────────────────────────
function ArtifactCard({
    src,
    index,
    title,
    caption,
}: {
    src: string
    index: string
    title: string
    caption: string
}) {
    const [hov, setHov] = useState(false)
    const [open, setOpen] = useState(false)
    return (
        <>
            {open && (
                <Lightbox
                    src={src}
                    title={title}
                    caption={caption}
                    onClose={() => setOpen(false)}
                />
            )}
            <div
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 14,
                    transform: hov ? "translateY(-5px)" : "none",
                    transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <div
                    onClick={() => setOpen(true)}
                    style={{
                        width: "100%",
                        borderRadius: 14,
                        overflow: "hidden",
                        border: `1px solid ${hov ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)"}`,
                        backgroundColor: "#FAFAF9",
                        transition: "border-color 0.25s, box-shadow 0.35s",
                        boxShadow: hov
                            ? "0 16px 44px rgba(0,0,0,0.1)"
                            : "0 1px 6px rgba(0,0,0,0.04)",
                        cursor: "zoom-in",
                        position: "relative" as const,
                    }}
                >
                    <img
                        src={src}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            maxWidth: "100%",
                            transform: hov ? "scale(1.02)" : "scale(1)",
                            transition:
                                "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
                            transformOrigin: "top center",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute" as const,
                            top: 10,
                            right: 10,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: 6,
                            padding: "4px 9px",
                            opacity: hov ? 1 : 0,
                            transition: "opacity 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            pointerEvents: "none",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: I,
                                fontSize: 10,
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.9)",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Expand
                        </span>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        paddingLeft: 2,
                    }}
                >
                    <span
                        style={{
                            fontFamily: Z,
                            fontStyle: "italic",
                            fontSize: 12,
                            color: C.muted,
                            flexShrink: 0,
                            marginTop: 1,
                        }}
                    >
                        {index}
                    </span>
                    <div>
                        <p
                            style={{
                                fontFamily: I,
                                fontSize: 12,
                                fontWeight: 700,
                                color: C.ink,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase" as const,
                                marginBottom: 3,
                            }}
                        >
                            {title}
                        </p>
                        <p
                            style={{
                                fontFamily: I,
                                fontSize: 12.5,
                                lineHeight: 1.6,
                                color: C.ink3,
                                margin: 0,
                            }}
                        >
                            {caption}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

const ARTIFACTS = {
    ticketInfo:
        "https://framerusercontent.com/images/TUGB4Qb4DIPeuvbPqcHBpCfIgs.png",
    randomThoughts:
        "https://framerusercontent.com/images/LtDvMeyo5tqgoejA1Y7ML4mAUg.png",
    workflowV1:
        "https://framerusercontent.com/images/1gWe5JZUMplfUWHJFPzEFfeDE.png",
    workflowV2:
        "https://framerusercontent.com/images/Ecu3EEV7UFobyl3ax3eyBg9ufw.png",
    translationPath:
        "https://framerusercontent.com/images/6U9FDAVqiyZVbRNQrind7YikM.png",
    messaging:
        "https://framerusercontent.com/images/perf4MeJm1az3KP5tGcLY2lR78.png",
}

// ── Friction card ──────────────────────────────────────────────────────────────
const FRICTION_THEMES = [
    {
        bg: "#F5F2EC",
        accent: "#9B8E7A",
        tag: "rgba(120,108,90,0.1)",
        tagText: "#7A6E5F",
        border: "rgba(155,142,122,0.18)",
    },
    {
        bg: "#EDF0EC",
        accent: "#6E8C6A",
        tag: "rgba(90,120,86,0.08)",
        tagText: "#4E6E4A",
        border: "rgba(110,140,106,0.18)",
    },
    {
        bg: "#ECF0F5",
        accent: "#6A7E9B",
        tag: "rgba(86,104,140,0.08)",
        tagText: "#4A5E7E",
        border: "rgba(106,126,155,0.18)",
    },
    {
        bg: "#141414",
        accent: "#FFFFFF",
        tag: "rgba(255,255,255,0.08)",
        tagText: "rgba(255,255,255,0.5)",
        border: "rgba(255,255,255,0.1)",
    },
]

function FrictionCard({
    num,
    label,
    tag,
    themeIndex = 0,
}: {
    num: string
    label: string
    tag: string
    themeIndex?: number
}) {
    const [hov, setHov] = useState(false)
    const t = FRICTION_THEMES[themeIndex]
    const dark = themeIndex === 3
    const textColor = dark ? "rgba(255,255,255,0.92)" : "#111111"
    const numColor = dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)"
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                backgroundColor: t.bg,
                borderRadius: 14,
                overflow: "hidden",
                position: "relative" as const,
                padding: "22px 22px 20px",
                display: "flex",
                flexDirection: "column" as const,
                gap: 12,
                cursor: "default",
                border: `1px solid ${t.border}`,
                transform: hov ? "translateY(-4px) scale(1.01)" : "none",
                boxShadow: hov
                    ? `0 14px 36px rgba(0,0,0,${dark ? 0.32 : 0.09})`
                    : "none",
                transition:
                    "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
            }}
        >
            <div
                style={{
                    position: "absolute" as const,
                    top: 0,
                    left: 0,
                    width: 3,
                    height: "100%",
                    backgroundColor: t.accent,
                    transformOrigin: "top",
                    transform: hov ? "scaleY(1)" : "scaleY(0.2)",
                    opacity: hov ? 0.9 : 0.25,
                    transition:
                        "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s",
                }}
            />
            <span
                style={{
                    fontFamily: Z,
                    fontStyle: "italic",
                    fontSize: 12,
                    color: numColor,
                }}
            >
                {num}
            </span>
            <p
                style={{
                    fontFamily: Z,
                    fontSize: 17,
                    lineHeight: 1.38,
                    color: textColor,
                    margin: 0,
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                }}
            >
                {label}
            </p>
            <div style={{ marginTop: 2 }}>
                <span
                    style={{
                        fontFamily: I,
                        fontSize: 11,
                        color: t.tagText,
                        backgroundColor: t.tag,
                        borderRadius: 20,
                        padding: "3px 10px",
                    }}
                >
                    {tag}
                </span>
            </div>
        </div>
    )
}

// ── Process section ────────────────────────────────────────────────────────────
function ProcessSection({ phone }: { phone: boolean }) {
    const fade = useInView()
    return (
        <div ref={fade.ref} style={fade.style}>
            <Pill label="04 — Exploration Process" />
            <h2
                style={{
                    fontFamily: Z,
                    fontWeight: 700,
                    fontSize: "clamp(24px,3vw,34px)",
                    letterSpacing: "-0.025em",
                    color: C.ink,
                    marginBottom: 10,
                    lineHeight: 1.1,
                }}
            >
                From ambiguity to architecture
            </h2>
            <p
                style={{
                    fontFamily: I,
                    fontSize: 14.5,
                    lineHeight: 1.8,
                    color: C.ink2,
                    maxWidth: 680,
                    marginBottom: 48,
                }}
            >
                Before any UI was designed, the problem was mapped — scoping the
                ticket, surfacing open questions, and charting every possible
                translation path to find the right one.
            </p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                    gap: 28,
                    marginBottom: 28,
                }}
            >
                <ArtifactCard
                    src={ARTIFACTS.ticketInfo}
                    index="01"
                    title="Ticket Brief"
                    caption="Original Jira ticket defining scope, acceptance criteria, and the questions that needed answering before design could begin."
                />
                <ArtifactCard
                    src={ARTIFACTS.randomThoughts}
                    index="02"
                    title="Early Thinking"
                    caption="Unfiltered sticky-note brainstorm — auto-translate logic, edge cases, CTA placement, and open questions about language detection."
                />
            </div>
            <div style={{ marginBottom: 28 }}>
                <ArtifactCard
                    src={ARTIFACTS.translationPath}
                    index="03"
                    title="Path Possibilities"
                    caption="Three translation paths explored — auto-translate, translate-all, and per-review — each with different performance and UX trade-offs."
                />
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                    gap: 28,
                    marginBottom: 28,
                }}
            >
                <ArtifactCard
                    src={ARTIFACTS.workflowV1}
                    index="04"
                    title="Workflow v1"
                    caption="First decision tree — mapping where review text lives in the app and whether auto-translate or user-triggered made more sense."
                />
                <ArtifactCard
                    src={ARTIFACTS.workflowV2}
                    index="05"
                    title="Workflow v2"
                    caption="Refined flow — landed on user-controlled translation with a global toggle and per-review 'show original' CTAs."
                />
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                    gap: 28,
                }}
            >
                <ArtifactCard
                    src={ARTIFACTS.messaging}
                    index="06"
                    title="Copy Exploration"
                    caption="Micro-copy decisions for auto-translate banners and individual review CTAs, mapped against BV restriction logic."
                />
                <div
                    style={{
                        backgroundColor: C.ink,
                        borderRadius: 14,
                        padding: "32px 28px",
                        display: "flex",
                        flexDirection: "column" as const,
                        justifyContent: "space-between",
                        minHeight: 180,
                    }}
                >
                    <span
                        style={{
                            fontFamily: Z,
                            fontSize: 52,
                            lineHeight: 0.85,
                            color: "rgba(255,255,255,0.07)",
                            userSelect: "none" as const,
                        }}
                    >
                        "
                    </span>
                    <div>
                        <p
                            style={{
                                fontFamily: Z,
                                fontWeight: 700,
                                fontSize: "clamp(17px, 1.8vw, 22px)",
                                lineHeight: 1.55,
                                color: "rgba(255,255,255,0.96)",
                                margin: 0,
                                letterSpacing: "-0.015em",
                            }}
                        >
                            Three translation paths were translated into low-fidelity concepts and discussed in design critiques with Senior Designers and Product partners, allowing the team to validate assumptions and refine the direction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BenefitCard({
    icon,
    title,
    body,
}: {
    icon: string
    title: string
    body: string
}) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                backgroundColor: hov ? C.ink : C.warm,
                borderRadius: 14,
                padding: "24px 22px",
                transition:
                    "background 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                transform: hov ? "translateY(-4px)" : "none",
                cursor: "default",
            }}
        >
            <div style={{ fontSize: 26, marginBottom: 14, lineHeight: 1 }}>
                {icon}
            </div>
            <p
                style={{
                    fontFamily: Z,
                    fontWeight: 700,
                    fontSize: 15,
                    color: hov ? "#fff" : C.ink,
                    marginBottom: 7,
                    lineHeight: 1.3,
                    transition: "color 0.25s",
                }}
            >
                {title}
            </p>
            <p
                style={{
                    fontFamily: I,
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: hov ? "rgba(255,255,255,0.6)" : C.ink3,
                    margin: 0,
                    transition: "color 0.25s",
                }}
            >
                {body}
            </p>
        </div>
    )
}

function StatCard({
    num,
    suffix,
    label,
    active,
}: {
    num: number
    suffix: string
    label: string
    active: boolean
}) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                backgroundColor: hov ? C.ink : C.surface,
                borderRadius: 12,
                padding: "26px 22px",
                transition:
                    "background 0.25s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                transform: hov ? "translateY(-4px)" : "none",
                cursor: "default",
            }}
        >
            <p
                style={{
                    fontFamily: Z,
                    fontWeight: 700,
                    fontSize: 44,
                    letterSpacing: "-0.04em",
                    color: hov ? "#fff" : C.ink,
                    lineHeight: 1,
                    marginBottom: 8,
                    transition: "color 0.25s",
                }}
            >
                <Counter target={num} suffix={suffix} active={active} />
            </p>
            <p
                style={{
                    fontFamily: I,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: hov ? "rgba(255,255,255,0.55)" : C.ink3,
                    margin: 0,
                    transition: "color 0.25s",
                }}
            >
                {label}
            </p>
        </div>
    )
}

function PrincipleCard({
    num,
    title,
    body,
    emoji,
}: {
    num: string
    title: string
    body: string
    emoji: string
}) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                backgroundColor: C.cream,
                borderRadius: 14,
                overflow: "hidden",
                transform: hov ? "translateY(-5px)" : "none",
                boxShadow: hov ? "0 16px 36px rgba(0,0,0,0.12)" : "none",
                transition:
                    "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease",
                cursor: "default",
            }}
        >
            <div
                style={{
                    height: 3,
                    backgroundColor: "rgba(0,0,0,0.55)",
                    transformOrigin: "left",
                    transform: hov ? "scaleX(1)" : "scaleX(0.1)",
                    opacity: hov ? 1 : 0.18,
                    transition:
                        "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s",
                }}
            />
            <div style={{ padding: "20px 22px 24px" }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{emoji}</div>
                <p
                    style={{
                        fontFamily: I,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "rgba(0,0,0,0.26)",
                        letterSpacing: "0.1em",
                        marginBottom: 5,
                        textTransform: "uppercase" as const,
                    }}
                >
                    {num}
                </p>
                <p
                    style={{
                        fontFamily: Z,
                        fontWeight: 700,
                        fontSize: 16,
                        color: C.ink,
                        marginBottom: 8,
                        lineHeight: 1.3,
                    }}
                >
                    {title}
                </p>
                <p
                    style={{
                        fontFamily: I,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: C.ink3,
                        marginBottom: 12,
                    }}
                >
                    {body}
                </p>
                <span
                    style={{
                        fontFamily: Z,
                        fontSize: 17,
                        color: C.ink,
                        opacity: hov ? 0.7 : 0.2,
                        display: "inline-block",
                        transform: hov ? "translateX(6px)" : "none",
                        transition:
                            "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s",
                    }}
                >
                    →
                </span>
            </div>
        </div>
    )
}

function SolutionCard({
    title,
    body,
    icon,
    i,
}: {
    title: string
    body: string
    icon: string
    i: number
}) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                backgroundColor: hov ? C.ink : C.surface,
                borderRadius: 14,
                padding: "22px 20px",
                transform: hov ? "translateY(-4px)" : "none",
                boxShadow: hov ? "0 18px 44px rgba(0,0,0,0.16)" : "none",
                transition:
                    "background 0.25s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s",
                cursor: "default",
            }}
        >
            <div style={{ fontSize: 20, marginBottom: 12 }}>{icon}</div>
            <p
                style={{
                    fontFamily: Z,
                    fontWeight: 700,
                    fontSize: 14.5,
                    color: hov ? "#fff" : C.ink,
                    marginBottom: 8,
                    transition: "color 0.25s",
                }}
            >
                {title}
            </p>
            <p
                style={{
                    fontFamily: I,
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: hov ? "rgba(255,255,255,0.6)" : C.ink3,
                    marginBottom: 12,
                    transition: "color 0.25s",
                }}
            >
                {body}
            </p>
            <span
                style={{
                    fontFamily: I,
                    fontSize: 10,
                    fontWeight: 700,
                    color: hov ? "rgba(255,255,255,0.35)" : C.muted,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    transition: "color 0.25s",
                }}
            >
                0{i + 1}
            </span>
        </div>
    )
}

function CascadeLabel({ text }: { text: string }) {
    return (
        <p
            style={{
                fontFamily: I,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: C.muted,
                marginBottom: 16,
            }}
        >
            {text}
        </p>
    )
}

function CascadeConnector({ text }: { text: string }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                padding: "28px 0 22px",
                gap: 8,
            }}
        >
            <div style={{ width: 1, height: 28, backgroundColor: "rgba(0,0,0,0.1)" }} />
            <svg width={12} height={8} viewBox="0 0 12 8" fill="none">
                <path
                    d="M1 1L6 7L11 1"
                    stroke="rgba(0,0,0,0.22)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <p
                style={{
                    fontFamily: Z,
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: 15,
                    color: C.ink3,
                    margin: 0,
                    textAlign: "center" as const,
                }}
            >
                {text}
            </p>
        </div>
    )
}

function PhoneCard({
    src,
    label,
    num,
    desc,
    index,
    visible,
}: {
    src: string
    label: string
    num: string
    desc: string
    index: number
    visible: boolean
}) {
    const [hov, setHov] = useState(false)
    const [open, setOpen] = useState(false)
    const spring = "cubic-bezier(0.22,1,0.36,1)"
    const delay = index * 150
    return (
        <>
            {open && (
                <Lightbox
                    src={src}
                    title={label}
                    caption={desc}
                    onClose={() => setOpen(false)}
                />
            )}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: 14,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(36px)",
                    transition: `opacity 0.6s ${spring} ${delay}ms, transform 0.7s ${spring} ${delay}ms`,
                }}
            >
                <div
                    onMouseEnter={() => setHov(true)}
                    onMouseLeave={() => setHov(false)}
                    onClick={() => setOpen(true)}
                    style={{
                        position: "relative" as const,
                        transform: hov ? "translateY(-5px)" : "none",
                        boxShadow: hov
                            ? "0 16px 44px rgba(0,0,0,0.1)"
                            : "0 1px 6px rgba(0,0,0,0.04)",
                        transition: `transform 0.35s ${spring}, box-shadow 0.35s ${spring}`,
                        cursor: "zoom-in",
                    }}
                >
                    <img
                        src={src}
                        alt={label}
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            maxWidth: "100%",
                            transform: hov ? "scale(1.02)" : "scale(1)",
                            transition: `transform 0.5s ${spring}`,
                            transformOrigin: "top center",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute" as const,
                            top: 10,
                            right: 10,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: 6,
                            padding: "4px 9px",
                            opacity: hov ? 1 : 0,
                            transition: "opacity 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            pointerEvents: "none" as const,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: I,
                                fontSize: 10,
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.9)",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Expand
                        </span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingLeft: 2 }}>
                    <span
                        style={{
                            fontFamily: Z,
                            fontStyle: "italic",
                            fontSize: 12,
                            color: C.muted,
                            flexShrink: 0,
                            marginTop: 1,
                        }}
                    >
                        {num}
                    </span>
                    <div>
                        <p
                            style={{
                                fontFamily: I,
                                fontSize: 12,
                                fontWeight: 700,
                                color: C.ink,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase" as const,
                                marginBottom: 3,
                            }}
                        >
                            {label}
                        </p>
                        <p
                            style={{
                                fontFamily: I,
                                fontSize: 12.5,
                                lineHeight: 1.6,
                                color: C.ink3,
                                margin: 0,
                            }}
                        >
                            {desc}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

function ResultCard({ num, label }: { num: string; label: string }) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                backgroundColor: hov ? C.ink : C.surface,
                borderRadius: 12,
                padding: "20px",
                transition:
                    "background 0.22s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                transform: hov ? "translateY(-3px)" : "none",
                cursor: "default",
            }}
        >
            <p
                style={{
                    fontFamily: Z,
                    fontStyle: "italic",
                    fontSize: 26,
                    color: hov ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.09)",
                    marginBottom: 6,
                    lineHeight: 1,
                    transition: "color 0.22s",
                }}
            >
                {num}
            </p>
            <p
                style={{
                    fontFamily: I,
                    fontSize: 13.5,
                    color: hov ? "rgba(255,255,255,0.88)" : C.ink,
                    lineHeight: 1.5,
                    margin: 0,
                    transition: "color 0.22s",
                }}
            >
                {label}
            </p>
        </div>
    )
}

export default function IOSCaseStudy() {
    const { phone, tablet, desktop } = useResponsive()
    const pad = phone ? 20 : tablet ? 40 : 80
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))

    const statsRef = useRef<HTMLDivElement>(null)
    const [statsVis, setStatsVis] = useState(false)
    useEffect(() => {
        const el = statsRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setStatsVis(true)
                    obs.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const phonesRef = useRef<HTMLDivElement>(null)
    const [phonesVis, setPhonesVis] = useState(false)
    useEffect(() => {
        const el = phonesRef.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setPhonesVis(true)
                    obs.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const hero = useInView()
    const eco = useInView()
    const prob = useInView()
    const friction = useInView()
    const why = useInView()
    const constraints = useInView()
    const experience = useInView()
    const outcome = useInView()
    const reflection = useInView()

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: C.bg,
                overflowX: "hidden",
            }}
        >
            <CaseStudyNav />
            <div
                style={{
                    display: desktop ? "grid" : "block",
                    gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                    gap: desktop ? 48 : undefined,
                    maxWidth: 1400,
                    margin: "0 auto",
                    padding: `0 ${pad}px 180px`,
                    overflowX: "hidden" as const,
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
                <div
                    id="overview"
                    ref={hero.ref}
                    style={{ ...hero.style, scrollMarginTop: 80, paddingTop: phone ? 48 : 88, paddingBottom: phone ? 36 : 56 }}
                >
                    <Pill label="iOS · Mobile Experience · URBN" />
                    <h1
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(28px, 5vw, 58px)",
                            lineHeight: 1.04,
                            letterSpacing: "-0.03em",
                            color: C.ink,
                            margin: "0 0 10px",
                            maxWidth: 820,
                        }}
                    >
                        Making Reviews Accessible Across Languages
                    </h1>
                    <p
                        style={{
                            fontFamily: Z,
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: "clamp(16px, 2vw, 20px)",
                            color: C.ink3,
                            lineHeight: 1.55,
                            maxWidth: 640,
                            marginBottom: 32,
                        }}
                    >
                        Non-English speakers are 3× more likely to abandon
                        a purchase when reviews aren't in their language. I
                        designed an on-demand translation feature using
                        Apple's API to close that gap across URBN's global apps.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: phone ? 20 : 48,
                            paddingTop: 28,
                            borderTop: `1px solid ${C.border}`,
                        }}
                    >
                        {[
                            ["Role", "UX Designer"],
                            ["Timeline", "Jul – Aug 2025"],
                            ["Tools", "Figma · Confluence · Jira"],
                            ["Team", "Mobile Optimization @URBN"],
                        ].map(([k, v]) => (
                            <div key={k}>
                                <p
                                    style={{
                                        fontFamily: I,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: C.muted,
                                        marginBottom: 6,
                                        textTransform: "uppercase" as const,
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    {k}
                                </p>
                                <p
                                    style={{
                                        fontFamily: Z,
                                        fontStyle: "italic",
                                        fontWeight: 300,
                                        fontSize: 14,
                                        color: C.ink2,
                                        margin: 0,
                                    }}
                                >
                                    {v}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <img
                    src="/slides/ios-hero.png"
                    alt="iOS Review Translation"
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: 18,
                        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                        maxWidth: "100%",
                    }}
                />

                {/* ── 01 ECOSYSTEM ── */}
                <Divider />
                <div id="ecosystem" ref={eco.ref} style={{ ...eco.style, scrollMarginTop: 80 }}>
                    <Pill label="01 — Business Context" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(22px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 12,
                            lineHeight: 1.1,
                        }}
                    >
                        Why URBN's global scale created a localization gap
                    </h2>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 680,
                            marginBottom: 40,
                        }}
                    >
                        URBN operates Anthropologie, Free People, and Urban
                        Outfitters across international markets — serving
                        millions of shoppers who use the apps in their native
                        language. The apps were built to be multilingual, but
                        one critical surface wasn't: product reviews.
                    </p>
                    <img
                        src="/slides/ios-ecosystem.png"
                        alt="URBN Global Ecosystem"
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            maxWidth: "100%",
                            borderRadius: 14,
                            boxShadow: "0 4px 32px rgba(0,0,0,0.09)",
                        }}
                    />
                </div>

                {/* ── 02 PROBLEM ── */}
                <Divider />
                <div id="problem" ref={prob.ref} style={{ ...prob.style, scrollMarginTop: 80 }}>
                    <Pill label="02 — The Problem" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(22px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 12,
                            lineHeight: 1.1,
                        }}
                    >
                        There was a consistency gap in the global shopping
                        experience
                    </h2>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 760,
                            marginBottom: 24,
                        }}
                    >
                        Across URBN's mobile apps, users can set their preferred
                        language — navigation, product details, and system UI
                        all adapt accordingly — <strong>EXCEPT</strong> for
                        product reviews, which remained in English only.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", margin: "40px 0 32px" }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 10,
                                backgroundColor: "#FFF2D6",
                                borderRadius: 10,
                                padding: phone ? "12px 14px" : "12px 18px",
                            }}
                        >
                            <span style={{ fontSize: 16 }}>⚠️</span>
                            <p
                                style={{
                                    fontFamily: Z,
                                    fontStyle: "italic",
                                    fontSize: phone ? 13 : 15,
                                    color: C.ink,
                                    margin: 0,
                                }}
                            >
                                English-Only Reviews + Global Audience = Accessibility Gap
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "8px 0" }}>
                        <img
                            src="/slides/ios-original.png"
                            alt="iOS original review experience showing English reviews in a Spanish-language app"
                            style={{
                                width: phone ? "100%" : "70%",
                                height: "auto",
                                display: "block",
                                maxWidth: "100%",
                            }}
                        />
                        <p style={{
                            fontFamily: Z,
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: 14,
                            color: C.ink3,
                            textAlign: "center",
                            maxWidth: 520,
                            lineHeight: 1.65,
                            margin: 0,
                        }}>
                            Urban Outfitters app showing reviews in Spanish — a non-English speaking user sees English reviews with no way to translate them
                        </p>
                    </div>
                </div>

                {/* ── 03 FRICTION POINTS ── */}
                <Divider />
                <div id="friction" ref={friction.ref} style={{ ...friction.style, scrollMarginTop: 80 }}>
                    <div style={{ marginBottom: 28 }}>
                        <Pill label="03 — Friction Points" />
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: 21,
                                color: C.ink3,
                                margin: 0,
                            }}
                        >
                            Leading to friction points like…
                        </p>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                            gap: 10,
                        }}
                    >
                        <FrictionCard
                            num="01"
                            label="The experience felt inconsistent with the rest of the app"
                            tag="UX consistency"
                            themeIndex={0}
                        />
                        <FrictionCard
                            num="02"
                            label="Users struggled to understand fit & quality from English reviews"
                            tag="Fit & quality"
                            themeIndex={1}
                        />
                        <FrictionCard
                            num="03"
                            label="Confidence during purchase decisions was reduced"
                            tag="Purchase confidence"
                            themeIndex={2}
                        />
                        <FrictionCard
                            num="04"
                            label="Reviews were inaccessible to non-English speakers"
                            tag="Language access"
                            themeIndex={3}
                        />
                    </div>
                </div>

                {/* ── 04 EXPLORATION PROCESS ── */}
                <Divider />
                <div id="exploration" style={{ scrollMarginTop: 80 }}>
                    <ProcessSection phone={phone} />
                </div>

                {/* ── 05 WHY IT MATTERS ── */}
                <Divider />
                <div id="why-it-matters" ref={why.ref} style={{ ...why.style, scrollMarginTop: 80 }}>
                    <Pill label="05 — Why It Matters" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(22px,4vw,40px)",
                            letterSpacing: "-0.03em",
                            color: C.ink,
                            lineHeight: 1.08,
                            maxWidth: 720,
                            marginBottom: 16,
                        }}
                    >
                        Reviews are decision tools —<br />
                        <span
                            style={{
                                color: C.ink3,
                                fontWeight: 300,
                                fontStyle: "italic",
                            }}
                        >
                            not just content.
                        </span>
                    </h2>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 680,
                            marginBottom: 36,
                        }}
                    >
                        In e-commerce, product reviews directly shape whether a
                        shopper buys or bounces. They answer the questions a
                        product page can't — and they only work if users can
                        actually read them.
                    </p>
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: 10, marginBottom: 36 }}>
                        <BenefitCard
                            icon="✅"
                            title="Validate quality"
                            body="Reviews confirm that a product lives up to its listing — or reveals when it doesn't."
                        />
                        <BenefitCard
                            icon="💬"
                            title="Learn from others"
                            body="Real customer experiences surface fit issues, hidden features, and honest caveats."
                        />
                        <BenefitCard
                            icon="📐"
                            title="Understand fit & sizing"
                            body="The most-read part of any review — especially critical for international shoppers."
                        />
                    </div>
                    <div
                        ref={statsRef}
                        style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: 10, marginBottom: 36 }}
                    >
                        <StatCard
                            num={74}
                            suffix="%"
                            label="of consumers expect seamless cross-language shopping"
                            active={statsVis}
                        />
                        <StatCard
                            num={66}
                            suffix="%"
                            label="say poor mobile UX negatively affects brand credibility"
                            active={statsVis}
                        />
                        <StatCard
                            num={3}
                            suffix="x"
                            label="more likely to abandon when reviews are in a foreign language"
                            active={statsVis}
                        />
                    </div>
                    <div
                        style={{
                            backgroundColor: C.ink,
                            borderRadius: 16,
                            padding: phone ? "24px 20px" : "32px 40px",
                            display: "flex",
                            gap: 22,
                            alignItems: "flex-start",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: Z,
                                fontSize: 48,
                                lineHeight: 0.8,
                                color: "rgba(255,255,255,0.1)",
                                flexShrink: 0,
                            }}
                        >
                            "
                        </span>
                        <div>
                            <p
                                style={{
                                    fontFamily: Z,
                                    fontStyle: "italic",
                                    fontWeight: 300,
                                    fontSize: phone ? 17 : 21,
                                    lineHeight: 1.55,
                                    color: "rgba(255,255,255,0.9)",
                                    margin: "0 0 14px",
                                }}
                            >
                                Without access to reviews in their language,
                                users lose one of the most valuable signals for
                                purchase confidence — increasing hesitation and
                                drop-off.
                            </p>
                            <p
                                style={{
                                    fontFamily: I,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.28)",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase" as const,
                                    margin: 0,
                                }}
                            >
                                Key insight — accessibility gap
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── 06 FROM CONSTRAINTS TO SOLUTION ── */}
                <Divider />
                <div id="solution" ref={constraints.ref} style={{ ...constraints.style, scrollMarginTop: 80 }}>
                    <Pill label="06 — From Constraints to Solution" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(22px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 12,
                            lineHeight: 1.1,
                        }}
                    >
                        Designing Within Constraints to Build the Right Solution
                    </h2>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 760,
                            marginBottom: 40,
                        }}
                    >
                        Every design decision in this project started with a
                        real technical constraint. Rather than designing around
                        them, I let them shape the strategy — from how
                        translation is triggered, to what the UI communicates.
                    </p>

                    <CascadeLabel text="Constraints" />
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: 10 }}>
                        {[
                            {
                                icon: "⚡",
                                title: "Performance Limits",
                                body: "Auto-translating large volumes at load would impact page speed significantly.",
                            },
                            {
                                icon: "🚫",
                                title: "No Bulk Translation",
                                body: "Reviews could not be translated all at once — only individual items on demand.",
                            },
                            {
                                icon: "📱",
                                title: "iOS 18+ Only",
                                body: "Apple's Translation API is exclusive to devices running iOS 18 or later.",
                            },
                        ].map((c) => (
                            <div
                                key={c.title}
                                style={{
                                    flex: 1,
                                    backgroundColor: C.surface,
                                    borderRadius: 12,
                                    padding: "20px 18px",
                                }}
                            >
                                <div style={{ fontSize: 20, marginBottom: 10 }}>
                                    {c.icon}
                                </div>
                                <p
                                    style={{
                                        fontFamily: Z,
                                        fontWeight: 700,
                                        fontSize: 14.5,
                                        color: C.ink,
                                        marginBottom: 6,
                                    }}
                                >
                                    {c.title}
                                </p>
                                <p
                                    style={{
                                        fontFamily: I,
                                        fontSize: 12.5,
                                        lineHeight: 1.6,
                                        color: C.ink3,
                                        margin: 0,
                                    }}
                                >
                                    {c.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    <CascadeConnector text="These constraints shaped three core design principles —" />

                    <CascadeLabel text="Principles" />
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: 12 }}>
                        <PrincipleCard
                            num="01"
                            title="User Control"
                            emoji="🎛️"
                            body="Allow users to choose when to translate, rather than forcing automatic language changes."
                        />
                        <PrincipleCard
                            num="02"
                            title="System Efficiency"
                            emoji="⚙️"
                            body="Leverage Apple's native translation capabilities without introducing performance overhead."
                        />
                        <PrincipleCard
                            num="03"
                            title="Seamless Integration"
                            emoji="🪡"
                            body="Ensure the feature feels like a natural extension of the existing review UI — not a bolt-on."
                        />
                    </div>

                    <CascadeConnector text="Which led to a single, focused solution —" />

                    <CascadeLabel text="Solution" />
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: 10, marginBottom: 28 }}>
                        {[
                            {
                                title: "Translate on Demand",
                                body: `Each review has a "Translate" CTA — users trigger translation when they need it, not before.`,
                                icon: "🌐",
                            },
                            {
                                title: "Toggle to Original",
                                body: "Users can instantly switch back to the original language, preserving authenticity.",
                                icon: "↩️",
                            },
                            {
                                title: "Subtle System Feedback",
                                body: "A lightweight badge communicates when a review is translated and offers a view-original option.",
                                icon: "💬",
                            },
                        ].map((c, i) => (
                            <SolutionCard key={c.title} {...c} i={i} />
                        ))}
                    </div>
                </div>

                {/* ── 07 EXPERIENCE ── */}
                <Divider />
                <div id="experience" ref={experience.ref} style={{ ...experience.style, scrollMarginTop: 80 }}>
                    <Pill label="07 — The Experience" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(22px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 8,
                            lineHeight: 1.1,
                        }}
                    >
                        See how it works in practice
                    </h2>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 680,
                            marginBottom: 40,
                        }}
                    >
                        Three states of the feature — from the untranslated review, through a single-tap translation, to the full list view with translation available on every review.
                    </p>
                    <div
                        ref={phonesRef}
                        style={{
                            display: "flex",
                            flexDirection: phone ? "column" : "row",
                            gap: 28,
                            alignItems: "flex-start",
                            margin: "0",
                        }}
                    >
                        {[
                            {
                                src: "/slides/ios-og.png",
                                label: "Original State",
                                num: "01",
                                desc: "The review appears in English only — no translation option visible to Spanish-speaking users",
                            },
                            {
                                src: "/slides/ios-translated.png",
                                label: "After Translation",
                                num: "02",
                                desc: "One tap translates the review inline — the user sees 'Ver original' to switch back",
                            },
                            {
                                src: "/slides/ios-discovery.png",
                                label: "Review List View",
                                num: "03",
                                desc: "Translation CTAs appear across all reviews giving users full control over every review on the page",
                            },
                        ].map((m, i) => (
                            <PhoneCard
                                key={m.label}
                                {...m}
                                index={i}
                                visible={phonesVis}
                            />
                        ))}
                    </div>
                </div>

                {/* ── 08 OUTCOME ── */}
                <Divider />
                <div id="outcome" ref={outcome.ref} style={{ ...outcome.style, scrollMarginTop: 80 }}>
                    <Pill label="08 — Outcome" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(22px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 12,
                            lineHeight: 1.1,
                        }}
                    >
                        Closing the accessibility gap for millions of global shoppers
                    </h2>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 720,
                            marginBottom: 28,
                        }}
                    >
                        By aligning platform capabilities with user needs, the
                        feature strengthens trust at one of the most critical
                        moments in the shopping journey.
                    </p>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: phone ? "1fr" : "1fr 1fr",
                            gap: 10,
                            marginBottom: 32,
                        }}
                    >
                        {[
                            {
                                num: "01",
                                label: "Improved accessibility for international shoppers",
                            },
                            {
                                num: "02",
                                label: "Increased clarity around product fit and quality",
                            },
                            {
                                num: "03",
                                label: "More consistent language experience across the app",
                            },
                            {
                                num: "04",
                                label: "Greater purchase confidence for non-English speakers",
                            },
                        ].map((r) => (
                            <ResultCard key={r.num} {...r} />
                        ))}
                    </div>
                    <p
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: 14,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 720,
                            marginTop: 24,
                            marginBottom: 0,
                        }}
                    >
                        This feature is currently live across iPhone 15 and up for users whose app language is set to a different language than their device language.
                    </p>
                </div>

                {/* ── 09 REFLECTION ── */}
                <Divider />
                <div id="reflection" ref={reflection.ref} style={{ ...reflection.style, scrollMarginTop: 80 }}>
                    <Pill label="09 — Reflection" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(22px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 14,
                            lineHeight: 1.1,
                        }}
                    >
                        Constraint-driven design is still good design
                    </h2>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 720,
                            marginBottom: 32,
                        }}
                    >
                        This project reinforced that the best design decisions
                        often emerge from working within limits. iOS 18-only
                        support and the no-bulk-translation constraint weren't
                        obstacles — they defined the user experience. By leaning
                        into on-demand, user-triggered translation, I delivered
                        a solution that felt native and intentional, not
                        bolted-on. The constraint became the strategy.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: 20,
                            alignItems: "flex-start",
                            padding: phone ? "24px 20px" : "48px 52px",
                            backgroundColor: C.ink,
                            borderRadius: 16,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: Z,
                                fontSize: 44,
                                lineHeight: 1,
                                color: "rgba(255,255,255,0.1)",
                                flexShrink: 0,
                                marginTop: -4,
                            }}
                        >
                            "
                        </span>
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: phone ? 18 : 24,
                                lineHeight: 1.5,
                                color: "rgba(255,255,255,0.92)",
                                margin: 0,
                            }}
                        >
                            Accessibility isn't a feature you add at the
                            end — it's a signal of how seriously a product
                            takes its global users.
                        </p>
                    </div>
                </div>

                {/* Back to work */}
                <div style={{
                    paddingTop: 64,
                    marginTop: 80,
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <a
                        href="/#work"
                        style={{
                            fontFamily: I,
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
            </div>
        </div>
    )
}
