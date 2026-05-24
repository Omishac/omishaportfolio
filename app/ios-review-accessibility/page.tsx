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

// ── Nav ────────────────────────────────────────────────────────────────────────
function CaseStudyNav() {
    const [scrolled, setScrolled] = useState(false)
    const [phone, setPhone] = useState(false)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        const onResize = () => setPhone(window.innerWidth < 540)
        onResize()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onResize, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
        }
    }, [])
    const F = "Inter, system-ui, sans-serif"
    const links = phone
        ? [
              { label: "Work", href: "/#work" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
              { label: "Resume", href: "#" },
          ]
        : [
              { label: "Work", href: "/#work" },
              { label: "Playground", href: "/playground" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
              { label: "Resume", href: "#" },
          ]
    return (
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
            <div style={{ display: "flex", gap: phone ? 16 : 32, alignItems: "center" }}>
                {links.map(({ label, href, ext }) => (
                    <a
                        key={label}
                        href={href}
                        target={ext ? "_blank" : "_self"}
                        rel="noreferrer"
                        style={{
                            fontFamily: F,
                            fontSize: phone ? 13 : 14,
                            fontWeight: 500,
                            color: C.ink3,
                            textDecoration: "none",
                            letterSpacing: "-0.01em",
                            transition: "color 0.18s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = C.ink3)}
                    >
                        {label}
                    </a>
                ))}
            </div>
        </nav>
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
                    width: 36,
                    height: 36,
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
function ProcessSection() {
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
                    gridTemplateColumns: "1fr 1fr",
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
                    gridTemplateColumns: "1fr 1fr",
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
                    gridTemplateColumns: "1fr 1fr",
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

function Phone({
    state,
    bg,
    image,
}: {
    state: "original" | "translated" | "discovery"
    bg: string
    image?: string
}) {
    const [hov, setHov] = useState(false)
    const shimmer =
        bg === "rgb(232,231,228)"
            ? "#D4D3D0"
            : bg === "rgb(218,217,212)"
              ? "#C4C3BE"
              : "#B2B1AC"
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: "100%",
                minHeight: 440,
                backgroundColor: bg,
                borderRadius: 22,
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                padding: "24px 18px",
                transform: hov ? "translateY(-6px)" : "none",
                boxShadow: hov
                    ? "0 22px 52px rgba(0,0,0,0.16)"
                    : "0 4px 14px rgba(0,0,0,0.07)",
                transition:
                    "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
                cursor: "default",
            }}
        >
            <div
                style={{
                    width: 165,
                    height: 310,
                    backgroundColor: "white",
                    borderRadius: 26,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column" as const,
                    boxShadow:
                        "0 6px 20px rgba(0,0,0,0.12), inset 0 0 0 1.5px rgba(0,0,0,0.09)",
                }}
            >
                <div
                    style={{
                        height: 24,
                        backgroundColor: shimmer,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 10px",
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 4,
                            backgroundColor: "rgba(0,0,0,0.14)",
                            borderRadius: 2,
                        }}
                    />
                    <div
                        style={{
                            width: 14,
                            height: 4,
                            backgroundColor: "rgba(0,0,0,0.09)",
                            borderRadius: 2,
                        }}
                    />
                </div>
                {image ? (
                    <img
                        src={image}
                        alt={state}
                        style={{
                            flex: 1,
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            flex: 1,
                            padding: "9px 9px 7px",
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: 6,
                        }}
                    >
                        {state === "translated" && (
                            <div
                                style={{
                                    width: 84,
                                    height: 17,
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: I,
                                        fontSize: 8,
                                        color: "rgba(0,0,0,0.38)",
                                    }}
                                >
                                    Translated
                                </span>
                            </div>
                        )}
                        <div
                            style={{
                                width: "85%",
                                height: 6,
                                backgroundColor: shimmer,
                                borderRadius: 3,
                            }}
                        />
                        <div
                            style={{
                                width: "65%",
                                height: 6,
                                backgroundColor: shimmer,
                                borderRadius: 3,
                            }}
                        />
                        <div
                            style={{
                                width: "90%",
                                height: 6,
                                backgroundColor: shimmer,
                                borderRadius: 3,
                            }}
                        />
                        <div
                            style={{
                                width: "100%",
                                height: 1,
                                backgroundColor: "rgba(0,0,0,0.04)",
                                margin: "3px 0",
                            }}
                        />
                        <div
                            style={{
                                width: "72%",
                                height: 6,
                                backgroundColor: shimmer,
                                borderRadius: 3,
                            }}
                        />
                        <div
                            style={{
                                width: "55%",
                                height: 6,
                                backgroundColor: shimmer,
                                borderRadius: 3,
                            }}
                        />
                        {state === "original" && (
                            <div
                                style={{
                                    width: 82,
                                    height: 22,
                                    backgroundColor: C.ink,
                                    borderRadius: 11,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 3,
                                    flexShrink: 0,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: I,
                                        fontSize: 9,
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,0.8)",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    Translate
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p
                style={{
                    fontFamily: Z,
                    fontStyle: "italic",
                    fontSize: 11,
                    color: "rgba(0,0,0,0.35)",
                    textAlign: "center" as const,
                }}
            >
                {state === "original"
                    ? "Before — English only"
                    : state === "translated"
                      ? "After — Translated on tap"
                      : "Discovery — inline CTAs"}
            </p>
        </div>
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
    const phoneOriginalImage = undefined
    const phoneTranslatedImage = undefined
    const phoneDiscoveryImage = undefined
    const finalImage = undefined
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
            { threshold: 0.2 }
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
    const design = useInView()
    const solution = useInView()
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
                    maxWidth: 1040,
                    margin: "0 auto",
                    padding: "0 80px 160px",
                }}
            >
                {/* ── HERO ── */}
                <div
                    ref={hero.ref}
                    style={{ ...hero.style, paddingTop: 88, paddingBottom: 56 }}
                >
                    <Pill label="iOS · Mobile Experience · URBN" />
                    <h1
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(36px, 5vw, 58px)",
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
                            marginBottom: 44,
                        }}
                    >
                        Designing an on-demand translation experience using
                        Apple's Translation API
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: 48,
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
                    }}
                />

                {/* ── 01 ECOSYSTEM ── */}
                <Divider />
                <div ref={eco.ref} style={eco.style}>
                    <Pill label="01 — The Ecosystem" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(24px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 12,
                            lineHeight: 1.1,
                        }}
                    >
                        Designing for a Global Retail Ecosystem
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
                        URBN is a global lifestyle retail company operating
                        Anthropologie, Free People, and Urban Outfitters —
                        serving diverse international markets where mobile users
                        interact with the apps in multiple languages.
                    </p>
                    <img
                        src="/slides/ios-ecosystem.png"
                        alt="URBN Global Ecosystem"
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            borderRadius: 14,
                            boxShadow: "0 4px 32px rgba(0,0,0,0.09)",
                        }}
                    />
                </div>

                {/* ── 02 PROBLEM ── */}
                <Divider />
                <div ref={prob.ref} style={prob.style}>
                    <Pill label="02 — The Problem" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(24px,3vw,34px)",
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
                                padding: "12px 18px",
                            }}
                        >
                            <span style={{ fontSize: 16 }}>⚠️</span>
                            <p
                                style={{
                                    fontFamily: Z,
                                    fontStyle: "italic",
                                    fontSize: 15,
                                    color: C.ink,
                                    margin: 0,
                                }}
                            >
                                English-Only Reviews + Global Audience = Accessibility Gap
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src="/slides/ios-original.png"
                            alt="iOS original review experience"
                            style={{
                                width: "60%",
                                height: "auto",
                                display: "block",
                                borderRadius: 14,
                                boxShadow: "0 4px 32px rgba(0,0,0,0.09)",
                            }}
                        />
                    </div>
                </div>

                {/* ── 03 FRICTION POINTS ── */}
                <Divider />
                <div ref={friction.ref} style={friction.style}>
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
                            gridTemplateColumns: "1fr 1fr",
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
                <ProcessSection />

                {/* ── 05 WHY IT MATTERS ── */}
                <Divider />
                <div ref={why.ref} style={why.style}>
                    <Pill label="05 — Why It Matters" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(28px,4vw,40px)",
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
                    <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
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
                        style={{ display: "flex", gap: 10, marginBottom: 36 }}
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
                            padding: "32px 40px",
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
                                    fontSize: 21,
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

                {/* ── 06 CONSTRAINTS ── */}
                <Divider />
                <div ref={constraints.ref} style={constraints.style}>
                    <Pill label="06 — Constraints" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(24px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 12,
                            lineHeight: 1.1,
                        }}
                    >
                        Designing within platform & performance limits
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
                        Integrating Apple's Translation API came with real
                        constraints that shaped every design decision:
                    </p>
                    <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
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
                </div>

                {/* ── 07 DESIGN APPROACH ── */}
                <Divider />
                <div ref={design.ref} style={design.style}>
                    <Pill label="07 — Design Approach" />
                    <p
                        style={{
                            fontFamily: Z,
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: 24,
                            color: C.ink3,
                            marginBottom: 8,
                            lineHeight: 1.4,
                        }}
                    >
                        "Translate what matters, when it matters"
                    </p>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 680,
                            marginBottom: 28,
                        }}
                    >
                        The experience was guided by three core principles:
                    </p>
                    <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
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
                </div>

                {/* ── 08 SOLUTION ── */}
                <Divider />
                <div ref={solution.ref} style={solution.style}>
                    <Pill label="08 — The Solution" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(24px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 12,
                            lineHeight: 1.1,
                        }}
                    >
                        On-Demand Review Translation via Apple's API
                    </h2>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 14.5,
                            lineHeight: 1.8,
                            color: C.ink2,
                            maxWidth: 720,
                            marginBottom: 24,
                        }}
                    >
                        An on-demand translation system embedded directly within
                        product reviews — keeping the experience lightweight,
                        intentional, and user-driven.
                    </p>
                    <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
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

                {/* ── 09 EXPERIENCE ── */}
                <Divider />
                <div ref={experience.ref} style={experience.style}>
                    <Pill label="09 — The Experience" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(24px,3vw,34px)",
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
                            marginBottom: 32,
                        }}
                    >
                        Hover over the phones to explore each state of the
                        feature.
                    </p>
                    <div style={{ display: "flex", gap: 18 }}>
                        {[
                            {
                                state: "original" as const,
                                bg: "rgb(232,231,228)",
                                img: phoneOriginalImage,
                                title: "Original Review",
                                desc: "The review appears in its original language — exactly as submitted.",
                                num: "01",
                            },
                            {
                                state: "translated" as const,
                                bg: "rgb(218,217,212)",
                                img: phoneTranslatedImage,
                                title: "Translated on Tap",
                                desc: "One tap translates the review inline using Apple's API — no page reload.",
                                num: "02",
                            },
                            {
                                state: "discovery" as const,
                                bg: "rgb(200,199,194)",
                                img: phoneDiscoveryImage,
                                title: "Discovery at Scale",
                                desc: "Translate CTAs appear across all reviews — the feature scales naturally.",
                                num: "03",
                            },
                        ].map((m) => (
                            <div
                                key={m.title}
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    gap: 14,
                                }}
                            >
                                <Phone
                                    state={m.state}
                                    bg={m.bg}
                                    image={m.img}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 10,
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: Z,
                                            fontStyle: "italic",
                                            fontSize: 12,
                                            color: C.muted,
                                            flexShrink: 0,
                                            marginTop: 2,
                                        }}
                                    >
                                        {m.num}
                                    </span>
                                    <div>
                                        <p
                                            style={{
                                                fontFamily: Z,
                                                fontWeight: 700,
                                                fontSize: 15,
                                                color: C.ink,
                                                marginBottom: 4,
                                            }}
                                        >
                                            {m.title}
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
                                            {m.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── 10 OUTCOME ── */}
                <Divider />
                <div ref={outcome.ref} style={outcome.style}>
                    <Pill label="10 — Outcome" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(24px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 12,
                            lineHeight: 1.1,
                        }}
                    >
                        A more inclusive, consistent global experience
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
                            gridTemplateColumns: "1fr 1fr",
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
                    <div
                        style={{
                            backgroundColor: C.ink,
                            borderRadius: 18,
                            padding: "28px 36px",
                        }}
                    >
                        <Slot
                            src={finalImage}
                            label="Add your final deliverable — before/after comparison, prototype screenshot, or hero handoff visual"
                            height={400}
                            radius={12}
                            dark
                        />
                    </div>
                </div>

                {/* ── 11 REFLECTION ── */}
                <Divider />
                <div ref={reflection.ref} style={reflection.style}>
                    <Pill label="11 — Reflection" />
                    <h2
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(24px,3vw,34px)",
                            letterSpacing: "-0.025em",
                            color: C.ink,
                            marginBottom: 14,
                            lineHeight: 1.1,
                        }}
                    >
                        Designing within constraints to remove friction
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
                        This project reinforced that good UX lives in the
                        constraints — not despite them.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: 20,
                            alignItems: "flex-start",
                            padding: "48px 52px",
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
                                fontSize: 24,
                                lineHeight: 1.5,
                                color: "rgba(255,255,255,0.92)",
                                margin: 0,
                            }}
                        >
                            Good UX isn't just about adding features — it's
                            about removing friction at exactly the right moment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
