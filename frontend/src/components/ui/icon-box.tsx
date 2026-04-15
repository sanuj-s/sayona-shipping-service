import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

interface IconBoxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "ocean" | "air" | "fcl" | "customs" | "warehouse" | "default" | "primary" | "accent";
  size?: "sm" | "md" | "lg";
}

export function IconBox({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}: IconBoxProps) {
  const variantClasses = {
    ocean: "bg-[var(--color-info-light)] text-[var(--color-info)] dark:bg-[var(--color-info-soft)] dark:text-[var(--color-info)]",
    air: "bg-[var(--color-info-light)] text-[var(--color-info)] dark:bg-[var(--color-info-soft)] dark:text-[var(--color-info)]",
    fcl: "bg-primary/10 text-primary dark:bg-[var(--glow-primary)] dark:text-primary",
    customs: "bg-[var(--color-warning-light)] text-[var(--color-warning)] dark:bg-[var(--color-warning-soft)] dark:text-[var(--color-warning)]",
    warehouse: "bg-[var(--color-success-light)] text-[var(--color-success)] dark:bg-[var(--color-success-soft)] dark:text-[var(--color-success)]",
    default: "bg-[var(--background-elevated)] text-[var(--foreground-secondary)] dark:bg-[var(--surface-elevated)] dark:text-[var(--foreground-secondary)]",
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent-soft text-accent-hover",
  };

  const sizeClasses = {
    sm: "w-10 h-10 rounded-lg text-lg",
    md: "w-14 h-14 rounded-xl text-xl",
    lg: "w-18 h-18 rounded-2xl text-2xl",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center shrink-0 transition-transform duration-300",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
