"use client"

import React, { useState, useRef, useEffect } from "react"
import SharedNav from "../../components/SharedNav"
import { COLORS, EASE_SPRING, FONT_SANS } from "../../components/site"

const Z = "Zodiak, 'Times New Roman', serif"
const INTER = FONT_SANS

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
    { id: "context", label: "Context" },
    { id: "trends", label: "Trends" },
    { id: "benchmarking", label: "Benchmarking" },
    { id: "ab-tests", label: "A/B Tests" },
    { id: "findings", label: "Findings" },
    { id: "insight", label: "Insight" },
    { id: "recommendations", label: "Recommendations" },
    { id: "impact", label: "Impact" },
    { id: "reflection", label: "Reflection" },
]

// ── Responsive hook ────────────────────────────────────────────────────────────
function useResponsive() {
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    const [large, setLarge] = useState(false)
    useEffect(() => {
        const check = () => {
            const w = document.documentElement.clientWidth
            setPhone(w < 768)
            setTablet(w >= 768 && w < 1024)
            setLarge(w > 1440)
        }
        check()
        window.addEventListener("resize", check, { passive: true })
        return () => window.removeEventListener("resize", check)
    }, [])
    return { phone, tablet, desktop: !phone && !tablet, large }
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
                margin: "clamp(56px, 8vw, 96px) 0 48px",
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
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.muted,
                    marginBottom: "12px",
                }}
            >
                {step}
            </p>
            <h2
                style={{
                    fontFamily: INTER,
                    fontSize: "clamp(28px, 3.4vw, 42px)",
                    fontWeight: 200,
                    letterSpacing: "-0.02em",
                    color: C.ink,
                    margin: "0 0 12px",
                    lineHeight: 1.12,
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
                        maxWidth: 760,
                        textWrap: "balance", // short line: split evenly, no one-word last line
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
                fontSize: "16px",
                lineHeight: "1.7",
                color: C.ink2,
                maxWidth: "680px",
                textWrap: "pretty",
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
    const { ref, visible } = useInView(0.1)
    const val = useCounter(num, visible)
    // Static stat card (no hover)
    return (
        <div
            ref={ref}
            style={{
                flex: 1,
                backgroundColor: bg,
                padding: "36px 28px",
                borderRadius: "10px",
                border: `1px solid ${C.border}`,
            }}
        >
            <p style={{ fontFamily: INTER, fontWeight: 200, fontSize: "clamp(36px, 4vw, 52px)", letterSpacing: "-0.04em", color: C.ink, lineHeight: 1, marginBottom: "10px" }}>
                {val}
                {suffix}
            </p>
            <p style={{ fontFamily: INTER, fontSize: "12px", fontWeight: 500, color: C.ink2, marginBottom: "4px", lineHeight: 1.5 }}>
                {label}
            </p>
            {sub && (
                <p style={{ fontFamily: INTER, fontSize: "11px", color: C.muted, margin: 0 }}>
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
    img,
}: {
    title: string
    what: string
    why: string
    icon: string
    img?: string
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
                    fontFamily: INTER,
                    fontSize: "16px",
                    fontWeight: 500,
                    color: open ? "#fff" : C.ink,
                    marginBottom: img ? "16px" : "12px",
                    lineHeight: 1.3,
                }}
            >
                {title}
            </p>
            {img && (
                <img
                    src={img}
                    alt={title}
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        marginBottom: 14,
                        maxWidth: "100%",
                    }}
                />
            )}
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
                    style={{ width: "100%", display: "block", minHeight: Math.round(width * 1.8), maxWidth: "100%" }}
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
                        fontSize: "11px",
                        fontWeight: 500,
                        color: C.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
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
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: hov ? "rgba(255,255,255,0.4)" : C.muted,
                    marginBottom: "10px",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "15px",
                    color: hov ? "#fff" : C.ink2,
                    lineHeight: 1.65,
                    margin: 0,
                    fontWeight: 400,
                }}
            >
                {desc}
            </p>
        </div>
    )
}

