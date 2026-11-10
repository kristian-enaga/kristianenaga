"use client";

import { useEffect, useRef, useState } from "react";
import {
  Workflow,
  Database,
  Server,
  GitBranch,
  Zap,
  Brain,
  Layers,
  Terminal,
  Globe,
  Shield,
  Cloud,
  Code,
} from "lucide-react";

const capabilityCategories = [
  {
    id: "workflow",
    title: "Workflow & Automation",
    icon: Workflow,
    color: "#00ff87",
    bgGradient: "from-mint/10 to-mint/5",
    borderColor: "border-mint/20",
    skills: [
      { name: "n8n", level: "Expert", desc: "Complex multi-node workflows, custom nodes, webhook orchestration" },
      { name: "Make (Integromat)", level: "Advanced", desc: "Scenario design, data transformation, error handling patterns" },
      { name: "Custom MCP Servers", level: "Expert", desc: "Model Context Protocol implementations for AI tool use" },
      { name: "Webhook Architecture", level: "Expert", desc: "Retry logic, idempotency, signature verification, queue management" },
    ],
  },
  {
    id: "gtm-data",
    title: "GTM Data & CRMs",
    icon: Database,
    color: "#06b6d4",
    bgGradient: "from-cyan/10 to-cyan/5",
    borderColor: "border-cyan/20",
    skills: [
      { name: "HubSpot CRM", level: "Expert", desc: "Custom objects, associations, batch APIs, private apps" },
      { name: "Clay Multi-Provider Waterfalls", level: "Advanced", desc: "Sequential enrichment, conditional logic, cost optimization" },
      { name: "QuickBooks Online", level: "Advanced", desc: "Invoice sync, expense tracking, ERP reconciliation pipelines" },
      { name: "Apollo / LinkedIn APIs", level: "Intermediate", desc: "People search, company enrichment, intent signals" },
    ],
  },
  {
    id: "data-ai",
    title: "Data & AI Infrastructure",
    icon: Brain,
    color: "#8b5cf6",
    bgGradient: "from-violet/10 to-violet/5",
    borderColor: "border-violet/20",
    skills: [
      { name: "Supabase / PostgreSQL", level: "Expert", desc: "Row-level security, realtime, edge functions, migrations" },
      { name: "Python (FastAPI, Pandas)", level: "Expert", desc: "Data pipelines, ETL, statistical validation, API services" },
      { name: "Google Gemini / OpenAI / Groq", level: "Advanced", desc: "Structured outputs, function calling, prompt engineering" },
      { name: "OpenRouter / Multi-Model Routing", level: "Advanced", desc: "Cost/latency optimization, fallback chains, model selection" },
    ],
  },
  {
    id: "engineering",
    title: "Engineering Environment",
    icon: Terminal,
    color: "#f59e0b",
    bgGradient: "from-amber/10 to-amber/5",
    borderColor: "border-amber/20",
    skills: [
      { name: "GitHub / Codespaces", level: "Expert", desc: "CI/CD, Actions, dependency management, security scanning" },
      { name: "REST APIs & Webhooks", level: "Expert", desc: "OpenAPI spec design, rate limiting, versioning, documentation" },
      { name: "Docker / Containerization", level: "Advanced", desc: "Multi-stage builds, compose orchestration, production hardening" },
      { name: "Observability Stack", level: "Advanced", desc: "Structured logging, distributed tracing, alerting, SLOs" },
    ],
  },
];

export default function CapabilitiesMatrix() {
  const [visibleCategories, setVisibleCategories] = useState<Set<number>>(new Set());
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = parseInt(target.dataset.index || "0");
            setVisibleCategories((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('[data-cat-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section
      id="capabilities"
      className="relative py-24 sm:py-32 lg:py-40 px-6 sm:px-8 lg:px-12"
      aria-labelledby="capabilities-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-cyan/20 text-sm font-medium text-cyan mb-6">
            <span className="w-2 h-2 bg-cyan rounded-full animate-pulse-glow" aria-hidden="true" />
            SOLUTIONS MATRIX
          </span>
          <h2
            id="capabilities-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6"
          >
            Technical Capabilities
            <br />
            <span className="text-gradient-mint">Engineered for Scale</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Deep expertise across the modern GTM automation stack — from workflow orchestration to AI inference infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {capabilityCategories.map((category, catIndex) => {
            const Icon = category.icon;
            const isVisible = visibleCategories.has(catIndex);
            const isHovered = hoveredCategory === category.id;
            return (
              <article
                key={category.id}
                data-cat-index={catIndex}
                className={`relative card-hover glass rounded-2xl p-7 transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } ${category.borderColor}`}
                style={{ 
                  transitionDelay: `${catIndex * 80}ms`,
                  background: `linear-gradient(135deg, ${category.bgGradient})`,
                }}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`, border: `1px solid ${category.color}30` }}>
                      <Icon className="w-6 h-6" style={{ color: category.color }} aria-hidden="true" />
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}>
                      <Zap className="w-4 h-4 text-background" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{category.title}</h3>
                  <p className="text-sm text-muted/70 mb-6">Core competencies for enterprise-grade delivery</p>

                  <ul className="space-y-4" role="list">
                    {category.skills.map((skill, skillIndex) => (
                      <li key={skill.name} className="group relative pl-10">
                        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full transition-all duration-300" style={{ background: category.color, opacity: isHovered ? 1 : 0.4, transform: isHovered ? 'scale(1.2)' : 'scale(1)' }} aria-hidden="true" />
                        <div className="font-medium text-white group-hover:text-mint transition-colors">{skill.name}</div>
                        <div className="text-xs text-muted/60 mt-0.5">{skill.level}</div>
                        <div className="text-xs text-subtle mt-1 line-clamp-2 group-hover:text-muted/80 transition-colors">{skill.desc}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[${category.color}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}