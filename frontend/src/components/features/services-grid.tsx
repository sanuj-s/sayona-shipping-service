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
    <section id="services" className="py-[var(--spacing-section)]">
      <Container>
        <SectionTitle title="Our Services" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon] || Ship;
            const variant = variantMap[service.icon] || "default";
            return <ServiceCard key={service.id} service={service} Icon={Icon} variant={variant} index={i} />;
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
}: {
  service: (typeof SERVICES)[number];
  Icon: React.ElementType;
  variant: "ocean" | "fcl" | "air" | "customs" | "warehouse";
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <Link href={service.href}>
      <article
        ref={ref}
        className={cn(
          "group p-6 rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--surface)] hover:border-primary/30 hover:shadow-[var(--shadow-hover)] transition-all duration-500 h-full",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        <IconBox variant={variant} className="mb-4 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6" />
        </IconBox>
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-4">
          {service.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Learn more <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </article>
    </Link>
  );
}
