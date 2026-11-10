"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap, ChevronRight, Phone, MessageSquare, ArrowUpRight } from "lucide-react";

const navSections = [
  { href: "#portfolio", label: "Portfolio" },
  { href: "#categories", label: "Business Categories" },
  { href: "#stack", label: "Technical Stack" },
  { href: "#approach", label: "Approach" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-background/95 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <nav className="flex items-center justify-between h-16 lg:h-20" aria-label="Main navigation">
          <Link
            href="#"
            className="flex items-center gap-3 text-foreground font-bold tracking-tight text-xl lg:text-2xl"
            aria-label="Kristian Jay Eñaga - Home"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setIsMobileMenuOpen(false); }}
          >
            <span className="relative flex items-center">
              <Zap className="w-6 h-6 text-mint" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-mint rounded-full animate-pulse" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">KRISTIAN JAY EÑAGA</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-muted text-xs font-medium uppercase tracking-wider ml-1">
              <span className="w-2 h-2 bg-mint rounded-full animate-pulse" aria-hidden="true" />
              GTM Automation Engineer
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navSections.map((section) => (
              <a
                key={section.href}
                href={section.href}
                className="relative text-sm font-medium text-muted hover:text-foreground transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-mint hover:after:w-full after:transition-all after:duration-300"
              >
                {section.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://wa.me/639510833623"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border-white/10 text-sm font-medium text-muted hover:text-foreground hover:border-mint/30 transition-all duration-300"
              aria-label="WhatsApp: +63 951 083 3623"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a
              href="#contact"
              className="btn-primary focus-ring whitespace-nowrap"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Let's Work Together
              <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </a>
          </div>

          <button
            className="lg:hidden p-2 text-foreground hover:text-muted transition-colors focus-ring rounded-lg"
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
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            {navSections.map((section) => (
              <a
                key={section.href}
                href={section.href}
                className="text-lg font-medium text-muted hover:text-foreground transition-colors duration-300 pb-2 border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {section.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <a
                href="https://wa.me/639510833623"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-full glass border-white/10 text-sm font-medium text-muted hover:text-foreground hover:border-mint/30 transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
                WhatsApp: +63 951 083 3623
              </a>
              <a
                href="#contact"
                className="btn-primary text-center"
                onClick={() => { setIsMobileMenuOpen(false); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Let's Work Together
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}