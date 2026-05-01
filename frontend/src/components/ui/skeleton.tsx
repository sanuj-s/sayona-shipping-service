import { cn } from "@/lib/utils/cn";
import { motion, type HTMLMotionProps } from "motion/react";

interface SkeletonProps extends HTMLMotionProps<"div"> {
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
    <motion.div
      layout
      transition={{ opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }, layout: { type: "spring", stiffness: 100, damping: 20 } }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      className={cn(
        "relative overflow-hidden bg-[var(--background-alt)] pointer-events-none",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent",
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
