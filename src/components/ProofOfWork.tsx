"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Github, ExternalLink, CheckCircle, Zap, Brain, Shield, Database, Terminal, Globe } from "lucide-react";

const projects = [
  {
    id: "system-01",
    number: "01",
    title: "Enterprise Inbound Lead Sanitizer & Outreach Engine",
    tagline: "E.164 phone normalization, bot filtering, Gemini intent scoring, HubSpot CRM ingestion",
    highlights: [
      { icon: Shield, label: "Phone Validation", desc: "E.164 normalization + carrier lookup" },
      { icon: Brain, label: "AI Intent Scoring", desc: "Gemini structured output classification" },
      { icon: Database, label: "Bot Filtering", desc: "Behavioral heuristics + honeypot detection" },
      { icon: Zap, label: "HubSpot Sync", desc: "Batch API with idempotency keys" },
    ],
    tech: ["n8n", "Gemini API", "HubSpot API", "Twilio Lookup", "Zod"],
    repoUrl: "https://github.com/kristianjayenaga/lead-sanitizer-outreach",
    demoUrl: "#",
    color: "#00ff87",
    gradient: "from-mint/10 to-mint/5",
    borderColor: "border-mint/20",
  },
  {
    id: "system-02",
    number: "02",
    title: "Autonomous Market Intelligence & Lead Waterfall",
    tagline: "SerpAPI discovery, JavaScript/RegEx parsing, Zod schema validation, Telegram HITL approvals",
    highlights: [
      { icon: Globe, label: "SerpAPI Discovery", desc: "Multi-engine search with deduplication" },
      { icon: Terminal, label: "JS/RegEx Parsing", desc: "Dynamic extraction from unstructured HTML" },
      { icon: Shield, label: "Zod Validation", desc: "Runtime schema enforcement + coercion" },
      { icon: Brain, label: "Telegram HITL", desc: "Human-in-the-loop approval workflows" },
    ],
    tech: ["n8n", "SerpAPI", "Cheerio", "Zod", "Telegram Bot API"],
    repoUrl: "https://github.com/kristianjayenaga/market-intel-waterfall",
    demoUrl: "#",
    color: "#06b6d4",
    gradient: "from-cyan/10 to-cyan/5",
    borderColor: "border-cyan/20",
  },
  {
    id: "system-03",
    number: "03",
    title: "AP Invoice Reconciliation & Exception Protection Pipeline",
    tagline: "Multi-format document parsing, line-item mathematical verification, QuickBooks ERP synchronization",
    highlights: [
      { icon: Database, label: "Doc Parsing", desc: "PDF, CSV, Excel → structured line items" },
      { icon: Shield, label: "Math Verification", desc: "Subtotal/tax/total reconciliation ±$0.01" },
      { icon: Zap, label: "QuickBooks Sync", desc: "Bill creation with attachment linking" },
      { icon: Terminal, label: "Exception Queue", desc: "Flagged items routed for manual review" },
    ],
    tech: ["n8n", "Python (pdfplumber)", "QuickBooks API", "Supabase", "OpenAI Vision"],
    repoUrl: "https://github.com/kristianjayenaga/ap-invoice-reconciliation",
    demoUrl: "#",
    color: "#8b5cf6",
    gradient: "from-violet/10 to-violet/5",
    borderColor: "border-violet/20",
  },
  {
    id: "system-04",
    number: "04",
    title: "Centralized Fail-Safe Monitoring & Error Handler",
    tagline: "Centralized execution monitors, diagnostic logging audit trails, Slack alert routing with direct debug triggers",
    highlights: [
      { icon: Shield, label: "Execution Monitors", desc: "Heartbeat + timeout detection per workflow" },
      { icon: Database, label: "Audit Trails", desc: "Immutable logs with full payload capture" },
      { icon: Zap, label: "Slack Routing", desc: "Severity-based channels + thread linking" },
      { icon: Terminal, label: "Debug Triggers", desc: "One-click re-run from alert context" },
    ],
    tech: ["n8n", "Supabase", "Slack API", "Sentry", "Custom Dashboard"],
    repoUrl: "https://github.com/kristianjayenaga/failsafe-monitor",
    demoUrl: "#",
    color: "#f59e0b",
    gradient: "from-amber/10 to-amber/5",
    borderColor: "border-amber/20",
  },
];

export default function ProofOfWork() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = parseInt(target.dataset.index || "0");
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('[data-proj-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  return (
    <section
      id="proof-of-work"
      className="relative py-24 sm:py-32 lg:py-40 px-6 sm:px-8 lg:px-12"
      aria-labelledby="proof-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-violet/20 text-sm font-medium text-violet-400 mb-6">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse-glow" aria-hidden="true" />
            LIVE PROOF-OF-WORK
          </span>
          <h2
            id="proof-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6"
          >
            Featured Solutions
            <br />
            <span className="text-gradient-mint">Deployed Systems</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Production-grade automations translating 10+ GitHub repositories into measurable ROI.
            Each system includes full source code and deployment documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const isVisible = visibleCards.has(index);
            return (
              <article
                key={project.id}
                data-proj-index={index}
                className={`relative card-hover glass rounded-2xl p-8 overflow-hidden transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } ${project.borderColor}`}
                style={{ 
                  transitionDelay: `${index * 120}ms`,
                  background: `linear-gradient(135deg, ${project.gradient})`,
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[${project.color}]/5 to-transparent opacity-0 transition-opacity duration-500" aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[${project.color}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-white/10" aria-hidden="true">SYSTEM {project.number}</span>
                      <div className="w-16 h-px mt-2" style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} aria-hidden="true" />
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`, border: `1px solid ${project.color}30` }}>
                      <Zap className="w-5 h-5" style={{ color: project.color }} aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">{project.title}</h3>
                  <p className="text-sm text-muted/80 mb-6 leading-relaxed">{project.tagline}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6" role="list">
                    {project.highlights.map((highlight, hIndex) => {
                      const Icon = highlight.icon;
                      return (
                        <div key={hIndex} className="flex items-start gap-3 p-3 rounded-xl glass border-white/5 hover:border-mint/20 transition-all duration-300">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)` }}>
                            <Icon className="w-4 h-4" style={{ color: project.color }} aria-hidden="true" />
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">{highlight.label}</div>
                            <div className="text-xs text-muted/60">{highlight.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Technologies used">
                    {project.tech.map((tech, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-3 py-1 rounded-full text-xs font-medium text-white/70"
                        style={{ background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`, border: `1px solid ${project.color}30` }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <a
                      href={project.demoUrl}
                      className="btn-secondary text-sm focus-ring group"
                      onClick={(e) => {
                        e.preventDefault();
                        // Demo link placeholder
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                      Watch Execution
                    </a>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-xl glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300 focus-ring"
                      aria-label={`View ${project.title} repository on GitHub`}
                    >
                      <Github className="w-5 h-5 text-white/60 group-hover:text-mint transition-colors" aria-hidden="true" />
                      <ExternalLink className="w-4 h-4 text-muted group-hover:text-mint transition-colors" aria-hidden="true" />
                      <span className="sr-only">View Repository</span>
                    </a>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[${project.color}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              </article>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/kristianjayenaga"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300 text-sm font-medium focus-ring"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
            View All 10+ Repositories on GitHub
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}