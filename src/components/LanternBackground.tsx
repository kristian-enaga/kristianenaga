"use client";

import { useEffect, useRef, useState } from "react";

interface Lantern {
  x: number;
  y: number;
  baseY: number;
  radius: number;
  color: string;
  opacity: number;
  phase: number; // 0 = fading in, 1 = floating, 2 = fading out
  life: number;
  maxLife: number;
  swayOffset: number;
  swaySpeed: number;
  riseSpeed: number;
}

const LANTERN_COLORS = [
  "rgba(251, 191, 36, 1)",   // warm amber
  "rgba(249, 115, 22, 1)",   // soft coral
  "rgba(52, 211, 153, 1)",   // emerald green
  "rgba(168, 85, 247, 1)",   // muted purple
];

const MAX_LANTERNS = 9;
const SPAWN_INTERVAL_MS = 1800;

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

  // Spawn a single lantern
  const spawnLantern = () => {
    if (lanternsRef.current.length >= MAX_LANTERNS) return;
    if (!mountedRef.current) return;

    const w = widthRef.current;
    const h = heightRef.current;
    if (w === 0 || h === 0) return;

    const color = LANTERN_COLORS[Math.floor(Math.random() * LANTERN_COLORS.length)];
    const startX = Math.random() * w;
    const startY = h + 50; // start below viewport
    const radius = 60 + Math.random() * 80; // 60-140px
    const riseSpeed = 0.15 + Math.random() * 0.15; // pixels per frame
    const swaySpeed = 0.002 + Math.random() * 0.003;
    const swayOffset = Math.random() * Math.PI * 2;
    const maxLife = (h + 150) / riseSpeed; // frames until off-screen

    lanternsRef.current.push({
      x: startX,
      y: startY,
      baseY: startY,
      radius,
      color,
      opacity: 0,
      phase: 0,
      life: 0,
      maxLife,
      swayOffset,
      swaySpeed,
      riseSpeed,
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

    // Spawn timer
    spawnTimerRef.current = window.setInterval(spawnLantern, SPAWN_INTERVAL_MS);
    // Initial spawn after short delay
    setTimeout(spawnLantern, 800);

    const animate = () => {
      if (!mountedRef.current) return;

      const w = widthRef.current;
      const h = heightRef.current;
      timeRef.current += 16;

      // Clear with dark background (matches site bg)
      ctx.fillStyle = "rgba(2, 6, 23, 1)";
      ctx.fillRect(0, 0, w, h);

      // Additive blending for soft glow
      ctx.globalCompositeOperation = "lighter";

      const aliveLanterns: Lantern[] = [];

      lanternsRef.current.forEach((lantern) => {
        lantern.life += 16;
        const progress = lantern.life / lantern.maxLife;

        // Phase transitions
        if (lantern.phase === 0) {
          // Fade in (first 15% of life)
          if (progress < 0.15) {
            lantern.opacity = (progress / 0.15) * (0.25 + Math.random() * 0.15);
          } else {
            lantern.phase = 1;
            lantern.opacity = 0.25 + Math.random() * 0.15;
          }
        } else if (lantern.phase === 1) {
          // Floating - gentle pulse
          const pulse = Math.sin(timeRef.current * 0.0008 + lantern.swayOffset) * 0.05;
          lantern.opacity = Math.max(0.15, Math.min(0.4, 0.3 + pulse));
          
          if (progress > 0.85) {
            lantern.phase = 2;
          }
        } else {
          // Fade out (last 15%)
          const fadeProgress = (progress - 0.85) / 0.15;
          lantern.opacity = Math.max(0, (1 - fadeProgress) * 0.3);
        }

        // Movement: rise + sway
        lantern.y -= lantern.riseSpeed;
        lantern.x += Math.sin(timeRef.current * lantern.swaySpeed + lantern.swayOffset) * 0.3;

        // Draw lantern if visible
        if (lantern.opacity > 0.02 && lantern.y > -lantern.radius) {
          // Soft radial gradient glow
          const grad = ctx.createRadialGradient(
            lantern.x, lantern.y, 0,
            lantern.x, lantern.y, lantern.radius
          );
          const baseColor = lantern.color.replace("1)", `${lantern.opacity})`);
          const midColor = lantern.color.replace("1)", `${lantern.opacity * 0.4})`);
          const endColor = lantern.color.replace("1)", "0)");

          grad.addColorStop(0, baseColor);
          grad.addColorStop(0.4, midColor);
          grad.addColorStop(0.7, midColor);
          grad.addColorStop(1, endColor);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(lantern.x, lantern.y, lantern.radius, 0, Math.PI * 2);
          ctx.fill();

          // Subtle core highlight
          const coreGrad = ctx.createRadialGradient(
            lantern.x, lantern.y, 0,
            lantern.x, lantern.y, lantern.radius * 0.25
          );
          const coreColor = lantern.color.replace("1)", `${Math.min(0.5, lantern.opacity * 1.5)})`);
          coreGrad.addColorStop(0, coreColor);
          coreGrad.addColorStop(1, lantern.color.replace("1)", "0)"));
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(lantern.x, lantern.y, lantern.radius * 0.25, 0, Math.PI * 2);
          ctx.fill();

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
      style={{ willChange: "transform" }}
    />
  );
}