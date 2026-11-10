"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Server, Database, Zap, Shield, GitBranch, Globe, Layers, Cloud, Terminal, Brain, Code, GraduationCap, Award, Layers as LayersIcon } from "lucide-react";

const techMatrix = [
  {
    category: "Workflow & Automation",
    icon: LayersIcon,
    color: "#00ff87",
    items: [
      { name: "n8n", projects: "1, 3–8, 10", desc: "Complex multi-node workflows, custom nodes, error boundaries, retry policies" },
      { name: "Make (Integromat)", projects: "9", desc: "Scenario design, data transformation, stateful delays, error handling" },
      { name: "Clay", projects: "7", desc: "Native waterfall enrichment, multi-provider lookups, ICP tiering" },
      { name: "Custom MCP Servers", projects: "—", desc: "Model Context Protocol implementations for AI tool use" },
    ],
  },
  {
    category: "GTM Data & CRMs",
    icon: Database,
    color: "#06b6d4",
    items: [
      { name: "HubSpot CRM", projects: "1, 2", desc: "Custom objects, associations, batch APIs, private apps, conflict resolution" },
      { name: "QuickBooks Online", projects: "8", desc: "Invoice sync, bill creation, attachment linking, ERP reconciliation" },
      { name: "Google Sheets", projects: "3, 4, 9", desc: "CRM sync, audit logging, data staging" },
      { name: "Apollo / LinkedIn", projects: "—", desc: "People search, company enrichment, intent signals" },
    ],
  },
  {
    category: "Data & AI Infrastructure",
    icon: Brain,
    color: "#8b5cf6",
    items: [
      { name: "Supabase / PostgreSQL", projects: "1, 2, 3, 6, 8, 9", desc: "Row-level security, realtime, edge functions, RPC, audit logs" },
      { name: "Python (FastAPI, Pandas)", projects: "8", desc: "Document parsing (pdfplumber), data pipelines, ETL, math verification" },
      { name: "Google Gemini", projects: "1–3, 5, 6, 8, 9", desc: "Structured outputs, function calling, intent scoring, email drafting" },
      { name: "Groq", projects: "2, 6", desc: "Ultra-fast inference fallback, structured outputs" },
      { name: "OpenAI", projects: "8", desc: "Document extraction fallback, vision capabilities" },
      { name: "OpenRouter", projects: "3", desc: "Multi-model routing, cost/latency optimization, fallback chains" },
    ],
  },
  {
    category: "Engineering & Reliability",
    icon: Shield,
    color: "#f59e0b",
    items: [
      { name: "GitHub / Codespaces", projects: "All", desc: "CI/CD, Actions, dependency management, security scanning" },
      { name: "REST APIs & Webhooks", projects: "1–6, 8, 9", desc: "OpenAPI design, HMAC verification, idempotency keys, rate limiting" },
      { name: "Zod / Structured Validation", projects: "3, 6", desc: "Runtime schema parsing, coercion, defaults, type safety" },
      { name: "JavaScript / RegEx", projects: "2, 6", desc: "Dynamic content extraction, payload sanitization" },
      { name: "Slack / Gmail / Telegram", projects: "1–5, 8–10", desc: "Alert routing, human approval, notifications, dispatch" },
      { name: "Observability Stack", projects: "10", desc: "Centralized error handling, audit trails, debug links, SLO dashboards" },
    ],
  },
];

const patterns = [
  { name: "Input Validation", desc: "Catch malformed or incomplete data before downstream processing", icon: Shield },
  { name: "Data Normalization", desc: "Standardize records (E.164, casing, formats) before using in other systems", icon: Database },
  { name: "Error Handling", desc: "Capture and report workflow failures with full context", icon: Zap },
  { name: "Fallback Logic", desc: "Provide alternative processing paths when a service fails (AI model fallback)", icon: Cloud },
  { name: "Exception Logging", desc: "Preserve full request/response payloads for forensic investigation", icon: Database },
  { name: "Human-in-the-Loop", desc: "Require review before sensitive actions (outbound send, financial approval)", icon: Brain },
  { name: "Idempotency", desc: "Prevent duplicate processing via idempotency keys at ingestion boundary", icon: Shield },
  { name: "Dead-Letter Queues", desc: "Isolate failed records for investigation or automated recovery", icon: Database },
];

