"use client";

import { cn } from "@/lib/utils/cn";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "center" | "left";
  className?: string;
  bar?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className,
  bar = true,
}: SectionTitleProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        "mb-12 transition-all duration-700",
        align === "center" && "text-center",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {eyebrow && (
        <span className={cn(
          "inline-block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3",
          align === "center" && "mx-auto"
        )}>
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[var(--foreground)] leading-tight",
          bar && (align === "center" ? "section-title-bar" : "section-title-bar section-title-bar-left")
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-lg text-[var(--foreground-secondary)] leading-relaxed max-w-2xl",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
