"use client";

import { useEffect, useRef, useState } from "react";

const STAGE_NAMES = ["INGEST", "PROCESS", "PERSIST", "DELIVER"] as const;

const STAGE_COLORS = {
  INGEST: { main: "#6366f1", second: "#a855f7", glow: "rgba(99, 102, 241," },
  PROCESS: { main: "#22c55e", second: "#86efac", glow: "rgba(34, 197, 94," },
  PERSIST: { main: "#a855f7", second: "#c084fc", glow: "rgba(168, 85, 247," },
  DELIVER: { main: "#f59e0b", second: "#fef3c7", glow: "rgba(245, 158, 11," },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number; // depth for isometric perspective
  radius: number;
  opacity: number;
  color: string;
  type: string;
  stage: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  life: number;
  maxLife: number;
}

interface BoxNode {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  stage: number;
  pulse: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const boxesRef = useRef<BoxNode[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);

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
      boxesRef.current = [];

      const stageX = [w * 0.12, w * 0.34, w * 0.56, w * 0.78];
      const stageY = h * 0.5;

      // Create glowing boxes for each stage (isometric perspective)
      for (let s = 0; s < STAGES; s++) {
        const colorObj = STAGE_COLORS[STAGE_NAMES[s]];
        const boxW = s === 3 ? 90 : 60;
        const boxH = s === 3 ? 45 : 30;
        
        // Front box
        boxesRef.current.push({
          x: stageX[s],
          y: stageY,
          z: 0,
          width: boxW,
          height: boxH,
          color: colorObj.main,
          opacity: 0.8,
          stage: s,
          pulse: Math.random() * Math.PI * 2,
        });
        
        // Side box (isometric depth)
        boxesRef.current.push({
          x: stageX[s] + boxW * 0.15,
          y: stageY - boxH * 0.3,
          z: boxW * 0.15,
          width: boxW * 0.6,
          height: boxH * 0.5,
          color: colorObj.second,
          opacity: 0.4,
          stage: s,
          pulse: Math.random() * Math.PI * 2,
        });
        
        // Top box (isometric depth)
        boxesRef.current.push({
          x: stageX[s] - boxW * 0.1,
          y: stageY - boxH * 0.4,
          z: -boxW * 0.1,
          width: boxW * 0.6,
          height: boxH * 0.5,
          color: colorObj.main,
          opacity: 0.2,
          stage: s,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      // Create particles that flow through stages
      const particlesPerStage = 12;
      for (let s = 0; s < STAGES; s++) {
        const colorObj = STAGE_COLORS[STAGE_NAMES[s]];
        for (let i = 0; i < particlesPerStage; i++) {
          const angle = (Math.PI * 2 * i) / particlesPerStage;
          const r = 25 + Math.random() * 15;
          
          particlesRef.current.push({
            x: stageX[s] + Math.cos(angle) * r,
            y: stageY + Math.sin(angle) * r * 0.6,
            z: Math.random() * 40 - 20,
            vx: 0,
            vy: 0,
            radius: 1.5 + Math.random() * 1.5,
            opacity: 0.4 + Math.random() * 0.4,
            color: colorObj.main,
            type: "orbit",
            stage: s,
            targetX: stageX[s],
            targetY: stageY,
            targetZ: 0,
            life: 0,
            maxLife: 9999,
          });
        }
      }

      // Flowing packets between stages (smooth, not too fast)
      for (let s = 0; s < STAGES - 1; s++) {
        const startColor = STAGE_COLORS[STAGE_NAMES[s]];
        const endColor = STAGE_COLORS[STAGE_NAMES[s + 1]];
        for (let i = 0; i < 5; i++) {
          const progress = i / 5;
          particlesRef.current.push({
            x: stageX[s] + (stageX[s + 1] - stageX[s]) * progress,
            y: stageY + (Math.random() - 0.5) * 10,
            z: 0,
            vx: 0.25 + s * 0.05, // Slow speed to avoid lag
            vy: 0,
            radius: 2,
            opacity: 0.6,
            color: startColor.main,
            type: "packet",
            stage: s,
            targetX: stageX[s + 1],
            targetY: stageY,
            targetZ: 0,
            life: 0,
            maxLife: 9999,
          });
        }
      }
    };

    // Draw isometric box with 3D perspective
    const drawIsometricBox = (
      ctx: CanvasRenderingContext2D,
      box: BoxNode,
      colorObj: { main: string; second: string; glow: string }
    ) => {
      const { x, y, width, height, opacity } = box;
      const depth = width * 0.25;
      
      // Save context for depth sorting
      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Top face (darker)
      const topGrad = ctx.createLinearGradient(
        x - depth / 2, y - height / 2,
        x + width / 2, y - height / 2 - depth / 2
      );
      topGrad.addColorStop(0, `${colorObj.main}40`);
      topGrad.addColorStop(1, `${colorObj.main}20`);
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.moveTo(x - depth / 2, y - height / 2 - depth / 4);
      ctx.lineTo(x + width + depth / 2, y - height / 2 - depth / 4);
      ctx.lineTo(x + width, y - height / 2);
      ctx.lineTo(x, y - height / 2);
      ctx.closePath();
      ctx.fill();
      
      // Right face (darker side)
      const sideGrad = ctx.createLinearGradient(
        x + width, y - height / 2,
        x + width + depth / 2, y + height / 2 - depth / 4
      );
      sideGrad.addColorStop(0, `${colorObj.second}30`);
      sideGrad.addColorStop(1, `${colorObj.second}15`);
      ctx.fillStyle = sideGrad;
      ctx.beginPath();
      ctx.moveTo(x + width, y - height / 2);
      ctx.lineTo(x + width + depth / 2, y - height / 2 - depth / 4);
      ctx.lineTo(x + width + depth / 2, y + height / 2 - depth / 4);
      ctx.lineTo(x + width, y + height / 2);
      ctx.closePath();
      ctx.fill();
      
      // Front face (brightest)
      const frontGrad = ctx.createLinearGradient(
        x, y - height / 2,
        x + width, y + height / 2
      );
      frontGrad.addColorStop(0, `${colorObj.main}90`);
      frontGrad.addColorStop(0.5, `${colorObj.main}60`);
      frontGrad.addColorStop(1, `${colorObj.main}40`);
      ctx.fillStyle = frontGrad;
      ctx.beginPath();
      ctx.moveTo(x, y - height / 2);
      ctx.lineTo(x + width, y - height / 2);
      ctx.lineTo(x + width, y + height / 2);
      ctx.lineTo(x, y + height / 2);
      ctx.closePath();
      ctx.fill();
      
      // Glowing border
      ctx.strokeStyle = `${colorObj.main}${Math.floor(opacity * 200).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y - height / 2);
      ctx.lineTo(x + width, y - height / 2);
      ctx.lineTo(x + width, y + height / 2);
      ctx.lineTo(x, y + height / 2);
      ctx.closePath();
      ctx.stroke();
      
      // Stage label on front
      ctx.font = "bold 10px 'Geist Mono', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(STAGE_NAMES[box.stage], x + width / 2, y - 2);
      
      ctx.restore();
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const stageX = [w * 0.12, w * 0.34, w * 0.56, w * 0.78];
      const stageY = h * 0.5;
      
      for (let i = 0; i < stageX.length - 1; i++) {
        const colorObj = STAGE_COLORS[STAGE_NAMES[i]];
        const grad = ctx.createLinearGradient(stageX[i], stageY, stageX[i + 1], stageY);
        grad.addColorStop(0, `${colorObj.glow}0.15)`);
        grad.addColorStop(0.5, `${colorObj.glow}0.35)`);
        grad.addColorStop(1, `${colorObj.glow}0.15)`);
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = -timeRef.current * 20;
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
      
      // Isometric grid background
      ctx.strokeStyle = "rgba(99, 102, 241, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 50;
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
      
      // Connections between stages
      drawConnections(ctx, w, h);
      
      // Sort boxes by depth for proper 3D rendering
      const sortedBoxes = [...boxesRef.current].sort((a, b) => a.z - b.z);
      
      // Draw all boxes
      sortedBoxes.forEach((box) => {
        const colorObj = STAGE_COLORS[STAGE_NAMES[box.stage]];
        box.pulse += 0.02;
        const pulseScale = 1 + Math.sin(box.pulse) * 0.05;
        
        drawIsometricBox(ctx, {
          ...box,
          width: box.width * pulseScale,
          height: box.height * pulseScale,
        }, colorObj);
      });
      
      // Update and draw particles
      const newParticles: Particle[] = [];
      
      particlesRef.current.forEach((p) => {
        if (p.type === "orbit") {
          // Orbit around stage center
          const stageX = [w * 0.12, w * 0.34, w * 0.56, w * 0.78][p.stage];
          const stageY = h * 0.5;
          const angle = timeRef.current * (0.5 + p.stage * 0.1) + p.life * 0.05;
          const r = 25 + Math.sin(timeRef.current * 0.5 + p.life * 0.1) * 5;
          
          p.x = stageX + Math.cos(angle) * r;
          p.y = stageY + Math.sin(angle) * r * 0.6;
          p.z = Math.sin(timeRef.current + p.life * 0.05) * 15;
          
          // Pulse opacity
          p.opacity = 0.3 + 0.5 * Math.abs(Math.sin(timeRef.current * 2 + p.life * 0.1));
          
          newParticles.push(p);
        }
        else if (p.type === "packet") {
          // Flow between stages
          p.x += p.vx;
          
          // Reset when past next stage
          if (p.x > p.targetX + 20) {
            p.x = [w * 0.12, w * 0.34, w * 0.56][p.stage] - 20;
            p.life = 0;
          }
          
          // Gentle bobbing
          p.y = p.targetY + Math.sin(timeRef.current * 2 + p.life * 0.1) * 3;
          
          // Pulse
          p.opacity = 0.4 + 0.4 * Math.abs(Math.sin(timeRef.current * 3 + p.life * 0.1));
          
          newParticles.push(p);
        }
      });
      
      particlesRef.current = newParticles;
      
      // Draw particles with minimal glow (no shadowBlur for performance)
      newParticles.forEach((p) => {
        const r = p.radius;
        
        // Outer glow
        if (p.type === "packet") {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
          grad.addColorStop(0, `${p.color}${Math.floor(p.opacity * 150).toString(16).padStart(2, '0')}`);
          grad.addColorStop(1, `${p.color}00`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
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
      
      // Draw stage labels below boxes
      const stageLabels = {
        INGEST: "Raw Data Intake",
        PROCESS: "AI Processing",
        PERSIST: "Storage & Sync",
        DELIVER: "Automated Output",
      };
      
      const stageX = [w * 0.12, w * 0.34, w * 0.56, w * 0.78];
      stageX.forEach((x, i) => {
        const colorObj = STAGE_COLORS[STAGE_NAMES[i]];
        ctx.font = "600 9px 'Geist Mono', monospace";
        ctx.fillStyle = colorObj.main;
        ctx.textAlign = "center";
        ctx.fillText(stageLabels[STAGE_NAMES[i]], x, h * 0.5 + 60);
        
        ctx.font = "500 8px 'Geist', sans-serif";
        ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
        ctx.fillText(`Tier ${i + 1} of 4`, x, h * 0.5 + 72);
      });
      
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
        boxesRef.current.forEach(b => {
          b.x = (b.x / prevW) * widthRef.current;
          b.y = (b.y / prevH) * heightRef.current;
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