"use client"

import { useState, useEffect } from "react"
import SharedNav from "../../components/SharedNav"
import { FONT_SANS, COLORS, EASE_SPRING, EASE_OUT, HoverLetters, BracketTag } from "../../components/site"

// Homepage tokens (components/site.tsx): Inter, neutral palette, same easing.
const I = FONT_SANS
const C = COLORS

// Photos with their real aspect ratios (width / height), so nothing is cropped.
const PHOTOS = [
    { src: "https://framerusercontent.com/images/6JftouJBmFzzRoc5kGehzD49bI.jpg", ar: 512 / 340 },
    { src: "https://framerusercontent.com/images/WNhHwDJtvXf2ddWyDKeqzLEDIMM.jpg", ar: 373 / 512 },
    { src: "https://framerusercontent.com/images/jRADc4G9lgSPtWGjfIkY79DgPw.jpg", ar: 512 / 339 },
    { src: "https://framerusercontent.com/images/p0iCcKAZ6YkN0bYXoNMQIkgsc.jpg", ar: 512 / 340 },
    { src: "https://framerusercontent.com/images/7d8mXeVlUskoq2jVfYUldAwYCAY.jpg", ar: 512 / 339 },
    { src: "https://framerusercontent.com/images/SBGGzzRNM3cxaY7mXbbdjPjHI.jpg", ar: 512 / 339 },
    { src: "https://framerusercontent.com/images/DvwhBGDVHs70NCAmanEeQYoDOs.jpg", ar: 512 / 326 },
    { src: "https://framerusercontent.com/images/RsJK9eqQ0yxwUF9pZeKS4JHsBE.jpg", ar: 512 / 339 },
]
// Rows of the photo gallery (indexes into PHOTOS). Each row is justified:
// every photo in a row shares one height, widths follow the aspect ratio.
const PHOTO_ROWS = [[0, 1], [2, 3], [4, 5], [6, 7]] // pairs keep row heights close

const VISUAL_IMAGES = [
    "https://framerusercontent.com/images/5iCEQ0frJyGbnjCBQb68ThJHAvg.png",
    "/images/image-1783027241246.png",
]

// Motion: lead with the finished, titled piece; the vertical clip gets a
// portrait frame instead of being pillarboxed inside 16:9.
const MOTION = {
    feature: { src: "https://www.canva.com/design/DAHJZrqnmsE/6S17BE9bGV_u6BT_OdhVhA/watch?embed", title: "Kolkata Food Crawl" },
    skyline: { src: "https://www.canva.com/design/DAHFL_7oX_Y/RMm3KsCaL30KVsZ6jOuKhw/watch?embed", title: "City skyline from the road" },
    vertical: { src: "https://www.canva.com/design/DAHEvJgim7M/DtchAXWYjHURuX8Vm3Xl1A/watch?embed", title: "Vertical video edit" },
}

const PROJECTS_EMBEDS = [
    "https://www.canva.com/design/DAG74qzfc1A/ndx1i9o6UMKSdNRT-e1r2g/view?embed",
    "https://www.canva.com/design/DAGHGUDI4ys/Gpz0zcbqhG10kzndXwnaYw/view?embed",
    "https://www.canva.com/design/DAGzA1ts_Wo/L0cTtF-lK8ODJUwg5bTv5Q/view?embed",
    "https://www.canva.com/design/DAGxGinBSuE/ipGt5HbXqLNmofmGAt0yUw/view?embed",
]

const SECTIONS = [
    { id: "visual-design", num: "01", title: "Visual Design & Branding", desc: "Brand identities, posters, and creative direction." },
    { id: "photography", num: "02", title: "Photography", desc: "Personal photography: light, texture, and moment." },
    { id: "motion", num: "03", title: "Motion", desc: "Video editing and motion design experiments." },
    { id: "projects", num: "04", title: "Projects", desc: "Miscellaneous work made for the love of making." },
]

// Homepage-style hover: the image lifts slightly off the page with a soft
// shadow (same feel as the case study cards). Off under reduced motion.
const PAGE_STYLES = `
.pg-lift { transition: transform 0.5s ${EASE_OUT}, box-shadow 0.5s ${EASE_OUT}; }
@media (hover: hover) and (pointer: fine) {
  .pg-lift:hover { transform: translateY(-4px); box-shadow: 0 18px 28px -18px rgba(17,17,17,0.28), 0 2px 6px rgba(17,17,17,0.06); }
}
.pg-index a { color: ${C.ink3}; text-decoration: none; transition: color 0.2s ease; }
.pg-index a:hover, .pg-index a:focus-visible { color: ${C.ink}; }
.pg-index a:focus-visible { outline: 1.5px dashed ${C.ink}; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  .pg-lift { transition: none; }
  .pg-lift:hover { transform: none; }
}
`

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

