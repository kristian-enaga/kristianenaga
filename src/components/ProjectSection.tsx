"use client";

import { useState, useEffect, useRef } from "react";
import { Github, ExternalLink, Play, ChevronRight, ArrowRight, X, Zap, Brain, Database, Globe, Terminal, Layers, Cloud, Shield, CheckCircle } from "lucide-react";

interface Project {
  id: string;
  number: string;
  category: string;
  categoryLabel: string;
  title: string;
  repo: string;
  tech: string[];
  loom: string;
  businessProblem: string;
  whatItDoes: string;
  architecture: string[];
  technicalImpl: string[];
  businessRelevance: string;
}

const projectsData: Project[] = [
  {
    id: "01",
    number: "01",
    category: "RevOps",
    categoryLabel: "Revenue Operations & CRM Automation",
    title: "Inbound Lead Sanitizer & Outreach Engine",
    repo: "Inbound-Lead-Sanitizer-Engine",
    tech: ["n8n", "Supabase", "Gemini", "HubSpot", "Twilio"],
    loom: "c38d37d65eed44129a712e530a8e2446",
    businessProblem: "Poor-quality inbound data creates manual cleanup work and delays sales follow-up. Invalid phone numbers, suspicious submissions, and incomplete information affect CRM quality and sales operations.",
    whatItDoes: "An automated inbound lead-processing system that captures submissions, standardizes phone numbers, filters suspicious entries, evaluates lead intent using AI, and synchronizes qualified records with HubSpot.",
    architecture: ["Webhook Intake", "E.164 Phone Normalization", "Bot Filtering", "Supabase Exception Handling", "Gemini Intent Scoring", "HubSpot Sync", "Slack/WhatsApp Routing"],
    technicalImpl: [
      "Webhook-based lead ingestion with HMAC verification",
      "Phone number normalization using E.164 formatting + carrier lookup",
      "Behavioral bot filtering + honeypot detection",
      "AI-assisted lead intent classification via Gemini structured outputs",
      "Supabase/PostgreSQL-backed exception handling with audit trails",
      "HubSpot CRM synchronization via batch API with idempotency keys",
      "Slack and WhatsApp notifications for sales team"
    ],
    businessRelevance: "Improves inbound lead data quality by 80%+ and reduces manual preparation before sales follow-up from hours to seconds. Sales team receives only actionable, qualified records."
  },
  {
    id: "02",
    number: "02",
    category: "RevOps",
    categoryLabel: "Revenue Operations & CRM Automation",
    title: "Fault-Tolerant Lead Triage Pipeline",
    repo: "fault-tolerant-lead-triage-pipeline",
    tech: ["n8n", "Groq", "HubSpot", "Supabase", "Slack"],
    loom: "5d9a49197b574216894cc00822f0069f",
    businessProblem: "Lead-processing workflows must account for inconsistent payloads, processing failures, and CRM update problems. Without validation and exception handling, unreliable data affects downstream sales operations.",
    whatItDoes: "A lead-processing workflow that sanitizes incoming information, performs AI-assisted scoring with model fallback, updates CRM records, and routes priority notifications while providing database-backed exception handling.",
    architecture: ["Webhook Intake", "Payload Sanitization & RegEx Cleansing", "Gemini/Groq Fallback Scoring", "HubSpot CRM Update", "Supabase Exception Handling", "Slack Priority Alert"],
    technicalImpl: [
      "Webhook payload processing with schema validation",
      "Input sanitization and RegEx cleansing for inconsistent payloads",
      "AI model fallback logic: Gemini primary + Groq ultra-fast fallback",
      "HubSpot CRM update integration with conflict resolution",
      "Supabase-backed exception handling with full payload capture",
      "Priority-based Slack routing (VIP vs standard leads)"
    ],
    businessRelevance: "Eliminates silent CRM failures. Every exception is logged, alerted, and recoverable. Sales team can trust that no lead falls through the cracks."
  },
  {
    id: "03",
    number: "03",
    category: "RevOps",
    categoryLabel: "Revenue Operations & CRM Automation",
    title: "AI Lead Scoring & Priority Router",
    repo: "AI-Lead-Scoring-Router",
    tech: ["n8n", "OpenRouter", "Google Sheets", "Slack", "Gmail", "Supabase"],
    loom: "38164c8a840f4076b3ac0ec62a26e3ce",
    businessProblem: "Sales teams need a consistent way to prioritize incoming inquiries instead of reviewing every lead manually. Without structured qualification, high-intent opportunities receive the same treatment as low-priority submissions.",
    whatItDoes: "An AI-assisted lead qualification and routing system that evaluates budget, company size, urgency, and other signals to assign priority levels and direct records into appropriate follow-up paths.",
    architecture: ["Webhook Intake", "Supabase Raw Lead Backup", "Gemini + OpenRouter Fallback", "Zod Schema Validation", "Multi-Tier IF Router", "Slack VIP / Gmail Standard", "Sheets Sync"],
    technicalImpl: [
      "Multi-signal AI scoring: budget, company size, urgency, intent",
      "OpenRouter multi-model routing for cost/latency optimization",
      "Zod runtime schema validation with coercion & defaults",
      "Raw lead persistence in Supabase for audit trail",
      "Multi-tier priority routing (VIP → Slack instant, Standard → Gmail)",
      "Google Sheets CRM synchronization for team visibility"
    ],
    businessRelevance: "Reps focus only on high-intent leads. VIP alerts hit Slack in <30 seconds. Standard leads get automated responses. Zero manual triage needed."
  },
  {
    id: "04",
    number: "04",
    category: "RevOps",
    categoryLabel: "Revenue Operations & CRM Automation",
    title: "Speed-to-Lead Ingestion Engine",
    repo: "Speed-to-lead-ingestion-engine",
    tech: ["n8n", "Webhooks", "Google Sheets", "Slack"],
    loom: "707c78cf35df44a4adf3ee1a04d75b57",
    businessProblem: "Manual lead entry and delayed internal notifications slow initial response. Sales reps may not know about new inquiries until someone manually forwards the information.",
    whatItDoes: "A webhook-based lead ingestion workflow that receives submissions, standardizes fields, records them in Google Sheets, and sends immediate Slack notifications.",
    architecture: ["Webhook Ingestion", "Payload Normalization", "Google Sheets Recording", "Slack Notification"],
    technicalImpl: [
      "Sub-100ms webhook ingestion with idempotency keys",
      "Automatic field normalization and validation",
      "Google Sheets integration for audit trail and team access",
      "Instant Slack notifications with lead context",
      "Retry logic with exponential backoff for reliability"
    ],
    businessRelevance: "First response time drops from minutes to seconds. Every lead touches the CRM instantly. Team awareness is immediate, not delayed."
  },
  {
    id: "05",
    number: "05",
    category: "GTM Intel",
    categoryLabel: "GTM Intelligence & Prospecting",
    title: "B2B Outbound Prospecting Engine",
    repo: "Automated-B2B-Outbound-System",
    tech: ["Apify", "Gemini", "Gmail", "Slack", "n8n"],
    loom: "5d3416feda7148bbbd60704ab9b5976e",
    businessProblem: "Manual prospect research and outreach preparation require repetitive information gathering, company analysis, and email writing. This makes outbound prospecting time-consuming and inconsistent.",
    whatItDoes: "An automated prospecting workflow that discovers companies, gathers intelligence, generates AI-assisted outreach drafts, and introduces human approval before email dispatch.",
    architecture: ["Apify Scraping", "Gemini Email Drafting", "Slack Human-in-the-Loop Approval", "Dispatch", "Logging"],
    technicalImpl: [
      "Automated company discovery and scraping via Apify actors",
      "AI-assisted personalized email generation using Gemini",
      "Human-in-the-loop approval through Slack (HITL pattern)",
      "Controlled email dispatch with rate limiting and tracking",
      "Full outbound workflow logging for compliance and iteration"
    ],
    businessRelevance: "Outbound scales without spam risk. Every email is personalized, approved, and tracked. Research time per prospect drops from 15 min to <30 seconds."
  },
  {
    id: "06",
    number: "06",
    category: "GTM Intel",
    categoryLabel: "GTM Intelligence & Prospecting",
    title: "Market Intelligence & Lead Waterfall",
    repo: "autonomous-market-intelligence-engine",
    tech: ["SerpAPI", "Zod", "Telegram", "Gemini", "Groq", "n8n"],
    loom: "7792580657284a58a7e1dabf99365087",
    businessProblem: "Finding relevant companies and preparing usable prospect information requires disconnected research steps. Unverified URLs and unstructured data reduce usefulness.",
    whatItDoes: "A market intelligence workflow that discovers companies via search APIs, verifies URLs, processes content, performs AI analysis, validates structured results, and routes for human approval.",
    architecture: ["SerpAPI Search", "URL Verification", "JS/RegEx Processing", "Gemini + Groq Fallback", "Zod Validation", "Exception Handling", "Telegram Approval"],
    technicalImpl: [
      "SerpAPI multi-engine search for company discovery",
      "URL verification and accessibility checking",
      "JavaScript/RegEx content extraction from web pages",
      "Dual-model AI fallback: Gemini + Groq for reliability",
      "Zod structured output validation with error handling",
      "Telegram human-in-the-loop approval for quality control"
    ],
    businessRelevance: "Research becomes pipeline. Verified, enriched, structured prospect data flows directly to sales. Manual research hours eliminated."
  },
  {
    id: "07",
    number: "07",
    category: "GTM Intel",
    categoryLabel: "GTM Intelligence & Prospecting",
    title: "Native Clay Multi-Provider Lead Waterfall",
    repo: "native-clay-multi-year-waterfall-engine",
    tech: ["Clay", "Multi-Provider APIs", "AI Enrichment", "ICP Modeling"],
    loom: "149144121b134f38b4d0752c959ef02",
    businessProblem: "Prospect records are incomplete. Relying on a single provider leaves gaps in contact information. Sales teams can't act on partial data.",
    whatItDoes: "A Clay-based lead enrichment workflow using cascading multi-provider lookups, ICP fit tiering, and AI-assisted outreach synthesis.",
    architecture: ["Clay Waterfall", "Multi-Provider Lookup", "AI ICP Tiering", "GTM Message Synthesis"],
    technicalImpl: [
      "Native Clay enrichment workflow with cascading providers",
      "Multi-provider contact lookups (email, phone, social)",
      "ICP classification and tier-based lead prioritization",
      "AI-assisted outreach personalization per tier",
      "Tier-based lead evaluation for sales routing"
    ],
    businessRelevance: "Contact completeness >90%. Sales gets enriched, tiered prospects ready for outreach. No more manual data stitching."
  },
  {
    id: "08",
    number: "08",
    category: "Automation",
    categoryLabel: "Business Process Automation & Reliability",
    title: "AP Invoice Reconciliation Engine",
    repo: "enterprise-ap-invoice-reconciliation-engine",
    tech: ["Gemini", "OpenAI", "QuickBooks", "Supabase", "Slack", "Python", "n8n"],
    loom: "595e7e48d6ab4a1f89263d23496f9d67",
    businessProblem: "Invoice processing involves repetitive document extraction, line-item calculations, reconciliation, and exception review. Manual verification introduces delays and risks overlooked discrepancies.",
    whatItDoes: "An accounts payable automation that ingests invoices, extracts data via AI, verifies math to ±$0.01, logs exceptions, requires human approval, and syncs to QuickBooks.",
    architecture: ["Gmail/Webhook Trigger", "Multi-Format Parser", "Gemini/OpenAI Fallback", "Math Verification", "Supabase Exceptions", "Slack Approval", "QuickBooks Sync"],
    technicalImpl: [
      "Multi-channel ingestion: Gmail attachments + webhooks",
      "Multi-format parsing: PDF, CSV, Excel via Python (pdfplumber)",
      "AI extraction with Gemini primary + OpenAI fallback",
      "Automated line-item mathematical verification (±$0.01 tolerance)",
      "Supabase exception logging with full document context",
      "Slack human approval before accounting actions",
      "QuickBooks Online bill creation with attachment linking"
    ],
    businessRelevance: "AP cycle cuts 80%. Math errors eliminated. Every discrepancy flagged, reviewed, and resolved before hitting the ERP. Audit-ready trail."
  },
  {
    id: "09",
    number: "09",
    category: "Automation",
    categoryLabel: "Business Process Automation & Reliability",
    title: "E-Commerce Revenue Recovery Engine",
    repo: "autonomous-revenue-recovery-engine",
    tech: ["Make", "Stateful Delays", "Supabase", "Gemini", "Gmail"],
    loom: "311bfc94eee1429080f6fe5ed3cf62c0",
    businessProblem: "Incomplete purchases need timely follow-up, but reminding customers who already purchased creates poor experience. Manual tracking doesn't scale.",
    whatItDoes: "An automated recovery workflow that tracks abandonment, applies stateful delays, verifies purchase status before follow-up, generates AI emails, and dispatches via Gmail.",
    architecture: ["Make Scenario", "Webhook Ingestion", "Stateful Delay Gates", "Supabase Purchase Check", "Gemini Email Generation", "Gmail Dispatch"],
    technicalImpl: [
      "Make automation scenario with stateful delay gates",
      "Webhook event ingestion from e-commerce platform",
      "Supabase purchase-status verification before each send",
      "Conditional follow-up logic (only if not purchased)",
      "AI-generated recovery emails personalized to cart",
      "Gmail integration with tracking and unsubscribe"
    ],
    businessRelevance: "Revenue recovered automatically. Zero duplicate nudges to converted customers. Personalized, timed follow-up that converts."
  },
  {
    id: "10",
    number: "10",
    category: "Automation",
    categoryLabel: "Business Process Automation & Reliability",
    title: "Centralized n8n Error Handler",
    repo: "n8n-Centralized-Error-Handler",
    tech: ["n8n", "Slack", "Gmail", "Google Sheets", "Supabase"],
    loom: "ea1602f3bd8a4086983c96590e49136f",
    businessProblem: "Workflow failures go unnoticed or become difficult to investigate when execution info is scattered across individual automations.",
    whatItDoes: "A centralized error-handling workflow that captures all n8n failures, records diagnostics, sends multi-channel alerts, and provides one-click debug links.",
    architecture: ["Centralized Handler", "Sheets Audit Logs", "Gmail/Slack Alerts", "Debug Links"],
    technicalImpl: [
      "Centralized error capture via n8n error workflow pattern",
      "Google Sheets audit logs with full execution context",
      "Multi-channel alerts: Slack (instant) + Gmail (persistent)",
      "One-click debug links to failed executions in n8n",
      "Severity-based routing and escalation paths"
    ],
    businessRelevance: "MTTR drops from hours to minutes. Every failure visible, traceable, actionable. Operations team never blindsided by silent breaks."
  },
];

