import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = "text",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-[var(--radius-md)]",
    card: "rounded-[var(--radius-lg)] h-48",
  };

  return (
    <div
      className={cn(
        "animate-shimmer",
        variantClasses[variant],
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

// Pre-built skeleton compositions
function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] p-6 space-y-4">
      <Skeleton variant="rectangular" height={160} className="w-full" />
      <Skeleton width="60%" />
      <Skeleton />
      <Skeleton width="80%" />
    </div>
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton height={40} className="w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={52} className="w-full rounded-lg" />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable };
