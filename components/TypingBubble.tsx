"use client"

import React, { useEffect, useRef, useState } from "react"
import { FONT_SANS, EASE_SPRING, useReducedMotion } from "./site"

// Pink chat bubble that pops in with typing dots, then shows its text, when it
// scrolls into view. Used for shopper / participant quotes in the case studies.
// The text is always in the DOM (screen readers get it straight away); under
// reduced motion the bubble just appears.

const BUBBLE_BG = "#FCE7EC"
const BUBBLE_INK = "#7F1D43" // ≈9:1 on the bubble

const STYLES = `
@keyframes tb-dot { 0%, 80%, 100% { opacity: .25; transform: translateY(0) } 40% { opacity: 1; transform: translateY(-3px) } }
.tb-dots span { width: 6px; height: 6px; border-radius: 50%; background: ${BUBBLE_INK}; display: inline-block; animation: tb-dot 1s infinite ease-in-out; }
.tb-dots span:nth-child(2) { animation-delay: .15s } .tb-dots span:nth-child(3) { animation-delay: .3s }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
    .tb-bubble[data-in]:hover { transform: rotate(0deg) translateY(-4px) scale(1.02) !important; box-shadow: 0 14px 24px -16px rgba(127,29,67,0.45); }
}
`

export function TypingBubble({
    text,
    tilt = 0,
    delay = 0,
    size = "lg",
    fit = false,
    style,
}: {
    text: string
    tilt?: number       // resting lean, deg
    delay?: number      // ms after entering view before it pops in
    size?: "lg" | "md"
    fit?: boolean       // shrink to the text instead of filling the column
    style?: React.CSSProperties
}) {
    const ref = useRef<HTMLDivElement>(null)
    const reduced = useReducedMotion()
    const [stage, setStage] = useState<0 | 1 | 2>(0) // 0 hidden, 1 typing, 2 text

    useEffect(() => {
        if (reduced) { setStage(2); return }
        const el = ref.current
        if (!el) return
        const timers: number[] = []
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return
            obs.disconnect()
            timers.push(window.setTimeout(() => setStage(1), delay))
            timers.push(window.setTimeout(() => setStage(2), delay + 420))
        }, { threshold: 0.4 })
        obs.observe(el)
        return () => { obs.disconnect(); timers.forEach(clearTimeout) }
    }, [reduced, delay])

    const lg = size === "lg"
    const pad = lg ? "24px 24px 26px" : "14px 18px 15px"
    return (
        <div
            ref={ref}
            className="tb-bubble"
            data-in={stage ? "" : undefined}
            style={{
                position: "relative",
                display: fit ? "inline-block" : "block",
                boxSizing: "border-box",
                backgroundColor: BUBBLE_BG,
                borderRadius: lg ? "20px 20px 20px 4px" : "16px 16px 16px 4px",
                padding: pad,
                transformOrigin: "0% 100%",
                transform: stage ? `rotate(${tilt}deg)` : "translateY(12px) scale(0.6)",
                opacity: stage ? 1 : 0,
                transition: reduced ? "none" : `transform 0.45s ${EASE_SPRING}, opacity 0.25s ease, box-shadow 0.3s ease`,
                ...style,
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <p style={{
                fontFamily: FONT_SANS,
                fontSize: lg ? 20 : 15,
                fontWeight: 400,
                color: BUBBLE_INK,
                lineHeight: lg ? 1.3 : 1.4,
                letterSpacing: lg ? "-0.015em" : "-0.005em",
                margin: 0,
                textWrap: "balance",
                opacity: stage === 2 ? 1 : 0,
                transition: reduced ? "none" : "opacity 0.3s ease",
            }}>
                &ldquo;{text}&rdquo;
            </p>
            {stage < 2 && (
                <span aria-hidden="true" className="tb-dots" style={{ position: "absolute", left: lg ? 24 : 18, top: "50%", marginTop: -3, display: "flex", gap: 5 }}>
                    <span /><span /><span />
                </span>
            )}
        </div>
    )
}
