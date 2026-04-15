"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotionPref";

export function LuxuryFluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotionPref();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Fallback luxury particle simulation (substituting for WebGPU / .splat model)
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{ x: number, y: number, radius: number, vx: number, vy: number, lightness: number }> = [];
    let animationFrameId: number;
    let lastFrameTs = 0;
    let isVisible = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = window.innerWidth < 768 ? 40 : 100;
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          lightness: Math.random() * 50 + 50
        });
      }
    };

    const onVisibility = () => {
      isVisible = document.visibilityState === "visible";
    };

    const draw = (ts: number) => {
      // Cap to ~30fps to reduce CPU/GPU usage
      if (!isVisible && ts - lastFrameTs < 250) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      if (ts - lastFrameTs < 33) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastFrameTs = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouseXStr = document.documentElement.style.getPropertyValue('--mouse-x');
      const mouseYStr = document.documentElement.style.getPropertyValue('--mouse-y');
      
      const mouseX = mouseXStr ? parseFloat(mouseXStr) : canvas.width / 2;
      const mouseY = mouseYStr ? parseFloat(mouseYStr) : canvas.height / 2;

      particles.forEach(p => {
        // Physics
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction (Magnetic repel/attract)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Luxury glow color (Primary color variant)
        ctx.fillStyle = `hsla(216, 85%, ${p.lightness}%, 0.4)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(216, 85%, 60%, 0.6)`;
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    onVisibility();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-30 mix-blend-screen"
      />
    </motion.div>
  );
}
