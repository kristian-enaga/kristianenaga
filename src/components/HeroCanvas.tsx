"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import SparkTrail from "./SparkTrail";

const STAGE_NAMES = ["INGEST", "PROCESS", "PERSIST", "DELIVER"] as const;
const STAGE_SUBLABELS = {
  INGEST: "Raw Data Intake",
  PROCESS: "AI Processing",
  PERSIST: "Storage & Sync",
  DELIVER: "Automated Output",
};

const CRIMSON = "#dc2626";
const CRIMSON_LIGHT = "#ef4444";
const CRIMSON_GLOW = "rgba(220, 38, 38,";
const NEON_RED = "#ff1a1a";
const NEON_ORANGE = "#ff6b00";
const NEON_PINK = "#ff006e";
const NEON_GOLD = "#ffd700";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  type: string;
  stage: number;
  targetX: number;
  targetY: number;
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
  hover: boolean;
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

interface Viewport3D {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  fov: number;
  isMobile: boolean;
  layout: "horizontal" | "vertical";
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
  const mouseRef = useRef({ x: -1000, y: -1000, isOverCanvas: false });
  const hoveredBoxRef = useRef<number | null>(null);
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
  const [viewport3D, setViewport3D] = useState<Viewport3D>({
    cameraX: 0,
    cameraY: 0,
    cameraZ: 600,
    fov: 45,
    isMobile: false,
    layout: "horizontal",
  });
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);
  const initializedRef = useRef(false);

  // Memoized metric computation
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

  // Memoized health computation
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

  // Responsive viewport handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    
    const w = rect.width;
    const h = rect.height;
    const isMobile = window.innerWidth < 768;
    
    widthRef.current = w;
    heightRef.current = h;
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dprRef.current;
    canvas.height = h * dprRef.current;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // Update 3D viewport for mobile/desktop
    setViewport3D(prev => {
      if (isMobile) {
        return {
          ...prev,
          isMobile: true,
          layout: "vertical",
          fov: 35,
          cameraZ: 800,
        };
      } else {
        return {
          ...prev,
          isMobile: false,
          layout: "horizontal",
          fov: 45,
          cameraZ: 600,
        };
      }
    });

    if (!initializedRef.current) {
      initScene(w, h, isMobile);
      initializedRef.current = true;
    }
  }, []);

  const initScene = (w: number, h: number, isMobile: boolean) => {
    particlesRef.current = [];
    boxesRef.current = [];

    // Calculate positions based on layout
    let stagePositions: { x: number; y: number; z: number }[] = [];
    const boxW = isMobile ? 110 : 130;
    const boxH = isMobile ? 55 : 65;
    const depth = boxW * 0.35;

    if (isMobile) {
      // Vertical stack - centered horizontally
      const centerX = w * 0.5;
      const startY = h * 0.15;
      const spacing = h * 0.2;
      for (let s = 0; s < STAGES; s++) {
        stagePositions.push({
          x: centerX,
          y: startY + s * spacing,
          z: 0,
        });
      }
    } else {
      // Horizontal row
      const stageX = [w * 0.11, w * 0.33, w * 0.55, w * 0.77];
      const stageY = h * 0.5;
      for (let s = 0; s < STAGES; s++) {
        stagePositions.push({
          x: stageX[s],
          y: stageY,
          z: 0,
        });
      }
    }

    // Create 3D boxes for each stage - ALL CRIMSON RED
    for (let s = 0; s < STAGES; s++) {
      const pos = stagePositions[s];
      
      // Front face (main box)
      boxesRef.current.push({
        x: pos.x,
        y: pos.y,
        z: pos.z,
        width: boxW,
        height: boxH,
        depth,
        color: CRIMSON,
        opacity: 0.95,
        stage: s,
        pulse: Math.random() * Math.PI * 2,
        hover: false,
      });

      // Right side face (3D depth)
      boxesRef.current.push({
        x: pos.x + boxW * 0.1,
        y: pos.y - boxH * 0.25,
        z: depth * 0.5,
        width: depth * 0.8,
        height: boxH * 0.6,
        depth,
        color: CRIMSON_LIGHT,
        opacity: 0.7,
        stage: s,
        pulse: Math.random() * Math.PI * 2,
        hover: false,
      });

      // Top face (3D depth)
      boxesRef.current.push({
        x: pos.x - boxW * 0.05,
        y: pos.y - boxH * 0.35,
        z: -depth * 0.3,
        width: boxW * 0.7,
        height: depth * 0.5,
        depth,
        color: CRIMSON,
        opacity: 0.4,
        stage: s,
        pulse: Math.random() * Math.PI * 2,
        hover: false,
      });

      // Left side accent
      boxesRef.current.push({
        x: pos.x - depth * 0.15,
        y: pos.y - boxH * 0.15,
        z: depth * 0.2,
        width: depth * 0.4,
        height: boxH * 0.5,
        depth,
        color: CRIMSON,
        opacity: 0.5,
        stage: s,
        pulse: Math.random() * Math.PI * 2,
        hover: false,
      });
    }

    // Create orbit particles
    for (let s = 0; s < STAGES; s++) {
      const pos = stagePositions[s];
      for (let i = 0; i < PARTICLES_PER_STAGE; i++) {
        if (particlesRef.current.length >= MAX_PARTICLES) break;
        const angle = (Math.PI * 2 * i) / PARTICLES_PER_STAGE;
        const r = 45 + Math.random() * 25;
        
        particlesRef.current.push({
          x: pos.x + Math.cos(angle) * r,
          y: pos.y + Math.sin(angle) * r * 0.6,
          z: Math.random() * 60 - 30,
          vx: 0,
          vy: 0,
          radius: 2.5 + Math.random() * 2,
          opacity: 0.5 + Math.random() * 0.4,
          color: CRIMSON,
          type: "orbit",
          stage: s,
          targetX: pos.x,
          targetY: pos.y,
          life: 0,
          maxLife: 9999,
        });
      }
    }

    // Flowing packets between stages
    for (let s = 0; s < STAGES - 1; s++) {
      const startPos = stagePositions[s];
      const endPos = stagePositions[s + 1];
      for (let i = 0; i < PACKETS_PER_CONNECTION; i++) {
        if (particlesRef.current.length >= MAX_PARTICLES) break;
        const progress = i / PACKETS_PER_CONNECTION;
        particlesRef.current.push({
          x: startPos.x + (endPos.x - startPos.x) * progress,
          y: startPos.y + (endPos.y - startPos.y) * progress,
          z: 0,
          vx: 0,
          vy: 0,
          radius: 3,
          opacity: 0.8,
          color: CRIMSON,
          type: "packet",
          stage: s,
          targetX: endPos.x,
          targetY: endPos.y,
          life: 0,
          maxLife: 9999,
        });
      }
    }
  };

  // 3D projection helper
  const project3D = (x: number, y: number, z: number, vp: Viewport3D, w: number, h: number) => {
    const scale = vp.fov / (vp.fov + z);
    const screenX = w * 0.5 + (x - w * 0.5) * scale;
    const screenY = h * 0.5 + (y - h * 0.5) * scale;
    return { x: screenX, y: screenY, scale };
  };

  // Check if mouse is over a box (2D screen space)
  const checkBoxHover = (box: BoxNode, mx: number, my: number, vp: Viewport3D, w: number, h: number) => {
    const proj = project3D(box.x, box.y, box.z, vp, w, h);
    const halfW = (box.width * proj.scale) / 2;
    const halfH = (box.height * proj.scale) / 2;
    return mx >= proj.x - halfW && mx <= proj.x + halfW && my >= proj.y - halfH && my <= proj.y + halfH;
  };

  const drawIsometricBox = (
    ctx: CanvasRenderingContext2D,
    box: BoxNode,
    vp: Viewport3D,
    w: number,
    h: number
  ) => {
    const proj = project3D(box.x, box.y, box.z, vp, w, h);
    const { x, y, scale } = proj;
    const width = box.width * scale;
    const height = box.height * scale;
    const depth = box.depth * scale;
    const baseOpacity = box.opacity * scale;
    
    // Hover glow intensity
    const hoverIntensity = box.hover ? 1.5 : 1;
    const pulseGlow = Math.sin(timeRef.current * 3 + box.stage) * 0.15 + 0.85;
    
    ctx.save();
    ctx.globalAlpha = baseOpacity;
    
    // Left face
    const leftGrad = ctx.createLinearGradient(
      x - width/2 - depth * 0.3, y - height/2,
      x - width/2, y + height/2
    );
    leftGrad.addColorStop(0, `${CRIMSON}40`);
    leftGrad.addColorStop(1, `${CRIMSON}20`);
    ctx.fillStyle = leftGrad;
    ctx.beginPath();
    ctx.moveTo(x - width/2 - depth * 0.3, y - height/2);
    ctx.lineTo(x - width/2, y - height/2 - depth * 0.2);
    ctx.lineTo(x - width/2, y + height/2 - depth * 0.2);
    ctx.lineTo(x - width/2 - depth * 0.3, y + height/2);
    ctx.closePath();
    ctx.fill();

    // Top face
    const topGrad = ctx.createLinearGradient(
      x - width/2 - depth * 0.2, y - height/2 - depth * 0.25,
      x + width/2, y - height/2 + depth * 0.1
    );
    topGrad.addColorStop(0, `${CRIMSON}90`);
    topGrad.addColorStop(0.5, `${CRIMSON}60`);
    topGrad.addColorStop(1, `${CRIMSON}40`);
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.moveTo(x - width/2 - depth * 0.2, y - height/2 - depth * 0.25);
    ctx.lineTo(x + width/2 + depth * 0.2, y - height/2 - depth * 0.25);
    ctx.lineTo(x + width/2, y - height/2);
    ctx.lineTo(x - width/2, y - height/2);
    ctx.closePath();
    ctx.fill();

    // Right face
    const rightGrad = ctx.createLinearGradient(
      x + width/2, y - height/2,
      x + width/2 + depth * 0.3, y + height/2 - depth * 0.2
    );
    rightGrad.addColorStop(0, `${CRIMSON_LIGHT}80`);
    rightGrad.addColorStop(1, `${CRIMSON_LIGHT}40`);
    ctx.fillStyle = rightGrad;
    ctx.beginPath();
    ctx.moveTo(x + width/2, y - height/2);
    ctx.lineTo(x + width/2 + depth * 0.3, y - height/2 - depth * 0.2);
    ctx.lineTo(x + width/2 + depth * 0.3, y + height/2 - depth * 0.2);
    ctx.lineTo(x + width/2, y + height/2);
    ctx.closePath();
    ctx.fill();

    // Front face - main visible face
    const frontGrad = ctx.createLinearGradient(
      x - width/2, y - height/2,
      x + width/2, y + height/2
    );
    frontGrad.addColorStop(0, `${CRIMSON}${Math.floor(baseOpacity * 255 * hoverIntensity).toString(16).padStart(2, '0')}`);
    frontGrad.addColorStop(0.3, `${CRIMSON}${Math.floor(baseOpacity * 200 * hoverIntensity).toString(16).padStart(2, '0')}`);
    frontGrad.addColorStop(0.7, `${CRIMSON}${Math.floor(baseOpacity * 140 * hoverIntensity).toString(16).padStart(2, '0')}`);
    frontGrad.addColorStop(1, `${CRIMSON}${Math.floor(baseOpacity * 80 * hoverIntensity).toString(16).padStart(2, '0')}`);
    ctx.fillStyle = frontGrad;
    ctx.beginPath();
    ctx.moveTo(x - width/2, y - height/2);
    ctx.lineTo(x + width/2, y - height/2);
    ctx.lineTo(x + width/2, y + height/2);
    ctx.lineTo(x - width/2, y + height/2);
    ctx.closePath();
    ctx.fill();

    // NEON RED GLOW on hover
    if (box.hover) {
      ctx.shadowColor = NEON_RED;
      ctx.shadowBlur = 40 * pulseGlow * hoverIntensity;
      ctx.strokeStyle = `${NEON_RED}${Math.floor(255 * pulseGlow).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - width/2, y - height/2);
      ctx.lineTo(x + width/2, y - height/2);
      ctx.lineTo(x + width/2, y + height/2);
      ctx.lineTo(x - width/2, y + height/2);
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Additional outer glow ring
      ctx.shadowColor = NEON_ORANGE;
      ctx.shadowBlur = 60 * pulseGlow;
      ctx.strokeStyle = `${NEON_ORANGE}${Math.floor(180 * pulseGlow).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - width/2 - 5, y - height/2 - 5);
      ctx.lineTo(x + width/2 + 5, y - height/2 - 5);
      ctx.lineTo(x + width/2 + 5, y + height/2 + 5);
      ctx.lineTo(x - width/2 - 5, y + height/2 + 5);
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      // Subtle resting glow
      ctx.shadowColor = CRIMSON;
      ctx.shadowBlur = 15 * pulseGlow;
      ctx.strokeStyle = `${CRIMSON_GLOW}${Math.floor(baseOpacity * 200 * pulseGlow).toString(16).padStart(2, '0')})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - width/2, y - height/2);
      ctx.lineTo(x + width/2, y - height/2);
      ctx.lineTo(x + width/2, y + height/2);
      ctx.lineTo(x - width/2, y + height/2);
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Stage label on front face
    ctx.font = `bold ${Math.max(10, 12 * scale)}px 'Geist Mono', monospace`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText(STAGE_NAMES[box.stage], x, y + 4 * scale);
    ctx.shadowBlur = 0;

    // Sub-label
    ctx.font = `500 ${Math.max(7, 8 * scale)}px 'Geist', sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(STAGE_SUBLABELS[STAGE_NAMES[box.stage]], x, y + 18 * scale);
    
    ctx.restore();
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, vp: Viewport3D, w: number, h: number, stagePositions: { x: number; y: number }[]) => {
    for (let i = 0; i < stagePositions.length - 1; i++) {
      const start = project3D(stagePositions[i].x, stagePositions[i].y, 0, vp, w, h);
      const end = project3D(stagePositions[i + 1].x, stagePositions[i + 1].y, 0, vp, w, h);
      
      const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      grad.addColorStop(0, `${CRIMSON_GLOW}0.4)`);
      grad.addColorStop(0.5, `${CRIMSON_GLOW}0.6)`);
      grad.addColorStop(1, `${CRIMSON_GLOW}0.4)`);
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      ctx.setLineDash([20, 12]);
      ctx.lineDashOffset = -timeRef.current * 30;
      ctx.shadowColor = CRIMSON;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      
      // Curved connection
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2 - 30;
      ctx.quadraticCurveTo(midX, midY, end.x, end.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    }
  };

  const animate = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    timeRef.current += 0.016;
    
    const w = widthRef.current;
    const h = heightRef.current;
    const vp = viewport3D;
    const isMobile = vp.isMobile;
    
    // Recalculate stage positions for current viewport
    const boxW = isMobile ? 110 : 130;
    const boxH = isMobile ? 55 : 65;
    const stagePositions: { x: number; y: number }[] = [];
    
    if (isMobile) {
      const centerX = w * 0.5;
      const startY = h * 0.15;
      const spacing = h * 0.2;
      for (let s = 0; s < STAGES; s++) {
        stagePositions.push({ x: centerX, y: startY + s * spacing });
      }
    } else {
      const stageX = [w * 0.11, w * 0.33, w * 0.55, w * 0.77];
      const stageY = h * 0.5;
      for (let s = 0; s < STAGES; s++) {
        stagePositions.push({ x: stageX[s], y: stageY });
      }
    }
    
    // Clear
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, w, h);
    
    // Subtle grid
    ctx.strokeStyle = "rgba(220, 38, 38, 0.03)";
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x <= w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    
    // Connections
    drawConnections(ctx, vp, w, h, stagePositions);
    
    // Sort boxes by depth for correct 3D rendering
    const sortedBoxes = [...boxesRef.current].sort((a, b) => a.z - b.z);
    
    // Check hover state for each box
    sortedBoxes.forEach((box) => {
      box.hover = checkBoxHover(box, mouseRef.current.x, mouseRef.current.y, vp, w, h);
    });
    
    // Draw all boxes
    sortedBoxes.forEach((box) => {
      box.pulse += 0.015;
      drawIsometricBox(ctx, box, vp, w, h);
    });
    
    // Update particles
    const newParticles: Particle[] = [];
    const trafficMultiplier = sliders.trafficLoad / 50;
    const deliveryMultiplier = sliders.deliverySpeed / 50;
    const effMultiplier = Math.max(0.3, sliders.processingEfficiency / 50);
    
    particlesRef.current.forEach((p) => {
      if (p.type === "orbit") {
        const pos = stagePositions[p.stage];
        const angle = timeRef.current * (0.4 + p.stage * 0.08) * trafficMultiplier + p.life * 0.04;
        const r = 50 + Math.sin(timeRef.current * 0.4 + p.life * 0.08) * 10;
        
        p.x = pos.x + Math.cos(angle) * r;
        p.y = pos.y + Math.sin(angle) * r * 0.6;
        p.z = Math.sin(timeRef.current + p.life * 0.04) * 30;
        
        p.opacity = 0.4 + 0.5 * Math.abs(Math.sin(timeRef.current * 1.5 + p.life * 0.08));
        
        newParticles.push(p);
      }
      else if (p.type === "packet") {
        const speedMultiplier = (trafficMultiplier + deliveryMultiplier) / 2;
        const startPos = stagePositions[p.stage];
        const endPos = stagePositions[p.stage + 1];
        const progress = (p.x - startPos.x) / (endPos.x - startPos.x) || 0;
        
        p.x += p.vx * speedMultiplier * 0.5;
        p.y = startPos.y + (endPos.y - startPos.y) * progress + Math.sin(timeRef.current * 3 + p.life * 0.1) * 5;
        
        if (p.x > endPos.x + 30) {
          p.x = startPos.x - 30;
          p.life = 0;
        }
        
        p.opacity = 0.5 + 0.5 * Math.abs(Math.sin(timeRef.current * 3 + p.life * 0.1)) * effMultiplier;
        
        newParticles.push(p);
      }
    });
    
    particlesRef.current = newParticles;
    
    // Draw particles
    newParticles.forEach((p) => {
      const proj = project3D(p.x, p.y, p.z, vp, w, h);
      const r = p.radius * proj.scale;
      
      if (p.type === "packet") {
        const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r * 8);
        grad.addColorStop(0, `${p.color}${Math.floor(p.opacity * 200).toString(16).padStart(2, '0')}`);
        grad.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const coreGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r);
      coreGrad.addColorStop(0, `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`);
      coreGrad.addColorStop(1, `${p.color}00`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    handleResize();
    initScene(widthRef.current, heightRef.current, viewport3D.isMobile);
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isOverCanvas: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isOverCanvas = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouseRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          isOverCanvas: true,
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isOverCanvas = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [viewport3D.isMobile, viewport3D.layout, sliders.trafficLoad, sliders.processingEfficiency, sliders.deliverySpeed]);

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
        {/* Spark Trail Layer */}
        <SparkTrail />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 flex flex-col flex-1">
        <div className="text-center mb-8" style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)', 
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-red-500/20 mb-6">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" aria-hidden="true" />
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
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" aria-hidden="true" />
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
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" aria-hidden="true" />
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
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
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
            className="w-full h-full glass rounded-2xl border-red-500/10 cursor-crosshair"
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
              <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 animate-pulse">LIVE</span>
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400">REACTIVE</span>
              <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">3D</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="traffic-load" className="flex items-center gap-2 text-sm font-medium text-white">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" aria-hidden="true" />
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
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" aria-hidden="true" />
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
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" aria-hidden="true" />
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