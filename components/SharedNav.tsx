"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const I = "Inter, system-ui, sans-serif"
const YB = "var(--font-yuji-boku), serif"
const INK  = "#111111"
const INK3 = "#6B6B6B"
const BG   = "#FFFFFF"
const BORDER = "rgba(0,0,0,0.08)"

export default function SharedNav() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        const onResize = () => {
            setPhone(window.innerWidth < 768)
            setTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
        }
        onResize()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onResize, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
        }
    }, [])

    // Close menu on route change or resize out of phone
    useEffect(() => { setMenuOpen(false) }, [pathname])
    useEffect(() => { if (!phone) setMenuOpen(false) }, [phone])

    // Prevent body scroll when menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [menuOpen])

    const px = phone ? 20 : tablet ? 40 : 80
    const isHome = pathname === "/"

    const allLinks = [
        { label: "Work",       href: isHome ? "#work" : "/#work" },
        { label: "Playground", href: "/playground" },
        { label: "LinkedIn",   href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
        { label: "Resume",     href: "/slides/resume.pdf", ext: true },
    ]

    const isPlayground = pathname?.startsWith("/playground")

    return (
        <>
            <nav
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 200,
                    width: "100%",
                    height: phone ? 54 : 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: `0 ${px}px`,
                    boxSizing: "border-box",
                    backgroundColor: scrolled || menuOpen ? "rgba(255,255,255,0.98)" : BG,
                    backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
                    WebkitBackdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
                    borderBottom: `1px solid ${scrolled || menuOpen ? "rgba(0,0,0,0.09)" : BORDER}`,
                    transition: "background 0.25s, border-color 0.25s",
                }}
            >
                {/* Logo */}
                <a href="/" style={{ display: "block", lineHeight: 0, zIndex: 201 }}>
                    <img
                        src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png"
                        alt="OC"
                        style={{ width: phone ? 48 : 58, height: phone ? 48 : 58, objectFit: "contain", display: "block" }}
                    />
                </a>

                {/* Desktop links */}
                {!phone && (
                    <div style={{ display: "flex", gap: tablet ? 24 : 32, alignItems: "center" }}>
                        {allLinks.map(({ label, href, ext }) => {
                            const active = label === "Playground" && isPlayground
                            const hovered = hoveredLink === label
                            return (
                                <a
                                    key={label}
                                    href={href}
                                    target={ext ? "_blank" : "_self"}
                                    rel="noreferrer"
                                    style={{
                                        position: "relative",
                                        fontFamily: I,
                                        fontSize: 14,
                                        fontWeight: active ? 600 : 500,
                                        color: active ? INK : (hovered ? INK : INK3),
                                        textDecoration: "none",
                                        letterSpacing: "-0.01em",
                                        transition: "color 0.25s",
                                    }}
                                    onMouseEnter={() => setHoveredLink(label)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    <span style={{
                                        opacity: hovered ? 0 : 1,
                                        transition: "opacity 0.25s ease",
                                    }}>{label}</span>
                                    <span style={{
                                        position: "absolute",
                                        left: 0,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontFamily: YB,
                                        fontSize: 15,
                                        fontWeight: 700,
                                        fontStyle: "italic",
                                        color: INK,
                                        whiteSpace: "nowrap",
                                        opacity: hovered ? 1 : 0,
                                        transition: "opacity 0.25s ease",
                                        pointerEvents: "none",
                                    }}>{label}</span>
                                </a>
                            )
                        })}
                    </div>
                )}

                {/* Hamburger button */}
                {phone && (
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "10px",
                            margin: "-10px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 5,
                            zIndex: 201,
                            minWidth: 44,
                            minHeight: 44,
                        }}
                    >
                        <span style={{
                            display: "block",
                            width: 22,
                            height: 2,
                            backgroundColor: INK,
                            borderRadius: 1,
                            transformOrigin: "center",
                            transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
                            transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                        }} />
                        <span style={{
                            display: "block",
                            width: 22,
                            height: 2,
                            backgroundColor: INK,
                            borderRadius: 1,
                            opacity: menuOpen ? 0 : 1,
                            transition: "opacity 0.2s",
                        }} />
                        <span style={{
                            display: "block",
                            width: 22,
                            height: 2,
                            backgroundColor: INK,
                            borderRadius: 1,
                            transformOrigin: "center",
                            transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                            transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                        }} />
                    </button>
                )}
            </nav>

            {/* Full-screen mobile menu overlay */}
            {phone && (
                <div
                    ref={overlayRef}
                    onClick={(e) => { if (e.target === overlayRef.current) setMenuOpen(false) }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 199,
                        backgroundColor: "rgba(255,255,255,0.98)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: "0 32px",
                        gap: 0,
                        opacity: menuOpen ? 1 : 0,
                        pointerEvents: menuOpen ? "auto" : "none",
                        transition: "opacity 0.25s cubic-bezier(0.22,1,0.36,1)",
                    }}
                >
                    {allLinks.map(({ label, href, ext }, i) => {
                        const active = label === "Playground" && isPlayground
                        return (
                            <a
                                key={label}
                                href={href}
                                target={ext ? "_blank" : "_self"}
                                rel="noreferrer"
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    fontFamily: I,
                                    fontSize: 32,
                                    fontWeight: active ? 700 : 400,
                                    color: active ? INK : INK3,
                                    textDecoration: "none",
                                    letterSpacing: "-0.02em",
                                    display: "flex",
                                    alignItems: "center",
                                    minHeight: 64,
                                    width: "100%",
                                    borderBottom: `1px solid ${BORDER}`,
                                    opacity: menuOpen ? 1 : 0,
                                    transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                                    transition: `opacity 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms, transform 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms`,
                                }}
                            >
                                {label}
                            </a>
                        )
                    })}
                </div>
            )}
        </>
    )
}
