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
                    fontSize: "clamp(24px,3vw,32px)",
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

// ── Trend card ─────────────────────────────────────────────────────────────────
function TrendCard({
    title,
    what,
    why,
    icon,
}: {
    title: string
    what: string
    why: string
    icon: string
}) {
    const [open, setOpen] = useState(false)
    const [hov, setHov] = useState(false)
    return (
        <div
            onClick={() => setOpen(!open)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                borderRadius: "10px",
                padding: "28px 24px",
                cursor: "pointer",
                backgroundColor: open ? C.ink : hov ? C.surface2 : C.surface,
                border: `1px solid ${C.border}`,
                transition:
                    "background 0.35s cubic-bezier(0.22,1,0.36,1), transform 0.3s",
                transform: open || hov ? "translateY(-4px)" : "none",
                boxShadow: open
                    ? "0 16px 36px rgba(0,0,0,0.14)"
                    : hov
                      ? "0 6px 20px rgba(0,0,0,0.06)"
                      : "none",
            }}
        >
            <div style={{ fontSize: "28px", marginBottom: "14px" }}>{icon}</div>
            <p
                style={{
                    fontFamily: Z,
                    fontSize: "16px",
                    fontWeight: 700,
                    color: open ? "#fff" : C.ink,
                    marginBottom: "12px",
                    lineHeight: 1.3,
                }}
            >
                {title}
            </p>
            <div
                style={{
                    overflow: "hidden",
                    maxHeight: open ? "260px" : "0",
                    transition: "max-height 0.45s cubic-bezier(0.22,1,0.36,1)",
                    opacity: open ? 1 : 0,
                }}
            >
                <p
                    style={{
                        fontFamily: INTER,
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.82)",
                        lineHeight: 1.7,
                        marginBottom: "8px",
                    }}
                >
                    <strong style={{ color: "#fff" }}>What: </strong>
                    {what}
                </p>
                <p
                    style={{
                        fontFamily: INTER,
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.82)",
                        lineHeight: 1.7,
                    }}
                >
                    <strong style={{ color: "#fff" }}>Why: </strong>
                    {why}
                </p>
            </div>
            {!open && (
                <p
                    style={{
                        fontFamily: INTER,
                        fontSize: "11px",
                        color: C.muted,
                        marginTop: "10px",
                        letterSpacing: "0.02em",
                    }}
                >
                    Tap to expand ↓
                </p>
            )}
        </div>
    )
}

// ── Phone frame mockup ────────────────────────────────────────────────────────
function PhoneFrame({ src, alt, label, width = 180 }: {
    src: string
    alt: string
    label?: string
    width?: number
}) {
    const BORDER = 7
    const RADIUS = Math.round(width * 0.13)
    const NOTCH_W = Math.round(width * 0.31)
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", flexShrink: 0 }}>
            <div style={{
                width: width + BORDER * 2,
                borderRadius: RADIUS + BORDER,
                border: `${BORDER}px solid #1c1c1e`,
                overflow: "hidden",
                backgroundColor: C.surface,
                boxShadow: "0 24px 56px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)",
                position: "relative",
            }}>
                <div style={{
                    position: "absolute",
                    top: 9,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: NOTCH_W,
                    height: 15,
                    backgroundColor: "#1c1c1e",
                    borderRadius: 20,
                    zIndex: 2,
                }} />
                <img
                    src={src}
                    alt={alt}
                    style={{ width: "100%", display: "block", minHeight: Math.round(width * 1.8) }}
                />
            </div>
            {label && (
                <p style={{
                    fontFamily: INTER,
                    fontSize: "11px",
                    fontWeight: 500,
                    color: C.muted,
                    textAlign: "center",
                    margin: 0,
                    letterSpacing: "0.02em",
                    lineHeight: 1.4,
                }}>
                    {label}
                </p>
            )}
        </div>
    )
}

