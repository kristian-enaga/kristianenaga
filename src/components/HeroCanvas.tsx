"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Github, ExternalLink, CheckCircle, Zap, Shield, Brain, Database, Globe, Terminal, Layers, Cloud, ArrowUpRight, ChevronRight } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  trail: { x: number; y: number }[];
}

const PHASES = [
  { id: "ingest", label: "INGEST", desc: "Lead Capture & Webhooks", color: "#06b6d4" },
  { id: "process", label: "PROCESS", desc: "AI Enrichment & Scoring", color: "#00ff87" },
  { id: "persist", label: "PERSIST", desc: "CRM Sync & Storage", color: "#8b5cf6" },
  { id: "deliver", label: "DELIVER", desc: "Outreach & Notifications", color: "#f59e0b" },
];

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const phaseWidthRef = useRef<number>(0);
  const timeRef = useRef(0);

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
      const count = Math.min(Math.floor(width * 0.6), 200);
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.15 + Math.random() * 0.5,
        color: PHASES[Math.floor(Math.random() * PHASES.length)].color,
        trail: [],
      }));
    };

    const getPhaseAtX = (x: number) => {
      const idx = Math.min(Math.floor(x / phaseWidthRef.current), PHASES.length - 1);
      return PHASES[idx];
    };

    const getPhaseSpeed = (x: number): number => {
      const phaseIndex = Math.min(Math.floor(x / phaseWidthRef.current), PHASES.length - 1);
      return 1 + phaseIndex * 0.35;
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;
      
      ctx.clearRect(0, 0, width, height);

      // Draw phase dividers
      ctx.strokeStyle = "rgba(0, 255, 135, 0.06)";
      ctx.lineWidth = 1;
      for (let i = 1; i < PHASES.length; i++) {
        const x = i * phaseWidthRef.current;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw phase panels
      PHASES.forEach((phase, i) => {
        const x = i * phaseWidthRef.current;
        const panelWidth = phaseWidthRef.current;
        
        const grad = ctx.createLinearGradient(x, 0, x, 120);
        grad.addColorStop(0, `${phase.color}15`);
        grad.addColorStop(1, `${phase.color}02`);
        ctx.fillStyle = grad;
        ctx.fillRect(x + 16, 16, panelWidth - 32, 104);
        
        ctx.strokeStyle = `${phase.color}30`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 16, 16, panelWidth - 32, 104);
        
        ctx.font = "600 11px 'Geist Mono', monospace";
        ctx.fillStyle = phase.color;
        ctx.fillText(phase.label, x + 28, 52);
        
        ctx.font = "400 10px 'Geist', sans-serif";
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.fillText(phase.desc, x + 28, 74);
        
        const progress = ((timeRef.current * 150) % (panelWidth - 56));
        const barGrad = ctx.createLinearGradient(x + 28, 92, x + 28 + progress, 92);
        barGrad.addColorStop(0, `${phase.color}00`);
        barGrad.addColorStop(0.5, `${phase.color}80`);
        barGrad.addColorStop(1, `${phase.color}00`);
        ctx.fillStyle = barGrad;
        ctx.fillRect(x + 28, 92, progress, 3);
      });

      particlesRef.current.forEach((p) => {
        const phase = getPhaseAtX(p.x);
        const speed = getPhaseSpeed(p.x);
        
        p.vx = 0.6 * speed + Math.sin(timeRef.current * 2 + p.x * 0.01) * 0.3 * speed;
        p.vy = Math.sin(timeRef.current * 1.5 + p.y * 0.01) * 0.4;
        
        p.trail.unshift({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.pop();
        
        p.x += p.vx;
        p.y += p.vy;
        p.color = phase.color;

        if (p.x > width + 30) {
          p.x = -30;
          p.y = Math.random() * height;
          p.opacity = 0.15 + Math.random() * 0.5;
          p.size = 1.5 + Math.random() * 2.5;
          p.trail = [];
        }

        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy) * 0.3; }
        else if (p.y > height) { p.y = height; p.vy = -Math.abs(p.vy) * 0.3; }

        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180 * 0.6;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[p.trail.length - 1].x, p.trail[p.trail.length - 1].y);
          for (let i = p.trail.length - 2; i >= 0; i--) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          const trailGrad = ctx.createLinearGradient(
            p.trail[p.trail.length - 1].x, p.trail[p.trail.length - 1].y,
            p.x, p.y
          );
          trailGrad.addColorStop(0, `${p.color}00`);
          trailGrad.addColorStop(1, `${p.color}${Math.floor(p.opacity * 180).toString(16).padStart(2, '0')}`);
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = p.size * 0.8;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        const coreGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        coreGrad.addColorStop(0, `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`);
        coreGrad.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-mint/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: "4s", animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="text-center" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-mint/20 mb-6">
            <span className="w-2 h-2 bg-mint rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-sm font-medium text-mint">Available for Enterprise Contracts · UTC+8</span>
          </div>

          <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] text-white mb-6">
            Automation That Fixes
            <br />
            <span className="text-gradient-mint">Revenue Operations</span>
            <br />
            At The Source
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted max-w-3xl mx-auto mb-8 leading-relaxed">
            I build fail-safe automation systems that eliminate manual lead processing, connect disconnected business applications, and ensure workflow failures never go unnoticed. Ten production-grade systems. Zero silent failures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#projects"
              className="btn-primary focus-ring group"
              onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <span className="relative z-10">Explore Projects</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" />
            </a>
            <a
              href="https://www.loom.com/share/94749ae3e10d473d85bc6d022a45ef80"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary focus-ring group"
            >
              <Play className="w-4 h-4 mr-2" aria-hidden="true" />
              3-min Self-Intro Walkthrough
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
              <span>10 Independent Systems</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
              <span>10 GitHub Repositories</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
              <span>10 Loom Demonstrations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
              <span>3 Business Categories</span>
            </div>
          </div>
        </div>

        <div className="relative mt-12 h-[320px] sm:h-[380px] lg:h-[420px]">
          <canvas
            ref={canvasRef}
            className="w-full h-full glass rounded-2xl border-mint/10"
            aria-label="Real-time four-phase automation pipeline: Ingest → Process → Persist → Deliver"
            role="img"
          />
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-subtle">
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-transparent via-mint to-transparent" />
              <span>Particles accelerate through each phase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
              <span>Hover to influence flow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted/50">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}