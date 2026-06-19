"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const INTER = "Inter, system-ui, sans-serif"
const Z = "Zodiak, 'Times New Roman', serif"
const PINK = "#E8B4C8"
const EO: [number, number, number, number] = [0.22, 1, 0.36, 1]
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E")`

const MSGS = [
    "remember the research",
    "show the impact",
    "tell the story",
    "you got this",
]

const BAR_PATH = "M0 4 Q10 2.5, 20 4.2 Q30 5.5, 40 3.8 Q50 2.5, 60 4.3 Q70 5.5, 80 3.7 Q90 2.5, 100 4.1 Q110 5.5, 120 3.9 Q130 2.5, 140 4.2 Q150 5.5, 160 3.8 Q170 2.5, 180 4.1 Q190 5.5, 200 4"
const BAR_DUR = 2.5

const DOODLES: { d: string; vb: string }[] = [
    { d: "M12 2 L14.4 8.5 L21 9.5 L16.2 14 L17.5 21 L12 17.5 L6.5 21 L7.8 14 L3 9.5 L9.6 8.5 Z", vb: "0 0 24 24" },
    { d: "M4 13 L9 18 L20 6", vb: "0 0 24 24" },
    { d: "M6 9 L6 20 L18 20 L18 9 Z M9 9 C9 5, 15 5, 15 9", vb: "0 0 24 24" },
    { d: "M8 2 L16 2 L16 22 L8 22 Z M11 19 L13 19", vb: "0 0 24 24" },
    { d: "M3 20 L3 5 M3 20 L21 20 M7 15 L7 20 M11 10 L11 20 M15 13 L15 20 M19 7 L19 20", vb: "0 0 24 24" },
    { d: "M12 3 C8 3, 5 7, 9 12 L9 15 L15 15 L15 12 C19 7, 16 3, 12 3 Z M9.5 17 L14.5 17 M10 19 L14 19", vb: "0 0 24 24" },
    { d: "M12 2 L13 9 L20 10 L13 11 L12 18 L11 11 L4 10 L11 9 Z", vb: "0 0 24 24" },
    { d: "M4 12 L18 12 M13 7 L18 12 L13 17", vb: "0 0 24 24" },
]

