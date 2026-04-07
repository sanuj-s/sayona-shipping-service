"use client";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { cn } from "@/lib/utils/cn";

const steps = [
  {
    number: "01",
    title: "Booking & Consultation",
    description: "Share shipment details, cargo type, pickup location, and destination. Our team plans the optimal logistics route.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Documentation & Processing",
    description: "We manage shipping documents, customs clearance, compliance, and coordinate transport and warehousing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Transport & Delivery",
    description: "Your shipment is transported securely with real-time tracking and delivered safely to its destination.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="process" className="py-[var(--spacing-section)] bg-[var(--background-alt)]">
      <Container>
        <SectionTitle title="How It Works" />
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function StepCard({ step, index }: { step: (typeof steps)[number]; index: number }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        "relative text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-10 left-[60%] right-[-40%] h-px border-t-2 border-dashed border-primary/20" />
      )}

      {/* Icon */}
      <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        {step.icon}
      </div>

      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
        {step.number}. {step.title}
      </h3>
      <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed max-w-xs mx-auto">
        {step.description}
      </p>
    </div>
  );
}
