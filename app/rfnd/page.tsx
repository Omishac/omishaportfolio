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

// ── Utilities ──────────────────────────────────────────────────────────────────
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

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const { ref, visible } = useInView(0.06)
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
        <div style={{
            width: "100%",
            height: "1px",
            backgroundColor: C.border,
            margin: "96px 0 60px",
        }} />
    )
}

function Body({ children }: { children: React.ReactNode }) {
    return (
        <p style={{
            fontFamily: INTER,
            fontSize: "15px",
            lineHeight: "1.82",
            color: C.ink2,
            maxWidth: "780px",
            marginBottom: "20px",
            letterSpacing: "-0.003em",
        }}>
            {children}
        </p>
    )
}

// ── Editorial components ───────────────────────────────────────────────────────
function ChapterLabel({ index, title }: { index: string; title: string }) {
    return (
        <div style={{ marginBottom: "36px" }}>
            <p style={{
                fontFamily: INTER,
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.muted,
                marginBottom: "12px",
            }}>
                {index}
            </p>
            <h2 style={{
                fontFamily: Z,
                fontSize: "clamp(26px, 3.2vw, 38px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: C.ink,
                margin: 0,
                lineHeight: 1.06,
                maxWidth: "760px",
            }}>
                {title}
            </h2>
        </div>
    )
}

function PullQuote({ text }: { text: string }) {
    return (
        <div style={{ margin: "56px 0" }}>
            <p style={{
                fontFamily: Z,
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(26px, 3.4vw, 38px)",
                lineHeight: 1.38,
                color: C.ink,
                letterSpacing: "-0.025em",
                maxWidth: "840px",
            }}>
                "{text}"
            </p>
        </div>
    )
}

function Callout({ type, title, body }: {
    type: "insight" | "decision" | "constraint" | "tradeoff"
    title: string
    body: string
}) {
    const config = {
        insight: {
            bg: C.ink,
            label: "Key Insight",
            labelColor: "rgba(255,255,255,0.38)",
            titleColor: "#fff",
            bodyColor: "rgba(255,255,255,0.7)",
            border: "none",
            br: "12px",
        },
        decision: {
            bg: C.surface,
            label: "Design Decision",
            labelColor: C.muted,
            titleColor: C.ink,
            bodyColor: C.ink2,
            border: `3px solid ${C.ink}`,
            br: "0 12px 12px 0",
        },
        constraint: {
            bg: "#FBF7F2",
            label: "Constraint",
            labelColor: "#A0683A",
            titleColor: "#4A2E10",
            bodyColor: "#7A5030",
            border: "3px solid #D4956A",
            br: "0 12px 12px 0",
        },
        tradeoff: {
            bg: C.surface2,
            label: "Tradeoff",
            labelColor: C.muted,
            titleColor: C.ink,
            bodyColor: C.ink2,
            border: `3px solid ${C.muted}`,
            br: "0 12px 12px 0",
        },
    }
    const s = config[type]
    return (
        <div style={{
            backgroundColor: s.bg,
            borderLeft: s.border,
            borderRadius: s.br,
            padding: "36px 40px",
            margin: "44px 0",
        }}>
            <p style={{
                fontFamily: INTER,
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: s.labelColor,
                marginBottom: "14px",
            }}>
                {s.label}
            </p>
            <p style={{
                fontFamily: Z,
                fontSize: "20px",
                fontWeight: 700,
                color: s.titleColor,
                marginBottom: "12px",
                lineHeight: 1.35,
            }}>
                {title}
            </p>
            <p style={{
                fontFamily: INTER,
                fontSize: "14px",
                lineHeight: 1.74,
                color: s.bodyColor,
                margin: 0,
            }}>
                {body}
            </p>
        </div>
    )
}

function FullImage({ src, alt, caption, radius = 14 }: {
    src: string
    alt: string
    caption?: string
    radius?: number
}) {
    return (
        <div style={{ margin: "44px 0" }}>
            <img
                src={src}
                alt={alt}
                style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: radius,
                    boxShadow: "0 4px 52px rgba(0,0,0,0.10)",
                }}
            />
            {caption && (
                <p style={{
                    fontFamily: Z,
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: 13,
                    color: C.ink3,
                    textAlign: "center",
                    margin: "18px 0 0",
                    lineHeight: 1.6,
                }}>
                    {caption}
                </p>
            )}
        </div>
    )
}

