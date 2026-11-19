"use client";

import { useMemo, useState, useRef, useEffect } from "react";

interface StageNode {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  colorSoft: string;
  glow: string;
  badge: string;
  icon: string;
}

interface Metric {
  label: string;
  value: string;
  unit: string;
  color: string;
}

const STAGES: StageNode[] = [
  {
    id: 1,
    title: "Inbound Intake",
    subtitle: "Scraper Boundary",
    color: "#fbbf24",
    colorSoft: "rgba(251,191,36,0.12)",
    glow: "rgba(251,191,36,0.35)",
    badge: "WEBHOOK / SCRAPER",
    icon: "▣",
  },
  {
    id: 2,
    title: "AI Lead Enrichment",
    subtitle: "Filtering & Scoring",
    color: "#ff6b5e",
    colorSoft: "rgba(255,107,94,0.12)",
    glow: "rgba(255,107,94,0.35)",
    badge: "AI SCORING",
    icon: "◆",
  },
  {
    id: 3,
    title: "Waterfall Router",
    subtitle: "Multi-Provider Lookup",
    color: "#dc2626",
    colorSoft: "rgba(220,38,38,0.12)",
    glow: "rgba(220,38,38,0.4)",
    badge: "CASCADE ENRICH",
    icon: "▲",
  },
  {
    id: 4,
    title: "CRM Sync & Dispatch",
    subtitle: "Outbound Engine",
    color: "#10b981",
    colorSoft: "rgba(16,185,129,0.12)",
    glow: "rgba(16,185,129,0.35)",
    badge: "HUBSPOT / SF",
    icon: "⬢",
  },
];

function Slider({
  id,
  label,
  value,
  onChange,
  color,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-white/70">
        {label}
      </label>
      <div className="relative flex items-center gap-3">
        <input
          type="range"
          id={id}
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 appearance-none h-2 rounded-full bg-white/10 accent-transparent cursor-pointer focus:outline-none"
          style={{
            background: `linear-gradient(90deg, ${color} ${value}%, rgba(255,255,255,0.1) ${value}%)`,
          }}
          aria-label={label}
        />
        <span className="w-10 text-right font-mono text-lg text-white/90" style={{ color }}>
          {value}%
        </span>
      </div>
    </div>
  );
}

