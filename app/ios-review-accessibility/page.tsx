"use client"

import React, { useState, useEffect, useRef } from "react"
import SharedNav from "../../components/SharedNav"
import { FONT_SANS, COLORS, EASE_SPRING, useReducedMotion, BracketTag } from "../../components/site"

// Same tokens and patterns as the URBN filter case study: Inter only, neutral palette.
const I = FONT_SANS
const C = COLORS

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "challenge", label: "Challenge" },
    { id: "research", label: "Research" },
    { id: "decisions", label: "Design Decisions" },
    { id: "solution", label: "Final Solution" },
    { id: "results", label: "Results" },
    { id: "learnings", label: "Learnings" },
]

const MEASURE = 620 // comfortable line length for paragraphs

function useResponsive() {
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    const [large, setLarge] = useState(false)
    useEffect(() => {
        // clientWidth, not innerWidth: overflowing content widens the layout
        // viewport on phones, which would lock in the desktop layout.
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

function useInView(threshold = 0.08) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])
    return { ref, visible }
}

// Same reveal as the filter case study: fade and rise, plays once, off under reduced motion.
function FadeIn({ children, delay = 0, distance = 16, duration = 600, threshold = 0.08 }: { children: React.ReactNode; delay?: number; distance?: number; duration?: number; threshold?: number }) {
    const { ref, visible } = useInView(threshold)
    const reduced = useReducedMotion()
    const shown = visible || reduced
    return (
        <div ref={ref} style={{
            opacity: shown ? 1 : 0, transform: shown ? "none" : `translateY(${distance}px)`,
            transition: reduced ? "none" : `opacity ${duration}ms ${EASE_SPRING} ${delay}ms, transform ${duration}ms ${EASE_SPRING} ${delay}ms`,
        }}>{children}</div>
    )
}

function CountUp({ to, suffix = "", duration = 1200 }: { to: number; suffix?: string; duration?: number }) {
    const { ref, visible } = useInView(0.3)
    const reduced = useReducedMotion()
    const [value, setValue] = useState(0)
    useEffect(() => {
        if (!visible) return
        if (reduced) { setValue(to); return }
        const start = performance.now()
        const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            setValue(Math.round((1 - Math.pow(1 - t, 3)) * to))
            if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
    }, [visible, to, duration, reduced])
    return <span ref={ref}>{value}{suffix}</span>
}

// ── Type ────────────────────────────────────────────────────────────────────

function SectionHead({ tag, title, intro, phone }: { tag?: string; title: string; intro?: React.ReactNode; phone: boolean }) {
    return (
        <div style={{ marginBottom: phone ? 40 : 56 }}>
            {tag && <BracketTag style={{ marginBottom: 14 }}>{tag}</BracketTag>}
            <h2 style={{ fontFamily: I, fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 300, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1.15, maxWidth: MEASURE, margin: 0, textWrap: "balance" }}>
                {title}
            </h2>
            {intro && <p style={{ fontFamily: I, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: MEASURE, margin: 0, marginTop: 16 }}>{intro}</p>}
        </div>
    )
}

function SubHead({ num, title, phone }: { num?: string; title: string; phone: boolean }) {
    return (
        <>
            {num && <Num>{num}</Num>}
            <h3 style={{ fontFamily: I, fontSize: phone ? 20 : 22, fontWeight: 400, letterSpacing: "-0.015em", color: C.ink, lineHeight: 1.3, margin: 0, marginTop: num ? 8 : 0, marginBottom: 10 }}>{title}</h3>
        </>
    )
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return <p style={{ fontFamily: I, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, margin: 0, marginBottom: 8, ...style }}>{children}</p>
}

function BoldLabel({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: I, fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.4, margin: 0, marginBottom: 8 }}>{children}</p>
}

function Num({ children }: { children: React.ReactNode }) {
    return <span style={{ fontFamily: I, fontSize: 11, fontWeight: 400, letterSpacing: "0.06em", color: C.muted }}>{children}</span>
}

