"use client"

import { useState, useRef, useEffect } from "react"
import SharedNav from "../../components/SharedNav"

const Z = "Zodiak, 'Times New Roman', serif"
const I = "Inter, system-ui, sans-serif"

const T = {
    bg: "#FFFFFF",
    ink: "#111111",
    ink2: "#383838",
    ink3: "#6B6B6B",
    muted: "#9A9A9A",
    border: "rgba(0,0,0,0.07)",
    surface: "#F2F2F0",
}

const PHOTOS = [
    "https://framerusercontent.com/images/6JftouJBmFzzRoc5kGehzD49bI.jpg",
    "https://framerusercontent.com/images/WNhHwDJtvXf2ddWyDKeqzLEDIMM.jpg",
    "https://framerusercontent.com/images/jRADc4G9lgSPtWGjfIkY79DgPw.jpg",
    "https://framerusercontent.com/images/p0iCcKAZ6YkN0bYXoNMQIkgsc.jpg",
    "https://framerusercontent.com/images/7d8mXeVlUskoq2jVfYUldAwYCAY.jpg",
    "https://framerusercontent.com/images/SBGGzzRNM3cxaY7mXbbdjPjHI.jpg",
    "https://framerusercontent.com/images/DvwhBGDVHs70NCAmanEeQYoDOs.jpg",
    "https://framerusercontent.com/images/RsJK9eqQ0yxwUF9pZeKS4JHsBE.jpg",
]

const VISUAL_IMAGES = [
    "https://framerusercontent.com/images/5iCEQ0frJyGbnjCBQb68ThJHAvg.png",
    "https://framerusercontent.com/images/plkR05Zc0hlHoIagepXjCw6TA4.png",
]

const MOTION_EMBEDS = [
    "https://www.canva.com/design/DAHFL_7oX_Y/RMm3KsCaL30KVsZ6jOuKhw/watch?embed",
    "https://www.canva.com/design/DAHEvJgim7M/DtchAXWYjHURuX8Vm3Xl1A/watch?embed",
    "https://www.canva.com/design/DAHJZrqnmsE/6S17BE9bGV_u6BT_OdhVhA/watch?embed",
]

const PROJECTS_EMBEDS = [
    "https://www.canva.com/design/DAG74qzfc1A/ndx1i9o6UMKSdNRT-e1r2g/view?embed",
    "https://www.canva.com/design/DAGHGUDI4ys/Gpz0zcbqhG10kzndXwnaYw/view?embed",
    "https://www.canva.com/design/DAGzA1ts_Wo/L0cTtF-lK8ODJUwg5bTv5Q/view?embed",
    "https://www.canva.com/design/DAGxGinBSuE/ipGt5HbXqLNmofmGAt0yUw/view?embed",
]

const NAV_ITEMS = [
    { label: "Visual Design", num: "01" },
    { label: "Photography", num: "02" },
    { label: "Motion", num: "03" },
    { label: "Projects", num: "04" },
]

const SECTIONS = [
    { num: "01", title: "Visual Design & Branding", desc: "Brand identities, posters, and creative direction." },
    { num: "02", title: "Photography", desc: "Personal photography — light, texture, and moment." },
    { num: "03", title: "Motion", desc: "Video editing and motion design experiments." },
    { num: "04", title: "Projects", desc: "Miscellaneous work made for the love of making." },
]


function SectionHeader({ num, title, desc }: { num: string; title: string; desc: string }) {
    return (
        <div
            style={{
                marginBottom: 40,
                paddingBottom: 24,
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 24,
            }}
        >
            <div>
                <span
                    style={{
                        fontFamily: I,
                        fontSize: 11,
                        color: T.muted,
                        letterSpacing: "0.06em",
                        display: "block",
                        marginBottom: 8,
                    }}
                >
                    [{num}]
                </span>
                <h2
                    style={{
                        fontFamily: Z,
                        fontWeight: 700,
                        fontSize: 24,
                        color: T.ink,
                        margin: "0 0 6px",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                    }}
                >
                    {title}
                </h2>
                <p style={{ fontFamily: I, fontSize: 13, color: T.ink3, margin: 0, lineHeight: 1.5 }}>
                    {desc}
                </p>
            </div>
        </div>
    )
}

