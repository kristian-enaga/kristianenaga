"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Github, ExternalLink } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phase: number;
  color: string;
}

const PHASES = [
  { label: "01 READ", desc: "Raw Lead Intake / Webhook Capture", color: "#06b6d4" },
  { label: "02 ORGANIZE", desc: "Data Normalization / AI Enrichment", color: "#00ff87" },
  { label: "03 FINISH", desc: "CRM Ingestion / Fail-Safe Delivery", color: "#3b82f6" },
];

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const phaseWidthRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      phaseWidthRef.current = width / PHASES.length;
    };

    const initParticles = () => {
      const count = Math.min(Math.floor(width * 0.8), 300);
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.5 + Math.random() * 1.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.6,
        phase: Math.floor(Math.random() * PHASES.length),
        color: PHASES[Math.floor(Math.random() * PHASES.length)].color,
      }));
    };

    const getPhaseSpeed = (x: number): number => {
      const phaseIndex = Math.min(Math.floor(x / phaseWidthRef.current), PHASES.length - 1);
      return 1 + phaseIndex * 0.4;
    };

    const getPhaseColor = (x: number): string => {
      const phaseIndex = Math.min(Math.floor(x / phaseWidthRef.current), PHASES.length - 1);
      return PHASES[phaseIndex].color;
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        const speed = getPhaseSpeed(p.x);
        p.vx = 0.8 * speed + Math.random() * 0.5 * speed;
        p.vy += (Math.random() - 0.5) * 0.15;
        p.vy = Math.max(-1.5, Math.min(1.5, p.vy));

        p.x += p.vx;
        p.y += p.vy;

        const targetPhase = Math.min(Math.floor(p.x / phaseWidthRef.current), PHASES.length - 1);
        p.color = PHASES[targetPhase].color;

        if (p.x > width + 20) {
          p.x = -20;
          p.y = Math.random() * height;
          p.opacity = 0.2 + Math.random() * 0.6;
          p.size = 1 + Math.random() * 2;
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy) * 0.5;
        } else if (p.y > height) {
          p.y = height;
          p.vy = -Math.abs(p.vy) * 0.5;
        }

        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      PHASES.forEach((phase, i) => {
        const x = i * phaseWidthRef.current;
        const panelWidth = phaseWidthRef.current;
        
        ctx.fillStyle = `rgba(11, 15, 25, 0.6)`;
        ctx.fillRect(x + 20, 20, panelWidth - 40, 100);
        
        ctx.strokeStyle = `${phase.color}40`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 20, 20, panelWidth - 40, 100);

        ctx.font = "600 11px 'Geist Mono', monospace";
        ctx.fillStyle = phase.color;
        ctx.fillText(phase.label, x + 30, 50);

        ctx.font = "400 10px 'Geist', sans-serif";
        ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
        ctx.fillText(phase.desc, x + 30, 72);

        const progress = ((Date.now() / 2000) % 1);
        const barWidth = (panelWidth - 60) * progress;
        ctx.fillStyle = `${phase.color}60`;
        ctx.fillRect(x + 30, 88, barWidth, 3);
      });

      ctx.strokeStyle = "rgba(0, 255, 135, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 1; i < PHASES.length; i++) {
        const x = i * phaseWidthRef.current;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    const handleResize = () => {
      const prevWidth = width;
      resize();
      if (prevWidth !== width) {
        particlesRef.current.forEach(p => {
          p.x = (p.x / prevWidth) * width;
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      });
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePos]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-mint/5 rounded-full blur-[200px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[200px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="text-center" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-mint/20 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <span className="w-2 h-2 bg-mint rounded-full animate-pulse-glow" aria-hidden="true" />
            <span className="text-sm font-medium text-mint">🟢 Available for Enterprise Contracts (UTC+8)</span>
          </div>

          <h1
            id="hero-title"
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] text-white mb-8 animate-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            Unslop your GTM implementation.
            <br />
            <span className="text-gradient-mint">Build Fail-Safe Automations</span>
            <br />
            That Maximize Revenue Operations.
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '400ms' }}>
            Helping high-growth B2B companies eliminate manual data entry, orchestrate multi-provider data waterfalls, and ensure workflow exceptions never break silently.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <a
              href="#proof-of-work"
              className="btn-primary focus-ring group"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#proof-of-work')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">Inspect Proof of Work</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#architecture"
              className="btn-secondary focus-ring group"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#architecture')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Play className="w-4 h-4 mr-2" aria-hidden="true" />
              Watch Systems Walkthrough
            </a>
          </div>
        </div>

        <div className="relative mt-16 h-[320px] sm:h-[380px] lg:h-[420px] animate-fade-in" style={{ animationDelay: '600ms' }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full glass rounded-2xl border-mint/10"
            aria-label="Real-time data streaming visualization showing three-phase pipeline: Read, Organize, Finish"
            role="img"
          />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-subtle">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-transparent via-mint to-transparent" />
              <span>Particles accelerate through each phase</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
              <span>Hover to influence flow trajectory</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted/50">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}