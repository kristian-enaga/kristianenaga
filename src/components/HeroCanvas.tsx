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
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: spark.color,
        boxShadow: `0 0 12px ${spark.color}, 0 0 24px ${spark.color}`,
        opacity: 0.9,
        animation: "sparkFade 0.6s ease-out forwards",
      }}
      aria-hidden="true"
    />
  );
}

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
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [trafficLoad, setTrafficLoad] = useState(72);
  const [processingEfficiency, setProcessingEfficiency] = useState(88);
  const [deliverySpeed, setDeliverySpeed] = useState(79);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);

  const metrics = useMemo<Metric[]>(
    () => [
      { label: "Inbound Signals", value: "1.2k", unit: "/mo", color: "#fbbf24" },
      { label: "Enriched Leads", value: "850+", unit: "/mo", color: "#ff6b5e" },
      { label: "Outbound Sent", value: "420+", unit: "/mo", color: "#dc2626" },
      { label: "Hours Saved", value: "1,200+", unit: "/yr", color: "#10b981" },
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

  // Canvas spark trail - only runs client-side after mount
  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      widthRef.current = window.innerWidth;
      heightRef.current = window.innerHeight;
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = widthRef.current * dprRef.current;
      canvas.height = heightRef.current * dprRef.current;
      canvas.style.width = `${widthRef.current}px`;
      canvas.style.height = `${heightRef.current}px`;
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
    };

    const addSpark = (x: number, y: number) => {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        if (sparksRef.current.length >= MAX_SPARKS) break;
        
        const colorIndex = Math.floor(Math.random() * SPARK_COLORS.length);
        
        sparksRef.current.push({
          id: Date.now() + i + Math.random(),
          x,
          y,
          color: SPARK_COLORS[colorIndex],
        });
      }
    };

    const drawSpark = (ctx: CanvasRenderingContext2D, spark: Spark) => {
      const { x, y, color } = spark;
      const radius = 2;
      
      // Outer glow
      const outerGrad = ctx.createRadialGradient(x, y, 0, x, y, radius * 8);
      outerGrad.addColorStop(0, `${color}CC`);
      outerGrad.addColorStop(0.5, `${color}40`);
      outerGrad.addColorStop(1, `${color}00`);
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius * 8, 0, Math.PI * 2);
      ctx.fill();

      // Core
      const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      coreGrad.addColorStop(0, `#FFFFFF`);
      coreGrad.addColorStop(0.3, color);
      coreGrad.addColorStop(1, `${color}00`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;

      const w = widthRef.current;
      const h = heightRef.current;

      // Clear with slight fade for trails
      ctx.fillStyle = "rgba(2, 6, 23, 0.3)";
      ctx.fillRect(0, 0, w, h);

      // Add sparks at mouse position
      if (mousePosRef.current.x > 0 && mousePosRef.current.y > 0) {
        addSpark(mousePosRef.current.x, mousePosRef.current.y);
      }

      // Update and draw sparks
      const newSparks: Spark[] = [];

      sparksRef.current.forEach((spark) => {
        // Simple physics
        spark.x += (Math.random() - 0.5) * 2;
        spark.y += (Math.random() - 0.5) * 2 - 0.5;

        drawSpark(ctx, spark);

        // Keep for a short time
        if (Math.random() > 0.02) {
          newSparks.push(spark);
        }
      });

      sparksRef.current = newSparks.slice(-MAX_SPARKS);
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (panelRef.current && e.touches.length > 0) {
        const rect = panelRef.current.getBoundingClientRect();
        mousePosRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
      }
    };

    const handleResize = () => {
      resize();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mounted]);

  // Only show canvas after mount
  const showCanvas = mounted && typeof window !== "undefined";

  return (
    <section className="relative min-h-[90vh] flex flex-col pt-24 pb-12 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-80" />
        <div className="absolute top-1/5 left-1/10 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/5 right-1/8 w-[450px] h-[450px] bg-amber-600/5 rounded-full blur-[200px]" />
        {showCanvas && (
          <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
          />
        )}
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

        <div ref={panelRef} className="relative glass rounded-2xl p-5 lg:p-8 border border-white/10 mb-8 overflow-hidden" style={{ animation: "heroFadeUp 0.8s ease-out 0.2s both" }} onMouseMove={mounted ? (e: React.MouseEvent<HTMLDivElement>) => {
          if (panelRef.current) {
            const rect = panelRef.current.getBoundingClientRect();
            mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          }
        } : undefined}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-lg lg:text-xl font-bold text-white">Agentic GTM Lead Infrastructure</h2>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-1 rounded-full bg-red-500/15 text-red-400 animate-pulse">LIVE</span>
              <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400">REACTIVE</span>
              <span className="px-2 py-1 rounded-full bg-amber-500/15 text-amber-400">4-STAGE</span>
            </div>
          </div>

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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6" style={{ animation: "heroFadeUp 0.8s ease-out 0.5s both" }}>
          <a href="https://calendly.com/kchanchan2357/30min" target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring group">
            <span className="relative z-10">Book a 15-min Discovery Call</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </a>
          <a href="#projects" className="btn-secondary focus-ring group" onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
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
        
        <p className="text-center text-xs text-muted/70 max-w-md mx-auto" style={{ animation: "heroFadeUp 0.8s ease-out 0.6s both" }}>
          <span className="font-medium text-white/60">Timezone:</span> UTC+8 (Philippines) — 4hr overlap with US West, full day with APAC/EMEA. Async-first with scheduled syncs.
        </p>
      </div>
    </section>
  );
}