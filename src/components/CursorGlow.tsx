"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);

  // Lightweight spark - minimal properties
  interface Spark {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    hue: number;
  }

  const sparksRef = useRef<Spark[]>([]);
  const MAX_SPARKS = 30; // Very low for performance

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const resize = () => {
      widthRef.current = window.innerWidth;
      heightRef.current = window.innerHeight;
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = widthRef.current * dprRef.current;
      canvas.height = heightRef.current * dprRef.current;
      canvas.style.width = `${widthRef.current}px`;
      canvas.style.height = `${heightRef.current}px`;
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
    };

    // Mint/cyan brand colors only - no random palette switching
    const MINT_HUE = 140;
    const CYAN_HUE = 190;

    const addSpark = (x: number, y: number) => {
      if (sparksRef.current.length >= 25) return; // Hard cap
      
      const isMint = Math.random() < 0.6;
      const baseHue = isMint ? MINT_HUE : CYAN_HUE;
      const hue = baseHue + (Math.random() - 0.5) * 15;
      
      sparksRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 0.8,
        life: 0,
        maxLife: 15 + Math.random() * 10, // Short life
        hue,
      });
    };

    const drawSpark = (ctx: CanvasRenderingContext2D, s: Spark) => {
      const progress = s.life / s.maxLife;
      if (progress >= 1) return;

      const alpha = (1 - progress) * 0.8;
      const size = (2 + Math.random() * 1.5) * (1 - progress * 0.5);
      const hue = s.hue;
      const currentHue = (hue + Math.sin(timeRef.current * 0.04) * 8 + 360) % 360;

      // Single gradient draw - much lighter
      const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, size * 3);
      grad.addColorStop(0, `hsla(${currentHue}, 100%, 75%, ${alpha})`);
      grad.addColorStop(0.5, `hsla(${currentHue}, 100%, 60%, ${alpha * 0.5})`);
      grad.addColorStop(1, `hsla(${currentHue}, 100%, 50%, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.fillStyle = `hsla(${currentHue}, 100%, 90%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 1;

      const w = widthRef.current;
      const h = heightRef.current;

      // Very light clear - just fade
      ctx.fillStyle = "rgba(2, 6, 23, 0.1)";
      ctx.fillRect(0, 0, w, h);

      // Add 1 spark per frame max
      if (mouseRef.current.x > 0 && Math.random() < 0.4) {
        addSpark(mouseRef.current.x, mouseRef.current.y);
      }

      // Update sparks
      const alive: Spark[] = [];
      sparksRef.current.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        s.vx *= 0.97;
        s.vy *= 0.97;
        s.vy += 0.03; // gentle gravity

        if (s.life < s.maxLife) {
          drawSpark(ctx, s);
          alive.push(s);
        }
      });
      sparksRef.current = alive;

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => resize();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[5] pointer-events-none"
      aria-hidden="true"
      style={{ willChange: "transform" }}
    />
  );
}