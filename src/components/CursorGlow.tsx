"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const isMobileRef = useRef(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const targetPosRef = useRef({ x: -100, y: -100 });
  const currentPosRef = useRef({ x: -100, y: -100 });
  const hueRef = useRef(0);

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    isMobileRef.current = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || ("ontouchstart" in window);
    mountedRef.current = true;

    if (prefersReducedMotionRef.current) return;

    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotionRef.current) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!mountedRef.current) return;
      const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        targetPosRef.current = { x: clientX, y: clientY };
        if (!visible) setVisible(true);
      }
    };

    const handleLeave = () => {
      if (!isMobileRef.current) setVisible(false);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchstart", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchstart", handleMove);
    };
  }, [visible]);

  // Smooth follow animation (60fps)
  useEffect(() => {
    if (prefersReducedMotionRef.current) return;

    const animate = () => {
      if (!mountedRef.current) return;

      // Lerp for smooth following
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.2;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentPosRef.current.x}px, ${currentPosRef.current.y}px)`;
      }

      // Slow hue rotation
      hueRef.current = (hueRef.current + 0.15) % 360;
      if (cursorRef.current) {
        const hue = hueRef.current;
        cursorRef.current.style.background = `radial-gradient(circle at center, hsla(${hue}, 85%, 65%, 0.9) 0%, hsla(${hue}, 85%, 55%, 0.4) 40%, hsla(${hue}, 85%, 50%, 0) 70%)`;
        cursorRef.current.style.boxShadow = `0 0 16px hsla(${hue}, 85%, 65%, 0.6), 0 0 32px hsla(${hue}, 85%, 55%, 0.3)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (prefersReducedMotionRef.current) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none select-none z-[9999] transition-opacity duration-300"
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        mixBlendMode: "screen",
        willChange: "transform, background, box-shadow",
      }}
      aria-hidden="true"
    />
  );
}