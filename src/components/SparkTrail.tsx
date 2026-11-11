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
  hue: number;
  colorPhase: number;
}

const NEON_COLORS = [
  { hue: 0, name: "fiery red" },      // #ff1a1a
  { hue: 20, name: "glowing orange" }, // #ff6b00
  { hue: 30, name: "bright gold" },    // #ffd700
  { hue: 330, name: "hot pink" },      // #ff006e
  { hue: 350, name: "electric red" },  // #ff1a3a
  { hue: 45, name: "solar yellow" },   // #fff01f
];

const MAX_SPARKS = 120;

export default function SparkTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);
  const colorCycleRef = useRef(0);

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

    const addSpark = (x: number, y: number) => {
      // Add burst of sparks at position
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        if (sparksRef.current.length >= MAX_SPARKS) break;
        
        const colorIndex = Math.floor(Math.random() * NEON_COLORS.length);
        const baseHue = NEON_COLORS[colorIndex].hue;
        
        sparksRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4 - 1,
          radius: 1.5 + Math.random() * 2.5,
          opacity: 0.9 + Math.random() * 0.1,
          color: `hsl(${baseHue}, 100%, 60%)`,
          life: 0,
          maxLife: 40 + Math.random() * 40,
          hue: baseHue,
          colorPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawGlowParticle = (
      ctx: CanvasRenderingContext2D,
      spark: Spark
    ) => {
      const { x, y, radius, opacity, hue, colorPhase, life } = spark;
      
      // Color cycling animation
      const cycleSpeed = 0.05;
      const currentHue = (hue + Math.sin(timeRef.current * cycleSpeed + colorPhase) * 15 + 360) % 360;
      const saturatedColor = `hsl(${currentHue}, 100%, 60%)`;
      const brightColor = `hsl(${currentHue}, 100%, 75%)`;
      const whiteColor = `hsl(${currentHue}, 100%, 90%)`;
      
      // Outer glow bloom (dual-layer)
      const outerRadius = radius * 6;
      const outerGrad = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);
      outerGrad.addColorStop(0, `${saturatedColor}${Math.floor(opacity * 80).toString(16).padStart(2, '0')}`);
      outerGrad.addColorStop(0.5, `${brightColor}${Math.floor(opacity * 30).toString(16).padStart(2, '0')}`);
      outerGrad.addColorStop(1, `${saturatedColor}00`);
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Middle glow
      const midRadius = radius * 3;
      const midGrad = ctx.createRadialGradient(x, y, 0, x, y, midRadius);
      midGrad.addColorStop(0, `${brightColor}${Math.floor(opacity * 150).toString(16).padStart(2, '0')}`);
      midGrad.addColorStop(0.5, `${saturatedColor}${Math.floor(opacity * 80).toString(16).padStart(2, '0')}`);
      midGrad.addColorStop(1, `${saturatedColor}00`);
      ctx.fillStyle = midGrad;
      ctx.beginPath();
      ctx.arc(x, y, midRadius, 0, Math.PI * 2);
      ctx.fill();

      // Core - bright center
      const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      coreGrad.addColorStop(0, `${whiteColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      coreGrad.addColorStop(0.3, `${brightColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      coreGrad.addColorStop(0.7, `${saturatedColor}${Math.floor(opacity * 200).toString(16).padStart(2, '0')}`);
      coreGrad.addColorStop(1, `${saturatedColor}00`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;
      colorCycleRef.current += 0.008;

      const w = widthRef.current;
      const h = heightRef.current;

      // Clear with very slight fade for trails
      ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
      ctx.fillRect(0, 0, w, h);

      // Add sparks at mouse position
      if (mousePos.x > 0 && mousePos.y > 0) {
        addSpark(mousePos.x, mousePos.y);
      }

      // Update and draw sparks
      const newSparks: Spark[] = [];

      sparksRef.current.forEach((spark) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life++;
        spark.opacity *= 0.96;

        // Physics
        spark.vx *= 0.97;
        spark.vy *= 0.97;
        spark.vy += 0.08; // gentle gravity

        // Subtle wave motion
        spark.x += Math.sin(timeRef.current * 3 + spark.life * 0.1) * 0.5;
        spark.y += Math.cos(timeRef.current * 2 + spark.life * 0.08) * 0.3;

        // Draw glow particle
        if (spark.opacity > 0.05) {
          drawGlowParticle(ctx, spark);
        }

        // Keep if alive
        if (spark.life < spark.maxLife && spark.opacity > 0.02) {
          newSparks.push(spark);
        } else if (Math.random() < 0.02) {
          // Occasional respawn at random edge for ambient atmosphere
          newSparks.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            radius: 1 + Math.random() * 2,
            opacity: 0.1,
            color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)].name,
            life: 0,
            maxLife: 80 + Math.random() * 80,
            hue: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)].hue,
            colorPhase: Math.random() * Math.PI * 2,
          });
        }
      });

      sparksRef.current = newSparks;

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
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
      resize();
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