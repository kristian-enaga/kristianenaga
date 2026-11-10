"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Github, Play, ExternalLink, Zap, Brain, Database, Globe, Terminal, Layers, Cloud, Shield, ChevronRight, Linkedin, Mail, MessageSquare, MapPin, Clock, Send, CheckCircle, Menu, X } from "lucide-react";

const projectsData = [
  { id: "01", category: "RevOps", title: "Inbound Lead Sanitizer & Outreach Engine", repo: "Inbound-Lead-Sanitizer-Engine", tech: "n8n • Supabase • Gemini", loom: "c38d37d65eed44129a712e530a8e2446" },
  { id: "02", category: "RevOps", title: "Fault-Tolerant Lead Triage Pipeline", repo: "fault-tolerant-lead-triage-pipeline", tech: "n8n • Groq • HubSpot", loom: "5d9a49197b574216894cc00822f0069f" },
  { id: "03", category: "RevOps", title: "AI Lead Scoring & Priority Router", repo: "AI-Lead-Scoring-Router", tech: "n8n • OpenRouter • Sheets", loom: "38164c8a840f4076b3ac0ec62a26e3ce" },
  { id: "04", category: "RevOps", title: "Speed-to-Lead Ingestion Engine", repo: "Speed-to-lead-ingestion-engine", tech: "n8n • Webhooks • Slack", loom: "707c78cf35df44a4adf3ee1a04d75b57" },
  { id: "05", category: "GTM Intel", title: "B2B Outbound Prospecting Engine", repo: "Automated-B2B-Outbound-System", tech: "Apify • Gemini • Gmail", loom: "5d3416feda7148bbbd60704ab9b5976e" },
  { id: "06", category: "GTM Intel", title: "Market Intelligence & Lead Waterfall", repo: "autonomous-market-intelligence-engine", tech: "SerpAPI • Zod • Telegram", loom: "7792580657284a58a7e1dabf99365087" },
  { id: "07", category: "GTM Intel", title: "Native Clay Lead Waterfall", repo: "native-clay-multi-year-waterfall-engine", tech: "Clay Native • Multi-Provider APIs", loom: "149144121b134f38b4d0752c959ef02" },
  { id: "08", category: "Automation", title: "AP Invoice Reconciliation Engine", repo: "enterprise-ap-invoice-reconciliation-engine", tech: "Gemini • OpenAI • QuickBooks", loom: "595e7e48d6ab4a1f89263d23496f9d67" },
  { id: "09", category: "Automation", title: "E-Commerce Revenue Recovery Engine", repo: "autonomous-revenue-recovery-engine", tech: "Make • Stateful Delays • Supabase", loom: "311bfc94eee1429080f6fe5ed3cf62c0" },
  { id: "10", category: "Automation", title: "Centralized n8n Error Handler", repo: "n8n-Centralized-Error-Handler", tech: "n8n Errors • Slack Hooks", loom: "ea1602f3bd8a4086983c96590e49136f" },
];

const categoryColors = {
  "RevOps": "#ef4444",
  "GTM Intel": "#06b6d4",
  "Automation": "#f59e0b",
};

const categoryLabels = {
  "RevOps": "Revenue Operations & CRM Automation",
  "GTM Intel": "GTM Intelligence & Prospecting",
  "Automation": "Business Process Automation & Reliability",
};