// ── Comp table row ─────────────────────────────────────────────────────────────
function CompRow({
    label,
    data,
}: {
    label: string
    data: { brand: string; value: string; highlight?: boolean }[]
}) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                display: "flex",
                borderBottom: `1px solid ${C.border}`,
                backgroundColor: hov ? "#FAFAF8" : "transparent",
                transition: "background 0.15s",
            }}
        >
            <div
                style={{
                    width: "130px",
                    padding: "13px 14px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    borderRight: `1px solid ${C.border}`,
                }}
            >
                <p
                    style={{
                        fontFamily: INTER,
                        fontSize: "10px",
                        fontWeight: 700,
                        color: C.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        margin: 0,
                    }}
                >
                    {label}
                </p>
            </div>
            {data.map((d, i) => (
                <div
                    key={i}
                    style={{
                        flex: 1,
                        padding: "13px 14px",
                        borderRight:
                            i < data.length - 1
                                ? `1px solid ${C.border}`
                                : "none",
                        backgroundColor: d.highlight
                            ? hov
                                ? "#EEECEA"
                                : C.surface
                            : "transparent",
                    }}
                >
                    <p
                        style={{
                            fontFamily: INTER,
                            fontSize: "12px",
                            color: d.highlight ? C.ink : C.ink3,
                            lineHeight: 1.55,
                            fontWeight: d.highlight ? 500 : 400,
                            margin: 0,
                        }}
                    >
                        {d.value}
                    </p>
                </div>
            ))}
        </div>
    )
}

// ── A/B card ───────────────────────────────────────────────────────────────────
function ABCard({
    label,
    desc,
    bg,
}: {
    label: string
    desc: string
    bg: string
}) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                padding: "24px 20px",
                borderRadius: "8px",
                cursor: "default",
                backgroundColor: hov ? C.ink : bg,
                border: `1px solid ${C.border}`,
                transition: "background 0.3s, transform 0.25s",
                transform: hov ? "translateY(-3px)" : "none",
            }}
        >
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: hov ? "rgba(255,255,255,0.4)" : C.muted,
                    marginBottom: "10px",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    fontFamily: Z,
                    fontSize: "14px",
                    color: hov ? "#fff" : C.ink2,
                    lineHeight: 1.6,
                    margin: 0,
                }}
            >
                {desc}
            </p>
        </div>
    )
}

// ── Finding card ───────────────────────────────────────────────────────────────
function FindingCard({ num, title, body, icon, active, onClick }: any) {
    return (
        <div
            onClick={onClick}
            style={{
                flex: 1,
                borderRadius: "10px",
                padding: "28px 22px",
                cursor: "pointer",
                backgroundColor: active ? C.ink : C.surface,
                border: active ? "none" : `1px solid ${C.border}`,
                transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
                transform: active ? "translateY(-6px)" : "none",
                boxShadow: active ? "0 16px 36px rgba(0,0,0,0.13)" : "none",
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
                    color: active ? "rgba(255,255,255,0.3)" : C.muted,
                    marginBottom: "8px",
                    letterSpacing: "0.08em",
                }}
            >
                {num}
            </p>
            <p
                style={{
                    fontFamily: Z,
                    fontSize: "15px",
                    color: active ? "#fff" : C.ink,
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
                    color: active ? "rgba(255,255,255,0.65)" : C.ink3,
                    margin: 0,
                }}
            >
                {body}
            </p>
        </div>
    )
}