function Caption({ children }: { children: React.ReactNode }) {
    return <p style={{ fontFamily: I, fontSize: 12.5, lineHeight: 1.55, color: C.ink3, margin: 0, marginTop: 12 }}>{children}</p>
}

const BODY: React.CSSProperties = { fontFamily: I, fontSize: 15, fontWeight: 400, color: C.ink2, lineHeight: 1.65, margin: 0 }
const MAT: React.CSSProperties = { backgroundColor: C.paper, overflow: "hidden" }
const IMG: React.CSSProperties = { width: "100%", height: "auto", display: "block" }

// Hairline-separated list rows (no cards)
function Rows({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
    return (
        <div>
            {items.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "baseline", padding: "12px 0", borderTop: `1px solid ${C.border}` }}>
                    {numbered && <span style={{ fontFamily: I, fontSize: 11, color: C.muted, letterSpacing: "0.06em", width: 18, flexShrink: 0 }}>0{i + 1}</span>}
                    <span style={{ ...BODY, color: C.ink2 }}>{t}</span>
                </div>
            ))}
        </div>
    )
}

// ── Artifacts (click to view larger) ────────────────────────────────────────

function Lightbox({ src, title, caption, onClose }: { src: string; title: string; caption: string; onClose: () => void }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])
    return (
        <div role="dialog" aria-modal="true" aria-label={title} onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(17,17,17,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
            <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", cursor: "pointer", width: 44, height: 44, color: "rgba(255,255,255,0.8)", fontFamily: I, fontSize: 18 }}>✕</button>
            <img src={src} alt={title} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "86vw", maxHeight: "78vh", objectFit: "contain", display: "block" }} />
            <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 18, textAlign: "center", maxWidth: 580 }}>
                <p style={{ fontFamily: I, fontSize: 13, fontWeight: 500, color: "#fff", margin: 0, marginBottom: 4 }}>{title}</p>
                <p style={{ fontFamily: I, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>{caption}</p>
            </div>
        </div>
    )
}

// `frame`: a shared aspect ratio for artifacts that sit side by side, so their
// captions line up. The image is contained (never cropped) inside the frame.
function Artifact({ src, index, title, caption, frame }: { src: string; index: string; title: string; caption: string; frame?: string }) {
    const [open, setOpen] = useState(false)
    return (
        <figure style={{ margin: 0 }}>
            {open && <Lightbox src={src} title={title} caption={caption} onClose={() => setOpen(false)} />}
            <button onClick={() => setOpen(true)} aria-label={`View ${title} larger`} style={{ display: "block", width: "100%", padding: 16, border: "none", cursor: "zoom-in", ...MAT }}>
                {frame
                    ? <img src={src} alt={title} style={{ width: "100%", aspectRatio: frame, objectFit: "contain", display: "block" }} />
                    : <img src={src} alt={title} style={IMG} />}
            </button>
            <figcaption style={{ marginTop: 12 }}>
                <Num>{index}</Num>
                <p style={{ fontFamily: I, fontSize: 14, fontWeight: 500, color: C.ink, margin: 0, marginTop: 4, marginBottom: 2 }}>{title}</p>
                <p style={{ fontFamily: I, fontSize: 13, lineHeight: 1.55, color: C.ink3, margin: 0 }}>{caption}</p>
            </figcaption>
        </figure>
    )
}

const ARTIFACTS = {
    ticketInfo: "https://framerusercontent.com/images/TUGB4Qb4DIPeuvbPqcHBpCfIgs.png",
    randomThoughts: "https://framerusercontent.com/images/LtDvMeyo5tqgoejA1Y7ML4mAUg.png",
    workflowV1: "https://framerusercontent.com/images/1gWe5JZUMplfUWHJFPzEFfeDE.png",
    workflowV2: "https://framerusercontent.com/images/Ecu3EEV7UFobyl3ax3eyBg9ufw.png",
    translationPath: "https://framerusercontent.com/images/6U9FDAVqiyZVbRNQrind7YikM.png",
    messaging: "https://framerusercontent.com/images/perf4MeJm1az3KP5tGcLY2lR78.png",
}