// Homepage section label: "[ 01 ]" tag over a light Inter title, short description below.
function SectionHeader({ num, title, desc, phone, tablet, large }: { num: string; title: string; desc: string; phone: boolean; tablet: boolean; large: boolean }) {
    return (
        <div style={{ marginBottom: phone ? 24 : tablet ? 32 : 40 }}>
            <BracketTag style={{ marginBottom: 10 }}>{num}</BracketTag>
            <h2 style={{ fontFamily: I, fontWeight: 200, fontSize: phone ? 26 : tablet ? 30 : large ? 40 : 36, color: C.ink, margin: 0, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                <HoverLetters text={title} />
            </h2>
            <p style={{ fontFamily: I, fontSize: 14, color: C.ink3, margin: 0, marginTop: 10, lineHeight: 1.55 }}>{desc}</p>
        </div>
    )
}

function EmbedFrame({ src, aspect = "16/9", fill = false, title }: { src: string; aspect?: string; fill?: boolean; title?: string }) {
    return (
        <div style={{
            width: "100%",
            // fill: take the height of the grid area instead of a fixed ratio
            ...(fill ? { height: "100%" } : { aspectRatio: aspect }),
            overflow: "hidden",
            backgroundColor: C.paper,
            position: "relative",
        }}>
            <iframe loading="lazy" src={src} title={title}
                style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, border: "none" }}
                allowFullScreen />
        </div>
    )
}

