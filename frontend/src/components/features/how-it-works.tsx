"use client";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { cn } from "@/lib/utils/cn";
import { Package, FileText, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Booking & Consultation",
    description: "Share shipment details, cargo type, pickup location, and destination. Our team plans the optimal logistics route.",
    Icon: Package,
  },
  {
    number: "02",
    title: "Documentation & Processing",
    description: "We manage shipping documents, customs clearance, compliance, and coordinate transport and warehousing.",
    Icon: FileText,
  },
  {
    number: "03",
    title: "Transport & Delivery",
    description: "Your shipment is transported securely with real-time tracking and delivered safely to its destination.",
    Icon: Truck,
  },
];

export function HowItWorks() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="process" className="py-[var(--spacing-section)] section-bg-tinted relative overflow-hidden">
      <Container>
        <SectionTitle eyebrow="Our Process" title="How It Works" subtitle="Three simple steps from quote to delivery. No complexity, no surprises." />

        <div ref={ref} className="relative">
          {/* ─── Connector Line (desktop) ─── */}
          <div className="hidden md:block absolute top-[52px] left-[16.66%] right-[16.66%] h-px bg-[var(--border-color)]">
            <div
              className={cn(
                "h-full bg-gradient-to-r from-primary via-primary to-accent origin-left transition-transform duration-1000 ease-out",
                isVisible ? "scale-x-100" : "scale-x-0"
              )}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function StepCard({
  step,
  index,
  isVisible,
}: {
  step: (typeof steps)[number];
  index: number;
  isVisible: boolean;
}) {
  const { Icon } = step;

  return (
    <div
      className={cn(
        "relative text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Number + Icon */}
      <div className="relative mx-auto mb-6">
        {/* Step number (oversized accent) */}
        <span className="block text-5xl font-extrabold text-primary/10 leading-none mb-2 select-none">
          {step.number}
        </span>
        {/* Icon Circle */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/[0.08] border border-primary/10 flex items-center justify-center text-primary relative">
          <Icon className="h-7 w-7" />
          {/* Subtle glow dot */}
          <div className={cn(
            "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-[var(--background)] transition-all duration-500",
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          )} style={{ transitionDelay: `${index * 200 + 500}ms` }} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
        {step.title}
      </h3>
      <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed max-w-[260px] mx-auto">
        {step.description}
      </p>
    </div>
  );
}
