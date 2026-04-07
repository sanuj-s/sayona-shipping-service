"use client";

import { cn } from "@/lib/utils/cn";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  bar?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
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
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold text-[var(--foreground)]",
          bar && (align === "center" ? "section-title-bar" : "section-title-bar section-title-bar-left")
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg text-[var(--foreground-secondary)] leading-relaxed max-w-2xl",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
