"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface ParallaxState {
  x: number; // -1 to 1
  y: number; // -1 to 1
}

/**
 * useMouseParallax
 * Tracks normalized mouse position within the viewport.
 * Returns { x, y } in range [-1, 1] relative to the center.
 * Perfect for subtle hero depth/tilt effects.
 */
export function useMouseParallax(strength: number = 1): ParallaxState {
  const [pos, setPos] = useState<ParallaxState>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const targetRef = useRef<ParallaxState>({ x: 0, y: 0 });
  const currentRef = useRef<ParallaxState>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { innerWidth: w, innerHeight: h } = window;
    targetRef.current = {
      x: ((e.clientX - w / 2) / (w / 2)) * strength,
      y: ((e.clientY - h / 2) / (h / 2)) * strength,
    };
  }, [strength]);

  useEffect(() => {
    // Smooth lerp loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const cx = lerp(currentRef.current.x, targetRef.current.x, 0.05);
      const cy = lerp(currentRef.current.y, targetRef.current.y, 0.05);

      if (Math.abs(cx - currentRef.current.x) > 0.0001 || Math.abs(cy - currentRef.current.y) > 0.0001) {
        currentRef.current = { x: cx, y: cy };
        setPos({ x: cx, y: cy });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return pos;
}
