"use client";


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { cn } from "@/lib/utils/cn";
import type { ServiceData } from "@/lib/types";

export function ServiceBlock({ service, reversed }: { service: ServiceData; reversed?: boolean }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      id={service.id}
      className={cn(
        "grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 transition-all duration-700",
        reversed && "lg:[direction:rtl] lg:[&>*]:[direction:ltr]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Text */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-4">
          {service.title}
        </h2>
        <p className="text-[var(--foreground-secondary)] leading-relaxed mb-5">
          {service.description}
        </p>
        <ul className="space-y-2.5 mb-6">
          {service.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--foreground-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <Link href="/contact">
          <Button variant="primary">Request Quote</Button>
        </Link>
      </div>

      {/* Image */}
      <div className="rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-elevated)]">
        <img
          src={service.image}
          alt={service.title}
          width={600}
          height={400}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      </div>
    </div>
  );
}
