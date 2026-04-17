"use client";

import { Container } from "@/components/ui/container";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { useCounter } from "@/lib/hooks/use-counter";
import { HOME_STATS } from "@/lib/utils/constants";
import { Users, PackageOpen, Globe, Timer } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StatData } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = { Users, PackageOpen, Globe, Timer };

function StatItem({ stat, index }: { stat: StatData; index: number }) {
  const [ref, isVisible] = useScrollAnimation();
  const count = useCounter({ end: stat.value, duration: 2200, enabled: isVisible });
  const Icon = iconMap[stat.icon] || Globe;

  return (
    <div
      ref={ref}
      className={cn(
        "group relative flex flex-col items-center text-center transition-all duration-1000 ease-[var(--ease-cinematic)]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/[0.04] flex items-center justify-center mb-6 ring-1 ring-primary/10 group-hover:bg-primary/[0.08] transition-colors duration-500">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-5xl md:text-6xl font-display font-black text-[var(--foreground)] tracking-tight leading-none mb-2">
        {count}
        <span className="text-accent">{stat.suffix}</span>
      </h3>
      <p className="text-xs text-[var(--foreground-secondary)] font-bold uppercase tracking-[0.2em]">{stat.label}</p>
    </div>
  );
}

export function StatsSection({ className }: { className?: string }) {
  return (
    <section className={cn("relative py-24 lg:py-32 bg-[var(--background-alt)] border-b border-[var(--border-color)] overflow-hidden", className)}>
      {/* Elegant top light beam bridging from Hero */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_4px_20px_rgba(11,61,145,0.2)]" />
      
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
          {HOME_STATS.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} />
          ))}
          {/* Subtle architectural dividers */}
          <div className="hidden md:block absolute top-1/2 left-1/4 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent" />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent" />
          <div className="hidden md:block absolute top-1/2 left-3/4 -translate-y-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[var(--border-color)] to-transparent" />
        </div>
      </Container>
    </section>
  );
}
