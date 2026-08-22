"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import SharedNav from "../components/SharedNav"

const CURSOR_STYLES = `
  @keyframes hi-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes hi-wiggle {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-4deg); }
    40% { transform: rotate(4deg); }
    60% { transform: rotate(-3deg); }
    80% { transform: rotate(3deg); }
  }
  @keyframes hi-pop {
    0% { transform: scale(1); }
    40% { transform: scale(1.08); }
    65% { transform: scale(0.96); }
    100% { transform: scale(1); }
  }
  @keyframes bubble-rise {
    0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
    100% { transform: translate(var(--bx), -60px) scale(0.3); opacity: 0; }
  }
  @keyframes illust-float {
    0%, 100% { transform: translateY(0px); }
    40%       { transform: translateY(-5px); }
    70%       { transform: translateY(-3px); }
  }
  @keyframes clip-in {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0% 0 0); }
  }
  html { scroll-behavior: smooth; }
  /* overflow-x: clip, not hidden — hidden without an explicit overflow-y
     forces overflow-y: auto (CSS overflow computed-value fixup), which
     turns body into a scroll container that never actually scrolls
     (the document element does), so any position: sticky descendant like
     SharedNav resolves against that inert scrollport and never sticks.
     clip prevents the horizontal bleed without establishing one. */
  html, body { max-width: 100%; overflow-x: clip; }
  .logo-img {
    transition: opacity 0.35s ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .logo-img:hover { opacity: 0.7; }
  }
  .footer-icon {
    transition: transform 0.25s ease;
  }
  @media (hover: hover) and (pointer: fine) {
    .footer-icon:hover { transform: scale(1.1); }
  }
`

const I = "Inter, system-ui, sans-serif"
const Z = "Zodiak, 'Times New Roman', serif"
const YB = "var(--font-yuji-boku), serif"

const C = {
    ink: "#111111",
    ink2: "#3A3A3A",
    ink3: "#6B6B6B",
    muted: "#9A9A9A",
    border: "rgba(0,0,0,0.08)",
    bg: "#FFFFFF",
}

const EASE_SPRING = "cubic-bezier(0.22,1,0.36,1)"
const EASE_OUT    = "cubic-bezier(0.23,1,0.32,1)"

function useReducedMotion() {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReduced(mq.matches)
        const h = (e: MediaQueryListEvent) => setReduced(e.matches)
        mq.addEventListener("change", h)
        return () => mq.removeEventListener("change", h)
    }, [])
    return reduced
}

function useFinePointer() {
    const [fine, setFine] = useState(true)
    useEffect(() => {
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
        setFine(mq.matches)
        const h = (e: MediaQueryListEvent) => setFine(e.matches)
        mq.addEventListener("change", h)
        return () => mq.removeEventListener("change", h)
    }, [])
    return fine
}

// Smooths a raw scroll-derived value (0-1 progress, degrees, px — whatever)
// by chasing it each frame instead of snapping to it, so scroll-linked
// transforms trail the scroll position like inertial/smooth-scroll sites
// instead of updating in lockstep with it. Under reduced motion, the same
// loop converges in a single frame (factor 1) instead of gradually — it
// must stay the same continuous loop rather than a one-time snap, since
// callers often set their raw target in a later effect (e.g. to 1 once
// reducedMotion is known), which a one-time snap at mount would miss.
function useLerp(target: number, reducedMotion: boolean, factor: number = 0.12) {
    const [value, setValue] = useState(target)
    const current = useRef(target)
    const targetRef = useRef(target)
    const raf = useRef(0)
    targetRef.current = target
    const effectiveFactor = reducedMotion ? 1 : factor

    useEffect(() => {
        // Runs once and keeps ticking every frame, reading targetRef.current
        // fresh each time — decoupled from target updates so a fast-firing
        // scroll listener can't restart (and starve) the loop.
        const tick = () => {
            const diff = targetRef.current - current.current
            if (Math.abs(diff) > 0.0008) {
                current.current += diff * effectiveFactor
                setValue(current.current)
            } else if (current.current !== targetRef.current) {
                current.current = targetRef.current
                setValue(current.current)
            }
            raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf.current)
    }, [effectiveFactor])

    return value
}

