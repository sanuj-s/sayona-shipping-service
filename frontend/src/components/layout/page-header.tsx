"use client";

import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/container";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  gradient?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  gradient = false,
  className,
}: PageHeaderProps) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={cn(
        "relative py-20 lg:py-28 text-center overflow-hidden",
        gradient
          ? "bg-gradient-to-br from-secondary via-secondary/95 to-primary/80 text-white"
          : "bg-[var(--background-alt)]",
        className
      )}
    >
      {gradient && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.1),transparent_50%)]" />
      )}
      <Container
        className={cn(
          "relative z-10 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        {badge && (
          <span
            className={cn(
              "inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
              gradient
                ? "bg-white/10 text-white/90 border border-white/20"
                : "bg-primary/10 text-primary"
            )}
          >
            {badge}
          </span>
        )}
        <h1
          className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold mb-4",
            gradient ? "text-white" : "text-[var(--foreground)]"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "text-lg md:text-xl max-w-2xl mx-auto leading-relaxed",
              gradient ? "text-white/80" : "text-[var(--foreground-secondary)]"
            )}
          >
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
