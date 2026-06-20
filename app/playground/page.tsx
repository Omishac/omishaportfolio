"use client"

import { useState, useEffect } from "react"
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

const SECTIONS = [
    { num: "01", title: "Visual Design & Branding", desc: "Brand identities, posters, and creative direction." },
    { num: "02", title: "Photography", desc: "Personal photography — light, texture, and moment." },
    { num: "03", title: "Motion", desc: "Video editing and motion design experiments." },
    { num: "04", title: "Projects", desc: "Miscellaneous work made for the love of making." },
]

function useResponsive() {
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    useEffect(() => {
        const check = () => {
            const w = window.innerWidth
            setPhone(w < 768)
            setTablet(w >= 768 && w < 1024)
        }
        check()
        window.addEventListener("resize", check, { passive: true })
        return () => window.removeEventListener("resize", check)
    }, [])
    return { phone, tablet, desktop: !phone && !tablet }
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

const SIDE_NAV_SECTIONS = [
    { id: "visual-design", label: "Visual Design" },
    { id: "photography", label: "Photography" },
    { id: "motion", label: "Motion" },
    { id: "projects", label: "Projects" },
]

function SideNav({ active }: { active: string }) {
    return (
        <nav>
            {SIDE_NAV_SECTIONS.map(({ id, label }) => {
                const isActive = active === id
                return (
                    <a key={id} href={`#${id}`}
                        onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                        style={{
                            display: "block", padding: "6px 0",
                            textDecoration: "none", transition: "opacity 0.3s ease",
                            opacity: isActive ? 1 : 0.3,
                        }}
                    >
                        <span style={{
                            fontFamily: I, fontSize: 10, fontWeight: isActive ? 700 : 400,
                            color: T.ink, letterSpacing: "0.06em", textTransform: "uppercase",
                            transition: "font-weight 0.2s",
                            borderLeft: isActive ? `2px solid ${T.muted}` : "2px solid transparent",
                            paddingLeft: 12,
                        }}>
                            {label}
                        </span>
                    </a>
                )
            })}
        </nav>
    )
}

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
                        fontSize: "clamp(22px, 3vw, 36px)",
                        color: T.ink,
                        margin: "0 0 6px",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                    }}
                >
                    {title}
                </h2>
                <p style={{ fontFamily: I, fontSize: 14, color: T.ink3, margin: 0, lineHeight: 1.5 }}>
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
                    maxWidth: "100%",
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
    const { phone, tablet, desktop } = useResponsive()
    const activeSection = useActiveSection(SIDE_NAV_SECTIONS.map(s => s.id))
    const px = phone ? 20 : tablet ? 40 : 80

    return (
        <div style={{ width: "100%", backgroundColor: "#fff", fontFamily: I }}>
            <SharedNav />
            <div style={{
                display: desktop ? "grid" : "block",
                gridTemplateColumns: desktop ? "140px 1fr" : undefined,
                gap: desktop ? 48 : undefined,
                maxWidth: 1400,
                margin: "0 auto",
                padding: `0 ${px}px 180px`,
            }}>
                {desktop && (
                    <aside>
                        <div style={{ position: "sticky", top: 80, paddingTop: 40 }}>
                            <SideNav active={activeSection} />
                        </div>
                    </aside>
                )}
                <div>
                {/* Hero */}
                <div style={{ paddingTop: phone ? 48 : 40, paddingBottom: 48 }}>
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
                            fontSize: "clamp(28px, 5vw, 52px)",
                            lineHeight: 1.06,
                            letterSpacing: "-0.025em",
                            color: T.ink,
                            margin: "0 0 16px",
                            maxWidth: 600,
                        }}
                    >
                        Experiments, explorations, and creative work.
                    </h1>
                    <p style={{ fontFamily: I, fontSize: phone ? 14 : 15, lineHeight: 1.7, color: T.ink3, margin: 0, maxWidth: 480 }}>
                        Not case studies. Just things made for the love of making.
                    </p>
                </div>

                {/* [01] Visual Design */}
                <div id="visual-design" style={{ scrollMarginTop: 80, paddingTop: 72, marginBottom: 80 }}>
                    <SectionHeader {...SECTIONS[0]} />
                    <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr", gap: 14 }}>
                        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                            <div style={{ borderRadius: 10, overflow: "hidden", height: phone ? 240 : 380 }}>
                                <iframe
                                    src="https://drive.google.com/file/d/17mAqwjd1149huegPzatDpfd9-PGleLLT/preview"
                                    width="100%"
                                    height="100%"
                                    style={{ border: "none", display: "block" }}
                                />
                            </div>
                            <div style={{ borderRadius: 10, overflow: "hidden", height: phone ? 200 : 340, position: "relative" as const }}>
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
                                <div key={i} style={{ borderRadius: 10, overflow: "hidden", flex: phone ? "none" : 1, minHeight: phone ? 200 : 0 }}>
                                    <img
                                        src={src}
                                        alt=""
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", maxWidth: "100%" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* [02] Photography */}
                <div id="photography" style={{ scrollMarginTop: 80, paddingTop: 72, marginBottom: 80 }}>
                    <SectionHeader {...SECTIONS[1]} />
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                        <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr", gap: 12 }}>
                            <PhotoCard src={PHOTOS[0]} aspectRatio="3/2" />
                            <PhotoCard src={PHOTOS[1]} aspectRatio="3/2" />
                        </div>
                        <PhotoCard src={PHOTOS[2]} aspectRatio={phone ? "3/2" : "16/7"} />
                        <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
                            <PhotoCard src={PHOTOS[3]} aspectRatio="3/2" />
                            <PhotoCard src={PHOTOS[4]} aspectRatio="3/2" />
                            <PhotoCard src={PHOTOS[5]} aspectRatio="3/2" />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr", gap: 12 }}>
                            <PhotoCard src={PHOTOS[6]} aspectRatio="3/2" />
                            <PhotoCard src={PHOTOS[7]} aspectRatio="3/2" />
                        </div>
                    </div>
                </div>

                {/* [03] Motion */}
                <div id="motion" style={{ scrollMarginTop: 80, paddingTop: 72, marginBottom: 80 }}>
                    <SectionHeader {...SECTIONS[2]} />
                    <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
                        {MOTION_EMBEDS.map((src, i) => (
                            <EmbedFrame key={i} src={src} />
                        ))}
                    </div>
                </div>

                {/* [04] Projects */}
                <div id="projects" style={{ scrollMarginTop: 80, paddingTop: 72, marginBottom: 80 }}>
                    <SectionHeader {...SECTIONS[3]} />
                    <div style={{ display: "grid", gridTemplateColumns: phone ? "1fr" : "1fr 1fr", gap: 14 }}>
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
                        flexWrap: "wrap",
                        gap: 12,
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
                            minHeight: 44,
                            display: "flex",
                            alignItems: "center",
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
        </div>
    )
}
