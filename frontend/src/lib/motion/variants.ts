import type { Variants } from "framer-motion";

type FadeUpOpts = {
  y?: number;
  duration?: number;
  delay?: number;
};

export const stagger: (staggerChildren?: number, delayChildren?: number) => Variants = (
  staggerChildren = 0.08,
  delayChildren = 0.08
) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren, delayChildren } },
});

export const fadeUp: (opts?: FadeUpOpts) => Variants = (opts) => ({
  hidden: { opacity: 0, y: opts?.y ?? 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: opts?.duration ?? 0.7,
      delay: opts?.delay ?? 0,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

export const blurIn: (duration?: number, delay?: number) => Variants = (duration = 0.7, delay = 0) => ({
  hidden: { opacity: 0, filter: "blur(10px)", y: 14 },
  show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration, delay, ease: [0.16, 1, 0.3, 1] } },
});

export const scaleIn: (duration?: number, delay?: number) => Variants = (duration = 0.8, delay = 0.1) => ({
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
  },
});

