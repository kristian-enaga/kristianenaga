"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap, ChevronRight, MessageSquare, ArrowRight, Briefcase, Sparkles } from "lucide-react";

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#approach", label: "Approach" },
  { href: "https://github.com/kristian-enaga", label: "GitHub", external: true },
  { href: "https://www.linkedin.com/in/kristian-jay-e%C3%B1aga-85345741a/", label: "LinkedIn", external: true },
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
              className="flex items-center gap-3 text-foreground font-bold tracking-tight text-xl lg:text-2xl whitespace-nowrap"
              aria-label="Kristian Jay Eñaga - Home"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setIsMobileMenuOpen(false); }}
            >
              <span className="relative flex items-center flex-shrink-0">
                <Zap className="w-6 h-6 text-mint" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-mint rounded-full animate-pulse" aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">KRISTIAN JAY EÑAGA</span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-muted text-xs font-medium uppercase tracking-wider ml-1 flex-shrink-0">
                <span className="w-2 h-2 bg-mint rounded-full animate-pulse" aria-hidden="true" />
                GTM Automation Engineer
              </span>
            </Link>

          {/* Available for Work Badge - Desktop only */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium animate-fade-in">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
              Available for Work
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative text-sm font-medium text-muted hover:text-foreground transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-mint hover:after:w-full after:transition-all after:duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/639510833623"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-sm font-medium text-muted hover:text-foreground hover:border-mint/30 transition-all duration-500 ease-out"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a
              href="#contact"
              className="btn-primary focus-ring whitespace-nowrap group"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Let's Work Together
              <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" />
            </a>
            
            {/* Email Capture Trigger - Desktop */}
            <EmailCaptureTrigger />
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
            isMobileMenuOpen ? "max-h-96 opacity-100 pt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-base font-medium text-muted hover:text-foreground transition-colors duration-300 py-2 border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
              <a
                href="https://wa.me/639510833623"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full glass border-white/10 text-sm font-medium text-muted hover:text-foreground hover:border-mint/30 transition-all duration-500 ease-out"
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
              
              {/* Available for Work Badge - Mobile */}
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full glass border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium animate-fade-in">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
                Available for Contract / Full-time · Remote · APAC/EMEA/US West
              </div>
              
              {/* Email Capture Trigger - Mobile */}
              <EmailCaptureTrigger />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Email Capture Trigger Component
function EmailCaptureTrigger() {
  return (
    <button
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-mint/30 bg-mint/10 text-mint font-medium text-sm hover:bg-mint/20 transition-all duration-300 focus-ring hidden sm:flex"
      onClick={() => {
        const event = new CustomEvent('open-email-capture');
        window.dispatchEvent(event);
      }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
      </svg>
      <span className="hidden lg:inline">Get Insights</span>
    </button>
  );
}