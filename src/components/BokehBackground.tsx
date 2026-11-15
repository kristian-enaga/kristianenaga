"use client";

import { useEffect, useRef, useState } from "react";

interface BokehParticle {
  x: number;
  y: number;
  z: number; // depth: 0.2 (far) to 1.0 (near)
  radius: number;
  baseRadius: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
  pulsePhase: number;
  pulseSpeed: number;
}

const COLORS = [
  "#a855f7", // neon purple
  "#f97316", // coral red
  "#fbbf24", // warm amber
  "#34d399", // emerald green
];

const MAX_PARTICLES = 35;

export default function BokehBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<BokehParticle[]>([]);
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

    // Initialize particles
    particlesRef.current = Array.from({ length: MAX_PARTICLES }, () => {
      const z = 0.2 + Math.random() * 0.8; // depth
      const baseRadius = 40 + Math.random() * 120; // size varies by depth
      return {
        x: Math.random() * widthRef.current,
        y: Math.random() * heightRef.current,
        z,
        radius: baseRadius,
        baseRadius,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.15 + Math.random() * 0.25,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.0005 + Math.random() * 0.001,
      };
    });

    const animate = () => {
      if (!mountedRef.current) return;

      const w = widthRef.current;
      const h = heightRef.current;
      timeRef.current += 16;

      // Clear
      ctx.fillStyle = "rgba(2, 6, 23, 1)";
      ctx.fillRect(0, 0, w, h);

      // Additive blending for neon glow
      ctx.globalCompositeOperation = "lighter";

      particlesRef.current.forEach((p) => {
        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -p.radius) p.x = w + p.radius;
        if (p.x > w + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = h + p.radius;
        if (p.y > h + p.radius) p.y = -p.radius;

        // Pulse
        const pulse = Math.sin(timeRef.current * p.pulseSpeed + p.pulsePhase) * 0.15 + 0.85;
        p.radius = p.baseRadius * pulse * p.z;
        p.opacity = (0.15 + Math.random() * 0.1) * pulse * p.z;

        // Blur based on depth (closer = blurrier)
        const blur = 20 + (1 - p.z) * 40;
        ctx.filter = `blur(${blur}px)`;
        ctx.globalAlpha = p.opacity;

        // Radial gradient glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `${p.color}CC`);
        grad.addColorStop(0.3, `${p.color}60`);
        grad.addColorStop(0.6, `${p.color}20`);
        grad.addColorStop(1, `${p.color}00`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.filter = "none";
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  if (prefersReducedMotionRef.current) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none select-none"
      aria-hidden="true"
      style={{ willChange: "transform" }}
    />
  );
}