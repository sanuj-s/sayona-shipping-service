"use client";

import { Container } from "@/components/ui/container";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { useCounter } from "@/lib/hooks/use-counter";
import { HOME_STATS } from "@/lib/utils/constants";
import { Users, PackageOpen, Globe, Timer } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StatData } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = { Users, PackageOpen, Globe, Timer };

function StatCard({ stat, index }: { stat: StatData; index: number }) {
  const [ref, isVisible] = useScrollAnimation();
  const count = useCounter({ end: stat.value, duration: 2000, enabled: isVisible });
  const Icon = iconMap[stat.icon] || Globe;

  return (
    <div
      ref={ref}
      className={cn(
        "text-center p-6 rounded-xl transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
      <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-1">
        {count}
        <span className="text-accent">{stat.suffix}</span>
      </h2>
      <p className="text-[var(--foreground-secondary)] font-medium">{stat.label}</p>
    </div>
  );
}

export function StatsSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-16 bg-[var(--background-alt)]", className)}>
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HOME_STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
