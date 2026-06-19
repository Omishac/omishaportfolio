"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

const INTER = "Inter, system-ui, sans-serif"
const Z = "Zodiak, 'Times New Roman', serif"
const PINK = "#E8B4C8"
const PAPER_BG = "rgba(248, 245, 240, 0.97)"
const INK = "#2A2A28"
const INK_LIGHT = "#8A8A82"
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E")`

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
    const [phone, setPhone] = useState(false)
    const [reduced, setReduced] = useState(false)

    const [paperIn, setPaperIn] = useState(false)
    const [figureIn, setFigureIn] = useState(false)
    const [line1, setLine1] = useState("")
    const [line2, setLine2] = useState("")
    const [doodlesIn, setDoodlesIn] = useState(false)
    const [fold, setFold] = useState(0)
    const [flying, setFlying] = useState(false)
    const [wipeIn, setWipeIn] = useState(false)

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

        t.push(setTimeout(() => setPaperIn(true), 400))
        t.push(setTimeout(() => setFigureIn(true), 1100))

        const L1 = "case studies, you got this."
        for (let i = 0; i <= L1.length; i++)
            t.push(setTimeout(() => setLine1(L1.slice(0, i)), 1600 + i * 62))

        const L2 = "show the research. show the impact."
        for (let i = 0; i <= L2.length; i++)
            t.push(setTimeout(() => setLine2(L2.slice(0, i)), 3700 + i * 48))

        t.push(setTimeout(() => setDoodlesIn(true), 5600))
        t.push(setTimeout(() => setFold(1), 7200))
        t.push(setTimeout(() => setFold(2), 7700))
        t.push(setTimeout(() => setFlying(true), 8200))
        t.push(setTimeout(() => setWipeIn(true), 8500))
        t.push(setTimeout(() => onComplete(), 9500))

        return () => t.forEach(clearTimeout)
    }, [onComplete, reduced])

    if (reduced) return null

    const pw = phone ? 220 : 300

    return (
        <motion.div
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
                animate={{ opacity: wipeIn ? 0 : 1 }}
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
                    zIndex: 20,
                }}
            >
                <span style={{
                    fontFamily: INTER, fontSize: 11, fontWeight: 500,
                    color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em",
                }}>
                    Skip Intro
                </span>
            </motion.button>

            {/* ────────────── PAPER NOTE ────────────── */}
            {paperIn && fold === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.5 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                    style={{
                        position: "relative",
                        width: pw,
                        backgroundColor: PAPER_BG,
                        borderRadius: 3,
                        padding: phone ? "26px 22px 32px" : "32px 30px 40px",
                        boxShadow:
                            "0 16px 48px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)",
                        zIndex: 2,
                    }}
                >
                    {/* Ruled lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            position: "absolute",
                            left: phone ? 20 : 28,
                            right: phone ? 20 : 28,
                            top: (phone ? 40 : 50) + i * (phone ? 20 : 24),
                            height: 1,
                            backgroundColor: "rgba(0,0,0,0.04)",
                        }} />
                    ))}

                    {/* Red margin line */}
                    <div style={{
                        position: "absolute",
                        left: phone ? 34 : 44,
                        top: 0, bottom: 0, width: 1,
                        backgroundColor: "rgba(200, 80, 80, 0.1)",
                    }} />

                    {/* Line 1 */}
                    <p style={{
                        fontFamily: Z, fontStyle: "italic", fontWeight: 400,
                        fontSize: phone ? 16 : 20,
                        color: INK, lineHeight: 1.5,
                        margin: "0 0 0 " + (phone ? 18 : 22) + "px",
                        minHeight: phone ? 25 : 31,
                        position: "relative", zIndex: 2,
                    }}>
                        {line1}
                        {line1.length > 0 && line1.length < 27 && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                style={{ color: PINK, fontWeight: 300 }}
                            >|</motion.span>
                        )}
                    </p>

                    {/* Line 2 */}
                    {line2.length > 0 && (
                        <p style={{
                            fontFamily: INTER, fontSize: phone ? 10 : 11.5,
                            color: INK_LIGHT, lineHeight: 1.65,
                            margin: (phone ? 8 : 10) + "px 0 0 " + (phone ? 18 : 22) + "px",
                            fontStyle: "italic", position: "relative", zIndex: 2,
                        }}>
                            {line2}
                            {line2.length < 35 && (
                                <motion.span
                                    animate={{ opacity: [0.6, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                    style={{ color: PINK }}
                                >|</motion.span>
                            )}
                        </p>
                    )}

                    {/* ── Doodles ── */}
                    {doodlesIn && (
                        <>
                            {/* Star — top right */}
                            <motion.svg
                                width="12" height="12" viewBox="0 0 14 14"
                                style={{ position: "absolute", top: phone ? 10 : 14, right: phone ? 12 : 16 }}
                                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                animate={{ opacity: 0.6, scale: 1, rotate: 0 }}
                                transition={{ duration: 0.5, ease: EASE_OUT }}
                            >
                                <motion.path
                                    d="M7 1 L8.4 5.2 L13 5.5 L9.6 8.4 L10.6 13 L7 10.5 L3.4 13 L4.4 8.4 L1 5.5 L5.6 5.2 Z"
                                    fill="none" stroke={PINK} strokeWidth="1" strokeLinejoin="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
                                />
                            </motion.svg>

                            {/* Wavy underline under "you got this" */}
                            <motion.svg
                                width={phone ? 65 : 88} height="6" viewBox="0 0 88 6"
                                style={{
                                    position: "absolute",
                                    bottom: phone ? 46 : 56,
                                    right: phone ? 26 : 34,
                                    zIndex: 3,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.55 }}
                                transition={{ duration: 0.3, delay: 0.15 }}
                            >
                                <motion.path
                                    d="M0 3 Q11 0 22 3 T44 3 T66 3 T88 3"
                                    fill="none" stroke={PINK} strokeWidth="1.2" strokeLinecap="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.55, delay: 0.2, ease: EASE_OUT }}
                                />
                            </motion.svg>

                            {/* Small heart — bottom right */}
                            <motion.svg
                                width="10" height="10" viewBox="0 0 12 12"
                                style={{
                                    position: "absolute",
                                    bottom: phone ? 10 : 14,
                                    right: phone ? 14 : 18,
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 0.35, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.35, ease: EASE_OUT }}
                            >
                                <motion.path
                                    d="M6 10 C2 7, 0 4, 2 2 C4 0, 6 2, 6 4 C6 2, 8 0, 10 2 C12 4, 10 7, 6 10 Z"
                                    fill="none" stroke={PINK} strokeWidth="1" strokeLinejoin="round"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4, ease: EASE_OUT }}
                                />
                            </motion.svg>
                        </>
                    )}

                    {/* ── Tiny stick figure — margin doodle ── */}
                    {figureIn && (
                        <motion.svg
                            width={phone ? 16 : 22} height={phone ? 28 : 38}
                            viewBox="0 0 22 38"
                            fill="none" stroke={INK_LIGHT}
                            strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.35 }}
                            transition={{ duration: 0.6 }}
                            style={{ position: "absolute", bottom: phone ? 5 : 8, left: phone ? 5 : 8 }}
                        >
                            <motion.circle cx="11" cy="5" r="3.5"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            />
                            <motion.line x1="11" y1="8.5" x2="11" y2="22"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.2, delay: 0.2 }}
                            />
                            <motion.line x1="11" y1="13" x2="5" y2="18"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.15, delay: 0.3 }}
                            />
                            <motion.path d="M11 13 L17 9 L19 6"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.2, delay: 0.3 }}
                            />
                            <motion.line x1="19" y1="6" x2="20" y2="4"
                                stroke={PINK} strokeWidth="1.3"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.1, delay: 0.45 }}
                            />
                            <motion.line x1="11" y1="22" x2="7" y2="31"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.15, delay: 0.35 }}
                            />
                            <motion.line x1="11" y1="22" x2="15" y2="31"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 0.15, delay: 0.38 }}
                            />
                        </motion.svg>
                    )}
                </motion.div>
            )}

            {/* ────────────── FOLD STATE 1: Folded note ────────────── */}
            {fold === 1 && (
                <motion.svg
                    width={phone ? 70 : 96} height={phone ? 90 : 120}
                    viewBox="0 0 96 120"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    style={{ zIndex: 2 }}
                >
                    <motion.path
                        d="M48 4 L10 32 L10 116 L86 116 L86 32 Z"
                        fill={PAPER_BG}
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth="0.8"
                        strokeLinejoin="round"
                    />
                    <line x1="10" y1="32" x2="86" y2="32"
                        stroke="rgba(0,0,0,0.06)" strokeWidth="0.6" />
                    <line x1="48" y1="4" x2="48" y2="116"
                        stroke="rgba(0,0,0,0.03)" strokeWidth="0.5"
                        strokeDasharray="3 4" />
                </motion.svg>
            )}

            {/* ────────────── FOLD STATE 2 / AIRPLANE ────────────── */}
            {fold >= 2 && (
                <motion.svg
                    width={phone ? 52 : 72} height={phone ? 30 : 42}
                    viewBox="0 0 72 42"
                    initial={{ opacity: 0, scale: 0.7, x: 0, y: 0, rotate: 0 }}
                    animate={flying ? {
                        opacity: [1, 1, 1, 0.5, 0],
                        scale: [1, 1.04, 1, 0.9, 0.5],
                        x: phone ? [0, 30, 160, 450] : [0, 50, 280, 750],
                        y: phone ? [0, -25, -110, -340] : [0, -35, -160, -440],
                        rotate: [0, -4, -10, -16],
                    } : {
                        opacity: 1, scale: 1, rotate: -2,
                    }}
                    transition={flying ? {
                        duration: 1.4,
                        ease: [0.35, 0, 0.12, 1],
                        times: [0, 0.15, 0.5, 1],
                    } : {
                        duration: 0.4, ease: EASE_OUT,
                    }}
                    style={{ zIndex: 6, position: "relative" }}
                >
                    <motion.path
                        d="M2 21 L68 3 L26 21 L68 39 Z"
                        fill={PAPER_BG} stroke="rgba(0,0,0,0.12)"
                        strokeWidth="0.7" strokeLinejoin="round"
                        initial={{ fillOpacity: 0, pathLength: 0 }}
                        animate={{ fillOpacity: 1, pathLength: 1 }}
                        transition={{ duration: 0.35 }}
                    />
                    <motion.line x1="2" y1="21" x2="68" y2="21"
                        stroke={PINK} strokeWidth="0.7"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.35 }}
                        transition={{ duration: 0.25, delay: 0.15 }}
                    />
                </motion.svg>
            )}

            {/* ────────────── TRAIL ────────────── */}
            {flying && [0, 1, 2, 3, 4, 5, 6].map(i => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.4, 0.15, 0], scale: [0, 1, 1.8, 0.5] }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: EASE_OUT }}
                    style={{
                        position: "absolute",
                        width: phone ? 3 : 4, height: phone ? 3 : 4,
                        borderRadius: "50%",
                        backgroundColor: i % 2 === 0 ? PINK : "rgba(255,255,255,0.3)",
                        left: `${50 - i * 2.5}%`,
                        top: `${50 + i * 2.5}%`,
                        zIndex: 4,
                    }}
                />
            ))}

            {/* ────────────── WHITE WIPE ────────────── */}
            {wipeIn && (
                <motion.div
                    initial={{ clipPath: "polygon(110% -10%, 130% -10%, 130% 110%, 100% 110%)" }}
                    animate={{ clipPath: "polygon(-30% -10%, 130% -10%, 130% 110%, -40% 110%)" }}
                    transition={{ duration: 0.95, ease: EASE }}
                    style={{
                        position: "fixed", inset: 0,
                        backgroundColor: "#FFFFFF",
                        zIndex: 8,
                    }}
                />
            )}
        </motion.div>
    )
}
