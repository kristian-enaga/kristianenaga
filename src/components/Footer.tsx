"use client";

import { useEffect, useState } from "react";
import { Mail, Linkedin, Github, GraduationCap, Award, CreditCard, Globe, Zap, ArrowUpRight, MessageSquare } from "lucide-react";

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
      className="relative py-16 lg:py-24 px-6 lg:px-12 border-t border-white/5"
      aria-labelledby="footer-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 mb-12">
          <div
            className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex items-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-mint">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-mint rounded-full animate-pulse" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">KRISTIAN JAY EÑAGA</span>
            </div>
            
            <p className="text-muted/80 leading-relaxed mb-8 max-w-xs">
              GTM Automation Engineer. Building fail-safe systems that eliminate manual lead processing, connect business applications, and ensure workflow exceptions never break silently.
            </p>

            <div className="space-y-4">
              {[
                { icon: Award, title: "Make Advanced Certification", detail: "Complex scenario architecture & optimization", year: "2026" },
                { icon: Zap, title: "n8n Expert (Self-Directed)", detail: "Enterprise workflow patterns, custom nodes, MCP", year: "2026" },
              ].map((cred, index) => {
                const Icon = cred.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl glass border-white/5 hover:border-mint/20 transition-all duration-500 ease-out">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(0, 255, 135, 0.15), rgba(6, 182, 212, 0.15))", border: "1px solid rgba(0, 255, 135, 0.2)" }}>
                      <Icon className="w-5 h-5" style={{ color: "#00ff87" }} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{cred.title}</div>
                      <div className="text-sm text-muted">{cred.detail}</div>
                      <div className="text-xs text-subtle mt-1">{cred.year}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <h4 className="font-semibold text-white mb-4">Async-Ready Payment Infrastructure</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: CreditCard, name: "Wise", color: "#00D4AA" },
                  { icon: Globe, name: "Payoneer", color: "#0070C0" },
                  { icon: CreditCard, name: "Deel", color: "#2D9CDB" },
                ].map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10" style={{ borderColor: `${method.color}40` }}>
                      <Icon className="w-4 h-4" style={{ color: method.color }} aria-hidden="true" />
                      <span className="text-sm font-medium text-white">{method.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
                style={{ transitionDelay: "100ms" }}
              >
                <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
                <nav className="space-y-3" aria-label="Footer navigation">
                  <a href="#projects" className="flex items-center gap-2 text-muted hover:text-mint transition-colors duration-300 text-sm">Projects — 10 Systems</a>
                  <a href="https://github.com/kristian-enaga" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-mint transition-colors duration-300 text-sm">GitHub Repositories <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" /></a>
                  <a href="https://www.loom.com/share/94749ae3e10d473d85bc6d022a45ef80" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-mint transition-colors duration-300 text-sm">3-min Self-Intro Walkthrough <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" /></a>
                  <a href="#approach" className="flex items-center gap-2 text-muted hover:text-mint transition-colors duration-300 text-sm">Engineering Approach</a>
                </nav>
              </div>

              <div
                className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
                style={{ transitionDelay: "200ms" }}
              >
                <h4 className="text-lg font-bold text-white mb-6">Connect</h4>
                <div className="space-y-4">
                  {[
                    { icon: MessageSquare, label: "WhatsApp", value: "+63 951 083 3623", href: "https://wa.me/639510833623", color: "#25D366" },
                    { icon: Mail, label: "Email", value: "kchanchan2357@gmail.com", href: "mailto:kchanchan2357@gmail.com", color: "#D14836" },
                    { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/kristian-jay-eñaga", href: "https://www.linkedin.com/in/kristian-jay-e%C3%B1aga-85345741a/", color: "#0A66C2" },
                    { icon: Github, label: "GitHub", value: "github.com/kristian-enaga", href: "https://github.com/kristian-enaga", color: "#FFFFFF" },
                  ].map((contact, index) => {
                    const Icon = contact.icon;
                    return (
                      <a
                        key={index}
                        href={contact.href}
                        target={contact.href.startsWith("http") ? "_blank" : undefined}
                        rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-3 p-4 rounded-xl glass border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-500 ease-out focus-ring"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${contact.color}20, ${contact.color}10)`, border: `1px solid ${contact.color}30` }}>
                          <Icon className="w-5 h-5" style={{ color: contact.color }} aria-hidden="true" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs text-subtle uppercase tracking-wider font-medium">{contact.label}</div>
                          <div className="text-white font-medium group-hover:text-mint transition-colors">{contact.value}</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-mint transition-colors" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-subtle">
              © 2026 Kristian Jay Eñaga. Built with Next.js, Tailwind, and precision engineering.
            </p>
            <div className="flex items-center gap-6 text-sm text-subtle">
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