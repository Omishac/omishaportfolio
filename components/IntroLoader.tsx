"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const INTER = "Inter, system-ui, sans-serif"
const Z = "Zodiak, 'Times New Roman', serif"
const EO: [number, number, number, number] = [0.22, 1, 0.36, 1]
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E")`

const RECT = "M3 2 Q55 0.5, 110 2.5 Q165 4, 217 2 Q219 7, 218 12 Q216 18, 218 22 Q165 24, 110 21.5 Q55 20, 3 22 Q1 17, 2 12 Q4 7, 3 2 Z"

const SCRIBBLES = [
    "M8 5.5 Q20 3, 32 6 Q44 9, 56 5 Q68 3, 80 7 Q92 9, 104 5 Q116 3, 128 6.5 Q140 9, 152 5 Q164 3, 176 7 Q188 9, 200 5.5 Q210 4, 212 6",
    "M8 10 Q22 12, 36 9 Q50 7, 64 11 Q78 13, 92 9 Q106 7, 120 11 Q134 13, 148 10 Q162 7, 176 11 Q190 13, 204 10 Q212 8, 212 10",
    "M8 14.5 Q20 16.5, 32 13 Q44 11, 56 15 Q68 17, 80 13 Q92 11, 104 15 Q116 17, 128 14 Q140 11, 152 15 Q164 17, 176 14 Q188 11, 200 14.5 Q210 16, 212 14",
    "M8 18.5 Q24 20, 40 17 Q56 15, 72 19 Q88 21, 104 17.5 Q120 15, 136 19 Q152 21, 168 18 Q184 15, 200 18.5 Q212 20, 212 18",
]

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
    const [ph, setPh] = useState(false)
    const [reduced, setReduced] = useState(false)
    const [showHey, setShowHey] = useState(false)
    const [showText, setShowText] = useState(false)
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
        const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") skip() }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [skip])

    useEffect(() => {
        if (reduced) { onComplete(); return }
        const t: ReturnType<typeof setTimeout>[] = []

        t.push(setTimeout(() => setShowHey(true), 100))
        t.push(setTimeout(() => setShowHey(false), 900))
        t.push(setTimeout(() => setShowText(true), 1100))
        t.push(setTimeout(() => setShowText(false), 3800))
        t.push(setTimeout(() => setFade(true), 3900))
        t.push(setTimeout(() => { if (!done.current) { done.current = true; onComplete() } }, 4500))

        return () => t.forEach(clearTimeout)
    }, [onComplete, reduced])

    if (reduced) return null

    const bw = ph ? 200 : 300

    return (
        <motion.div onClick={skip} style={{
            position: "fixed", inset: 0, zIndex: 10000,
            backgroundColor: "#0A0A0A", backgroundImage: GRAIN, backgroundSize: "200px",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", cursor: "pointer",
        }}>
            {/* Skip */}
            <motion.button onClick={skip}
                initial={{ opacity: 0 }} animate={{ opacity: fade ? 0 : 0.8 }}
                transition={{ delay: 0.4, duration: 0.3 }}
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

            {/* "Oh hey!" */}
            <AnimatePresence>
                {showHey && (
                    <motion.div key="hey"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: EO }}
                        style={{ position: "absolute", zIndex: 3 }}>
                        <span style={{
                            fontFamily: Z, fontSize: ph ? 32 : 48,
                            color: "#fff", fontStyle: "italic",
                        }}>Oh hey!</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Text + loading bar */}
            <AnimatePresence>
                {showText && (
                    <motion.div key="content"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EO }}
                        style={{
                            position: "absolute", zIndex: 3,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: ph ? 24 : 32,
                        }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{
                                fontFamily: Z, fontSize: ph ? 20 : 28,
                                color: "rgba(255,255,255,0.65)", fontStyle: "italic",
                                lineHeight: 1.6,
                            }}>Give me a second.</div>
                            <div style={{
                                fontFamily: INTER, fontSize: ph ? 13 : 16,
                                color: "#fff", fontWeight: 600,
                                marginTop: ph ? 6 : 8,
                            }}>Let me give my case studies a quick pep talk...</div>
                        </div>

                        {/* Hand-drawn rectangle with scribble fill */}
                        <svg viewBox="0 0 220 24" width={bw} height={ph ? 22 : 32}
                            fill="none" style={{ overflow: "visible" }}>
                            {/* Sketched border */}
                            <motion.path d={RECT}
                                stroke="rgba(255,255,255,0.3)" strokeWidth="1.3"
                                strokeLinecap="round" strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, delay: 0.15, ease: EO }}
                            />
                            {/* Scribble fill */}
                            {SCRIBBLES.map((d, i) => (
                                <motion.path key={i} d={d}
                                    stroke={`rgba(255,255,255,${0.10 + (i % 2) * 0.04})`}
                                    strokeWidth="2" strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2.0, delay: 0.3 + i * 0.12, ease: "easeInOut" }}
                                />
                            ))}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fade to homepage */}
            {fade && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    style={{ position: "fixed", inset: 0, backgroundColor: "#fff", zIndex: 10 }}
                />
            )}
        </motion.div>
    )
}