// ── Recommendation accordion ───────────────────────────────────────────────────
function RecRow({ num, title, body, detail, img, open, onClick }: any) {
    return (
        <div>
            <div
                onClick={onClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "28px",
                    padding: "28px 0",
                    cursor: "pointer",
                }}
            >
                <span
                    style={{
                        fontFamily: Z,
                        fontWeight: 400,
                        fontSize: "44px",
                        lineHeight: "1",
                        color: open ? C.ink : "rgba(0,0,0,0.07)",
                        minWidth: "64px",
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
                    maxHeight: open ? "700px" : "0",
                    transition: "max-height 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "40px",
                        paddingBottom: "40px",
                        paddingLeft: "92px",
                        alignItems: "flex-start",
                    }}
                >
                    <p
                        style={{
                            flex: 1,
                            fontFamily: INTER,
                            fontSize: "13.5px",
                            lineHeight: "1.8",
                            color: C.ink3,
                        }}
                    >
                        {detail}
                    </p>
                    {img && <PhoneFrame src={img} alt={title} width={180} />}
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
function ReflRow({ text }: { text: string }) {
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

const IMGS = {
    // Trends — competitive examples (source from Sephora / Nike app screenshots)
    sephoraBeautyPrefs: "/screenshots/sephora-beauty-prefs.png",
    nikeAR:             "/screenshots/nike-ar-foot.png",
    nikeMemberRewards:  "/screenshots/nike-member-rewards.png",
    // Benchmarking — homepage (crop each phone from your homepage benchmark slide)
    anthroHome:     "/screenshots/anthro-home.png",
    everlaneHome:   "/screenshots/everlane-home.png",
    lululemonHome:  "/screenshots/lululemon-home.png",
    madewellHome:   "/screenshots/madewell-home.png",
    // Benchmarking — checkout (crop each phone from your checkout benchmark slide)
    anthroCheckout:    "/screenshots/anthro-checkout.png",
    everlaneCheckout:  "/screenshots/everlane-checkout.png",
    lululemonCheckout: "/screenshots/lululemon-checkout.png",
    madewellCheckout:  "/screenshots/madewell-checkout.png",
    // A/B test variants (crop each phone from your homepage redesign slide)
    abControl:   "/screenshots/ab-control.png",
    abNewLayout: "/screenshots/ab-new-layout.png",
    abStacked:   "/screenshots/ab-stacked.png",
    abSlider:    "/screenshots/ab-slider.png",
    // App gestures (crop each phone from your gestures slide)
    anthroBasket: "/screenshots/anthro-basket.png",
    jcrewSwipe:   "/screenshots/jcrew-swipe.png",
    mangoSwipe:   "/screenshots/mango-swipe.png",
}

// ── Nav bar ────────────────────────────────────────────────────────────────────
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


function StatCell({ pct, lbl, i, total }: { pct: string; lbl: string; i: number; total: number }) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                flex: 1,
                padding: "28px 24px",
                borderRight: i < total - 1 ? `1px solid ${C.border}` : "none",
                backgroundColor: hov ? C.ink : "transparent",
                transition: "background 0.3s",
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
                {pct}
            </p>
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "12px",
                    color: hov ? "rgba(255,255,255,0.65)" : C.ink3,
                    lineHeight: 1.6,
                    margin: 0,
                    transition: "color 0.25s",
                }}
            >
                {lbl}
            </p>
        </div>
    )
}