const DPOS = [
    [-150, -70], [145, -75], [-165, 15], [160, 10],
    [-125, 70], [130, 65], [-55, -100], [50, -95],
]

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
    const [ph, setPh] = useState(false)
    const [reduced, setReduced] = useState(false)
    const [showWelcome, setShowWelcome] = useState(false)
    const [showPep, setShowPep] = useState(false)
    const [showBar, setShowBar] = useState(false)
    const [msg, setMsg] = useState(0)
    const [vis, setVis] = useState<Set<number>>(new Set())
    const [showReady, setShowReady] = useState(false)
    const [fade, setFade] = useState(false)
    const done = useRef(false)

    useEffect(() => {
        setPh(window.innerWidth < 768)
        setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        const h = () => setPh(window.innerWidth < 768)
        window.addEventListener("resize", h, { passive: true })
        return () => window.removeEventListener("resize", h)
    }, [])

    const skip = useCallback(() => {
        if (done.current) return
        done.current = true
        onComplete()
    }, [onComplete])

    useEffect(() => {
        if (reduced) { onComplete(); return }
        const t: ReturnType<typeof setTimeout>[] = []

        t.push(setTimeout(() => setShowWelcome(true), 200))
        t.push(setTimeout(() => setShowWelcome(false), 900))

        t.push(setTimeout(() => { setShowPep(true); setShowBar(true) }, 1200))

        t.push(setTimeout(() => setMsg(0), 1200))
        t.push(setTimeout(() => setMsg(1), 1850))
        t.push(setTimeout(() => setMsg(2), 2500))
        t.push(setTimeout(() => setMsg(3), 3100))

        DOODLES.forEach((_, i) => {
            t.push(setTimeout(() => setVis(p => new Set(p).add(i)), 1300 + i * 250))
            t.push(setTimeout(() => setVis(p => { const s = new Set(p); s.delete(i); return s }), 1900 + i * 250))
        })

        t.push(setTimeout(() => { setShowPep(false); setShowBar(false) }, 3700))
        t.push(setTimeout(() => setShowReady(true), 3800))
        t.push(setTimeout(() => setFade(true), 4350))
        t.push(setTimeout(() => { if (!done.current) { done.current = true; onComplete() } }, 4950))

        return () => t.forEach(clearTimeout)
    }, [onComplete, reduced])

    if (reduced) return null

    const bw = ph ? 170 : 240

    return (
        <motion.div style={{
            position: "fixed", inset: 0, zIndex: 10000,
            backgroundColor: "#0A0A0A", backgroundImage: GRAIN, backgroundSize: "200px",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}>
            {/* Skip */}
            <motion.button onClick={skip}
                initial={{ opacity: 0 }} animate={{ opacity: fade ? 0 : 0.8 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                style={{
                    position: "absolute", top: ph ? 16 : 24, right: ph ? 16 : 32,
                    background: "none", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 20, padding: "6px 16px", cursor: "pointer", zIndex: 20,
                }}>
                <span style={{ fontFamily: INTER, fontSize: 11, fontWeight: 500,
                    color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                    Skip Intro
                </span>
            </motion.button>

            {/* ── Welcome ── */}
            <AnimatePresence>
                {showWelcome && (
                    <motion.div key="w"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease: EO }}
                        style={{ position: "absolute", zIndex: 3 }}>
                        <span style={{
                            fontFamily: Z, fontSize: ph ? 26 : 38,
                            color: "#fff", fontStyle: "italic",
                        }}>Welcome.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Pep talk label ── */}
            <AnimatePresence>
                {showPep && (
                    <motion.div key="pep"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EO }}
                        style={{
                            position: "absolute", zIndex: 3, textAlign: "center",
                            top: "50%", left: "50%", width: ph ? 250 : 340,
                            transform: `translate(-50%, ${ph ? -68 : -80}px)`,
                        }}>
                        <span style={{
                            fontFamily: INTER, fontSize: ph ? 11 : 13.5,
                            color: "rgba(255,255,255,0.4)", fontStyle: "italic",
                        }}>let me give my case studies a quick pep talk...</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Rotating messages ── */}
            <div style={{
                position: "absolute", zIndex: 3, textAlign: "center",
                top: "50%", left: "50%", width: ph ? 220 : 300,
                transform: `translate(-50%, ${ph ? -32 : -38}px)`,
                height: ph ? 22 : 28,
            }}>
                <AnimatePresence mode="wait">
                    {showBar && (
                        <motion.div key={msg}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.25, ease: EO }}>
                            <span style={{
                                fontFamily: Z, fontSize: ph ? 15 : 19,
                                color: "rgba(255,255,255,0.65)", fontStyle: "italic",
                            }}>{MSGS[msg]}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Loading bar + pencil ── */}
            <AnimatePresence>
                {showBar && (
                    <motion.div key="bar"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                        style={{
                            position: "absolute", zIndex: 3,
                            top: "50%", left: "50%",
                            transform: `translate(-50%, ${ph ? 10 : 12}px)`,
                            width: bw, height: 24,
                        }}>
                        {/* Wobbly hand-drawn bar */}
                        <svg viewBox="0 0 200 8" width={bw} height={10}
                            style={{ position: "absolute", top: 7, left: 0 }}>
                            <motion.path d={BAR_PATH} fill="none"
                                stroke={PINK} strokeWidth="2" strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: BAR_DUR, ease: "easeInOut" }}
                            />
                        </svg>

                        {/* Doodle pencil */}
                        <motion.div
                            initial={{ x: -4 }}
                            animate={{ x: bw - 4 }}
                            transition={{ duration: BAR_DUR, ease: "easeInOut" }}
                            style={{ position: "absolute", top: -6, left: 0 }}>
                            <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                                <line x1="11" y1="2" x2="3.5" y2="15"
                                    stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />
                                <line x1="3.5" y1="15" x2="2" y2="18"
                                    stroke={PINK} strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Doodles ── */}
            {DOODLES.map((dd, i) => {
                const sc = ph ? 0.6 : 1
                return (
                    <AnimatePresence key={i}>
                        {vis.has(i) && (
                            <motion.svg key={`d${i}`}
                                width={18 * sc} height={18 * sc} viewBox={dd.vb}
                                initial={{ opacity: 0, scale: 0.4 }}
                                animate={{ opacity: 0.35, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.35, ease: EO }}
                                style={{
                                    position: "absolute",
                                    left: `calc(50% + ${DPOS[i][0] * sc}px)`,
                                    top: `calc(50% + ${DPOS[i][1] * sc}px)`,
                                    zIndex: 2,
                                }}>
                                <motion.path d={dd.d} fill="none"
                                    stroke={i % 3 === 0 ? PINK : "rgba(255,255,255,0.25)"}
                                    strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.45, ease: EO }}
                                />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                )
            })}

            {/* ── "Okay, they're ready." ── */}
            <AnimatePresence>
                {showReady && (
                    <motion.div key="ready"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EO }}
                        style={{ position: "absolute", zIndex: 3 }}>
                        <span style={{
                            fontFamily: Z, fontSize: ph ? 18 : 24,
                            color: "rgba(255,255,255,0.75)", fontStyle: "italic",
                        }}>{"Okay, they’re ready."}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Fade to homepage ── */}
            {fade && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                    style={{ position: "fixed", inset: 0, backgroundColor: "#fff", zIndex: 10 }}
                />
            )}
        </motion.div>
    )
}
