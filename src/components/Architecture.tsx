"use client";

import { useEffect, useRef, useState } from "react";
import { Server, Database, Zap, Shield, GitBranch, Globe, Layers, Cloud, ArrowRight, CheckCircle } from "lucide-react";

const architectureLayers = [
  {
    id: "ingestion",
    title: "Ingestion Layer",
    icon: Globe,
    color: "#06b6d4",
    components: [
      { name: "Webhook Endpoints", desc: "HMAC verification, idempotency keys, rate limiting" },
      { name: "API Polling Schedulers", desc: "Exponential backoff, cursor pagination, deduplication" },
      { name: "Event Bridge / Queue", desc: "Redis Streams / BullMQ for durable delivery" },
      { name: "Schema Validation Gate", desc: "Zod runtime parsing with coercion & defaults" },
    ],
  },
  {
    id: "processing",
    title: "Processing Layer",
    icon: Layers,
    color: "#00ff87",
    components: [
      { name: "n8n Workflow Engine", desc: "Custom nodes, error boundaries, retry policies" },
      { name: "Data Normalization", desc: "Field mapping, type coercion, format standardization" },
      { name: "AI Enrichment Pipeline", desc: "Gemini/Groq structured outputs, confidence scoring" },
      { name: "Business Logic Layer", desc: "Conditional routing, computed fields, lookups" },
    ],
  },
  {
    id: "persistence",
    title: "Persistence Layer",
    icon: Database,
    color: "#8b5cf6",
    components: [
      { name: "Supabase / PostgreSQL", desc: "Row-level security, realtime subscriptions, RPC" },
      { name: "Audit Log Store", desc: "Immutable append-only, full payload capture" },
      { name: "Cache Layer (Redis)", desc: "Token buckets, session state, rate limit counters" },
      { name: "Blob Storage", desc: "Document artifacts, parsed exports, debug dumps" },
    ],
  },
  {
    id: "delivery",
    title: "Delivery Layer",
    icon: Zap,
    color: "#f59e0b",
    components: [
      { name: "CRM Sync Workers", desc: "Batch APIs, upsert with conflict resolution" },
      { name: "Webhook Callbacks", desc: "Signed payloads, retry with dead-letter queue" },
      { name: "Human-in-the-Loop", desc: "Telegram/Slack approvals, SLA timers" },
      { name: "Monitoring & Alerts", desc: "Heartbeat checks, SLO dashboards, on-call routing" },
    ],
  },
];

const principles = [
  { title: "Zero Silent Failures", desc: "Every execution path has observability, alerting, and automated recovery." },
  { title: "Idempotency by Default", desc: "All mutations use idempotency keys; safe to retry at any layer." },
  { title: "Schema-First Contracts", desc: "Zod schemas define the contract; validation happens at ingestion boundary." },
  { title: "Graceful Degradation", desc: "Partial failures isolate; circuit breakers prevent cascade." },
  { title: "Audit Everything", desc: "Immutable logs with full request/response payloads for forensics." },
  { title: "Human-in-the-Loop Ready", desc: "Approval gates, manual override, and escalation paths built-in." },
];

export default function Architecture() {
  const [visibleLayers, setVisibleLayers] = useState<Set<number>>(new Set());
  const [visiblePrinciples, setVisiblePrinciples] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = parseInt(target.dataset.index || "0");
            const type = target.dataset.type;
            if (type === "layer") {
              setVisibleLayers((prev) => new Set([...prev, index]));
            } else {
              setVisiblePrinciples((prev) => new Set([...prev, index]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('[data-type="layer"][data-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });
    document.querySelectorAll('[data-type="principle"][data-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section
      id="architecture"
      className="relative py-24 sm:py-32 lg:py-40 px-6 sm:px-8 lg:px-12"
      aria-labelledby="architecture-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-amber/20 text-sm font-medium text-amber-400 mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse-glow" aria-hidden="true" />
            SYSTEM ARCHITECTURE
          </span>
          <h2
            id="architecture-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6"
          >
            Fail-Safe Architecture
            <br />
            <span className="text-gradient-cyan">Four-Layer Design</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Every system follows a battle-tested pattern: ingest → process → persist → deliver.
            Each layer is independently observable, retryable, and replaceable.
          </p>
        </div>

        <div className="space-y-8 mb-20">
          {architectureLayers.map((layer, index) => {
            const Icon = layer.icon;
            const isVisible = visibleLayers.has(index);
            return (
              <article
                key={layer.id}
                data-type="layer"
                data-index={index}
                className={`relative card-hover glass rounded-2xl p-8 overflow-hidden transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                } border-l-4`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  borderColor: layer.color,
                  background: `linear-gradient(135deg, ${layer.color}08, ${layer.color}03)`,
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${layer.color}20, ${layer.color}10)`, border: `1px solid ${layer.color}30` }}>
                        <Icon className="w-7 h-7" style={{ color: layer.color }} aria-hidden="true" />
                      </div>
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wider text-muted mb-1 block">Layer {index + 1}</span>
                        <h3 className="text-2xl font-bold text-white">{layer.title}</h3>
                      </div>
                    </div>
                    <ArrowRight className="w-8 h-8 text-muted/50" aria-hidden="true" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {layer.components.map((comp, cIndex) => (
                      <div key={cIndex} className="p-4 rounded-xl glass border-white/5 hover:border-mint/20 transition-all duration-300">
                        <div className="font-semibold text-white mb-1">{comp.name}</div>
                        <div className="text-sm text-muted/70">{comp.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-10">Engineering Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {principles.map((principle, index) => {
              const isVisible = visiblePrinciples.has(index);
              return (
                <article
                  key={principle.title}
                  data-type="principle"
                  data-index={index}
                  className={`relative card-hover glass rounded-xl p-6 transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <CheckCircle className="w-5 h-5 mb-3" style={{ color: "#00ff87" }} aria-hidden="true" />
                  <h4 className="font-bold text-white mb-2">{principle.title}</h4>
                  <p className="text-sm text-muted/80">{principle.desc}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <a
            href="#proof-of-work"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border-mint/30 bg-mint/10 text-mint font-semibold text-base hover:bg-mint/20 transition-all duration-300 focus-ring"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#proof-of-work')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            See Systems in Action
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}