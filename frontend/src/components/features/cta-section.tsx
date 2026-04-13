"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { cn } from "@/lib/utils/cn";
import { Globe, Ship } from "lucide-react";

export function CTASection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-[var(--spacing-section)] bg-gradient-to-br from-secondary via-secondary to-primary/80 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06),transparent_60%)]" />
      {/* Dot Grid */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Floating decorative elements */}
      <Globe className="absolute top-12 left-[8%] h-20 w-20 text-white/[0.03] rotate-12" />
      <Ship className="absolute bottom-12 right-[8%] h-24 w-24 text-white/[0.03] -rotate-6" />

      <Container>
        <div
          ref={ref}
          className={cn(
            "text-center relative z-10 max-w-2xl mx-auto transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-5 leading-tight font-display">
            Ready to Ship Your Cargo?
          </h2>
          <p className="text-lg text-white/60 max-w-lg mx-auto mb-8 leading-relaxed">
            Get a competitive quote in under 2 hours and experience premium logistics trusted by 500+ businesses across India.
          </p>
          <Link href="/contact#quote">
            <Button variant="accent" size="lg" className="shadow-[var(--shadow-glow-accent)] animate-glow-pulse">
              Request a Quote Now
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
