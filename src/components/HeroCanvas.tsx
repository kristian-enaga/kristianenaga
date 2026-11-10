"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

interface StreamNode {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  type: 'lead' | 'process' | 'data' | 'output' | 'flow';
  pulse: number;
}

interface Layer {
  id: string;
  label: string;
  y: number;
  color: string;
  streamCount: 3;
}

const LAYERS: Layer[] = [
  { id: "ingest", label: "INGEST", y: 0.18, color: "#06b6d4", streamCount: 3 },
  { id: "process", label: "PROCESS", y: 0.42, color: "#00ff87", streamCount: 3 },
  { id: "persist", label: "PERSIST", y: 0.66, color: "#8b5cf6", streamCount: 3 },
  { id: "deliver", label: "DELIVER", y: 0.90, color: "#f59e0b", streamCount: 3 },
];

const STREAM_X_OFFSETS = [0.22, 0.5, 0.78];

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<StreamNode[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
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
      dprRef.current = window.devicePixelRatio || 1;
      canvas.width = widthRef.current * dprRef.current;
      canvas.height = heightRef.current * dprRef.current;
      canvas.style.width = `${widthRef.current}px`;
      canvas.style.height = `${heightRef.current}px`;
      ctx.scale(dprRef.current, dprRef.current);
    };

    const initNodes = () => {
      const nodes: StreamNode[] = [];
      
      LAYERS.forEach((layer, layerIdx) => {
        STREAM_X_OFFSETS.forEach((streamOffset, streamIdx) => {
          const baseX = widthRef.current * streamOffset;
          const baseY = heightRef.current * layer.y;
          
          // Add multiple nodes per stream per layer
          const nodeCount = layerIdx === 0 ? 8 : layerIdx === 1 ? 6 : layerIdx === 2 ? 5 : 4;
          
          for (let i = 0; i < nodeCount; i++) {
            const angle = (Math.PI * 2 * i) / nodeCount;
            const radius = 30 + layerIdx * 15 + Math.random() * 20;
            
            nodes.push({
              x: baseX + Math.cos(angle) * radius,
              y: baseY + Math.sin(angle) * radius,
              targetX: baseX,
              targetY: baseY,
              vx: 0,
              vy: 0,
              radius: 3 + layerIdx * 1.5 + Math.random() * 2,
              opacity: 0.3 + Math.random() * 0.5,
              color: layer.color,
              type: layerIdx === 0 ? 'lead' : layerIdx === 1 ? 'process' : layerIdx === 2 ? 'data' : 'output',
              pulse: Math.random() * Math.PI * 2,
            });
          }
        });
      });
      
      // Add flowing particles between layers
      for (let streamIdx = 0; streamIdx < 3; streamIdx++) {
        for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
          const particleCount = 15;
          for (let i = 0; i < particleCount; i++) {
            const progress = i / particleCount;
            const startY = heightRef.current * LAYERS[layerIdx].y;
            const endY = heightRef.current * LAYERS[layerIdx + 1].y;
            const baseX = widthRef.current * STREAM_X_OFFSETS[streamIdx];
            
            nodes.push({
              x: baseX + (Math.random() - 0.5) * 40,
              y: startY + progress * (endY - startY),
              targetX: baseX,
              targetY: endY,
              vx: 0,
              vy: 1 + layerIdx * 0.5 + Math.random() * 0.5,
              radius: 1.5 + Math.random() * 1.5,
              opacity: 0.2 + Math.random() * 0.4,
              color: layerIdx === 2 ? "#f59e0b" : LAYERS[layerIdx + 1].color,
              type: 'flow',
              pulse: Math.random() * Math.PI * 2,
            });
          }
        }
      }
      
      nodesRef.current = nodes;
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gridSize = 60;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.03)";
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x <= w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      
      // Isometric grid lines (subtle)
      ctx.strokeStyle = "rgba(0, 255, 135, 0.02)";
      for (let i = -h; i < w + h; i += gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
      }
    };

    const drawLayerLabels = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      LAYERS.forEach((layer) => {
        const y = h * layer.y;
        
        // Layer background bar
        const grad = ctx.createLinearGradient(0, y - 40, 0, y + 40);
        grad.addColorStop(0, `${layer.color}08`);
        grad.addColorStop(0.5, `${layer.color}15`);
        grad.addColorStop(1, `${layer.color}08`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, y - 45, w, 90);
        
        // Divider lines
        ctx.strokeStyle = `${layer.color}20`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y - 45);
        ctx.lineTo(w, y - 45);
        ctx.moveTo(0, y + 45);
        ctx.lineTo(w, y + 45);
        ctx.stroke();
        
        // Label
        ctx.font = "600 11px 'Geist Mono', monospace";
        ctx.fillStyle = layer.color;
        ctx.textAlign = "left";
        ctx.fillText(layer.label, 40, y + 4);
        
        // Description
        const desc = layer.id === "ingest" ? "Chaotic Lead Intake Funnels" :
                     layer.id === "process" ? "AI Processing Nodes" :
                     layer.id === "persist" ? "Structured CRM Persistence" :
                     "Automated Outbound Delivery";
        ctx.font = "400 10px 'Geist', sans-serif";
        ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
        ctx.fillText(desc, 40, y + 20);
        
        // Stream indicators
        STREAM_X_OFFSETS.forEach((offset, i) => {
          const x = w * offset;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = `${layer.color}40`;
          ctx.fill();
          
          // Pulse ring
          const pulseRadius = 6 + Math.sin(timeRef.current * 3 + i) * 3;
          ctx.beginPath();
          ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `${layer.color}30`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Draw stream paths between layers
      STREAM_X_OFFSETS.forEach((offset, streamIdx) => {
        const x = w * offset;
        
        // Main vertical line
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        LAYERS.forEach((layer, idx) => {
          grad.addColorStop(idx / 3, `${layer.color}15`);
        });
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = -timeRef.current * 50;
        ctx.beginPath();
        ctx.moveTo(x, h * LAYERS[0].y);
        ctx.lineTo(x, h * LAYERS[3].y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Cross connections between streams (subtle)
        if (streamIdx < 2) {
          const nextX = w * STREAM_X_OFFSETS[streamIdx + 1];
          ctx.strokeStyle = "rgba(0, 255, 135, 0.05)";
          ctx.lineWidth = 1;
          LAYERS.forEach((layer) => {
            const y = h * layer.y;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nextX, y);
            ctx.stroke();
          });
        }
      });
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;
      
      const w = widthRef.current;
      const h = heightRef.current;
      
      ctx.clearRect(0, 0, w, h);
      
      // Background grid
      drawGrid(ctx, w, h);
      
      // Layer backgrounds and labels
      drawLayerLabels(ctx, w, h);
      
      // Connections
      drawConnections(ctx, w, h);
      
      // Update and draw nodes
      nodesRef.current.forEach((node) => {
        // Spring physics to target
        const dx = node.targetX - node.x;
        const dy = node.targetY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (node.type === 'flow') {
          // Flowing particles move downward
          node.y += node.vy;
          node.x += (Math.random() - 0.5) * 0.5;
          
          // Reset when past deliver layer
          if (node.y > h * LAYERS[3].y + 50) {
            node.y = h * LAYERS[0].y - 50;
            node.x = node.targetX + (Math.random() - 0.5) * 40;
            node.opacity = 0.2 + Math.random() * 0.4;
          }
        } else {
          // Orbiting nodes
          const layerIdx = LAYERS.findIndex(l => l.color === node.color);
          const streamIdx = STREAM_X_OFFSETS.findIndex(o => Math.abs(node.targetX - w * o) < 50);
          const angle = timeRef.current * (0.5 + layerIdx * 0.15) + (streamIdx * Math.PI * 2 / 3) + node.pulse;
          const orbitRadius = 40 + layerIdx * 20 + Math.sin(timeRef.current * 0.5 + node.pulse) * 15;
          
          node.targetX = w * STREAM_X_OFFSETS[streamIdx] + Math.cos(angle) * orbitRadius;
          node.targetY = h * LAYERS[layerIdx].y + Math.sin(angle) * orbitRadius * 0.5;
          
          // Spring to target
          node.vx += dx * 0.02;
          node.vy += dy * 0.02;
          node.vx *= 0.92;
          node.vy *= 0.92;
          node.x += node.vx;
          node.y += node.vy;
        }
        
        // Mouse influence
        const mdx = node.x - mousePos.x;
        const mdy = node.y - mousePos.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 200 && mdist > 0) {
          const force = (200 - mdist) / 200 * 0.8;
          node.vx += (mdx / mdist) * force;
          node.vy += (mdy / mdist) * force;
        }
        
        // Pulse animation
        node.pulse += 0.02;
        const pulseScale = 1 + Math.sin(node.pulse * 2) * 0.15;
        
        // Draw node
        const drawRadius = node.radius * pulseScale;
        
        // Glow effect for process and deliver layers
        if (node.type === 'process' || node.type === 'output') {
          const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, drawRadius * 4);
          glowGrad.addColorStop(0, `${node.color}${Math.floor(node.opacity * 100).toString(16).padStart(2, '0')}`);
          glowGrad.addColorStop(1, `${node.color}00`);
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(node.x, node.y, drawRadius * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Core
        const coreGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, drawRadius);
        coreGrad.addColorStop(0, `${node.color}${Math.floor(node.opacity * 255).toString(16).padStart(2, '0')}`);
        coreGrad.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner highlight
        ctx.fillStyle = `${node.color}${Math.floor(node.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, drawRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw stream labels at bottom
      ctx.font = "500 10px 'Geist Mono', monospace";
      ctx.textAlign = "center";
      STREAM_X_OFFSETS.forEach((offset, i) => {
        const x = w * offset;
        const labels = ["Stream A", "Stream B", "Stream C"];
        ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
        ctx.fillText(labels[i], x, h - 20);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    initNodes();
    animate();

    const handleResize = () => {
      const prevW = widthRef.current;
      const prevH = heightRef.current;
      resize();
      if (prevW !== widthRef.current || prevH !== heightRef.current) {
        nodesRef.current.forEach(node => {
          node.x = (node.x / prevW) * widthRef.current;
          node.y = (node.y / prevH) * heightRef.current;
          node.targetX = (node.targetX / prevW) * widthRef.current;
          node.targetY = (node.targetY / prevH) * heightRef.current;
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) * dprRef.current,
        y: (e.clientY - rect.top) * dprRef.current,
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

        <div className="relative mt-12 h-[400px] sm:h-[480px] lg:h-[520px]">
          <canvas
            ref={canvasRef}
            className="w-full h-full glass rounded-2xl border-mint/10"
            aria-label="3D isometric GTM data automation pipeline with 3 parallel streams across 4 layers: Ingest → Process → Persist → Deliver"
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