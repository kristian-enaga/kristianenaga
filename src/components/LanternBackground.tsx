"use client";

import { useEffect, useRef, useState } from "react";

interface Lantern {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  phase: "in" | "float" | "out";
  life: number;
  maxLife: number;
  swayPhase: number;
  swayAmplitude: number;
  riseSpeed: number;
  blur: number;
}

const LANTERN_COLORS = [
  "rgba(251, 191, 36, 0.6)",   // warm amber
  "rgba(249, 115, 22, 0.5)",   // soft coral
  "rgba(52, 211, 153, 0.5)",   // emerald green
  "rgba(168, 85, 247, 0.5)",   // muted purple
];

const MAX_LANTERNS = 6;
const SPAWN_INTERVAL_MS = 2500;

export default function LanternBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const lanternsRef = useRef<Lantern[]>([]);
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);
  const mountedRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      widthRef.current = window.innerWidth;
      heightRef.current = window.innerHeight;
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = widthRef.current * dprRef.current;
      canvas.height = heightRef.current * dprRef.current;
      canvas.style.width = `${widthRef.current}px`;
      canvas.style.height = `${heightRef.current}px`;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  const spawnLantern = () => {
    if (lanternsRef.current.length >= MAX_LANTERNS) return;
    if (!mountedRef.current) return;

    const w = widthRef.current;
    const h = heightRef.current;
    if (w === 0 || h === 0) return;

    const color = LANTERN_COLORS[Math.floor(Math.random() * LANTERN_COLORS.length)];
    const startX = 0.15 * w + Math.random() * 0.7 * w; // avoid edges
    const startY = h + 80;
    const radius = 80 + Math.random() * 60; // 80-140px
    const riseSpeed = 0.08 + Math.random() * 0.06;
    const swayAmplitude = 15 + Math.random() * 25;
    const swayPhase = Math.random() * Math.PI * 2;
    const blur = 40 + Math.random() * 40;
    const maxLife = (h + 200) / riseSpeed;

    lanternsRef.current.push({
      x: startX,
      y: startY,
      radius,
      color,
      opacity: 0,
      phase: "in",
      life: 0,
      maxLife,
      swayPhase,
      swayAmplitude,
      riseSpeed,
      blur,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    widthRef.current = window.innerWidth;
    heightRef.current = window.innerHeight;
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = widthRef.current * dprRef.current;
    canvas.height = heightRef.current * dprRef.current;
    canvas.style.width = `${widthRef.current}px`;
    canvas.style.height = `${heightRef.current}px`;
    ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

    if (prefersReducedMotionRef.current) return;

    spawnTimerRef.current = window.setInterval(spawnLantern, SPAWN_INTERVAL_MS);
    setTimeout(spawnLantern, 1200);

    // Draw static dark tech background once
    const drawBaseBackground = () => {
      const w = widthRef.current;
      const h = heightRef.current;
      
      // Deep dark base
      const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
      baseGrad.addColorStop(0, "#020617");
      baseGrad.addColorStop(0.5, "#050a1a");
      baseGrad.addColorStop(1, "#020617");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle grid pattern (tech aesthetic)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.02)";
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

      // Corner gradient glows (ambient)
      const cornerGlows = [
        { x: w * 0.1, y: h * 0.15, color: "rgba(168, 85, 247, 0.08)", r: Math.max(w, h) * 0.6 },
        { x: w * 0.85, y: h * 0.75, color: "rgba(52, 211, 153, 0.06)", r: Math.max(w, h) * 0.5 },
        { x: w * 0.5, y: h * 0.95, color: "rgba(251, 191, 36, 0.05)", r: Math.max(w, h) * 0.4 },
      ];
      cornerGlows.forEach(({ x, y, color, r }) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
    };

    drawBaseBackground();

    const animate = () => {
      if (!mountedRef.current) return;

      const w = widthRef.current;
      const h = heightRef.current;
      timeRef.current += 16;

      // Redraw base each frame (cheap, keeps grid stable)
      drawBaseBackground();

      // Additive blending for lanterns
      ctx.globalCompositeOperation = "lighter";

      const aliveLanterns: Lantern[] = [];

      lanternsRef.current.forEach((lantern) => {
        lantern.life += 16;
        const progress = lantern.life / lantern.maxLife;

        // Phase transitions
        if (lantern.phase === "in") {
          if (progress < 0.12) {
            lantern.opacity = (progress / 0.12) * 0.28;
          } else {
            lantern.phase = "float";
            lantern.opacity = 0.28;
          }
        } else if (lantern.phase === "float") {
          if (progress > 0.82) {
            lantern.phase = "out";
          } else {
            // Gentle breathing pulse
            const pulse = Math.sin(timeRef.current * 0.0006 + lantern.swayPhase) * 0.03;
            lantern.opacity = Math.max(0.18, Math.min(0.32, 0.25 + pulse));
          }
        } else {
          const fadeProgress = (progress - 0.82) / 0.18;
          lantern.opacity = Math.max(0, (1 - fadeProgress) * 0.28);
        }

        // Movement: rise + smooth horizontal sway
        lantern.y -= lantern.riseSpeed;
        lantern.x += Math.sin(timeRef.current * 0.0008 + lantern.swayPhase) * lantern.swayAmplitude * 0.008;

        // Draw if visible and on screen
        if (lantern.opacity > 0.02 && lantern.y > -lantern.radius && lantern.y < h + lantern.radius) {
          ctx.filter = `blur(${lantern.blur}px)`;
          ctx.globalAlpha = 1;

          // Main glow - large soft orb
          const grad = ctx.createRadialGradient(
            lantern.x, lantern.y, 0,
            lantern.x, lantern.y, lantern.radius
          );
          const c = lantern.color.replace(/[\d.]+\)$/, `${lantern.opacity})`);
          const cMid = lantern.color.replace(/[\d.]+\)$/, `${lantern.opacity * 0.35})`);
          const cEnd = lantern.color.replace(/[\d.]+\)$/, `0)`);
          grad.addColorStop(0, c);
          grad.addColorStop(0.35, cMid);
          grad.addColorStop(0.65, cMid);
          grad.addColorStop(1, cEnd);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(lantern.x, lantern.y, lantern.radius, 0, Math.PI * 2);
          ctx.fill();

          // Subtle core
          const coreGrad = ctx.createRadialGradient(
            lantern.x, lantern.y, 0,
            lantern.x, lantern.y, lantern.radius * 0.18
          );
          const coreC = lantern.color.replace(/[\d.]+\)$/, `${Math.min(0.45, lantern.opacity * 1.6)})`);
          coreGrad.addColorStop(0, coreC);
          coreGrad.addColorStop(1, cEnd);
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(lantern.x, lantern.y, lantern.radius * 0.18, 0, Math.PI * 2);
          ctx.fill();

          ctx.filter = "none";

          aliveLanterns.push(lantern);
        }
      });

      lanternsRef.current = aliveLanterns;
      ctx.globalCompositeOperation = "source-over";

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, []);

  if (prefersReducedMotionRef.current) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 select-none"
      aria-hidden="true"
    />
  );
}