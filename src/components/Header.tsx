"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Me", href: "/about" },
  { label: "Speeches", href: "/speeches" },
  { label: "Blog", href: "/blog" },
  { label: "Covid India Task Force", href: "/covid-india-task-force" },
  { label: "Covid Lifeline", href: "/covid-lifeline" },
  { label: "Media Support", href: "/media-support" },
  { label: "Awards", href: "/awards" },
  { label: "Videos", href: "/videos" },
  { label: "Publications", href: "/publications" },
  { label: "Gallery", href: "/gallery" },
  { label: "Messages", href: "/messages" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-300"
      style={{ boxShadow: scrolled ? "0 2px 12px 0 rgba(0,15,43,0.12)" : "none" }}
    >
      <div
        className="flex items-center justify-between px-4"
        style={{ maxWidth: "1240px", margin: "0 auto", height: "72px" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="no-underline shrink-0"
          style={{
            fontFamily: "Sarala, sans-serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#000f2b",
            whiteSpace: "nowrap",
          }}
        >
          Rtn. Ashok Mahajan
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0" style={{ display: "none" }} aria-label="Main navigation">
          {/* Rendered via CSS at 921px+ */}
        </nav>

        {/* Desktop nav — shown above 921px */}
        <nav
          className="items-center"
          style={{ display: "none" }}
          aria-label="Primary navigation"
          id="desktop-nav"
        >
          <ul className="flex items-center list-none m-0 p-0 gap-0 flex-wrap justify-end">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-sm font-medium transition-colors duration-200 no-underline relative group"
                    style={{
                      fontFamily: "PT Sans, sans-serif",
                      color: isActive ? "#9dca00" : "#3a3a3a",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#9dca00";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#3a3a3a";
                      }
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ background: "#9dca00" }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Hamburger Button — shown below 921px */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="flex flex-col justify-center items-center gap-1.5 w-10 h-10 bg-transparent border-0 cursor-pointer p-2 rounded transition-colors duration-200"
          style={{ display: "flex" }}
          id="hamburger-btn"
        >
          <span
            className="block w-6 h-0.5 transition-all duration-300 origin-center"
            style={{
              background: "#000f2b",
              transform: menuOpen ? "translateY(8px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "#000f2b",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300 origin-center"
            style={{
              background: "#000f2b",
              transform: menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        style={{
          maxHeight: menuOpen ? "800px" : "0",
          overflow: "hidden",
          transition: "max-height 0.35s ease",
          background: "#ffffff",
          borderTop: menuOpen ? "1px solid #e5e7eb" : "none",
        }}
      >
        <ul className="list-none m-0 p-0">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href} className="border-b border-gray-100 last:border-b-0">
                <Link
                  href={item.href}
                  className="block px-6 py-3.5 text-sm font-medium no-underline transition-colors duration-200"
                  style={{
                    fontFamily: "PT Sans, sans-serif",
                    color: isActive ? "#9dca00" : "#3a3a3a",
                    borderLeft: isActive ? "3px solid #9dca00" : "3px solid transparent",
                    background: isActive ? "#f8fdf0" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    if (!isActive) {
                      el.style.color = "#9dca00";
                      el.style.background = "#f8fdf0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    if (!isActive) {
                      el.style.color = "#3a3a3a";
                      el.style.background = "transparent";
                    }
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarala:wght@400;700&family=PT+Sans:wght@400;700&display=swap');

        #desktop-nav {
          display: none !important;
        }
        #hamburger-btn {
          display: flex !important;
        }

        @media (min-width: 921px) {
          #desktop-nav {
            display: flex !important;
          }
          #hamburger-btn {
            display: none !important;
          }
          #mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
