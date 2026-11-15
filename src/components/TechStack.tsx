"use client";

import { useEffect, useState } from "react";

const techStack = [
  // Infrastructure & DevOps (Self-Hosted)
  { name: "Oracle Cloud (OCI)", category: "Infrastructure & DevOps", color: "#F80000", icon: "oci" },
  { name: "Ubuntu Server", category: "Infrastructure & DevOps", color: "#E95420", icon: "ubuntu" },
  { name: "Docker & Docker Compose", category: "Infrastructure & DevOps", color: "#2496ED", icon: "docker" },
  { name: "Caddy", category: "Infrastructure & DevOps", color: "#000000", icon: "caddy" },
  { name: "Tailscale", category: "Infrastructure & DevOps", color: "#00A3E0", icon: "tailscale" },
  { name: "Cron / Python Keep-Alive", category: "Infrastructure & DevOps", color: "#3776AB", icon: "python" },
  { name: "Vercel", category: "Infrastructure & DevOps", color: "#000000", icon: "vercel" },
  { name: "GitHub Actions", category: "Infrastructure & DevOps", color: "#2088FF", icon: "github-actions" },

  // AI Agents & MCP
  { name: "Model Context Protocol (MCP)", category: "AI Agents & MCP", color: "#8B5CF6", icon: "mcp" },
  { name: "Claude Code", category: "AI Agents & MCP", color: "#D4A843", icon: "claude" },
  { name: "Cline", category: "AI Agents & MCP", color: "#00D4AA", icon: "cline" },
  { name: "Kilo Code", category: "AI Agents & MCP", color: "#6366F1", icon: "kilo" },
  { name: "GitHub Copilot", category: "AI Agents & MCP", color: "#000000", icon: "copilot" },
  { name: "Windsurf", category: "AI Agents & MCP", color: "#06B6D4", icon: "windsurf" },

  // Automation & Orchestration
  { name: "n8n (Self-Hosted)", category: "Automation & Orchestration", color: "#F46800", icon: "n8n" },
  { name: "Make.com", category: "Automation & Orchestration", color: "#00B4D8", icon: "make" },
  { name: "Zapier", category: "Automation & Orchestration", color: "#FF4A00", icon: "zapier" },
  { name: "Clay", category: "Automation & Orchestration", color: "#6366F1", icon: "clay" },

  // Scraping, Extraction & Enrichment
  { name: "Apify", category: "Scraping & Enrichment", color: "#000000", icon: "apify" },
  { name: "Apollo.io", category: "Scraping & Enrichment", color: "#00D4AA", icon: "apollo" },
  { name: "Playwright", category: "Scraping & Enrichment", color: "#2EAD33", icon: "playwright" },
  { name: "Browserless", category: "Scraping & Enrichment", color: "#000000", icon: "browserless" },
  { name: "Firecrawl", category: "Scraping & Enrichment", color: "#F59E0B", icon: "firecrawl" },

  // Backend, Database & APIs
  { name: "Supabase", category: "Backend, Database & APIs", color: "#3ECF8E", icon: "supabase" },
  { name: "PostgreSQL", category: "Backend, Database & APIs", color: "#4169E1", icon: "postgresql" },
  { name: "REST APIs & Webhooks", category: "Backend, Database & APIs", color: "#06B6D4", icon: "api" },

  // Programming & Frontend
  { name: "Python", category: "Programming & Frontend", color: "#3776AB", icon: "python" },
  { name: "TypeScript", category: "Programming & Frontend", color: "#3178C6", icon: "typescript" },
  { name: "React / Next.js", category: "Programming & Frontend", color: "#61DAFB", icon: "react" },

  // CRM & Business Systems
  { name: "HubSpot CRM", category: "CRM & Business Systems", color: "#FF7A59", icon: "hubspot" },
  { name: "GoHighLevel", category: "CRM & Business Systems", color: "#1A1A2E", icon: "gohighlevel" },
  { name: "QuickBooks", category: "CRM & Business Systems", color: "#0077C5", icon: "quickbooks" },
];

const categoryColors = {
  "Infrastructure & DevOps": "#00ff87",
  "AI Agents & MCP": "#8B5CF6",
  "Automation & Orchestration": "#F46800",
  "Scraping & Enrichment": "#F59E0B",
  "Backend, Database & APIs": "#3ECF8E",
  "Programming & Frontend": "#61DAFB",
  "CRM & Business Systems": "#EC4899",
};

const categoryOrder = [
  "Infrastructure & DevOps",
  "AI Agents & MCP",
  "Automation & Orchestration",
  "Scraping & Enrichment",
  "Backend, Database & APIs",
  "Programming & Frontend",
  "CRM & Business Systems",
];

function TechIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    oci: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    ubuntu: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>,
    docker: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M12 22V12M12 22l-5-5M12 22l5-5"/></svg>,
    caddy: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/></svg>,
    tailscale: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    python: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.7 18.3c-1.7.4-3.5.5-5.2.5-3.5 0-6.5-2.7-6.5-6s3-6 6.5-6c1.3 0 2.5.3 3.5.8l1.2-1.2c-1.3-.7-2.7-1-4.3-1-4.4 0-8 3.6-8 8s3.6 8 8 8c1.6 0 3-.3 4.3-1l-1.3-1.3zM11 7c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zm0 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/></svg>,
    vercel: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 3H3v18h18V3zm-2 16H5V5h14v14z"/></svg>,
    "github-actions": <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-11H9v2h6v-2zm0 4H9v2h6v-2z"/></svg>,
    mcp: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    claude: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M10 14h4v-4h-4v4zm0-6h4V4h-4v4z"/></svg>,
    cline: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 8l4 4-4 4M8 12h8"/></svg>,
    kilo: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><text x="12" y="16" fontSize="8" textAnchor="middle" fill="currentColor">K</text></svg>,
    copilot: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>,
    windsurf: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="currentColor" strokeWidth="2" fill="none"/></svg>,
    n8n: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    make: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></svg>,
    zapier: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>,
    clay: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>,
    apify: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 8V4M12 16v4M8 12H4M16 12h4"/></svg>,
    apollo: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2"/></svg>,
    playwright: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    browserless: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 8l-4 4h8l-4-4z"/></svg>,
    firecrawl: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2"/></svg>,
    supabase: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    postgresql: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    api: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8l4-4-4-4M12 16l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    typescript: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><text x="12" y="16" fontSize="8" textAnchor="middle" fill="currentColor">TS</text></svg>,
    react: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>,
    hubspot: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 8l4 4-4 4M8 12h8"/></svg>,
    gohighlevel: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M8 14l4-4 4 4M8 10l4 4 4-4"/></svg>,
    quickbooks: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
  };

  const Icon = icons[name] || <span className="text-xs font-bold">{name.slice(0,2)}</span>;
  
  return (
    <span 
      className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)`, border: `1px solid ${color}25` }}
      aria-hidden="true"
    >
      <span style={{ color }}>{Icon}</span>
    </span>
  );
}

export default function TechStack() {
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

    const element = document.getElementById("tech-stack");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // Group by category
  const grouped = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Array<{ name: string; category: string; color: string; icon: string }>>);

  const categories = categoryOrder.map(cat => [cat, grouped[cat]]).filter(([, techs]) => techs && techs.length > 0) as Array<[string, Array<{ name: string; category: string; color: string; icon: string }>]>;

  return (
    <section
      id="tech-stack"
      className="relative py-24 px-6 lg:px-12"
      aria-labelledby="tech-stack-title"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-amber/20 text-sm font-medium text-amber-400 mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
            PRODUCTION TOOLKIT
          </span>
          <h2 id="tech-stack-title" className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Production-Grade
            <br />
            <span className="text-gradient-cyan">Engineering Stack</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Every tool here runs in production — self-hosted on OCI, zero shared tenancy. No tutorials, no hello-worlds. Systems processing millions of records daily with 99.9% uptime.
          </p>
        </div>

        <div className="space-y-14">
          {categories.map(([category, techs], catIndex) => {
            const color = categoryColors[category as keyof typeof categoryColors] || "#00ff87";
            return (
              <div
                key={category}
                className={`transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                }`}
                style={{ transitionDelay: `${catIndex * 120}ms` }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}25` }}>
                    <span className="w-5 h-5 rounded-lg" style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{category}</h3>
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider ml-2 px-2 py-0.5 rounded" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                      {techs.length} technologies
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {techs.map((tech, index) => (
                    <div
                      key={tech.name}
                      className="group card-hover glass rounded-xl p-4 transition-all duration-500 ease-out hover:border-white/10 hover:bg-white/3 relative overflow-hidden"
                      style={{ 
                        animationDelay: `${catIndex * 120 + index * 40}ms`,
                        animationDuration: '0.5s',
                        animationFillMode: 'both',
                        animationName: "cardEntrance",
                        animationTimingFunction: "ease-out",
                      }}
                    >
                      {/* Subtle top accent bar */}
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} aria-hidden="true" />
                      
                      <TechIcon name={tech.name} color={tech.color} />
                      <div className="mt-3 text-left">
                        <span className="font-semibold text-white text-sm group-hover:text-mint transition-colors">{tech.name}</span>
                        <div className="text-xs text-muted/60 mt-1 capitalize hidden sm:block">{category.split(' & ').join(' / ').toLowerCase()}</div>
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }} aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture Summary */}
        <div
          className={`mt-20 pt-12 border-t border-white/5 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          style={{ transitionDelay: `${categories.length * 120}ms` }}
        >
          <h3 className="text-xl font-bold text-white text-center mb-8">Architecture at a Glance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: "Self-Hosted Core", 
                value: "100%", 
                desc: "OCI Ubuntu + Docker + Caddy + Tailscale",
                color: "#00ff87",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 12h8M12 8v8"/></svg>
              },
              { 
                label: "AI-Native Automation", 
                value: "6", 
                desc: "MCP, Claude Code, Cline, Kilo, Copilot, Windsurf",
                color: "#8B5CF6",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>
              },
              { 
                label: "Orchestration Engines", 
                value: "4", 
                desc: "n8n (self-hosted), Make, Zapier, Clay",
                color: "#F46800",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></svg>
              },
              { 
                label: "Data & Intelligence", 
                value: "5", 
                desc: "Apify, Apollo, Playwright, Browserless, Firecrawl",
                color: "#F59E0B",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center p-5 rounded-2xl glass border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} aria-hidden="true" />
                <div className="relative z-10">
                  <span className="w-11 h-11 mx-auto mb-4 flex items-center justify-center rounded-xl" style={{ background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`, border: `1px solid ${stat.color}25` }}>
                    <span style={{ color: stat.color }} className="w-6 h-6">{stat.icon}</span>
                  </span>
                  <div className="text-3xl lg:text-4xl font-bold text-white mb-1" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-white mb-1">{stat.label}</div>
                  <div className="text-xs text-muted leading-relaxed">{stat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}