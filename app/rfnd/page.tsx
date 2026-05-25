"use client"

import React, { useState, useRef, useEffect } from "react"


const Z = "Zodiak, 'Times New Roman', serif"
const INTER = "Inter, system-ui, sans-serif"

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
    return { ref, visible }
}

function FadeIn({
    children,
    delay = 0,
}: {
    children: React.ReactNode
    delay?: number
}) {
    const { ref, visible } = useInView(0.08)
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(28px)",
                transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
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
                margin: "72px 0 36px",
            }}
        />
    )
}

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
        <div style={{ marginBottom: "24px" }}>
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: C.muted,
                    marginBottom: "10px",
                }}
            >
                {step}
            </p>
            <p
                style={{
                    fontFamily: Z,
                    fontSize: "30px",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color: C.ink,
                    marginBottom: "6px",
                    lineHeight: 1.05,
                }}
            >
                {title}
            </p>
            {sub && (
                <p
                    style={{
                        fontFamily: Z,
                        fontStyle: "italic",
                        fontWeight: 300,
                        fontSize: "17px",
                        color: C.ink3,
                        marginBottom: "28px",
                        lineHeight: 1.5,
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
                fontSize: "15px",
                lineHeight: "1.75",
                color: C.ink2,
                maxWidth: "800px",
                marginBottom: "16px",
            }}
        >
            {children}
        </p>
    )
}

function ShoppingModeToggle() {
    const [mode, setMode] = useState<"intent" | "discovery">("intent")

    const modes = {
        intent: {
            title: "Intent Mode",
            desc: "Streamlined filtering, fast navigation, reduced friction, efficient product discovery",
            icon: "🎯",
            features: [
                "Quick search",
                "Smart filters",
                "Direct checkout",
                "Saved preferences",
            ],
        },
        discovery: {
            title: "Discovery Mode",
            desc: "Exploration, inspiration, gamified interactions, curated recommendations, emotional engagement",
            icon: "✨",
            features: [
                "Mood boards",
                "Style quiz",
                "Curator picks",
                "Surprise me",
            ],
        },
    }

    return (
        <div
            style={{
                backgroundColor: C.surface,
                borderRadius: "14px",
                padding: "40px",
                marginTop: "24px",
            }}
        >
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.muted,
                    marginBottom: "20px",
                    textAlign: "center",
                }}
            >
                Interactive Demo — Try Switching Modes
            </p>

            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    marginBottom: "32px",
                }}
            >
                <button
                    onClick={() => setMode("intent")}
                    style={{
                        fontFamily: INTER,
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "12px 32px",
                        borderRadius: "24px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor:
                            mode === "intent" ? C.ink : "transparent",
                        color: mode === "intent" ? "#fff" : C.ink2,
                        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    Intent Shopping
                </button>
                <button
                    onClick={() => setMode("discovery")}
                    style={{
                        fontFamily: INTER,
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "12px 32px",
                        borderRadius: "24px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor:
                            mode === "discovery" ? C.ink : "transparent",
                        color: mode === "discovery" ? "#fff" : C.ink2,
                        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    Discovery Shopping
                </button>
            </div>

            <div
                style={{
                    backgroundColor: mode === "intent" ? "#F9F8F5" : "#F5F3F9",
                    padding: "32px",
                    borderRadius: "10px",
                    transition: "background 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px",
                    }}
                >
                    <span style={{ fontSize: "32px" }}>{modes[mode].icon}</span>
                    <p
                        style={{
                            fontFamily: Z,
                            fontSize: "20px",
                            fontWeight: 600,
                            color: C.ink,
                        }}
                    >
                        {modes[mode].title}
                    </p>
                </div>
                <p
                    style={{
                        fontFamily: INTER,
                        fontSize: "14px",
                        lineHeight: 1.65,
                        color: C.ink3,
                        marginBottom: "20px",
                    }}
                >
                    {modes[mode].desc}
                </p>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                    }}
                >
                    {modes[mode].features.map((f, i) => (
                        <div
                            key={i}
                            style={{
                                fontFamily: INTER,
                                fontSize: "12px",
                                color: C.ink2,
                                padding: "10px 14px",
                                backgroundColor: "rgba(255,255,255,0.6)",
                                borderRadius: "6px",
                            }}
                        >
                            • {f}
                        </div>
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
    const prev = () =>
        setCurrentIndex((currentIndex - 1 + moods.length) % moods.length)

    return (
        <div
            style={{
                backgroundColor: C.surface,
                borderRadius: "14px",
                padding: "40px",
                marginTop: "24px",
            }}
        >
            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: C.muted,
                    marginBottom: "28px",
                    textAlign: "center",
                }}
            >
                Interactive Demo — Mood-Based Personalization
            </p>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    justifyContent: "center",
                }}
            >
                <button
                    onClick={prev}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: `1px solid ${C.border}`,
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    ←
                </button>

                <div
                    style={{
                        flex: 1,
                        maxWidth: "400px",
                        height: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {moods.map((mood, i) => {
                        const offset = i - currentIndex
                        const isActive = i === currentIndex

                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    width: isActive ? "180px" : "140px",
                                    height: isActive ? "180px" : "140px",
                                    borderRadius: "16px",
                                    backgroundColor: mood.color,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "12px",
                                    transform: `translateX(${offset * 120}px) scale(${isActive ? 1 : 0.85})`,
                                    opacity:
                                        Math.abs(offset) > 1
                                            ? 0
                                            : isActive
                                              ? 1
                                              : 0.4,
                                    transition:
                                        "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                                    zIndex: isActive ? 10 : 1,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: isActive ? "56px" : "40px",
                                        transition: "font-size 0.5s",
                                    }}
                                >
                                    {mood.emoji}
                                </span>
                                <p
                                    style={{
                                        fontFamily: Z,
                                        fontSize: isActive ? "18px" : "15px",
                                        fontWeight: 600,
                                        color: C.ink,
                                        transition: "font-size 0.5s",
                                    }}
                                >
                                    {mood.label}
                                </p>
                            </div>
                        )
                    })}
                </div>

                <button
                    onClick={next}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: `1px solid ${C.border}`,
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontSize: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    →
                </button>
            </div>

            <p
                style={{
                    fontFamily: INTER,
                    fontSize: "13px",
                    color: C.ink3,
                    textAlign: "center",
                    marginTop: "24px",
                    lineHeight: 1.6,
                }}
            >
                Browse products based on your current mood and emotional state
            </p>
        </div>
    )
}

