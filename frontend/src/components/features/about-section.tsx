"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { cn } from "@/lib/utils/cn";
import { Ship, Globe, Clock, Award } from "lucide-react";

const highlights = [
  { icon: Clock, label: "5+ Years" },
  { icon: Globe, label: "50+ Countries" },
  { icon: Award, label: "98% On-Time" },
];

export function AboutSection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="company" className="py-[var(--spacing-section)] section-bg-warm">
      <Container>
        <div
          ref={ref}
          className={cn(
            "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* ═══ Text Column ═══ */}
          <div className="relative">
            {/* Accent stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-primary to-accent hidden lg:block" />
            <div className="lg:pl-8">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-6 leading-tight">
                Architects of Global Trade
              </h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6 max-w-lg">
                Founded in 2020 and backed by decades of combined industry expertise, Sayona Shipping Services
                delivers highly reliable transport, logistics, and global supply chain solutions. We engineer
                fault-tolerant networks to ensure your cargo reaches its destination safely, on time, and within budget.
              </p>

              {/* Inline Chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {highlights.map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/[0.06] text-primary border border-primary/10">
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </span>
                ))}
              </div>

              <Link href="/company">
                <Button variant="outline">Discover Our Infrastructure</Button>
              </Link>
            </div>
          </div>

          {/* ═══ Image Column ═══ */}
          <div className="relative">
            {/* Decorative offset border */}
            <div className="absolute -inset-3 rounded-2xl border-2 border-dashed border-primary/10 -rotate-1 hidden lg:block" />
            <div className="relative rounded-xl overflow-hidden shadow-[var(--shadow-elevated)]">
              <Image
                src="/images/about/warehouse.jpg"
                alt="Sayona Shipping Warehouse"
                width={600}
                height={400}
                className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-5 -left-3 lg:-left-6 bg-[var(--surface)] rounded-xl p-4 shadow-[var(--shadow-elevated)] border border-[var(--border-color)] animate-float z-10">
              <Ship className="h-7 w-7 text-primary mb-1" />
              <p className="text-xs font-bold text-[var(--foreground)]">Full Integration</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
