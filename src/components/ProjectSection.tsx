"use client";

import { useState, useRef, useEffect } from "react";
import { Github, ExternalLink, Play, ChevronRight, ArrowRight, X, Zap, Brain, Database, Globe, Terminal, Layers, Cloud, Shield, CheckCircle, LayoutList, FileText } from "lucide-react";

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
    categoryLabel: "Revenue Operations",
    title: "Inbound Lead Sanitizer & Outreach Engine",
    repo: "Inbound-Lead-Sanitizer-Engine",
    tech: ["n8n", "Supabase", "Gemini", "HubSpot", "Twilio"],
    loom: "c38d37d65eed44129a712e530a8e2446",
    businessProblem: "Sales teams spend hours manually cleaning bad lead data before they can follow up. Invalid phone numbers, duplicate submissions, and incomplete records slow down every sale.",
    whatItDoes: "Captures every inbound submission, normalizes phone numbers, filters out bots, scores lead quality with AI, and pushes only clean, qualified records into HubSpot automatically.",
    architecture: ["Webhook Intake", "Phone Normalization", "Bot Filtering", "AI Lead Scoring", "HubSpot Sync", "Slack Alerts"],
    technicalImpl: [
      "Webhook lead ingestion with HMAC verification",
      "E.164 phone number normalization",
      "Behavioral bot filtering",
      "AI lead intent scoring via Gemini",
      "HubSpot CRM sync with idempotency keys",
      "Slack notifications for sales team"
    ],
    businessRelevance: "Sales reps get clean leads ready to call. Manual data cleanup drops from hours to seconds per lead."
  },
  {
    id: "02",
    number: "02",
    category: "RevOps",
    categoryLabel: "Revenue Operations",
    title: "Fault-Tolerant Lead Triage Pipeline",
    repo: "fault-tolerant-lead-triage-pipeline",
    tech: ["n8n", "Groq", "HubSpot", "Supabase", "Slack"],
    loom: "5d9a49197b574216894cc00822f0069f",
    businessProblem: "Lead workflows break when data is missing or formatted wrong. Failed updates go unnoticed and leads fall through the cracks.",
    whatItDoes: "Sanitizes incoming lead data, scores it with AI (with automatic fallback if one model fails), updates HubSpot, and logs every exception so nothing is lost.",
    architecture: ["Webhook Intake", "Data Sanitization", "AI Scoring (Primary + Fallback)", "HubSpot Update", "Exception Logging", "Slack Alerts"],
    technicalImpl: [
      "Webhook payload processing with schema validation",
      "Input sanitization and RegEx cleansing",
      "Gemini primary + Groq fallback scoring",
      "HubSpot CRM update with conflict resolution",
      "Supabase exception logging with full context",
      "Priority-based Slack routing"
    ],
    businessRelevance: "No lead is ever lost due to a broken workflow. Every failure is logged and recoverable."
  },
  {
    id: "03",
    number: "03",
    category: "RevOps",
    categoryLabel: "Revenue Operations",
    title: "AI Lead Scoring & Priority Router",
    repo: "AI-Lead-Scoring-Router",
    tech: ["n8n", "OpenRouter", "Google Sheets", "Slack", "Gmail", "Supabase"],
    loom: "38164c8a840f4076b3ac0ec62a26e3ce",
    businessProblem: "Sales reps waste time on low-priority leads while high-intent inquiries sit untouched. There's no consistent way to triage incoming leads.",
    whatItDoes: "Evaluates budget, company size, urgency, and intent signals to assign priority levels. VIP leads go to Slack instantly. Standard leads get automated Gmail responses.",
    architecture: ["Webhook Intake", "Lead Backup", "AI Scoring (Primary + Fallback)", "Schema Validation", "Priority Router", "Slack / Gmail Routing", "Sheets Sync"],
    technicalImpl: [
      "Multi-signal AI scoring: budget, company size, urgency, intent",
      "OpenRouter multi-model routing",
      "Zod schema validation with defaults",
      "Raw lead persistence in Supabase",
      "Multi-tier priority routing",
      "Google Sheets CRM sync"
    ],
    businessRelevance: "Reps focus only on high-intent leads. VIP alerts hit Slack in under 30 seconds. Zero manual triage needed."
  },
  {
    id: "04",
    number: "04",
    category: "RevOps",
    categoryLabel: "Revenue Operations",
    title: "Speed-to-Lead Ingestion Engine",
    repo: "Speed-to-lead-ingestion-engine",
    tech: ["n8n", "Webhooks", "Google Sheets", "Slack"],
    loom: "707c78cf35df44a4adf3ee1a04d75b57",
    businessProblem: "New leads sit in inboxes until someone manually forwards them to sales. By the time a rep calls, the lead has already gone cold.",
    whatItDoes: "Receives webhook submissions, standardizes the data, records them in Google Sheets, and sends instant Slack notifications with full lead context.",
    architecture: ["Webhook Ingestion", "Payload Normalization", "Google Sheets Recording", "Slack Notification"],
    technicalImpl: [
      "Sub-100ms webhook ingestion",
      "Automatic field normalization and validation",
      "Google Sheets audit trail",
      "Instant Slack notifications with lead context",
      "Retry logic with exponential backoff"
    ],
    businessRelevance: "First response drops from minutes to seconds. Every lead reaches the CRM instantly."
  },
  {
    id: "05",
    number: "05",
    category: "GTM Intel",
    categoryLabel: "GTM Intelligence",
    title: "B2B Outbound Prospecting Engine",
    repo: "Automated-B2B-Outbound-System",
    tech: ["Apify", "Gemini", "Gmail", "Slack", "n8n"],
    loom: "5d3416feda7148bbbd60704ab9b5976e",
    businessProblem: "Manual prospect research takes 15 minutes per company. Sales reps spend more time researching than selling.",
    whatItDoes: "Discovers companies, scrapes intelligence, writes personalized outreach emails with AI, and routes them for human approval before sending.",
    architecture: ["Company Discovery", "AI Email Drafting", "Human Approval (Slack)", "Email Dispatch", "Workflow Logging"],
    technicalImpl: [
      "Automated company discovery via Apify",
      "AI-generated personalized emails with Gemini",
      "Human-in-the-loop approval via Slack",
      "Rate-limited email dispatch with tracking",
      "Full outbound logging for compliance"
    ],
    businessRelevance: "Research time drops from 15 minutes to under 30 seconds per prospect. Outbound scales without spam risk."
  },
  {
    id: "06",
    number: "06",
    category: "GTM Intel",
    categoryLabel: "GTM Intelligence",
    title: "Market Intelligence & Lead Waterfall",
    repo: "autonomous-market-intelligence-engine",
    tech: ["SerpAPI", "Zod", "Telegram", "Gemini", "Groq", "n8n"],
    loom: "7792580657284a58a7e1dabf99365087",
    businessProblem: "Finding and verifying companies takes disconnected manual steps. Unverified URLs and messy data make prospect lists useless.",
    whatItDoes: "Searches for companies, verifies URLs, extracts and processes content, analyzes with AI, validates results, and routes qualified leads for approval.",
    architecture: ["Company Search", "URL Verification", "Content Extraction", "AI Analysis (Primary + Fallback)", "Structured Validation", "Approval Routing"],
    technicalImpl: [
      "SerpAPI multi-engine company discovery",
      "URL verification and accessibility checks",
      "JavaScript/RegEx content extraction",
      "Gemini + Groq dual-model AI analysis",
      "Zod structured output validation",
      "Telegram human approval"
    ],
    businessRelevance: "Manual research hours eliminated. Verified, enriched prospect data flows directly to sales."
  },
  {
    id: "07",
    number: "07",
    category: "GTM Intel",
    categoryLabel: "GTM Intelligence",
    title: "Native Clay Multi-Provider Lead Waterfall",
    repo: "native-clay-multi-year-waterfall-engine",
    tech: ["Clay", "Multi-Provider APIs", "AI Enrichment", "ICP Modeling"],
    loom: "149144121b134f38b4d0752c959ef02",
    businessProblem: "Contact records are incomplete. Relying on one data provider leaves gaps. Sales teams can't act on partial prospect data.",
    whatItDoes: "Uses cascading multi-provider lookups to enrich lead data, tiers prospects by ICP fit, and writes AI-personalized outreach per tier.",
    architecture: ["Clay Waterfall", "Multi-Provider Lookup", "AI ICP Tiering", "Outreach Synthesis"],
    technicalImpl: [
      "Native Clay enrichment with cascading providers",
      "Multi-provider contact lookups (email, phone, social)",
      "ICP classification and tier-based prioritization",
      "AI-assisted outreach per tier",
      "Tier-based lead evaluation for routing"
    ],
    businessRelevance: "Contact completeness over 90%. Sales gets enriched, tiered prospects ready for outreach."
  },
  {
    id: "08",
    number: "08",
    category: "Automation",
    categoryLabel: "Process Automation",
    title: "AP Invoice Reconciliation Engine",
    repo: "enterprise-ap-invoice-reconciliation-engine",
    tech: ["Gemini", "OpenAI", "QuickBooks", "Supabase", "Slack", "Python", "n8n"],
    loom: "595e7e48d6ab4a1f89263d23496f9d67",
    businessProblem: "Invoice processing means hours of manual data entry, line-item math, and exception review. Errors slip through and delay payments.",
    whatItDoes: "Ingests invoices, extracts data with AI, verifies math to the cent, logs exceptions, routes for approval, and syncs bills to QuickBooks.",
    architecture: ["Ingestion", "Multi-Format Parsing", "AI Extraction", "Math Verification", "Exception Logging", "Approval Routing", "QuickBooks Sync"],
    technicalImpl: [
      "Gmail attachments + webhook ingestion",
      "PDF, CSV, Excel parsing with Python",
      "AI extraction: Gemini primary + OpenAI fallback",
      "Line-item math verification (±$0.01 tolerance)",
      "Supabase exception logging",
      "Slack human approval before ERP actions",
      "QuickBooks bill creation"
    ],
    businessRelevance: "AP cycle cuts by 80%. Math errors eliminated. Every discrepancy is flagged before hitting the ERP."
  },
  {
    id: "09",
    number: "09",
    category: "Automation",
    categoryLabel: "Process Automation",
    title: "E-Commerce Revenue Recovery Engine",
    repo: "autonomous-revenue-recovery-engine",
    tech: ["Make", "Stateful Delays", "Supabase", "Gemini", "Gmail"],
    loom: "311bfc94eee1429080f6fe5ed3cf62c0",
    businessProblem: "Abandoned carts need follow-up, but reminding customers who already bought creates a bad experience. Manual tracking doesn't scale.",
    whatItDoes: "Tracks cart abandonment, applies smart delays, verifies purchase status before each follow-up, writes AI emails, and sends via Gmail only when needed.",
    architecture: ["Automation Scenario", "Webhook Ingestion", "Delay Gates", "Purchase Verification", "AI Email Writing", "Gmail Dispatch"],
    technicalImpl: [
      "Make automation with stateful delay gates",
      "Webhook event ingestion from e-commerce platform",
      "Supabase purchase-status verification",
      "Conditional follow-up (only if not purchased)",
      "AI-generated cart recovery emails",
      "Gmail dispatch with tracking"
    ],
    businessRelevance: "Recovered revenue automatically. Zero duplicate nudges to customers who already bought."
  },
  {
    id: "10",
    number: "10",
    category: "Automation",
    categoryLabel: "Process Automation",
    title: "Centralized n8n Error Handler",
    repo: "n8n-Centralized-Error-Handler",
    tech: ["n8n", "Slack", "Gmail", "Google Sheets", "Supabase"],
    loom: "ea1602f3bd8a4086983c96590e49136f",
    businessProblem: "When automations fail, error info is scattered across dozens of workflows. Teams don't know something broke until customers complain.",
    whatItDoes: "Captures every n8n failure in one place, records full diagnostics, sends instant Slack and Gmail alerts, and provides one-click debug links.",
    architecture: ["Centralized Capture", "Diagnostic Logging", "Multi-Channel Alerts", "Debug Links"],
    technicalImpl: [
      "n8n centralized error capture",
      "Google Sheets audit logs with full context",
      "Slack instant + Gmail persistent alerts",
      "One-click debug links to failed executions",
      "Severity-based routing and escalation"
    ],
    businessRelevance: "Fix time drops from hours to minutes. Every failure is visible, traceable, and actionable."
  },
];