function Transition({ text }: { text: string }) {
    return (
        <p style={{
            fontFamily: Z,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "15.5px",
            color: C.ink3,
            marginTop: "40px",
            lineHeight: 1.7,
            maxWidth: "680px",
            borderTop: `1px solid ${C.border}`,
            paddingTop: "28px",
        }}>
            {text}
        </p>
    )
}

// ── Shopping mode toggle ───────────────────────────────────────────────────────
function ShoppingModeToggle() {
    const [mode, setMode] = useState<"intent" | "discovery">("intent")
    const modes = {
        intent: {
            title: "Intent Mode",
            desc: "Streamlined filtering, fast navigation, reduced friction, efficient product discovery",
            icon: "🎯",
            features: ["Quick search", "Smart filters", "Direct checkout", "Saved preferences"],
        },
        discovery: {
            title: "Discovery Mode",
            desc: "Exploration, inspiration, curated recommendations, mood-aware personalization, emotional engagement",
            icon: "✨",
            features: ["Mood boards", "Style quiz", "Curator picks", "Surprise me"],
        },
    }
    return (
        <div style={{ backgroundColor: C.surface, borderRadius: "14px", padding: "40px", marginTop: "8px" }}>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "32px" }}>
                {(["intent", "discovery"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        style={{
                            fontFamily: INTER, fontSize: "13px", fontWeight: 600,
                            padding: "12px 32px", borderRadius: "24px", border: "none", cursor: "pointer",
                            backgroundColor: mode === m ? C.ink : "transparent",
                            color: mode === m ? "#fff" : C.ink2,
                            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                        }}
                    >
                        {m === "intent" ? "Intent Shopping" : "Discovery Shopping"}
                    </button>
                ))}
            </div>
            <div style={{
                backgroundColor: mode === "intent" ? "#F9F8F5" : "#F5F3F9",
                padding: "32px", borderRadius: "10px",
                transition: "background 0.5s cubic-bezier(0.22,1,0.36,1)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "32px" }}>{modes[mode].icon}</span>
                    <p style={{ fontFamily: Z, fontSize: "20px", fontWeight: 600, color: C.ink, margin: 0 }}>
                        {modes[mode].title}
                    </p>
                </div>
                <p style={{ fontFamily: INTER, fontSize: "14px", lineHeight: 1.65, color: C.ink3, marginBottom: "20px" }}>
                    {modes[mode].desc}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {modes[mode].features.map((f, i) => (
                        <div key={i} style={{
                            fontFamily: INTER, fontSize: "12px", color: C.ink2,
                            padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "6px",
                        }}>
                            • {f}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Mood carousel ──────────────────────────────────────────────────────────────
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
                <button onClick={prev} style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    border: `1px solid ${C.border}`, backgroundColor: "white",
                    cursor: "pointer", fontSize: "18px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                }}>←</button>
                <div style={{ flex: 1, maxWidth: "400px", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    {moods.map((mood, i) => {
                        const offset = i - currentIndex
                        const isActive = i === currentIndex
                        return (
                            <div key={i} style={{
                                position: "absolute",
                                width: isActive ? "180px" : "140px",
                                height: isActive ? "180px" : "140px",
                                borderRadius: "16px",
                                backgroundColor: mood.color,
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", gap: "12px",
                                transform: `translateX(${offset * 120}px) scale(${isActive ? 1 : 0.85})`,
                                opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.4,
                                transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                                zIndex: isActive ? 10 : 1,
                            }}>
                                <span style={{ fontSize: isActive ? "56px" : "40px", transition: "font-size 0.5s" }}>
                                    {mood.emoji}
                                </span>
                                <p style={{ fontFamily: Z, fontSize: isActive ? "18px" : "15px", fontWeight: 600, color: C.ink, margin: 0, transition: "font-size 0.5s" }}>
                                    {mood.label}
                                </p>
                            </div>
                        )
                    })}
                </div>
                <button onClick={next} style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    border: `1px solid ${C.border}`, backgroundColor: "white",
                    cursor: "pointer", fontSize: "18px", display: "flex",
                    alignItems: "center", justifyContent: "center",
                }}>→</button>
            </div>
            <p style={{ fontFamily: INTER, fontSize: "13px", color: C.ink3, textAlign: "center", marginTop: "24px", lineHeight: 1.6 }}>
                Browse products based on your current mood and emotional state
            </p>
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
                            fontFamily: INTER, fontSize: phone ? 13 : 14, fontWeight: 500,
                            color: C.ink3, textDecoration: "none", letterSpacing: "-0.01em",
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

// ── Page ───────────────────────────────────────────────────────────────────────
export default function RFNDCaseStudy() {
    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <CaseStudyNav />
            <div style={{ maxWidth: 1040, margin: "0 auto", padding: "0 80px 160px" }}>

                {/* ── HERO ── */}
                <FadeIn>
                    <div style={{ paddingTop: "88px", paddingBottom: "0" }}>
                        <p style={{
                            fontFamily: INTER, fontSize: "10px", fontWeight: 700,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            color: C.muted, marginBottom: "24px",
                        }}>
                            Capstone · UX Strategy · E-Commerce Innovation
                        </p>
                        <h1 style={{
                            fontFamily: Z, fontWeight: 700,
                            fontSize: "clamp(40px, 5.5vw, 66px)",
                            lineHeight: "1.02", letterSpacing: "-0.03em",
                            marginBottom: "22px", maxWidth: "880px", color: C.ink,
                        }}>
                            RFND — Reimagining Emotional E-Commerce
                        </h1>
                        <p style={{
                            fontFamily: Z, fontStyle: "italic", fontWeight: 300,
                            fontSize: "20px", marginBottom: "52px", color: C.ink3,
                            maxWidth: "680px", lineHeight: 1.62,
                        }}>
                            A nine-month design strategy capstone exploring why emotional engagement is a commerce problem — and how mood-aware design drives loyalty beyond the transaction.
                        </p>
                        <div style={{
                            display: "flex", gap: "56px",
                            paddingBottom: "48px", borderBottom: `1px solid ${C.border}`,
                        }}>
                            {[
                                ["Role", "Product Strategist · UX Designer · Researcher"],
                                ["Timeline", "9 Months"],
                                ["Focus", "UX Strategy · Personalization · Consumer Psychology"],
                            ].map(([k, v]) => (
                                <div key={k}>
                                    <p style={{
                                        fontFamily: INTER, fontWeight: 700, fontSize: "9px",
                                        color: C.muted, marginBottom: "8px",
                                        textTransform: "uppercase", letterSpacing: "0.12em",
                                    }}>
                                        {k}
                                    </p>
                                    <p style={{
                                        fontFamily: Z, fontStyle: "italic",
                                        fontWeight: 300, fontSize: "14px", color: C.ink2, margin: 0,
                                    }}>
                                        {v}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={120}>
                    <FullImage
                        src="/slides/rfnd-hero.png"
                        alt="RFND — Reimagining Emotional E-Commerce"
                        radius={16}
                    />
                </FadeIn>

                {/* ── 01 CONTEXT ── */}
                <Divider />
                <FadeIn>
                    <ChapterLabel
                        index="01 — Context"
                        title="The industry was leaving money on the table"
                    />
                    <Body>
                        Fashion e-commerce generates over $700 billion annually — and returns somewhere between $100 and $300 billion of that same inventory every year. I started RFND with a conviction that these two figures are not coincidental. The industry had optimized relentlessly for speed of transaction at the direct cost of the emotional experiences that make people feel confident about what they buy.
                    </Body>
                    <Body>
                        Platforms got faster. Checkout got easier. Recommendations got smarter. But the rate of buyer's remorse — and the volume of product shipped back — kept climbing. Something was being missed. And it wasn't a feature.
                    </Body>
                    <Body>
                        It was a feeling.
                    </Body>
                    <Transition text="To understand what was missing, I needed to stop looking at the interface and start looking at the person using it." />
                </FadeIn>

                {/* ── 02 THE PROBLEM ── */}
                <Divider />
                <FadeIn>
                    <ChapterLabel
                        index="02 — The Problem"
                        title="I reframed the question before writing a single line of design"
                    />
                    <Body>
                        Most UX briefs frame shopping as an efficiency problem — how do we help users find what they want faster? That framing produces useful products, but it quietly assumes users always know what they want. In fashion, they rarely do.
                    </Body>
                    <Body>
                        The research question I defined for RFND deliberately avoided solutions:
                    </Body>
                    <PullQuote text="How do emotional responses elicited by e-commerce design influence purchasing decisions, impulse behavior, and long-term brand loyalty?" />
                    <Body>
                        This reframing changed the entire scope. I wasn't designing a better filter. I was investigating the psychology of desire — and whether a digital product could meet that psychology with the same nuance a great in-store experience does.
                    </Body>
                    <Callout
                        type="constraint"
                        title="I was designing without a product to iterate on"
                        body="RFND was greenfield strategy work — no existing interface to test against, no live users to observe, no product team to pressure-test decisions with. Every insight had to be grounded in primary research, behavioral psychology literature, and analogous products. This constraint forced me to be more rigorous about evidence than I'd ever been before."
                    />
                    <Transition text="Which meant I needed to go deep on research before I could go anywhere on design." />
                </FadeIn>

                {/* ── 03 RESEARCH & DISCOVERY ── */}
                <Divider />
                <FadeIn>
                    <ChapterLabel
                        index="03 — Research & Discovery"
                        title="I needed to understand the person before I could design the product"
                    />
                    <Body>
                        I spent the first two months doing something that felt counterproductive but turned out to be essential: not designing. I conducted interviews with frequent online shoppers, ran diary studies to capture real-time shopping behavior, and synthesized findings from behavioral economics research on consumer decision-making.
                    </Body>
                    <Body>
                        What I was looking for wasn't a pain point in the traditional sense. I wanted to understand the emotional arc of a shopping session — how users arrived, how they moved through a store, and what made them leave with either confidence or regret.
                    </Body>
                </FadeIn>
                <FadeIn delay={80}>
                    <FullImage
                        src="/slides/persona.jpg"
                        alt="RFND user persona"
                        caption="User persona synthesized from interviews and behavioral research — the emotionally-driven, discovery-oriented modern shopper"
                    />
                </FadeIn>
                <FadeIn>
                    <Body>
                        The user I was designing for wasn't failing because the product was hard to use. She was failing because the product didn't understand her emotional state when she arrived. She showed up differently on a Sunday afternoon browsing for inspiration than she did on a Tuesday lunch break looking for a specific dress for a specific event. And every app she used treated her exactly the same way.
                    </Body>
                    <Body>
                        That gap — between who a user is in the moment and who the product assumes they are — became the central design problem I committed to solving.
                    </Body>
                    <Callout
                        type="insight"
                        title="Users don't shop in one mode — they oscillate between two fundamentally different emotional states"
                        body="Intent mode is goal-driven: the user knows what they want and needs efficiency. Discovery mode is exploratory: the user wants inspiration, connection, or surprise. Most platforms serve neither mode well because they're built on the assumption that both are the same person with the same need."
                    />
                    <Transition text="Once I could name the two modes, the design direction became clear — but getting there required a creative exploration that challenged almost every assumption I started with." />
                </FadeIn>

                {/* ── 04 EXPLORATION ── */}
                <Divider />
                <FadeIn>
                    <ChapterLabel
                        index="04 — Exploration"
                        title="Before designing screens, I found a visual and emotional language"
                    />
                    <Body>
                        One of the deliberate choices I made early was to resist the pull toward wireframes. It's tempting to start designing UI the moment you have a direction — but with RFND, I knew the product's success would depend on its emotional register as much as its functionality. So before touching a frame, I spent several weeks in visual territory.
                    </Body>
                    <Body>
                        I built moodboards, studied how luxury fashion brands use negative space and pacing, and analyzed the sensory language of physical retail — the deliberate lighting, the curated music, the way good stores slow you down on purpose. I was trying to understand what "emotional design" felt like at a craft level, not just what it meant conceptually.
                    </Body>
                </FadeIn>
                <FadeIn delay={80}>
                    <FullImage
                        src="/slides/moodboard.png"
                        alt="RFND moodboard"
                        caption="Visual and emotional territory — tonal direction, aesthetic reference, and the feeling RFND was designed to evoke"
                    />
                </FadeIn>
                <FadeIn>
                    <Body>
                        The moodboard revealed something I hadn't expected: the most emotionally resonant retail experiences share a common quality — they create space. Not just whitespace in the design sense, but cognitive space. They don't rush you toward a decision. They let you arrive at one.
                    </Body>
                    <Body>
                        That insight became a design principle that ran through every screen and interaction I built: the interface should feel less like a store directory and more like a room you want to stay in.
                    </Body>
                    <Callout
                        type="tradeoff"
                        title="Emotional depth vs. functional speed"
                        body="Designing for atmosphere is in direct tension with the efficiency metrics that drive most e-commerce KPIs — session length, click-through rate, conversion per visit. I had to be deliberate about where RFND accepted this tradeoff — and where it absolutely couldn't afford to. Intent mode had to be fast. Discovery mode could be slow. The product lived in the tension between both."
                    />
                    <p style={{
                        fontFamily: INTER, fontSize: "10px", fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        color: C.muted, margin: "52px 0 16px",
                    }}>
                        Interactive Demo — Mood-Based Personalization
                    </p>
                    <MoodCarousel />
                    <Transition text="With a creative direction established, I moved into the hardest part of the project: making actual product decisions." />
                </FadeIn>

                {/* ── 05 DECISION MAKING ── */}
                <Divider />
                <FadeIn>
                    <ChapterLabel
                        index="05 — Decision Making"
                        title="The decision that shaped everything else"
                    />
                    <Body>
                        The key product decision in RFND was one I almost didn't make. My instinct was to build a smarter recommendation algorithm — something that infers emotional intent from behavioral data and personalizes accordingly. It was technically credible and commercially defensible. Most companies are already building it.
                    </Body>
                    <Body>
                        But the research kept pulling me in a different direction. Users didn't want to be understood by an algorithm. They wanted to be understood by the product in a way they could see and control. The difference between "we noticed you like this" and "you told us you're in this mood tonight" isn't just philosophical — it's the difference between surveillance and conversation.
                    </Body>
                    <Callout
                        type="decision"
                        title="Mood-first personalization: voluntary signal over behavioral inference"
                        body="I designed a system where users actively define their emotional context before browsing — occasion, mood, aesthetic intent — rather than having it inferred from past behavior. This makes personalization feel like a conversation, not a mirror. It also means the experience adapts to who they are today, not who they were last Tuesday. And critically: users trust a system they feel in control of."
                    />
                    <p style={{
                        fontFamily: INTER, fontSize: "10px", fontWeight: 700,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        color: C.muted, margin: "52px 0 16px",
                    }}>
                        Interactive Demo — Try Switching Modes
                    </p>
                    <ShoppingModeToggle />
                </FadeIn>
                <FadeIn delay={80}>
                    <FullImage
                        src="/slides/homepgexplorations.png"
                        alt="Homepage design explorations"
                        caption="Homepage layout explorations — iterating on visual hierarchy, mode entry points, and the first decision a user makes when they open the app"
                    />
                </FadeIn>
                <FadeIn>
                    <Transition text="Having made the core product decision, I needed to validate that the features built on top of it would actually hold up — not just conceptually, but behaviorally." />
                </FadeIn>

                {/* ── 06 TESTING & VALIDATION ── */}
                <Divider />
                <FadeIn>
                    <ChapterLabel
                        index="06 — Testing & Validation"
                        title="I validated every feature against two questions, not one"
                    />
                    <Body>
                        Most product teams validate against a single criterion: does this feature solve a user problem? I added a second filter throughout RFND: does this feature create genuine value, or does it create novelty?
                    </Body>
                    <Body>
                        The distinction matters more than it sounds. Novelty drives short-term engagement. Genuine value drives return behavior. For a product competing on emotional loyalty, I needed features users would still want six months in — not just six minutes in.
                    </Body>
                    <Body>
                        I stress-tested four features against this framework. Conversational filtering — natural language prompts replacing rigid category trees — passed both tests: it reduced real friction and added durable value by making the experience feel less mechanical. The digital closet passed on similar grounds. The gamified discovery mechanic required the most rethinking — the slot-machine interaction tested well for novelty but needed a clearer behavioral payoff before I felt confident it could hold.
                    </Body>
                    <Callout
                        type="insight"
                        title="The features that survived were the ones rooted in behavior, not delight"
                        body="Every feature in the final recommendation addressed a specific behavioral gap I'd documented in research: the paralysis of too many choices, the cognitive cost of managing a fragmented wishlist, the emotional friction of returning something because it didn't match how you felt the day you bought it. Delight was a byproduct — not the strategy."
                    />
                    <Transition text="With the features validated, I could finally define what RFND looked and felt like as a complete product experience." />
                </FadeIn>

                {/* ── 07 FINAL RECOMMENDATION ── */}
                <Divider />
                <FadeIn>
                    <ChapterLabel
                        index="07 — Final Recommendation"
                        title="A product that meets you where you are"
                    />
                    <Body>
                        The final recommendation I brought to my capstone committee was a dual-mode e-commerce platform built on a single organizing principle: the interface should adapt to the user's emotional intent — not force the user to adapt to the interface.
                    </Body>
                    <Body>
                        In practice: two distinct but unified experiences. Intent mode strips away everything except what a goal-directed user needs — fast filtering, direct navigation, reduced visual density, frictionless checkout. Discovery mode leans into exploration — editorial curation, mood-based recommendations, conversational filtering, and a digital closet that helps users build toward a personal aesthetic over time.
                    </Body>
                    <PullQuote text="The best retail experience doesn't ask you what you want to buy. It asks you how you want to feel." />
                    <Body>
                        The key screens were designed to embody this duality — each making the user's current mode legible through layout, density, and pacing rather than through explicit labels or onboarding flows. The mode you're in should feel obvious without being stated.
                    </Body>
                </FadeIn>
                <FadeIn delay={80}>
                    <div style={{ display: "flex", gap: "20px", margin: "44px 0" }}>
                        {[
                            {
                                src: "/slides/discover.png",
                                label: "Discover",
                                desc: "Mood-aware product discovery — editorial curation tailored to emotional intent and occasion",
                            },
                            {
                                src: "/slides/profile.png",
                                label: "Profile",
                                desc: "Personal style hub — digital closet, style history, and preference memory across sessions",
                            },
                        ].map(({ src, label, desc }) => (
                            <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                                <img
                                    src={src}
                                    alt={label}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        display: "block",
                                        borderRadius: 14,
                                        boxShadow: "0 4px 52px rgba(0,0,0,0.10)",
                                    }}
                                />
                                <div>
                                    <p style={{
                                        fontFamily: INTER, fontWeight: 700, fontSize: "11px",
                                        letterSpacing: "0.08em", textTransform: "uppercase",
                                        color: C.ink, margin: "0 0 5px",
                                    }}>
                                        {label}
                                    </p>
                                    <p style={{
                                        fontFamily: Z, fontStyle: "italic",
                                        fontWeight: 300, fontSize: "13px",
                                        color: C.ink3, margin: 0, lineHeight: 1.55,
                                    }}>
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                {/* ── 08 REFLECTION & IMPACT ── */}
                <Divider />
                <FadeIn>
                    <ChapterLabel
                        index="08 — Reflection & Impact"
                        title="What RFND taught me about the relationship between strategy and design"
                    />
                    <Body>
                        RFND is the project that clarified how I think at a strategic level. Not design as a craft exercise — though the craft mattered — but design as a discipline that sits at the intersection of business, psychology, and human behavior. Every visual decision I made was downstream of a strategic question. Every interaction was in service of an emotional outcome.
                    </Body>
                    <Body>
                        I also learned something harder: knowing what to build is only half the work. The other half is knowing what not to build — which features to reject, which directions to abandon, which instincts to override because the research doesn't support them. Some of the ideas I was most excited about early in the project didn't survive contact with user research. That's not failure. That's the process working correctly.
                    </Body>
                    <Body>
                        If I were running this with a real product team, I'd prioritize two things I couldn't fully address in a solo capstone: behavioral testing at scale over time, and the transition design between modes. The moment a user shifts from intent to discovery is where the product either earns or loses the emotional contract it's trying to establish. That seam is where I'd spend the next six months.
                    </Body>
                    <Callout
                        type="insight"
                        title="The future of commerce is emotional intelligence — not just artificial intelligence"
                        body="Personalization at scale is already a commodity. What the next generation of commerce products needs to build is something harder to replicate: the ability to understand not just what a user is looking for, but what kind of experience they need in that moment — and respond accordingly. That's the space RFND was designed to occupy."
                    />
                    <div style={{
                        marginTop: "64px",
                        display: "flex",
                        gap: "24px",
                        alignItems: "flex-start",
                        padding: "56px 60px",
                        backgroundColor: C.ink,
                        borderRadius: "16px",
                    }}>
                        <span style={{
                            fontFamily: Z, fontSize: "52px", lineHeight: "0.8",
                            color: "rgba(255,255,255,0.10)", marginTop: "4px", flexShrink: 0,
                        }}>
                            "
                        </span>
                        <p style={{
                            fontFamily: Z, fontStyle: "italic", fontWeight: 300,
                            fontSize: "clamp(20px, 2.5vw, 26px)",
                            lineHeight: "1.55", maxWidth: "680px",
                            color: "rgba(255,255,255,0.92)", margin: 0,
                        }}>
                            Digital experiences can still feel meaningful when designed thoughtfully — when the interface listens before it speaks, and adapts before it assumes.
                        </p>
                    </div>
                </FadeIn>

            </div>
        </div>
    )
}
