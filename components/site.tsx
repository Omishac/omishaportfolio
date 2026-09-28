"use client"

// Shared design language for the portfolio (homepage + case studies).
// Values here are the source of truth; pages import them rather than
// redefining their own.

import React, { useState, useEffect } from "react"

// ── Tokens ──────────────────────────────────────────────────────────────────

export const FONT_SANS = "Inter, system-ui, sans-serif"
export const FONT_SERIF = "Zodiak, 'Times New Roman', serif"

export const COLORS = {
    ink: "#111111",
    ink2: "#3A3A3A",
    ink3: "#6B6B6B",
    muted: "#9A9A9A",
    border: "rgba(0,0,0,0.08)",
    bg: "#FFFFFF",
    paper: "#F4F2EF",   // mat behind images / media
    pink: "#D33361",    // the poster pink: the homepage accent
    olive: "#899064",   // case-study accent: quieter, more business-like
}

// Playful per-letter / per-row hover colors
export const HOVER_COLORS = ["#94AAD9", "#E7BEF8", "#EDE986", "#F2619C"]

export const EASE_SPRING = "cubic-bezier(0.22,1,0.36,1)"
export const EASE_OUT = "cubic-bezier(0.23,1,0.32,1)"

// ── Hooks ───────────────────────────────────────────────────────────────────

export function useReducedMotion() {
    const [reduced, setReduced] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReduced(mq.matches)
        const h = (e: MediaQueryListEvent) => setReduced(e.matches)
        mq.addEventListener("change", h)
        return () => mq.removeEventListener("change", h)
    }, [])
    return reduced
}

export function useFinePointer() {
    const [fine, setFine] = useState(true)
    useEffect(() => {
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
        setFine(mq.matches)
        const h = (e: MediaQueryListEvent) => setFine(e.matches)
        mq.addEventListener("change", h)
        return () => mq.removeEventListener("change", h)
    }, [])
    return fine
}

// ── Small pieces ────────────────────────────────────────────────────────────

// Splits text into individually hoverable letters — hovering one picks a
// random color from HOVER_COLORS just for that letter, reverting on leave.
export function HoverLetters({ text }: { text: string }) {
    const [colors, setColors] = useState<Record<number, string>>({})
    const finePointer = useFinePointer()

    return (
        <span aria-label={text}>
            {Array.from(text).map((ch, i) =>
                ch === " " ? (
                    <span key={i} aria-hidden="true"> </span>
                ) : (
                    <span
                        key={i}
                        aria-hidden="true"
                        onMouseEnter={() => {
                            if (!finePointer) return
                            const color = HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)]
                            setColors((c) => ({ ...c, [i]: color }))
                        }}
                        onMouseLeave={() => {
                            setColors((c) => {
                                const next = { ...c }
                                delete next[i]
                                return next
                            })
                        }}
                        style={{
                            color: colors[i] ?? "inherit",
                            transition: "color 0.15s ease",
                        }}
                    >
                        {ch}
                    </span>
                )
            )}
        </span>
    )
}

// "[ tag ]" label used above section titles.
export function BracketTag({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 5, ...style }}>
            <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: COLORS.muted }}>[</span>
            <span style={{ fontFamily: FONT_SANS, fontWeight: 300, fontSize: 12, color: COLORS.ink, letterSpacing: "-0.01em" }}>
                {children}
            </span>
            <span style={{ fontFamily: FONT_SANS, fontSize: 12, color: COLORS.muted }}>]</span>
        </div>
    )
}

// The hand-drawn pink stroke from the nav underline, as a static mark.
export function Squiggle({ width = 64, color = COLORS.pink, style }: { width?: number; color?: string; style?: React.CSSProperties }) {
    return (
        <svg width={width} height={6} viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", overflow: "visible", ...style }}>
            <path d="M1 3.8 C 14 2.6, 27 4.6, 42 3.4 S 70 2.4, 84 3.6 S 96 3.1, 99 2.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
    )
}
