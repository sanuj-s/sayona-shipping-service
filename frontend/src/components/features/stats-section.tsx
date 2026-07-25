"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Container } from "@/components/ui/container";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { useCounter } from "@/lib/hooks/use-counter";
import { HOME_STATS } from "@/lib/utils/constants";
import { Users, PackageOpen, Globe, Timer } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StatData } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = { Users, PackageOpen, Globe, Timer };

/* ─── SVG Progress Ring ─── */
function ProgressRing({
  value,
  max,
  size = 72,
  stroke = 3,
  color = "var(--color-accent)",
  isVisible,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  isVisible: boolean;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);

  return (
    <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden="true">
      {/* Track ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-[var(--border-color)]"
      />
      {/* Filled ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={isVisible ? circumference * (1 - pct) : circumference}
        style={{ transition: "stroke-dashoffset 2.2s cubic-bezier(0.22,1,0.36,1)" }}
        filter={`drop-shadow(0 0 6px ${color})`}
      />
    </svg>
  );
}

/* ─── Stat ring colors ─── */
const RING_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "#10b981",
  "#8b5cf6",
];

function StatItem({ stat, index }: { stat: StatData; index: number }) {
  const [ref, isVisible] = useScrollAnimation();
  const count = useCounter({ end: stat.value, duration: 2400, enabled: isVisible });
  const Icon = iconMap[stat.icon] || Globe;
  const ringColor = RING_COLORS[index % RING_COLORS.length];

  return (
    <div
      ref={ref}
      className={cn(
        "group relative flex flex-col items-center text-center transition-all duration-1000 ease-[var(--ease-cinematic)]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Icon with progress ring */}
      <div className="relative w-[72px] h-[72px] mb-6 flex items-center justify-center">
        <ProgressRing
          value={stat.value}
          max={stat.value}
          isVisible={isVisible}
          color={ringColor}
        />
        <div
          className="w-14 h-14 rounded-2xl bg-[var(--background)] flex items-center justify-center ring-1 ring-[var(--border-color)] group-hover:ring-2 transition-all duration-500"
          style={{ "--ring-color": ringColor } as React.CSSProperties}
        >
          <Icon className="h-6 w-6" style={{ color: ringColor }} />
        </div>
      </div>

      {/* Counter */}
      <h3 className="text-5xl md:text-6xl font-display font-black text-[var(--foreground)] tracking-tight leading-none mb-2">
        {count}
        <span style={{ color: ringColor }}>{stat.suffix}</span>
      </h3>
      <p className="text-xs text-[var(--foreground-secondary)] font-bold uppercase tracking-[0.2em]">{stat.label}</p>

      {/* Hover glow */}
      <div
        className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${ringColor}08, transparent 70%)` }}
      />
    </div>
  );
}

export function StatsSection({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const smoothY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -30]), { damping: 20, stiffness: 80 });

  return (
    <section
      ref={sectionRef}
      className={cn("relative py-24 lg:py-32 bg-[var(--background-alt)] border-b border-[var(--border-color)] overflow-hidden", className)}
    >
      {/* Top light beam */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_4px_20px_rgba(11,61,145,0.2)]" />

      {/* Animated ambient particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="stats-particle absolute rounded-full"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: i % 2 === 0 ? "var(--color-primary)" : "var(--color-accent)",
              opacity: 0.08,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${5 + i}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle mesh gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(11,61,145,0.04),transparent)]" />

      <Container>
        <motion.div
          style={{ y: smoothY }}
          className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 relative z-10"
        >
          {HOME_STATS.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} />
          ))}
          {/* Subtle architectural dividers */}
          <div className="hidden md:block absolute top-1/2 left-1/4 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent" />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent" />
          <div className="hidden md:block absolute top-1/2 left-3/4 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent" />
        </motion.div>
      </Container>
    </section>
  );
}
