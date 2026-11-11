"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";

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

interface Spark {
  id: number;
  x: number;
  y: number;
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

const SPARK_COLORS = ["#fbbf24", "#ff6b5e", "#dc2626", "#10b981", "#a855f7"];
const MAX_SPARKS = 120;

function SparkBadge({ spark }: { spark: Spark }) {
  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: spark.x,
        top: spark.y,
        animation: "sparkTrailFade 300ms ease-out forwards",
      }}
      aria-hidden="true"
    >
      <div className="rounded-full" style={{ width: 8, height: 8, background: spark.color }} />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          width: 16,
          height: 16,
          border: `1px solid ${spark.color}`,
          opacity: 0.4,
        }}
      />
    </div>
  );
}

function Slider({ id, label, value, onChange, color }: { id: string; label: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
          {label}
        </label>
        <span className="text-sm font-mono font-bold px-2.5 py-1 rounded-lg" style={{ color, background: `${color}1a` }}>
          {value}%
        </span>
      </div>
      <input
        id={id}
        type="range"
        min="10"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 appearance-none rounded-full cursor-pointer outline-none"
        style={{ background: `linear-gradient(90deg, ${color} ${value}%, rgba(255,255,255,0.06) ${value}%)` }}
        aria-label={label}
      />
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>10%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export default function HeroCanvas() {
  const [trafficLoad, setTrafficLoad] = useState(50);
  const [processingEfficiency, setProcessingEfficiency] = useState(39);
  const [deliverySpeed, setDeliverySpeed] = useState(50);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const processBacklog = Math.max(0, Math.floor((trafficLoad - processingEfficiency) * 0.5));
  const ingestLag = trafficLoad * 0.2 + 0.4;
  const deliverOutflow = Math.max(0, parseFloat(((deliverySpeed * 0.6) - processBacklog * 0.8).toFixed(1)));

  const metrics: Metric[] = useMemo(
    () => [
      { label: "Ingest Lag", value: ingestLag.toFixed(1), unit: "ms", color: "#fbbf24" },
      { label: "Process Backlog", value: String(processBacklog), unit: "leads queued", color: "#ff6b5e" },
      { label: "Deliver Outflow", value: deliverOutflow.toFixed(1), unit: "leads/sec", color: "#10b981" },
    ],
    [trafficLoad, processingEfficiency, deliverySpeed]
  );

  const status = useMemo(() => {
    if (processingEfficiency < 40 || processBacklog > 5) {
      return {
        icon: "🚨",
        label: "BOTTLENECK ALERT",
        message: "CRITICAL WORKFLOW BACKLOG: Automated AI Enrichment node is throttling CRM ingestion sync.",
        className: "bg-red-500/10 border-red-500/40 text-red-300 animate-pulse",
      };
    }
    if (trafficLoad < 25) {
      return {
        icon: "💤",
        label: "BALANCED IDLE",
        message: "SYSTEM IDLE: Awaiting raw lead ingestion webhook streams.",
        className: "bg-slate-700/10 border-slate-500/40 text-slate-300",
      };
    }
    return {
      icon: "💡",
      label: "STABLE RUNNING",
      message: "REVENUE ENGINE BALANCED: Live data pipeline running efficiently across HubSpot/Salesforce routes.",
      className: "bg-emerald-500/10 border-emerald-500/40 text-emerald-300",
    };
  }, [processingEfficiency, processBacklog, trafficLoad]);

  const handleSparkTrail = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const spark: Spark = {
      id: Date.now() + Math.random(),
      x,
      y,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
    };
    setSparks((prev) => [...prev.slice(-30), spark]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== spark.id));
    }, 300);
  }, []);

  useEffect(() => {
    const MAX_CAP = MAX_SPARKS;
    if (sparks.length > MAX_CAP) {
      setSparks((prev) => prev.slice(prev.length - MAX_CAP));
    }
  }, [sparks]);

  return (
    <section className="relative min-h-[90vh] flex flex-col pt-24 pb-12 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-80" />
        <div className="absolute top-1/5 left-1/10 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/5 right-1/8 w-[450px] h-[450px] bg-amber-600/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col flex-1">
        <div className="text-center mb-10" style={{ animation: "heroFadeUp 0.8s ease-out both" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-red-500/20 mb-6">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-400">Solving daily business operations</span>
          </div>
          <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] text-white mb-6">
            Automation That Fixes
            <br />
            <span className="text-gradient-mint">Daily Operations</span>
            <br />
            At The Source
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            I build automation systems that eliminate manual data entry, reduce errors, free up staff time, and speed up repeat operations. Four production-grade GTM stages. Zero silent failures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" style={{ animation: "heroFadeUp 0.8s ease-out 0.1s both" }}>
          {metrics.map((m) => (
            <div key={m.label} className="glass rounded-2xl p-5 relative overflow-hidden" style={{ border: `1px solid ${m.color}25` }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-20" style={{ background: m.color }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider mb-2" style={{ color: m.color }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: m.color }} />
                  {m.label}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white font-mono">{m.value}</div>
                <div className="text-xs text-muted mt-1">{m.unit}</div>
              </div>
            </div>
          ))}
        </div>

        <div ref={panelRef} className="relative glass rounded-2xl p-5 lg:p-8 border border-white/10 mb-8 overflow-hidden" style={{ animation: "heroFadeUp 0.8s ease-out 0.2s both" }} onMouseMove={handleSparkTrail}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-lg lg:text-xl font-bold text-white">Agentic GTM Lead Infrastructure</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-1 rounded-full bg-red-500/15 text-red-400 animate-pulse">LIVE</span>
              <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400">REACTIVE</span>
              <span className="px-2 py-1 rounded-full bg-amber-500/15 text-amber-400">4-STAGE</span>
            </div>
          </div>

          {sparks.map((s) => (
            <SparkBadge key={s.id} spark={s} />
          ))}

          <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-2">
            {STAGES.map((stage, i) => (
              <div key={stage.id} className="flex-1 flex items-stretch gap-2">
                <div className="relative flex-1 rounded-2xl p-5 flex flex-col gap-2 min-w-0 overflow-hidden" style={{ background: `linear-gradient(145deg, ${stage.colorSoft}, transparent)`, border: `1px solid ${stage.color}30`, boxShadow: `0 0 24px ${stage.color}10, inset 0 1px 0 rgba(255,255,255,0.05)`, animation: `nodePulse ${2 + i * 0.3}s ease-in-out infinite` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: `${stage.color}20`, border: `1px solid ${stage.color}40`, color: stage.color }}>
                      {stage.icon}
                    </div>
                    <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded text-white/80" style={{ background: `${stage.color}25` }}>
                      {stage.badge}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">{stage.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{stage.subtitle}</div>
                  </div>
                  <div className="mt-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: stage.color }} />
                    <span className="text-[10px] font-mono" style={{ color: stage.color }}>STAGE {stage.id}</span>
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <div className="hidden md:flex items-center justify-center shrink-0 w-6">
                    <div className="w-full h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${stage.color}60, ${STAGES[i + 1].color}60)`, boxShadow: `0 0 8px ${stage.color}50`, animation: "ping 2s infinite" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:p-8 border border-white/10 mb-8" style={{ animation: "heroFadeUp 0.8s ease-out 0.3s both" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-white">Pipeline Control Dashboard</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Slider id="traffic-load" label="Traffic Load / Inbound Signals" value={trafficLoad} onChange={setTrafficLoad} color="#fbbf24" />
            <Slider id="processing-efficiency" label="Processing Efficiency / AI Speed" value={processingEfficiency} onChange={setProcessingEfficiency} color="#ff6b5e" />
            <Slider id="delivery-speed" label="Outbound Dispatch Speed" value={deliverySpeed} onChange={setDeliverySpeed} color="#10b981" />
          </div>
        </div>

        <div className={`rounded-2xl p-4 lg:p-6 mb-8 flex items-start gap-3 overflow-hidden ${status.className}`} role="status">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5">
            {status.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-1">{status.label}</div>
            <div className="text-sm lg:text-base font-medium leading-snug">{status.message}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animation: "heroFadeUp 0.8s ease-out 0.5s both" }}>
          <a href="#projects" className="btn-primary focus-ring group" onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span className="relative z-10">Explore Projects</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="https://www.loom.com/share/94749ae3e10d473d85bc6d022a45ef80" target="_blank" rel="noopener noreferrer" className="btn-secondary focus-ring group">
            <svg className="w-4 h-4 mr-2" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            3-min Walkthrough
          </a>
        </div>
      </div>
    </section>
  );
}
