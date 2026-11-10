"use client";

import { useEffect, useState } from "react";
import { Mail, Linkedin, Github, GraduationCap, Award, CreditCard, Globe, Zap } from "lucide-react";

const education = [
  {
    icon: GraduationCap,
    title: "Bachelor of Science",
    detail: "Information Technology / Computer Science",
    year: "2020",
  },
  {
    icon: Award,
    title: "Make Advanced Certification",
    detail: "Complex scenario architecture & optimization",
    year: "2024",
  },
  {
    icon: Zap,
    title: "n8n Certified (Self-Directed)",
    detail: "Enterprise workflow patterns, custom nodes, MCP",
    year: "2024",
  },
];

const paymentMethods = [
  { icon: CreditCard, name: "Wise", desc: "Multi-currency, low-fee international" },
  { icon: Globe, name: "Payoneer", desc: "Global receiving accounts, mass payout" },
  { icon: CreditCard, name: "Deel", desc: "Contractor compliance, EOR ready" },
];

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "kchanchan2357@gmail.com",
    href: "mailto:kchanchan2357@gmail.com",
    color: "#00ff87",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/kristianjayenaga",
    href: "https://linkedin.com/in/kristianjayenaga",
    color: "#0a66c2",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/kristianjayenaga",
    href: "https://github.com/kristianjayenaga",
    color: "#ffffff",
  },
];

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);

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

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      id="footer"
      className="relative py-20 sm:py-28 lg:py-36 px-6 sm:px-8 lg:px-12 border-t border-white/5"
      aria-labelledby="footer-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
          >
            <h2
              id="footer-title"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-8"
            >
              Operations Brief
            </h2>
            
            <p className="text-lg text-muted/80 leading-relaxed mb-12 max-w-lg">
              GTM Automation Engineer specializing in fail-safe revenue operations. 
              Building systems that eliminate manual data entry, orchestrate multi-provider 
              data waterfalls, and ensure workflow exceptions never break silently.
            </p>

            <div className="space-y-6">
              {education.map((edu, index) => {
                const Icon = edu.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl glass border-white/5 hover:border-mint/20 transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(0, 255, 135, 0.15), rgba(6, 182, 212, 0.15))", border: "1px solid rgba(0, 255, 135, 0.2)" }}>
                      <Icon className="w-5 h-5" style={{ color: "#00ff87" }} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{edu.title}</div>
                      <div className="text-sm text-muted">{edu.detail}</div>
                      <div className="text-xs text-subtle mt-1">{edu.year}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-white/5">
              <h3 className="font-semibold text-white mb-4">Async-Ready Payment Infrastructure</h3>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10">
                      <Icon className="w-4 h-4 text-muted" aria-hidden="true" />
                      <span className="text-sm font-medium text-white">{method.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <h3 className="text-xl font-bold text-white mb-8">Direct Contact Endpoints</h3>
            
            <div className="space-y-4" role="list">
              {contacts.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={index}
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 p-5 rounded-xl glass border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 focus-ring"
                    role="listitem"
                    aria-label={`${contact.label}: ${contact.value}`}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${contact.color}20, ${contact.color}10)`, border: `1px solid ${contact.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color: contact.color }} aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs text-subtle uppercase tracking-wider font-medium">{contact.label}</div>
                      <div className="text-white font-medium group-hover:text-mint transition-colors">{contact.value}</div>
                    </div>
                    {contact.href.startsWith("http") && (
                      <svg className="w-5 h-5 text-muted group-hover:text-mint transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </a>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-white/5">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full text-xs font-medium text-white/70 glass border-white/10" style={{ background: "rgba(0, 255, 135, 0.1)" }}>
                  UTC+8 Timezone
                </span>
                <span className="px-4 py-2 rounded-full text-xs font-medium text-white/70 glass border-white/10" style={{ background: "rgba(6, 182, 212, 0.1)" }}>
                  Enterprise Contracts
                </span>
                <span className="px-4 py-2 rounded-full text-xs font-medium text-white/70 glass border-white/10" style={{ background: "rgba(139, 92, 246, 0.1)" }}>
                  Immediate Availability
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-subtle">
              © {currentYear} Kristian Jay Eñaga. Built with Next.js, Tailwind, and precision engineering.
            </p>
            <div className="flex items-center gap-6 text-sm text-subtle">
              <a href="https://github.com/kristianjayenaga" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/kristianjayenaga" target="_blank" rel="noopener noreferrer" className="hover:text-mint transition-colors">LinkedIn</a>
              <a href="mailto:kchanchan2357@gmail.com" className="hover:text-mint transition-colors">Email</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}