"use client";

import { useEffect, useRef, useState } from "react";

const MAX_PARTICLES = 60;
const PARTICLE_LIFETIME = 1200;
const FRICTION = 0.96;
const SPAWN_INTERVAL = 2;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  hue: number;
  type: "trail" | "glow";
}

export default function ParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const lastSpawnRef = useRef(0);
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);
  const mountedRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const isMobileRef = useRef(false);

  // Check for reduced motion and mobile on mount
  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    isMobileRef.current = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || ("ontouchstart" in window);

    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Resize handler
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

  // Mouse/Touch move handler - window level for full coverage
  useEffect(() => {
    if (isMobileRef.current) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        mouseRef.current = { x: clientX, y: clientY };
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchstart", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchstart", handleMove);
    };
  }, []);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Initial resize
    widthRef.current = window.innerWidth;
    heightRef.current = window.innerHeight;
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = widthRef.current * dprRef.current;
    canvas.height = heightRef.current * dprRef.current;
    canvas.style.width = `${widthRef.current}px`;
    canvas.style.height = `${heightRef.current}px`;
    ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);

    // Skip entirely if reduced motion or mobile
    if (prefersReducedMotionRef.current || isMobileRef.current) {
      return;
    }

    const animate = () => {
      if (!mountedRef.current) return;

      const w = widthRef.current;
      const h = heightRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      timeRef.current += 16;

      // Clear with subtle fade for trail effect
      ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
      ctx.fillRect(0, 0, w, h);

      const newParticles: Particle[] = [];

      particlesRef.current.forEach((p) => {
        // Apply friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        // Gentle attraction to mouse for trail particles
        if (p.type === "trail" && mx > 0 && my > 0) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const force = 0.02 / distance;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Update life
        p.life += 16;

        // Draw if alive
        if (p.life < p.maxLife) {
          const progress = p.life / p.maxLife;
          const alpha = 1 - progress;
          const size = p.radius * alpha;

          if (p.type === "trail") {
            // Trail particles - mint/cyan gradient
            const hue = p.hue;
            const glowSize = size * 2;

            // Outer glow
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
            grad.addColorStop(0, `hsla(${hue}, 90%, 70%, ${alpha * 0.5})`);
            grad.addColorStop(0.5, `hsla(${hue}, 80%, 60%, ${alpha * 0.2})`);
            grad.addColorStop(1, `hsla(${hue}, 70%, 50%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // Inner core
            ctx.fillStyle = `hsla(${hue}, 100%, 85%, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Glow particles - pulsing twinkle at mouse position
            const angle = (timeRef.current * 0.001 + p.hue) % (Math.PI * 2);
            const r = 12 + Math.sin(timeRef.current * 0.002 + p.hue) * 6;
            const tx = p.x + Math.cos(angle) * r;
            const ty = p.y + Math.sin(angle) * r;

            const glowAlpha = alpha * (0.15 + Math.sin(timeRef.current * 0.003 + p.hue) * 0.1);
            const glowSize = (1.5 + Math.sin(timeRef.current * 0.0025 + p.hue) * 0.5) * 4;

            const grad = ctx.createRadialGradient(tx, ty, 0, tx, ty, glowSize);
            grad.addColorStop(0, `hsla(${p.hue}, 100%, 80%, ${glowAlpha * 0.6})`);
            grad.addColorStop(0.5, `hsla(${p.hue}, 100%, 70%, ${glowAlpha * 0.3})`);
            grad.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(tx, ty, glowSize, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${glowAlpha})`;
            ctx.beginPath();
            ctx.arc(tx, ty, glowSize * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }

          newParticles.push(p);
        }
      });

      // Spawn new particles at mouse position
      if (mx > 0 && my > 0 && mx < w && my < h) {
        lastSpawnRef.current++;
        if (lastSpawnRef.current >= SPAWN_INTERVAL && particlesRef.current.length < MAX_PARTICLES) {
          lastSpawnRef.current = 0;

          // Spawn trail particle
          if (Math.random() < 0.7) {
            const hue = 140 + Math.random() * 50; // mint to cyan range
            particlesRef.current.push({
              x: mx + (Math.random() - 0.5) * 10,
              y: my + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5 - 0.5, // slight upward drift
              radius: 1.5 + Math.random() * 2.5,
              life: 0,
              maxLife: PARTICLE_LIFETIME,
              hue,
              type: "trail",
            });
          }

          // Spawn glow twinkle particle
          if (Math.random() < 0.3) {
            const hue = Math.random() < 0.5 ? 140 : 190; // mint or cyan
            particlesRef.current.push({
              x: mx,
              y: my,
              vx: 0,
              vy: 0,
              radius: 0,
              life: 0,
              maxLife: 800,
              hue,
              type: "glow",
            });
          }
        }
      }

      particlesRef.current = newParticles;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Don't render canvas if reduced motion or mobile - saves resources
  if (prefersReducedMotionRef.current || isMobileRef.current) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none select-none"
      aria-hidden="true"
      style={{ willChange: "transform" }}
    />
  );
}