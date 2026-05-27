"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

const I = "Inter, system-ui, sans-serif"
const INK  = "#111111"
const INK3 = "#6B6B6B"
const BG   = "#FFFFFF"
const BORDER = "rgba(0,0,0,0.08)"

export default function SharedNav() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [phone, setPhone] = useState(false)
    const [tablet, setTablet] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        const onResize = () => {
            setPhone(window.innerWidth < 540)
            setTablet(window.innerWidth >= 540 && window.innerWidth < 1024)
        }
        onResize()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onResize, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onResize)
        }
    }, [])

    const px = phone ? 20 : tablet ? 40 : 80
    const isHome = pathname === "/"

    const allLinks = [
        { label: "Work",     href: isHome ? "#work" : "/#work" },
        { label: "Playground", href: "/playground" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/omisha-chabria-27379b226", ext: true },
        { label: "Resume",   href: "#" },
    ]
    const links = phone ? allLinks.filter(l => l.label !== "Playground") : allLinks

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                width: "100%",
                height: phone ? 54 : 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `0 ${px}px`,
                boxSizing: "border-box",
                backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : BG,
                backdropFilter: scrolled ? "blur(20px)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: `1px solid ${scrolled ? "rgba(0,0,0,0.09)" : BORDER}`,
                transition: "background 0.25s, border-color 0.25s",
            }}
        >
            <a href="/" style={{ display: "block", lineHeight: 0 }}>
                <img
                    src="https://framerusercontent.com/images/vjGQl4Z6ipiOIUKzmXgJLezcKtI.png"
                    alt="OC"
                    style={{ width: phone ? 48 : 58, height: phone ? 48 : 58, objectFit: "contain", display: "block" }}
                />
            </a>
            <div style={{ display: "flex", gap: phone ? 16 : tablet ? 24 : 32, alignItems: "center" }}>
                {links.map(({ label, href, ext }) => {
                    const active = label === "Playground" && pathname?.startsWith("/playground")
                    return (
                        <a
                            key={label}
                            href={href}
                            target={ext ? "_blank" : "_self"}
                            rel="noreferrer"
                            style={{
                                fontFamily: I,
                                fontSize: phone ? 13 : 14,
                                fontWeight: active ? 600 : 500,
                                color: active ? INK : INK3,
                                textDecoration: "none",
                                letterSpacing: "-0.01em",
                                transition: "color 0.18s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = INK)}
                            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = INK3 }}
                        >
                            {label}
                        </a>
                    )
                })}
            </div>
        </nav>
    )
}
