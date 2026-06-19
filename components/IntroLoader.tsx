"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const MONO = "'Courier New', monospace"
const INTER = "Inter, system-ui, sans-serif"

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.04'/%3E%3C/svg%3E")`

function StickFigure({ walking, thumbsUp, x, phone }: { walking?: boolean; thumbsUp?: boolean; x?: number; phone?: boolean }) {
    const s = phone ? 0.65 : 1
    return (
        <motion.svg
            width={80 * s}
            height={120 * s}
            viewBox="0 0 80 120"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ overflow: "visible" }}
            animate={x !== undefined ? { x } : undefined}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* head */}
            <motion.circle
                cx="40" cy="18" r="10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            />
            {/* body */}
            <motion.line
                x1="40" y1="28" x2="40" y2="68"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            />
            {/* left arm */}
            {thumbsUp ? (
                <motion.path
                    d="M40 42 L24 36 L24 26"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                />
            ) : (
                <motion.line
                    x1="40" y1="42" x2="22" y2="56"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                />
            )}
            {/* right arm */}
            {thumbsUp ? (
                <motion.path
                    d="M40 42 L58 36 L58 26"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                />
            ) : (
                <motion.line
                    x1="40" y1="42" x2="58" y2="56"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                />
            )}
            {/* left leg */}
            <motion.line
                x1="40" y1="68"
                x2={walking ? "26" : "30"}
                y2={walking ? "92" : "95"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
            />
            {/* right leg */}
            <motion.line
                x1="40" y1="68"
                x2={walking ? "54" : "50"}
                y2={walking ? "92" : "95"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.65 }}
            />
            {/* laptop in hands when walking */}
            {!thumbsUp && (
                <motion.rect
                    x="24" y="48" width="32" height="4" rx="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                />
            )}
        </motion.svg>
    )
}

function CaseCard({ label, delay, bounce, phone }: { label: string; delay: number; bounce: boolean; phone?: boolean }) {
    const w = phone ? 72 : 100
    const h = phone ? 48 : 64
    const fs = phone ? 9 : 11
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
                opacity: 1,
                y: bounce ? [0, -8, 0] : 0,
                scale: 1,
            }}
            transition={{
                opacity: { duration: 0.4, delay },
                y: bounce ? { duration: 0.4, ease: "easeInOut" } : { duration: 0.4, delay },
                scale: { duration: 0.4, delay },
            }}
            style={{
                width: w,
                height: h,
                borderRadius: 6,
                border: "1.5px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.04)",
            }}
        >
            <span style={{
                fontFamily: MONO,
                fontSize: fs,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.05em",
            }}>
                {label}
            </span>
        </motion.div>
    )
}

function SpeechBubble({ text, delay, side, phone }: { text: string; delay: number; side: "left" | "center" | "right"; phone?: boolean }) {
    const fs = phone ? 11 : 13
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: "relative",
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                borderRadius: 12,
                padding: phone ? "8px 14px" : "10px 18px",
                maxWidth: phone ? 220 : 280,
                alignSelf: side === "left" ? "flex-start" : side === "right" ? "flex-end" : "center",
            }}
        >
            <span style={{
                fontFamily: MONO,
                fontSize: fs,
                color: "rgba(255,255,255,0.82)",
                lineHeight: 1.5,
                fontStyle: "italic",
            }}>
                &ldquo;{text}&rdquo;
            </span>
            <div style={{
                position: "absolute",
                bottom: -6,
                left: side === "left" ? 20 : side === "center" ? "50%" : "auto",
                right: side === "right" ? 20 : "auto",
                transform: side === "center" ? "translateX(-50%)" : "none",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid rgba(255,255,255,0.2)",
            }} />
        </motion.div>
    )
}

function ProgressBar({ phone }: { phone?: boolean }) {
    return (
        <div style={{
            width: phone ? 160 : 200,
            height: 3,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            overflow: "hidden",
        }}>
            <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0.6)",
                    borderRadius: 2,
                }}
            />
        </div>
    )
}

