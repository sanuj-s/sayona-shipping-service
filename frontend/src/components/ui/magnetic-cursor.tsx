"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Custom cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring configurations for "heavy/luxurious" feel
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only render custom cursor on pointer devices (not touch)
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setIsVisible(true);

    let isMagnetic = false;
    let currentTarget: HTMLElement | null = null;

    const moveCursor = (e: MouseEvent) => {
      if (isMagnetic && currentTarget) {
        // Pull cursor toward the center of the magnetic target
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const center = { x: left + width / 2, y: top + height / 2 };
        
        // Calculate distance from center
        const distance = { x: e.clientX - center.x, y: e.clientY - center.y };
        
        // Define pull strength (the larger the number, the weaker the pull -> 0 = lock to center)
        const pullStrength = 0.25; 
        
        cursorX.set(center.x + distance.x * pullStrength - 16);
        cursorY.set(center.y + distance.y * pullStrength - 16);
      } else {
        // Normal following
        cursorX.set(e.clientX - 16);
        cursorY.set(e.clientY - 16);
      }
    };

    const mouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-magnetic]");
      if (target) {
        isMagnetic = true;
        currentTarget = target as HTMLElement;
      }
    };

    const mouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-magnetic]");
      if (target) {
        isMagnetic = false;
        currentTarget = null;
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", mouseOver, { passive: true });
    window.addEventListener("mouseout", mouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", mouseOver);
      window.removeEventListener("mouseout", mouseOut);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-[2px] pointer-events-none z-[10000] mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
}
