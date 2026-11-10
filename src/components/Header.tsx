"use client";

import { MouseEvent, useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "#pain-points", label: "What I Fix" },
  { href: "#capabilities", label: "Solutions Matrix" },
  { href: "#proof-of-work", label: "Proof of Work" },
  { href: "#architecture", label: "Architecture" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? "glass-strong py-4" : "py-6"
      }`}
      style={{ background: isScrolled ? "rgba(2, 6, 23, 0.9)" : "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link
            href="#"
            className="flex items-center gap-3 text-foreground font-bold tracking-tight text-xl"
            aria-label="Kristian Jay Eñaga - Home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setIsMobileMenuOpen(false);
            }}
          >
            <span className="relative flex items-center">
              <Zap className="w-5 h-5 text-mint" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-mint rounded-full animate-pulse-glow" aria-hidden="true" />
            </span>
            <span>KRISTIAN JAY EÑAGA</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-muted text-xs font-medium uppercase tracking-wider ml-2">
              <span className="w-1.5 h-1.5 bg-mint rounded-full animate-pulse-glow" aria-hidden="true" />
              GTM Systems
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-muted hover:text-foreground transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-mint hover:after:w-full after:transition-all after:duration-300"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="#contact"
              className="btn-primary focus-ring"
              onClick={(e) => handleNavClick(e, "#contact")}
            >
              Book Operations Audit
            </a>
          </div>

          <button
            className="md:hidden p-2 text-foreground hover:text-muted transition-colors focus-ring rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-muted hover:text-foreground transition-colors duration-300 pb-2 border-b border-white/5"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="btn-primary text-center mt-4"
              onClick={(e) => handleNavClick(e, "#contact")}
            >
              Book Operations Audit
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}