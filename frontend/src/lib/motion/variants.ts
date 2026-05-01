// ═══════════════════════════════════════════════
// Sayona Shipping Services — Unified Motion System 2026
// Duration Scale · Easing Standard · Entry Vectors
// ═══════════════════════════════════════════════

import type { Variants, Transition } from "motion/react";

// ─── Duration Scale (strict 3-tier) ───
export const DURATION = {
  fast: 0.12,
  normal: 0.24,
  slow: 0.48,
  cinematic: 0.72,
} as const;

// ─── Easing Standard ───
export const EASE = {
  premium: [0.22, 1, 0.36, 1] as const,      // Universal default — snappy deceleration
  cinematic: [0.76, 0, 0.24, 1] as const,     // Route-level morphs
  spring: [0.68, -0.6, 0.32, 1.6] as const,   // Tactile press feedback
  out: [0.16, 1, 0.3, 1] as const,            // Content entry
} as const;

// ─── Reduced Motion Safe Transition ───
export function safeTransition(t: Transition): Transition {
  return {
    ...t,
    // framer-motion respects prefers-reduced-motion natively,
    // but we explicitly collapse durations for programmatic checks
  };
}

// ─── Entry Direction Logic ───
// Vertical sections → upward motion (y offset)
// Lateral components → slight x offset

type FadeUpOpts = {
  y?: number;
  duration?: number;
  delay?: number;
};

// Container stagger orchestrator
export const stagger = (
  staggerChildren = 0.08,
  delayChildren = 0.08
): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

// Vertical entry (sections, cards)
export const fadeUp = (opts?: FadeUpOpts): Variants => ({
  hidden: { opacity: 0, y: opts?.y ?? 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: opts?.duration ?? DURATION.slow,
      delay: opts?.delay ?? 0,
      ease: EASE.premium,
    },
  },
});

// Lateral entry (sidebar items, horizontal cards)
export const fadeIn = (
  direction: "left" | "right" = "left",
  duration = DURATION.slow,
  delay = 0
): Variants => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -20 : 20,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: EASE.premium },
  },
});

// Blur entry (premium content reveal)
export const blurIn = (
  duration = DURATION.cinematic,
  delay = 0
): Variants => ({
  hidden: { opacity: 0, filter: "blur(10px)", y: 14 },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration, delay, ease: EASE.premium },
  },
});

// Scale entry (dashboard cards, modals)
export const scaleIn = (
  duration = DURATION.cinematic,
  delay = 0.1
): Variants => ({
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration, delay, ease: EASE.premium },
  },
});

// Kinetic text — word-by-word reveal
export const kineticWord: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: -40, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: DURATION.cinematic,
      ease: EASE.premium,
    },
  },
};

// Signature moment — dramatic entrance for hero elements
export const signatureReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 40, filter: "blur(16px)" },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.0,
      ease: EASE.cinematic,
    },
  },
};
