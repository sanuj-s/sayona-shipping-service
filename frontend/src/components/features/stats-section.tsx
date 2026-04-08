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
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] tracking-tight leading-none">
        {count}
        <span className="text-accent">{stat.suffix}</span>
      </h3>
      <p className="text-sm text-[var(--foreground-secondary)] font-medium mt-2">{stat.label}</p>
      {/* Accent underline */}
      <div className="mt-3 h-0.5 w-8 rounded-full overflow-hidden bg-[var(--border-color)]">
        <div
          className={cn(
            "h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out",
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
    <section className={cn("relative py-20 overflow-hidden", className)}>
      {/* Background gradient sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent" />
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative">
          {HOME_STATS.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} />
          ))}
          {/* Vertical dividers (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-1/4 -translate-y-1/2 w-px h-16 bg-[var(--border-color)]" />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 w-px h-16 bg-[var(--border-color)]" />
          <div className="hidden md:block absolute top-1/2 left-3/4 -translate-y-1/2 w-px h-16 bg-[var(--border-color)]" />
        </div>
      </Container>
    </section>
  );
}
