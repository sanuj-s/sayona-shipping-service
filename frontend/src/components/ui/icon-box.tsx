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
    ocean: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    air: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
    fcl: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    customs: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    warehouse: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    default: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
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