// ── Design decisions ────────────────────────────────────────────────────────
// Problem = the existing constraint/principle, What I Changed = the existing
// solution, Why = the principle it serves. Wording comes from the original page.

const DECISIONS = [
    {
        num: "01",
        title: "Translate on Demand",
        problem: "Auto-translating large volumes at load would impact page speed significantly, and reviews could not be translated all at once, only individual items on demand.",
        changes: ["Each review has a \"Translate\" CTA, so users trigger translation when they need it, not before"],
        why: "Users choose when to translate, rather than being forced into automatic language changes, and Apple's native translation runs without introducing performance overhead.",
        src: "/slides/ios-discovery.png",
        alt: "Review list with a \"Translate review to Spanish\" link under an English review",
        caption: "A Translate CTA sits under each review in the list.",
    },
    {
        num: "02",
        title: "Toggle to Original, With Subtle Feedback",
        problem: "The feature had to feel like a natural extension of the existing review UI, not a bolt-on.",
        changes: ["A lightweight badge communicates when a review is translated", "Users can instantly switch back to the original language"],
        why: "Shoppers always know when they are reading a translation, and the original wording stays one tap away, preserving authenticity.",
        src: "/slides/ios-translated.png",
        alt: "Translated review showing \"Reseña traducida\" with a \"Ver original\" link",
        caption: "\"Reseña traducida: Ver original\" marks the translation and switches back.",
    },
]

function DecisionBlock({ d, phone }: { d: typeof DECISIONS[number]; phone: boolean }) {
    const group = { marginTop: 28 }
    return (
        <div style={{
            display: "grid",
            // Phone screen column capped at 320px: readable, unstretched, uncropped
            gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 320px)",
            columnGap: 80, rowGap: 32,
            alignItems: "center",
        }}>
            <div style={{ maxWidth: 460 }}>
                <Num>{d.num}</Num>
                <h3 style={{ fontFamily: I, fontSize: phone ? 24 : 28, fontWeight: 300, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0, marginTop: 10 }}>{d.title}</h3>
                <div style={{ marginTop: 32 }}>
                    <BoldLabel>Problem</BoldLabel>
                    <p style={BODY}>{d.problem}</p>
                </div>
                <div style={group}>
                    <BoldLabel>What I Changed</BoldLabel>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {d.changes.map((c) => (
                            <li key={c} style={{ ...BODY, padding: "7px 0", borderTop: `1px solid ${C.border}` }}>{c}</li>
                        ))}
                    </ul>
                </div>
                <div style={group}>
                    <BoldLabel>Why</BoldLabel>
                    <p style={BODY}>{d.why}</p>
                </div>
            </div>
            <figure style={{ margin: 0, width: "100%", maxWidth: phone ? 300 : undefined }}>
                <div style={{ ...MAT, padding: phone ? 20 : 28 }}>
                    <img src={d.src} alt={d.alt} style={IMG} />
                </div>
                <Caption>{d.caption}</Caption>
            </figure>
        </div>
    )
}

// ── Side nav ────────────────────────────────────────────────────────────────

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
                        <span aria-hidden="true" style={{ width: isActive ? 12 : 0, height: 1, backgroundColor: C.ink, transition: `width 0.3s ${EASE_SPRING}` }} />
                        <span style={{ fontFamily: I, fontSize: 12, fontWeight: isActive ? 500 : 400, color: isActive ? C.ink : C.muted, transition: "color 0.3s ease" }}>
                            {label}
                        </span>
                    </a>
                )
            })}
        </nav>
    )
}