export default function AnthropologieCaseStudy() {
    const [activeFinding, setActiveFinding] = useState(0)
    const [activeRec, setActiveRec] = useState<number | null>(null)

    const findings = [
        {
            num: "01",
            title: "Speed is a Competitive Advantage",
            body: "Top-performing brands minimized steps across checkout and cart interactions.",
            icon: "⚡",
        },
        {
            num: "02",
            title: "Mobile is Interaction-Driven",
            body: "Gesture-based interactions like swipe-to-delete significantly reduced friction.",
            icon: "👆",
        },
        {
            num: "03",
            title: "Engagement Requires Incentive",
            body: "App-exclusive features created stronger retention and repeat usage.",
            icon: "🎁",
        },
        {
            num: "04",
            title: "Omnichannel is Expected",
            body: "Users expect a unified view of their relationship with a brand across all touchpoints.",
            icon: "🔗",
        },
    ]

    const recs = [
        {
            num: "01",
            title: "Reduce Friction in Micro-Interactions",
            body: "Introduce swipe-to-delete in cart to align with native mobile behavior.",
            detail: "Currently, Anthropologie's app requires pressing a 'Remove' CTA to delete cart items. J.Crew and Mango both support swipe-to-delete — a common iOS gesture used for notifications, emails, and alarms.",
            img: IMGS.anthroBasket,
        },
        {
            num: "02",
            title: "Unify the Customer Journey",
            body: `Expand "Order History" into "Purchase History" to include in-store and online transactions.`,
            detail: "Triggered via Anthroperks QR scan or phone number. Sephora and H&M both surface in-store purchases in their apps. This also reduces return friction by eliminating missing receipt issues.",
        },
        {
            num: "03",
            title: "Drive App Engagement with Exclusive Perks",
            body: "Introduce app-exclusive incentives such as early access drops and loyalty rewards.",
            detail: "Nike's member rewards in-app create strong retention loops. App-only perks entice customers to download and consistently return to the app.",
            img: IMGS.nikeMemberRewards,
        },
        {
            num: "04",
            title: "Recreate In-Store Guidance Digitally",
            body: "Develop a virtual stylist chatbot for real-time, personalized recommendations.",
            detail: "Levi's StyleBot and ASOS FashionBot demonstrate how guided chatbots increase product discovery. Anthropologie's current chatbot is limited to order support — expanding to styling advice mirrors the in-store experience.",
        },
        {
            num: "05",
            title: "Increase Purchase Confidence with AR",
            body: "Explore AR try-on features to reduce uncertainty and improve decision-making.",
            detail: "Nike's foot-scanning AR feature reduced sizing uncertainty. AR overlays digital content in real time through smartphones, allowing customers to engage with products before buying — directly reducing return rates.",
            img: IMGS.nikeAR,
        },
    ]

    return (
        <div style={{ width: "100%", backgroundColor: C.bg, fontFamily: Z }}>
            <CaseStudyNav />
            <div
                style={{
                    maxWidth: 1040,
                    margin: "0 auto",
                    padding: "0 80px 160px",
                }}
            >
                {/* ── HERO ── */}
                <FadeIn>
                    <div style={{ paddingTop: "80px", paddingBottom: "64px" }}>
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
                            Digital Analyst Co-op · Anthropologie
                        </p>
                        <h1
                            style={{
                                fontFamily: Z,
                                fontWeight: 700,
                                fontSize: "clamp(36px, 5vw, 58px)",
                                lineHeight: "1.04",
                                letterSpacing: "-0.03em",
                                marginBottom: "18px",
                                maxWidth: "820px",
                                color: C.ink,
                            }}
                        >
                            Rethinking Mobile Commerce at Anthropologie
                        </h1>
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: "19px",
                                marginBottom: "40px",
                                color: C.ink3,
                                maxWidth: "640px",
                                lineHeight: 1.6,
                            }}
                        >
                            Mobile commerce is projected to reach $856B by 2027.
                            I led a data-driven audit of Anthropologie's mobile
                            experience — identifying conversion gaps and
                            delivering five strategic recommendations to the
                            digital analytics team.
                        </p>
                        <div
                            style={{
                                display: "flex",
                                gap: "48px",
                                paddingBottom: "40px",
                                borderBottom: `1px solid ${C.border}`,
                            }}
                        >
                            {[
                                ["Role", "Digital Analyst"],
                                ["Timeline", "4 weeks"],
                                [
                                    "Tools",
                                    "Google Analytics · Excel · Competitive Benchmarking",
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

                        {/* M-Commerce data card */}
                        <div
                            style={{
                                width: "100%",
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: `1px solid ${C.border}`,
                                marginTop: 40,
                            }}
                        >
                            <div
                                style={{
                                    padding: "32px 36px 24px",
                                    borderBottom: `1px solid ${C.border}`,
                                    backgroundColor: "#FAFAF8",
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: INTER,
                                        fontSize: "10px",
                                        fontWeight: 700,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: C.muted,
                                        marginBottom: "20px",
                                    }}
                                >
                                    Mobile Retail E-Commerce Sales — United
                                    States (Billion USD)
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "9px",
                                    }}
                                >
                                    {(
                                        [
                                            [2019, 220.67],
                                            [2021, 377.73],
                                            [2023, 564.06],
                                            [2025, 744.71],
                                            ["2027*", 856.38],
                                        ] as [string | number, number][]
                                    ).map(([yr, val]) => (
                                        <div
                                            key={String(yr)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily: INTER,
                                                    fontSize: "11px",
                                                    color: C.muted,
                                                    width: "38px",
                                                    flexShrink: 0,
                                                    fontVariantNumeric:
                                                        "tabular-nums",
                                                }}
                                            >
                                                {yr}
                                            </span>
                                            <div
                                                style={{
                                                    flex: 1,
                                                    height: "24px",
                                                    backgroundColor: C.surface2,
                                                    borderRadius: "4px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        height: "100%",
                                                        width: `${(val / 856.38) * 100}%`,
                                                        backgroundColor: C.ink,
                                                        borderRadius: "4px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "flex-end",
                                                        paddingRight: "8px",
                                                    }}
                                                >
                                                    {val / 856.38 > 0.3 && (
                                                        <span
                                                            style={{
                                                                fontFamily:
                                                                    INTER,
                                                                fontSize:
                                                                    "10px",
                                                                fontWeight: 700,
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            ${val}B
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p
                                    style={{
                                        fontFamily: INTER,
                                        fontSize: "10px",
                                        color: C.muted,
                                        marginTop: "10px",
                                    }}
                                >
                                    *Projected · Source: Statista 2024
                                </p>
                            </div>
                            <div style={{ display: "flex" }}>
                                {[
                                    [
                                        "74%",
                                        "of consumers expect a seamless online-to-offline shopping experience",
                                    ],
                                    [
                                        "66%",
                                        "say poor mobile UX negatively affects brand credibility",
                                    ],
                                    [
                                        "45%",
                                        "value virtual shopping assistants for recommendations",
                                    ],
                                ].map((item, i, arr) => (
                                <StatCell key={item[0]} pct={item[0]} lbl={item[1]} i={i} total={arr.length} />
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* ── 01 CONTEXT ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="01 — Context"
                        title="M-commerce is the fastest growing retail channel"
                        sub="Three stats that defined the research opportunity"
                    />
                    <Body>
                        Mobile retail e-commerce in the United States has grown
                        from $220B in 2019 to a projected $856B by 2027 — a near
                        4× increase. The expectations customers bring to these
                        experiences have grown just as fast.
                    </Body>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "40px",
                            marginTop: "16px",
                        }}
                    >
                        <AnimStat
                            num={74}
                            suffix="%"
                            label="of consumers expect seamless online-to-offline shopping"
                            bg={C.surface}
                        />
                        <AnimStat
                            num={66}
                            suffix="%"
                            label="say poor mobile UX negatively affects brand credibility"
                            bg={C.surface2}
                        />
                        <AnimStat
                            num={45}
                            suffix="%"
                            label="value virtual shopping assistants"
                            bg={C.surface3}
                        />
                    </div>
                </FadeIn>

                {/* ── 02 TRENDS ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="02 — Trends"
                        title="Three capabilities defining next-gen mobile retail"
                        sub="From competitive analysis of Sephora, Nike, and emerging brands"
                    />
                    <Body>
                        Analysis of best-in-class competitors revealed three
                        mobile capabilities driving engagement and conversion.
                    </Body>
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "40px",
                        }}
                    >
                        <TrendCard
                            title="Zero-Party Data Personalization"
                            icon="🎯"
                            what="Information a customer intentionally and proactively shares with a brand"
                            why="Trustworthy, reliable basis for personalization — Sephora's Beauty Preferences feature is a leading example"
                        />
                        <TrendCard
                            title="Augmented Reality Try-Ons"
                            icon="📱"
                            what="AR overlays digital content in the real world through smartphones, tablets, and AR glasses"
                            why="Allows customers to engage with products and reduces return rates — Nike's foot scanner is a benchmark"
                        />
                        <TrendCard
                            title="App-Exclusive Perks"
                            icon="⭐"
                            what="Special benefits and incentives available only to app customers"
                            why="Entices app downloads and drives customer loyalty — Nike Member Rewards is a strong model"
                        />
                    </div>
                    <p style={{
                        fontFamily: INTER,
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: C.muted,
                        margin: "48px 0 32px",
                    }}>
                        Competitive Examples
                    </p>
                    <div style={{
                        display: "flex",
                        gap: "24px",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                    }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flex: 1 }}>
                            <p style={{ fontFamily: INTER, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em", color: C.ink3, margin: 0 }}>Zero-Party Data</p>
                            <PhoneFrame src={IMGS.sephoraBeautyPrefs} alt="Sephora Beauty Preferences" label="Sephora — Beauty Preferences" width={190} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flex: 1 }}>
                            <p style={{ fontFamily: INTER, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em", color: C.ink3, margin: 0 }}>AR Try-Ons</p>
                            <PhoneFrame src={IMGS.nikeAR} alt="Nike AR Foot Scanner" label="Nike — AR Foot Scanner" width={190} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flex: 1 }}>
                            <p style={{ fontFamily: INTER, fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.09em", color: C.ink3, margin: 0 }}>App-Exclusive Perks</p>
                            <PhoneFrame src={IMGS.nikeMemberRewards} alt="Nike Member Rewards" label="Nike — Member Rewards" width={190} />
                        </div>
                    </div>
                </FadeIn>

                {/* ── 03 BENCHMARKING ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="03 — Benchmarking"
                        title="Where Anthropologie was falling behind on mobile"
                        sub="Homepage and checkout benchmarked against Everlane, Lululemon, and Madewell"
                    />
                    <Body>
                        I benchmarked Anthropologie's mobile web experience
                        across two critical journeys — homepage and checkout —
                        against three direct competitors to identify specific
                        capability gaps.
                    </Body>
                    <div
                        style={{
                            borderRadius: "10px",
                            overflow: "hidden",
                            border: `1px solid ${C.border}`,
                            marginBottom: "32px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                backgroundColor: C.surface,
                                borderBottom: `1px solid ${C.border}`,
                            }}
                        >
                            <div
                                style={{
                                    width: "130px",
                                    padding: "11px 14px",
                                    flexShrink: 0,
                                    borderRight: `1px solid ${C.border}`,
                                }}
                            />
                            {[
                                "Anthropologie",
                                "Everlane",
                                "Lululemon",
                                "Madewell",
                            ].map((b, i) => (
                                <div
                                    key={b}
                                    style={{
                                        flex: 1,
                                        padding: "11px 14px",
                                        borderRight:
                                            i < 3
                                                ? `1px solid ${C.border}`
                                                : "none",
                                        backgroundColor:
                                            i === 0
                                                ? C.surface2
                                                : "transparent",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontFamily: INTER,
                                            fontSize: "10px",
                                            fontWeight: 700,
                                            color: i === 0 ? C.ink : C.muted,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.06em",
                                            margin: 0,
                                        }}
                                    >
                                        {b}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <CompRow
                            label="Homepage"
                            data={[
                                {
                                    brand: "Anthropologie",
                                    value: "App banner + category pills",
                                    highlight: true,
                                },
                                {
                                    brand: "Everlane",
                                    value: "Full-bleed hero, clean CTA",
                                },
                                {
                                    brand: "Lululemon",
                                    value: "Search bar front-and-center",
                                },
                                {
                                    brand: "Madewell",
                                    value: "Icon nav + editorial hero",
                                },
                            ]}
                        />
                        <CompRow
                            label="Checkout"
                            data={[
                                {
                                    brand: "Anthropologie",
                                    value: "Scrollable bag, Remove CTA",
                                    highlight: true,
                                },
                                {
                                    brand: "Everlane",
                                    value: "Shipping banner + Apple Pay",
                                },
                                {
                                    brand: "Lululemon",
                                    value: "Urgency nudge + 1-tap checkout",
                                },
                                {
                                    brand: "Madewell",
                                    value: "Afterpay + PayPal + Apple Pay",
                                },
                            ]}
                        />
                        <CompRow
                            label="Cart Gestures"
                            data={[
                                {
                                    brand: "Anthropologie",
                                    value: "Button-only delete",
                                    highlight: true,
                                },
                                {
                                    brand: "Everlane",
                                    value: "Standard remove CTA",
                                },
                                {
                                    brand: "Lululemon",
                                    value: "Standard remove CTA",
                                },
                                {
                                    brand: "Madewell",
                                    value: "Swipe-friendly interactions",
                                },
                            ]}
                        />
                        <CompRow
                            label="Payment"
                            data={[
                                {
                                    brand: "Anthropologie",
                                    value: "Klarna, Afterpay",
                                    highlight: true,
                                },
                                {
                                    brand: "Everlane",
                                    value: "Apple Pay + standard",
                                },
                                {
                                    brand: "Lululemon",
                                    value: "Apple Pay + standard",
                                },
                                {
                                    brand: "Madewell",
                                    value: "Afterpay + PayPal + Apple Pay",
                                },
                            ]}
                        />
                    </div>
                    {/* Homepage phone row */}
                    <div style={{ marginTop: "48px" }}>
                        <p style={{
                            fontFamily: INTER,
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: C.muted,
                            marginBottom: "32px",
                        }}>
                            Homepage
                        </p>
                        <div style={{ display: "flex", gap: "16px", justifyContent: "space-between" }}>
                            <PhoneFrame src={IMGS.anthroHome}    alt="Anthropologie homepage" label="Anthropologie" width={165} />
                            <PhoneFrame src={IMGS.everlaneHome}  alt="Everlane homepage"       label="Everlane"      width={165} />
                            <PhoneFrame src={IMGS.lululemonHome} alt="Lululemon homepage"      label="Lululemon"     width={165} />
                            <PhoneFrame src={IMGS.madewellHome}  alt="Madewell homepage"       label="Madewell"      width={165} />
                        </div>
                    </div>
                    {/* Checkout phone row */}
                    <div style={{ marginTop: "56px", marginBottom: "16px" }}>
                        <p style={{
                            fontFamily: INTER,
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: C.muted,
                            marginBottom: "32px",
                        }}>
                            Checkout
                        </p>
                        <div style={{ display: "flex", gap: "16px", justifyContent: "space-between" }}>
                            <PhoneFrame src={IMGS.anthroCheckout}    alt="Anthropologie checkout" label="Anthropologie" width={165} />
                            <PhoneFrame src={IMGS.everlaneCheckout}  alt="Everlane checkout"       label="Everlane"      width={165} />
                            <PhoneFrame src={IMGS.lululemonCheckout} alt="Lululemon checkout"      label="Lululemon"     width={165} />
                            <PhoneFrame src={IMGS.madewellCheckout}  alt="Madewell checkout"       label="Madewell"      width={165} />
                        </div>
                    </div>
                </FadeIn>

                {/* ── 04 A/B TESTS ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="04 — Testing"
                        title="A/B tests on homepage layout and category navigation"
                        sub="Hypothesis-driven design experiments"
                    />
                    <Body>
                        To validate hypotheses, I designed and ran A/B tests on
                        the mobile homepage layout and category page navigation
                        structure.
                    </Body>
                    <div
                        style={{
                            display: "flex",
                            gap: "6px",
                            marginBottom: "24px",
                        }}
                    >
                        <ABCard
                            label="Control"
                            desc="Existing layout with category pills and stacked hero banner"
                            bg={C.surface}
                        />
                        <ABCard
                            label="V1: New Layout"
                            desc="Full-bleed stacked images with embedded category labels, no pills"
                            bg={C.surface2}
                        />
                        <ABCard
                            label="Stacked"
                            desc="Tall editorial images stacked vertically — maximizes scroll engagement"
                            bg={C.surface3}
                        />
                        <ABCard
                            label="Slider"
                            desc="Two-column grid of images with horizontal swipe — increases density"
                            bg="#D8D6CF"
                        />
                    </div>
                    {/* A/B variant phone screens */}
                    <div style={{ display: "flex", gap: "16px", justifyContent: "space-between", padding: "40px 0 8px" }}>
                        <PhoneFrame src={IMGS.abControl}   alt="Control variant"     label="Control"        width={170} />
                        <PhoneFrame src={IMGS.abNewLayout} alt="V1: New Layout"       label="V1: New Layout" width={170} />
                        <PhoneFrame src={IMGS.abStacked}   alt="Stacked variant"      label="Stacked"        width={170} />
                        <PhoneFrame src={IMGS.abSlider}    alt="Slider variant"       label="Slider"         width={170} />
                    </div>
                    <Body>
                        For category pages, I tested hiding the topper image to
                        bring products above the fold faster — benchmarking
                        against Mango and Everlane, which both lead directly
                        with product grids.
                    </Body>
                    {/* Swipe gesture comparison */}
                    <p style={{
                        fontFamily: INTER,
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: C.muted,
                        margin: "32px 0 24px",
                    }}>
                        Gesture Benchmarking
                    </p>
                    <div style={{ display: "flex", gap: "40px", justifyContent: "center", marginBottom: "16px" }}>
                        <PhoneFrame src={IMGS.anthroBasket} alt="Anthropologie basket"      label="Anthropologie — basket (current)" width={190} />
                        <PhoneFrame src={IMGS.jcrewSwipe}   alt="J.Crew swipe to delete"   label="J.Crew — swipe to delete"         width={190} />
                        <PhoneFrame src={IMGS.mangoSwipe}   alt="Mango swipe to delete"    label="Mango — swipe to delete"          width={190} />
                    </div>
                </FadeIn>

                {/* ── 05 FINDINGS ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="05 — Findings"
                        title="What the data revealed about mobile drop-off"
                        sub="Click each card to highlight"
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        {findings.map((f, i) => (
                            <FindingCard
                                key={i}
                                {...f}
                                active={activeFinding === i}
                                onClick={() => setActiveFinding(i)}
                            />
                        ))}
                    </div>
                </FadeIn>

                {/* ── 06 INSIGHT ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="06 — Strategic Insight"
                        title="Mobile friction is a revenue problem"
                    />
                    <div
                        style={{
                            borderLeft: `3px solid ${C.ink}`,
                            paddingLeft: "32px",
                            marginTop: "8px",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: "22px",
                                lineHeight: "1.55",
                                maxWidth: "680px",
                                color: C.ink2,
                                margin: 0,
                            }}
                        >
                            Mobile friction isn't just a usability issue — it's
                            a conversion problem. Every extra step, unclear
                            interaction, or missing payment option reduces
                            purchase confidence and pushes users toward
                            competitors who've solved it.
                        </p>
                    </div>
                </FadeIn>

                {/* ── 07 RECOMMENDATIONS ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="07 — Recommendations"
                        title="From insight to action"
                        sub="Five changes to prioritize — click each to see the detail"
                    />
                    <div
                        style={{
                            width: "100%",
                            height: "1px",
                            backgroundColor: C.border,
                        }}
                    />
                    {recs.map((r, i) => (
                        <RecRow
                            key={i}
                            {...r}
                            open={activeRec === i}
                            onClick={() =>
                                setActiveRec(activeRec === i ? null : i)
                            }
                        />
                    ))}
                </FadeIn>

                {/* ── 08 IMPACT ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="08 — Impact"
                        title="Positioning mobile as a strategic growth lever"
                        sub="Delivered to Anthropologie's digital analytics team"
                    />
                    <Body>
                        I delivered these recommendations to Anthropologie's
                        digital analytics team, backed by A/B testing results,
                        competitive benchmarking data, and behavioral insights.
                        The five changes I proposed addressed both immediate
                        conversion friction and longer-term loyalty drivers.
                    </Body>
                    <Body>
                        The framing I drove throughout was that mobile
                        optimization isn't a UX nice-to-have — it's a
                        revenue decision. In a channel growing toward $856B,
                        every point of friction is measurable loss.
                    </Body>
                </FadeIn>

                {/* ── 09 REFLECTION ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="09 — Reflection"
                        title="What I learned about connecting UX to business outcomes"
                    />
                    <Body>
                        This project sharpened my ability to translate data
                        into decisions that actually move the business —
                        not just improve the experience. I learned to frame
                        UX work in terms of conversion, retention, and revenue
                        so that recommendations land with product and analytics
                        teams, not just designers.
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
                        "I defined hypotheses before testing — not after — which made the A/B results defensible, not post-hoc",
                        "I tied every UX recommendation to a business metric: Apple Pay adoption, checkout drop-off, scroll depth",
                        "I learned that the most persuasive design argument isn't 'it looks better' — it's 'here's what it costs us not to fix this'",
                    ].map((t, i) => (
                        <ReflRow key={i} text={t} />
                    ))}
                    <div
                        style={{
                            marginTop: "64px",
                            display: "flex",
                            gap: "24px",
                            alignItems: "flex-start",
                            padding: "48px",
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
                                fontSize: "22px",
                                lineHeight: "1.55",
                                maxWidth: "660px",
                                color: "rgba(255,255,255,0.92)",
                                margin: 0,
                            }}
                        >
                            The most effective mobile experiences don't just
                            remove friction — they accelerate confidence.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </div>
    )
}

