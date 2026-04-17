"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { IconBox } from "@/components/ui/icon-box";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { SERVICES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { Ship, Boxes, Plane, FileSignature, Warehouse, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Ship, Boxes, Plane, FileSignature, Warehouse,
};

const variantMap: Record<string, "ocean" | "fcl" | "air" | "customs" | "warehouse"> = {
  Ship: "ocean",
  Boxes: "fcl",
  Plane: "air",
  FileSignature: "customs",
  Warehouse: "warehouse",
};

export function ServicesGrid() {
  return (
    <section id="services" className="py-[var(--spacing-section)] section-bg-subtle">
      <Container>
        <SectionTitle eyebrow="What We Do" title="Our Services" subtitle="End-to-end logistics solutions engineered for reliability, speed, and cost efficiency." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon] || Ship;
            const variant = variantMap[service.icon] || "ocean";
            return (
              <ServiceCard
                key={service.id}
                service={service}
                Icon={Icon}
                variant={variant}
                index={i}
                featured={i === 0}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function ServiceCard({
  service,
  Icon,
  variant,
  index,
  featured,
}: {
  service: (typeof SERVICES)[number];
  Icon: React.ElementType;
  variant: "ocean" | "fcl" | "air" | "customs" | "warehouse";
  index: number;
  featured: boolean;
}) {
  const [ref, isVisible] = useScrollAnimation();
  const num = String(index + 1).padStart(2, "0");

  return (
    <Link href={service.href}>
      <article
        ref={ref}
        className={cn(
          "group relative p-8 rounded-[var(--radius-xl)] bg-[var(--surface)] hover-lift h-full overflow-hidden border border-[var(--border-color)]",
          "hover:border-primary/30 hover:shadow-[var(--shadow-elevated)] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-primary before:to-accent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
          featured && "sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-primary/[0.03] to-transparent",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        {/* Large faded number in gold */}
        <span className="absolute -top-4 -right-2 text-8xl font-black font-display text-accent opacity-[0.04] leading-none select-none pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700">
          {num}
        </span>

        <div className="w-14 h-14 rounded-2xl bg-primary shadow-[var(--shadow-glow-primary)] flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-premium)]">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-primary transition-colors duration-[var(--duration-normal)]">
          {service.title}
        </h3>
        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-8">
          {service.description}
        </p>
        
        <div className="mt-auto">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-accent transition-colors duration-[var(--duration-normal)] uppercase tracking-wide">
            Learn more
            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-[var(--duration-normal)] ease-[var(--ease-premium)]" />
          </span>
        </div>
      </article>
    </Link>
  );
}
