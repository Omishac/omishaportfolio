"use client"

import React, { useState, useEffect, useRef } from "react"
import SharedNav from "../../components/SharedNav"
import { TypingBubble } from "../../components/TypingBubble"
import { FONT_SANS, COLORS, EASE_SPRING, useReducedMotion, BracketTag } from "../../components/site"

// Same tokens and patterns as the URBN filter case study: Inter only, neutral palette.
const I = FONT_SANS
const C = COLORS

const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "challenge", label: "Challenge" },
    { id: "research", label: "Research" },
    { id: "exploration", label: "Exploration" },
    { id: "decisions", label: "Design Decisions" },
    { id: "solution", label: "Final Solution" },
    { id: "results", label: "Results" },
    { id: "learnings", label: "Learnings" },
]

const MEASURE = 620 // comfortable line length for paragraphs

// One spacing scale for the whole page:
//   item     label → text, heading → text (6–12px, inline)
//   head     section heading → its content
//   group    between content groups inside a section
//   section  between sections
function useSpacing(phone: boolean, tablet: boolean) {
    return {
        head: phone ? 32 : 40,
        group: phone ? 56 : tablet ? 64 : 80,
        section: phone ? 96 : tablet ? 128 : 152,
        decision: phone ? 72 : 104, // between design decisions
    }
}

// Single-device screens share one width so they read at the same scale.
const PHONE_W = 280

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

// ── Type ────────────────────────────────────────────────────────────────────

