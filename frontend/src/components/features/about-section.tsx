"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { cn } from "@/lib/utils/cn";
import { Ship } from "lucide-react";

export function AboutSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="company" className="py-[var(--spacing-section)]">
      <Container>
        <div
          ref={ref}
          className={cn(
            "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 section-title-bar section-title-bar-left">
              Architects of Global Trade
            </h2>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6">
              Founded in 2020 and backed by decades of combined industry expertise, Sayona Shipping Services
              delivers highly reliable transport, logistics, and global supply chain solutions. We engineer
              fault-tolerant networks to ensure your cargo reaches its destination safely, on time, and within budget.
            </p>
            <Link href="/company">
              <Button variant="outline">Discover Our Infrastructure</Button>
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-[var(--shadow-elevated)]">
              <Image
                src="/images/about/warehouse.jpg"
                alt="Sayona Shipping Warehouse"
                width={600}
                height={400}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-4 lg:-left-8 bg-[var(--surface)] rounded-xl p-4 shadow-[var(--shadow-elevated)] border border-[var(--border-color)] animate-float">
              <Ship className="h-8 w-8 text-primary mb-1" />
              <p className="text-sm font-bold text-[var(--foreground)]">Full Integration</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
