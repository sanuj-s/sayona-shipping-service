"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;       // pull distance in px (default 12)
  damping?: number;        // spring damping
  stiffness?: number;      // spring stiffness
  as?: "button" | "div" | "a";
  disabled?: boolean;
  onClick?: () => void;
}

export function Magnetic({
  children,
  className = "",
  strength = 12,
  damping = 20,
  stiffness = 300,
  as = "div",
  disabled = false,
  onClick,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping, stiffness });
  const springY = useSpring(y, { damping, stiffness });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || disabled) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * (strength / rect.width);
      const deltaY = (e.clientY - centerY) * (strength / rect.height);
      x.set(deltaX);
      y.set(deltaY);
    },
    [strength, x, y, disabled]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Respect prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || disabled) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return (
      <Tag className={className} onClick={onClick}>
        {children}
      </Tag>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      data-magnetic
      data-hovered={isHovered}
    >
      {children}
    </motion.div>
  );
}