function SectionHead({ tag, title, intro, phone, flush = false }: { tag?: string; title: string; intro?: React.ReactNode; phone: boolean; flush?: boolean }) {
    return (
        <div style={{ marginBottom: flush ? 0 : phone ? 32 : 40 }}>
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

// ── Diagrams & annotations ──────────────────────────────────────────────────

const ROSE = "#A4425C" // site accent, used only for callout markers and highlights (≈6:1 on white)
const SMALL: React.CSSProperties = { fontFamily: I, fontSize: 14, lineHeight: 1.5, color: C.ink3, margin: 0 }

// Box = [x0, y0, x1, y1] in % of the image, so callouts scale with it.
// Each note's leader line runs from the box to a numbered marker in the
// gutter on its `side`; the numbered list beside/below carries the text.
type Note = { label: string; box: [number, number, number, number]; side: "left" | "right" }
const GUTTER = 28

function Marker({ n }: { n: number }) {
    return <span style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: ROSE, color: "#fff", fontFamily: I, fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 2px #fff" }}>{n}</span>
}

function AnnotatedShot({ src, alt, notes, maxWidth }: { src: string; alt: string; notes: Note[]; maxWidth: number }) {
    return (
        <div style={{ padding: `0 ${GUTTER}px`, maxWidth: maxWidth + GUTTER * 2, boxSizing: "border-box", width: "100%" }}>
            <div style={{ position: "relative" }}>
                <img src={src} alt={alt} style={IMG} />
                {notes.map(({ box: [x0, y0, x1, y1], side }, i) => {
                    const yc = (y0 + y1) / 2
                    return (
                        <React.Fragment key={i}>
                            <span aria-hidden="true" style={{ position: "absolute", left: `${x0}%`, top: `${y0}%`, width: `${x1 - x0}%`, height: `${y1 - y0}%`, border: `1.5px solid ${ROSE}`, borderRadius: 4, backgroundColor: "rgba(164,66,92,0.06)", boxSizing: "border-box" }} />
                            <span aria-hidden="true" style={{ position: "absolute", top: `${yc}%`, height: 1.5, marginTop: -0.75, backgroundColor: ROSE, ...(side === "right" ? { left: `${x1}%`, right: -(GUTTER - 22) } : { right: `${100 - x0}%`, left: -(GUTTER - 22) }) }} />
                            <span aria-hidden="true" style={{ position: "absolute", top: `${yc}%`, transform: "translateY(-50%)", lineHeight: 0, ...(side === "right" ? { right: -GUTTER } : { left: -GUTTER }) }}>
                                <Marker n={i + 1} />
                            </span>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

function NoteList({ notes, style }: { notes: Note[]; style?: React.CSSProperties }) {
    return (
        <ol style={{ listStyle: "none", padding: 0, margin: 0, ...style }}>
            {notes.map((n, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderTop: `1px solid ${C.border}` }}>
                    <Marker n={i + 1} />
                    <span style={{ ...BODY, fontSize: 14, lineHeight: 1.5, paddingTop: 1 }}>{n.label}</span>
                </li>
            ))}
        </ol>
    )
}

// Challenge: the Spain app, localized everywhere except the reviews
const GAP_NOTES: Note[] = [
    { label: "App UI is in Spanish: headings, buttons and tabs.", box: [7.4, 12.6, 21.6, 17.8], side: "left" },
    { label: "The review itself stays in English.", box: [9, 41.2, 35.6, 50.6], side: "left" },
    { label: "Same in the full review list, with no way to translate.", box: [58.4, 62.8, 92.2, 70.2], side: "right" },
]

// Research: the questions shoppers bring to reviews, typed in like a chat
const SHOPPER_QS = [
    { title: "Validate quality", q: "Does it live up to the listing?", tilt: -1.6 },
    { title: "Learn from other shoppers", q: "How does it hold up in everyday use?", tilt: 1.2 },
    { title: "Understand fit & sizing", q: "Which size should I buy?", tilt: -0.8 },
]

function ShopperQuestions({ cols }: { cols: string }) {
    return (
        <div>
            <p style={{ ...SMALL, fontWeight: 500, color: C.ink, marginBottom: 18 }}>The questions shoppers bring to reviews</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: cols, columnGap: 24, rowGap: 28 }}>
                {SHOPPER_QS.map((b, i) => (
                    <li key={b.title} style={{ display: "flex", flexDirection: "column" }}>
                        {/* One after another, like messages arriving */}
                        <TypingBubble text={b.q} tilt={b.tilt} delay={i * 840} style={{ flex: 1 }} />
                        <p style={{ display: "flex", alignItems: "baseline", gap: 8, fontFamily: I, fontSize: 14, fontWeight: 600, color: C.ink, margin: 0, marginTop: 16, paddingLeft: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: ROSE }}>0{i + 1}</span>
                            {b.title}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

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
    const closeRef = useRef<HTMLButtonElement>(null)
    useEffect(() => { closeRef.current?.focus() }, []) // move keyboard focus into the dialog
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])
    return (
        <div role="dialog" aria-modal="true" aria-label={title} onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(17,17,17,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
            <button ref={closeRef} onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", cursor: "pointer", width: 44, height: 44, color: "rgba(255,255,255,0.8)", fontFamily: I, fontSize: 18 }}>✕</button>
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
    const triggerRef = useRef<HTMLButtonElement>(null)
    // Return focus to the image that opened the dialog
    const close = () => { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()) }
    return (
        <figure style={{ margin: 0 }}>
            {open && <Lightbox src={src} title={title} caption={caption} onClose={close} />}
            <button ref={triggerRef} className="ios-expand" onClick={() => setOpen(true)} aria-label={`View ${title} larger`} style={{ position: "relative", display: "block", width: "100%", padding: 16, border: "none", cursor: "zoom-in", ...MAT }}>
                {/* Visible expand affordance; the whole image is the button */}
                <span aria-hidden="true" className="ios-expand-icon" style={{ position: "absolute", top: 12, right: 12, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.92)", border: `1px solid ${C.border}`, borderRadius: 6, color: C.ink2 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 1.5h4v4M12.5 1.5L8 6M5.5 12.5h-4v-4M1.5 12.5L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
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
        principles: ["User Control", "System Efficiency"],
        summary: "Users choose when to translate, rather than being forced into automatic language changes, and Apple's native translation runs without introducing performance overhead.",
        src: "/slides/ios-discovery.png",
        alt: "Review list: an English review with a \"Translate review to Spanish\" link, and a review below it already translated into Spanish",
        notes: [
            { label: "Each review has a \"Translate\" CTA, so users trigger translation when they need it, not before.", box: [9, 40.8, 52, 44.8], side: "right" },
            { label: "Translation happens one review at a time, in place.", box: [9.4, 70, 92, 85.2], side: "right" },
        ] as Note[],
    },
    {
        num: "02",
        title: "Toggle to Original, With Subtle Feedback",
        principles: ["Seamless Integration"],
        summary: "A natural extension of the existing review UI, not a bolt-on: shoppers always know when they are reading a translation, and the original wording stays one tap away.",
        src: "/slides/ios-translated.png",
        alt: "Translated review showing \"Reseña traducida\" with a \"Ver original\" link",
        notes: [
            { label: "\"Reseña traducida\": a lightweight badge marks the review as translated.", box: [9.2, 56.2, 35.8, 60.4], side: "left" },
            { label: "\"Ver original\": switch back to the original language instantly.", box: [36, 56.2, 54.4, 60.4], side: "right" },
        ] as Note[],
    },
]

function DecisionBlock({ d, phone }: { d: typeof DECISIONS[number]; phone: boolean }) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ minHeight: phone ? undefined : 240, maxWidth: 440 }}>
                <Num>{d.num}</Num>
                <h3 style={{ fontFamily: I, fontSize: phone ? 24 : 26, fontWeight: 300, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0, marginTop: 10, textWrap: "balance" }}>{d.title}</h3>
                <ul aria-label="Principles" style={{ listStyle: "none", padding: 0, margin: 0, marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {d.principles.map((p) => (
                        <li key={p} style={{ fontFamily: I, fontSize: 11, color: ROSE, border: "1px solid rgba(164,66,92,0.24)", borderRadius: 40, padding: "3px 10px" }}>{p}</li>
                    ))}
                </ul>
                <p style={{ ...BODY, marginTop: 14 }}>{d.summary}</p>
            </div>
            <figure style={{ margin: 0, marginTop: 24, width: "100%", maxWidth: PHONE_W + GUTTER * 2 }}>
                {/* Transparent device PNG, no backing container */}
                <AnnotatedShot src={d.src} alt={d.alt} notes={d.notes} maxWidth={PHONE_W} />
                <figcaption style={{ marginTop: 16 }}>
                    <NoteList notes={d.notes} />
                </figcaption>
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

const PAGE_STYLES = `
.ios-expand:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
.ios-expand-icon { transition: background-color 0.2s ease, border-color 0.2s ease; }
.ios-expand:hover .ios-expand-icon, .ios-expand:focus-visible .ios-expand-icon { background-color: #fff; border-color: rgba(0,0,0,0.2); }
`

export default function IOSCaseStudy() {
    const { phone, tablet, desktop, large } = useResponsive()
    const activeSection = useActiveSection(SECTIONS.map(s => s.id))
    const sp = useSpacing(phone, tablet)
    const px = phone ? 20 : tablet ? 40 : large ? 120 : 80
    const contentMax = large ? 1120 : 960

    const twoCol = phone ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))"
    const threeCol = phone ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))"

    return (
        <div style={{ width: "100%", backgroundColor: C.bg }}>
            <SharedNav />
            <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
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
                        {/* Header image shows straight away (no fade-in wait) and is fetched first */}
                        <div style={MAT}>
                            <img src="/slides/ios-hero.webp" alt="iOS review translation on three iPhone screens" width={1536} height={1024} loading="eager" decoding="async" fetchPriority="high" style={IMG} />
                        </div>

                        <FadeIn delay={80}>
                            <div style={{ marginTop: sp.head }}>
                                <BracketTag style={{ marginBottom: 14 }}>iOS · Mobile Experience · URBN</BracketTag>
                                <h1 style={{ fontFamily: I, fontWeight: 300, fontSize: "clamp(34px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: C.ink, margin: 0, maxWidth: 760, textWrap: "balance" }}>
                                    Making Reviews Accessible Across Languages
                                </h1>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
                                    {["Research", "UX/UI", "iOS"].map(tag => (
                                        <span key={tag} style={{ fontFamily: I, fontSize: 11, color: C.muted, backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 40, padding: "4px 10px" }}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* Summary: three aligned columns, stacked on phone */}
                        <FadeIn delay={100}>
                            <div style={{ display: "grid", gridTemplateColumns: threeCol, columnGap: tablet ? 32 : 48, rowGap: 28, marginTop: sp.head }}>
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
                                columnGap: 32, rowGap: 24, marginTop: sp.head,
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
                    <section id="challenge" style={{ scrollMarginTop: 96, marginTop: sp.section }}>
                        {/* Context: text left, map right, vertically centred */}
                        <FadeIn>
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1.1fr) minmax(0, 1fr)", columnGap: 56, rowGap: 28, alignItems: "center" }}>
                                <SectionHead flush phone={phone} tag="Challenge" title="Why URBN's global scale created a localization gap"
                                    intro="URBN operates Anthropologie, Free People, and Urban Outfitters across international markets, serving millions of shoppers who use the apps in their native language. The apps were built to be multilingual, but one critical surface wasn't: product reviews." />
                                <img src="/slides/ios-ecosystem.webp" alt="URBN brands and their international markets" style={{ ...IMG, maxWidth: phone ? 360 : 420, justifySelf: phone ? "start" : "end" }} />
                            </div>
                        </FadeIn>

                        {/* The gap: explanation, then the equation as the focal point, then the evidence */}
                        <FadeIn>
                            <div style={{ marginTop: sp.group }}>
                                <SubHead title="There was a consistency gap in the global shopping experience" phone={phone} />
                                <p style={{ ...BODY, color: C.ink3, maxWidth: MEASURE }}>
                                    Across URBN's mobile apps, users can set their preferred language, and navigation, product details, and system UI all adapt accordingly, except for product reviews, which remained in English only.
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn>
                            <div style={{ marginTop: phone ? 40 : 56, padding: phone ? "32px 0" : "44px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>
                                <p style={{ fontFamily: I, fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.35, color: C.ink, margin: 0, textWrap: "balance" }}>
                                    English-only reviews <span style={{ color: C.muted }}>+</span> global audience <span style={{ color: C.muted }}>=</span> <span style={{ fontWeight: 600 }}>accessibility gap</span>
                                </p>
                            </div>
                            <figure style={{ margin: 0, marginTop: phone ? 40 : 56, display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1.25fr) minmax(0, 1fr)", columnGap: 48, rowGap: 20, alignItems: "center" }}>
                                {/* Transparent PNG with two devices; no backing container */}
                                <AnnotatedShot src="/slides/ios-original.webp" alt="Spain Urban Outfitters app: Spanish interface, product reviews in English" notes={GAP_NOTES} maxWidth={560} />
                                <figcaption>
                                    <p style={{ ...SMALL, marginBottom: 12 }}>The Spain Urban Outfitters app showing reviews in English, with no way to translate them.</p>
                                    <NoteList notes={GAP_NOTES} />
                                </figcaption>
                            </figure>
                        </FadeIn>

                        {/* Friction points: concise items, bold heading + one line */}
                        <FadeIn>
                            <div style={{ marginTop: sp.group }}>
                                <SubHead title="Leading to friction points like" phone={phone} />
                                <div style={{ display: "grid", gridTemplateColumns: twoCol, columnGap: 48, marginTop: 16 }}>
                                    {[
                                        { h: "UX consistency", t: "The experience felt inconsistent with the rest of the app." },
                                        { h: "Fit & quality", t: "Users struggled to understand fit & quality from English reviews." },
                                        { h: "Purchase confidence", t: "Confidence during purchase decisions was reduced." },
                                        { h: "Language access", t: "Reviews were inaccessible to non-English speakers." },
                                    ].map((f, i) => (
                                        <div key={f.h} style={{ display: "flex", gap: 14, borderTop: `1px solid ${C.border}`, padding: "16px 0 20px" }}>
                                            <span style={{ fontFamily: I, fontSize: 11, color: C.muted, letterSpacing: "0.06em", width: 18, flexShrink: 0, paddingTop: 3 }}>0{i + 1}</span>
                                            <div>
                                                <p style={{ fontFamily: I, fontSize: 15, fontWeight: 600, color: C.ink, lineHeight: 1.4, margin: 0, marginBottom: 4 }}>{f.h}</p>
                                                <p style={{ ...BODY, color: C.ink3 }}>{f.t}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ RESEARCH ════════ */}
                    <section id="research" style={{ scrollMarginTop: 96, marginTop: sp.section }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Research" title="Reviews are decision tools, not just content"
                                intro="In e-commerce, product reviews directly shape whether a shopper buys or bounces. They answer the questions a product page can't, and they only work if users can actually read them." />
                        </FadeIn>

                        {/* Group 1: what reviews do, as the questions shoppers bring to them */}
                        <ShopperQuestions cols={threeCol} />

                        {/* Group 2: the insight */}
                        <FadeIn>
                            <div style={{ marginTop: sp.group, paddingTop: 24, borderTop: `1px solid ${C.border}`, maxWidth: 720 }}>
                                <Label>Key insight: accessibility gap</Label>
                                <p style={{ fontFamily: I, fontSize: phone ? 19 : 22, fontWeight: 300, color: C.ink, lineHeight: 1.45, letterSpacing: "-0.01em", margin: 0 }}>
                                    Without access to reviews in their language, users lose one of the most valuable signals for purchase confidence, which increases hesitation and drop-off.
                                </p>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ EXPLORATION ════════ */}
                    <section id="exploration" style={{ scrollMarginTop: 96, marginTop: sp.section }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Exploration" title="From ambiguity to architecture"
                                intro="Before any UI was designed, the problem was mapped: scoping the ticket, surfacing open questions, and charting every possible translation path to find the right one. The three paths became low-fidelity concepts discussed in design critiques with Senior Designers and Product partners, allowing the team to validate assumptions and refine the direction." />
                        </FadeIn>
                        <FadeIn>
                            {/* Brief and early thinking, then the paths in full, then the three refinements */}
                            <div style={{ display: "grid", gridTemplateColumns: twoCol, columnGap: 24, rowGap: 40 }}>
                                <Artifact src={ARTIFACTS.ticketInfo} index="01" title="Ticket Brief" frame="4 / 3" caption="Original Jira ticket defining scope, acceptance criteria, and the questions that needed answering before design could begin." />
                                <Artifact src={ARTIFACTS.randomThoughts} index="02" title="Early Thinking" frame="4 / 3" caption="Unfiltered sticky-note brainstorm: auto-translate logic, edge cases, CTA placement, and open questions about language detection." />
                            </div>
                            <div style={{ marginTop: 40 }}>
                                <Artifact src={ARTIFACTS.translationPath} index="03" title="Path Possibilities" caption="Three translation paths explored: auto-translate, translate-all, and per-review. Each came with different performance and UX trade-offs." />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: threeCol, columnGap: tablet ? 16 : 24, rowGap: 40, marginTop: 40 }}>
                                <Artifact src={ARTIFACTS.workflowV1} index="04" title="Workflow v1" frame="4 / 3" caption="First decision tree, mapping where review text lives in the app and whether auto-translate or user-triggered made more sense." />
                                <Artifact src={ARTIFACTS.workflowV2} index="05" title="Workflow v2" frame="4 / 3" caption="Refined flow that landed on user-controlled translation with a global toggle and per-review 'show original' CTAs." />
                                <Artifact src={ARTIFACTS.messaging} index="06" title="Copy Exploration" frame="4 / 3" caption="Micro-copy decisions for auto-translate banners and individual review CTAs, mapped against BV restriction logic." />
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ DESIGN DECISIONS ════════ */}
                    <section id="decisions" style={{ scrollMarginTop: 96, marginTop: sp.section }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Design Decisions" title="Designing within constraints to build the right solution"
                                intro="Every design decision in this project started with a real technical constraint. Rather than designing around them, I let them shape the strategy, from how translation is triggered to what the UI communicates." />
                        </FadeIn>

                        <FadeIn>
                            {/* Constraints informed the principles: arrow right on desktop, down on phone */}
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1fr) auto minmax(0, 1fr)", columnGap: 28, rowGap: 16, alignItems: "center" }}>
                                {[
                                    { label: "Constraints", items: [
                                        { t: "Performance Limits", b: "Auto-translating large volumes at load would impact page speed significantly." },
                                        { t: "No Bulk Translation", b: "Reviews could not be translated all at once, only individual items on demand." },
                                        { t: "iOS 18+ Only", b: "Apple's Translation API is exclusive to devices running iOS 18 or later." },
                                    ] },
                                    null,
                                    { label: "Principles", items: [
                                        { t: "User Control", b: "Allow users to choose when to translate, rather than forcing automatic language changes." },
                                        { t: "System Efficiency", b: "Leverage Apple's native translation capabilities without introducing performance overhead." },
                                        { t: "Seamless Integration", b: "Ensure the feature feels like a natural extension of the existing review UI, not a bolt-on." },
                                    ] },
                                ].map((col, ci) => col === null ? (
                                    <div key="arrow" aria-hidden="true" style={{ display: "flex", justifyContent: "center", color: C.muted }}>
                                        <svg width="28" height="14" viewBox="0 0 28 14" fill="none" style={{ transform: phone ? "rotate(90deg)" : "none" }}>
                                            <path d="M1 7h25M20 1.5L26 7l-6 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div key={ci} style={{ alignSelf: "start" }}>
                                        <BoldLabel>{col.label}</BoldLabel>
                                        {col.items.map((c) => (
                                            <div key={c.t} style={{ borderTop: `1px solid ${C.border}`, padding: "12px 0" }}>
                                                <p style={{ fontFamily: I, fontSize: 15, fontWeight: 500, color: C.ink, margin: 0, marginBottom: 4 }}>{c.t}</p>
                                                <p style={{ ...BODY, color: C.ink3, fontSize: 14 }}>{c.b}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <div style={{ display: "grid", gridTemplateColumns: twoCol, columnGap: tablet ? 32 : 56, rowGap: sp.decision, marginTop: sp.group }}>
                            {DECISIONS.map((d) => (
                                <FadeIn key={d.num} distance={12} duration={450} threshold={0.15}>
                                    <DecisionBlock d={d} phone={phone} />
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* ════════ FINAL SOLUTION ════════ */}
                    <section id="solution" style={{ scrollMarginTop: 96, marginTop: sp.section }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Final Solution" title="See how it works in practice"
                                intro="Three states of the feature: the untranslated review, a single-tap translation, and the full list view with translation available on every review." />
                        </FadeIn>

                        <FadeIn distance={12} duration={450}>
                            {/* Each state: heading and explanation directly above its screen */}
                            <div style={{ display: "grid", gridTemplateColumns: threeCol, columnGap: tablet ? 24 : 40, rowGap: 56 }}>
                                {[
                                    { src: "/slides/ios-og.png", label: "Original State", num: "01", desc: "The review appears in English only, with no translation option visible to Spanish-speaking users." },
                                    { src: "/slides/ios-translated.png", label: "After Translation", num: "02", desc: "One tap translates the review inline, and the user sees 'Ver original' to switch back." },
                                    { src: "/slides/ios-discovery.png", label: "Review List View", num: "03", desc: "Translation CTAs appear across all reviews, giving users full control over every review on the page." },
                                ].map((st) => (
                                    <figure key={st.label} style={{ margin: 0 }}>
                                        <figcaption style={{ marginBottom: 20, minHeight: phone ? undefined : tablet ? 150 : 124 }}>
                                            <Num>{st.num}</Num>
                                            <h4 style={{ fontFamily: I, fontSize: 18, fontWeight: 400, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.35, margin: 0, marginTop: 6, marginBottom: 6 }}>{st.label}</h4>
                                            <p style={{ fontFamily: I, fontSize: 14, color: C.ink3, lineHeight: 1.55, margin: 0 }}>{st.desc}</p>
                                        </figcaption>
                                        <img src={st.src} alt={`${st.label}: ${st.desc}`} style={{ ...IMG, maxWidth: PHONE_W }} />
                                    </figure>
                                ))}
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ RESULTS ════════ */}
                    <section id="results" style={{ scrollMarginTop: 96, marginTop: sp.section }}>
                        <FadeIn>
                            <SectionHead phone={phone} tag="Results" title="Closing the accessibility gap for millions of global shoppers"
                                intro="By aligning platform capabilities with user needs, the feature strengthens trust at one of the most critical moments in the shopping journey." />
                        </FadeIn>
                        <FadeIn>
                            <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1.2fr) minmax(0, 1fr)", columnGap: 56, rowGap: 32, alignItems: "start" }}>
                                <Rows numbered items={[
                                    "Improved accessibility for international shoppers",
                                    "Increased clarity around product fit and quality",
                                    "More consistent language experience across the app",
                                    "Greater purchase confidence for non-English speakers",
                                ]} />
                                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                                    <BoldLabel>Live</BoldLabel>
                                    <p style={BODY}>This feature is currently live across iPhone 15 and up for users whose app language is set to a different language than their device language.</p>
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* ════════ LEARNINGS ════════ */}
                    <section id="learnings" style={{ scrollMarginTop: 96, marginTop: sp.section }}>
                        <FadeIn>
                            <SectionHead flush phone={phone} tag="Learnings" title="Constraint-driven design is still good design"
                                intro="This project reinforced that the best design decisions often emerge from working within limits. iOS 18-only support and the no-bulk-translation constraint weren't obstacles. They defined the user experience. By leaning into on-demand, user-triggered translation, I delivered a solution that felt native and intentional, not bolted-on. The constraint became the strategy." />
                        </FadeIn>
                    </section>

                    {/* Back to work */}
                    <div style={{ paddingTop: 32, marginTop: phone ? 80 : 112, borderTop: `1px solid ${C.border}` }}>
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
