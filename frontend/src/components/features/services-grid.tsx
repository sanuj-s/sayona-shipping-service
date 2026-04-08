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
          "group relative p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--surface)] transition-all duration-500 h-full overflow-hidden",
          "hover:border-primary/20 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1",
          featured && "sm:col-span-2 lg:col-span-1",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        {/* Large faded number */}
        <span className="absolute top-4 right-5 text-6xl font-extrabold text-[var(--foreground)] opacity-[0.03] leading-none select-none pointer-events-none">
          {num}
        </span>

        <IconBox variant={variant} className="mb-4 group-hover:scale-105 transition-transform duration-[var(--duration-normal)]">
          <Icon className="h-6 w-6" />
        </IconBox>

        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-primary transition-colors duration-[var(--duration-normal)]">
          {service.title}
        </h3>
        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-5">
          {service.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Learn more
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-[var(--duration-normal)]" />
        </span>
      </article>
    </Link>
  );
}