function useBP() {
    const ref = useRef<HTMLDivElement>(null)
    const [w, setW] = useState(1280)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
        ro.observe(el)
        setW(el.getBoundingClientRect().width)
        return () => ro.disconnect()
    }, [])

    const phone = w < 768
    const tablet = w >= 768 && w < 1024
    const desktop = w >= 1024 && w <= 1440
    const large = w > 1440

    const px = phone ? 20 : tablet ? 40 : large ? 120 : 80
    const maxW = large ? 1280 : 1040

    const sp = {
        sectionGap: phone ? 64 : tablet ? 96 : 120,
        headerGap: phone ? 24 : tablet ? 40 : 56,
        cardRowGap: phone ? 20 : tablet ? 28 : 36,
        cardColGap: phone ? 0 : tablet ? 20 : 24,
        heroTop: phone ? 40 : tablet ? 64 : 96,
        heroBottom: phone ? 64 : tablet ? 100 : 120,
        colOffset: tablet ? 0 : 80,
    }

    return { ref, w, phone, tablet, desktop, large, px, maxW, sp }
}



function Hero({
    phone,
    tablet,
    large,
    px,
    maxW,
    sp,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
    sp: ReturnType<typeof useBP>["sp"]
}) {
    const [revealed, setRevealed] = useState(false)
    const [scrollY, setScrollY]   = useState(0)
    const reducedMotion            = useReducedMotion()

    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 80)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        if (reducedMotion) { setScrollY(0); return }
        const onScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [reducedMotion])

    const textParallax = reducedMotion ? 0 : -scrollY * 0.18
    const heroFade = reducedMotion ? 1 : Math.max(0, 1 - scrollY / 500)
    const heroScale = reducedMotion ? 1 : Math.max(0.85, 1 - scrollY / 3200)

    const enter = (delayMs: number) => ({
        opacity:    revealed ? 1 : 0,
        transform:  `translateY(${revealed ? 0 : 16}px)`,
        transition: reducedMotion
            ? "none"
            : `opacity 0.6s ${EASE_SPRING} ${delayMs}ms, transform 0.6s ${EASE_SPRING} ${delayMs}ms`,
    })

    const illustEnter = (delayMs: number) => ({
        opacity:    revealed ? 1 : 0,
        transition: reducedMotion ? "none" : `opacity 0.7s ${EASE_SPRING} ${delayMs}ms`,
    })

    // Figma: Inter Black, 74.622px at 1440px, color #303432, normal line-height
    const headSize = phone
        ? "clamp(32px, 9vw, 46px)"
        : tablet
            ? "clamp(42px, 6vw, 58px)"
            : large
                ? "clamp(68px, 5.2vw, 82px)"
                : "clamp(52px, 5.2vw, 75px)"

    // illustration widths (px), matched to Figma node-id 41:2 by asset aspect ratio:
    // image 10.svg (111:69) = laptop+face, above headline
    // image 9.svg  (63:69)  = writing character, beside "digital analyst,"
    // image 8-1.svg (115:105) = shouting character, beside "brand storyteller."
    // image 8.svg  (27:31)  = jumping character, above the CTA arrow
    const illW = {
        laptop: phone ? 62 : tablet ? 76 : large ? 104 : 88,
        write:  phone ? 44 : tablet ? 56 : large ? 80 : 68,
        shout:  phone ? 70 : tablet ? 88 : large ? 124 : 104,
        jump:   phone ? 20 : tablet ? 24 : 28,
    }

    // SharedNav is `position: sticky` and sits in normal flow above this section,
    // so the section itself must be shorter than 100svh by the nav's height —
    // otherwise the centered headline and the bottom-pinned CTA both drift
    // below the visible viewport instead of centering/anchoring within it.
    const navH = phone ? 54 : 64

    return (
        <section
            style={{
                position: "relative",
                width: "100%",
                minHeight: `calc(100svh - ${navH}px)`,
                boxSizing: "border-box",
                backgroundColor: C.bg,
                overflow: "hidden",
            }}
        >
            {/* ── Centered headline block ── */}
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: `translate(-50%, calc(-50% + ${textParallax}px)) scale(${heroScale})`,
                    opacity: heroFade,
                    willChange: "transform, opacity",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: `calc(100% - ${px * 2}px)`,
                    maxWidth: maxW,
                }}
            >
                {/* Laptop+face — centered above headline, natural flex child */}
                <img
                    src="/images/image 10.svg"
                    alt=""
                    aria-hidden="true"
                    style={{
                        width: illW.laptop,
                        height: "auto",
                        display: "block",
                        marginBottom: phone ? 8 : 12,
                        ...illustEnter(160),
                        animation: reducedMotion ? "none" : "illust-float 6s ease-in-out infinite 0.4s",
                    }}
                />

                <h1
                    style={{
                        position: "relative",
                        fontFamily: I,
                        fontWeight: 900,
                        fontSize: headSize,
                        lineHeight: "normal",
                        letterSpacing: "normal",
                        color: "#303432",
                        margin: 0,
                        textAlign: "center",
                    }}
                >
                    {/* Writing character — left beside "digital analyst,"
                        left: calc(6% - write_width) puts right edge near start of "digital analyst,"
                        (the 6% accounts for "digital analyst," being narrower than "brand storyteller." and centered) */}
                    <span
                        style={{
                            position: "absolute",
                            top: "1.3em",
                            left: `calc(6% - ${illW.write}px)`,
                            width: illW.write,
                            display: "block",
                            pointerEvents: "none",
                            ...illustEnter(320),
                            animation: reducedMotion ? "none" : "illust-float 7s ease-in-out infinite 1.1s",
                        }}
                    >
                        <img src="/images/image 9.svg" alt="" aria-hidden="true"
                            style={{ width: "100%", height: "auto", display: "block" }} />
                    </span>

                    {/* Shouting character — right beside "brand storyteller."
                        left: calc(100% + 5px) puts left edge just past h1 right = end of "brand storyteller." */}
                    <span
                        style={{
                            position: "absolute",
                            top: "2.2em",
                            left: "calc(100% + 5px)",
                            width: illW.shout,
                            display: "block",
                            pointerEvents: "none",
                            ...illustEnter(480),
                            animation: reducedMotion ? "none" : "illust-float 5.5s ease-in-out infinite 0s",
                        }}
                    >
                        <img src="/images/image 8-1.svg" alt="" aria-hidden="true"
                            style={{ width: "100%", height: "auto", display: "block" }} />
                    </span>

                    {[
                        { text: "product designer,",  delay: 60  },
                        { text: "digital analyst,",    delay: 170 },
                        { text: "brand storyteller.",  delay: 280 },
                    ].map(({ text, delay }) => (
                        <span
                            key={text}
                            style={{
                                display: "block",
                                whiteSpace: "nowrap",
                                ...enter(delay),
                            }}
                        >
                            {text}
                        </span>
                    ))}
                </h1>
            </div>

            {/* ── CTA: pinned to the bottom of the viewport, arrow inline beside the text (matches the main branch's CTA arrow), jumping character on top of the arrow ── */}
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    bottom: sp.heroBottom,
                    transform: `translateX(-50%) translateY(${(1 - heroFade) * 24}px)`,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    opacity: revealed ? heroFade : 0,
                    transition: reducedMotion ? "none" : `opacity 0.5s ${EASE_OUT} 500ms`,
                }}
            >
                <span
                    style={{
                        fontFamily: I,
                        fontSize: 13,
                        fontWeight: 400,
                        color: C.ink3,
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                    }}
                >
                    Here&apos;s a closer look at what that means
                </span>
                {/* Arrow — same path/stroke as the main branch's CTA arrow, jumping character floats on top of it */}
                <div style={{ position: "relative", width: 30, height: 30, flexShrink: 0, marginTop: 22 }}>
                    <img
                        src="/images/image 8.svg"
                        alt=""
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            top: -18.2,
                            left: "-2%",
                            width: illW.jump,
                            height: "auto",
                            display: "block",
                            animation: reducedMotion ? "none" : "illust-float 6.5s ease-in-out infinite 2s",
                        }}
                    />
                    <svg
                        width="30"
                        height="30"
                        viewBox="0 0 48 48"
                        fill="none"
                        style={{ display: "block" }}
                    >
                        <path
                            d="M 8 6 C 12 6, 40 14, 40 40"
                            stroke="#E8B4C8"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M 33 32 L 40 42 L 47 32"
                            stroke="#E8B4C8"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                </div>
            </div>
        </section>
    )
}

