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

    // Brand colors only
    const MINT_HUE = 140;   // #00ff87
    const CYAN_HUE = 190;   // #06b6d4

    const drawTwinkle = (x: number, y: number, time: number) => {
      for (let i = 0; i < 3; i++) {
        const angle = (time * 0.002 + i * 2.094);
        const r = 8 + Math.sin(time * 0.003 + i) * 4;
        const tx = x + Math.cos(angle) * r;
        const ty = y + Math.sin(angle) * r;
        
        const hue = i % 2 === 0 ? 140 : 190;
        const alpha = 0.15 + Math.sin(time * 0.005 + i) * 0.1;
        const size = 1.5 + Math.sin(time * 0.004 + i) * 0.5;
        
        const grad = ctx.createRadialGradient(tx, ty, 0, tx, ty, size * 4);
        grad.addColorStop(0, `hsla(${hue}, 100%, 80%, ${alpha * 0.6})`);
        grad.addColorStop(0.5, `hsla(${hue}, 100%, 70%, ${alpha * 0.3})`);
        grad.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(tx, ty, size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = `hsla(${hue}, 100%, 90%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(tx, ty, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      const w = widthRef.current;
      const h = heightRef.current;
      timeRef.current += 16;

      ctx.fillStyle = "rgba(2, 6, 23, 0.05)";
      ctx.fillRect(0, 0, w, h);

      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        drawTwinkle(mouseRef.current.x, mouseRef.current.y, timeRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      widthRef.current = window.innerWidth;
      heightRef.current = window.innerHeight;
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = widthRef.current * dprRef.current;
      canvas.height = heightRef.current * dprRef.current;
      canvas.style.width = `${widthRef.current}px`;
      canvas.style.height = `${heightRef.current}px`;
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
    };

    resize();
    animate();

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