// ── Finding card ───────────────────────────────────────────────────────────────
// Static card (no hover or click state)
function FindingCard({ num, title, body, icon }: any) {
    const active = false
    return (
        <div
            style={{
                flex: 1,
                borderRadius: "10px",
                padding: "28px 22px",
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
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
                    fontFamily: INTER,
                    fontSize: "15px",
                    color: active ? "#fff" : C.ink,
                    marginBottom: "8px",
                    lineHeight: 1.4,
                    fontWeight: 400,
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
function RecRow({ num, title, body, detail, img, clip, open, onClick, phone }: any) {
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
                        fontFamily: INTER,
                        fontWeight: 200,
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
                            fontFamily: INTER,
                            fontSize: "17px",
                            marginBottom: "5px",
                            color: C.ink,
                            margin: "0 0 5px",
                            fontWeight: 400,
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
                    maxHeight: open ? "960px" : "0",
                    transition: "max-height 0.55s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "28px",
                        paddingBottom: "40px",
                        paddingLeft: phone ? "0" : "92px",
                    }}
                >
                    <p
                        style={{
                            fontFamily: INTER,
                            fontSize: "15px",
                            lineHeight: "1.8",
                            color: C.ink3,
                            margin: 0,
                        }}
                    >
                        {detail}
                    </p>
                    {img && (
                        <div style={{
                            overflow: "hidden",
                            lineHeight: 0,
                            height: phone ? "220px" : "460px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <img
                                src={img}
                                alt={title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "block",
                                    objectFit: clip ? "cover" : "contain",
                                    objectPosition: "center",
                                    maxWidth: "100%",
                                }}
                            />
                        </div>
                    )}
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
                        fontFamily: INTER,
                        fontSize: "15px",
                        marginTop: "1px",
                        color: hov ? C.ink : "rgba(0,0,0,0.2)",
                        transition: "color 0.18s",
                        flexShrink: 0,
                        fontWeight: 400,
                    }}
                >
                    –
                </span>
                <span
                    style={{
                        fontFamily: INTER,
                        fontSize: "15px",
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
    sephoraBeautyPrefs: "/screenshots/sephora-beauty-prefs.png",
    nikeAR:             "/screenshots/nike-ar-foot.png",
    nikeMemberRewards:  "/screenshots/nike-member-rewards.png",
    anthroHome:     "/screenshots/anthro-home.png",
    everlaneHome:   "/screenshots/everlane-home.png",
    lululemonHome:  "/screenshots/lululemon-home.png",
    madewellHome:   "/screenshots/madewell-home.png",
    anthroCheckout:    "/screenshots/anthro-checkout.png",
    everlaneCheckout:  "/screenshots/everlane-checkout.png",
    lululemonCheckout: "/screenshots/lululemon-checkout.png",
    madewellCheckout:  "/screenshots/madewell-checkout.png",
    abControl:   "/screenshots/ab-control.png",
    abNewLayout: "/screenshots/ab-new-layout.png",
    abStacked:   "/screenshots/ab-stacked.png",
    abSlider:    "/screenshots/ab-slider.png",
    anthroBasket: "/screenshots/anthro-basket.png",
    jcrewSwipe:   "/screenshots/jcrew-swipe.png",
    mangoSwipe:   "/screenshots/mango-swipe.png",
}

// ── Nav bar ────────────────────────────────────────────────────────────────────
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

export default function AnthropologieCaseStudy() {
    const { phone, tablet, desktop } = useResponsive()
    const pad = phone ? 20 : tablet ? 40 : 80
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))

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
            detail: "Drawing from our homepage redesign A/B test, which showed a positive lift in engagement when category content was less cluttered and products were surfaced faster, I recommended applying the same principle to micro-interactions in the cart. Past test data showed that reducing visual noise and simplifying user actions directly improved conversion, and the same logic applies here. By introducing swipe-to-delete in the cart, we align with a native iOS gesture users already know, reducing friction at a critical drop-off point. Bringing analytical data from previous tests to back new design decisions is how we move fast with confidence.",
            img: "/slides/rec1.gif",
            clip: true,
        },
        {
            num: "02",
            title: "Unify the Customer Journey",
            body: `Expand "Order History" into "Purchase History" to include in-store and online transactions.`,
            detail: "Triggered via Anthroperks QR scan or phone number. Sephora and H&M both surface in-store purchases in their apps. This also reduces return friction by eliminating missing receipt issues.",
            img: "/slides/rec2.png",
            clip: false,
        },
        {
            num: "03",
            title: "Recreate In-Store Guidance Digitally",
            body: "Develop a virtual stylist chatbot for real-time, personalized recommendations.",
            detail: "Levi's StyleBot and ASOS FashionBot demonstrate how guided chatbots increase product discovery. Anthropologie's current chatbot is limited to order support. Expanding to styling advice mirrors the in-store experience.",
            img: "/slides/rec3.png",
            clip: true,
        },
    ]

    return (
        <div style={{ width: "100%", backgroundColor: C.bg, fontFamily: INTER , fontWeight: 400}}>
            <SharedNav />
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
                        <div style={{ position: "sticky", top: 96, paddingTop: 48 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}
                <div>
                {/* ── HERO ── */}
                <FadeIn>
                    <div id="overview" style={{ scrollMarginTop: 96, paddingTop: phone ? "48px" : "80px", paddingBottom: 0 }}>
                        <p
                            style={{
                                fontFamily: INTER,
                                fontSize: "11px",
                                fontWeight: 500,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: C.muted,
                                marginBottom: "20px",
                            }}
                        >
                            Digital Analyst Co-op · Anthropologie
                        </p>
                        <h1
                            style={{
                                fontFamily: INTER,
                                fontWeight: 300,
                                fontSize: "clamp(28px, 5vw, 58px)",
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
                            experience, identifying conversion gaps and
                            presenting three strategic recommendations to the
                            Director of E-Commerce.
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: phone ? 20 : "48px",
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
                                            fontWeight: 500,
                                            fontSize: "11px",
                                            color: C.muted,
                                            marginBottom: "7px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.08em",
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

                    </div>
                </FadeIn>

                {/* ── 01 CONTEXT ── */}
                <div id="context" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="01 · Context"
                        title="M-commerce is the fastest growing retail channel"
                        sub="Three stats that defined the research opportunity"
                    />
                    <Body>
                        Mobile retail e-commerce in the United States has grown
                        from $220B in 2019 to a projected $856B by 2027, a near
                        4× increase. The expectations customers bring to these
                        experiences have grown just as fast.
                    </Body>
                        {/* M-Commerce data card */}
                        <div
                            style={{
                                width: "100%",
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: `1px solid ${C.border}`,
                                marginTop: 24,
                                marginBottom: 16,
                            }}
                        >
                            <div
                                style={{
                                    padding: phone ? "20px 16px 16px" : "32px 36px 24px",
                                    backgroundColor: "#FAFAF8",
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: INTER,
                                        fontSize: "11px",
                                        fontWeight: 500,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: C.muted,
                                        marginBottom: "20px",
                                    }}
                                >
                                    Mobile Retail E-Commerce Sales, United
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
                        </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: phone ? "column" : "row",
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
                <div id="trends" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="02 · Trends"
                        title="Three key features"
                        sub="Competitive analysis of major retailers like Sephora and Nike"
                    />
                    <Body>
                        Analysis of best-in-class competitors revealed three
                        mobile capabilities driving engagement and conversion.
                    </Body>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: phone ? "column" : "row",
                            gap: "10px",
                            marginBottom: "40px",
                        }}
                    >
                        <TrendCard
                            title="Zero-Party Data Personalization"
                            icon="🎯"
                            what="Information a customer intentionally and proactively shares with a brand"
                            why="Trustworthy, reliable basis for personalization. Sephora's Beauty Preferences feature is a leading example"
                        />
                        <TrendCard
                            title="Augmented Reality Try-Ons"
                            icon="📱"
                            what="AR overlays digital content in the real world through smartphones, tablets, and AR glasses"
                            why="Allows customers to engage with products and reduces return rates. Nike's foot scanner is a benchmark"
                        />
                        <TrendCard
                            title="App-Exclusive Perks"
                            icon="⭐"
                            what="Special benefits and incentives available only to app customers"
                            why="Entices app downloads and drives customer loyalty. Nike Member Rewards is a strong model"
                        />
                    </div>
                    {/* Trend image gallery */}
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: "16px", marginTop: "40px" }}>
                        {([
                            { src: "/slides/zeroparty.gif",   alt: "Zero-party data · Sephora",       caption: "Zero-Party Data · Sephora",  clip: true,  size: 1    },
                            { src: "/slides/ARtryon.png",     alt: "Augmented Reality try-on · Nike", caption: "Augmented Reality · Nike",   clip: false, size: 1    },
                            { src: "/slides/appxclusive.png", alt: "App-exclusive perks · Nike",      caption: "App-Exclusive Perks · Nike", clip: false, size: 1    },
                        ] as { src: string; alt: string; caption: string; clip: boolean; size: number }[]).map(({ src, alt, caption, clip, size }) => (
                            <div key={caption} style={{ flex: phone ? "unset" : size, display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{
                                    overflow: "hidden",
                                    lineHeight: 0,
                                    height: phone ? "200px" : "280px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    <img
                                        src={src}
                                        alt={alt}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "block",
                                            objectFit: clip ? "cover" : "contain",
                                            transform: clip ? "scale(1.02)" : "none",
                                            maxWidth: "100%",
                                        }}
                                    />
                                </div>
                                <p style={{
                                    fontFamily: INTER,
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: C.muted,
                                    margin: 0,
                                    textAlign: "center",
                                    letterSpacing: "0.02em",
                                    lineHeight: 1.4,
                                }}>
                                    {caption}
                                </p>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                {/* ── 03 BENCHMARKING ── */}
                <div id="benchmarking" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="03 · Benchmarking"
                        title="Where Anthropologie was falling behind on mobile"
                        sub="Homepage and checkout benchmarked against Everlane, Lululemon, and Madewell"
                    />
                    <Body>
                        I benchmarked Anthropologie's mobile web experience
                        across two critical journeys, homepage and checkout,
                        against three direct competitors to identify specific
                        capability gaps.
                    </Body>
                    {/* Homepage benchmarking image */}
                    <div style={{ marginTop: "16px", marginBottom: "48px" }}>
                        <p style={{
                            fontFamily: INTER,
                            fontSize: "11px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: C.muted,
                            margin: "0 0 16px",
                        }}>
                            Homepage
                        </p>
                        <img
                            src="/slides/homepage.png"
                            alt="Homepage benchmarking: Anthropologie vs Everlane, Lululemon, and Madewell"
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                                boxShadow: "0 4px 32px rgba(0,0,0,0.09)",
                                maxWidth: "100%",
                            }}
                        />
                        <p style={{
                            fontFamily: Z,
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: 13,
                            color: C.ink3,
                            textAlign: "center",
                            margin: "14px 0 0",
                            lineHeight: 1.6,
                        }}>
                            Homepage benchmarking: Anthropologie vs Everlane, Lululemon, and Madewell
                        </p>
                    </div>
                    {/* Checkout benchmarking image */}
                    <div>
                        <p style={{
                            fontFamily: INTER,
                            fontSize: "11px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: C.muted,
                            margin: "0 0 16px",
                        }}>
                            Checkout
                        </p>
                        <img
                            src="/slides/checkout.png"
                            alt="Checkout benchmarking across competitors"
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                                boxShadow: "0 4px 32px rgba(0,0,0,0.09)",
                                maxWidth: "100%",
                            }}
                        />
                        <p style={{
                            fontFamily: Z,
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: 13,
                            color: C.ink3,
                            textAlign: "center",
                            margin: "14px 0 0",
                            lineHeight: 1.6,
                        }}>
                            Checkout benchmarking: key capability gaps identified
                        </p>
                    </div>
                </FadeIn>

                {/* ── 04 A/B TESTS ── */}
                <div id="ab-tests" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="04 · Testing"
                        title="A/B tests on homepage layout and category navigation"
                        sub="Hypothesis-driven design experiments"
                    />
                    <Body>
                        To validate hypotheses, I designed and ran A/B tests on
                        the mobile homepage layout and category page navigation
                        structure.
                    </Body>
                    {/* Comparison 1: Control vs V1 */}
                    <p style={{
                        fontFamily: INTER, fontSize: "11px", fontWeight: 500,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        color: C.muted, margin: "0 0 20px",
                    }}>
                        Comparison 01 · Control vs. V1: New Layout
                    </p>
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: "10px", marginBottom: "16px" }}>
                        <ABCard label="Control"       desc="Existing layout with category pills and stacked hero banner"                bg={C.surface}  />
                        <ABCard label="V1: New Layout" desc="Full-bleed stacked images with embedded category labels, no pills"         bg={C.surface2} />
                    </div>
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: "10px", marginBottom: "56px" }}>
                        {[
                            { src: "/slides/control.png", alt: "Control variant",  lbl: "Control"        },
                            { src: "/slides/v1.png",      alt: "V1: New Layout",   lbl: "V1: New Layout" },
                        ].map(({ src, alt, lbl }) => (
                            <div key={lbl} style={{ flex: 1 }}>
                                <img src={src} alt={alt} style={{ width: "100%", height: phone ? "auto" : "250px", objectFit: "contain", objectPosition: "top", display: "block", maxWidth: "100%" }} />
                            </div>
                        ))}
                    </div>

                    {/* Comparison 2: Stack vs Slider */}
                    <p style={{
                        fontFamily: INTER, fontSize: "11px", fontWeight: 500,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        color: C.muted, margin: "0 0 20px",
                    }}>
                        Comparison 02 · Stack vs. Slider
                    </p>
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: "10px", marginBottom: "16px" }}>
                        <ABCard label="Stacked" desc="Tall editorial images stacked vertically to maximize scroll engagement"      bg={C.surface3} />
                        <ABCard label="Slider"  desc="Two-column grid of images with horizontal swipe that increases density"         bg="#D8D6CF"    />
                    </div>
                    <div style={{ display: "flex", flexDirection: phone ? "column" : "row", gap: "10px", marginBottom: "16px" }}>
                        {[
                            { src: "/slides/stack.png",  alt: "Stacked variant", lbl: "Stacked" },
                            { src: "/slides/slider.png", alt: "Slider variant",  lbl: "Slider"  },
                        ].map(({ src, alt, lbl }) => (
                            <div key={lbl} style={{ flex: 1 }}>
                                <img src={src} alt={alt} style={{ width: "100%", height: phone ? "auto" : "250px", objectFit: "contain", objectPosition: "top", display: "block", maxWidth: "100%" }} />
                            </div>
                        ))}
                    </div>
                    <Body>
                        For category pages, I tested hiding the topper image to
                        bring products above the fold faster, benchmarking
                        against Mango and Everlane, which both lead directly
                        with product grids.
                    </Body>
                </FadeIn>

                {/* ── 05 FINDINGS ── */}
                <div id="findings" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="05 · Findings"
                        title="What the data revealed about mobile drop-off"
                    />
                    <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : tablet ? "1fr 1fr" : "repeat(4, 1fr)", gap: "10px" }}>
                        {findings.map((f, i) => (
                            <FindingCard key={i} {...f} />
                        ))}
                    </div>
                </FadeIn>

                {/* ── 06 INSIGHT ── */}
                <div id="insight" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="06 · Strategic Insight"
                        title="Mobile friction is a revenue problem"
                    />
                    <div
                        style={{
                            borderLeft: `3px solid ${C.ink}`,
                            paddingLeft: phone ? "20px" : "32px",
                            marginTop: "8px",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: phone ? "18px" : "22px",
                                lineHeight: "1.55",
                                maxWidth: "680px",
                                color: C.ink2,
                                margin: 0,
                            }}
                        >
                            Mobile friction isn't just a usability issue. It's
                            a conversion problem. Every extra step, unclear
                            interaction, or missing payment option reduces
                            purchase confidence and pushes users toward
                            competitors who've solved it.
                        </p>
                    </div>
                </FadeIn>

                {/* ── 07 RECOMMENDATIONS ── */}
                <div id="recommendations" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="07 · Recommendations"
                        title="From insight to action"
                        sub="Three changes to prioritize. Click each to see the detail"
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
                            phone={phone}
                            open={activeRec === i}
                            onClick={() =>
                                setActiveRec(activeRec === i ? null : i)
                            }
                        />
                    ))}
                </FadeIn>

                {/* ── 08 IMPACT ── */}
                <div id="impact" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="08 · Impact"
                        title="Positioning mobile as a strategic growth lever"
                        sub="Presented to Anthropologie's Director of E-Commerce"
                    />
                    <Body>
                        I presented these recommendations to Anthropologie's
                        Director of E-Commerce, backed by A/B testing results,
                        competitive benchmarking data, and behavioral insights.
                        The three changes I proposed addressed both immediate
                        conversion friction and longer-term loyalty drivers.
                    </Body>
                    <Body>
                        The framing I drove throughout was that mobile
                        optimization isn't a UX nice-to-have. It's a
                        revenue decision. In a channel growing toward $856B,
                        every point of friction is measurable loss.
                    </Body>
                    <Body>
                        Recommendations were formally presented to the Director of E-Commerce and flagged for Q3 roadmap consideration.
                    </Body>
                </FadeIn>

                {/* ── 09 REFLECTION ── */}
                <div id="reflection" style={{ scrollMarginTop: 96 }} />
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="09 · Reflection"
                        title="What I learned about connecting UX to business outcomes"
                    />
                    <Body>
                        This project sharpened my ability to translate data
                        into decisions that actually move the business,
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
                        "I defined hypotheses before testing, not after, which made the A/B results defensible, not post-hoc",
                        "I tied every UX recommendation to a business metric: Apple Pay adoption, checkout drop-off, scroll depth",
                        "I learned that the most persuasive design argument isn't 'it looks better.' It's 'here's what it costs us not to fix this'",
                    ].map((t, i) => (
                        <ReflRow key={i} text={t} />
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
                            The most effective mobile experiences don't just
                            remove friction. They accelerate confidence.
                        </p>
                    </div>
                </FadeIn>

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
            </div>
        </div>
    )
}
