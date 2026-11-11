"use client";

import { useEffect, useRef, useState } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  type: string; // 'trail' or 'spark'
}

const COLORS = [
  "#06b6d4", // cyan
  "#22c55e", // green
  "#a855f7", // purple
  "#f59e0b", // amber
  "#6366f1", // indigo
  "#00ff87", // mint
];

export default function SparkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const sparksRef = useRef<Spark[]>([]);
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
      widthRef.current = window.innerWidth;
      heightRef.current = window.innerHeight;
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = widthRef.current * dprRef.current;
      canvas.height = heightRef.current * dprRef.current;
      canvas.style.width = `${widthRef.current}px`;
      canvas.style.height = `${heightRef.current}px`;
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
    };

    const MAX_SPARKS = 120;

    const initScene = () => {
      sparksRef.current = [];
      // Initial random sparks across screen
      for (let i = 0; i < MAX_SPARKS / 2; i++) {
        sparksRef.current.push({
          x: Math.random() * widthRef.current,
          y: Math.random() * heightRef.current,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 0.5 + Math.random() * 1.5,
          opacity: 0,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 0,
          maxLife: 100 + Math.random() * 200,
          type: "trail",
        });
      }
    };

    const addTrailSpark = (x: number, y: number) => {
      // Add a few sparks at mouse position
      for (let i = 0; i < 2; i++) {
        if (sparksRef.current.length >= MAX_SPARKS) break;
        sparksRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: 1 + Math.random() * 2,
          opacity: 0.8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 0,
          maxLife: 60 + Math.random() * 60,
          type: "trail",
        });
      }
    };

    const drawGlowCircle = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string,
      opacity: number
    ) => {
      // Inner bright core
      const innerGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      innerGrad.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      innerGrad.addColorStop(0.5, `${color}${Math.floor(opacity * 100).toString(16).padStart(2, '0')}`);
      innerGrad.addColorStop(1, `${color}00`);
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer bloom (dual-circle method - lighter outer ring)
      const outerRadius = radius * 3;
      const outerGrad = ctx.createRadialGradient(x, y, radius, x, y, outerRadius);
      outerGrad.addColorStop(0, `${color}${Math.floor(opacity * 60).toString(16).padStart(2, '0')}`);
      outerGrad.addColorStop(1, `${color}00`);
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;

      const w = widthRef.current;
      const h = heightRef.current;

      // Clear with slight trail fade
      ctx.fillStyle = "rgba(2, 6, 23, 0.3)";
      ctx.fillRect(0, 0, w, h);

      // Add trail sparks at mouse position
      if (mousePos.x > 0 && mousePos.y > 0) {
        addTrailSpark(mousePos.x, mousePos.y);
      }

      // Update and draw sparks
      const newSparks: Spark[] = [];

      sparksRef.current.forEach((spark) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life++;
        spark.opacity *= 0.96;

        // Gentle drift
        spark.vx *= 0.98;
        spark.vy *= 0.98;
        spark.vy += 0.05; // slight gravity

        // Add subtle sine wave movement
        spark.x += Math.sin(timeRef.current + spark.life * 0.05) * 0.3;
        spark.y += Math.cos(timeRef.current + spark.life * 0.03) * 0.2;

        // Draw glow circle (dual-circle bloom)
        if (spark.opacity > 0.05) {
          drawGlowCircle(ctx, spark.x, spark.y, spark.radius, spark.color, spark.opacity);
        }

        // Keep if still alive
        if (spark.life < spark.maxLife && spark.opacity > 0.02) {
          newSparks.push(spark);
        } else {
          // Respawn at random position or near mouse
          const respawnX = mousePos.x > 0 ? mousePos.x + (Math.random() - 0.5) * 50 : Math.random() * w;
          const respawnY = mousePos.y > 0 ? mousePos.y + (Math.random() - 0.5) * 50 : Math.random() * h;
          newSparks.push({
            x: respawnX,
            y: respawnY,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: 0.5 + Math.random() * 1.5,
            opacity: 0,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 0,
            maxLife: 100 + Math.random() * 200,
            type: "trail",
          });
        }
      });

      sparksRef.current = newSparks;

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    initScene();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleResize = () => {
      const prevW = widthRef.current;
      const prevH = heightRef.current;
      resize();
      initScene();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}