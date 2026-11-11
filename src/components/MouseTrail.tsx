"use client";

import { useEffect, useRef } from "react";

const MAX_PARTICLES = 120;
const PARTICLE_LIFETIME = 1500; // ms
const FRICTION = 0.98;
const ACCELERATION = 0.3;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  hue: number;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Resize canvas to fill screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  // Track mouse movement using ref (no state re-renders)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize particles
  useEffect(() => {
    particlesRef.current = [];
  }, []);

  // Canvas element and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "0";
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Clear with slight fade for trail effect
      ctx.fillStyle = "rgba(2, 6, 23, 0.3)";
      ctx.fillRect(0, 0, w, h);

      // Update and draw particles
      const newParticles: Particle[] = [];

      particlesRef.current.forEach((p) => {
        // Apply friction and gravity-like acceleration toward mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const distance = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
        const force = ACCELERATION / distance;

        p.vx += (dx * force * (distance > 100 ? 0.1 : 1)) / MAX_PARTICLES;
        p.vy += (dy * force * (distance > 100 ? 0.1 : 1)) / MAX_PARTICLES;

        // Apply friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Update life
        p.life += 16; // ~60fps frame time

        // Keep particle if still alive
        if (p.life < PARTICLE_LIFETIME) {
          // Draw particle - dual circle method
          const progress = p.life / PARTICLE_LIFETIME;
          const alpha = 1 - progress;
          const size = p.radius * alpha;

          // Outer glow circle
          ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Inner core circle
          ctx.fillStyle = `hsla(${p.hue}, 90%, 80%, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();

          newParticles.push(p);
        }
      });

      // Add new particle at mouse position
      if (mx > 0 && my > 0) {
        if (particlesRef.current.length < MAX_PARTICLES) {
          const hue = (Date.now() / 20) % 360;
          particlesRef.current.push({
            x: mx,
            y: my,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            radius: 2 + Math.random() * 3,
            life: 0,
            maxLife: PARTICLE_LIFETIME,
            hue: hue,
          });
        }
      }

      particlesRef.current = newParticles;

      // Continue animation loop
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}