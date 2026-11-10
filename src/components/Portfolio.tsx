"use client";

import { useEffect, useRef, useState } from "react";
import { Github, ExternalLink, Play, Zap, Shield, Brain, Database, Globe, Terminal, Layers, Cloud, ArrowUpRight, CheckCircle, ChevronRight } from "lucide-react";

const projects = [
  {
    id: "01",
    number: "01",
    title: "Inbound Lead Sanitizer & Outreach Engine",
    category: "Revenue Operations",
    categoryColor: "#ef4444",
    problem: "Poor-quality inbound data creates manual cleanup work and delays sales follow-up.",
    solution: "Webhook-based lead intake with E.164 phone normalization, bot filtering, AI intent scoring, and HubSpot CRM sync.",
    architecture: "Webhook → Phone Normalization → Bot Filter → Exception Handling → Gemini Scoring → HubSpot Sync → Slack/WhatsApp Routing",
    highlights: [
      "E.164 phone normalization + carrier lookup",
      "Behavioral bot filtering + honeypot detection",
      "Gemini structured intent classification",
      "HubSpot batch API with idempotency keys",
      "Supabase exception handling",
    ],
    tech: ["n8n", "Gemini API", "HubSpot API", "Twilio Lookup", "Zod", "Supabase"],
    repoUrl: "https://github.com/kristian-enaga/Inbound-Lead-Sanitizer-Engine",
    demoUrl: "https://www.loom.com/share/c38d37d65eed44129a712e530a8e2446",
    color: "#00ff87",
    gradient: "from-mint/10 to-mint/5",
    borderColor: "border-mint/20",
  },
  {
    id: "02",
    number: "02",
    title: "Fault-Tolerant Lead Triage Pipeline",
    category: "Revenue Operations",
    categoryColor: "#ef4444",
    problem: "Lead-processing workflows fail silently on inconsistent payloads, scoring failures, and CRM update problems.",
    solution: "End-to-end lead pipeline with payload sanitization, AI model fallback, CRM updates, and exception visibility.",
    architecture: "Webhook → Payload Sanitization → Gemini/Groq Fallback Scoring → HubSpot CRM → Supabase Exceptions → Slack Priority Alerts",
    highlights: [
      "RegEx payload cleansing & normalization",
      "Gemini primary + Groq fallback scoring",
      "HubSpot CRM update with conflict resolution",
      "Database-backed exception handling",
      "Priority-based Slack routing",
    ],
    tech: ["n8n", "Gemini API", "Groq", "HubSpot API", "Supabase", "Slack API"],
    repoUrl: "https://github.com/kristian-enaga/fault-tolerant-lead-triage-pipeline",
    demoUrl: "https://www.loom.com/share/5d9a49197b574216894cc00822f0069f",
    color: "#06b6d4",
    gradient: "from-cyan/10 to-cyan/5",
    borderColor: "border-cyan/20",
  },
  {
    id: "03",
    number: "03",
    title: "AI Lead Scoring & Priority Router",
    category: "Revenue Operations",
    categoryColor: "#ef4444",
    problem: "Sales teams waste time reviewing every lead manually instead of focusing on high-priority opportunities.",
    solution: "Multi-signal AI scoring (budget, company size, urgency) with multi-tier routing and VIP alerting.",
    architecture: "Webhook → Supabase Raw Backup → Gemini + OpenRouter Fallback → Zod Validation → Multi-Tier Router → Slack VIP / Gmail Standard → Google Sheets Sync",
    highlights: [
      "Multi-signal AI qualification",
      "OpenRouter multi-model fallback",
      "Zod runtime schema validation",
      "VIP vs Standard routing tiers",
      "Google Sheets CRM synchronization",
    ],
    tech: ["n8n", "Gemini API", "OpenRouter", "Google Sheets", "Slack API", "Gmail API", "Zod", "Supabase"],
    repoUrl: "https://github.com/kristian-enaga/AI-Lead-Scoring-Router",
    demoUrl: "https://www.loom.com/share/38164c8a840f4076b3ac0ec62a26e3ce",
    color: "#8b5cf6",
    gradient: "from-violet/10 to-violet/5",
    borderColor: "border-violet/20",
  },
  {
    id: "04",
    number: "04",
    title: "Speed-to-Lead Ingestion Engine",
    category: "Revenue Operations",
    categoryColor: "#ef4444",
    problem: "Manual lead entry and delayed notifications slow initial response — every minute of delay compounds conversion loss.",
    solution: "Instant webhook capture, field normalization, Google Sheets logging, and immediate Slack team notifications.",
    architecture: "Webhook Ingestion → Payload Normalization → Google Sheets Recording → Slack Notification",
    highlights: [
      "Sub-second webhook ingestion",
      "Automatic field normalization",
      "Google Sheets audit trail",
      "Instant Slack team alerts",
    ],
    tech: ["n8n", "Google Sheets API", "Slack API", "Webhooks"],
    repoUrl: "https://github.com/kristian-enaga/Speed-to-lead-ingestion-engine",
    demoUrl: "https://www.loom.com/share/707c78cf35df44a4adf3ee1a04d75b57",
    color: "#f59e0b",
    gradient: "from-amber/10 to-amber/5",
    borderColor: "border-amber/20",
  },
  {
    id: "05",
    number: "05",
    title: "B2B Outbound Prospecting Engine",
    category: "GTM Intelligence",
    categoryColor: "#06b6d4",
    problem: "Manual prospect research and email drafting consume hours of repetitive work per campaign.",
    solution: "Automated company discovery, scraping, AI email drafting, human approval gate, controlled dispatch, and logging.",
    architecture: "Apify Scraping → Gemini Email Drafting → Slack Human-in-the-Loop Approval → Dispatch → Logging",
    highlights: [
      "Automated company discovery via Apify",
      "Gemini personalized email generation",
      "Human approval before every send",
      "Full outbound workflow logging",
      "Controlled dispatch with rate limiting",
    ],
    tech: ["n8n", "Apify", "Gemini API", "Slack API", "Gmail API"],
    repoUrl: "https://github.com/kristian-enaga/Automated-B2B-Outbound-System",
    demoUrl: "https://www.loom.com/share/5d3416feda7148bbbd60704ab9b5976e",
    color: "#00ff87",
    gradient: "from-mint/10 to-mint/5",
    borderColor: "border-mint/20",
  },
  {
    id: "06",
    number: "06",
    title: "Market Intelligence & B2B Lead Waterfall",
    category: "GTM Intelligence",
    categoryColor: "#06b6d4",
    problem: "Finding relevant companies and preparing usable prospect data requires disconnected research and processing steps.",
    solution: "Search-based discovery, URL verification, content processing, AI analysis, schema validation, and human review.",
    architecture: "SerpAPI → URL Verification → JS/RegEx Processing → Gemini + Groq Fallback → Zod Validation → Exception Handling → Telegram Approval",
    highlights: [
      "SerpAPI multi-engine search",
      "JavaScript/RegEx content extraction",
      "Dual-model AI fallback (Gemini/Groq)",
      "Zod structured output validation",
      "Telegram human-in-the-loop approval",
    ],
    tech: ["n8n", "SerpAPI", "Cheerio", "Gemini API", "Groq", "Zod", "Telegram Bot API"],
    repoUrl: "https://github.com/kristian-enaga/autonomous-market-intelligence-engine",
    demoUrl: "https://www.loom.com/share/7792580657284a58a7e1dabf99365087",
    color: "#06b6d4",
    gradient: "from-cyan/10 to-cyan/5",
    borderColor: "border-cyan/20",
  },
  {
    id: "07",
    number: "07",
    title: "Native Clay Multi-Provider Lead Waterfall",
    category: "GTM Intelligence",
    categoryColor: "#06b6d4",
    problem: "Prospect records are incomplete — enrichment from multiple providers needed before sales can act.",
    solution: "Clay-native cascading enrichment with multi-provider contact lookup, ICP tiering, and AI outreach synthesis.",
    architecture: "Clay Waterfall → Multi-Provider Lookup → AI ICP Fit Tiering → GTM Message Synthesis",
    highlights: [
      "Cascading multi-provider enrichment",
      "ICP classification & tiering",
      "AI-assisted outreach personalization",
      "Tier-based lead prioritization",
    ],
    tech: ["Clay", "Multi-Provider APIs", "AI Enrichment", "ICP Modeling"],
    repoUrl: "https://github.com/kristian-enaga/native-clay-multi-year-waterfall-engine/blob/main/README.md",
    demoUrl: "https://www.loom.com/share/149144121b134f38b4d0752c959ef02",
    color: "#8b5cf6",
    gradient: "from-violet/10 to-violet/5",
    borderColor: "border-violet/20",
  },
  {
    id: "08",
    number: "08",
    title: "AP Invoice Reconciliation & Exception Protection",
    category: "Process Automation",
    categoryColor: "#f59e0b",
    problem: "Invoice processing involves repetitive extraction, calculation checks, reconciliation, and exception review.",
    solution: "Multi-channel ingestion, AI document parsing, mathematical verification, exception logging, human approval, QuickBooks sync.",
    architecture: "Gmail/Webhook → Multi-Format Parser → Gemini/OpenAI Fallback → Math Verification → Supabase Exceptions → Slack Approval → QuickBooks Online",
    highlights: [
      "PDF/CSV/Excel → structured line items",
      "Subtotal/tax/total verification ±$0.01",
      "Exception queue for manual review",
      "Human approval before accounting actions",
      "QuickBooks Online bill creation with attachments",
    ],
    tech: ["n8n", "Python (pdfplumber)", "Gemini API", "OpenAI", "QuickBooks API", "Supabase", "Slack API"],
    repoUrl: "https://github.com/kristian-enaga/enterprise-ap-invoice-reconciliation-engine",
    demoUrl: "https://www.loom.com/share/595e7e48d6ab4a1f89263d23496f9d67",
    color: "#ef4444",
    gradient: "from-red/10 to-red/5",
    borderColor: "border-red/20",
  },
  {
    id: "09",
    number: "09",
    title: "E-Commerce Revenue Recovery Engine",
    category: "Process Automation",
    categoryColor: "#f59e0b",
    problem: "Incomplete purchases need timely follow-up, but reminding customers who already purchased creates poor experience.",
    solution: "Stateful delays, purchase-status verification, AI email generation, and conditional Gmail dispatch.",
    architecture: "Make Scenario → Webhook → Stateful Delay Gates → Supabase Purchase Check → Gemini Email → Gmail Dispatch",
    highlights: [
      "Stateful workflow delay gates",
      "Purchase-status verification before send",
      "Conditional follow-up logic",
      "AI-generated recovery emails",
      "Gmail integration",
    ],
    tech: ["Make", "Supabase", "Gemini API", "Gmail API", "Webhooks"],
    repoUrl: "https://github.com/kristian-enaga/autonomous-revenue-recovery-engine",
    demoUrl: "https://www.loom.com/share/311bfc94eee1429080f6fe5ed3cf62c0",
    color: "#06b6d4",
    gradient: "from-cyan/10 to-cyan/5",
    borderColor: "border-cyan/20",
  },
  {
    id: "10",
    number: "10",
    title: "Centralized n8n Error Handler",
    category: "Process Automation",
    categoryColor: "#f59e0b",
    problem: "Workflow failures go unnoticed or become difficult to investigate when execution info is scattered.",
    solution: "Centralized failure capture, diagnostic logging, multi-channel alerts, and direct debug links to failed executions.",
    architecture: "Centralized Error Handler → Google Sheets Audit Logs → Gmail/Slack Alerts → Execution Debug Links",
    highlights: [
      "Centralized execution failure capture",
      "Immutable audit trails with full payloads",
      "Severity-based alert routing",
      "One-click debug links to failed runs",
      "Google Sheets + Slack + Gmail notifications",
    ],
    tech: ["n8n", "Supabase", "Slack API", "Gmail API", "Google Sheets API"],
    repoUrl: "https://github.com/kristian-enaga/n8n-Centralized-Error-Handler",
    demoUrl: "https://www.loom.com/share/ea1602f3bd8a4086983c96590e49136f",
    color: "#8b5cf6",
    gradient: "from-violet/10 to-violet/5",
    borderColor: "border-violet/20",
  },
];

