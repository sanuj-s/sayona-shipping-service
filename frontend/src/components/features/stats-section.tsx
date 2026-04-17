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
        "relative flex flex-col items-center text-center transition-all duration-700",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      )}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-3 ring-1 ring-accent/30 shadow-[var(--shadow-glow-accent)]">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
        {count}
        <span className="text-accent">{stat.suffix}</span>
      </h3>
      <p className="text-sm text-white/70 font-medium mt-2 uppercase tracking-widest">{stat.label}</p>
      {/* Accent underline */}
      <div className="mt-4 h-[3px] w-12 rounded-full overflow-hidden bg-white/10">
        <div
          className={cn(
            "h-full bg-gradient-to-r from-accent/50 to-accent transition-[width] duration-[var(--duration-xslow)] ease-[var(--ease-premium)]",
            isVisible ? "w-full" : "w-0"
          )}
          style={{ transitionDelay: `${index * 120 + 400}ms` }}
        />
      </div>
    </div>
  );
}

export function StatsSection({ className }: { className?: string }) {
  return (
    <section className={cn("relative z-20 -mt-20 pb-16 lg:-mt-24 lg:pb-20", className)}>
      <Container>
        <div className="bg-secondary/80 backdrop-blur-2xl border border-white/10 rounded-[var(--radius-xl)] shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-10 md:p-14 relative overflow-hidden">
          {/* Ambient Glows bridging from Hero */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(ellipse_at_center,var(--glow-accent),transparent_60%)] opacity-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(ellipse_at_center,var(--glow-primary),transparent_60%)] opacity-30 pointer-events-none" />
          <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 relative z-10">
            {HOME_STATS.map((stat, i) => (
              <StatItem key={i} stat={stat} index={i} />
            ))}
            {/* Vertical dividers (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-1/4 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            <div className="hidden md:block absolute top-1/2 left-3/4 -translate-y-1/2 w-px h-20 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          </div>
        </div>
      </Container>
    </section>
  );
}