function PhotoCard({ src, aspectRatio = "3/2" }: { src: string; aspectRatio?: string }) {
    const [hov, setHov] = useState(false)
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                borderRadius: 10,
                overflow: "hidden",
                width: "100%",
                aspectRatio,
                transition: "box-shadow 0.3s",
                boxShadow: hov ? "0 16px 40px rgba(0,0,0,0.13)" : "0 1px 6px rgba(0,0,0,0.05)",
            }}
        >
            <img
                src={src}
                alt=""
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: hov ? "scale(1.04)" : "scale(1)",
                    transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                }}
            />
        </div>
    )
}

function EmbedFrame({ src, aspect = "16/9" }: { src: string; aspect?: string }) {
    return (
        <div
            style={{
                width: "100%",
                aspectRatio: aspect,
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: T.surface,
                position: "relative" as const,
            }}
        >
            <iframe
                loading="lazy"
                src={src}
                style={{
                    position: "absolute" as const,
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    border: "none",
                }}
                allowFullScreen
            />
        </div>
    )
}

export default function PlaygroundPage() {
    const ref0 = useRef<HTMLDivElement>(null)
    const ref1 = useRef<HTMLDivElement>(null)
    const ref2 = useRef<HTMLDivElement>(null)
    const ref3 = useRef<HTMLDivElement>(null)
    const sectionRefs = [ref0, ref1, ref2, ref3]

    const [active, setActive] = useState(0)
    const [hovNav, setHovNav] = useState(-1)

    useEffect(() => {
        const onScroll = () => {
            let cur = 0
            sectionRefs.forEach((ref, i) => {
                if (ref.current && ref.current.getBoundingClientRect().top <= 100) cur = i
            })
            setActive(cur)
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const scrollToSection = (i: number) => {
        const el = sectionRefs[i].current
        if (!el) return
        window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - 90,
            behavior: "smooth",
        })
    }

    return (
        <div style={{ width: "100%", backgroundColor: "#fff", fontFamily: I }}>
            <SharedNav />
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 80px 160px" }}>
                {/* Hero */}
                <div style={{ paddingTop: 96, paddingBottom: 48 }}>
                    <p
                        style={{
                            fontFamily: I,
                            fontSize: 11,
                            color: T.muted,
                            letterSpacing: "0.06em",
                            marginBottom: 20,
                            textTransform: "uppercase" as const,
                        }}
                    >
                        Playground
                    </p>
                    <h1
                        style={{
                            fontFamily: Z,
                            fontWeight: 700,
                            fontSize: "clamp(36px, 4vw, 52px)",
                            lineHeight: 1.06,
                            letterSpacing: "-0.025em",
                            color: T.ink,
                            margin: "0 0 16px",
                            maxWidth: 600,
                        }}
                    >
                        Experiments, explorations, and creative work.
                    </h1>
                    <p style={{ fontFamily: I, fontSize: 15, lineHeight: 1.7, color: T.ink3, margin: 0, maxWidth: 480 }}>
                        Not case studies. Just things made for the love of making.
                    </p>
                </div>

                {/* Section Nav */}
                <div style={{ display: "flex", paddingBottom: 80, borderBottom: `1px solid ${T.border}` }}>
                    <div
                        style={{
                            display: "flex",
                            gap: 4,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                            borderRadius: 40,
                            padding: "5px 6px",
                            boxShadow: "0 2px 16px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.06)",
                        }}
                    >
                        {NAV_ITEMS.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => scrollToSection(i)}
                                onMouseEnter={() => setHovNav(i)}
                                onMouseLeave={() => setHovNav(-1)}
                                style={{
                                    fontFamily: I,
                                    fontSize: 12,
                                    fontWeight: active === i ? 600 : 500,
                                    color: active === i ? T.ink : hovNav === i ? T.ink2 : T.ink3,
                                    backgroundColor:
                                        active === i ? "#EBEBEA" : hovNav === i ? "rgba(0,0,0,0.04)" : "transparent",
                                    border: "none",
                                    borderRadius: 30,
                                    padding: "7px 16px",
                                    cursor: "pointer",
                                    outline: "none",
                                    transition: "color 0.15s, background 0.15s",
                                    whiteSpace: "nowrap" as const,
                                    lineHeight: 1,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                {s.num} — {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* [01] Visual Design */}
                <div ref={ref0} style={{ paddingTop: 72, marginBottom: 80 }}>
                    <SectionHeader {...SECTIONS[0]} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                            <div style={{ borderRadius: 10, overflow: "hidden", height: 380 }}>
                                <iframe
                                    src="https://drive.google.com/file/d/17mAqwjd1149huegPzatDpfd9-PGleLLT/preview"
                                    width="100%"
                                    height="100%"
                                    style={{ border: "none", display: "block" }}
                                />
                            </div>
                            <div style={{ borderRadius: 10, overflow: "hidden", height: 340, position: "relative" as const }}>
                                <iframe
                                    loading="lazy"
                                    src="https://www.canva.com/design/DAHJZiSLxGs/h1POtcf2Rq5YpGXLhXy1eA/view?embed"
                                    style={{
                                        position: "absolute" as const,
                                        width: "100%",
                                        height: "100%",
                                        top: 0,
                                        left: 0,
                                        border: "none",
                                    }}
                                    allowFullScreen
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                            {VISUAL_IMAGES.map((src, i) => (
                                <div key={i} style={{ borderRadius: 10, overflow: "hidden", flex: 1, minHeight: 0 }}>
                                    <img
                                        src={src}
                                        alt=""
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* [02] Photography */}
                <div ref={ref1} style={{ paddingTop: 72, marginBottom: 80 }}>
                    <SectionHeader {...SECTIONS[1]} />
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <PhotoCard src={PHOTOS[0]} aspectRatio="3/2" />
                            <PhotoCard src={PHOTOS[1]} aspectRatio="3/2" />
                        </div>
                        <PhotoCard src={PHOTOS[2]} aspectRatio="16/7" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                            <PhotoCard src={PHOTOS[3]} aspectRatio="3/2" />
                            <PhotoCard src={PHOTOS[4]} aspectRatio="3/2" />
                            <PhotoCard src={PHOTOS[5]} aspectRatio="3/2" />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <PhotoCard src={PHOTOS[6]} aspectRatio="3/2" />
                            <PhotoCard src={PHOTOS[7]} aspectRatio="3/2" />
                        </div>
                    </div>
                </div>

                {/* [03] Motion */}
                <div ref={ref2} style={{ paddingTop: 72, marginBottom: 80 }}>
                    <SectionHeader {...SECTIONS[2]} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                        {MOTION_EMBEDS.map((src, i) => (
                            <EmbedFrame key={i} src={src} />
                        ))}
                    </div>
                </div>

                {/* [04] Projects */}
                <div ref={ref3} style={{ paddingTop: 72, marginBottom: 80 }}>
                    <SectionHeader {...SECTIONS[3]} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {PROJECTS_EMBEDS.map((src, i) => (
                            <EmbedFrame key={i} src={src} />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        paddingTop: 48,
                        borderTop: `1px solid ${T.border}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <a
                        href="/#work"
                        style={{
                            fontFamily: I,
                            fontSize: 14,
                            fontWeight: 500,
                            color: T.ink3,
                            textDecoration: "none",
                            letterSpacing: "-0.01em",
                            transition: "color 0.18s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = T.ink3)}
                    >
                        ← Back to work
                    </a>
                    <p style={{ fontFamily: I, fontSize: 12, color: T.muted, margin: 0 }}>
                        © {new Date().getFullYear()} Omisha Chabria
                    </p>
                </div>
            </div>
        </div>
    )
}
