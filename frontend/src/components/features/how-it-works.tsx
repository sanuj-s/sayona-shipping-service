"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Package, FileText, Truck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100, mass: 0.5 });
  const lineScale = useTransform(smoothProgress, [0, 0.8], [0, 1]);

  return (
    <section id="process" className="py-[var(--spacing-section)] section-bg-tinted relative overflow-hidden flex flex-col items-center">
      <Container>
        <SectionTitle eyebrow="Our Process" title="How It Works" subtitle="Three simple steps from quote to delivery. No complexity, no surprises." />

        <div ref={containerRef} className="relative mt-16 perspective-[1200px]">
          {/* Connector Line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[16.66%] right-[16.66%] h-[2px] bg-[var(--border-color)]">
            <motion.div
              style={{ scaleX: lineScale, transformOrigin: "left" }}
              className="h-full bg-gradient-to-r from-primary via-primary to-accent"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} progress={smoothProgress} />
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
  progress,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: any;
}) {
  const { Icon } = step;
  
  // Tactical offsets based on index
  const start = index * 0.25;
  const end = start + 0.3;

  const y = useTransform(progress, [start, end], [100, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const rotateX = useTransform(progress, [start, end], [45, 0]);
  const scale = useTransform(progress, [start, end], [0.8, 1]);
  const dotScale = useTransform(progress, [end, end + 0.1], [0, 1]);

  return (
    <motion.div
      style={{ y, opacity, rotateX, scale }}
      className="relative text-center flex flex-col items-center transform-style-3d"
    >
      <div className="relative mx-auto mb-6 group cursor-default" data-magnetic>
        <span className="block text-5xl font-extrabold text-primary/10 leading-none mb-2 select-none group-hover:text-primary/20 transition-colors">
          {step.number}
        </span>
        <div className="w-16 h-16 mx-auto rounded-2xl glass-3d flex items-center justify-center text-primary relative shadow-lg group-hover:shadow-primary/20 transition-shadow">
          <Icon className="h-7 w-7" />
          <motion.div 
            style={{ scale: dotScale }}
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-[var(--background)]" 
          />
        </div>
      </div>

      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
        {step.title}
      </h3>
      <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed max-w-[260px] mx-auto">
        {step.description}
      </p>
    </motion.div>
  );
}
