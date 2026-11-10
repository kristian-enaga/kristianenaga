"use client";

import { useEffect, useState } from "react";
import { Mail, Linkedin, Github, MessageSquare, MapPin, Clock, ArrowUpRight, CheckCircle } from "lucide-react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("footer");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="footer"
      className="relative py-12 lg:py-16 px-6 lg:px-12 border-t border-white/5"
      aria-labelledby="footer-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex items-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-mint">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-mint rounded-full animate-pulse" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">KRISTIAN JAY EÑAGA</span>
            </div>
            
            <p className="text-muted/80 leading-relaxed mb-6 max-w-xs">
              GTM Automation Engineer. Building fail-safe systems that eliminate manual lead processing, connect business applications, and ensure workflow exceptions never break silently.
            </p>

            <div className="space-y-3">
              <a href="https://wa.me/639510833623" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl glass border-white/5 hover:border-mint/20 hover:bg-white/5 transition-all duration-500 ease-out">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #25D36620, #25D36610)", border: "1px solid #25D36630" }}>
                  <MessageSquare className="w-5 h-5" style={{ color: "#25D366" }} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-subtle uppercase tracking-wider font-medium">WhatsApp</div>
                  <div className="text-white font-medium">+63 951 083 3623</div>
                </div>
              </a>
              <a href="mailto:kchanchan2357@gmail.com" className="flex items-center gap-3 p-3 rounded-xl glass border-white/5 hover:border-mint/20 hover:bg-white/5 transition-all duration-500 ease-out">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D1483620, #D1483610)", border: "1px solid #D1483630" }}>
                  <Mail className="w-5 h-5" style={{ color: "#D14836" }} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-subtle uppercase tracking-wider font-medium">Email</div>
                  <div className="text-white font-medium">kchanchan2357@gmail.com</div>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/kristian-jay-e%C3%B1aga-85345741a/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl glass border-white/5 hover:border-mint/20 hover:bg-white/5 transition-all duration-500 ease-out">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0A66C220, #0A66C210)", border: "1px solid #0A66C230" }}>
                  <Linkedin className="w-5 h-5" style={{ color: "#0A66C2" }} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-subtle uppercase tracking-wider font-medium">LinkedIn</div>
                  <div className="text-white font-medium">kristian-jay-eñaga</div>
                </div>
              </a>
              <a href="https://github.com/kristian-enaga" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl glass border-white/5 hover:border-mint/20 hover:bg-white/5 transition-all duration-500 ease-out">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FFFFFF20, #FFFFFF10)", border: "1px solid #FFFFFF30" }}>
                  <Github className="w-5 h-5" style={{ color: "#FFFFFF" }} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-subtle uppercase tracking-wider font-medium">GitHub</div>
                  <div className="text-white font-medium">kristian-enaga</div>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div style={{ transitionDelay: "100ms" }}>
                <h4 className="text-lg font-bold text-white mb-4">Availability & Logistics</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>Zamboanga Sibugay, Philippines</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span>UTC+8 (PHT)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
                    <span>Immediate Availability</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted">
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    <span>Wise / Payoneer / Deel Ready</span>
                  </div>
                </div>
              </div>

              <div style={{ transitionDelay: "200ms" }}>
                <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                <nav className="space-y-2" aria-label="Footer navigation">
                  <a href="#projects" className="flex items-center gap-2 text-muted hover:text-mint transition-colors duration-300 text-sm">Projects — 10 Systems</a>
                  <a href="https://github.com/kristian-enaga" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-mint transition-colors duration-300 text-sm">GitHub Repositories <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" /></a>
                  <a href="https://www.loom.com/share/94749ae3e10d473d85bc6d022a45ef80" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-mint transition-colors duration-300 text-sm">3-min Self-Intro Walkthrough <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" /></a>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 mt-8" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-subtle">
              © 2026 Kristian Jay Eñaga. Built with Next.js, Tailwind, and precision engineering.
            </p>
            <div className="flex items-center gap-5 text-sm text-subtle">
              <a href="https://github.com/kristian-enaga" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/kristian-jay-e%C3%B1aga-85345741a/" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors">LinkedIn</a>
              <a href="mailto:kchanchan2357@gmail.com" className="hover:text-mint transition-colors">Email</a>
              <a href="https://wa.me/639510833623" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}