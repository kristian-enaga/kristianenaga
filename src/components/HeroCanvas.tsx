"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Github, ExternalLink, CheckCircle, Zap, Shield, Brain, Database, Globe, Layers, Terminal, Cloud, ArrowUpRight } from "lucide-react";

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
  { id: "ingest", label: "INGEST", desc: "Lead Capture & Webhooks", color: "#06b6d4", icon: Globe },
  { id: "process", label: "PROCESS", desc: "AI Enrichment & Scoring", color: "#00ff87", icon: Brain },
  { id: "persist", label: "PERSIST", desc: "CRM Sync & Storage", color: "#8b5cf6", icon: Database },
  { id: "deliver", label: "DELIVER", desc: "Outreach & Notifications", color: "#f59e0b", icon: Terminal },
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
        
        // Panel background
        const grad = ctx.createLinearGradient(x, 0, x, 120);
        grad.addColorStop(0, `${phase.color}15`);
        grad.addColorStop(1, `${phase.color}02`);
        ctx.fillStyle = grad;
        ctx.fillRect(x + 16, 16, panelWidth - 32, 104);
        
        // Panel border
        ctx.strokeStyle = `${phase.color}30`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 16, 16, panelWidth - 32, 104);
        
        // Phase label
        ctx.font = "600 11px 'Geist Mono', monospace";
        ctx.fillStyle = phase.color;
        ctx.fillText(phase.label, x + 28, 52);
        
        // Phase description
        ctx.font = "400 10px 'Geist', sans-serif";
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.fillText(phase.desc, x + 28, 74);
        
        // Animated progress bar
        const progress = ((timeRef.current * 150) % (panelWidth - 56));
        const barGrad = ctx.createLinearGradient(x + 28, 92, x + 28 + progress, 92);
        barGrad.addColorStop(0, `${phase.color}00`);
        barGrad.addColorStop(0.5, `${phase.color}80`);
        barGrad.addColorStop(1, `${phase.color}00`);
        ctx.fillStyle = barGrad;
        ctx.fillRect(x + 28, 92, progress, 3);
      });

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        const phase = getPhaseAtX(p.x);
        const speed = getPhaseSpeed(p.x);
        
        // Flow velocity increases through phases
        p.vx = 0.6 * speed + Math.sin(timeRef.current * 2 + p.x * 0.01) * 0.3 * speed;
        p.vy = Math.sin(timeRef.current * 1.5 + p.y * 0.01) * 0.4;
        
        // Update trail
        p.trail.unshift({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.pop();
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Color based on phase
        p.color = phase.color;

        // Wrap around
        if (p.x > width + 30) {
          p.x = -30;
          p.y = Math.random() * height;
          p.opacity = 0.15 + Math.random() * 0.5;
          p.size = 1.5 + Math.random() * 2.5;
          p.trail = [];
        }

        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy) * 0.3; }
        else if (p.y > height) { p.y = height; p.vy = -Math.abs(p.vy) * 0.3; }

        // Mouse influence
        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const force = (180 - dist) / 180 * 0.6;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Draw trail
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

        // Draw particle core
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
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-mint/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: "4s", animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet/3 rounded-full blur-[200px] opacity-30 animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-mint/20 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <span className="w-2.5 h-2.5 bg-mint rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-sm font-medium text-mint">Available for Enterprise Contracts · UTC+8 (Philippines)</span>
          </div>

          <h1
            id="hero-title"
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.02] text-white mb-8 animate-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            Automation That Fixes
            <br />
            <span className="text-gradient-mint">Revenue Operations</span>
            <br />
            At The Source
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '400ms' }}>
            I build fail-safe automation systems that eliminate manual lead processing, connect disconnected business applications, and ensure workflow failures never go unnoticed. Ten production-grade systems. Zero silent failures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <a
              href="#portfolio"
              className="btn-primary focus-ring group"
              onClick={(e) => { e.preventDefault(); document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <span className="relative z-10">Explore Portfolio</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="https://www.loom.com/share/5155791dfa914c43b0a09849b2ebb1fc"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary focus-ring group"
            >
              <Play className="w-4 h-4 mr-2" aria-hidden="true" />
              Watch 15-min Walkthrough
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-2 text-sm text-muted">
              <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
              <span>10 Independent Systems</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
              <span>10 GitHub Repositories</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
              <span>10 Loom Demonstrations</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <CheckCircle className="w-4 h-4 text-mint" aria-hidden="true" />
              <span>3 Business Categories</span>
            </div>
          </div>
        </div>

        <div className="relative mt-16 h-[360px] sm:h-[420px] lg:h-[480px] animate-fade-in" style={{ animationDelay: '700ms' }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full glass rounded-2xl border-mint/10"
            aria-label="Real-time four-phase automation pipeline visualization: Ingest → Process → Persist → Deliver"
            role="img"
          />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-subtle">
            <div className="flex items-center gap-3">
              <span className="w-10 h-px bg-gradient-to-r from-transparent via-mint to-transparent" />
              <span>Particles accelerate through each phase</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
              <span>Hover to influence flow trajectory</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted/50">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}