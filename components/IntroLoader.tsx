"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

const INTER = "Inter, system-ui, sans-serif"
const MONO = "'Courier New', monospace"
const PINK = "#E8B4C8"
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E")`

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
    const [phone, setPhone] = useState(false)
    const [reduced, setReduced] = useState(false)
    const [phase, setPhase] = useState(0)
    const [line1, setLine1] = useState("")
    const [line2, setLine2] = useState("")

    useEffect(() => {
        setPhone(window.innerWidth < 768)
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        const h = () => setPhone(window.innerWidth < 768)
        window.addEventListener("resize", h, { passive: true })
        return () => window.removeEventListener("resize", h)
    }, [])

    const skip = useCallback(() => onComplete(), [onComplete])

    useEffect(() => {
        if (reduced) { onComplete(); return }

        const t: ReturnType<typeof setTimeout>[] = []

        // 0.3s  → figure draws in
        t.push(setTimeout(() => setPhase(1), 300))

        // 1.5s  → paper note appears
        t.push(setTimeout(() => setPhase(2), 1500))

        // 2.1s  → typewrite line 1: "case studies, you got this."
        const L1 = "case studies, you got this."
        for (let i = 0; i <= L1.length; i++) {
            t.push(setTimeout(() => setLine1(L1.slice(0, i)), 2100 + i * 62))
        }
        // L1 finishes ~3.77s

        // 4.2s  → typewrite line 2: "show the research. show the impact."
        const L2 = "show the research. show the impact."
        for (let i = 0; i <= L2.length; i++) {
            t.push(setTimeout(() => setLine2(L2.slice(0, i)), 4200 + i * 50))
        }
        // L2 finishes ~5.95s

        // 6.6s  → reading pause ends, paper folds
        t.push(setTimeout(() => setPhase(3), 6600))

        // 7.4s  → throw — airplane launches
        t.push(setTimeout(() => setPhase(4), 7400))

        // 8.0s  → overlay starts fading out
        t.push(setTimeout(() => setPhase(5), 8000))

        // 8.9s  → done
        t.push(setTimeout(() => onComplete(), 8900))

        return () => t.forEach(clearTimeout)
    }, [onComplete, reduced])

    if (reduced) return null

    const figureIn = phase >= 1 && phase < 4
    const paperIn = phase >= 2 && phase < 3
    const folding = phase === 3
    const planeIn = phase >= 3
    const thrown = phase >= 4
    const exiting = phase >= 5

    const L1_DONE = 27
    const L2_DONE = 35

    return (
        <motion.div
            animate={exiting ? { opacity: 0, y: -24, scale: 1.015 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                backgroundColor: "#0A0A0A",
                backgroundImage: GRAIN,
                backgroundSize: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            {/* Skip */}
            <motion.button
                onClick={skip}
                initial={{ opacity: 0 }}
                animate={{ opacity: exiting ? 0 : 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                style={{
                    position: "absolute",
                    top: phone ? 16 : 24,
                    right: phone ? 16 : 32,
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 20,
                    padding: "6px 16px",
                    cursor: "pointer",
                    zIndex: 10,
                }}
            >
                <span style={{
                    fontFamily: INTER,
                    fontSize: 11,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: "0.04em",
                }}>
                    Skip Intro
                </span>
            </motion.button>

            {/* ── Stage ── */}
            <div style={{
                position: "relative",
                width: phone ? 320 : 520,
                height: phone ? 300 : 340,
            }}>

                {/* ── Stick figure — writing pose ── */}
                {figureIn && (
                    <motion.svg
                        width={phone ? 52 : 76}
                        height={phone ? 78 : 114}
                        viewBox="0 0 76 114"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "absolute",
                            left: phone ? "10%" : "14%",
                            bottom: phone ? "20%" : "16%",
                        }}
                    >
                        {/* head */}
                        <motion.circle cx="36" cy="14" r="9"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                        />
                        {/* body */}
                        <motion.line x1="36" y1="23" x2="36" y2="60"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        />
                        {/* left arm — relaxed at side */}
                        <motion.line x1="36" y1="36" x2="20" y2="50"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, delay: 0.45 }}
                        />
                        {/* right arm — reaching to paper */}
                        <motion.path d="M36 36 L54 44 L62 50"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.35, delay: 0.5 }}
                        />
                        {/* pen (pink accent) */}
                        <motion.line x1="62" y1="50" x2="65" y2="56"
                            stroke={PINK} strokeWidth="2"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.2, delay: 0.75 }}
                        />
                        {/* left leg */}
                        <motion.line x1="36" y1="60" x2="26" y2="86"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.25, delay: 0.55 }}
                        />
                        {/* right leg */}
                        <motion.line x1="36" y1="60" x2="46" y2="86"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.25, delay: 0.6 }}
                        />
                    </motion.svg>
                )}

                {/* Fade-out figure during throw */}
                {phase === 4 && (
                    <motion.svg
                        width={phone ? 52 : 76}
                        height={phone ? 78 : 114}
                        viewBox="0 0 76 114"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: "absolute",
                            left: phone ? "10%" : "14%",
                            bottom: phone ? "20%" : "16%",
                        }}
                    >
                        <circle cx="36" cy="14" r="9" />
                        <line x1="36" y1="23" x2="36" y2="60" />
                        {/* arm thrown upward */}
                        <line x1="36" y1="36" x2="20" y2="50" />
                        <path d="M36 36 L56 28 L62 20" />
                        <line x1="36" y1="60" x2="26" y2="86" />
                        <line x1="36" y1="60" x2="46" y2="86" />
                    </motion.svg>
                )}

                {/* ── Paper note ── */}
                {(paperIn || folding) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={folding ? {
                            opacity: 0,
                            scale: 0.2,
                            rotate: -25,
                            y: -20,
                        } : {
                            opacity: 1,
                            scale: 1,
                            rotate: -1.5,
                            y: 0,
                        }}
                        transition={{ duration: folding ? 0.65 : 0.55, ease: EASE }}
                        style={{
                            position: "absolute",
                            right: phone ? "4%" : "8%",
                            bottom: phone ? "28%" : "22%",
                            width: phone ? 158 : 215,
                            minHeight: phone ? 74 : 94,
                            backgroundColor: "rgba(255,255,255,0.025)",
                            border: "1.5px solid rgba(255,255,255,0.13)",
                            borderRadius: 6,
                            padding: phone ? "14px 14px" : "18px 22px",
                        }}
                    >
                        {/* Faint ruled lines */}
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{
                                position: "absolute",
                                left: phone ? 12 : 20,
                                right: phone ? 12 : 20,
                                top: (phone ? 32 : 40) + i * (phone ? 18 : 22),
                                height: 1,
                                backgroundColor: "rgba(255,255,255,0.03)",
                            }} />
                        ))}

                        {/* Line 1 */}
                        <p style={{
                            fontFamily: MONO,
                            fontSize: phone ? 11 : 14,
                            color: "rgba(255,255,255,0.78)",
                            lineHeight: 1.65,
                            margin: 0,
                            minHeight: phone ? 18 : 23,
                            letterSpacing: "-0.01em",
                        }}>
                            {line1}
                            {line1.length > 0 && line1.length < L1_DONE && (
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                                    style={{ color: PINK }}
                                >|</motion.span>
                            )}
                        </p>

                        {/* Line 2 */}
                        {line2.length > 0 && (
                            <p style={{
                                fontFamily: MONO,
                                fontSize: phone ? 9 : 11,
                                color: "rgba(255,255,255,0.38)",
                                lineHeight: 1.6,
                                margin: "8px 0 0",
                                fontStyle: "italic",
                            }}>
                                {line2}
                                {line2.length < L2_DONE && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                                        style={{ color: PINK, opacity: 0.5 }}
                                    >|</motion.span>
                                )}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* ── Paper airplane ── */}
                {planeIn && (
                    <motion.svg
                        width={phone ? 34 : 46}
                        height={phone ? 22 : 30}
                        viewBox="0 0 50 30"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0, scale: 0.4, x: 0, y: 0, rotate: 0 }}
                        animate={thrown ? {
                            opacity: [1, 1, 0.7, 0],
                            scale: [1, 1.1, 0.8, 0.3],
                            x: phone ? [0, 180, 520] : [0, 300, 820],
                            y: phone ? [0, -130, -380] : [0, -180, -520],
                            rotate: [0, -10, -18],
                        } : {
                            opacity: 1,
                            scale: 1,
                            rotate: -4,
                        }}
                        transition={thrown ? {
                            duration: 1.1,
                            ease: [0.12, 0.9, 0.25, 1],
                        } : {
                            duration: 0.5,
                            ease: EASE,
                        }}
                        style={{
                            position: "absolute",
                            right: phone ? "22%" : "24%",
                            bottom: phone ? "36%" : "30%",
                            zIndex: 5,
                        }}
                    >
                        {/* airplane body */}
                        <motion.path
                            d="M2 15 L46 2 L18 15 L46 28 Z"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, ease: EASE }}
                        />
                        {/* fold crease — pink accent */}
                        <motion.line
                            x1="2" y1="15" x2="46" y2="15"
                            stroke={PINK}
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 0.3, delay: 0.2, ease: EASE }}
                        />
                    </motion.svg>
                )}

                {/* ── Floor line ── */}
                {phase >= 1 && phase <= 3 && (
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: phase >= 4 ? 0 : 1, opacity: phase >= 4 ? 0 : 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                        style={{
                            position: "absolute",
                            bottom: phone ? "17%" : "12%",
                            left: "8%",
                            width: "84%",
                            height: 1,
                            backgroundColor: "rgba(255,255,255,0.04)",
                            transformOrigin: "left",
                        }}
                    />
                )}
            </div>
        </motion.div>
    )
}
