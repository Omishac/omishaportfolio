"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { NavStyles, NavLink, MenuLink, NAV_LINK_GAP } from "./NavLinks"

const INK  = "#111111"
const BG   = "#FFFFFF"
const BORDER = "rgba(0,0,0,0.08)"

export default function SharedNav() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)
    const [large, setLarge] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        const onResize = () => {
            setPhone(document.documentElement.clientWidth < 768)
            setTablet(document.documentElement.clientWidth >= 768 && document.documentElement.clientWidth < 1024)
            setLarge(document.documentElement.clientWidth > 1440)
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

    const px = phone ? 20 : tablet ? 40 : large ? 120 : 80
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
            <NavStyles />
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
                    <div style={{ display: "flex", gap: large ? 24 : NAV_LINK_GAP, alignItems: "center" }}>
                        {allLinks.map(({ label, href, ext }) => (
                            <NavLink key={label} label={label} href={href} ext={ext}
                                active={label === "Playground" && isPlayground} size={large ? 14 : undefined} />
                        ))}
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
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 201,
                            minWidth: 44,
                            minHeight: 44,
                        }}
                    >
                        {menuOpen ? (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M2 2 L16 16" stroke={INK} strokeWidth="1.6" strokeLinecap="round"/>
                                <path d="M16 2 L2 16" stroke={INK} strokeWidth="1.6" strokeLinecap="round"/>
                            </svg>
                        ) : (
                            <svg width="5" height="21" viewBox="0 0 5 21" fill="none">
                                <circle cx="2.5" cy="2.5" r="2.5" fill={INK}/>
                                <circle cx="2.5" cy="10.5" r="2.5" fill={INK}/>
                                <circle cx="2.5" cy="18.5" r="2.5" fill={INK}/>
                            </svg>
                        )}
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
                    {allLinks.map(({ label, href, ext }, i) => (
                        <MenuLink
                            key={label}
                            label={label}
                            href={href}
                            ext={ext}
                            active={label === "Playground" && isPlayground}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                minHeight: 68,
                                width: "100%",
                                borderBottom: `1px solid ${BORDER}`,
                                opacity: menuOpen ? 1 : 0,
                                transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                                transition: `opacity 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms, transform 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms`,
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
