"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const INTER = "Inter, system-ui, sans-serif"
const Z = "Zodiak, 'Times New Roman', serif"
const PINK = "#E8B4C8"
const PAPER = "rgba(248, 245, 240, 0.97)"
const INK = "#2A2A28"
const INK_L = "#8A8A82"
const EO: [number, number, number, number] = [0.22, 1, 0.36, 1]
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E")`

const NOTE_LINES = [
    "case studies,",
    "you got this.",
    "",
    "show the research.",
    "show the impact.",
    "tell the story.",
]

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
    const [ph, setPh] = useState(false)
    const [reduced, setReduced] = useState(false)

    const [scene, setScene] = useState(0)
    const [showWelcome, setShowWelcome] = useState(false)
    const [showPep, setShowPep] = useState(false)
    const [paperIn, setPaperIn] = useState(false)
    const [typed, setTyped] = useState(["", "", "", "", "", ""])
    const [curLine, setCurLine] = useState(-1)
    const [doodlesIn, setDoodlesIn] = useState(false)
    const [sketchPhase, setSketchPhase] = useState(0)
    const [wireframePhase, setWireframePhase] = useState(0)
    const [zoomIn, setZoomIn] = useState(false)
    const [fadeToSite, setFadeToSite] = useState(false)
    const [wipeOut, setWipeOut] = useState(false)
    const skipRef = useRef(false)

    useEffect(() => {
        setPh(window.innerWidth < 768)
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        const h = () => setPh(window.innerWidth < 768)
        window.addEventListener("resize", h, { passive: true })
        return () => window.removeEventListener("resize", h)
    }, [])

    const skip = useCallback(() => {
        if (skipRef.current) return
        skipRef.current = true
        onComplete()
    }, [onComplete])

    useEffect(() => {
        if (reduced) { onComplete(); return }
        const t: ReturnType<typeof setTimeout>[] = []

        // ─── Scene 1: Welcome ───
        t.push(setTimeout(() => setShowWelcome(true), 400))
        t.push(setTimeout(() => setShowWelcome(false), 2000))
        t.push(setTimeout(() => setShowPep(true), 2500))
        t.push(setTimeout(() => setShowPep(false), 4200))

        // ─── Scene 2: Handwritten note ───
        t.push(setTimeout(() => { setScene(2); setPaperIn(true) }, 4700))

        const starts = [5100, 5800, 6300, 6400, 7000, 7600]
        const speeds = [44, 44, 0, 38, 38, 38]
        NOTE_LINES.forEach((line, li) => {
            if (line === "") return
            t.push(setTimeout(() => setCurLine(li), starts[li]))
            for (let ci = 1; ci <= line.length; ci++) {
                t.push(setTimeout(() => {
                    setTyped(p => { const n = [...p]; n[li] = line.slice(0, ci); return n })
                }, starts[li] + ci * speeds[li]))
            }
        })
        t.push(setTimeout(() => setCurLine(-1), 8300))
        t.push(setTimeout(() => setDoodlesIn(true), 8500))

        // Hold for reading
        // ─── Scene 3: Note transforms to sketches ───
        t.push(setTimeout(() => { setScene(3); setSketchPhase(1) }, 10000))
        t.push(setTimeout(() => setSketchPhase(2), 10800))
        t.push(setTimeout(() => setSketchPhase(3), 11600))

        // ─── Scene 4: Sketches become wireframes ───
        t.push(setTimeout(() => { setScene(4); setWireframePhase(1) }, 12500))
        t.push(setTimeout(() => setWireframePhase(2), 13300))
        t.push(setTimeout(() => setWireframePhase(3), 14000))

        // ─── Scene 5: Zoom into wireframe → reveal homepage ───
        t.push(setTimeout(() => { setScene(5); setZoomIn(true) }, 14800))
        t.push(setTimeout(() => setFadeToSite(true), 15800))
        t.push(setTimeout(() => setWipeOut(true), 16600))
        t.push(setTimeout(() => {
            if (!skipRef.current) { skipRef.current = true; onComplete() }
        }, 17400))

        return () => t.forEach(clearTimeout)
    }, [onComplete, reduced])

    if (reduced) return null

    const pw = ph ? 250 : 340
    const noteH = ph ? 260 : 340

    return (
        <motion.div style={{
            position: "fixed", inset: 0, zIndex: 10000,
            backgroundColor: "#0A0A0A", backgroundImage: GRAIN, backgroundSize: "200px",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
            {/* Skip */}
            <motion.button
                onClick={skip}
                initial={{ opacity: 0 }}
                animate={{ opacity: wipeOut ? 0 : 0.8 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                style={{
                    position: "absolute", top: ph ? 16 : 24, right: ph ? 16 : 32,
                    background: "none", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20, padding: "6px 16px", cursor: "pointer", zIndex: 20,
                }}
            >
                <span style={{
                    fontFamily: INTER, fontSize: 11, fontWeight: 500,
                    color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em",
                }}>Skip Intro</span>
            </motion.button>

            {/* ════════════ SCENE 1: Welcome ════════════ */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.7, ease: EO }}
                        style={{ position: "absolute", zIndex: 3 }}
                    >
                        <span style={{
                            fontFamily: Z, fontSize: ph ? 28 : 40,
                            color: "#fff", fontStyle: "italic", fontWeight: 400,
                        }}>Welcome.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPep && (
                    <motion.div
                        key="pep"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.6, ease: EO }}
                        style={{ position: "absolute", zIndex: 3, textAlign: "center", padding: "0 32px" }}
                    >
                        <span style={{
                            fontFamily: INTER, fontSize: ph ? 13 : 15,
                            color: "rgba(255,255,255,0.45)", fontStyle: "italic",
                        }}>let me give my case studies a quick pep talk...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ════════════ SCENE 2: Handwritten Note ════════════ */}
            {scene === 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.8 }}
                    transition={{ duration: 0.7, ease: EO }}
                    style={{
                        position: "absolute", width: pw, minHeight: noteH,
                        backgroundColor: PAPER, borderRadius: 2,
                        padding: ph ? "30px 24px 36px" : "38px 34px 46px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.45), 0 3px 10px rgba(0,0,0,0.3)",
                        zIndex: 4,
                    }}
                >
                    {/* Hand-drawn border */}
                    <svg style={{ position: "absolute", inset: -1, width: "calc(100% + 2px)", height: "calc(100% + 2px)", pointerEvents: "none" }}>
                        <motion.rect
                            x="1" y="1" rx="2" ry="2"
                            width="calc(100% - 2px)" height="calc(100% - 2px)"
                            fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2"
                            strokeDasharray="4 3"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2, delay: 0.3, ease: EO }}
                        />
                    </svg>

                    {/* Ruled lines */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} style={{
                            position: "absolute",
                            left: ph ? 22 : 32, right: ph ? 22 : 32,
                            top: (ph ? 38 : 48) + i * (ph ? 24 : 30),
                            height: 1, backgroundColor: "rgba(0,0,0,0.035)",
                        }} />
                    ))}
                    {/* Red margin */}
                    <div style={{
                        position: "absolute", left: ph ? 36 : 48,
                        top: 0, bottom: 0, width: 1,
                        backgroundColor: "rgba(200,80,80,0.08)",
                    }} />

                    {/* Text lines */}
                    {NOTE_LINES.map((full, i) => {
                        if (full === "") return <div key={i} style={{ height: ph ? 8 : 12 }} />
                        const hdr = i <= 1
                        return (
                            <p key={i} style={{
                                fontFamily: hdr ? Z : INTER,
                                fontStyle: "italic",
                                fontWeight: i === 1 ? 500 : 400,
                                fontSize: ph
                                    ? (hdr ? (i === 1 ? 16 : 14) : 10.5)
                                    : (hdr ? (i === 1 ? 21 : 18) : 12.5),
                                color: hdr ? INK : INK_L,
                                lineHeight: 1.55,
                                margin: `${i === 0 ? 0 : i === 3 ? 0 : (ph ? 2 : 4)}px 0 0 ${ph ? 18 : 22}px`,
                                minHeight: ph ? (hdr ? 22 : 17) : (hdr ? 28 : 20),
                                position: "relative", zIndex: 2,
                                visibility: typed[i].length > 0 || curLine === i ? "visible" : "hidden",
                            }}>
                                {typed[i]}
                                {curLine === i && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                        style={{ color: PINK, fontWeight: 300, marginLeft: 1 }}
                                    >|</motion.span>
                                )}
                            </p>
                        )
                    })}

                    {/* Doodles */}
                    {doodlesIn && (
                        <>
                            {/* Star */}
                            <motion.svg width="14" height="14" viewBox="0 0 14 14"
                                style={{ position: "absolute", top: ph ? 10 : 14, right: ph ? 14 : 18 }}
                                initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                                animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
                                transition={{ duration: 0.5, ease: EO }}
                            >
                                <motion.path
                                    d="M7 1 L8.4 5.2 L13 5.5 L9.6 8.4 L10.6 13 L7 10.5 L3.4 13 L4.4 8.4 L1 5.5 L5.6 5.2 Z"
                                    fill="none" stroke={PINK} strokeWidth="1" strokeLinejoin="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: EO }}
                                />
                            </motion.svg>

                            {/* Wavy underline under "you got this" */}
                            <motion.svg
                                width={ph ? 55 : 75} height="6" viewBox="0 0 75 6"
                                style={{
                                    position: "absolute",
                                    top: (ph ? 38 : 48) + (ph ? 24 : 30) + (ph ? 3 : 4),
                                    left: ph ? 50 : 66, zIndex: 5,
                                }}
                                initial={{ opacity: 0 }} animate={{ opacity: 0.45 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <motion.path
                                    d="M0 3 Q9.4 0 18.75 3 T37.5 3 T56.25 3 T75 3"
                                    fill="none" stroke={PINK} strokeWidth="1.2" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.25, ease: EO }}
                                />
                            </motion.svg>

                            {/* Arrow */}
                            <motion.svg width="18" height="18" viewBox="0 0 18 18"
                                style={{ position: "absolute", bottom: ph ? 40 : 54, right: ph ? 16 : 22 }}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 0.35, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3, ease: EO }}
                            >
                                <motion.path
                                    d="M2 9 L14 9 M10 5 L14 9 L10 13"
                                    fill="none" stroke={INK_L} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.4, delay: 0.35, ease: EO }}
                                />
                            </motion.svg>

                            {/* Checkmark */}
                            <motion.svg width="12" height="12" viewBox="0 0 12 12"
                                style={{ position: "absolute", bottom: ph ? 14 : 18, left: ph ? 14 : 18 }}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 0.4, scale: 1 }}
                                transition={{ duration: 0.35, delay: 0.45, ease: EO }}
                            >
                                <motion.path
                                    d="M2 6.5 L4.8 9 L10 3"
                                    fill="none" stroke={PINK} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.4, delay: 0.5, ease: EO }}
                                />
                            </motion.svg>
                        </>
                    )}
                </motion.div>
            )}

            {/* ════════════ SCENE 3: Sketch Transformation ════════════ */}
            {scene === 3 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: EO }}
                    style={{
                        position: "absolute", width: ph ? 280 : 400, height: ph ? 280 : 380,
                        zIndex: 4,
                    }}
                >
                    {/* Background paper */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "absolute", inset: 0,
                            backgroundColor: PAPER, borderRadius: 3,
                            boxShadow: "0 16px 50px rgba(0,0,0,0.4)",
                        }}
                    />

                    {/* Fading handwritten text */}
                    <motion.div
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: sketchPhase >= 2 ? 0 : 0.3 }}
                        transition={{ duration: 1.0 }}
                        style={{
                            position: "absolute", top: ph ? 20 : 28, left: ph ? 24 : 34,
                            fontFamily: Z, fontStyle: "italic", fontSize: ph ? 10 : 12,
                            color: INK_L, lineHeight: 1.8, zIndex: 2,
                        }}
                    >
                        {NOTE_LINES.filter(l => l).map((l, i) => <div key={i}>{l}</div>)}
                    </motion.div>

                    {/* Sketch elements appearing */}
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 3 }}>
                        {/* Header bar sketch */}
                        {sketchPhase >= 1 && (
                            <motion.rect
                                x={ph ? 20 : 30} y={ph ? 20 : 28}
                                width={ph ? 240 : 340} height={ph ? 16 : 20}
                                rx="2" fill="none" stroke={INK_L} strokeWidth="0.8"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.5 }}
                                transition={{ duration: 0.7, ease: EO }}
                            />
                        )}
                        {/* Nav dots */}
                        {sketchPhase >= 1 && [0, 1, 2].map(i => (
                            <motion.circle
                                key={`nav${i}`}
                                cx={(ph ? 30 : 42) + i * (ph ? 18 : 24)} cy={ph ? 28 : 38}
                                r={ph ? 2 : 2.5}
                                fill="none" stroke={INK_L} strokeWidth="0.7"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.4 }}
                                transition={{ duration: 0.3, delay: 0.3 + i * 0.1, ease: EO }}
                            />
                        ))}

                        {/* Hero text lines */}
                        {sketchPhase >= 1 && (
                            <>
                                <motion.line
                                    x1={ph ? 20 : 30} y1={ph ? 60 : 80}
                                    x2={ph ? 180 : 260} y2={ph ? 60 : 80}
                                    stroke={INK} strokeWidth="1.5" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4, ease: EO }}
                                />
                                <motion.line
                                    x1={ph ? 20 : 30} y1={ph ? 72 : 96}
                                    x2={ph ? 140 : 200} y2={ph ? 72 : 96}
                                    stroke={INK_L} strokeWidth="0.9" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.4, delay: 0.6, ease: EO }}
                                />
                            </>
                        )}

                        {/* Content boxes */}
                        {sketchPhase >= 2 && (
                            <>
                                <motion.rect
                                    x={ph ? 20 : 30} y={ph ? 95 : 128}
                                    width={ph ? 110 : 160} height={ph ? 65 : 90}
                                    rx="3" fill="none" stroke={INK_L} strokeWidth="0.7"
                                    strokeDasharray="3 2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.45 }}
                                    transition={{ duration: 0.6, ease: EO }}
                                />
                                <motion.rect
                                    x={ph ? 140 : 200} y={ph ? 95 : 128}
                                    width={ph ? 110 : 160} height={ph ? 65 : 90}
                                    rx="3" fill="none" stroke={INK_L} strokeWidth="0.7"
                                    strokeDasharray="3 2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.45 }}
                                    transition={{ duration: 0.6, delay: 0.15, ease: EO }}
                                />
                            </>
                        )}

                        {/* Squiggly annotations */}
                        {sketchPhase >= 2 && (
                            <>
                                <motion.path
                                    d={ph
                                        ? "M25 170 Q40 166 55 170 T85 170"
                                        : "M36 230 Q56 224 76 230 T116 230"}
                                    fill="none" stroke={PINK} strokeWidth="0.9" strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.5 }}
                                    transition={{ duration: 0.5, delay: 0.3, ease: EO }}
                                />
                                <motion.path
                                    d={ph
                                        ? "M145 170 L160 166 L175 172"
                                        : "M206 230 L226 224 L246 232"}
                                    fill="none" stroke={INK_L} strokeWidth="0.7" strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.35 }}
                                    transition={{ duration: 0.4, delay: 0.5, ease: EO }}
                                />
                            </>
                        )}

                        {/* Sticky-note style comments */}
                        {sketchPhase >= 3 && (
                            <>
                                <motion.rect
                                    x={ph ? 20 : 30} y={ph ? 185 : 250}
                                    width={ph ? 55 : 75} height={ph ? 22 : 28}
                                    rx="1" fill="rgba(255,230,150,0.3)"
                                    stroke="rgba(200,180,100,0.3)" strokeWidth="0.6"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: EO }}
                                />
                                <motion.line
                                    x1={ph ? 26 : 38} y1={ph ? 196 : 265}
                                    x2={ph ? 65 : 92} y2={ph ? 196 : 265}
                                    stroke="rgba(140,130,80,0.35)" strokeWidth="0.6"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2, ease: EO }}
                                />
                            </>
                        )}

                        {/* More boxes + arrows for richness */}
                        {sketchPhase >= 3 && (
                            <>
                                <motion.rect
                                    x={ph ? 20 : 30} y={ph ? 220 : 295}
                                    width={ph ? 240 : 340} height={ph ? 30 : 40}
                                    rx="2" fill="none" stroke={INK_L} strokeWidth="0.5"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.3 }}
                                    transition={{ duration: 0.5, ease: EO }}
                                />
                                <motion.path
                                    d={ph
                                        ? "M130 165 L130 185"
                                        : "M190 225 L190 250"}
                                    fill="none" stroke={INK_L} strokeWidth="0.6"
                                    strokeLinecap="round"
                                    markerEnd="url(#arrowhead)"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.3 }}
                                    transition={{ duration: 0.3, delay: 0.2, ease: EO }}
                                />
                            </>
                        )}

                        <defs>
                            <marker id="arrowhead" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                                <path d="M0 0 L6 2.5 L0 5" fill="none" stroke={INK_L} strokeWidth="0.5" />
                            </marker>
                        </defs>
                    </svg>
                </motion.div>
            )}

            {/* ════════════ SCENE 4: Structured Wireframes ════════════ */}
            {scene === 4 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, ease: EO }}
                    style={{
                        position: "absolute", width: ph ? 280 : 400, height: ph ? 280 : 380,
                        zIndex: 4,
                    }}
                >
                    <motion.div style={{
                        position: "absolute", inset: 0,
                        backgroundColor: "#fff", borderRadius: 4,
                        boxShadow: "0 12px 44px rgba(0,0,0,0.35)",
                        overflow: "hidden",
                    }}>
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                            {/* Clean nav bar */}
                            <motion.rect
                                x="0" y="0" width="100%" height={ph ? 28 : 36}
                                fill="rgba(0,0,0,0.03)"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                            <motion.line
                                x1="0" y1={ph ? 28 : 36} x2="100%" y2={ph ? 28 : 36}
                                stroke="rgba(0,0,0,0.06)" strokeWidth="1"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.6, ease: EO }}
                            />

                            {/* Logo placeholder */}
                            {wireframePhase >= 1 && (
                                <motion.rect
                                    x={ph ? 12 : 18} y={ph ? 8 : 10}
                                    width={ph ? 40 : 56} height={ph ? 12 : 16}
                                    rx="2" fill="rgba(0,0,0,0.08)"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, ease: EO }}
                                />
                            )}

                            {/* Nav links */}
                            {wireframePhase >= 1 && [0, 1, 2].map(i => (
                                <motion.rect
                                    key={`wn${i}`}
                                    x={(ph ? 160 : 230) + i * (ph ? 30 : 44)}
                                    y={ph ? 10 : 13}
                                    width={ph ? 22 : 32} height={ph ? 8 : 10}
                                    rx="1" fill="rgba(0,0,0,0.06)"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: i * 0.08, ease: EO }}
                                />
                            ))}

                            {/* Hero headline */}
                            {wireframePhase >= 1 && (
                                <>
                                    <motion.rect
                                        x={ph ? 20 : 30} y={ph ? 50 : 65}
                                        width={ph ? 200 : 280} height={ph ? 10 : 14}
                                        rx="2" fill="rgba(0,0,0,0.12)"
                                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.5, ease: EO }}
                                        style={{ transformOrigin: "left" }}
                                    />
                                    <motion.rect
                                        x={ph ? 20 : 30} y={ph ? 66 : 86}
                                        width={ph ? 160 : 220} height={ph ? 6 : 8}
                                        rx="1" fill="rgba(0,0,0,0.06)"
                                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.4, delay: 0.15, ease: EO }}
                                        style={{ transformOrigin: "left" }}
                                    />
                                </>
                            )}

                            {/* Card grid */}
                            {wireframePhase >= 2 && [0, 1].map(col => (
                                <motion.g key={`card${col}`}>
                                    <motion.rect
                                        x={(ph ? 20 : 30) + col * (ph ? 125 : 178)}
                                        y={ph ? 90 : 120}
                                        width={ph ? 115 : 168}
                                        height={ph ? 80 : 110}
                                        rx="4" fill="rgba(0,0,0,0.04)"
                                        stroke="rgba(0,0,0,0.06)" strokeWidth="0.8"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: col * 0.12, ease: EO }}
                                    />
                                    {/* Image placeholder */}
                                    <motion.rect
                                        x={(ph ? 26 : 38) + col * (ph ? 125 : 178)}
                                        y={ph ? 96 : 128}
                                        width={ph ? 103 : 152}
                                        height={ph ? 45 : 62}
                                        rx="2" fill="rgba(0,0,0,0.06)"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.2 + col * 0.1, ease: EO }}
                                    />
                                    {/* Card text lines */}
                                    <motion.rect
                                        x={(ph ? 26 : 38) + col * (ph ? 125 : 178)}
                                        y={ph ? 148 : 200}
                                        width={ph ? 70 : 100}
                                        height={ph ? 5 : 7}
                                        rx="1" fill="rgba(0,0,0,0.08)"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.35, delay: 0.35 + col * 0.1, ease: EO }}
                                        style={{ transformOrigin: "left" }}
                                    />
                                    <motion.rect
                                        x={(ph ? 26 : 38) + col * (ph ? 125 : 178)}
                                        y={ph ? 157 : 212}
                                        width={ph ? 50 : 72}
                                        height={ph ? 4 : 5}
                                        rx="1" fill="rgba(0,0,0,0.05)"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.3, delay: 0.4 + col * 0.1, ease: EO }}
                                        style={{ transformOrigin: "left" }}
                                    />
                                </motion.g>
                            ))}

                            {/* Footer area */}
                            {wireframePhase >= 3 && (
                                <>
                                    <motion.line
                                        x1={ph ? 20 : 30} y1={ph ? 248 : 340}
                                        x2={ph ? 260 : 370} y2={ph ? 248 : 340}
                                        stroke="rgba(0,0,0,0.06)" strokeWidth="0.8"
                                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, ease: EO }}
                                    />
                                    <motion.rect
                                        x={ph ? 20 : 30} y={ph ? 256 : 350}
                                        width={ph ? 60 : 80} height={ph ? 5 : 7}
                                        rx="1" fill="rgba(0,0,0,0.05)"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3, delay: 0.2, ease: EO }}
                                    />
                                </>
                            )}
                        </svg>
                    </motion.div>
                </motion.div>
            )}

            {/* ════════════ SCENE 5: Zoom + Reveal ════════════ */}
            {scene === 5 && (
                <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{
                        scale: zoomIn ? (fadeToSite ? 3.5 : 1.8) : 1,
                        opacity: fadeToSite ? 0 : 1,
                    }}
                    transition={{ duration: fadeToSite ? 1.0 : 1.4, ease: EASE }}
                    style={{
                        position: "absolute",
                        width: ph ? 280 : 400, height: ph ? 280 : 380,
                        zIndex: 4,
                    }}
                >
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundColor: "#fff", borderRadius: 4,
                        boxShadow: "0 12px 44px rgba(0,0,0,0.35)",
                        overflow: "hidden",
                    }}>
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                            {/* Simplified wireframe that fades as we zoom */}
                            <rect x="0" y="0" width="100%" height={ph ? 28 : 36} fill="rgba(0,0,0,0.03)" />
                            <line x1="0" y1={ph ? 28 : 36} x2="100%" y2={ph ? 28 : 36} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
                            <rect x={ph ? 12 : 18} y={ph ? 8 : 10} width={ph ? 40 : 56} height={ph ? 12 : 16} rx="2" fill="rgba(0,0,0,0.08)" />

                            <motion.rect
                                x={ph ? 20 : 30} y={ph ? 50 : 65}
                                width={ph ? 200 : 280} height={ph ? 10 : 14}
                                rx="2" fill="rgba(0,0,0,0.12)"
                                animate={{ opacity: fadeToSite ? 0 : 1 }}
                                transition={{ duration: 0.8 }}
                            />
                            {[0, 1].map(col => (
                                <motion.rect
                                    key={col}
                                    x={(ph ? 20 : 30) + col * (ph ? 125 : 178)}
                                    y={ph ? 90 : 120}
                                    width={ph ? 115 : 168}
                                    height={ph ? 80 : 110}
                                    rx="4" fill="rgba(0,0,0,0.04)"
                                    stroke="rgba(0,0,0,0.06)" strokeWidth="0.8"
                                    animate={{ opacity: fadeToSite ? 0 : 1 }}
                                    transition={{ duration: 0.8, delay: col * 0.1 }}
                                />
                            ))}
                        </svg>
                    </div>
                </motion.div>
            )}

            {/* White fade to reveal homepage */}
            {wipeOut && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, ease: EASE }}
                    style={{
                        position: "fixed", inset: 0,
                        backgroundColor: "#FFFFFF", zIndex: 10,
                    }}
                />
            )}
        </motion.div>
    )
}