export default function IntroLoader({ onComplete }: { onComplete: () => void }) {
    const [scene, setScene] = useState(0)
    const [bounceCard, setBounceCard] = useState(-1)
    const [phone, setPhone] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
        setPhone(window.innerWidth < 768)
        setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        const onResize = () => setPhone(window.innerWidth < 768)
        window.addEventListener("resize", onResize, { passive: true })
        return () => window.removeEventListener("resize", onResize)
    }, [])

    useEffect(() => {
        if (reducedMotion) {
            onComplete()
            return
        }

        const timers: ReturnType<typeof setTimeout>[] = []

        // Scene 1: stick figure walks in (0ms)
        timers.push(setTimeout(() => setScene(1), 100))

        // Scene 2: case study cards appear (1.6s)
        timers.push(setTimeout(() => setScene(2), 1600))

        // Scene 3: speech bubbles (3s)
        timers.push(setTimeout(() => setScene(3), 3000))

        // Bounce cards in sequence with speech bubbles
        timers.push(setTimeout(() => setBounceCard(0), 3400))
        timers.push(setTimeout(() => setBounceCard(1), 4100))
        timers.push(setTimeout(() => setBounceCard(2), 4800))

        // Scene 4: thumbs up + progress bar (5.2s)
        timers.push(setTimeout(() => setScene(4), 5200))

        // Scene 5: farewell message (6.2s)
        timers.push(setTimeout(() => setScene(5), 6200))

        // Done (7.2s)
        timers.push(setTimeout(() => onComplete(), 7400))

        return () => timers.forEach(clearTimeout)
    }, [onComplete, reducedMotion])

    const skip = useCallback(() => onComplete(), [onComplete])

    if (reducedMotion) return null

    return (
        <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                backgroundColor: "#0A0A0A",
                backgroundImage: GRAIN_SVG,
                backgroundSize: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            {/* Skip button */}
            <motion.button
                onClick={skip}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{
                    position: "absolute",
                    top: phone ? 16 : 24,
                    right: phone ? 16 : 32,
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.15)",
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
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.04em",
                }}>
                    Skip Intro
                </span>
            </motion.button>

            {/* Stage area */}
            <div style={{
                position: "relative",
                width: phone ? 300 : 480,
                height: phone ? 320 : 380,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <AnimatePresence mode="wait">

                    {/* ── Scene 1: Walk on ── */}
                    {scene === 1 && (
                        <motion.div
                            key="s1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: phone ? 24 : 32,
                            }}
                        >
                            <StickFigure walking x={0} phone={phone} />
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                style={{
                                    fontFamily: MONO,
                                    fontSize: phone ? 13 : 15,
                                    color: "rgba(255,255,255,0.5)",
                                    letterSpacing: "0.04em",
                                    margin: 0,
                                }}
                            >
                                loading portfolio...
                            </motion.p>
                        </motion.div>
                    )}

                    {/* ── Scene 2: Case study cards ── */}
                    {scene === 2 && (
                        <motion.div
                            key="s2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: phone ? 20 : 28,
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: phone ? 12 : 20,
                            }}>
                                <div style={{
                                    display: "flex",
                                    gap: phone ? 8 : 12,
                                    alignItems: "flex-end",
                                }}>
                                    <CaseCard label="URBN" delay={0.1} bounce={false} phone={phone} />
                                    <CaseCard label="Anthropologie" delay={0.25} bounce={false} phone={phone} />
                                    <CaseCard label="RFND" delay={0.4} bounce={false} phone={phone} />
                                </div>
                            </div>
                            <div style={{ transform: phone ? "scale(0.6)" : "scale(0.7)" }}>
                                <StickFigure phone={phone} />
                            </div>
                            <motion.p
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.4 }}
                                style={{
                                    fontFamily: MONO,
                                    fontSize: phone ? 12 : 14,
                                    color: "rgba(255,255,255,0.5)",
                                    letterSpacing: "0.03em",
                                    margin: 0,
                                    textAlign: "center",
                                }}
                            >
                                giving my case studies a pep talk
                            </motion.p>
                        </motion.div>
                    )}

                    {/* ── Scene 3: Speech bubbles ── */}
                    {scene === 3 && (
                        <motion.div
                            key="s3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: phone ? 14 : 18,
                                width: "100%",
                            }}
                        >
                            {/* Cards row */}
                            <div style={{
                                display: "flex",
                                gap: phone ? 8 : 12,
                                alignItems: "flex-end",
                                marginBottom: phone ? 4 : 8,
                            }}>
                                <CaseCard label="URBN" delay={0} bounce={bounceCard === 0} phone={phone} />
                                <CaseCard label="Anthropologie" delay={0} bounce={bounceCard === 1} phone={phone} />
                                <CaseCard label="RFND" delay={0} bounce={bounceCard === 2} phone={phone} />
                            </div>

                            {/* Speech bubbles */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: phone ? 8 : 10,
                                width: "100%",
                                alignItems: "center",
                                paddingTop: phone ? 4 : 8,
                            }}>
                                <SpeechBubble
                                    text="remember the user research"
                                    delay={0.3}
                                    side="left"
                                    phone={phone}
                                />
                                <SpeechBubble
                                    text="don't forget the business impact"
                                    delay={1.0}
                                    side="center"
                                    phone={phone}
                                />
                                <SpeechBubble
                                    text="and please don't break in production"
                                    delay={1.7}
                                    side="right"
                                    phone={phone}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* ── Scene 4: Thumbs up + progress ── */}
                    {scene === 4 && (
                        <motion.div
                            key="s4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: phone ? 20 : 28,
                            }}
                        >
                            <StickFigure thumbsUp phone={phone} />
                            <motion.p
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                style={{
                                    fontFamily: MONO,
                                    fontSize: phone ? 13 : 15,
                                    color: "rgba(255,255,255,0.55)",
                                    letterSpacing: "0.03em",
                                    margin: 0,
                                }}
                            >
                                okay, they&apos;re ready.
                            </motion.p>
                            <ProgressBar phone={phone} />
                        </motion.div>
                    )}

                    {/* ── Scene 5: Welcome ── */}
                    {scene === 5 && (
                        <motion.div
                            key="s5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: phone ? 10 : 14,
                            }}
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                style={{
                                    fontFamily: "'Zodiak', 'Times New Roman', serif",
                                    fontSize: phone ? 28 : 40,
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.95)",
                                    letterSpacing: "-0.03em",
                                    margin: 0,
                                }}
                            >
                                Welcome.
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35, duration: 0.5 }}
                                style={{
                                    fontFamily: "'Zodiak', 'Times New Roman', serif",
                                    fontStyle: "italic",
                                    fontWeight: 300,
                                    fontSize: phone ? 14 : 17,
                                    color: "rgba(255,255,255,0.45)",
                                    margin: 0,
                                    textAlign: "center",
                                    maxWidth: phone ? 260 : 400,
                                    lineHeight: 1.6,
                                }}
                            >
                                Let&apos;s build products people actually enjoy using.
                            </motion.p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Subtle floor line */}
            {scene >= 1 && scene <= 4 && (
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{
                        position: "absolute",
                        bottom: phone ? "28%" : "25%",
                        width: phone ? "60%" : "40%",
                        height: 1,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        transformOrigin: "center",
                    }}
                />
            )}
        </motion.div>
    )
}