const categoryColors = {
  "RevOps": { main: "#6366f1", second: "#a855f7" },
  "GTM Intel": { main: "#22c55e", second: "#86efac" },
  "Automation": { main: "#f59e0b", second: "#fbbf24" },
};

export default function ProjectSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const openProject = (project: Project) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSelectedProject(project);
  };

  const closeProject = () => {
    closeTimerRef.current = setTimeout(() => {
      setSelectedProject(null);
    }, 100);
  };

  const colorObj = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || categoryColors.RevOps;
  };

  return (
    <section id="projects" className="relative py-24 px-6 lg:px-12" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2
            id="projects-heading"
            className="text-3xl lg:text-4xl font-bold tracking-tight text-white"
          >
            Working Systems
          </h2>
          <p className="text-muted text-sm mt-2">
            Ten production automations solving daily business operations. Tap any card to see full details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" role="list">
          {projectsData.map((project) => {
            const color = colorObj(project.category).main;
            const second = colorObj(project.category).second;
            return (
              <article
                key={project.id}
                role="listitem"
                onClick={() => openProject(project)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  openProject(project);
                }}
                className="relative card-hover glass rounded-2xl p-5 lg:p-6 overflow-hidden transition-all duration-500 ease-out cursor-pointer"
                style={{
                  borderColor: `${color}50`,
                  background: `linear-gradient(145deg, ${color}20, ${color}10, ${second}08)`,
                  boxShadow: `0 0 20px ${color}15, inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(135deg, ${color}30 0%, ${second}20 50%, ${color}30 100%)` }}
                  aria-hidden="true"
                />

                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${color}, ${second}, transparent)` }} aria-hidden="true" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-bold text-white/30 tracking-wider uppercase">System {project.number}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white/90 backdrop-blur-sm" style={{ background: `linear-gradient(135deg, ${color}35, ${color}15)`, border: `1px solid ${color}50` }}>
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2 leading-tight">{project.title}</h3>

                  <div className="mb-3 flex flex-wrap gap-1.5" role="list" aria-label="Technologies">
                    {project.tech.slice(0, 4).map((t, i) => (
                      <span key={i} className="px-2 py-1 rounded text-[10px] font-medium text-white/85 backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{ background: `linear-gradient(135deg, ${color}25, ${color}10)`, border: `1px solid ${color}35` }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-white/8">
                    <a
                      href={`https://www.loom.com/share/${project.loom}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 glass backdrop-blur-sm transition-all duration-500 ease-out group hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `1px solid ${color}35` }}
                    >
                      <Play className="w-3.5 h-3.5 transition-transform group-hover:scale-110" aria-hidden="true" />
                      <span>Demo</span>
                    </a>
                    <a
                      href={`https://github.com/kristian-enaga/${project.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 glass backdrop-blur-sm transition-all duration-500 ease-out group hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `1px solid ${color}35` }}
                    >
                      <Github className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" aria-hidden="true" />
                      <span>Code</span>
                    </a>
                  </div>

                  {/* Tap hint for mobile */}
                  {!isMobile && (
                    <p className="text-[10px] text-muted/60 mt-3 text-center font-mono">Tap to view details</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Right Sidebar - opens on click/tap */}
        {selectedProject && (
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] lg:max-w-[480px] transform transition-transform duration-500 ease-out translate-x-0 pointer-events-auto bg-background/98 border-l border-white/10 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidebar-title"
            onTouchStart={closeProject}
          >
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
              onClick={closeProject}
              aria-hidden="true"
            />

            {/* Sidebar Content */}
            <div className="relative h-full flex flex-col glass overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  <div 
                    className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 transition-all duration-700"
                    style={{ 
                      background: colorObj(selectedProject.category).main,
                      transform: 'translate(20px, -20px)',
                    }}
                  />
                </div>
                <div className="relative z-10">
                  <h3 id="sidebar-title" className="text-xl font-bold text-white">System {selectedProject.number}</h3>
                  <p className="text-xs font-medium text-white/70 mt-0.5 uppercase tracking-wider">{selectedProject.category}</p>
                </div>
                <button
                  onClick={closeProject}
                  className="p-2 rounded-xl glass border-white/10 hover:bg-white/10 hover:border-mint/30 transition-all duration-300 relative z-10"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5 text-muted hover:text-mint transition-colors" aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6">
                
                {/* Title */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedProject.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Technologies">
                    {selectedProject.tech.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded text-xs font-medium text-white/90 backdrop-blur-sm" style={{ background: `linear-gradient(135deg, ${colorObj(selectedProject.category).main}25, ${colorObj(selectedProject.category).main}10)`, border: `1px solid ${colorObj(selectedProject.category).main}35` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What It Solves */}
                <section className="animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-indigo-400">What It Solves</h4>
                  </div>
                  <p className="text-white/90 leading-relaxed text-lg">{selectedProject.businessProblem}</p>
                </section>

                {/* How It Works */}
                <section className="animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-mint" aria-hidden="true" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-mint">How It Works</h4>
                  </div>
                  <p className="text-white/90 leading-relaxed text-lg">{selectedProject.whatItDoes}</p>
                </section>

                {/* Architecture */}
                <section className="animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-purple-400" aria-hidden="true" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-400">Architecture Pipeline</h4>
                  </div>
                  <div className="space-y-2">
                    {selectedProject.architecture.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass backdrop-blur-sm" style={{ background: `linear-gradient(135deg, ${colorObj(selectedProject.category).main}12, ${colorObj(selectedProject.category).main}05)`, border: `1px solid ${colorObj(selectedProject.category).main}25` }}>
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono text-white/80" style={{ background: `linear-gradient(135deg, ${colorObj(selectedProject.category).main}30, ${colorObj(selectedProject.category).main}15)` }}>
                          {i + 1}
                        </div>
                        <span className="text-white/90 text-sm">{step}</span>
                        {i < selectedProject.architecture.length - 1 && (
                          <svg className="w-4 h-4 text-muted/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Business Impact */}
                <section className="animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400">Business Impact</h4>
                  </div>
                  <p className="text-white/90 leading-relaxed text-lg">{selectedProject.businessRelevance}</p>
                </section>

                {/* Tech Stack Details */}
                <section className="animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-center gap-2 mb-3">
                    <LayoutList className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Technical Implementation</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedProject.technicalImpl.map((item, i) => (
                      <li key={i} className="relative flex items-start gap-3 p-2 rounded-lg glass backdrop-blur-sm transition-all duration-300 hover:bg-white/5" style={{ border: `1px solid ${colorObj(selectedProject.category).main}15` }}>
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: `linear-gradient(135deg, ${colorObj(selectedProject.category).main}25, ${colorObj(selectedProject.category).main}10)` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: colorObj(selectedProject.category).main }} />
                        </div>
                        <span className="text-white/85 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Actions */}
                <div className="pt-4 border-t border-white/10">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Quick Access</h5>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://www.loom.com/share/${selectedProject.loom}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white glass backdrop-blur-sm transition-all duration-500 ease-out group hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${colorObj(selectedProject.category).main}25, ${colorObj(selectedProject.category).main}15)`, border: `1px solid ${colorObj(selectedProject.category).main}40` }}
                    >
                      <Play className="w-4 h-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                      <span>Watch Demo</span>
                    </a>
                    <a
                      href={`https://github.com/kristian-enaga/${selectedProject.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white glass backdrop-blur-sm transition-all duration-500 ease-out group hover:scale-[1.02]"
                      style={{ background: `linear-gradient(135deg, ${colorObj(selectedProject.category).main}25, ${colorObj(selectedProject.category).main}15)`, border: `1px solid ${colorObj(selectedProject.category).main}40` }}
                    >
                      <Github className="w-4 h-4 transition-transform group-hover:rotate-12" aria-hidden="true" />
                      <span>View Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}