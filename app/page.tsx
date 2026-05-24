"use client"

import { useState, useRef, useEffect, useCallback } from "react"

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

    const phone = w < 540
    const tablet = w >= 540 && w < 1024
    const desktop = w >= 1024 && w <= 1440
    const large = w > 1440

    const px = phone ? 20 : tablet ? 40 : large ? 120 : 80
    const maxW = large ? 1280 : 1040

    const sp = {
        sectionGap: phone ? 72 : tablet ? 96 : 120,
        headerGap: phone ? 28 : tablet ? 40 : 56,
        cardRowGap: phone ? 24 : tablet ? 28 : 36,
        cardColGap: phone ? 0 : tablet ? 20 : 24,
        cardH: phone ? 220 : tablet ? 260 : large ? 460 : 390,
        heroTop: phone ? 48 : tablet ? 64 : 96,
        heroBottom: phone ? 48 : tablet ? 64 : 80,
        colOffset: tablet ? 0 : 80,
    }

    return { ref, w, phone, tablet, desktop, large, px, maxW, sp }
}

function Nav({ phone, tablet, px }: { phone: boolean; tablet: boolean; px: number }) {
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 12)
        window.addEventListener("scroll", fn, { passive: true })
        return () => window.removeEventListener("scroll", fn)
    }, [])

    const links = phone
        ? [
              { label: "Work", href: "#work" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
              { label: "Resume", href: "#" },
          ]
        : [
              { label: "Work", href: "#work" },
              { label: "Playground", href: "/playground" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
              { label: "Resume", href: "#" },
          ]

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                width: "100%",
                height: phone ? 54 : 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `0 ${px}px`,
                boxSizing: "border-box",
                backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : C.bg,
                backdropFilter: scrolled ? "blur(20px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.09)" : C.border}`,
                transition: "background 0.25s, border-color 0.25s",
            }}
        >
            <a href="/" style={{ display: "block", lineHeight: 0 }}>
                <img
                    src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png"
                    alt="OC"
                    style={{
                        width: phone ? 38 : 46,
                        height: phone ? 38 : 46,
                        objectFit: "contain",
                        display: "block",
                    }}
                />
            </a>
            <div style={{ display: "flex", gap: phone ? 16 : tablet ? 24 : 32, alignItems: "center" }}>
                {links.map(({ label, href, ext }) => (
                    <a
                        key={label}
                        href={href}
                        target={ext ? "_blank" : "_self"}
                        rel="noreferrer"
                        style={{
                            fontFamily: I,
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
    const navH = phone ? 54 : 64
    const hiW = phone ? 120 : tablet ? 160 : large ? 260 : 210
    const hiH = Math.round(hiW / 1.615)

    const headSize = phone ? "22px" : tablet ? "28px" : "33px"
    const headMaxW = "100%"

    return (
        <section
            style={{
                width: "100%",
                minHeight: phone ? "auto" : `calc(100vh - ${navH}px)`,
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
                <img
                    src="https://framerusercontent.com/images/hK0bLjY9spx6qo44Ua9QOr0NQ7Y.png"
                    alt="Hi"
                    style={{
                        width: hiW,
                        height: hiH,
                        objectFit: "contain",
                        display: "block",
                        marginBottom: phone ? 24 : tablet ? 32 : 40,
                    }}
                />
                <h1
                    style={{
                        fontFamily: Z,
                        fontWeight: 400,
                        fontSize: headSize,
                        lineHeight: 1.4,
                        letterSpacing: "-0.02em",
                        color: C.ink,
                        margin: 0,
                        maxWidth: headMaxW,
                        textAlign: "left",
                        fontStyle: "normal",
                    }}
                >
                    <span style={{ display: "block" }}>
                        I design digital products by balancing{" "}
                        <span style={{ fontFamily: YB, fontStyle: "italic", fontWeight: 700 }}>Creativity</span>
                        <span style={{ fontFamily: Z, fontStyle: "normal", fontWeight: 400 }}> &amp; </span>
                        <span style={{ fontFamily: YB, fontStyle: "italic", fontWeight: 700 }}>Insights;</span>
                    </span>
                    <span style={{ display: "block" }}>
                        always grounded in{" "}
                        <span style={{ fontFamily: YB, fontStyle: "italic", fontWeight: 700 }}>how</span>{" "}
                        people experience them
                    </span>
                </h1>
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
                    style={{ display: "block", flexShrink: 0 }}
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
        raf.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(raf.current)
    }, [animate])

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
    return (
        <section
            id="work"
            style={{
                width: "100%",
                padding: `0 ${px}px ${sp.sectionGap}px`,
                boxSizing: "border-box",
            }}
        >
            <div style={{ maxWidth: maxW, width: "100%" }}>
                <SectionLabel
                    tag="Projects, process & outcomes"
                    title="Inside My Work"
                    phone={phone}
                    tablet={tablet}
                    large={large}
                />
                {phone ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: sp.cardRowGap }}>
                        {CARDS.map((c, i) => (
                            <Card key={i} {...c} cardH={sp.cardH} titleSize={cardTitleSize} />
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
                            <Card {...CARDS[0]} cardH={sp.cardH} titleSize={cardTitleSize} />
                            <Card {...CARDS[2]} cardH={sp.cardH} titleSize={cardTitleSize} />
                        </div>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: sp.cardRowGap }}>
                            <Card {...CARDS[1]} cardH={sp.cardH} titleSize={cardTitleSize} />
                            <Card {...CARDS[3]} cardH={sp.cardH} titleSize={cardTitleSize} />
                        </div>
                    </div>
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
    const logoW = phone ? 60 : tablet ? 68 : 72
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
                        { label: "Resume", href: "#" },
                    ].map(({ label, href, ext }) => (
                        <a
                            key={label}
                            href={href}
                            target={ext ? "_blank" : "_self"}
                            rel="noreferrer"
                            style={{
                                fontFamily: YB,
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
            <div style={{ width: "100%" }}>
                <Nav phone={phone} tablet={tablet} px={px} />
                <Hero phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <WorkSection phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <SkillsSection phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} sp={sp} />
                <Footer phone={phone} tablet={tablet} large={large} px={px} maxW={maxW} />
            </div>
        </div>
    )
}
