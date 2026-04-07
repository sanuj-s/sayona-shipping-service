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
    <Card variant="elevated" className={cn("flex items-start justify-between", className)}>
      <div>
        <p className="text-sm text-[var(--foreground-secondary)] font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-[var(--foreground)]">{value}</h3>
        {trend && (
          <p className={cn(
            "text-xs font-medium mt-1",
            trendUp ? "text-success" : "text-error"
          )}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
    </Card>
  );
}
