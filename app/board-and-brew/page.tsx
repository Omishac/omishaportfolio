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
function RecommendationRow({ num, title, body, detail, open, onClick }: any) {
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
                    maxHeight: open ? "400px" : "0",
                    transition: "max-height 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <div style={{ paddingBottom: "40px", paddingLeft: "92px" }}>
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


export default function BoardAndBrewCaseStudy() {
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
                            Marketing Campaign · MKTG 367
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
                                gap: "48px",
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
                                display: "flex",
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

                {/* ── 01 PROBLEM ── */}
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

                {/* ── 02 GOAL ── */}
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

                {/* ── 03 STRATEGY ── */}
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

                {/* ── 04 TARGETING ── */}
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

                {/* ── 05 CREATIVE ── */}
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

                {/* ── 06 RESULTS ── */}
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

                {/* ── 07 KEY INSIGHTS ── */}
                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="07 — Key Insights"
                        title="What the campaign revealed about mobile behavior"
                    />
                    <div
                        style={{
                            display: "flex",
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
                            open={activeRec === i}
                            onClick={() =>
                                setActiveRec(activeRec === i ? null : i)
                            }
                        />
                    ))}
                </FadeIn>

                {/* ── 10 REFLECTION ── */}
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
                            The most effective local campaigns don't just drive
                            awareness — they make it easy for customers to say
                            yes.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </div>
    )
}