export default function ProjectSection() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
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

  const getProjectImpact = (id: string) => {
    const impacts: Record<string, string> = {
      "01": "Eliminates manual phone cleanup, filters bot submissions, qualifies intent via AI, syncs clean leads to HubSpot instantly — sales team receives only actionable records.",
      "02": "Sanitizes inconsistent payloads, falls back to Groq when Gemini fails, logs every exception to Supabase, alerts on priority leads — zero silent CRM failures.",
      "03": "Scores budget/size/urgency via AI, routes VIP to Slack instantly, standard to Gmail, backs up raw lead in Supabase — reps focus only on high-intent.",
      "04": "Ingests webhook in <100ms, normalizes fields, logs to Sheets, pings Slack — first response time drops from minutes to seconds.",
      "05": "Discovers prospects via Apify, drafts personalized emails via Gemini, requires Slack approval before send — outbound scales without spam risk.",
      "06": "Searches SerpAPI, verifies URLs, extracts content via JS/RegEx, validates via Zod, routes to Telegram for approval — research becomes pipeline.",
      "07": "Cascades through Clay providers, enriches contacts progressively, tiers by ICP fit, synthesizes GTM messaging — contact completeness >90%.",
      "08": "Parses PDF/CSV/Excel, extracts line items via AI, verifies math to ±$0.01, queues exceptions for Slack approval, syncs to QuickBooks — AP cycle cuts 80%.",
      "09": "Tracks cart abandonment, waits statefully, checks purchase status via Supabase before email, generates recovery copy via Gemini — revenue recovered, no duplicate nudges.",
      "10": "Centralizes all n8n failures, logs full payload to Sheets, alerts via Slack/Gmail, provides one-click debug links — MTTR drops from hours to minutes.",
    };
    return impacts[id] || "Operational impact summary for this automation system.";
  };

  const getProjectArchitecture = (id: string) => {
    const arches: Record<string, string[]> = {
      "01": ["Webhook Intake", "E.164 Normalization", "Bot Filter", "Supabase Exceptions", "Gemini Scoring", "HubSpot Sync", "Slack/WhatsApp"],
      "02": ["Webhook Intake", "Payload Sanitization", "Gemini/Groq Fallback", "HubSpot CRM", "Supabase Exceptions", "Slack Priority"],
      "03": ["Webhook Intake", "Supabase Backup", "Gemini + OpenRouter", "Zod Validation", "Multi-Tier Router", "Slack VIP / Gmail", "Sheets Sync"],
      "04": ["Webhook Ingestion", "Payload Normalization", "Google Sheets", "Slack Notification"],
      "05": ["Apify Scraping", "Gemini Drafting", "Slack HITL Approval", "Dispatch", "Logging"],
      "06": ["SerpAPI Search", "URL Verification", "JS/RegEx Processing", "Gemini + Groq", "Zod Validation", "Telegram Approval"],
      "07": ["Clay Waterfall", "Multi-Provider Lookup", "AI ICP Tiering", "GTM Message Synthesis"],
      "08": ["Gmail/Webhook", "Multi-Format Parser", "Gemini/OpenAI", "Math Verification", "Supabase Exceptions", "Slack Approval", "QuickBooks"],
      "09": ["Make Scenario", "Webhook", "Stateful Delays", "Supabase Check", "Gemini Email", "Gmail Dispatch"],
      "10": ["Centralized Handler", "Sheets Audit Logs", "Gmail/Slack Alerts", "Debug Links"],
    };
    return arches[id] || ["Step 1", "Step 2", "Step 3"];
  };

  return (
    <section id="projects" className="relative py-16 px-6 lg:px-12" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {projectsData.map((project) => {
            const color = categoryColors[project.category as keyof typeof categoryColors] || "#00ff87";
            const isHovered = hoveredProject === project.id;
            return (
              <article
                key={project.id}
                role="listitem"
                className="relative card-hover glass rounded-2xl p-6 overflow-hidden transition-all duration-500 ease-out"
                style={{
                  borderColor: `${color}30`,
                  background: `linear-gradient(135deg, ${color}10, ${color}05)`,
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[${color}]/5 to-transparent" aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[${color}] to-transparent opacity-0 transition-opacity duration-500" aria-hidden="true" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-lg font-bold text-white/10">SYSTEM {project.id}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium text-white/80" style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)`, border: `1px solid ${color}30` }}>
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">{project.title}</h3>

                  <div className="mb-4 flex flex-wrap gap-2" role="list" aria-label="Technologies">
                    {project.tech.split(" • ").map((t, i) => (
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
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-500 ease-out"
                    >
                      <Play className="w-4 h-4" aria-hidden="true" />
                      Watch Demo
                    </a>
                    <a
                      href={`https://github.com/kristian-enaga/${project.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-500 ease-out"
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
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-md lg:max-w-xl transform transition-transform duration-500 ease-out-cubic ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          } pointer-events-${drawerOpen ? "auto" : "none"}`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
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

            {hoveredProject && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Operational Impact Summary */}
                  <section aria-labelledby="impact-heading">
                    <h4 id="impact-heading" className="text-sm font-semibold uppercase tracking-wider text-mint mb-3">Operational Impact</h4>
                    <p className="text-white/90 leading-relaxed">{getProjectImpact(hoveredProject)}</p>
                  </section>

                  {/* System Architecture Pipeline Map */}
                  <section aria-labelledby="arch-heading">
                    <h4 id="arch-heading" className="text-sm font-semibold uppercase tracking-wider text-mint mb-3">System Architecture Pipeline</h4>
                    <div className="space-y-3">
                      {getProjectArchitecture(hoveredProject).map((step, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl glass border-white/5">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono text-white/50" style={{ background: `linear-gradient(135deg, ${categoryColors[projectsData.find(p => p.id === hoveredProject)?.category as keyof typeof categoryColors] || "#00ff87"}20, ${categoryColors[projectsData.find(p => p.id === hoveredProject)?.category as keyof typeof categoryColors] || "#00ff87"}10)` }}>
                            {i + 1}
                          </div>
                          <span className="text-white/90 text-sm">{step}</span>
                          {i < getProjectArchitecture(hoveredProject).length - 1 && (
                            <svg className="w-5 h-5 text-muted/50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Repository Sync Buttons */}
                <div className="p-6 border-t border-white/10">
                  <div className="flex flex-wrap gap-3">
                    {projectsData.map((p) => (
                      <a
                        key={p.id}
                        href={`https://github.com/kristian-enaga/${p.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-lg text-xs font-medium text-white/70 glass border-white/10 hover:border-mint/30 hover:bg-white/5 transition-all duration-500 ease-out whitespace-nowrap"
                      >
                        <Github className="w-3.5 h-3.5 mr-1.5 inline" aria-hidden="true" />
                        {p.id}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!hoveredProject && (
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