export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  const [trafficLoad, setTrafficLoad] = useState(72);
  const [processingEfficiency, setProcessingEfficiency] = useState(88);
  const [deliverySpeed, setDeliverySpeed] = useState(79);
  const panelRef = useRef<HTMLDivElement>(null);

  const metrics = useMemo<Metric[]>(
    () => [
      { label: "SELF-HOSTED OCI VPS", value: "✓", unit: "INFRA", color: "#fbbf24" },
      { label: "SUPABASE DLQ & RETRIES", value: "✓", unit: "RELIABILITY", color: "#ff6b5e" },
      { label: "ZOD / PYDANTIC GATES", value: "✓", unit: "VALIDATION", color: "#dc2626" },
      { label: "HUMAN-IN-THE-LOOP", value: "✓", unit: "GOVERNANCE", color: "#10b981" },
    ],
    []
  );

  const status = useMemo(() => {
    if (processingEfficiency > 80 && trafficLoad > 50) {
      return {
        icon: "💡",
        label: "STABLE RUNNING",
        message: "REVENUE ENGINE BALANCED: Live data pipeline running efficiently across HubSpot/Salesforce routes.",
        className: "bg-emerald-500/10 border-emerald-500/40 text-emerald-300",
      };
    }
    if (processingEfficiency < 50 || trafficLoad > 90) {
      return {
        icon: "⚠️",
        label: "HIGH LOAD DETECTED",
        message: "PIPELINE PRESSURE: Inbound volume exceeds processing capacity. Auto-scaling recommended.",
        className: "bg-amber-500/10 border-amber-500/40 text-amber-300",
      };
    }
    return {
      icon: "💡",
      label: "STABLE RUNNING",
      message: "REVENUE ENGINE BALANCED: Live data pipeline running efficiently across HubSpot/Salesforce routes.",
      className: "bg-emerald-500/10 border-emerald-500/40 text-emerald-300",
    };
  }, [processingEfficiency, trafficLoad, deliverySpeed]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col pt-24 pb-12 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-80" />
        <div className="absolute top-1/5 left-1/10 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[200px] animate-glow-pulse" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-1/5 right-1/8 w-[450px] h-[450px] bg-amber-600/5 rounded-full blur-[200px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col flex-1">
        <div className="text-center mb-10 animate-hero-entrance-fade-up max-w-4xl mx-auto" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-mint/20 mb-6 animate-entrance-scale-in" style={{ animationDelay: "60ms" }}>
            <span className="w-2 h-2 bg-mint rounded-full animate-pulse" />
            <span className="text-sm font-medium text-mint">AI GTM Engineer — Custom Sales & Ops Systems</span>
          </div>
          <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] text-white mb-6 max-w-[90vw] mx-auto">
            <span className="animate-hero-entrance-fade-up" style={{ animationDelay: "100ms", animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}>I Replace Manual Sales & Ops Work</span>
            <br />
            <span className="text-gradient-mint animate-gradient-shimmer animate-text-breathe-glow" style={{ animationDelay: "250ms" }}>With Custom AI Systems You Own</span>
          </h1>
          <div className="max-w-2xl mx-auto text-left animate-hero-entrance-fade-up" style={{ animationDelay: "400ms" }}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-dot-sparkle animate-dot-sparkle-delay-1" />
                <div>
                  <span className="font-bold text-white">Inbound:</span>
                  <span className="text-white/90 ml-1">Clean, score, and route incoming leads to your CRM and Slack in under 30 seconds.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-dot-sparkle animate-dot-sparkle-delay-2" />
                <div>
                  <span className="font-bold text-white">Outbound:</span>
                  <span className="text-white/90 ml-1">Turn raw company data into verified, outreach-ready prospects in seconds instead of hours.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 mt-1.5 shrink-0 animate-dot-sparkle animate-dot-sparkle-delay-3" />
                <div>
                  <span className="font-bold text-white">Infrastructure:</span>
                  <span className="text-white/90 ml-1">Production-grade n8n, Supabase & Docker pipelines with instant Slack & Telegram error alerts.</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted/60 mt-4 max-w-xl mx-auto animate-hero-entrance-fade-up" style={{ animationDelay: "500ms" }}>
              *Self-hosted on your cloud — you own the data, the infra, the uptime. No vendor lock-in.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm animate-hero-entrance-fade-up" style={{ animationDelay: "550ms" }}>
              <span className="flex items-center gap-1.5 text-white/80 hover-lift" style={{ animationDelay: "540ms" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                US timezone overlap & async delivery
              </span>
              <span className="flex items-center gap-1.5 text-white/80 hover-lift" style={{ animationDelay: "600ms" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                ZOD / PYDANTIC GATES
              </span>
              <span className="flex items-center justify-center gap-1.5 text-white/80 hover-lift" style={{ animationDelay: "660ms" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                HUMAN-IN-THE-LOOP
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" role="list">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className="glass rounded-2xl p-5 relative overflow-hidden hover-lift metric-card" 
              style={{ border: `1px solid ${m.color}25`, transitionDelay: `${idx * 80}ms` }}
              role="listitem"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-20 animate-float-gentle" style={{ background: m.color, animationDelay: `${idx * 200}ms` }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider mb-2 animate-entrance-slide-left" style={{ color: m.color, animationDelay: `${idx * 80 + 100}ms` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: m.color }} />
                  {m.label}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white font-mono animate-entrance-scale-in" style={{ animationDelay: `${idx * 80 + 160}ms` }}>{m.value}</div>
                <div className="text-xs text-muted mt-1 animate-entrance-fade-up" style={{ animationDelay: `${idx * 80 + 220}ms` }}>{m.unit}</div>
              </div>
            </div>
          ))}
        </div>

        <div ref={panelRef} className="relative glass rounded-2xl p-5 lg:p-8 border border-white/10 mb-8 overflow-hidden hover-lift" style={{ transitionDelay: "400ms" }}>
          {/* Ambient panel glow */}
          <div className="absolute inset-0 -z-10 opacity-30" style={{ background: `radial-gradient(circle at 20% 30%, ${STAGES[0].color}25 0%, transparent 50%)` }} />
          <div className="absolute inset-0 -z-10 opacity-20" style={{ background: `radial-gradient(circle at 80% 70%, ${STAGES[3].color}25 0%, transparent 50%)` }} />
          
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight animate-entrance-slide-left">Agentic GTM Lead Infrastructure</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/15 text-red-400 animate-pulse animate-entrance-scale-in" style={{ animationDelay: "500ms" }}>
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-live-dot" />
                LIVE
              </span>
              <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 animate-entrance-scale-in" style={{ animationDelay: "560ms" }}>REACTIVE</span>
              <span className="px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 animate-entrance-scale-in" style={{ animationDelay: "620ms" }}>4-STAGE</span>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-stretch gap-3 md:gap-2">
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex-1 flex items-stretch gap-2">
                <div
                  className="relative flex-1 rounded-2xl p-5 flex flex-col gap-2 min-w-0 overflow-hidden hover-lift stage-card animate-stage-active"
                  style={{ 
                    background: `linear-gradient(145deg, ${stage.colorSoft}, rgba(255,255,255,0.02))`, 
                    border: `1px solid ${stage.color}20`,
                    boxShadow: `0 0 20px ${stage.color}08, inset 0 1px 0 rgba(255,255,255,0.06)`,
                    animationDelay: `${i * 0.9}s`,
                    transitionDelay: `${500 + i * 100}ms`
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 animate-entrance-scale-in" style={{ animationDelay: `${520 + i * 100}ms` }}>
                      <div className="absolute inset-0 rounded-2xl" style={{ background: `${stage.color}10`, border: `1px solid ${stage.color}40`, opacity: 0.5 }} />
                      <div className="relative z-10 w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: stage.color, boxShadow: `0 0 12px ${stage.color}60` }}>
                        <span style={{ color: '#020617' }}>{stage.icon}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded text-white/90 animate-entrance-slide-right" style={{ background: `${stage.color}20`, border: `1px solid ${stage.color}40`, animationDelay: `${540 + i * 100}ms` }}>
                      {stage.badge}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight animate-entrance-slide-left" style={{ animationDelay: `${560 + i * 100}ms` }}>{stage.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 animate-entrance-fade-up" style={{ animationDelay: `${580 + i * 100}ms` }}>{stage.subtitle}</div>
                  </div>
                  <div className="mt-auto flex items-center gap-1.5 animate-entrance-fade-up" style={{ animationDelay: `${600 + i * 100}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: stage.color }} />
                    <span className="text-[10px] font-mono" style={{ color: stage.color }}>STAGE {stage.id}</span>
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="relative hidden md:flex items-center justify-center shrink-0 w-8 animate-entrance-fade-up" style={{ animationDelay: `${620 + i * 100}ms` }}>
                    <div className="w-full h-[1px] rounded-full animate-shimmer-sweep" style={{ background: `linear-gradient(90deg, transparent 0%, ${stage.color}50 50%, transparent 100%)`, boxShadow: `0 0 10px ${stage.color}60`, backgroundSize: "200% 100%" }} />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full animate-pipeline-dot animate-pipeline-dot-delay-${i}" style={{ background: stage.color, boxShadow: `0 0 10px ${stage.color}` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:p-8 border border-white/10 mb-8 hover-lift" style={{ transitionDelay: "900ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-white animate-entrance-slide-left">Pipeline Control Dashboard</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Slider id="traffic-load" label="Traffic Load / Inbound Signals" value={trafficLoad} onChange={setTrafficLoad} color="#fbbf24" />
            <Slider id="processing-efficiency" label="Processing Efficiency / AI Speed" value={processingEfficiency} onChange={setProcessingEfficiency} color="#ff6b5e" />
            <Slider id="delivery-speed" label="Outbound Dispatch Speed" value={deliverySpeed} onChange={setDeliverySpeed} color="#10b981" />
          </div>
        </div>

        <div className={`rounded-2xl p-4 lg:p-6 mb-8 flex items-start gap-3 overflow-hidden hover-lift ${status.className}`} role="status" style={{ transitionDelay: "1000ms" }}>
          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5 animate-entrance-scale-in">
            {status.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1 animate-entrance-slide-left">{status.label}</div>
            <div className="text-sm lg:text-base font-medium leading-snug animate-entrance-fade-up">{status.message}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 animate-entrance-fade-up" style={{ animationDelay: "1100ms" }}>
          <a href="https://calendly.com/kchanchan2357/30min" target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring group btn-magnetic cta-primary-glow">
            <span className="relative z-10">Book a 15-min Discovery Call</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </a>
          <a href="#projects" className="btn-secondary focus-ring group btn-magnetic" onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span className="relative z-10">Explore Projects</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="https://www.loom.com/share/94749ae3e10d473d85bc6d022a45ef80" target="_blank" rel="noopener noreferrer" className="btn-secondary focus-ring group btn-magnetic">
            <svg className="w-4 h-4 mr-2" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            3-min Walkthrough
          </a>
        </div>
        
        <p className="text-center text-xs text-muted/70 max-w-md mx-auto animate-entrance-fade-up" style={{ animationDelay: "1200ms" }}>
          <span className="font-medium text-white/60">Timezone:</span> UTC+8 (Philippines) — 4hr overlap with US West, full day with APAC/EMEA. Async-first with scheduled syncs.
        </p>
      </div>
    </section>
  );
}