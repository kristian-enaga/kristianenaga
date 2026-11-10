"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Database, Zap, Target, Shield, Activity } from "lucide-react";

const painPoints = [
  {
    id: "revenue-leaks",
    icon: Zap,
    title: "Revenue Leaks",
    subtitle: "Speed-to-Lead Failures",
    description: "Slow lead routing and manual processing delays cause qualified prospects to go cold before sales engagement. Every minute of delay compounds exponentially — 5-minute response drops conversion by 80%.",
    metrics: [
      { label: "Avg. Response Time", value: "> 30 min" },
      { label: "Lead Decay Rate", value: "~40%/hr" },
      { label: "Manual Touches", value: "5-7 per lead" },
    ],
    color: "#ef4444",
    gradient: "from-red-500/10 to-red-500/5",
  },
  {
    id: "data-decay",
    icon: Database,
    title: "Data Decay",
    subtitle: "Fragmented Payloads & Schema Drift",
    description: "Inconsistent webhook payloads, missing CRM properties, and custom integrations that drift from source APIs create downstream corruption. Data quality issues compound silently across the stack.",
    metrics: [
      { label: "Field Mismatch Rate", value: "~25%" },
      { label: "Enrichment Gaps", value: "> 60%" },
      { label: "Sync Conflicts", value: "Daily" },
    ],
    color: "#f59e0b",
    gradient: "from-amber-500/10 to-amber-500/5",
  },
  {
    id: "silent-failures",
    icon: AlertTriangle,
    title: "Silent Failures",
    subtitle: "Background Workflow Black Holes",
    description: "Broken API endpoints, rate limit exhaustion, and malformed responses fail quietly without alerts. Teams discover issues days later — after revenue impact has already compounded.",
    metrics: [
      { label: "Detection Lag", value: "2-72 hrs" },
      { label: "Retry Success Rate", value: "< 15%" },
      { label: "Revenue at Risk", value: "Unbounded" },
    ],
    color: "#06b6d4",
    gradient: "from-cyan-500/10 to-cyan-500/5",
  },
];

export default function PainPoints() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
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

    document.querySelectorAll('[data-index]').forEach((el) => {
      observerRef.current?.observe(el as HTMLElement);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section
      id="pain-points"
      className="relative py-24 sm:py-32 lg:py-40 px-6 sm:px-8 lg:px-12"
      aria-labelledby="pain-points-title"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-mint/20 text-sm font-medium text-mint mb-6">
            <span className="w-2 h-2 bg-mint rounded-full animate-pulse-glow" aria-hidden="true" />
            THE ENTERPRISE PAIN POINTS
          </span>
          <h2
            id="pain-points-title"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6"
          >
            What I Fix: Systematic
            <br />
            <span className="text-gradient-cyan">Revenue Blockers</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            These aren't bugs — they're architectural gaps that compound silently across your GTM stack.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            const isVisible = visibleCards.has(index);
            return (
              <article
                key={point.id}
                data-index={index}
                className={`relative card-hover glass rounded-2xl p-8 overflow-hidden transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  background: `linear-gradient(135deg, ${point.gradient})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[${point.color}]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[${point.color}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${point.color}20, ${point.color}10)`, border: `1px solid ${point.color}30` }}>
                    <Icon className="w-7 h-7" style={{ color: point.color }} aria-hidden="true" />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{point.title}</h3>
                    <p className="text-sm text-muted font-medium">{point.subtitle}</p>
                  </div>

                  <p className="text-muted/80 leading-relaxed mb-6">{point.description}</p>

                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    {point.metrics.map((metric, i) => (
                      <div key={i} className="text-center">
                        <div className="text-2xl font-bold text-white mb-1" style={{ color: point.color }}>{metric.value}</div>
                        <div className="text-xs text-subtle">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}