export default function IOSCaseStudy() {
    const { phone, tablet, desktop, large } = useResponsive()
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))
    const px = phone ? 20 : tablet ? 40 : large ? 120 : 80
    const contentMax = large ? 1120 : 960
    const sectionGap = phone ? 96 : tablet ? 128 : 160
    const sub = phone ? 64 : 88

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <SharedNav />
            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? `140px minmax(0, ${contentMax}px)` : undefined,
                justifyContent: "center",
                columnGap: desktop ? 64 : undefined,
                margin: "0 auto",
                padding: `0 ${px}px 160px`,
            }}>
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 96, paddingTop: 48 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}

                <main style={{ minWidth: 0 }}>

                    {/* ════════ OVERVIEW ════════ */}
                    <section id="overview" style={{ scrollMarginTop: 96, paddingTop: phone ? 32 : 48 }}>
                        <FadeIn>
                            <div style={MAT}>
                                <img src="/slides/ios-hero.png" alt="iOS review translation on three iPhone screens" style={IMG} />
                            </div>
                        </FadeIn>

                        <FadeIn delay={80}>
                            <div style={{ marginTop: phone ? 36 : 56 }}>
                                <BracketTag style={{ marginBottom: 16 }}>iOS · Mobile Experience · URBN</BracketTag>
                                <h1 style={{ fontFamily: I, fontWeight: 300, fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: C.ink, margin: 0, maxWidth: 760, textWrap: "balance" }}>
                                    Making Reviews Accessible Across Languages
                                </h1>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 18 }}>
                                    {["Research", "UX/UI", "iOS"].map(tag => (
                                        <span key={tag} style={{ fontFamily: I, fontSize: 11, color: C.muted, backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 40, padding: "4px 10px" }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* Summary: three aligned columns, stacked on phone */}
                        <FadeIn delay={100}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))",
                                columnGap: tablet ? 32 : 48, rowGap: 28,
                                marginTop: phone ? 36 : 48,
                            }}>
                                {[
                                    { k: "Problem", v: "Shoppers could set their app language, but product reviews stayed in English only, so non-English speakers lost one of the most valuable signals for purchase confidence." },
                                    { k: "What I Did", v: "Designed an on-demand translation feature using Apple's Translation API, letting shoppers translate any review and switch back to the original." },
                                    { k: "Impact", v: "Live on iPhone 15 and up for shoppers whose app language differs from their device language." },
                                ].map(({ k, v }) => (
                                    <div key={k}>
                                        <BoldLabel>{k}</BoldLabel>
                                        <p style={{ ...BODY, maxWidth: 340 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{
                                display: "grid", gridTemplateColumns: phone ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
                                columnGap: 32, rowGap: 24, marginTop: phone ? 36 : 48,
                                paddingTop: 24, borderTop: `1px solid ${C.border}`,
                            }}>
                                {([["Role", "UX Designer"], ["Timeline", "Jul – Aug 2025"], ["Tools", "Figma · Confluence · Jira"], ["Team", "Mobile Optimization @URBN"]] as const).map(([k, v]) => (
                                    <div key={k}>
                                        <Label>{k}</Label>
                                        <p style={{ fontFamily: I, fontSize: 14, lineHeight: 1.45, color: C.ink2, margin: 0 }}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ CHALLENGE ════════ */}
                    <section id="challenge" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Challenge" title="Why URBN's global scale created a localization gap"
                                intro="URBN operates Anthropologie, Free People, and Urban Outfitters across international markets, serving millions of shoppers who use the apps in their native language. The apps were built to be multilingual, but one critical surface wasn't: product reviews." />
                            <img src="/slides/ios-ecosystem.png" alt="URBN brands and their international markets" style={IMG} />
                        </FadeIn>

                        <FadeIn>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1fr)",
                                columnGap: 64, rowGap: 32, alignItems: "center",
                                marginTop: sub,
                            }}>
                                <div>
                                    <SubHead title="There was a consistency gap in the global shopping experience" phone={phone} />
                                    <p style={{ ...BODY, color: C.ink3, maxWidth: 460 }}>
                                        Across URBN's mobile apps, users can set their preferred language, and navigation, product details, and system UI all adapt accordingly, except for product reviews, which remained in English only.
                                    </p>
                                    <p style={{ fontFamily: I, fontSize: 15, fontWeight: 500, color: C.ink, lineHeight: 1.5, margin: 0, marginTop: 20, maxWidth: 460 }}>
                                        English-only reviews + global audience = accessibility gap
                                    </p>
                                </div>
                                <figure style={{ margin: 0 }}>
                                    <div style={MAT}>
                                        <img src="/slides/ios-original.png" alt="Spain Urban Outfitters app showing product reviews in English" style={IMG} />
                                    </div>
                                    <Caption>The Spain Urban Outfitters app showing reviews in English, with no way to translate them.</Caption>
                                </figure>
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <div style={{ marginTop: sub, maxWidth: 720 }}>
                                <SubHead title="Leading to friction points like" phone={phone} />
                                <div style={{ marginTop: 16 }}>
                                    <Rows numbered items={[
                                        "The experience felt inconsistent with the rest of the app",
                                        "Users struggled to understand fit & quality from English reviews",
                                        "Confidence during purchase decisions was reduced",
                                        "Reviews were inaccessible to non-English speakers",
                                    ]} />
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ RESEARCH ════════ */}
                    <section id="research" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Research" title="Reviews are decision tools, not just content"
                                intro="In e-commerce, product reviews directly shape whether a shopper buys or bounces. They answer the questions a product page can't, and they only work if users can actually read them." />
                        </FadeIn>

                        <FadeIn>
                            {/* What reviews do for shoppers, as a three-column list with hairlines */}
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))", columnGap: 40 }}>
                                {[
                                    { title: "Validate quality", body: "Reviews confirm that a product lives up to its listing, or reveal when it doesn't." },
                                    { title: "Learn from others", body: "Real customer experiences surface fit issues, hidden features, and honest caveats." },
                                    { title: "Understand fit & sizing", body: "The most-read part of any review, and especially critical for international shoppers." },
                                ].map((b) => (
                                    <div key={b.title} style={{ borderTop: `1px solid ${C.border}`, padding: "20px 0 28px" }}>
                                        <p style={{ fontFamily: I, fontSize: 16, fontWeight: 500, color: C.ink, margin: 0, marginBottom: 6 }}>{b.title}</p>
                                        <p style={{ ...BODY, color: C.ink3 }}>{b.body}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))", columnGap: 40, rowGap: 32, marginTop: phone ? 48 : 64 }}>
                                {[
                                    { to: 74, suffix: "%", label: "of consumers expect seamless cross-language shopping" },
                                    { to: 66, suffix: "%", label: "say poor mobile UX negatively affects brand credibility" },
                                    { to: 3, suffix: "x", label: "more likely to abandon when reviews are in a foreign language" },
                                ].map((m) => (
                                    <div key={m.label}>
                                        <p style={{ fontFamily: I, fontSize: phone ? 48 : 56, fontWeight: 200, color: C.ink, letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}><CountUp to={m.to} suffix={m.suffix} /></p>
                                        <p style={{ fontFamily: I, fontSize: 14, color: C.ink3, lineHeight: 1.55, margin: 0, marginTop: 12, maxWidth: 260 }}>{m.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: phone ? 48 : 64, paddingTop: 28, borderTop: `1px solid ${C.border}`, maxWidth: 720 }}>
                                <Label>Key insight: accessibility gap</Label>
                                <p style={{ fontFamily: I, fontSize: phone ? 19 : 22, fontWeight: 300, color: C.ink, lineHeight: 1.45, letterSpacing: "-0.01em", margin: 0 }}>
                                    Without access to reviews in their language, users lose one of the most valuable signals for purchase confidence, which increases hesitation and drop-off.
                                </p>
                            </div>
                        </FadeIn>

                        {/* Exploration process */}
                        <FadeIn>
                            <div style={{ marginTop: sub }}>
                                <SubHead title="From ambiguity to architecture" phone={phone} />
                                <p style={{ ...BODY, color: C.ink3, maxWidth: MEASURE, marginBottom: phone ? 32 : 40 }}>
                                    Before any UI was designed, the problem was mapped: scoping the ticket, surfacing open questions, and charting every possible translation path to find the right one. The three paths became low-fidelity concepts discussed in design critiques with Senior Designers and Product partners, allowing the team to validate assumptions and refine the direction.
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))", columnGap: 24, rowGap: 40 }}>
                                    <Artifact src={ARTIFACTS.ticketInfo} index="01" title="Ticket Brief" frame="4 / 3" caption="Original Jira ticket defining scope, acceptance criteria, and the questions that needed answering before design could begin." />
                                    <Artifact src={ARTIFACTS.randomThoughts} index="02" title="Early Thinking" frame="4 / 3" caption="Unfiltered sticky-note brainstorm: auto-translate logic, edge cases, CTA placement, and open questions about language detection." />
                                    <div style={{ gridColumn: phone ? undefined : "1 / -1" }}>
                                        <Artifact src={ARTIFACTS.translationPath} index="03" title="Path Possibilities" caption="Three translation paths explored: auto-translate, translate-all, and per-review. Each came with different performance and UX trade-offs." />
                                    </div>
                                    <Artifact src={ARTIFACTS.workflowV1} index="04" title="Workflow v1" frame="4 / 3" caption="First decision tree, mapping where review text lives in the app and whether auto-translate or user-triggered made more sense." />
                                    <Artifact src={ARTIFACTS.workflowV2} index="05" title="Workflow v2" frame="4 / 3" caption="Refined flow that landed on user-controlled translation with a global toggle and per-review 'show original' CTAs." />
                                    <Artifact src={ARTIFACTS.messaging} index="06" title="Copy Exploration" caption="Micro-copy decisions for auto-translate banners and individual review CTAs, mapped against BV restriction logic." />
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ DESIGN DECISIONS ════════ */}
                    <section id="decisions" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Design Decisions" title="Designing within constraints to build the right solution"
                                intro="Every design decision in this project started with a real technical constraint. Rather than designing around them, I let them shape the strategy, from how translation is triggered to what the UI communicates." />
                        </FadeIn>

                        <FadeIn>
                            {/* Constraints and the principles they produced, side by side */}
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))", columnGap: 56, rowGap: 40 }}>
                                <div>
                                    <BoldLabel>Constraints</BoldLabel>
                                    {[
                                        { t: "Performance Limits", b: "Auto-translating large volumes at load would impact page speed significantly." },
                                        { t: "No Bulk Translation", b: "Reviews could not be translated all at once, only individual items on demand." },
                                        { t: "iOS 18+ Only", b: "Apple's Translation API is exclusive to devices running iOS 18 or later." },
                                    ].map((c) => (
                                        <div key={c.t} style={{ borderTop: `1px solid ${C.border}`, padding: "14px 0" }}>
                                            <p style={{ fontFamily: I, fontSize: 15, fontWeight: 500, color: C.ink, margin: 0, marginBottom: 4 }}>{c.t}</p>
                                            <p style={{ ...BODY, color: C.ink3, fontSize: 14 }}>{c.b}</p>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <BoldLabel>Principles</BoldLabel>
                                    {[
                                        { t: "User Control", b: "Allow users to choose when to translate, rather than forcing automatic language changes." },
                                        { t: "System Efficiency", b: "Leverage Apple's native translation capabilities without introducing performance overhead." },
                                        { t: "Seamless Integration", b: "Ensure the feature feels like a natural extension of the existing review UI, not a bolt-on." },
                                    ].map((c) => (
                                        <div key={c.t} style={{ borderTop: `1px solid ${C.border}`, padding: "14px 0" }}>
                                            <p style={{ fontFamily: I, fontSize: 15, fontWeight: 500, color: C.ink, margin: 0, marginBottom: 4 }}>{c.t}</p>
                                            <p style={{ ...BODY, color: C.ink3, fontSize: 14 }}>{c.b}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        <div style={{ display: "flex", flexDirection: "column", gap: phone ? 104 : 168, marginTop: phone ? 96 : 144 }}>
                            {DECISIONS.map((d) => (
                                <FadeIn key={d.num} distance={12} duration={450} threshold={0.15}>
                                    <DecisionBlock d={d} phone={phone} />
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* ════════ FINAL SOLUTION ════════ */}
                    <section id="solution" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Final Solution" title="See how it works in practice"
                                intro="Three states of the feature: the untranslated review, a single-tap translation, and the full list view with translation available on every review." />
                        </FadeIn>

                        <FadeIn distance={12} duration={450}>
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))", columnGap: tablet ? 24 : 40, rowGap: 56 }}>
                                {[
                                    { src: "/slides/ios-og.png", label: "Original State", num: "01", desc: "The review appears in English only, with no translation option visible to Spanish-speaking users." },
                                    { src: "/slides/ios-translated.png", label: "After Translation", num: "02", desc: "One tap translates the review inline, and the user sees 'Ver original' to switch back." },
                                    { src: "/slides/ios-discovery.png", label: "Review List View", num: "03", desc: "Translation CTAs appear across all reviews, giving users full control over every review on the page." },
                                ].map((st) => (
                                    <figure key={st.label} style={{ margin: 0, display: "flex", flexDirection: "column" }}>
                                        {/* Heading and explanation above the screen they describe */}
                                        <figcaption style={{ marginBottom: 20, minHeight: phone ? undefined : 124 }}>
                                            <Num>{st.num}</Num>
                                            <h4 style={{ fontFamily: I, fontSize: 18, fontWeight: 400, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.35, margin: 0, marginTop: 6, marginBottom: 6 }}>{st.label}</h4>
                                            <p style={{ fontFamily: I, fontSize: 14, color: C.ink3, lineHeight: 1.55, margin: 0 }}>{st.desc}</p>
                                        </figcaption>
                                        <div style={{ ...MAT, padding: phone ? 20 : 24, maxWidth: phone ? 300 : undefined }}>
                                            <img src={st.src} alt={`${st.label}: ${st.desc}`} style={IMG} />
                                        </div>
                                    </figure>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ RESULTS ════════ */}
                    <section id="results" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Results" title="Closing the accessibility gap for millions of global shoppers"
                                intro="By aligning platform capabilities with user needs, the feature strengthens trust at one of the most critical moments in the shopping journey." />
                        </FadeIn>
                        <FadeIn>
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1fr)", columnGap: 64, rowGap: 40, alignItems: "start" }}>
                                <Rows numbered items={[
                                    "Improved accessibility for international shoppers",
                                    "Increased clarity around product fit and quality",
                                    "More consistent language experience across the app",
                                    "Greater purchase confidence for non-English speakers",
                                ]} />
                                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                                    <BoldLabel>Live</BoldLabel>
                                    <p style={BODY}>This feature is currently live across iPhone 15 and up for users whose app language is set to a different language than their device language.</p>
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ LEARNINGS ════════ */}
                    <section id="learnings" style={{ scrollMarginTop: 96, marginTop: sectionGap }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Learnings" title="Constraint-driven design is still good design" />
                            <p style={{ fontFamily: I, fontSize: 16, lineHeight: 1.7, color: C.ink3, maxWidth: MEASURE, margin: 0, marginTop: phone ? -16 : -24 }}>
                                This project reinforced that the best design decisions often emerge from working within limits. iOS 18-only support and the no-bulk-translation constraint weren't obstacles. They defined the user experience. By leaning into on-demand, user-triggered translation, I delivered a solution that felt native and intentional, not bolted-on. The constraint became the strategy.
                            </p>
                        </FadeIn>
                    </section>

                    {/* Back to work */}
                    <div style={{ paddingTop: 40, marginTop: phone ? 80 : 120, borderTop: `1px solid ${C.border}` }}>
                        <a href="/#work"
                            style={{ fontFamily: I, fontSize: 14, color: C.ink3, textDecoration: "none", minHeight: 44, display: "inline-flex", alignItems: "center", transition: "color 0.18s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = C.ink3)}
                        >
                            ← Back to work
                        </a>
                    </div>

                </main>
            </div>
        </div>
    )
}
