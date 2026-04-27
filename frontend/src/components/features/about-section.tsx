"use client";

import Link from "next/link";
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

              <div className="flex flex-wrap gap-3 mb-10">
                {highlights.map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-bold bg-primary text-white shadow-[var(--shadow-glow-primary)] border border-primary-light hover:scale-105 transition-transform cursor-default">
                    <Icon className="h-4 w-4 text-accent" /> {label}
                  </span>
                ))}
              </div>

              <Link href="/company">
                <Button variant="outline" className="border-primary/20 hover:border-primary hover:bg-primary/5 text-primary font-bold">
                  Discover Our Infrastructure
                </Button>
              </Link>
            </div>
          </div>

          {/* ═══ Image Column ═══ */}
          <div className="relative group">
            {/* Decorative offset glowing border */}
            <div className="absolute -inset-4 rounded-2xl border-2 border-primary/20 -rotate-2 hidden lg:block group-hover:-rotate-3 transition-transform duration-700 ease-[var(--ease-cinematic)]" />
            <div className="absolute -inset-4 rounded-2xl border-2 border-accent/30 rotate-2 hidden lg:block group-hover:rotate-3 transition-transform duration-700 ease-[var(--ease-cinematic)]" />
            
            <div className="relative rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-elevated)] ring-1 ring-white/10 group-hover:shadow-[0_40px_80px_rgba(11,61,145,0.2)] transition-shadow duration-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/warehouse.jpg"
                alt="Sayona Shipping Services Warehouse"
                width={600}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-[var(--ease-cinematic)]"
                loading="lazy"
              />
              
              {/* Deep Tint Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-multiply opacity-50 group-hover:opacity-10 transition-opacity duration-700" />
            </div>

            {/* Floating Badge - Made Premium */}
            <div className="absolute -bottom-6 -left-4 lg:-left-8 bg-secondary rounded-[var(--radius-lg)] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 animate-float z-10">
              <Ship className="h-8 w-8 text-accent mb-2 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <p className="text-sm font-black font-display text-white tracking-wide uppercase">Full Integration</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
