"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  type: 'chaos' | 'track' | 'core' | 'packet';
  life: number;
  maxLife: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitCenterX: number;
  orbitCenterY: number;
  trackIndex: number;
  progress: number;
}

interface TrackNode {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  pulse: number;
  type: 'process' | 'storage' | 'output';
}

const TRACK_COLORS = [
  { main: "#06b6d4", glow: "rgba(6, 182, 212, ", name: "INGEST" },
  { main: "#00ff87", glow: "rgba(0, 255, 135, ", name: "PROCESS" },
  { main: "#f59e0b", glow: "rgba(245, 158, 11, ", name: "DELIVER" },
];

const CHAOS_COLORS = [
  "#dc2626", "#ef4444", "#f97316", "#fbbf24", "#84cc16", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"
];

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const trackNodesRef = useRef<TrackNode[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);
  const corePulseRef = useRef(0);

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
      initScene();
    };

    const initScene = () => {
      const w = widthRef.current;
      const h = heightRef.current;
      
      // Clear existing
      particlesRef.current = [];
      trackNodesRef.current = [];

      // === CHAOTIC INTAKE PARTICLES (LEFT SIDE) ===
      for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 150;
        const cx = w * 0.15;
        const cy = h * 0.45;
        
        particlesRef.current.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: 1.5 + Math.random() * 3,
          opacity: 0.15 + Math.random() * 0.5,
          color: CHAOS_COLORS[Math.floor(Math.random() * CHAOS_COLORS.length)],
          type: 'chaos',
          life: 0,
          maxLife: 200 + Math.random() * 300,
          angle: angle,
          orbitRadius: radius,
          orbitSpeed: 0.002 + Math.random() * 0.005,
          orbitCenterX: cx,
          orbitCenterY: cy,
          trackIndex: -1,
          progress: Math.random(),
        });
      }

      // === 3 PARALLEL TRACKS WITH PROCESSING NODES ===
      const trackYStart = h * 0.2;
      const trackYEnd = h * 0.75;
      const trackCount = 3;
      const trackSpacing = (trackYEnd - trackYStart) / (trackCount - 1);
      
      for (let trackIdx = 0; trackIdx < trackCount; trackIdx++) {
        const trackY = trackYStart + trackIdx * trackSpacing;
        const trackColor = TRACK_COLORS[trackIdx];
        
        // Processing nodes along each track
        const nodeCount = 8;
        for (let i = 0; i < nodeCount; i++) {
          const progress = i / (nodeCount - 1);
          const nodeX = w * (0.28 + progress * 0.45);
          
          trackNodesRef.current.push({
            x: nodeX,
            y: trackY,
            radius: 8 + Math.sin(progress * Math.PI) * 4,
            opacity: 0.6 + 0.4 * Math.sin(progress * Math.PI),
            color: trackColor.main,
            pulse: Math.random() * Math.PI * 2,
            type: trackIdx === 0 ? 'process' : trackIdx === 1 ? 'storage' : 'output',
          });
        }
        
        // Flowing data packets on tracks
        for (let i = 0; i < 25; i++) {
          const progress = i / 25;
          const startX = w * 0.25;
          const endX = w * 0.73;
          const packetX = startX + progress * (endX - startX);
          
          particlesRef.current.push({
            x: packetX,
            y: trackY + (Math.random() - 0.5) * 12,
            vx: 0.8 + trackIdx * 0.2 + Math.random() * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: 2 + Math.random() * 2,
            opacity: 0.4 + Math.random() * 0.4,
            color: trackColor.main,
            type: 'packet',
            life: 0,
            maxLife: 1000,
            angle: 0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitCenterX: 0,
            orbitCenterY: 0,
            trackIndex: trackIdx,
            progress: progress,
          });
        }
      }

      // === GLOWING SERVER CORE (RIGHT SIDE) ===
      const coreX = w * 0.85;
      const coreY = h * 0.45;
      
      // Core particles orbiting
      for (let i = 0; i < 60; i++) {
        const angle = (Math.PI * 2 * i) / 60;
        const radius = 35 + Math.random() * 40;
        
        particlesRef.current.push({
          x: coreX + Math.cos(angle) * radius,
          y: coreY + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          radius: 2 + Math.random() * 3,
          opacity: 0.3 + Math.random() * 0.5,
          color: i % 3 === 0 ? "#fffbe6" : i % 3 === 1 ? "#fde047" : "#fef08a",
          type: 'core',
          life: 0,
          maxLife: 9999,
          angle: angle,
          orbitRadius: radius,
          orbitSpeed: 0.015 + Math.random() * 0.01,
          orbitCenterX: coreX,
          orbitCenterY: coreY,
          trackIndex: -1,
          progress: 0,
        });
      }

      // Core burst particles
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 80;
        
        particlesRef.current.push({
          x: coreX + Math.cos(angle) * radius,
          y: coreY + Math.sin(angle) * radius,
          vx: Math.cos(angle) * (0.5 + Math.random() * 1.5),
          vy: Math.sin(angle) * (0.5 + Math.random() * 1.5),
          radius: 1 + Math.random() * 2.5,
          opacity: 0.5 + Math.random() * 0.5,
          color: Math.random() > 0.5 ? "#fffbe6" : "#fde047",
          type: 'core',
          life: 0,
          maxLife: 150 + Math.random() * 200,
          angle: angle,
          orbitRadius: radius,
          orbitSpeed: 0,
          orbitCenterX: coreX,
          orbitCenterY: coreY,
          trackIndex: -1,
          progress: 0,
        });
      }
    };

    const drawFunnel = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // Funnel shape from chaotic left to tracks center
      const funnelLeft = w * 0.15;
      const funnelRight = w * 0.28;
      const funnelTop = h * 0.15;
      const funnelBottom = h * 0.85;
      const trackTop = h * 0.2;
      const trackBottom = h * 0.75;
      
      // Funnel gradient
      const funnelGrad = ctx.createLinearGradient(funnelLeft, 0, funnelRight, 0);
      funnelGrad.addColorStop(0, "rgba(220, 38, 38, 0.08)");
      funnelGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.06)");
      funnelGrad.addColorStop(1, "rgba(0, 255, 135, 0.08)");
      
      ctx.fillStyle = funnelGrad;
      ctx.beginPath();
      ctx.moveTo(funnelLeft, funnelTop);
      ctx.lineTo(funnelRight, trackTop);
      ctx.lineTo(funnelRight, trackBottom);
      ctx.lineTo(funnelLeft, funnelBottom);
      ctx.closePath();
      ctx.fill();
      
      // Funnel border glow
      const borderGrad = ctx.createLinearGradient(funnelLeft, 0, funnelRight, 0);
      borderGrad.addColorStop(0, "rgba(220, 38, 38, 0.3)");
      borderGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.4)");
      borderGrad.addColorStop(1, "rgba(0, 255, 135, 0.5)");
      
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -timeRef.current * 30;
      ctx.beginPath();
      ctx.moveTo(funnelLeft, funnelTop);
      ctx.lineTo(funnelRight, trackTop);
      ctx.lineTo(funnelRight, trackBottom);
      ctx.lineTo(funnelLeft, funnelBottom);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawTrackPaths = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const trackYStart = h * 0.2;
      const trackYEnd = h * 0.75;
      const trackCount = 3;
      const trackSpacing = (trackYEnd - trackYStart) / (trackCount - 1);
      const startX = w * 0.28;
      const endX = w * 0.73;
      
      for (let trackIdx = 0; trackIdx < trackCount; trackIdx++) {
        const trackY = trackYStart + trackIdx * trackSpacing;
        const trackColor = TRACK_COLORS[trackIdx];
        
        // Main track line with glow
        const trackGrad = ctx.createLinearGradient(startX, 0, endX, 0);
        trackGrad.addColorStop(0, `${trackColor.glow}0.15)`);
        trackGrad.addColorStop(0.3, `${trackColor.glow}0.35)`);
        trackGrad.addColorStop(0.7, `${trackColor.glow}0.5)`);
        trackGrad.addColorStop(1, `${trackColor.glow}0.3)`);
        
        ctx.strokeStyle = trackGrad;
        ctx.lineWidth = 3;
        ctx.shadowColor = trackColor.main;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(startX, trackY);
        ctx.lineTo(endX, trackY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Track label
        ctx.font = "600 10px 'Geist Mono', monospace";
        ctx.fillStyle = trackColor.main;
        ctx.textAlign = "right";
        ctx.fillText(trackColor.name, startX - 15, trackY + 3);
        
        // Track accent dots
        for (let i = 0; i < 5; i++) {
          const dotX = startX + (endX - startX) * (i / 4);
          ctx.beginPath();
          ctx.arc(dotX, trackY, 3, 0, Math.PI * 2);
          const dotAlpha = 0.3 + 0.7 * Math.abs(Math.sin(timeRef.current * 2 + i + trackIdx));
          ctx.fillStyle = `${trackColor.glow}${Math.floor(dotAlpha * 255).toString(16).padStart(2, '0')})`;
          ctx.fill();
        }
      }
    };

    const drawCore = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const coreX = w * 0.85;
      const coreY = h * 0.45;
      
      corePulseRef.current += 0.02;
      const pulseScale = 1 + Math.sin(corePulseRef.current) * 0.15;
      const pulseScale2 = 1 + Math.sin(corePulseRef.current * 1.5) * 0.1;
      
      // Outer glow rings
      for (let ring = 0; ring < 5; ring++) {
        const ringRadius = (80 + ring * 25) * pulseScale;
        const ringGrad = ctx.createRadialGradient(coreX, coreY, ringRadius * 0.3, coreX, coreY, ringRadius);
        const alpha = (0.15 - ring * 0.02) * (0.8 + 0.2 * Math.sin(corePulseRef.current * 0.5 + ring));
        ringGrad.addColorStop(0, `rgba(255, 251, 230, ${alpha})`);
        ringGrad.addColorStop(0.5, `rgba(253, 224, 71, ${alpha * 0.6})`);
        ringGrad.addColorStop(1, `rgba(245, 158, 11, ${alpha * 0.2})`);
        ctx.fillStyle = ringGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, ringRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Core inner bright sphere
      const coreRadius = 35 * pulseScale2;
      const coreGrad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, coreRadius);
      coreGrad.addColorStop(0, "#ffffff");
      coreGrad.addColorStop(0.2, "#fffbe6");
      coreGrad.addColorStop(0.5, "#fde047");
      coreGrad.addColorStop(0.8, "#f59e0b");
      coreGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(coreX, coreY, coreRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Core inner highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(coreX - coreRadius * 0.2, coreY - coreRadius * 0.2, coreRadius * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Convergence lines from tracks to core
      const trackYStart = h * 0.2;
      const trackYEnd = h * 0.75;
      const trackCount = 3;
      const trackSpacing = (trackYEnd - trackYStart) / (trackCount - 1);
      const endX = w * 0.73;
      
      for (let trackIdx = 0; trackIdx < trackCount; trackIdx++) {
        const trackY = trackYStart + trackIdx * trackSpacing;
        const trackColor = TRACK_COLORS[trackIdx];
        
        ctx.strokeStyle = `${trackColor.glow}0.4)`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -timeRef.current * 40;
        ctx.beginPath();
        ctx.moveTo(endX, trackY);
        ctx.quadraticCurveTo((endX + coreX) / 2, trackY, coreX, coreY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    };

    const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const gridSize = 50;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.02)";
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
      
      // Isometric accent lines
      ctx.strokeStyle = "rgba(0, 255, 135, 0.015)";
      for (let i = -h; i < w + h; i += gridSize * 3) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
      }
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;
      
      const w = widthRef.current;
      const h = heightRef.current;
      
      // Clear with dark background
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);
      
      // Background grid
      drawGrid(ctx, w, h);
      
      // Funnel
      drawFunnel(ctx, w, h);
      
      // Track paths
      drawTrackPaths(ctx, w, h);
      
      // Glowing core
      drawCore(ctx, w, h);
      
      // Update and draw particles
      const newParticles: Particle[] = [];
      
      particlesRef.current.forEach((particle) => {
        particle.life++;
        
        if (particle.type === 'chaos') {
          // Orbit around funnel center
          particle.angle += particle.orbitSpeed;
          particle.orbitRadius *= 0.9995; // Slowly spiral inward
          
          const targetX = particle.orbitCenterX + Math.cos(particle.angle) * particle.orbitRadius;
          const targetY = particle.orbitCenterY + Math.sin(particle.angle) * particle.orbitRadius;
          
          // Spring toward orbit
          particle.vx += (targetX - particle.x) * 0.02;
          particle.vy += (targetY - particle.y) * 0.02;
          particle.vx *= 0.95;
          particle.vy *= 0.95;
          particle.x += particle.vx;
          particle.y += particle.vy;
          
          // Mouse repulsion
          const mdx = particle.x - mousePos.x;
          const mdy = particle.y - mousePos.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 150 && mdist > 0) {
            const force = (150 - mdist) / 150 * 1.5;
            particle.vx += (mdx / mdist) * force;
            particle.vy += (mdy / mdist) * force;
          }
          
          // Fade out as it reaches funnel
          if (particle.orbitRadius < 60) {
            particle.opacity *= 0.98;
          }
          
          if (particle.life < particle.maxLife && particle.opacity > 0.02) {
            newParticles.push(particle);
          } else {
            // Respawn at edge
            const angle = Math.random() * Math.PI * 2;
            const radius = 120 + Math.random() * 100;
            const cx = w * 0.15;
            const cy = h * 0.45;
            newParticles.push({
              ...particle,
              x: cx + Math.cos(angle) * radius,
              y: cy + Math.sin(angle) * radius,
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              radius: 1.5 + Math.random() * 3,
              opacity: 0.15 + Math.random() * 0.5,
              color: CHAOS_COLORS[Math.floor(Math.random() * CHAOS_COLORS.length)],
              life: 0,
              maxLife: 200 + Math.random() * 300,
              angle: angle,
              orbitRadius: radius,
              orbitSpeed: 0.002 + Math.random() * 0.005,
            });
          }
        }
        else if (particle.type === 'packet') {
          // Flow along track
          particle.x += particle.vx;
          
          // Slight vertical wobble
          particle.y += Math.sin(timeRef.current * 3 + particle.progress * 20) * 0.15;
          
          // Mouse attraction
          const mdx = mousePos.x - particle.x;
          const mdy = mousePos.y - particle.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 200 && mdist > 0) {
            const force = (200 - mdist) / 200 * 0.3;
            particle.vx += (mdx / mdist) * force;
            particle.vy += (mdy / mdist) * force;
          }
          
          // Reset when past core
          if (particle.x > w * 0.82) {
            particle.x = w * 0.25;
            particle.progress = 0;
            particle.opacity = 0.4 + Math.random() * 0.4;
          }
          
          newParticles.push(particle);
        }
        else if (particle.type === 'core') {
          if (particle.orbitSpeed > 0) {
            // Orbiting core particles
            particle.angle += particle.orbitSpeed * (0.5 + Math.sin(timeRef.current * 0.3) * 0.3);
            particle.orbitRadius = particle.orbitRadius * 0.9999 + Math.sin(timeRef.current * 0.5 + particle.angle) * 0.5;
            
            particle.x = particle.orbitCenterX + Math.cos(particle.angle) * particle.orbitRadius;
            particle.y = particle.orbitCenterY + Math.sin(particle.angle) * particle.orbitRadius;
            
            // Pulse opacity
            particle.opacity = 0.3 + 0.5 * Math.abs(Math.sin(timeRef.current * 2 + particle.angle));
            
            newParticles.push(particle);
          } else {
            // Burst particles
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.opacity *= 0.99;
            
            if (particle.life < particle.maxLife && particle.opacity > 0.02) {
              newParticles.push(particle);
            } else {
              // Respawn burst
              const angle = Math.random() * Math.PI * 2;
              const radius = 10 + Math.random() * 80;
              newParticles.push({
                ...particle,
                x: particle.orbitCenterX + Math.cos(angle) * radius,
                y: particle.orbitCenterY + Math.sin(angle) * radius,
                vx: Math.cos(angle) * (0.5 + Math.random() * 1.5),
                vy: Math.sin(angle) * (0.5 + Math.random() * 1.5),
                radius: 1 + Math.random() * 2.5,
                opacity: 0.5 + Math.random() * 0.5,
                color: Math.random() > 0.5 ? "#fffbe6" : "#fde047",
                life: 0,
                maxLife: 150 + Math.random() * 200,
              });
            }
          }
        }
      });
      
      particlesRef.current = newParticles;
      
      // Draw all particles
      particlesRef.current.forEach((particle) => {
        const drawRadius = particle.radius;
        
        // Glow for core and track particles
        if (particle.type === 'core' || particle.type === 'packet') {
          const glowGrad = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, drawRadius * 5);
          const glowAlpha = Math.floor(particle.opacity * 100).toString(16).padStart(2, '0');
          glowGrad.addColorStop(0, `${particle.color}${glowAlpha}`);
          glowGrad.addColorStop(1, `${particle.color}00`);
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, drawRadius * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Core particle core
        const coreGrad = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, drawRadius);
        const coreAlpha = Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        coreGrad.addColorStop(0, `${particle.color}${coreAlpha}`);
        coreGrad.addColorStop(1, `${particle.color}00`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, drawRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright center for core particles
        if (particle.type === 'core') {
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, drawRadius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Draw track nodes
      trackNodesRef.current.forEach((node) => {
        node.pulse += 0.03;
        const pulseScale = 1 + Math.sin(node.pulse) * 0.2;
        const drawRadius = node.radius * pulseScale;
        
        // Node glow
        const nodeGlowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, drawRadius * 3);
        nodeGlowGrad.addColorStop(0, `${node.color}${Math.floor(node.opacity * 200).toString(16).padStart(2, '0')}`);
        nodeGlowGrad.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = nodeGlowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, drawRadius * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Node core
        const nodeCoreGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, drawRadius);
        nodeCoreGrad.addColorStop(0, `${node.color}${Math.floor(node.opacity * 255).toString(16).padStart(2, '0')}`);
        nodeCoreGrad.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = nodeCoreGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, drawRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner highlight
        ctx.fillStyle = `${node.color}${Math.floor(node.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, drawRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Node label
        ctx.font = "500 9px 'Geist Mono', monospace";
        ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
        ctx.textAlign = "center";
        const labels = node.type === 'process' ? "TRANSFORM" : node.type === 'storage' ? "STORE" : "EMIT";
        ctx.fillText(labels, node.x, node.y - drawRadius - 8);
      });
      
      // Connections between track nodes
      const trackYStart = h * 0.2;
      const trackYEnd = h * 0.75;
      const trackCount = 3;
      const trackSpacing = (trackYEnd - trackYStart) / (trackCount - 1);
      const nodesPerTrack = 8;
      
      for (let trackIdx = 0; trackIdx < trackCount; trackIdx++) {
        const trackColor = TRACK_COLORS[trackIdx];
        for (let i = 0; i < nodesPerTrack - 1; i++) {
          const nodeIdx1 = trackIdx * nodesPerTrack + i;
          const nodeIdx2 = trackIdx * nodesPerTrack + i + 1;
          const node1 = trackNodesRef.current[nodeIdx1];
          const node2 = trackNodesRef.current[nodeIdx2];
          
          if (node1 && node2) {
            ctx.strokeStyle = `${trackColor.glow}0.2)`;
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 6]);
            ctx.lineDashOffset = -timeRef.current * 20;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
      
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
          if (p.orbitCenterX) p.orbitCenterX = (p.orbitCenterX / prevW) * widthRef.current;
          if (p.orbitCenterY) p.orbitCenterY = (p.orbitCenterY / prevH) * heightRef.current;
        });
        trackNodesRef.current.forEach(n => {
          n.x = (n.x / prevW) * widthRef.current;
          n.y = (n.y / prevH) * heightRef.current;
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
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: "4s", animationDelay: "1s" }} />
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
              3-min Self-Intro Walkthrough
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-mint" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              <span>10 Independent Systems</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-mint" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              <span>10 GitHub Repositories</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-mint" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              <span>10 Loom Demonstrations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-mint" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              <span>3 Business Categories</span>
            </div>
          </div>
        </div>

        <div className="relative mt-12 h-[400px] sm:h-[480px] lg:h-[520px]">
          <canvas
            ref={canvasRef}
            className="w-full h-full glass rounded-2xl border-mint/10"
            aria-label="3D isometric GTM data automation pipeline: chaotic intake funnel → 3 parallel illuminated tracks → glowing server core"
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