"use client";

import { useEffect, useRef, useState } from "react";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
  isCursor: boolean;
}

const CURSOR_COLORS = [
  { hue: 140, name: "mint" },      // #00ff87
  { hue: 190, name: "cyan" },      // #06b6d4
  { hue: 45, name: "gold" },       // #f59e0b
  { hue: 330, name: "pink" },      // #f43f5e
];

interface CardGlowState {
  id: string;
  intensity: number;
  rect: DOMRect | null;
}

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const mousePosRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const dprRef = useRef(1);
  const [cardStates, setCardStates] = useState<Map<string, CardGlowState>>(new Map());

  // Track card elements for proximity detection
  useEffect(() => {
    const cards = document.querySelectorAll('[data-card-index]');
    const updateRects = () => {
      const newStates = new Map<string, CardGlowState>();
      cards.forEach((card) => {
        const id = card.getAttribute('data-card-index') || '';
        const rect = card.getBoundingClientRect();
        newStates.set(id, { id, intensity: 0, rect });
      });
      setCardStates(newStates);
    };

    updateRects();
    window.addEventListener('resize', updateRects);
    window.addEventListener('scroll', updateRects);
    
    // Update on card animations
    const observer = new MutationObserver(updateRects);
    cards.forEach(card => observer.observe(card, { attributes: true, attributeFilter: ['style'] }));
    
    return () => {
      window.removeEventListener('resize', updateRects);
      window.removeEventListener('scroll', updateRects);
      observer.disconnect();
    };
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      
      // Update card intensities based on proximity
      setCardStates(prev => {
        const next = new Map(prev);
        let changed = false;
        
        prev.forEach((state, id) => {
          if (state.rect) {
            const centerX = state.rect.left + state.rect.width / 2;
            const centerY = state.rect.top + state.rect.height / 2;
            const dx = mousePosRef.current.x - centerX;
            const dy = mousePosRef.current.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDist = Math.max(state.rect.width, state.rect.height) * 1.5;
            
            // Intensity based on distance - sharp falloff
            let intensity = 0;
            if (distance < state.rect.width / 2) {
              // Inside card bounds - maximum intensity
              intensity = 1;
            } else if (distance < maxDist) {
              // Near card - falloff
              intensity = 1 - (distance - state.rect.width / 2) / (maxDist - state.rect.width / 2);
              intensity = Math.max(0, intensity ** 1.5); // Exponential falloff
            }
            
            if (Math.abs(state.intensity - intensity) > 0.02) {
              next.set(id, { ...state, intensity });
              changed = true;
            }
          }
        });
        
        return changed ? next : prev;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cardStates]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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

    const addCursorSpark = (x: number, y: number) => {
      const colorIndex = Math.floor(Math.random() * CURSOR_COLORS.length);
      const baseHue = CURSOR_COLORS[colorIndex].hue;
      const count = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < count; i++) {
        if (sparksRef.current.length >= 80) break;
        
        sparksRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - 0.5,
          radius: 1.5 + Math.random() * 2,
          opacity: 1,
          hue: baseHue + (Math.random() - 0.5) * 20,
          life: 0,
          maxLife: 25 + Math.random() * 20,
          isCursor: true,
        });
      }
    };

    const drawGlowSpark = (ctx: CanvasRenderingContext2D, spark: Spark) => {
      const { x, y, radius, opacity, hue, life } = spark;
      
      // Color cycling
      const cycleSpeed = 0.08;
      const currentHue = (hue + Math.sin(timeRef.current * cycleSpeed) * 10 + 360) % 360;
      const saturatedColor = `hsl(${currentHue}, 100%, 60%)`;
      const brightColor = `hsl(${currentHue}, 100%, 75%)`;
      const whiteColor = `hsl(${currentHue}, 100%, 90%)`;
      
      // Cursor sparks get extra brightness
      const brightnessMult = spark.isCursor ? 1.5 : 1;
      
      // Outer glow bloom
      const outerRadius = radius * 8 * brightnessMult;
      const outerGrad = ctx.createRadialGradient(x, y, 0, x, y, outerRadius);
      outerGrad.addColorStop(0, `${saturatedColor}${Math.floor(opacity * 100 * brightnessMult).toString(16).padStart(2, '0')}`);
      outerGrad.addColorStop(0.4, `${brightColor}${Math.floor(opacity * 40 * brightnessMult).toString(16).padStart(2, '0')}`);
      outerGrad.addColorStop(1, `${saturatedColor}00`);
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Middle glow
      const midRadius = radius * 4 * brightnessMult;
      const midGrad = ctx.createRadialGradient(x, y, 0, x, y, midRadius);
      midGrad.addColorStop(0, `${brightColor}${Math.floor(opacity * 180 * brightnessMult).toString(16).padStart(2, '0')}`);
      midGrad.addColorStop(0.5, `${saturatedColor}${Math.floor(opacity * 100 * brightnessMult).toString(16).padStart(2, '0')}`);
      midGrad.addColorStop(1, `${saturatedColor}00`);
      ctx.fillStyle = midGrad;
      ctx.beginPath();
      ctx.arc(x, y, midRadius, 0, Math.PI * 2);
      ctx.fill();

      // Core - bright center
      const coreRadius = radius * brightnessMult;
      const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, coreRadius);
      coreGrad.addColorStop(0, `${whiteColor}${Math.floor(opacity * 255 * brightnessMult).toString(16).padStart(2, '0')}`);
      coreGrad.addColorStop(0.3, `${brightColor}${Math.floor(opacity * 255 * brightnessMult).toString(16).padStart(2, '0')}`);
      coreGrad.addColorStop(0.7, `${saturatedColor}${Math.floor(opacity * 220 * brightnessMult).toString(16).padStart(2, '0')}`);
      coreGrad.addColorStop(1, `${saturatedColor}00`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawCardGlow = (ctx: CanvasRenderingContext2D, cardState: CardGlowState) => {
      if (!cardState.rect || cardState.intensity < 0.05) return;
      
      const { rect, intensity } = cardState;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxRadius = Math.max(rect.width, rect.height) * 1.2;
      
      // Card glow color - use mint/cyan theme
      const baseHue = 140; // mint
      const currentHue = (140 + Math.sin(timeRef.current * 0.05) * 15 + 360) % 360;
      const saturatedColor = `hsl(${currentHue}, 100%, 55%)`;
      const brightColor = `hsl(${currentHue}, 100%, 70%)`;
      const whiteColor = `hsl(${currentHue}, 100%, 90%)`;
      
      const intensityMult = intensity * intensity; // Quadratic for sharper response
      
      // Outer card glow
      const outerRadius = maxRadius * intensityMult;
      const outerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
      outerGrad.addColorStop(0, `hsla(${currentHue}, 100%, 55%, ${intensityMult * 0.15})`);
      outerGrad.addColorStop(0.5, `hsla(${currentHue}, 100%, 65%, ${intensityMult * 0.08})`);
      outerGrad.addColorStop(1, `hsla(${currentHue}, 100%, 55%, 0)`);
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Middle glow
      const midRadius = maxRadius * 0.7 * intensityMult;
      const midGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, midRadius);
      midGrad.addColorStop(0, `hsla(${currentHue}, 100%, 65%, ${intensityMult * 0.25})`);
      midGrad.addColorStop(0.5, `hsla(${currentHue}, 100%, 55%, ${intensityMult * 0.15})`);
      midGrad.addColorStop(1, `hsla(${currentHue}, 100%, 55%, 0)`);
      ctx.fillStyle = midGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, midRadius, 0, Math.PI * 2);
      ctx.fill();

      // Core - very bright center when mouse is directly over
      if (intensity > 0.7) {
        const coreRadius = Math.min(rect.width, rect.height) * 0.4 * intensityMult;
        const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
        coreGrad.addColorStop(0, `hsla(${currentHue}, 100%, 95%, ${intensityMult * 0.4})`);
        coreGrad.addColorStop(0.3, `hsla(${currentHue}, 100%, 80%, ${intensityMult * 0.3})`);
        coreGrad.addColorStop(0.7, `hsla(${currentHue}, 100%, 60%, ${intensityMult * 0.2})`);
        coreGrad.addColorStop(1, `hsla(${currentHue}, 100%, 55%, 0)`);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      if (!ctx) return;
      timeRef.current += 0.016;

      const w = widthRef.current;
      const h = heightRef.current;

      // Clear with fade
      ctx.fillStyle = "rgba(2, 6, 23, 0.15)";
      ctx.fillRect(0, 0, w, h);

      // Add cursor sparks
      if (mousePosRef.current.x > 0 && mousePosRef.current.y > 0) {
        addCursorSpark(mousePosRef.current.x, mousePosRef.current.y);
      }

      // Update and draw sparks
      const newSparks: Spark[] = [];

      sparksRef.current.forEach((spark) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life++;
        spark.opacity *= 0.92;

        // Physics
        spark.vx *= 0.95;
        spark.vy *= 0.95;
        spark.vy += 0.05; // gentle gravity

        // Subtle wave motion
        spark.x += Math.sin(timeRef.current * 2 + spark.life * 0.08) * 0.3;
        spark.y += Math.cos(timeRef.current * 1.5 + spark.life * 0.06) * 0.2;

        // Draw
        if (spark.opacity > 0.03) {
          drawGlowSpark(ctx, spark);
        }

        if (spark.life < spark.maxLife && spark.opacity > 0.02) {
          newSparks.push(spark);
        }
      });

      sparksRef.current = newSparks;

      // Draw card glows
      cardStates.forEach((state) => {
        drawCardGlow(ctx, state);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
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
  }, [cardStates]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[5] pointer-events-none"
      aria-hidden="true"
    />
  );
}