export default function TechnicalStack() {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const id = target.dataset.id;
            if (id) setVisibleItems((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('[data-id]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section
      id="stack"
      className="relative py-24 sm:py-32 lg:py-40 px-6 lg:px-12"
      aria-labelledby="stack-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-violet/20 text-sm font-medium text-violet-400 mb-6">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" aria-hidden="true" />
            TECHNICAL STACK & PROJECT EVIDENCE
          </span>
          <h2 id="stack-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Technologies
            <br />
            <span className="text-gradient-mint">Mapped to Projects</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Every technology in this stack is implemented in the portfolio projects above. The matrix shows exactly where each tool appears.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {techMatrix.map((matrix, mIndex) => {
            const Icon = matrix.icon;
            const matrixId = `matrix-${mIndex}`;
            const isVisible = visibleItems.has(matrixId);
            return (
              <article
                key={matrix.category}
                data-id={matrixId}
                className={`relative card-hover glass rounded-2xl p-7 lg:p-8 overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} border-l-4`}
                style={{ 
                  transitionDelay: `${mIndex * 80}ms`,
                  borderColor: matrix.color,
                  background: `linear-gradient(135deg, ${matrix.color}08, ${matrix.color}03)`,
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${matrix.color}20, ${matrix.color}10)`, border: `1px solid ${matrix.color}30` }}>
                      <Icon className="w-6 h-6" style={{ color: matrix.color }} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{matrix.category}</h3>
                      <p className="text-sm text-muted">Technologies & implementation scope</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {matrix.items.map((item, iIndex) => (
                      <div key={item.name} className="group flex items-start gap-4 p-4 rounded-xl glass border-white/5 hover:border-mint/20 transition-all duration-300">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${matrix.color}15, ${matrix.color}05)`, border: `1px solid ${matrix.color}20` }}>
                          <CheckCircle className="w-5 h-5" style={{ color: matrix.color }} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <h4 className="font-semibold text-white">{item.name}</h4>
                            <span className="text-xs text-muted font-mono whitespace-nowrap">Projects: {item.projects}</span>
                          </div>
                          <p className="text-sm text-muted/70 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-10">Engineering Patterns</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {patterns.map((pattern, pIndex) => {
              const Icon = pattern.icon;
              const patternId = `pattern-${pIndex}`;
              const isVisible = visibleItems.has(patternId);
              return (
                <article
                  key={pattern.name}
                  data-id={patternId}
                  className={`relative card-hover glass rounded-xl p-6 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${pIndex * 60}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, rgba(0, 255, 135, 0.15), rgba(6, 182, 212, 0.15))`, border: "1px solid rgba(0, 255, 135, 0.2)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#00ff87" }} aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-white mb-2">{pattern.name}</h4>
                  <p className="text-sm text-muted/80">{pattern.desc}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-8 lg:p-10 border-mint/20">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Engineering Philosophy</h3>
          <blockquote className="text-xl lg:text-2xl text-white/90 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            "An automation workflow should be designed for the conditions in which it can fail, not only the conditions in which it succeeds."
          </blockquote>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            {[
              { title: "Process First", desc: "Understand the business bottleneck before choosing a tool. Tool selection follows process analysis." },
              { title: "Data Integrity", desc: "Validate and normalize at the ingestion boundary. Never trust external payloads." },
              { title: "Design for Failure", desc: "External APIs, services, and workflows will fail. Build observability and recovery in from day one." },
              { title: "Human Judgment", desc: "Important decisions (outbound, financial) require approval gates. Automation augments, doesn't replace." },
              { title: "Observable by Default", desc: "Errors are visible, traceable, and actionable. Centralized logging with debug links." },
              { title: "Evidence Over Claims", desc: "Implementation artifacts, test scenarios, and recorded demos matter more than impressive terminology." },
            ].map((principle, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl glass border-white/5">
                <CheckCircle className="w-5 h-5 text-mint flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-white">{principle.title}</div>
                  <div className="text-muted/70 mt-0.5">{principle.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}