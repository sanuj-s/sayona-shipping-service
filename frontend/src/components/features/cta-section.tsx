"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { cn } from "@/lib/utils/cn";

export function CTASection() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-[var(--spacing-section)] bg-gradient-to-br from-secondary via-secondary to-primary/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,168,56,0.08),transparent_60%)]" />
      <Container>
        <div
          ref={ref}
          className={cn(
            "text-center relative z-10 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Ship Your Cargo?
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Get a competitive quote in under 24 hours and experience premium logistics trusted by 500+ businesses across India.
          </p>
          <Link href="/contact#quote">
            <Button variant="accent" size="lg">Request a Quote Now</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
