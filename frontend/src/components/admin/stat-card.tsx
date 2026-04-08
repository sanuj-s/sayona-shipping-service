"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon, trend, trendUp, className }: StatCardProps) {
  return (
    <Card variant="elevated" className={cn("group flex items-start justify-between hover:-translate-y-0.5 transition-all duration-[var(--duration-normal)]", className)}>
      <div>
        <p className="text-sm text-[var(--foreground-secondary)] font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-[var(--foreground)] tracking-tight">{value}</h3>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold mt-1.5",
            trendUp ? "text-success" : "text-error"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              trendUp ? "bg-success" : "bg-error"
            )} />
            {trendUp ? "↑" : "↓"} {trend}
          </div>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center shrink-0 group-hover:shadow-[var(--shadow-glow-primary)] transition-shadow duration-[var(--duration-normal)]">
        {icon}
      </div>
    </Card>
  );
}