function SectionLabel({
    tag,
    title,
    phone,
    tablet,
    large,
}: {
    tag: string
    title: string
    phone: boolean
    tablet: boolean
    large: boolean
}) {
    const titleSize = phone ? 26 : tablet ? 30 : large ? 44 : 36
    return (
        <div style={{ marginBottom: phone ? 28 : tablet ? 40 : 52 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                <span style={{ fontFamily: I, fontSize: 12, color: C.muted }}>[</span>
                <span style={{ fontFamily: Z, fontWeight: 700, fontSize: 12, color: C.ink, letterSpacing: "-0.01em" }}>
                    {tag}
                </span>
                <span style={{ fontFamily: I, fontSize: 12, color: C.muted }}>]</span>
            </div>
            <h2
                style={{
                    fontFamily: YB,
                    fontWeight: 400,
                    fontSize: titleSize,
                    color: C.ink,
                    margin: 0,
                    lineHeight: 1.08,
                    letterSpacing: "-0.02em",
                }}
            >
                {title}
            </h2>
        </div>
    )
}

const CARDS: { href: string; image: string; video?: string; title: string; tags: string[]; company: string; desc: string; aspect: string }[] = [
    {
        href: "/anthropologie-product-discovery",
        image: "https://framerusercontent.com/images/vE5NBaasSteSM6lORQbcDZsAU.png",
        video: "/videos/product-discovery-hero.mp4",
        title: "Product Filter Redesign",
        tags: ["Product Design", "Design Systems", "E-Commerce"],
        company: "URBN",
        desc: "Redesigning the filter experience across four retail brands, balancing discoverability with speed for millions of shoppers.",
        aspect: "2.2 / 1",
    },
    {
        href: "/ios-review-accessibility",
        image: "https://framerusercontent.com/images/kDMnpjfRqLhIvdEi1aQ3Jp0wkg.png",
        title: "iOS Review Accessibility",
        tags: ["Research", "UX/UI", "iOS"],
        company: "URBN",
        desc: "Improving how shoppers read and trust customer reviews inside the iOS app.",
        aspect: "3 / 4",
    },
    {
        href: "/anthropologie-mcommerce",
        image: "https://framerusercontent.com/images/vE5NBaasSteSM6lORQbcDZsAU.png",
        title: "Anthropologie M-Commerce",
        tags: ["A/B Testing", "Strategy", "iOS"],
        company: "URBN",
        desc: "Testing and refining the mobile shopping journey to lift conversion across the app.",
        aspect: "3 / 4",
    },
]

function CoverCard({
    href,
    image,
    video,
    title,
    company,
    tags,
    desc,
    aspect,
    titleSize,
}: (typeof CARDS)[0] & { titleSize: number }) {
    const videoContainerRef = useRef<HTMLDivElement>(null)
    const [hov, setHov] = useState(false)
    const finePointer = useFinePointer()

    useEffect(() => {
        if (!video || !videoContainerRef.current) return
        const v = document.createElement("video")
        v.src = video
        v.setAttribute("autoplay", "")
        v.setAttribute("loop", "")
        v.setAttribute("muted", "")
        v.setAttribute("playsinline", "")
        v.setAttribute("preload", "auto")
        v.muted = true
        v.style.cssText = "width:100%;height:100%;object-fit:contain;display:block;"
        videoContainerRef.current.appendChild(v)
        v.play().catch(() => {})
        return () => { v.pause(); v.remove() }
    }, [video])

    return (
        <a
            href={href}
            className="card-link"
            style={{ textDecoration: "none", display: "block", breakInside: "avoid" as const }}
            onMouseEnter={() => finePointer && setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            <div
                style={{
                    width: "100%",
                    aspectRatio: aspect,
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {video ? (
                    <div ref={videoContainerRef} style={{ width: "100%", height: "100%" }} />
                ) : (
                    <img
                        src={image}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                            transform: hov ? "scale(1.03)" : "scale(1)",
                            transition: `transform 0.6s ${EASE_SPRING}`,
                        }}
                    />
                )}
            </div>
            <div style={{ marginTop: 14 }}>
                <div style={{
                    fontFamily: I,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: C.muted,
                }}>
                    {company} · {tags[0]}
                </div>
                <div style={{
                    fontFamily: Z,
                    fontWeight: 400,
                    fontSize: titleSize,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                    color: C.ink,
                    marginTop: 5,
                }}>
                    {title}
                </div>
                <p style={{
                    fontFamily: I,
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: C.ink3,
                    margin: "5px 0 0",
                }}>
                    {desc}
                </p>
            </div>
        </a>
    )
}


function WorkSection({
    phone,
    tablet,
    large,
    px,
    maxW,
    sp,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
    sp: ReturnType<typeof useBP>["sp"]
}) {
    const cardTitleSize = phone ? 16 : tablet ? 17 : large ? 21 : 19
    const sectionRef = useRef<HTMLElement>(null)
    const [cardsShown, setCardsShown] = useState(false)
    const [parallaxY, setParallaxY] = useState(0)
    const reducedMotion = useReducedMotion()

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setCardsShown(true); obs.disconnect() }
        }, { threshold: 0.05 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    // Cards rise to meet you as you scroll toward them, recede as you scroll past.
    useEffect(() => {
        if (reducedMotion) { setParallaxY(0); return }
        const onScroll = () => {
            const el = sectionRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const elMid = rect.top + rect.height / 2
            const vMid = window.innerHeight / 2
            const progress = (vMid - elMid) / window.innerHeight
            setParallaxY(Math.max(-90, Math.min(90, -progress * 170)))
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [reducedMotion])

    const reveal = (idx: number) => ({
        opacity: cardsShown ? 1 : 0,
        transform: cardsShown ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s ${EASE_SPRING} ${idx * 100}ms, transform 0.6s ${EASE_SPRING} ${idx * 100}ms`,
    })

    return (
        <section
            ref={sectionRef}
            id="work"
            style={{
                position: "relative",
                width: "100%",
                padding: `0 ${px}px ${sp.sectionGap}px`,
                boxSizing: "border-box",
                backgroundColor: C.bg,
                overflow: "hidden",
            }}
        >
            <div style={{
                position: "relative",
                maxWidth: maxW,
                width: "100%",
                margin: "0 auto",
                transform: `translateY(${parallaxY}px)`,
                willChange: "transform",
            }}>
                <SectionLabel
                    tag="UX Strategy · Research · Digital Commerce"
                    title="Selected Work"
                    phone={phone}
                    tablet={tablet}
                    large={large}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: sp.cardRowGap }}>
                    <div style={reveal(0)}>
                        <CoverCard {...CARDS[0]} titleSize={cardTitleSize} />
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: phone ? "column" : "row",
                        gap: phone ? sp.cardRowGap : sp.cardColGap,
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={reveal(1)}><CoverCard {...CARDS[1]} titleSize={cardTitleSize} /></div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={reveal(2)}><CoverCard {...CARDS[2]} titleSize={cardTitleSize} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const LOGOS = [
    { src: "/slides/anthro.png",    alt: "Anthropologie" },
    { src: "/slides/budweiser.png", alt: "Budweiser" },
    { src: "/slides/drexel.png",    alt: "Drexel University" },
    { src: "/slides/jnj.png",       alt: "Johnson & Johnson" },
    { src: "/slides/lakme.png",     alt: "Lakmé" },
    { src: "/slides/urbn.png",      alt: "URBN" },
]

function LogoTicker({
    phone,
    tablet,
    large,
    px,
    maxW,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
}) {
    const outerRef = useRef<HTMLDivElement>(null)
    const logoRefs = useRef<(HTMLDivElement | null)[]>([])
    const [tickerY, setTickerY] = useState(0)
    const [logoProgress, setLogoProgress] = useState<number[]>(() => LOGOS.map(() => 0))
    const reducedMotion = useReducedMotion()
    const navH = phone ? 54 : 64

    useEffect(() => {
        if (reducedMotion) { setTickerY(0); return }
        const onScroll = () => {
            const el = outerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const elMid = rect.top + rect.height / 2
            const vMid = window.innerHeight / 2
            const progress = (vMid - elMid) / window.innerHeight
            setTickerY(Math.max(-70, Math.min(70, progress * 240)))
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [reducedMotion])

    // Each logo fades and scales in as it scrolls toward the vertical center
    // of the viewport, then fades and scales back out as it continues past —
    // the same continuous, scroll-position-driven technique as the hero's
    // fade/scale, just mirrored on both sides instead of running one way, so
    // it plays as a scroll-in *and* scroll-out on every logo individually.
    useEffect(() => {
        if (reducedMotion) { setLogoProgress(LOGOS.map(() => 1)); return }
        const onScroll = () => {
            setLogoProgress(
                logoRefs.current.map((el) => {
                    if (!el) return 0
                    const rect = el.getBoundingClientRect()
                    const elMid = rect.top + rect.height / 2
                    const vMid = window.innerHeight / 2
                    const dist = Math.abs(elMid - vMid)
                    return Math.max(0, 1 - dist / (window.innerHeight * 0.55))
                })
            )
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll, { passive: true })
        onScroll()
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [reducedMotion])

    const logoScrollStyle = (idx: number) => ({
        opacity: logoProgress[idx] ?? 0,
        transform: `scale(${0.75 + (logoProgress[idx] ?? 0) * 0.25})`,
        willChange: "transform, opacity",
    })

    // Positions (top%, left%) matching Figma node 54:24's fixed layout: a
    // 2-3-2 grid — Anthropologie/J&J on top, Budweiser-title-Drexel in the
    // middle row, URBN/Lakmé on bottom. Percentages are relative to the
    // section's background rect (Figma y=63..672 of a 786-tall frame).
    // Order matches LOGOS: Anthropologie, Budweiser, Drexel, J&J, Lakmé, URBN.
    const SCATTER = [
        { top: "23%", left: "32%" },
        { top: "54%", left: "17%" },
        { top: "54%", left: "83%" },
        { top: "24%", left: "75%" },
        { top: "76%", left: "65%" },
        { top: "76%", left: "36%" },
    ]
    const logoH = phone ? 26 : tablet ? 32 : large ? 46 : 40
    // Lakmé and URBN read small next to the wordmarks around them — scale them up.
    const SIZE_MULT = [1, 1, 1, 1, 1.7, 1.7]

    return (
        <section
            ref={outerRef}
            style={{
                position: "relative",
                width: "100%",
                minHeight: `calc(100svh - ${navH}px)`,
                boxSizing: "border-box",
                backgroundColor: C.bg,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translateY(${tickerY}px)`,
                    willChange: "transform",
                }}
            >
                {phone ? (
                    // Scattering six logos across a phone-width viewport reads as
                    // clutter, not a composition — keep the simple centered cluster.
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: `calc(100% - ${px * 2}px)`,
                        }}
                    >
                        <SectionLabel tag="Application" title="Industry Experience" phone={phone} tablet={tablet} large={large} />
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                alignItems: "center",
                                columnGap: 28,
                                rowGap: 22,
                                width: "100%",
                                marginTop: 16,
                            }}
                        >
                            {LOGOS.map(({ src, alt }, i) => (
                                <div key={alt} ref={(el) => { logoRefs.current[i] = el }} style={logoScrollStyle(i)}>
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="logo-img"
                                        style={{
                                            height: logoH,
                                            width: "auto",
                                            display: "block",
                                            animation: reducedMotion
                                                ? "none"
                                                : `illust-float ${5.5 + (i % 3) * 0.6}s ease-in-out infinite ${i * 0.35}s`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ position: "absolute", top: "54%", left: "50%", transform: "translate(-50%, -50%)" }}>
                            <SectionLabel tag="Application" title="Industry Experience" phone={phone} tablet={tablet} large={large} />
                        </div>
                        {LOGOS.map(({ src, alt }, i) => (
                            // Positioning transform lives on this wrapper, not the img — the
                            // img's own transform gets overwritten each frame by the
                            // illust-float keyframes, which would otherwise fight the centering.
                            // The scroll-in/out fade+scale (no translate, so it doesn't fight
                            // either transform) lives on the middle wrapper, which is also what
                            // its own scroll position is measured from.
                            <div
                                key={alt}
                                style={{
                                    position: "absolute",
                                    top: SCATTER[i].top,
                                    left: SCATTER[i].left,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <div ref={(el) => { logoRefs.current[i] = el }} style={logoScrollStyle(i)}>
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="logo-img"
                                        style={{
                                            height: logoH * SIZE_MULT[i],
                                            width: "auto",
                                            display: "block",
                                            animation: reducedMotion
                                                ? "none"
                                                : `illust-float ${5.5 + (i % 3) * 0.6}s ease-in-out infinite ${i * 0.35}s`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

const SKILLS = [
    { num: "01", title: "Data Analytics & AI", sub: "Google Analytics · Excel · Confluence · LLMs · Prompt Engineering" },
    { num: "02", title: "User Experience Design", sub: "Research · UX/UI · Design Systems" },
    { num: "03", title: "Digital Marketing", sub: "Research · Strategy · A/B Testing" },
    { num: "04", title: "Branding & Content Creation", sub: "Brand kits · Photography · Video Content" },
]

function SkillRow({ num, title, sub, phone, tablet, revealDelay }: { num: string; title: string; sub: string; phone: boolean; tablet: boolean; revealDelay: number }) {
    const [hov, setHov] = useState(false)
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const isColumn = phone

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
            { threshold: 0.15 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: phone ? "14px 0" : "18px 0",
                borderBottom: `1px solid ${C.border}`,
                position: "relative",
                display: "flex",
                flexDirection: isColumn ? "column" : "row",
                alignItems: isColumn ? "flex-start" : "center",
                justifyContent: "space-between",
                gap: isColumn ? 5 : 0,
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ${EASE_OUT} ${revealDelay}ms`,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: I, fontSize: 10, color: C.muted, letterSpacing: "0.06em", width: 24, flexShrink: 0 }}>
                    {num}
                </span>
                <span
                    style={{
                        fontFamily: I,
                        fontSize: phone ? 13 : tablet ? 14 : 15,
                        fontWeight: 500,
                        color: hov ? C.ink : C.ink2,
                        transition: "color 0.2s",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {title}
                </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, paddingLeft: isColumn ? 40 : 0, justifyContent: isColumn ? "flex-start" : "flex-end" }}>
                {sub.split("·").map((s, i) => (
                    <span key={i} style={{ fontFamily: I, fontSize: phone ? 11 : 12, color: C.muted }}>
                        {i > 0 && <span style={{ margin: "0 5px", opacity: 0.3 }}>·</span>}
                        {s.trim()}
                    </span>
                ))}
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "1px",
                    width: hov ? "100%" : "0%",
                    backgroundColor: C.ink,
                    transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}
            />
        </div>
    )
}

function SkillsSection({
    phone,
    tablet,
    large,
    px,
    maxW,
    sp,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
    sp: ReturnType<typeof useBP>["sp"]
}) {
    const sectionPad = phone ? 64 : tablet ? 80 : large ? 120 : 100
    const sectionRef = useRef<HTMLElement>(null)
    const [skillsY, setSkillsY] = useState(0)
    const reducedMotion = useReducedMotion()

    // Same "rise to meet you, recede as you pass" parallax as Work/Brands,
    // so the skills block feels like it's on its own layer sliding up over
    // the section above rather than just appearing in place.
    useEffect(() => {
        if (reducedMotion) { setSkillsY(0); return }
        const onScroll = () => {
            const el = sectionRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const elMid = rect.top + rect.height / 2
            const vMid = window.innerHeight / 2
            const progress = (vMid - elMid) / window.innerHeight
            setSkillsY(Math.max(-90, Math.min(90, -progress * 170)))
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [reducedMotion])

    return (
        <section
            ref={sectionRef}
            style={{
                position: "relative",
                width: "100%",
                padding: `${sectionPad}px ${px}px`,
                boxSizing: "border-box",
                backgroundColor: C.bg,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    position: "relative",
                    maxWidth: maxW,
                    width: "100%",
                    margin: "0 auto",
                    transform: `translateY(${skillsY}px)`,
                    willChange: "transform",
                }}
            >
                <SectionLabel tag="Skills" title="What I offer" phone={phone} tablet={tablet} large={large} />
                <div>
                    {SKILLS.map((s, i) => (
                        <SkillRow key={s.num} {...s} phone={phone} tablet={tablet} revealDelay={i * 80} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function Footer({
    phone,
    tablet,
    large,
    px,
    maxW,
}: {
    phone: boolean
    tablet: boolean
    large: boolean
    px: number
    maxW: number
}) {
    const logoW = phone ? 75 : tablet ? 85 : 90
    const iconSize = phone ? 26 : 30
    return (
        <footer
            style={{
                width: "100%",
                padding: `${phone ? 24 : 32}px ${px}px`,
                boxSizing: "border-box",
                backgroundColor: C.bg,
            }}
        >
            <div
                style={{
                    maxWidth: maxW,
                    width: "100%",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: phone ? "flex-start" : "center",
                    flexDirection: phone ? "column" : "row",
                    justifyContent: "space-between",
                    gap: phone ? 20 : 0,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <img
                        src="https://framerusercontent.com/images/NdNFLxKwhpMzm0XHgjDRNkrRRg.png"
                        alt="OC"
                        style={{ width: logoW, objectFit: "contain", display: "block", flexShrink: 0 }}
                    />
                    <p style={{ fontFamily: I, fontSize: 12, color: C.muted, margin: 0, whiteSpace: "nowrap" as const }}>
                        © {new Date().getFullYear()} Omisha Chabria
                    </p>
                </div>
                <div style={{ display: "flex", gap: phone ? 18 : 22, alignItems: "center" }}>
                    {[
                        { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true, icon: "/icons/linkedin.png" },
                        { label: "Email", href: "mailto:omishachabria3@gmail.com", ext: false, icon: "/icons/mail.png" },
                    ].map(({ label, href, ext, icon }) => (
                        <a
                            key={label}
                            href={href}
                            target={ext ? "_blank" : "_self"}
                            rel="noreferrer"
                            aria-label={label}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <img
                                src={icon}
                                alt=""
                                aria-hidden="true"
                                className="footer-icon"
                                style={{ width: iconSize, height: iconSize, display: "block" }}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default function ResponsiveHome() {
    const { ref, phone, tablet, desktop, large, px, maxW, sp } = useBP()

    return (
        <>
            <div
                ref={ref}
                style={{
                    width: "100%",
                    backgroundColor: C.bg,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <style>{CURSOR_STYLES}</style>
                <SharedNav />
                <Hero phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <WorkSection phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <LogoTicker phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} />
                <SkillsSection phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <Footer phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} />
            </div>
        </>
    )
}
