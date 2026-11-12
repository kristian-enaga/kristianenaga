"use client";

import { useEffect, useState } from "react";

const techStack = [
  // Workflow Automation
  { name: "n8n", category: "Workflow Automation", color: "#F46800", icon: "n8n" },
  { name: "Make", category: "Workflow Automation", color: "#00B4D8", icon: "make" },
  { name: "Clay", category: "Data Enrichment", color: "#6366F1", icon: "clay" },
  
  // AI & ML
  { name: "Gemini", category: "AI & ML", color: "#4285F4", icon: "gemini" },
  { name: "OpenAI", category: "AI & ML", color: "#10A37F", icon: "openai" },
  { name: "Groq", category: "AI & ML", color: "#F55036", icon: "groq" },
  { name: "OpenRouter", category: "AI & ML", color: "#8B5CF6", icon: "openrouter" },
  
  // Data & Backend
  { name: "Supabase", category: "Data & Backend", color: "#3ECF8E", icon: "supabase" },
  { name: "PostgreSQL", category: "Data & Backend", color: "#4169E1", icon: "postgresql" },
  { name: "Google Sheets", category: "Data & Backend", color: "#34A853", icon: "sheets" },
  { name: "QuickBooks", category: "Data & Backend", color: "#0077C5", icon: "quickbooks" },
  
  // CRM & Communication
  { name: "HubSpot", category: "CRM & Communication", color: "#FF7A59", icon: "hubspot" },
  { name: "Slack", category: "CRM & Communication", color: "#4A154B", icon: "slack" },
  { name: "Gmail", category: "CRM & Communication", color: "#EA4335", icon: "gmail" },
  { name: "Twilio", category: "CRM & Communication", color: "#F22F46", icon: "twilio" },
  { name: "Telegram", category: "CRM & Communication", color: "#0088CC", icon: "telegram" },
  
  // Data Sources & Enrichment
  { name: "Apify", category: "Data Sources", color: "#000000", icon: "apify" },
  { name: "SerpAPI", category: "Data Sources", color: "#4285F4", icon: "serpapi" },
  { name: "Zod", category: "Validation", color: "#3B82F6", icon: "zod" },
  
  // Infrastructure & DevOps
  { name: "Vercel", category: "Infrastructure", color: "#000000", icon: "vercel" },
  { name: "GitHub Actions", category: "CI/CD", color: "#2088FF", icon: "github-actions" },
  { name: "Docker", category: "Infrastructure", color: "#2496ED", icon: "docker" },
];

const categoryColors = {
  "Workflow Automation": "#F46800",
  "AI & ML": "#8B5CF6",
  "Data & Backend": "#3ECF8E",
  "CRM & Communication": "#EC4899",
  "Data Sources": "#F59E0B",
  "Validation": "#3B82F6",
  "Infrastructure": "#000000",
  "CI/CD": "#2088FF",
};

function TechIcon({ name, color }: { name: string; color: string }) {
  // Simple fallback icons for each technology
  const icons: Record<string, React.ReactNode> = {
    n8n: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    make: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/></svg>,
    clay: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>,
    gemini: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>,
    openai: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    groq: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    openrouter: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>,
    supabase: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    postgresql: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    sheets: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" strokeWidth="2"/></svg>,
    quickbooks: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    hubspot: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    slack: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    gmail: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>,
    twilio: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    telegram: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    apify: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    serpapi: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    zod: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    vercel: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    "github-actions": <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
    docker: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>,
  };

  const Icon = icons[name] || <span className="text-xs font-bold">{name.slice(0,2)}</span>;
  
  return (
    <span 
      className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `1px solid ${color}30` }}
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
  }, {} as Record<string, typeof techStack>);

  const categories = Object.entries(grouped);

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
            TOOLKIT
          </span>
          <h2 id="tech-stack-title" className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Production-Grade
            <br />
            <span className="text-gradient-cyan">Engineering Stack</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Every tool here has been battle-tested in production. No tutorials, no hello-worlds — just systems that process millions of records daily.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map(([category, techs], catIndex) => {
            const color = categoryColors[category as keyof typeof categoryColors] || "#00ff87";
            return (
              <div
                key={category}
                className={`transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                }`}
                style={{ transitionDelay: `${catIndex * 100}ms` }}
              >
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `1px solid ${color}30` }}>
                    <span className="w-4 h-4 rounded" style={{ background: color }} aria-hidden="true" />
                  </span>
                  {category}
                  <span className="text-xs font-medium text-white/40 uppercase tracking-wider ml-2 px-2 py-0.5 rounded" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                    {techs.length} tools
                  </span>
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {techs.map((tech, index) => (
                    <div
                      key={tech.name}
                      className="group card-hover glass rounded-xl p-4 transition-all duration-500 ease-out"
                      style={{ 
                        animationDelay: `${catIndex * 100 + index * 30}ms`,
                        animationDuration: '0.5s',
                        animationFillMode: 'both',
                        animationName: "cardEntrance",
                        animationTimingFunction: "ease-out",
                      }}
                    >
                      <TechIcon name={tech.name} color={tech.color} />
                      <div className="mt-3 text-left">
                        <span className="font-semibold text-white text-sm group-hover:text-mint transition-colors">{tech.name}</span>
                        <div className="text-xs text-muted/70 mt-0.5 capitalize">{tech.category.toLowerCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div
          className={`mt-16 pt-12 border-t border-white/5 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
          style={{ transitionDelay: `${categories.length * 100}ms` }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Workflow Engines", value: "3", desc: "n8n, Make, Clay" },
              { label: "AI Models", value: "4+", desc: "Gemini, OpenAI, Groq, OpenRouter" },
              { label: "Data Stores", value: "4", desc: "Supabase, PostgreSQL, Sheets, QuickBooks" },
              { label: "Integrations", value: "10+", desc: "HubSpot, Slack, Gmail, Twilio, Telegram" },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center p-4 rounded-xl glass border-white/5 hover:border-mint/20 transition-all duration-500">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1" style={{ background: "linear-gradient(135deg, #00ff87, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-white">{stat.label}</div>
                <div className="text-xs text-muted mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}