const categoryOrder = [
  { id: "revenue", label: "Revenue Operations & CRM Automation", color: "#ef4444", count: 4 },
  { id: "gtm", label: "GTM Intelligence & Prospecting", color: "#06b6d4", count: 3 },
  { id: "process", label: "Business Process Automation & Reliability", color: "#f59e0b", count: 3 },
];

export default function Portfolio() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");
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

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => {
        if (activeCategory === "revenue") return p.category === "Revenue Operations";
        if (activeCategory === "gtm") return p.category === "GTM Intelligence";
        if (activeCategory === "process") return p.category === "Process Automation";
        return true;
      });

  return (
    <section
      id="portfolio"
      className="relative py-24 sm:py-32 lg:py-40 px-6 lg:px-12"
      aria-labelledby="portfolio-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-violet/20 text-sm font-medium text-violet-400 mb-6">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" aria-hidden="true" />
            PORTFOLIO EVIDENCE
          </span>
          <h2 id="portfolio-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            10 Systems.
            <br />
            <span className="text-gradient-mint">Zero Silent Failures.</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Each project is an independent, documented automation system with source code, architecture diagrams, and a recorded walkthrough.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12" role="tablist" aria-label="Filter by business category">
          <button
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus-ring ${
              activeCategory === "all"
                ? "bg-mint/20 border-mint/30 text-mint"
                : "glass border-white/10 text-muted hover:text-foreground hover:border-white/20"
            }`}
          >
            All Projects ({projects.length})
          </button>
          {categoryOrder.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus-ring ${
                activeCategory === cat.id
                  ? `bg-[${cat.color}]/20 border-[${cat.color}]/30 text-[${cat.color}]`
                  : "glass border-white/10 text-muted hover:text-foreground hover:border-white/20"
              }`}
              style={{ borderColor: activeCategory === cat.id ? cat.color : undefined }}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project, index) => {
            const isVisible = visibleCards.has(index);
            return (
              <article
                key={project.id}
                data-proj-index={index}
                className={`relative card-hover glass rounded-2xl p-7 lg:p-8 overflow-hidden transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } ${project.borderColor}`}
                style={{ 
                  transitionDelay: `${index * 80}ms`,
                  background: `linear-gradient(135deg, ${project.gradient})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[${project.color}]/5 to-transparent opacity-0 transition-opacity duration-500" aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[${project.color}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className="text-2xl font-bold text-white/10" aria-hidden="true">SYSTEM {project.number}</span>
                      <div className="w-14 h-px mt-2" style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} aria-hidden="true" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium text-white/80" style={{ background: `linear-gradient(135deg, ${project.categoryColor}20, ${project.categoryColor}10)`, border: `1px solid ${project.categoryColor}30` }}>
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 leading-tight">{project.title}</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                    <div>
                      <span className="text-subtle block mb-1">Problem</span>
                      <p className="text-white/80 leading-relaxed">{project.problem}</p>
                    </div>
                    <div>
                      <span className="text-subtle block mb-1">Solution</span>
                      <p className="text-white/80 leading-relaxed">{project.solution}</p>
                    </div>
                  </div>

                  <div className="mb-5 p-3 rounded-xl glass border-white/5">
                    <span className="text-subtle text-xs block mb-2">Architecture Flow</span>
                    <p className="text-xs text-white/70 leading-relaxed font-mono">{project.architecture}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5" role="list" aria-label="Key highlights">
                    {project.highlights.slice(0, 3).map((highlight, hIndex) => (
                      <span key={hIndex} className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/80 glass border-white/5" style={{ background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)` }}>
                        {highlight}
                      </span>
                    ))}
                    {project.highlights.length > 3 && (
                      <span className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted glass border-white/5">
                        +{project.highlights.length - 3} more
                      </span>
                    )}
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

                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm focus-ring group"
                    >
                      <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                      Watch Demo
                    </a>
                    <div className="flex items-center gap-3">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-xl glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300 focus-ring"
                        aria-label={`View ${project.title} repository on GitHub`}
                      >
                        <Github className="w-5 h-5 text-white/60 group-hover:text-mint transition-colors" aria-hidden="true" />
                        <span className="sr-only">GitHub</span>
                      </a>
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 p-2.5 rounded-xl glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300 focus-ring text-xs font-medium text-white/70"
                        aria-label={`Open ${project.title} on GitHub`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        Code
                      </a>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[${project.color}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              </article>
            );
          })}
        </div>

        {activeCategory !== "all" && (
          <div className="text-center mt-10">
            <button
              onClick={() => setActiveCategory("all")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-300 text-sm font-medium focus-ring"
            >
              Show All {projects.length} Projects
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}