export default function PlaygroundPage() {
    const { phone, tablet, large } = useResponsive()
    // Same page padding and content width as the homepage.
    const px = phone ? 20 : tablet ? 40 : large ? 120 : 80
    const maxW = large ? 1280 : 1040
    const sectionGap = phone ? 72 : tablet ? 96 : 120
    const gap = phone ? 12 : 16 // gutter inside galleries

    return (
        <div style={{ width: "100%", backgroundColor: C.bg, fontFamily: I }}>
            <SharedNav />
            <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

            <main style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${px}px 120px`, boxSizing: "content-box" }}>

                {/* ── Introduction ── */}
                <header style={{ paddingTop: phone ? 48 : 72 }}>
                    <BracketTag style={{ marginBottom: 12 }}>Playground</BracketTag>
                    <h1 style={{ fontFamily: I, fontWeight: 200, fontSize: "clamp(32px, 4.4vw, 52px)", lineHeight: 1.08, letterSpacing: "-0.025em", color: C.ink, margin: 0, maxWidth: 720, textWrap: "balance" }}>
                        <HoverLetters text="Experiments, explorations, and creative work." />
                    </h1>
                    <p style={{ fontFamily: I, fontSize: phone ? 15 : 16, lineHeight: 1.65, color: C.ink3, margin: 0, marginTop: 16, maxWidth: 480 }}>
                        Not case studies. Just things made for the love of making.
                    </p>

                    {/* Section index: jump straight to a gallery */}
                    <nav aria-label="Playground sections" className="pg-index" style={{
                        display: "grid",
                        gridTemplateColumns: phone ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
                        columnGap: 24, rowGap: 4,
                        marginTop: phone ? 36 : 48,
                        borderTop: `1px solid ${C.border}`,
                    }}>
                        {SECTIONS.map((s) => (
                            <a key={s.id} href={`#${s.id}`}
                                onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
                                style={{ display: "flex", gap: 10, alignItems: "baseline", padding: "14px 0", fontFamily: I, fontSize: 14 }}>
                                <span style={{ fontSize: 10, color: C.muted, letterSpacing: "0.06em" }}>{s.num}</span>
                                {s.title}
                            </a>
                        ))}
                    </nav>
                </header>

                {/* ── 01 Visual Design & Branding ── */}
                <section id="visual-design" style={{ scrollMarginTop: 88, marginTop: sectionGap }}>
                    <SectionHeader {...SECTIONS[0]} phone={phone} tablet={tablet} large={large} />
                    {/* 2×2 of matching 4:3 frames; images are contained, never cropped */}
                    <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))", gap }}>
                        <div style={{ aspectRatio: "4 / 3", overflow: "hidden", backgroundColor: C.paper }}>
                            <iframe src="https://drive.google.com/file/d/17mAqwjd1149huegPzatDpfd9-PGleLLT/preview" title="Brand identity document"
                                width="100%" height="100%" style={{ border: "none", display: "block" }} />
                        </div>
                        <div className="pg-lift" style={{ aspectRatio: "4 / 3", backgroundColor: C.paper, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src={VISUAL_IMAGES[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                        </div>
                        <EmbedFrame src="https://www.canva.com/design/DAHJZiSLxGs/h1POtcf2Rq5YpGXLhXy1eA/view?embed" aspect="4/3" />
                        <div className="pg-lift" style={{ aspectRatio: "4 / 3", backgroundColor: C.paper, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src={VISUAL_IMAGES[1]} alt="" style={{ height: "78%", width: "auto", maxWidth: "88%", objectFit: "contain", display: "block" }} />
                        </div>
                    </div>
                </section>

                {/* ── 02 Photography ── */}
                <section id="photography" style={{ scrollMarginTop: 88, marginTop: sectionGap }}>
                    <SectionHeader {...SECTIONS[1]} phone={phone} tablet={tablet} large={large} />
                    <div style={{ display: "flex", flexDirection: "column", gap }}>
                        {PHOTO_ROWS.map((row, ri) => (
                            // Justified row: flex-grow = aspect ratio gives every photo
                            // in the row the same height at its true proportions.
                            <div key={ri} style={{ display: "flex", flexDirection: phone ? "column" : "row", gap }}>
                                {row.map((pi) => (
                                    <div key={pi} className="pg-lift" style={{
                                        flex: phone ? "none" : `${PHOTOS[pi].ar} 1 0`,
                                        aspectRatio: `${PHOTOS[pi].ar}`,
                                        overflow: "hidden",
                                        backgroundColor: C.paper,
                                        minWidth: 0,
                                    }}>
                                        <img src={PHOTOS[pi].src} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── 03 Motion ── */}
                <section id="motion" style={{ scrollMarginTop: 88, marginTop: sectionGap }}>
                    <SectionHeader {...SECTIONS[2]} phone={phone} tablet={tablet} large={large} />
                    {/* Two 16:9 videos stacked on the left; the vertical clip spans both rows
                        on the right. 1.55:1 columns keep it at about 9:16 at that height. */}
                    <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "minmax(0, 1.55fr) minmax(0, 1fr)", gap }}>
                        <div style={{ gridColumn: phone ? undefined : 1, gridRow: phone ? undefined : 1 }}>
                            <EmbedFrame src={MOTION.feature.src} title={MOTION.feature.title} />
                        </div>
                        <div style={{ gridColumn: phone ? undefined : 1, gridRow: phone ? undefined : 2 }}>
                            <EmbedFrame src={MOTION.skyline.src} title={MOTION.skyline.title} />
                        </div>
                        <div style={{
                            gridColumn: phone ? undefined : 2,
                            gridRow: phone ? undefined : "1 / span 2",
                            width: phone ? "min(100%, 280px)" : undefined,
                            justifySelf: phone ? "center" : undefined,
                        }}>
                            <EmbedFrame src={MOTION.vertical.src} title={MOTION.vertical.title} aspect="9/16" fill={!phone} />
                        </div>
                    </div>
                </section>

                {/* ── 04 Projects ── */}
                <section id="projects" style={{ scrollMarginTop: 88, marginTop: sectionGap }}>
                    <SectionHeader {...SECTIONS[3]} phone={phone} tablet={tablet} large={large} />
                    <div style={{ display: "grid", gridTemplateColumns: phone ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))", gap }}>
                        {PROJECTS_EMBEDS.map((src, i) => (
                            <EmbedFrame key={i} src={src} />
                        ))}
                    </div>
                </section>

                {/* ── Footer ── */}
                <div style={{ marginTop: sectionGap, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <a href="/#work"
                        style={{ fontFamily: I, fontSize: 14, color: C.ink3, textDecoration: "none", transition: `color 0.2s ${EASE_SPRING}`, minHeight: 44, display: "flex", alignItems: "center" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = C.ink3)}
                    >
                        ← Back to work
                    </a>
                    <p style={{ fontFamily: I, fontSize: 12, color: C.muted, margin: 0 }}>
                        © {new Date().getFullYear()} Omisha Chabria
                    </p>
                </div>
            </main>
        </div>
    )
}
