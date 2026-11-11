"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

const STAGE_NAMES = ["INGEST", "PROCESS", "PERSIST", "DELIVER"] as const;

const STAGE_COLORS = {
  INGEST: { main: "#dc2626", second: "#ef4444", glow: "rgba(220, 38, 38," },
  PROCESS: { main: "#f97316", second: "#fb923c", glow: "rgba(249, 115, 22," },
  PERSIST: { main: "#f59e0b", second: "#fbbf24", glow: "rgba(245, 158, 11," },
  DELIVER: { main: "#e11d48", second: "#f43f5e", glow: "rgba(225, 29, 72," },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number;
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
  depth: number;
  color: string;
  opacity: number;
  stage: number;
  pulse: number;
}

interface SliderState {
  trafficLoad: number;
  processingEfficiency: number;
  deliverySpeed: number;
}

interface Metrics {
  ingestLag: number;
  processBacklog: number;
  deliverOutflow: number;
}

interface HealthStatus {
  type: "critical" | "idle" | "balanced";
  message: string;
}

const MAX_PARTICLES = 50;
const PARTICLES_PER_STAGE = 8;
const PACKETS_PER_CONNECTION = 3;
const STAGES = 4;

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const boxesRef = useRef<BoxNode[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [sliders, setSliders] = useState<SliderState>({
    trafficLoad: 50,
    processingEfficiency: 39,
    deliverySpeed: 50,
  });
  const [metrics, setMetrics] = useState<Metrics>({
    ingestLag: 0,
    processBacklog: 0,
    deliverOutflow: 0,
  });
  const [health, setHealth] = useState<HealthStatus>({ type: "balanced", message: "" });
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);
  const initializedRef = useRef(false);

  // Memoized metric computation - pure function, no side effects
  const computeMetrics = useCallback((s: SliderState): Metrics => {
    const trafficLoad = s.trafficLoad / 100;
    const processBacklog = Math.max(0, Math.floor((s.trafficLoad - s.processingEfficiency) * 0.5));
    const deliverOutflow = Math.max(0, parseFloat(((s.deliverySpeed * 0.6) - (processBacklog * 0.8)).toFixed(1)));
    
    return {
      ingestLag: parseFloat(((trafficLoad * 0.2) + 0.4).toFixed(1)),
      processBacklog,
      deliverOutflow,
    };
  }, []);

  // Memoized health computation - pure function
  const computeHealth = useCallback((s: SliderState, backlog: number): HealthStatus => {
    if (s.processingEfficiency < 40 || backlog > 5) {
      return {
        type: "critical",
        message: "CRITICAL BOTTLENECK DETECTED: Low Processing Efficiency is creating an active database backlog pileup!",
      };
    } else if (s.trafficLoad < 25 && backlog === 0) {
      return {
        type: "idle",
        message: "System is currently idle. Increase Traffic Load to test ingestion data parsing streams.",
      };
    } else {
      return {
        type: "balanced",
        message: "System flow is balanced perfectly. Tweak parameters to stress test systemic failure thresholds.",
      };
    }
  }, []);

  // Update metrics and health whenever sliders change
  useEffect(() => {
    const newMetrics = computeMetrics(sliders);
    setMetrics(newMetrics);
    setHealth(computeHealth(sliders, newMetrics.processBacklog));
  }, [sliders, computeMetrics, computeHealth]);

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
      if (!initializedRef.current) {
        initScene();
        initializedRef.current = true;
      }
    };

    const initScene = () => {
      const w = widthRef.current;
      const h = heightRef.current;
      particlesRef.current = [];
      boxesRef.current = [];

      const stageX = [w * 0.11, w * 0.33, w * 0.55, w * 0.77];
      const stageY = h * 0.5;

      // Create 3D boxes for each stage
      for (let s = 0; s < STAGES; s++) {
        const colorObj = STAGE_COLORS[STAGE_NAMES[s]];
        const boxW = s === 3 ? 130 : 90;
        const boxH = s === 3 ? 65 : 45;
        const depth = boxW * 0.35;

        boxesRef.current.push({
          x: stageX[s],
          y: stageY,
          z: 0,
          width: boxW,
          height: boxH,
          depth,
          color: colorObj.main,
          opacity: 0.9,
          stage: s,
          pulse: Math.random() * Math.PI * 2,
        });

        boxesRef.current.push({
          x: stageX[s] + boxW * 0.1,
          y: stageY - boxH * 0.25,
          z: depth * 0.5,
          width: depth * 0.8,
          height: boxH * 0.6,
          depth,
          color: colorObj.second,
          opacity: 0.6,
          stage: s,
          pulse: Math.random() * Math.PI * 2,
        });

        boxesRef.current.push({
          x: stageX[s] - boxW * 0.05,
          y: stageY - boxH * 0.35,
          z: -depth * 0.3,
          width: boxW * 0.7,
          height: depth * 0.5,
          depth,
          color: colorObj.main,
          opacity: 0.3,
          stage: s,
          pulse: Math.random() * Math.PI * 2,
        });

        boxesRef.current.push({
          x: stageX[s] - depth * 0.15,
          y: stageY - boxH * 0.15,
          z: depth * 0.2,
          width: depth * 0.4,
          height: boxH * 0.5,
          depth,
          color: colorObj.main,
          opacity: 0.4,
          stage: s,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      // Create orbit particles - CAP at MAX_PARTICLES
      for (let s = 0; s < STAGES; s++) {
        const colorObj = STAGE_COLORS[STAGE_NAMES[s]];
        for (let i = 0; i < PARTICLES_PER_STAGE; i++) {
          if (particlesRef.current.length >= MAX_PARTICLES) break;
          const angle = (Math.PI * 2 * i) / PARTICLES_PER_STAGE;
          const r = 35 + Math.random() * 20;
          
          particlesRef.current.push({
            x: stageX[s] + Math.cos(angle) * r,
            y: stageY + Math.sin(angle) * r * 0.6,
            z: Math.random() * 50 - 25,
            vx: 0,
            vy: 0,
            radius: 2 + Math.random() * 2,
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

      // Flowing packets between stages - CAP at MAX_PARTICLES
      for (let s = 0; s < STAGES - 1; s++) {
        const startColor = STAGE_COLORS[STAGE_NAMES[s]];
        for (let i = 0; i < PACKETS_PER_CONNECTION; i++) {
          if (particlesRef.current.length >= MAX_PARTICLES) break;
          const progress = i / PACKETS_PER_CONNECTION;
          particlesRef.current.push({
            x: stageX[s] + (stageX[s + 1] - stageX[s]) * progress,
            y: stageY + (Math.random() - 0.5) * 12,
            z: 0,
            vx: 0.3 + s * 0.05,
            vy: 0,
            radius: 2.5,
            opacity: 0.7,
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

    const drawIsometricBox = (
      ctx: CanvasRenderingContext2D,
      box: BoxNode,
      colorObj: { main: string; second: string; glow: string }
    ) => {
      const { x, y, width, height, depth, opacity } = box;
      
      ctx.save();
      ctx.globalAlpha = opacity;
      
      // Left face
      const leftGrad = ctx.createLinearGradient(
        x - depth * 0.3, y - height / 2,
        x, y + height / 2
      );
      leftGrad.addColorStop(0, `${colorObj.main}30`);
      leftGrad.addColorStop(1, `${colorObj.main}15`);
      ctx.fillStyle = leftGrad;
      ctx.beginPath();
      ctx.moveTo(x - depth * 0.3, y - height / 2);
      ctx.lineTo(x, y - height / 2 - depth * 0.2);
      ctx.lineTo(x, y + height / 2 - depth * 0.2);
      ctx.lineTo(x - depth * 0.3, y + height / 2);
      ctx.closePath();
      ctx.fill();

      // Top face
      const topGrad = ctx.createLinearGradient(
        x - depth * 0.2, y - height / 2 - depth * 0.25,
        x + width, y - height / 2 + depth * 0.1
      );
      topGrad.addColorStop(0, `${colorObj.main}80`);
      topGrad.addColorStop(0.5, `${colorObj.main}50`);
      topGrad.addColorStop(1, `${colorObj.main}30`);
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.moveTo(x - depth * 0.2, y - height / 2 - depth * 0.25);
      ctx.lineTo(x + width + depth * 0.2, y - height / 2 - depth * 0.25);
      ctx.lineTo(x + width, y - height / 2);
      ctx.lineTo(x, y - height / 2);
      ctx.closePath();
      ctx.fill();

      // Right face
      const rightGrad = ctx.createLinearGradient(
        x + width, y - height / 2,
        x + width + depth * 0.3, y + height / 2 - depth * 0.2
      );
      rightGrad.addColorStop(0, `${colorObj.second}70`);
      rightGrad.addColorStop(1, `${colorObj.second}30`);
      ctx.fillStyle = rightGrad;
      ctx.beginPath();
      ctx.moveTo(x + width, y - height / 2);
      ctx.lineTo(x + width + depth * 0.3, y - height / 2 - depth * 0.2);
      ctx.lineTo(x + width + depth * 0.3, y + height / 2 - depth * 0.2);
      ctx.lineTo(x + width, y + height / 2);
      ctx.closePath();
      ctx.fill();

      // Front face
      const frontGrad = ctx.createLinearGradient(
        x, y - height / 2,
        x + width, y + height / 2
      );
      frontGrad.addColorStop(0, `${colorObj.main}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      frontGrad.addColorStop(0.3, `${colorObj.main}${Math.floor(opacity * 180).toString(16).padStart(2, '0')}`);
      frontGrad.addColorStop(0.7, `${colorObj.main}${Math.floor(opacity * 120).toString(16).padStart(2, '0')}`);
      frontGrad.addColorStop(1, `${colorObj.main}${Math.floor(opacity * 60).toString(16).padStart(2, '0')}`);
      ctx.fillStyle = frontGrad;
      ctx.beginPath();
      ctx.moveTo(x, y - height / 2);
      ctx.lineTo(x + width, y - height / 2);
      ctx.lineTo(x + width, y + height / 2);
      ctx.lineTo(x, y + height / 2);
      ctx.closePath();
      ctx.fill();

      // Glowing border
      const pulseScale = 1 + Math.sin(timeRef.current * 2 + box.stage) * 0.03;
      ctx.strokeStyle = `${colorObj.glow}${Math.floor(opacity * 220).toString(16).padStart(2, '0')})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = colorObj.main;
      ctx.shadowBlur = 15 * pulseScale;
      ctx.beginPath();
      ctx.moveTo(x, y - height / 2);
      ctx.lineTo(x + width, y - height / 2);
      ctx.lineTo(x + width, y + height / 2);
      ctx.lineTo(x, y + height / 2);
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Stage label
      ctx.font = "bold 12px 'Geist Mono', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(STAGE_NAMES[box.stage], x + width / 2, y + 4);
      ctx.shadowBlur = 0;

      const subLabels = {
        INGEST: "Raw Data Intake",
        PROCESS: "AI Processing",
        PERSIST: "Storage & Sync",
        DELIVER: "Automated Output",
      };
      ctx.font = "500 8px 'Geist', sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText(subLabels[STAGE_NAMES[box.stage]], x + width / 2, y + 18);
      
      ctx.restore();
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const stageX = [w * 0.11, w * 0.33, w * 0.55, w * 0.77];
      const stageY = h * 0.5;
      
      for (let i = 0; i < stageX.length - 1; i++) {
        const colorObj = STAGE_COLORS[STAGE_NAMES[i]];
        const nextColorObj = STAGE_COLORS[STAGE_NAMES[i + 1]];
        
        const grad = ctx.createLinearGradient(stageX[i], stageY, stageX[i + 1], stageY);
        grad.addColorStop(0, `${colorObj.glow}0.3)`);
        grad.addColorStop(0.5, `${colorObj.glow}0.5)`);
        grad.addColorStop(1, `${nextColorObj.glow}0.3)`);
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 8]);
        ctx.lineDashOffset = -timeRef.current * 25;
        ctx.shadowColor = colorObj.main;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(stageX[i], stageY);
        ctx.bezierCurveTo(
          stageX[i] + (stageX[i + 1] - stageX[i]) * 0.33, stageY - 20,
          stageX[i] + (stageX[i + 1] - stageX[i]) * 0.66, stageY - 20,
          stageX[i + 1], stageY
        );
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
      }
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;
      
      const w = widthRef.current;
      const h = heightRef.current;
      
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);
      
      // Grid background
      ctx.strokeStyle = "rgba(220, 38, 38, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 60;
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
      
      drawConnections(ctx, w, h);
      
      const sortedBoxes = [...boxesRef.current].sort((a, b) => a.z - b.z);
      
      sortedBoxes.forEach((box) => {
        const colorObj = STAGE_COLORS[STAGE_NAMES[box.stage]];
        box.pulse += 0.015;
        const pulseScale = 1 + Math.sin(box.pulse) * 0.04;
        
        drawIsometricBox(ctx, {
          ...box,
          width: box.width * pulseScale,
          height: box.height * pulseScale,
          depth: box.depth * pulseScale,
        }, colorObj);
      });
      
      // Update particles - SPEED BOUND TO SLIDERS
      const newParticles: Particle[] = [];
      const trafficMultiplier = sliders.trafficLoad / 50;
      const deliveryMultiplier = sliders.deliverySpeed / 50;
      const effMultiplier = Math.max(0.3, sliders.processingEfficiency / 50);
      
      particlesRef.current.forEach((p) => {
        if (p.type === "orbit") {
          const stageX = [w * 0.11, w * 0.33, w * 0.55, w * 0.77][p.stage];
          const stageY = h * 0.5;
          const angle = timeRef.current * (0.4 + p.stage * 0.08) * trafficMultiplier + p.life * 0.04;
          const r = 40 + Math.sin(timeRef.current * 0.4 + p.life * 0.08) * 8;
          
          p.x = stageX + Math.cos(angle) * r;
          p.y = stageY + Math.sin(angle) * r * 0.5;
          p.z = Math.sin(timeRef.current + p.life * 0.04) * 20;
          
          p.opacity = 0.3 + 0.5 * Math.abs(Math.sin(timeRef.current * 1.5 + p.life * 0.08));
          
          newParticles.push(p);
        }
        else if (p.type === "packet") {
          // Speed scales with Traffic Load AND Delivery Speed
          const speedMultiplier = (trafficMultiplier + deliveryMultiplier) / 2;
          p.x += p.vx * speedMultiplier;
          
          if (p.x > p.targetX + 30) {
            p.x = [w * 0.11, w * 0.33, w * 0.55][p.stage] - 30;
            p.life = 0;
          }
          
          p.y = p.targetY + Math.sin(timeRef.current * 2.5 + p.life * 0.1) * 4;
          
          p.opacity = 0.4 + 0.5 * Math.abs(Math.sin(timeRef.current * 3 + p.life * 0.1)) * effMultiplier;
          
          newParticles.push(p);
        }
      });
      
      particlesRef.current = newParticles;
      
      // Draw particles
      newParticles.forEach((p) => {
        const r = p.radius;
        
        if (p.type === "packet") {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6);
          grad.addColorStop(0, `${p.color}${Math.floor(p.opacity * 180).toString(16).padStart(2, '0')}`);
          grad.addColorStop(1, `${p.color}00`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        
        const coreGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        coreGrad.addColorStop(0, `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`);
        coreGrad.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
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
  }, [sliders.trafficLoad, sliders.processingEfficiency, sliders.deliverySpeed]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTrafficLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(10, Math.min(100, parseInt(e.target.value) || 50));
    setSliders(prev => ({ ...prev, trafficLoad: val }));
  };

  const handleProcessingEfficiency = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(10, Math.min(100, parseInt(e.target.value) || 39));
    setSliders(prev => ({ ...prev, processingEfficiency: val }));
  };

  const handleDeliverySpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(10, Math.min(100, parseInt(e.target.value) || 50));
    setSliders(prev => ({ ...prev, deliverySpeed: val }));
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col pt-20 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background opacity-70" />
        <div className="absolute top-1/5 left-1/10 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/5 right-1/8 w-[450px] h-[450px] bg-amber-600/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col flex-1">
        <div className="text-center mb-8" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-red-500/20 mb-6">
            <span className="w-2 h-2 bg-red-400 rounded-full" aria-hidden="true" />
            <span className="text-sm font-medium text-red-400">Solving daily business operations</span>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' 
        }}>
          <div className="glass rounded-2xl p-5 lg:p-6 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-20" style={{ background: "#dc2626" }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-medium text-red-400 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" aria-hidden="true" />
                INGEST LAG
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white font-mono">{metrics.ingestLag.toFixed(1)}</div>
              <div className="text-xs text-muted mt-1">milliseconds</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 lg:p-6 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-20" style={{ background: "#f97316" }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-medium text-orange-400 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" aria-hidden="true" />
                PROCESS BACKLOG
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white font-mono">{metrics.processBacklog}</div>
              <div className="text-xs text-muted mt-1">units queued</div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 lg:p-6 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-20" style={{ background: "#f59e0b" }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400 uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" aria-hidden="true" />
                DELIVER OUTFLOW
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white font-mono">{metrics.deliverOutflow.toFixed(1)}</div>
              <div className="text-xs text-muted mt-1">req/s</div>
            </div>
          </div>
        </div>

        <div className="relative flex-1 min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] mb-8" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' 
        }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full glass rounded-2xl border-red-500/10"
            aria-label="4-stage GTM data automation pipeline: INGEST → PROCESS → PERSIST → DELIVER"
            role="img"
          />
        </div>

        <div className="glass rounded-2xl p-6 lg:p-8 border border-white/10 mb-8" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' 
        }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-white">Pipeline Control Dashboard</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400">LIVE</span>
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400">REACTIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="traffic-load" className="flex items-center gap-2 text-sm font-medium text-white">
                  <span className="w-2 h-2 bg-red-400 rounded-full" aria-hidden="true" />
                  Traffic Load
                </label>
                <span className="text-lg font-mono font-bold text-red-300 bg-red-500/10 px-3 py-1 rounded-lg">
                  {sliders.trafficLoad}%
                </span>
              </div>
              <div className="relative">
                <input
                  id="traffic-load"
                  type="range"
                  min="10"
                  max="100"
                  value={sliders.trafficLoad}
                  onChange={handleTrafficLoad}
                  className="w-full h-2 appearance-none bg-white/5 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-red-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                  style={{
                    background: `linear-gradient(90deg, #dc2626 ${sliders.trafficLoad}%, rgba(255,255,255,0.05) ${sliders.trafficLoad}%)`,
                  }}
                  aria-label="Traffic Load"
                />
                <div className="flex justify-between text-[10px] text-muted mt-2">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
              <p className="text-xs text-muted">Ingestion rate of raw lead data</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="processing-efficiency" className="flex items-center gap-2 text-sm font-medium text-white">
                  <span className="w-2 h-2 bg-orange-400 rounded-full" aria-hidden="true" />
                  Processing Efficiency
                </label>
                <span className="text-lg font-mono font-bold text-orange-300 bg-orange-500/10 px-3 py-1 rounded-lg">
                  {sliders.processingEfficiency}%
                </span>
              </div>
              <div className="relative">
                <input
                  id="processing-efficiency"
                  type="range"
                  min="10"
                  max="100"
                  value={sliders.processingEfficiency}
                  onChange={handleProcessingEfficiency}
                  className="w-full h-2 appearance-none bg-white/5 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                  style={{
                    background: `linear-gradient(90deg, #f97316 ${sliders.processingEfficiency}%, rgba(255,255,255,0.05) ${sliders.processingEfficiency}%)`,
                  }}
                  aria-label="Processing Efficiency"
                />
                <div className="flex justify-between text-[10px] text-muted mt-2">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
              <p className="text-xs text-muted">AI processing throughput capacity</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="delivery-speed" className="flex items-center gap-2 text-sm font-medium text-white">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" aria-hidden="true" />
                  Delivery Speed
                </label>
                <span className="text-lg font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg">
                  {sliders.deliverySpeed}%
                </span>
              </div>
              <div className="relative">
                <input
                  id="delivery-speed"
                  type="range"
                  min="10"
                  max="100"
                  value={sliders.deliverySpeed}
                  onChange={handleDeliverySpeed}
                  className="w-full h-2 appearance-none bg-white/5 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                  style={{
                    background: `linear-gradient(90deg, #f59e0b ${sliders.deliverySpeed}%, rgba(255,255,255,0.05) ${sliders.deliverySpeed}%)`,
                  }}
                  aria-label="Delivery Speed"
                />
                <div className="flex justify-between text-[10px] text-muted mt-2">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>
              <p className="text-xs text-muted">Automated outbound dispatch rate</p>
            </div>
          </div>
        </div>

        <div className={`relative glass rounded-2xl p-4 lg:p-6 border mb-8 overflow-hidden transition-all duration-500 ${
          health.type === "critical" ? "border-red-500/40 bg-red-500/5" :
          health.type === "idle" ? "border-slate-500/40 bg-slate-500/5" :
          "border-amber-500/40 bg-amber-500/5"
        }`} style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s' 
        }}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
              health.type === "critical" ? "bg-red-500/20 text-red-400 animate-pulse" :
              health.type === "idle" ? "bg-slate-500/20 text-slate-400" :
              "bg-amber-500/20 text-amber-400"
            }`} aria-hidden="true">
              {health.type === "critical" && "🚨"}
              {health.type === "idle" && "💤"}
              {health.type === "balanced" && "💡"}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm lg:text-base font-medium ${
                health.type === "critical" ? "text-red-300" :
                health.type === "idle" ? "text-slate-300" :
                "text-amber-300"
              }`}>{health.message}</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">
                  Traffic: {sliders.trafficLoad}%
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">
                  Efficiency: {sliders.processingEfficiency}%
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">
                  Speed: {sliders.deliverySpeed}%
                </span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">
                  Backlog: {metrics.processBacklog}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s' 
        }}>
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
            <svg className="w-4 h-4 text-red-400" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            <span>10 Working Systems</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-red-400" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            <span>10 GitHub Repositories</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-red-400" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            <span>10 Loom Walkthroughs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-red-400" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            <span>4 GTM Stages</span>
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