function FeatureCarousel() {
    const features = [
        {
            title: "Conversational Filtering",
            desc: "Natural language prompts like 'I'm looking for a...' replace rigid traditional filters",
            icon: "💬",
            details: [
                "Occasion-based",
                "Mood selection",
                "Style aesthetic",
                "Budget aware",
            ],
        },
        {
            title: "Digital Closet",
            desc: "Save outfits, organize products, track personal style preferences, build intentional wardrobes",
            icon: "👗",
            details: [
                "Outfit builder",
                "Style tracking",
                "Wishlist system",
                "Wardrobe planning",
            ],
        },
        {
            title: "Gamified Discovery",
            desc: "Slot-machine inspired interactions make product discovery feel memorable and engaging",
            icon: "🎰",
            details: [
                "Rotating cards",
                "Value matching",
                "Surprise finds",
                "Interactive fun",
            ],
        },
        {
            title: "Smart Translation",
            desc: "AI-assisted review translation breaks language barriers for global shoppers",
            icon: "🌍",
            details: [
                "Auto-translate",
                "Context aware",
                "Cultural nuance",
                "Accessibility",
            ],
        },
    ]

    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <div style={{ marginTop: "32px" }}>
            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "20px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
            >
                {features.map((f, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        style={{
                            fontFamily: INTER,
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "8px 16px",
                            borderRadius: "20px",
                            border: `1px solid ${C.border}`,
                            cursor: "pointer",
                            backgroundColor:
                                activeIndex === i ? C.ink : "white",
                            color: activeIndex === i ? "#fff" : C.ink2,
                            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                        }}
                    >
                        {f.icon} {f.title}
                    </button>
                ))}
            </div>

            <div
                style={{
                    backgroundColor: C.surface,
                    borderRadius: "12px",
                    padding: "40px",
                    minHeight: "240px",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {features.map((f, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: "40px",
                            left: "40px",
                            right: "40px",
                            opacity: activeIndex === i ? 1 : 0,
                            transform:
                                activeIndex === i
                                    ? "translateX(0)"
                                    : `translateX(${i < activeIndex ? -20 : 20}px)`,
                            transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                            pointerEvents: activeIndex === i ? "auto" : "none",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "16px",
                            }}
                        >
                            <span style={{ fontSize: "40px" }}>{f.icon}</span>
                            <p
                                style={{
                                    fontFamily: Z,
                                    fontSize: "22px",
                                    fontWeight: 600,
                                    color: C.ink,
                                }}
                            >
                                {f.title}
                            </p>
                        </div>
                        <p
                            style={{
                                fontFamily: INTER,
                                fontSize: "15px",
                                lineHeight: 1.7,
                                color: C.ink2,
                                marginBottom: "24px",
                                maxWidth: "680px",
                            }}
                        >
                            {f.desc}
                        </p>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(140px, 1fr))",
                                gap: "8px",
                            }}
                        >
                            {f.details.map((d, j) => (
                                <div
                                    key={j}
                                    style={{
                                        fontFamily: INTER,
                                        fontSize: "12px",
                                        color: C.ink3,
                                        padding: "8px 12px",
                                        backgroundColor:
                                            "rgba(255,255,255,0.7)",
                                        borderRadius: "6px",
                                    }}
                                >
                                    • {d}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ProblemSolutionSlider() {
    const [view, setView] = useState<"problem" | "solution">("problem")

    const content = {
        problem: {
            title: "Traditional E-Commerce",
            items: [
                "Decision fatigue from endless scrolling",
                "Generic recommendation systems",
                "Overloaded product listing pages",
                "Weak emotional connection with brands",
                "Lack of intentionality during shopping",
                "One-size-fits-all experiences",
            ],
            color: "#FFE4E1",
        },
        solution: {
            title: "RFND Approach",
            items: [
                "Mood-based personalization reduces cognitive load",
                "Emotionally intelligent recommendations",
                "Curated, context-aware product discovery",
                "Emotional engagement through design",
                "Intent-driven shopping modes",
                "Adaptive experiences based on user mindset",
            ],
            color: "#E8F4F8",
        },
    }

    return (
        <div style={{ marginTop: "32px" }}>
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    marginBottom: "24px",
                }}
            >
                <button
                    onClick={() => setView("problem")}
                    style={{
                        fontFamily: INTER,
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "10px 28px",
                        borderRadius: "24px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: view === "problem" ? C.ink : C.surface,
                        color: view === "problem" ? "#fff" : C.ink2,
                        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    The Problem
                </button>
                <button
                    onClick={() => setView("solution")}
                    style={{
                        fontFamily: INTER,
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "10px 28px",
                        borderRadius: "24px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor:
                            view === "solution" ? C.ink : C.surface,
                        color: view === "solution" ? "#fff" : C.ink2,
                        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    The Solution
                </button>
            </div>

            <div
                style={{
                    backgroundColor: content[view].color,
                    borderRadius: "12px",
                    padding: "40px",
                    minHeight: "320px",
                    transition: "background 0.5s cubic-bezier(0.22,1,0.36,1)",
                }}
            >
                <p
                    style={{
                        fontFamily: Z,
                        fontSize: "24px",
                        fontWeight: 600,
                        color: C.ink,
                        marginBottom: "28px",
                    }}
                >
                    {content[view].title}
                </p>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    {content[view].items.map((item, i) => (
                        <div
                            key={`${view}-${i}`}
                            style={{
                                fontFamily: INTER,
                                fontSize: "14px",
                                color: C.ink2,
                                padding: "14px 18px",
                                backgroundColor: "rgba(255,255,255,0.7)",
                                borderRadius: "8px",
                                lineHeight: 1.6,
                            }}
                        >
                            {view === "problem" ? "⚠️" : "✓"} {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function InsightQuote({ text }: { text: string }) {
    return (
        <div
            style={{
                borderLeft: `3px solid #6B5B95`,
                paddingLeft: "36px",
                marginTop: "32px",
                marginBottom: "32px",
            }}
        >
            <p
                style={{
                    fontFamily: Z,
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "24px",
                    lineHeight: "1.55",
                    maxWidth: "720px",
                    color: C.ink2,
                }}
            >
                {text}
            </p>
        </div>
    )
}

function DisciplinePills() {
    const disciplines = [
        "UX Strategy",
        "Product Design",
        "Consumer Psychology",
        "Data Analytics",
        "Fashion Commerce",
        "Interaction Design",
        "Personalization",
        "Research",
    ]

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "20px",
            }}
        >
            {disciplines.map((d, i) => (
                <div
                    key={i}
                    style={{
                        fontFamily: INTER,
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "8px 16px",
                        backgroundColor: C.surface2,
                        borderRadius: "20px",
                        color: C.ink,
                        border: `1px solid ${C.border}`,
                    }}
                >
                    {d}
                </div>
            ))}
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

export default function RFNDCaseStudy() {
    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <CaseStudyNav />
            <div
                style={{
                    maxWidth: 1040,
                    margin: "0 auto",
                    padding: "0 80px 160px",
                }}
            >
                <FadeIn>
                    <div style={{ paddingTop: "72px", paddingBottom: "64px" }}>
                        <p
                            style={{
                                fontFamily: INTER,
                                fontSize: "10px",
                                fontWeight: 700,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: C.muted,
                                marginBottom: "24px",
                            }}
                        >
                            Capstone Project · UX Strategy & E-Commerce
                            Innovation
                        </p>
                        <h1
                            style={{
                                fontFamily: Z,
                                fontWeight: 700,
                                fontSize: "58px",
                                lineHeight: "1.04",
                                letterSpacing: "-0.03em",
                                marginBottom: "22px",
                                maxWidth: "860px",
                                color: C.ink,
                            }}
                        >
                            RFND — Reimagining Emotional E-Commerce
                        </h1>
                        <p
                            style={{
                                fontFamily: Z,
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: "21px",
                                marginBottom: "40px",
                                color: C.ink3,
                                maxWidth: "720px",
                                lineHeight: 1.6,
                            }}
                        >
                            A UX strategy capstone exploring why emotional
                            engagement is a business problem — and how
                            mood-aware design drives loyalty beyond the transaction.
                        </p>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "32px",
                            backgroundColor: C.surface,
                            borderRadius: "10px",
                            padding: "20px 28px",
                            marginBottom: "52px",
                            border: `1px solid ${C.border}`,
                        }}>
                            {[
                                { stat: "9 months", label: "of research & design" },
                                { stat: "4 features", label: "designed & validated" },
                                { stat: "2 modes", label: "intent + discovery" },
                            ].map(({ stat, label }) => (
                                <div key={stat} style={{ textAlign: "center" }}>
                                    <p style={{ fontFamily: Z, fontWeight: 700, fontSize: "22px", color: C.ink, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{stat}</p>
                                    <p style={{ fontFamily: INTER, fontSize: "10px", color: C.muted, margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</p>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: "56px",
                                marginBottom: "56px",
                                paddingBottom: "44px",
                                borderBottom: `1px solid ${C.border}`,
                            }}
                        >
                            {[
                                [
                                    "Role",
                                    "Product Strategist · UX Designer · Researcher",
                                ],
                                ["Timeline", "9 Months"],
                                [
                                    "Focus",
                                    "UX Strategy · Personalization · Consumer Psychology",
                                ],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <p
                                        style={{
                                            fontFamily: INTER,
                                            fontWeight: 700,
                                            fontSize: "9px",
                                            color: C.muted,
                                            marginBottom: "8px",
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
                                            fontSize: "15px",
                                            color: C.ink2,
                                        }}
                                    >
                                        {v}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <DisciplinePills />
                    </div>
                </FadeIn>

                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="01 — Business Problem"
                        title="Emotional engagement is a commerce problem, not just a design problem"
                        sub="E-commerce platforms optimize for efficiency at the expense of connection"
                    />
                    <Body>
                        Modern e-commerce is losing the emotional dimension of
                        retail. Platforms optimize for speed and conversion, but
                        the result is experiences that feel transactional,
                        overwhelming, and forgettable — driving decision fatigue,
                        weak brand loyalty, and high return rates.
                    </Body>
                    <Body>
                        Physical retail creates emotional experiences through
                        discovery, atmosphere, and human interaction. The
                        business question RFND set out to answer: how do you
                        reintroduce those elements digitally — without
                        sacrificing the efficiency that makes e-commerce work?
                    </Body>
                </FadeIn>

                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="02 — Research Question"
                        title="Defining the strategic question"
                    />
                    <InsightQuote text="How do emotional responses elicited by e-commerce design and interactive features influence consumer purchasing decisions, impulse buying behavior, and brand loyalty?" />
                    <Body>
                        This question reframed the problem from a UX challenge
                        into a business opportunity: if shopping interfaces
                        could adapt to emotional intent rather than only
                        transactional intent, personalization could drive
                        deeper loyalty — not just higher click-through rates.
                    </Body>
                </FadeIn>

                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="03 — Problem & Solution"
                        title="Shifting from transactional to emotional"
                        sub="Interactive comparison—toggle between views"
                    />
                    <ProblemSolutionSlider />
                </FadeIn>

                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="04 — Key Insight"
                        title="Users shop in two distinct modes — and most platforms serve neither well"
                    />
                    <Body>
                        Research revealed that users shop in two fundamentally
                        different emotional modes: intent mode (goal-driven,
                        efficiency-focused) and discovery mode (exploratory,
                        emotionally engaged). Most platforms force both types
                        into an identical experience — over-serving one and
                        frustrating the other.
                    </Body>
                    <Body>
                        The strategic decision was to design a context-aware
                        interface that adapts to shopping intention — reducing
                        friction for intent shoppers while deepening engagement
                        for discovery shoppers.
                    </Body>
                    <ShoppingModeToggle />
                </FadeIn>

                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="05 — Design Decision"
                        title="Mood-based personalization over algorithmic tracking"
                        sub="Swipe through different mood categories"
                    />
                    <InsightQuote text="Personalization should feel emotionally aware — not algorithmically invasive." />
                    <Body>
                        I designed a mood-first personalization system driven
                        by what users voluntarily share, not what's inferred
                        from behavioral data. Instead of recommending based on
                        browsing history alone, RFND lets users define their
                        emotional context — occasion, mood, aesthetic intent —
                        and adapts the experience accordingly.
                    </Body>
                    <MoodCarousel />
                </FadeIn>

                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="06 — Feature Strategy"
                        title="Four features designed to drive engagement and loyalty"
                        sub="Click each feature to explore"
                    />
                    <FeatureCarousel />
                </FadeIn>

                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="07 — Strategic Framework"
                        title="Dual-mode design: functional efficiency meets emotional depth"
                    />
                    <Body>
                        The core strategic challenge was avoiding a false choice
                        between utility and engagement. I defined a dual-mode
                        framework where neither function compromises the other —
                        functional UX reduces friction and drives conversion,
                        while emotional UX builds the brand affinity that keeps
                        users coming back.
                    </Body>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "20px",
                            marginTop: "28px",
                            backgroundColor: C.surface,
                            padding: "32px",
                            borderRadius: "12px",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontFamily: INTER,
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: C.muted,
                                    marginBottom: "16px",
                                }}
                            >
                                Functional UX
                            </p>
                            {[
                                "Fast filtering",
                                "Clear navigation",
                                "Reduced friction",
                                "Utility",
                                "Conversion optimization",
                            ].map((item, i) => (
                                <p
                                    key={i}
                                    style={{
                                        fontFamily: INTER,
                                        fontSize: "13px",
                                        color: C.ink2,
                                        marginBottom: "8px",
                                    }}
                                >
                                    • {item}
                                </p>
                            ))}
                        </div>
                        <div>
                            <p
                                style={{
                                    fontFamily: INTER,
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: C.muted,
                                    marginBottom: "16px",
                                }}
                            >
                                Emotional UX
                            </p>
                            {[
                                "Discovery",
                                "Curated exploration",
                                "Emotional connection",
                                "Playfulness",
                                "Brand affinity",
                            ].map((item, i) => (
                                <p
                                    key={i}
                                    style={{
                                        fontFamily: INTER,
                                        fontSize: "13px",
                                        color: C.ink2,
                                        marginBottom: "8px",
                                    }}
                                >
                                    • {item}
                                </p>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                <Divider />
                <FadeIn>
                    <SectionLabel
                        step="08 — Reflection"
                        title="What this project taught me about strategy-first design"
                    />
                    <Body>
                        RFND pushed me to think about design as a business
                        lever, not just a craft. Every feature decision was
                        evaluated against two questions: does this reduce a
                        real user friction, and does it move a metric that
                        matters — retention, basket size, return rate?
                    </Body>
                    <Body>
                        The project reinforced a conviction I carry into every
                        engagement: the future of commerce lies at the
                        intersection of data, psychology, and design — and the
                        most durable products are the ones that understand
                        how people feel, not just what they click.
                    </Body>
                    <div
                        style={{
                            marginTop: "48px",
                            display: "flex",
                            gap: "24px",
                            alignItems: "flex-start",
                            padding: "52px",
                            backgroundColor: C.ink,
                            borderRadius: "14px",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: Z,
                                fontSize: "48px",
                                lineHeight: "0.8",
                                color: "rgba(255,255,255,0.12)",
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
                                fontSize: "24px",
                                lineHeight: "1.55",
                                maxWidth: "700px",
                                color: "#fff",
                            }}
                        >
                            Digital experiences can still feel meaningful when
                            designed thoughtfully—prioritizing human emotion
                            over algorithmic efficiency.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </div>
    )
}

