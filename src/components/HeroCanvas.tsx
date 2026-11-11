"use client";

import { useEffect, useRef, useState } from "react";

const STAGE_NAMES = ["INGEST", "PROCESS", "PERSIST", "DELIVER"] as const;

const STAGE_COLORS = {
  INGEST: { main: "#6366f1", glow: "rgba(99, 102, 241,", second: "#a855f7" },
  PROCESS: { main: "#22c55e", glow: "rgba(34, 197, 94,", second: "#86efac" },
  PERSIST: { main: "#a855f7", glow: "rgba(168, 85, 247,", second: "#c084fc" },
  DELIVER: { main: "#f59e0b", glow: "rgba(245, 158, 11,", second: "#fef3c7" },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  type: string;
  life: number;
  maxLife: number;
  stage: number;
  targetX: number;
  targetY: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);
  const particleCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      widthRef.current = rect.width;
      heightRef.current = rect.height;
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = widthRef.current * dprRef.current;
      canvas.height = heightRef.current * dprRef.current;
      canvas.style.width = `${widthRef.current}px`;
      canvas.style.height = `${heightRef.current}px`;
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      initScene();
    };

    const MAX_PARTICLES = 60;
    const STAGES = 4;

    const initScene = () => {
      const w = widthRef.current;
      const h = heightRef.current;
      particlesRef.current = [];

      const stageX = [w * 0.12, w * 0.34, w * 0.56, w * 0.78];
      const stageY = h * 0.5;

      // INGEST: chaotic intake cloud
      for (let i = 0; i < 15; i++) {
        particlesRef.current.push({
          x: stageX[0] + (Math.random() - 0.5) * 90,
          y: stageY + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: 1.5 + Math.random() * 2,
          opacity: 0.2 + Math.random() * 0.4,
          color: STAGE_COLORS.INGEST.main,
          type: "chaos",
          life: 0,
          maxLife: 120 + Math.random() * 200,
          stage: 0,
          targetX: stageX[0],
          targetY: stageY,
        });
      }

      // PROCESS: ordered data matrix nodes
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          x: stageX[1] + (i % 4 - 1.5) * 22,
          y: stageY + Math.floor(i / 4) * 18 - 18,
          vx: 0,
          vy: 0,
          radius: 2.5,
          opacity: 0.6,
          color: STAGE_COLORS.PROCESS.main,
          type: "matrix",
          life: 0,
          maxLife: 9999,
          stage: 1,
          targetX: stageX[1] + (i % 4 - 1.5) * 22,
          targetY: stageY + Math.floor(i / 4) * 18 - 18,
        });
      }

      // PERSIST: purple circuit paths
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const r = 22;
        particlesRef.current.push({
          x: stageX[2] + Math.cos(angle) * r,
          y: stageY + Math.sin(angle) * r * 0.5,
          vx: 0,
          vy: 0,
          radius: 2,
          opacity: 0.5,
          color: STAGE_COLORS.PERSIST.main,
          type: "circuit",
          life: 0,
          maxLife: 9999,
          stage: 2,
          targetX: stageX[2] + Math.cos(angle) * r,
          targetY: stageY + Math.sin(angle) * r * 0.5,
        });
      }

      // DELIVER: golden outputs with bloom (limited count for performance)
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const r = 28;
        particlesRef.current.push({
          x: stageX[3] + Math.cos(angle) * r,
          y: stageY + Math.sin(angle) * r * 0.4,
          vx: 0,
          vy: 0,
          radius: 2 + Math.random() * 2,
          opacity: 0.7,
          color: STAGE_COLORS.DELIVER.main,
          type: "output",
          life: 0,
          maxLife: 9999,
          stage: 3,
          targetX: stageX[3] + Math.cos(angle) * r,
          targetY: stageY + Math.sin(angle) * r * 0.4,
        });
      }

      // Flowing data packets moving between stages
      for (let s = 0; s < STAGES - 1; s++) {
        for (let i = 0; i < 4; i++) {
          const progress = i / 4;
          particlesRef.current.push({
            x: stageX[s] + (stageX[s + 1] - stageX[s]) * progress,
            y: stageY + (Math.random() - 0.5) * 8,
            vx: 0.4 + s * 0.1,
            vy: Math.sin(timeRef.current + progress * 10) * 0.15,
            radius: 1.5,
            opacity: 0.5,
            color: STAGE_COLORS[STAGE_NAMES[s]].main,
            type: "packet",
            life: 0,
            maxLife: 9999,
            stage: s,
            targetX: stageX[s + 1],
            targetY: stageY,
          });
        }
      }

      particleCountRef.current = particlesRef.current.length;
    };

    const drawIsometricGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gridSize = 60;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.06)";
      ctx.lineWidth = 1;
      
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    const drawStage = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      stageIdx: number,
      colorObj: { main: string; glow: string; second: string },
      label: string
    ) => {
      const x = [w * 0.12, w * 0.34, w * 0.56, w * 0.78][stageIdx];
      const y = h * 0.5;
      
      // Isometric diamond base
      const diamondW = stageIdx === 3 ? 100 : 70;
      const diamondH = stageIdx === 3 ? 50 : 35;
      
      ctx.save();
      ctx.translate(x, y);
      
      // Floor grid under stage
      ctx.strokeStyle = `${colorObj.glow}0.15)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-diamondW, 0);
      ctx.lineTo(0, -diamondH / 2);
      ctx.lineTo(diamondW, 0);
      ctx.lineTo(0, diamondH / 2);
      ctx.closePath();
      ctx.stroke();
      
      // Stage label
      ctx.font = "600 11px 'Geist Mono', monospace";
      ctx.fillStyle = colorObj.main;
      ctx.textAlign = "center";
      ctx.fillText(label, 0, -diamondH - 14);
      
      // Sub label
      const subLabels = {
        INGEST: "Load Capture",
        PROCESS: "AI Processing",
        PERSIST: "DB Storage",
        DELIVER: "API Dispatch",
      };
      ctx.font = "500 9px 'Geist', sans-serif";
      ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
      ctx.fillText(subLabels[label as keyof typeof subLabels], 0, -diamondH - 4);
      
      ctx.restore();

      // Bloom for DELIVER only (performance optimization)
      if (stageIdx === 3) {
        const bloomGrad = ctx.createRadialGradient(x, y, 0, x, y, 90);
        bloomGrad.addColorStop(0, `${colorObj.glow}0.35)`);
        bloomGrad.addColorStop(0.5, `${colorObj.glow}0.12)`);
        bloomGrad.addColorStop(1, `${colorObj.glow}0)`);
        ctx.fillStyle = bloomGrad;
        ctx.beginPath();
        ctx.arc(x, y, 90, 0, Math.PI * 2);
        ctx.fill();
        
        // Lens flare accent
        const flareGrad = ctx.createLinearGradient(x - 40, y - 40, x + 40, y + 40);
        flareGrad.addColorStop(0, "rgba(254, 243, 199, 0)");
        flareGrad.addColorStop(0.5, "rgba(254, 243, 199, 0.15)");
        flareGrad.addColorStop(1, "rgba(254, 243, 199, 0)");
        ctx.fillStyle = flareGrad;
        ctx.beginPath();
        ctx.moveTo(x - 50, y - 50);
        ctx.lineTo(x + 50, y - 30);
        ctx.lineTo(x + 30, y + 30);
        ctx.lineTo(x - 30, y + 50);
        ctx.closePath();
        ctx.fill();
      }
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const stageX = [w * 0.12, w * 0.34, w * 0.56, w * 0.78];
      const stageY = h * 0.5;
      
      for (let i = 0; i < stageX.length - 1; i++) {
        const colorObj = STAGE_COLORS[STAGE_NAMES[i]];
        const grad = ctx.createLinearGradient(stageX[i], stageY, stageX[i + 1], stageY);
        grad.addColorStop(0, `${colorObj.glow}0.2)`);
        grad.addColorStop(0.5, `${colorObj.glow}0.4)`);
        grad.addColorStop(1, `${colorObj.glow}0.2)`);
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = -timeRef.current * 30;
        ctx.beginPath();
        ctx.moveTo(stageX[i], stageY);
        ctx.lineTo(stageX[i + 1], stageY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;
      
      const w = widthRef.current;
      const h = heightRef.current;
      
      // Clear
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);
      
      // Isometric grid
      drawIsometricGrid(ctx, w, h);
      
      // Connections between stages
      drawConnections(ctx, w, h);
      
      // Draw each stage
      drawStage(ctx, w, h, 0, STAGE_COLORS.INGEST, "INGEST");
      drawStage(ctx, w, h, 1, STAGE_COLORS.PROCESS, "PROCESS");
      drawStage(ctx, w, h, 2, STAGE_COLORS.PERSIST, "PERSIST");
      drawStage(ctx, w, h, 3, STAGE_COLORS.DELIVER, "DELIVER");
      
      // Update particles
      const newParticles: Particle[] = [];
      
      particlesRef.current.forEach((p) => {
        if (p.type === "chaos") {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          
          // Bounce within chaos zone
          if (Math.abs(p.x - p.targetX) > 45) p.vx *= -1;
          if (Math.abs(p.y - p.targetY) > 30) p.vy *= -1;
          
          // Pulse opacity
          p.opacity = 0.2 + 0.4 * Math.abs(Math.sin(timeRef.current * 2 + p.life * 0.05));
          
          newParticles.push(p);
        }
        else if (p.type === "matrix") {
          // Subtle pulse
          p.opacity = 0.5 + 0.3 * Math.abs(Math.sin(timeRef.current * 1.5 + p.life * 0.03));
          p.y = p.targetY + Math.sin(timeRef.current + p.life * 0.1) * 2;
          newParticles.push(p);
        }
        else if (p.type === "circuit") {
          p.opacity = 0.4 + 0.4 * Math.abs(Math.sin(timeRef.current * 1 + p.life * 0.05));
          newParticles.push(p);
        }
        else if (p.type === "output") {
          // Deliver: bright pulsing with bloom
          p.opacity = 0.6 + 0.4 * Math.abs(Math.sin(timeRef.current * 3 + p.life * 0.08));
          p.y = p.targetY + Math.sin(timeRef.current * 2 + p.life * 0.1) * 3;
          newParticles.push(p);
        }
        else if (p.type === "packet") {
          // Moving packet between stages
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          
          // Loop back
          if (p.x > p.targetX + 40) {
            p.x = [w * 0.12, w * 0.34, w * 0.56][p.stage] - 40;
            p.life = 0;
          }
          
          newParticles.push(p);
        }
      });
      
      // Draw particles with minimal bloom (no shadowBlur for performance)
      newParticles.forEach((p) => {
        const r = p.radius;
        
        // Outer glow (only for output type)
        if (p.type === "output") {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
          grad.addColorStop(0, `${p.color}${Math.floor(p.opacity * 150).toString(16).padStart(2, '0')}`);
          grad.addColorStop(1, `${p.color}00`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Core
        const coreGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        coreGrad.addColorStop(0, `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`);
        coreGrad.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      particlesRef.current = newParticles;
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const handleResize = () => {
      const prevW = widthRef.current;
      const prevH = heightRef.current;
      resize();
      if (prevW !== widthRef.current || prevH !== heightRef.current) {
        particlesRef.current.forEach(p => {
          p.x = (p.x / prevW) * widthRef.current;
          p.y = (p.y / prevH) * heightRef.current;
          p.targetX = (p.targetX / prevW) * widthRef.current;
          p.targetY = (p.targetY / prevH) * heightRef.current;
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-70" />
        <div className="absolute top-1/5 left-1/10 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/5 right-1/8 w-[450px] h-[450px] bg-amber-600/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="text-center" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-indigo-500/20 mb-6">
            <span className="w-2 h-2 bg-indigo-400 rounded-full" aria-hidden="true" />
            <span className="text-sm font-medium text-indigo-400">Solving daily business operations</span>
          </div>

          <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] text-white mb-6">
            Automation That Fixes
            <br />
            <span className="text-gradient-mint">Daily Operations</span>
            <br />
            At The Source
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted max-w-3xl mx-auto mb-8 leading-relaxed">
            I build automation systems that eliminate manual data entry, reduce errors, free up staff time, and speed up repeat operations. Four production-grade GTM stages. Zero silent failures.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#projects"
              className="btn-primary focus-ring group"
              onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <span className="relative z-10">Explore Projects</span>
              <svg className="w-5 h-5 ml-2 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-12" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="https://www.loom.com/share/94749ae3e10d473d85bc6d022a45ef80"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary focus-ring group"
            >
              <svg className="w-4 h-4 mr-2" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              3-min Walkthrough
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-mint" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              <span>10 Working Systems</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-mint" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              <span>10 GitHub Repositories</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-mint" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              <span>10 Loom Walkthroughs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-mint" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              <span>4 GTM Stages</span>
            </div>
          </div>
        </div>

        <div className="relative mt-12 h-[400px] sm:h-[480px] lg:h-[520px]">
          <canvas
            ref={canvasRef}
            className="w-full h-full glass rounded-2xl border-indigo-500/10"
            aria-label="4-stage GTM data automation pipeline: INGEST → PROCESS → PERSIST → DELIVER"
            role="img"
          />
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