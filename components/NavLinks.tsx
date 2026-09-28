"use client"

// Shared nav link treatment for every page's nav bar (Figma node 115:42):
// Inter ExtraLight, lowercase, black. Hover/focus/current page draw a
// hand-drawn pink underline in the poster's colour; keyboard focus adds a
// dashed, perforation-like ring. Each nav keeps its own bar/container — only
// the links come from here.

const I = "Inter, system-ui, sans-serif"
const INK = "#111111"
const NAV_PINK = "#D33361"
const EASE_OUT = "cubic-bezier(0.23,1,0.32,1)"

export const NAV_LINK_GAP = 19.5
export const NAV_LINK_SIZE = 12.872

const NAV_STYLES = `
.site-nav-link {
    position: relative;
    display: inline-block;
    padding: 6px 1px 8px;
    font-family: ${I};
    font-weight: 200;
    text-transform: lowercase;
    line-height: 1;
    color: #000000;
    text-decoration: none;
    border-radius: 3px;
    transition: color 0.25s ${EASE_OUT}, transform 0.2s ${EASE_OUT};
    -webkit-tap-highlight-color: transparent;
}
.site-nav-link svg {
    position: absolute;
    left: -2px;
    right: -2px;
    bottom: 1px;
    width: calc(100% + 4px);
    height: 6px;
    overflow: visible;
    pointer-events: none;
}
.site-nav-link path {
    stroke: ${NAV_PINK};
    stroke-width: 1.5;
    stroke-linecap: round;
    fill: none;
    /* offset past the gap so not even a round cap shows at rest */
    stroke-dasharray: 1 1.1;
    stroke-dashoffset: 1.05;
    transition: stroke-dashoffset 0.38s ${EASE_OUT};
}
.site-nav-link:hover, .site-nav-link:focus-visible, .site-nav-link[aria-current="page"] { color: ${INK}; }
.site-nav-link:hover path, .site-nav-link:focus-visible path, .site-nav-link:active path,
.site-nav-link[aria-current="page"] path { stroke-dashoffset: 0; }
.site-nav-link:focus-visible { outline: 1.5px dashed ${NAV_PINK}; outline-offset: 5px; }
.site-nav-link:active { color: ${INK}; transform: translateY(1px); }
.site-nav-link--menu { padding: 0 0 10px; }
.site-nav-link--menu svg { height: 8px; bottom: 4px; }
.site-nav-item { outline: none; text-decoration: none; -webkit-tap-highlight-color: transparent; }
.site-nav-item:is(:hover, :focus-visible, :active, [aria-current="page"]) .site-nav-link { color: ${INK}; }
.site-nav-item:is(:hover, :focus-visible, :active, [aria-current="page"]) .site-nav-link path { stroke-dashoffset: 0; }
.site-nav-item:focus-visible .site-nav-link { outline: 1.5px dashed ${NAV_PINK}; outline-offset: 6px; }
@media (prefers-reduced-motion: reduce) {
    .site-nav-link, .site-nav-link path { transition: none; }
    .site-nav-link:active { transform: none; }
}
`

export function NavStyles() {
    return <style dangerouslySetInnerHTML={{ __html: NAV_STYLES }} />
}

// Slightly uneven stroke so the underline reads as drawn by hand.
function NavUnderline() {
    return (
        <svg viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} d="M1 3.8 C 14 2.6, 27 4.6, 42 3.4 S 70 2.4, 84 3.6 S 96 3.1, 99 2.5" />
        </svg>
    )
}

type LinkProps = { label: string; href: string; ext?: boolean; active?: boolean }

// Desktop/tablet bar link.
export function NavLink({ label, href, ext, active, size = NAV_LINK_SIZE }: LinkProps & { size?: number }) {
    return (
        <a
            href={href}
            target={ext ? "_blank" : "_self"}
            rel="noreferrer"
            className="site-nav-link"
            aria-current={active ? "page" : undefined}
            style={{ fontSize: size }}
        >
            {label}
            <NavUnderline />
        </a>
    )
}

// Full-screen phone menu link. `style` is for the row (height, divider, stagger).
export function MenuLink({ label, href, ext, active, onClick, style }: LinkProps & { onClick?: () => void; style?: React.CSSProperties }) {
    return (
        <a
            href={href}
            target={ext ? "_blank" : "_self"}
            rel="noreferrer"
            onClick={onClick}
            className="site-nav-item"
            aria-current={active ? "page" : undefined}
            style={style}
        >
            <span className="site-nav-link site-nav-link--menu" style={{ fontSize: 34, letterSpacing: "-0.02em" }}>
                {label}
                <NavUnderline />
            </span>
        </a>
    )
}
