"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const INTER = "Inter, system-ui, sans-serif"
const Z = "Zodiak, 'Times New Roman', serif"
const PINK = "#E8B4C8"
const PAPER = "rgba(248, 245, 240, 0.97)"
const INK = "#2A2A28"
const INK_L = "#8A8A82"
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]
const EO: [number, number, number, number] = [0.22, 1, 0.36, 1]
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E")`

const LINES = [
    "case studies,",
    "you got this.",
    "show the research.",
    "show the impact.",
    "tell the story.",
]

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
    const [ph, setPh] = useState(false)
    const [reduced, setReduced] = useState(false)

    const [showWelcome, setShowWelcome] = useState(false)
    const [showPep, setShowPep] = useState(false)
    const [paperIn, setPaperIn] = useState(false)
    const [typed, setTyped] = useState(["", "", "", "", ""])
    const [curLine, setCurLine] = useState(-1)
    const [fold, setFold] = useState(0)
    const [flying, setFlying] = useState(false)
    const [wipe, setWipe] = useState(false)

    useEffect(() => {
        setPh(window.innerWidth < 768)
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        const h = () => setPh(window.innerWidth < 768)
        window.addEventListener("resize", h, { passive: true })
        return () => window.removeEventListener("resize", h)
    }, [])

    const skip = useCallback(() => onComplete(), [onComplete])

    useEffect(() => {
        if (reduced) { onComplete(); return }
        const t: ReturnType<typeof setTimeout>[] = []

        t.push(setTimeout(() => setShowWelcome(true), 300))
        t.push(setTimeout(() => setShowWelcome(false), 1800))

        t.push(setTimeout(() => setShowPep(true), 2200))
        t.push(setTimeout(() => setShowPep(false), 3500))

        t.push(setTimeout(() => setPaperIn(true), 3900))

        const starts = [4200, 4900, 5600, 6300, 6900]
        const speeds = [42, 42, 36, 36, 36]
        LINES.forEach((line, li) => {
            t.push(setTimeout(() => setCurLine(li), starts[li]))
            for (let ci = 1; ci <= line.length; ci++) {
                t.push(setTimeout(() => {
                    setTyped(p => { const n = [...p]; n[li] = line.slice(0, ci); return n })
                }, starts[li] + ci * speeds[li]))
            }
        })

        t.push(setTimeout(() => setCurLine(-1), 7500))
        t.push(setTimeout(() => setFold(1), 7800))
        t.push(setTimeout(() => setFold(2), 8200))
        t.push(setTimeout(() => setFlying(true), 8500))
        t.push(setTimeout(() => setWipe(true), 9100))
        t.push(setTimeout(() => onComplete(), 9900))

        return () => t.forEach(clearTimeout)
    }, [onComplete, reduced])

    if (reduced) return null

    const pw = ph ? 230 : 300

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
                animate={{ opacity: wipe ? 0 : 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{
                    position: "absolute", top: ph ? 16 : 24, right: ph ? 16 : 32,
                    background: "none", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 20, padding: "6px 16px", cursor: "pointer", zIndex: 20,
                }}
            >
                <span style={{
                    fontFamily: INTER, fontSize: 11, fontWeight: 500,
                    color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em",
                }}>Skip Intro</span>
            </motion.button>

            {/* ── Welcome ── */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        key="w"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.55, ease: EO }}
                        style={{ position: "absolute", zIndex: 2 }}
                    >
                        <span style={{
                            fontFamily: Z, fontSize: ph ? 30 : 42,
                            color: "#fff", fontStyle: "italic", fontWeight: 400,
                        }}>Welcome.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Pep talk ── */}
            <AnimatePresence>
                {showPep && (
                    <motion.div
                        key="p"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.5, ease: EO }}
                        style={{ position: "absolute", zIndex: 2, textAlign: "center", padding: "0 24px" }}
                    >
                        <span style={{
                            fontFamily: INTER, fontSize: ph ? 13 : 15,
                            color: "rgba(255,255,255,0.5)", fontStyle: "italic", fontWeight: 400,
                        }}>let me give my case studies a quick pep talk...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Paper note ── */}
            {paperIn && fold === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.5 }}
                    transition={{ duration: 0.55, ease: EO }}
                    style={{
                        position: "absolute", width: pw,
                        backgroundColor: PAPER, borderRadius: 3,
                        padding: ph ? "28px 22px 34px" : "34px 30px 42px",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)",
                        zIndex: 2,
                    }}
                >
                    {/* Ruled lines */}
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{
                            position: "absolute",
                            left: ph ? 20 : 28, right: ph ? 20 : 28,
                            top: (ph ? 36 : 44) + i * (ph ? 22 : 26),
                            height: 1, backgroundColor: "rgba(0,0,0,0.04)",
                        }} />
                    ))}
                    {/* Red margin */}
                    <div style={{
                        position: "absolute", left: ph ? 32 : 42,
                        top: 0, bottom: 0, width: 1,
                        backgroundColor: "rgba(200,80,80,0.1)",
                    }} />

                    {/* Text lines */}
                    {LINES.map((_, i) => {
                        const hdr = i <= 1
                        return (
                            <p key={i} style={{
                                fontFamily: hdr ? Z : INTER,
                                fontStyle: "italic",
                                fontWeight: i === 1 ? 500 : 400,
                                fontSize: ph
                                    ? (hdr ? (i === 1 ? 17 : 15) : 10.5)
                                    : (hdr ? (i === 1 ? 22 : 19) : 12),
                                color: hdr ? INK : INK_L,
                                lineHeight: 1.5,
                                margin: `${i === 0 ? 0 : i === 2 ? (ph ? 10 : 14) : (ph ? 3 : 5)}px 0 0 ${ph ? 16 : 20}px`,
                                minHeight: ph ? (hdr ? 24 : 17) : (hdr ? 30 : 20),
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
                </motion.div>
            )}

            {/* ── Folded ── */}
            {fold === 1 && (
                <motion.svg
                    width={ph ? 70 : 96} height={ph ? 90 : 120}
                    viewBox="0 0 96 120"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: EO }}
                    style={{ position: "absolute", zIndex: 2 }}
                >
                    <path
                        d="M48 4 L10 32 L10 116 L86 116 L86 32 Z"
                        fill={PAPER} stroke="rgba(0,0,0,0.1)"
                        strokeWidth="0.8" strokeLinejoin="round"
                    />
                    <line x1="10" y1="32" x2="86" y2="32"
                        stroke="rgba(0,0,0,0.06)" strokeWidth="0.6" />
                    <line x1="48" y1="4" x2="48" y2="116"
                        stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" strokeDasharray="3 4" />
                </motion.svg>
            )}

            {/* ── Airplane ── */}
            {fold >= 2 && (
                <motion.svg
                    width={ph ? 52 : 72} height={ph ? 30 : 42}
                    viewBox="0 0 72 42"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={flying ? {
                        opacity: [1, 1, 0.6, 0],
                        scale: [1, 2, 6, 14],
                        y: [0, -10, -30, -60],
                        rotate: [-2, 3, 10, 18],
                    } : {
                        opacity: 1, scale: 1, rotate: -2,
                    }}
                    transition={flying ? {
                        duration: 1.1,
                        ease: [0.25, 0.1, 0.25, 1],
                        times: [0, 0.15, 0.45, 1],
                    } : {
                        duration: 0.3, ease: EO,
                    }}
                    style={{ position: "absolute", zIndex: 6 }}
                >
                    <motion.path
                        d="M2 21 L68 3 L26 21 L68 39 Z"
                        fill={PAPER} stroke="rgba(0,0,0,0.12)"
                        strokeWidth="0.7" strokeLinejoin="round"
                        initial={{ fillOpacity: 0, pathLength: 0 }}
                        animate={{ fillOpacity: 1, pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.line x1="2" y1="21" x2="68" y2="21"
                        stroke={PINK} strokeWidth="0.7"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.35 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                    />
                </motion.svg>
            )}

            {/* ── White wipe ── */}
            {wipe && (
                <motion.div
                    initial={{ clipPath: "polygon(110% -10%, 130% -10%, 130% 110%, 100% 110%)" }}
                    animate={{ clipPath: "polygon(-30% -10%, 130% -10%, 130% 110%, -40% 110%)" }}
                    transition={{ duration: 0.85, ease: EASE }}
                    style={{ position: "fixed", inset: 0, backgroundColor: "#FFF", zIndex: 8 }}
                />
            )}
        </motion.div>
    )
}
