"use client"

import { useState, useRef, useEffect, useCallback, Fragment } from "react"
import SharedNav from "../components/SharedNav"

const CURSOR_STYLES = `
  * { cursor: none !important; }
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
    100% { transform: translate(var(--bx), -60px) scale(0); opacity: 0; }
  }
  @keyframes word-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  html { scroll-behavior: smooth; }
  html, body { max-width: 100%; overflow-x: hidden; }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .logo-track {
    display: flex;
    align-items: center;
    width: max-content;
    animation: marquee 28s linear infinite;
  }
  .logo-track:hover {
    animation-play-state: paused;
  }
  .logo-img {
    filter: grayscale(100%) opacity(0.55);
    transition: filter 0.35s ease;
  }
  .logo-img:hover {
    filter: grayscale(0%) opacity(1);
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
        cardH: phone ? 200 : tablet ? 280 : large ? 460 : 390,
        heroTop: phone ? 40 : tablet ? 64 : 96,
        heroBottom: phone ? 64 : tablet ? 100 : 120,
        colOffset: tablet ? 0 : 80,
    }

    return { ref, w, phone, tablet, desktop, large, px, maxW, sp }
}

function CustomCursor() {
    const lagRef = useRef({ x: -200, y: -200 })
    const posRef = useRef({ x: -200, y: -200 })
    const [lag, setLag] = useState({ x: -200, y: -200 })
    const [hovered, setHovered] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            posRef.current = { x: e.clientX, y: e.clientY }
            if (!visible) setVisible(true)
        }
        const onOver = (e: MouseEvent) => {
            const t = e.target as Element
            setHovered(!!t.closest("a, button, [role='button']"))
        }
        let raf: number
        const tick = () => {
            lagRef.current.x += (posRef.current.x - lagRef.current.x) * 0.14
            lagRef.current.y += (posRef.current.y - lagRef.current.y) * 0.14
            setLag({ x: lagRef.current.x, y: lagRef.current.y })
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        window.addEventListener("mousemove", onMove, { passive: true })
        window.addEventListener("mouseover", onOver, { passive: true })
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("mouseover", onOver)
        }
    }, [visible])

    if (!visible) return null
    return (
        <div
            style={{
                position: "fixed",
                left: lag.x,
                top: lag.y,
                width: hovered ? 32 : 12,
                height: hovered ? 32 : 12,
                borderRadius: "50%",
                backgroundColor: hovered ? "transparent" : "#E8B4C8",
                border: hovered ? "2px solid #E8B4C8" : "none",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 99999,
                transition: "width 0.22s cubic-bezier(0.22,1,0.36,1), height 0.22s cubic-bezier(0.22,1,0.36,1), background-color 0.22s, border 0.22s",
            }}
        />
    )
}


type WordDef = { text: string; yb?: boolean }
const HERO_LINE1: WordDef[] = [
    { text: "I" }, { text: "design" }, { text: "digital" }, { text: "products" },
    { text: "by" }, { text: "balancing" },
    { text: "Creativity", yb: true }, { text: "&" }, { text: "Insights;", yb: true },
]
const HERO_LINE2: WordDef[] = [
    { text: "always" }, { text: "grounded" }, { text: "in" },
    { text: "how", yb: true },
    { text: "people" }, { text: "experience" }, { text: "them" },
]

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
    const hiW = phone ? 100 : tablet ? 150 : large ? 260 : 210
    const hiH = Math.round(hiW / 1.615)

    type Particle = { id: number; color: string; x: number; angle: number; size: number }
    const [hiAnim, setHiAnim] = useState<"idle" | "hover" | "pop">("idle")
    const [particles, setParticles] = useState<Particle[]>([])
    const popTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const BUBBLE_COLORS = ["#E8B4C8", "#D4AEDD", "#F4C6D8", "#C9B8E4", "#EAD4F0", "#F9B8CF", "#D8BEF8"]

    const [revealed, setRevealed] = useState(false)
    useEffect(() => {
        const t = setTimeout(() => setRevealed(true), 60)
        return () => clearTimeout(t)
    }, [])

    const triggerPop = () => {
        if (hiAnim === "pop") return
        setHiAnim("pop")
        const newParticles: Particle[] = Array.from({ length: 7 }, (_, i) => ({
            id: Date.now() + i,
            color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
            x: (Math.random() - 0.5) * 80,
            angle: Math.random() * 360,
            size: 6 + Math.random() * 8,
        }))
        setParticles(newParticles)
        if (popTimeout.current) clearTimeout(popTimeout.current)
        popTimeout.current = setTimeout(() => {
            setHiAnim("idle")
            setParticles([])
        }, 700)
    }

    const headSize = phone ? "clamp(22px, 6vw, 28px)" : tablet ? "clamp(26px, 3.5vw, 32px)" : "33px"
    const headMaxW = "100%"

    return (
        <section
            style={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: `${sp.heroTop}px ${px}px ${sp.heroBottom}px`,
                boxSizing: "border-box",
            }}
        >
            {/* Left-aligned heading block */}
            <div style={{ maxWidth: maxW, width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                {/* Reveal fade-in on mount */}
                <div style={{
                    marginBottom: phone ? 24 : tablet ? 32 : 40,
                    display: "inline-block",
                    opacity: revealed ? 1 : 0,
                    transition: "opacity 0.65s cubic-bezier(0.22,1,0.36,1)",
                }}>
                    {/* Interaction + particles */}
                    <div
                        style={{ position: "relative", display: "inline-block" }}
                        onMouseEnter={() => { if (hiAnim === "idle") setHiAnim("hover") }}
                        onMouseLeave={() => { if (hiAnim === "hover") setHiAnim("idle") }}
                        onClick={triggerPop}
                    >
                        <img
                            src="https://framerusercontent.com/images/hK0bLjY9spx6qo44Ua9QOr0NQ7Y.png"
                            alt="Hi"
                            style={{
                                width: hiW,
                                height: hiH,
                                objectFit: "contain",
                                display: "block",
                                marginLeft: "-10px",
                                filter: "saturate(1.6) brightness(1.05)",
                                animation:
                                    hiAnim === "pop" ? "hi-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards" :
                                    hiAnim === "hover" ? "hi-wiggle 0.5s cubic-bezier(0.22,1,0.36,1) forwards" :
                                    "hi-float 3s ease-in-out infinite",
                            }}
                        />
                        {particles.map((p) => (
                            <div
                                key={p.id}
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "40%",
                                    width: p.size,
                                    height: p.size,
                                    borderRadius: "50%",
                                    backgroundColor: p.color,
                                    pointerEvents: "none",
                                    "--bx": `${p.x}px`,
                                    animation: "bubble-rise 0.65s cubic-bezier(0.22,1,0.36,1) forwards",
                                } as React.CSSProperties}
                            />
                        ))}
                    </div>
                </div>
                <h1
                    style={{
                        fontFamily: Z,
                        fontWeight: 400,
                        fontSize: headSize,
                        lineHeight: 1.4,
                        letterSpacing: "-0.02em",
                        wordSpacing: "4px",
                        color: C.ink,
                        margin: 0,
                        maxWidth: headMaxW,
                        textAlign: "left",
                        fontStyle: "normal",
                    }}
                >
                    <span style={{ display: "block" }}>
                        {HERO_LINE1.map((w, j) => (
                            <Fragment key={j}>
                                <span style={{
                                    display: "inline-block",
                                    fontFamily: w.yb ? YB : Z,
                                    fontStyle: w.yb ? "italic" : "normal",
                                    fontWeight: w.yb ? 700 : 400,
                                    opacity: 0,
                                    animation: revealed
                                        ? `word-in 0.65s cubic-bezier(0.22,1,0.36,1) ${200 + j * 60}ms forwards`
                                        : "none",
                                }}>
                                    {w.text === "&" ? <>&amp;</> : w.text}
                                </span>
                                {" "}
                            </Fragment>
                        ))}
                    </span>
                    <span style={{ display: "block" }}>
                        {HERO_LINE2.map((w, j) => (
                            <Fragment key={j}>
                                <span style={{
                                    display: "inline-block",
                                    fontFamily: w.yb ? YB : Z,
                                    fontStyle: w.yb ? "italic" : "normal",
                                    fontWeight: w.yb ? 700 : 400,
                                    opacity: 0,
                                    animation: revealed
                                        ? `word-in 0.65s cubic-bezier(0.22,1,0.36,1) ${200 + (HERO_LINE1.length + j) * 60}ms forwards`
                                        : "none",
                                }}>
                                    {w.text}
                                </span>
                                {" "}
                            </Fragment>
                        ))}
                    </span>
                </h1>
                <p
                    style={{
                        fontFamily: I,
                        fontSize: phone ? 12 : 13,
                        fontWeight: 500,
                        color: C.muted,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginTop: phone ? 20 : 28,
                    }}
                >
                    UX &amp; Digital Strategy &nbsp;·&nbsp; Turning user insights into product decisions
                </p>
            </div>

            {/* Centered label + inline pink arrow to the right */}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    paddingTop: phone ? 40 : 0,
                }}
            >
                <p
                    style={{
                        fontFamily: Z,
                        fontStyle: "normal",
                        fontWeight: 300,
                        fontSize: 16,
                        lineHeight: 1,
                        color: C.ink,
                        margin: 0,
                        letterSpacing: "-0.01em",
                    }}
                >
                    Here&apos;s a closer look at what that means
                </p>
                <svg
                    width={36}
                    height={36}
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: "block", flexShrink: 0, verticalAlign: "middle", marginTop: "28px" }}
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

const CARDS = [
    {
        href: "/ios-review-accessibility",
        image: "https://framerusercontent.com/images/kDMnpjfRqLhIvdEi1aQ3Jp0wkg.png",
        title: "iOS Review Accessibility",
        tags: ["Research", "UX/UI", "iOS"],
        company: "URBN",
    },
    {
        href: "/anthropologie-mcommerce",
        image: "https://framerusercontent.com/images/vE5NBaasSteSM6lORQbcDZsAU.png",
        title: "Anthropologie M-Commerce",
        tags: ["A/B Testing", "Strategy", "iOS"],
        company: "URBN",
    },
    {
        href: "/rfnd",
        image: "https://framerusercontent.com/images/zVoRHBtJogEEa7qGBjvmTij4HiM.png",
        title: "Rethinking Online Through UX",
        tags: ["Research", "UX/UI", "Branding"],
        company: "RFND",
    },
    {
        href: "/board-and-brew",
        image: "https://framerusercontent.com/images/cLVYFY7QACPw6GJX0du1qogfw.png",
        title: "Board & Brew Social Campaign",
        tags: ["Marketing", "Socials"],
        company: "Personal",
    },
]

function Card({
    href,
    image,
    title,
    tags,
    company,
    cardH,
    titleSize,
}: (typeof CARDS)[0] & { cardH: number; titleSize: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const [hov, setHov] = useState(false)
    const pos = useRef({ x: 0.5, y: 0.5 })
    const cur = useRef({ x: 0.5, y: 0.5 })
    const raf = useRef(0)
    const [tilt, setTilt] = useState({ x: 0, y: 0 })

    const animate = useCallback(() => {
        cur.current.x += (pos.current.x - cur.current.x) * 0.07
        cur.current.y += (pos.current.y - cur.current.y) * 0.07
        setTilt({ x: (cur.current.y - 0.5) * -8, y: (cur.current.x - 0.5) * 8 })
        raf.current = requestAnimationFrame(animate)
    }, [])

    useEffect(() => {
        if (!hov) { cancelAnimationFrame(raf.current); return }
        raf.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(raf.current)
    }, [animate, hov])

    const onMove = (e: React.MouseEvent) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        pos.current = {
            x: (e.clientX - r.left) / r.width,
            y: (e.clientY - r.top) / r.height,
        }
    }

    return (
        <a href={href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 14 }}>
            <div
                ref={ref}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => {
                    setHov(false)
                    pos.current = { x: 0.5, y: 0.5 }
                }}
                onMouseMove={onMove}
                style={{
                    width: "100%",
                    height: cardH,
                    borderRadius: 14,
                    overflow: "hidden",
                    backgroundColor: "#F5F5F3",
                    position: "relative",
                    cursor: "pointer",
                    transform: hov
                        ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
                        : "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
                    boxShadow: hov
                        ? "0 28px 56px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08)"
                        : "0 1px 8px rgba(0,0,0,0.05)",
                    transition: hov
                        ? "box-shadow 0.4s cubic-bezier(0.22,1,0.36,1)"
                        : "transform 0.8s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s cubic-bezier(0.22,1,0.36,1)",
                    willChange: "transform",
                }}
            >
                <img
                    src={image}
                    alt={title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transform: hov ? "scale(1.06)" : "scale(1)",
                        transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                        opacity: hov ? 1 : 0,
                        transition: "opacity 0.35s",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: 14,
                        left: "50%",
                        transform: hov
                            ? "translateX(-50%) translateY(0)"
                            : "translateX(-50%) translateY(10px)",
                        opacity: hov ? 1 : 0,
                        transition: "opacity 0.3s, transform 0.3s",
                        backgroundColor: "rgba(255,255,255,0.96)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        borderRadius: 40,
                        padding: "7px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        whiteSpace: "nowrap" as const,
                        pointerEvents: "none",
                        zIndex: 10,
                    }}
                >
                    <span style={{ fontFamily: I, fontSize: 12, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
                        View project
                    </span>
                    <span style={{ fontSize: 12, color: C.ink }}>→</span>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "0 2px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span
                        style={{
                            fontFamily: Z,
                            fontSize: titleSize,
                            fontWeight: 400,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.25,
                            color: C.ink2,
                        }}
                    >
                        {title}
                    </span>
                    <span style={{ fontFamily: I, fontSize: 11, color: C.muted, letterSpacing: "0.02em" }}>
                        {company}
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap" as const,
                        gap: 4,
                        flexShrink: 0,
                        paddingTop: 2,
                        justifyContent: "flex-end",
                    }}
                >
                    {tags.map((t, i) => (
                        <span
                            key={i}
                            style={{
                                fontFamily: I,
                                fontSize: 10,
                                color: C.muted,
                                backgroundColor: "rgba(0,0,0,0.04)",
                                borderRadius: 40,
                                padding: "3px 9px",
                            }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
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
    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setCardsShown(true); obs.disconnect() }
        }, { threshold: 0.05 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const reveal = (idx: number) => ({
        opacity: cardsShown ? 1 : 0,
        transform: cardsShown ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.72s cubic-bezier(0.22,1,0.36,1) ${idx * 120}ms, transform 0.72s cubic-bezier(0.22,1,0.36,1) ${idx * 120}ms`,
    })

    return (
        <section
            ref={sectionRef}
            id="work"
            style={{
                width: "100%",
                padding: `0 ${px}px ${sp.sectionGap}px`,
                boxSizing: "border-box",
            }}
        >
            <div style={{ maxWidth: maxW, width: "100%" }}>
                <SectionLabel
                    tag="UX Strategy · Research · Digital Commerce"
                    title="Inside My Work"
                    phone={phone}
                    tablet={tablet}
                    large={large}
                />
                {phone ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: sp.cardRowGap }}>
                        {CARDS.map((c, i) => (
                            <div key={i} style={reveal(i)}>
                                <Card {...c} cardH={sp.cardH} titleSize={cardTitleSize} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: sp.cardColGap, alignItems: "flex-start" }}>
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: sp.cardRowGap,
                                paddingTop: sp.colOffset,
                            }}
                        >
                            <div style={reveal(0)}><Card {...CARDS[0]} cardH={sp.cardH} titleSize={cardTitleSize} /></div>
                            <div style={reveal(2)}><Card {...CARDS[2]} cardH={sp.cardH} titleSize={cardTitleSize} /></div>
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: sp.cardRowGap }}>
                            <div style={reveal(1)}><Card {...CARDS[1]} cardH={sp.cardH} titleSize={cardTitleSize} /></div>
                            <div style={reveal(3)}><Card {...CARDS[3]} cardH={sp.cardH} titleSize={cardTitleSize} /></div>
                        </div>
                    </div>
                )}
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
    const sectionPad = phone ? 64 : tablet ? 80 : large ? 120 : 100
    const outerRef = useRef<HTMLDivElement>(null)
    const [tickerY, setTickerY] = useState(0)
    useEffect(() => {
        const onScroll = () => {
            const el = outerRef.current
            if (!el) return
            const rect = el.getBoundingClientRect()
            const elMid = rect.top + rect.height / 2
            const vMid = window.innerHeight / 2
            const progress = (vMid - elMid) / window.innerHeight
            setTickerY(Math.max(-12, Math.min(12, progress * 80)))
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <section
            ref={outerRef}
            style={{
                width: "100%",
                padding: `${sectionPad}px ${px}px`,
                boxSizing: "border-box",
                borderTop: `1px solid ${C.border}`,
                overflow: "hidden",
            }}
        >
            <div style={{ maxWidth: maxW, width: "100%", transform: `translateY(${tickerY}px)`, willChange: "transform" }}>
                <SectionLabel
                    tag="Application"
                    title="Industry Experience:"
                    phone={phone}
                    tablet={tablet}
                    large={large}
                />
                <div style={{ overflow: "hidden", width: "100%", marginTop: phone ? 8 : 16 }}>
                    <div className="logo-track">
                        {[...LOGOS, ...LOGOS].map(({ src, alt }, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={alt}
                                className="logo-img"
                                style={{
                                    height: phone ? 28 : 40,
                                    width: "auto",
                                    display: "block",
                                    flexShrink: 0,
                                    marginRight: phone ? 48 : 80,
                                }}
                            />
                        ))}
                    </div>
                </div>
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

function SkillRow({ num, title, sub, phone, tablet }: { num: string; title: string; sub: string; phone: boolean; tablet: boolean }) {
    const [hov, setHov] = useState(false)
    const isColumn = phone
    return (
        <div
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
    return (
        <section
            style={{
                width: "100%",
                padding: `${sectionPad}px ${px}px`,
                boxSizing: "border-box",
                borderTop: `1px solid ${C.border}`,
            }}
        >
            <div style={{ maxWidth: maxW, width: "100%" }}>
                <SectionLabel tag="Skills" title="What I offer" phone={phone} tablet={tablet} large={large} />
                <div>
                    {SKILLS.map((s) => (
                        <SkillRow key={s.num} {...s} phone={phone} tablet={tablet} />
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
    return (
        <footer
            style={{
                width: "100%",
                padding: `${phone ? 24 : 32}px ${px}px`,
                boxSizing: "border-box",
                borderTop: `1px solid ${C.border}`,
            }}
        >
            <div
                style={{
                    maxWidth: maxW,
                    width: "100%",
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
                <div style={{ display: "flex", gap: phone ? 20 : tablet ? 24 : 32, alignItems: "center" }}>
                    {[
                        { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
                        { label: "Email", href: "mailto:omishachabria@gmail.com" },
                        { label: "Resume", href: "/slides/resume.pdf", ext: true },
                    ].map(({ label, href, ext }) => (
                        <a
                            key={label}
                            href={href}
                            target={ext ? "_blank" : "_self"}
                            rel="noreferrer"
                            style={{
                                fontFamily: I,
                                fontSize: phone ? 13 : 14,
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
            </div>
        </footer>
    )
}

export default function ResponsiveHome() {
    const { ref, phone, tablet, desktop, large, px, maxW, sp } = useBP()
    return (
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
            <CustomCursor />
            <div style={{ width: "100%" }}>
                <SharedNav />
                <Hero phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <WorkSection phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <LogoTicker phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} />
                <SkillsSection phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <Footer phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} />
            </div>
        </div>
    )
}