const categoryColors = {
  "RevOps": "#dc2626",
  "GTM Intel": "#06b6d4",
  "Automation": "#f59e0b",
};

export default function ProjectSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [cardGlow, setCardGlow] = useState<Record<string, { x: number; y: number }>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const handleMouseEnter = () => setDrawerOpen(true);
    const handleMouseLeave = () => setDrawerOpen(false);

    heading.addEventListener("mouseenter", handleMouseEnter);
    heading.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heading.removeEventListener("mouseenter", handleMouseEnter);
      heading.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleCardMouseMove = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCardGlow(prev => ({
      ...prev,
      [id]: { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }));
  };

  const handleCardMouseLeave = (id: string) => {
    setCardGlow(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const project = hoveredProject ? projectsData.find(p => p.id === hoveredProject) : null;
  const drawerColor = project ? (categoryColors[project.category as keyof typeof categoryColors] || "#00ff87") : "#00ff87";

  return (
    <section id="projects" className="relative py-24 px-6 lg:px-12" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2
            ref={headingRef}
            id="projects-heading"
            className="text-3xl lg:text-4xl font-bold tracking-tight text-white group cursor-pointer"
          >
            Projects
            <ArrowRight className="inline-block w-6 h-6 ml-2 text-mint transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" />
          </h2>
          <span className="text-sm text-muted font-mono">{projectsData.length} Systems</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {projectsData.map((project) => {
            const color = categoryColors[project.category as keyof typeof categoryColors] || "#00ff87";
            const glow = cardGlow[project.id];
            const isHovered = hoveredProject === project.id;
            return (
              <article
                key={project.id}
                role="listitem"
                className="relative card-hover glass rounded-2xl p-6 overflow-hidden transition-all duration-500 ease-out group"
                style={{
                  borderColor: `${color}30`,
                  background: `linear-gradient(135deg, ${color}10, ${color}05)`,
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => handleCardMouseMove(project.id, e)}
              >
                {/* Radial glow border effect */}
                {glow && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 80% 80% at ${glow.x}px ${glow.y}px, ${color}20 0%, transparent 70%)`,
                      opacity: 0.6,
                    }}
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[${color}]/5 to-transparent" aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[${color}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-lg font-bold text-white/10">SYSTEM {project.number}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium text-white/80" style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `1px solid ${color}30` }}>
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">{project.title}</h3>

                  <div className="mb-4 flex flex-wrap gap-2" role="list" aria-label="Technologies">
                    {project.tech.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded text-xs font-medium text-white/70" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}20` }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <a
                      href={`https://www.loom.com/share/${project.loom}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-500 ease-out group"
                    >
                      <Play className="w-4 h-4" aria-hidden="true" />
                      Watch Demo
                    </a>
                    <a
                      href={`https://github.com/kristian-enaga/${project.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-500 ease-out group"
                    >
                      <Github className="w-4 h-4" aria-hidden="true" />
                      Code
                      <ExternalLink className="w-3.5 h-3.5 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Slide-out Drawer */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-2xl lg:max-w-3xl transform transition-transform duration-500 ease-out-cubic ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          } pointer-events-${drawerOpen ? "auto" : "none"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          aria-hidden={!drawerOpen}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="relative h-full flex flex-col glass border-l border-white/10 bg-background/95">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Project Details</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg glass border-white/10 hover:bg-white/5 transition-all duration-300"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5 text-muted" aria-hidden="true" />
              </button>
            </div>

            {project && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Business Problem */}
                  <section aria-labelledby="problem-heading">
                    <h4 id="problem-heading" className="text-sm font-semibold uppercase tracking-wider text-mint mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" aria-hidden="true" />
                      Business Problem
                    </h4>
                    <p className="text-white/90 leading-relaxed">{project.businessProblem}</p>
                  </section>

                  {/* What It Does */}
                  <section aria-labelledby="solution-heading">
                    <h4 id="solution-heading" className="text-sm font-semibold uppercase tracking-wider text-mint mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" aria-hidden="true" />
                      What It Does
                    </h4>
                    <p className="text-white/90 leading-relaxed">{project.whatItDoes}</p>
                  </section>

                  {/* Architecture Pipeline */}
                  <section aria-labelledby="arch-heading">
                    <h4 id="arch-heading" className="text-sm font-semibold uppercase tracking-wider text-mint mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4" aria-hidden="true" />
                      System Architecture Pipeline
                    </h4>
                    <div className="space-y-3">
                      {project.architecture.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass border-white/5">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono text-white/50" style={{ background: `linear-gradient(135deg, ${drawerColor}20, ${drawerColor}10)` }}>
                            {i + 1}
                          </div>
                          <span className="text-white/90 text-sm">{step}</span>
                          {i < project.architecture.length - 1 && (
                            <svg className="w-5 h-5 text-muted/50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Technical Implementation */}
                  <section aria-labelledby="tech-heading">
                    <h4 id="tech-heading" className="text-sm font-semibold uppercase tracking-wider text-mint mb-3 flex items-center gap-2">
                      <Terminal className="w-4 h-4" aria-hidden="true" />
                      Technical Implementation
                    </h4>
                    <ul className="space-y-2">
                      {project.technicalImpl.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: drawerColor }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Business Relevance */}
                  <section aria-labelledby="relevance-heading">
                    <h4 id="relevance-heading" className="text-sm font-semibold uppercase tracking-wider text-mint mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" aria-hidden="true" />
                      Business Relevance
                    </h4>
                    <p className="text-white/90 leading-relaxed">{project.businessRelevance}</p>
                  </section>
                </div>

                {/* Repository Sync Buttons */}
                <div className="p-6 border-t border-white/10">
                  <h5 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">Quick Repository Access</h5>
                  <div className="flex flex-wrap gap-2">
                    {projectsData.map((p) => (
                      <a
                        key={p.id}
                        href={`https://github.com/kristian-enaga/${p.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-500 ease-out whitespace-nowrap ${p.id === project.id ? 'bg-mint/20 text-mint border-mint/30' : 'text-white/70 glass border-white/10 hover:border-mint/30 hover:bg-white/5'}`}
                      >
                        <Github className="w-3.5 h-3.5 mr-1.5 inline" aria-hidden="true" />
                        {p.id}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!project && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted text-center px-6">Hover a project card to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}