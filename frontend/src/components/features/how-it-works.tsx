"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center center"]
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100, mass: 0.5 });
  const lineScale = useTransform(smoothProgress, [0, 0.8], [0, 1]);

  return (
    <section id="process" className="py-[var(--spacing-section)] relative overflow-hidden flex flex-col items-center border-y border-[var(--border-color)]">
      {/* Dynamic background mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[rgba(11,61,145,0.02)] to-[var(--background-alt)]" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,var(--glow-primary),transparent_70%)] opacity-30 pointer-events-none" />

      <Container className="relative z-10">
        <SectionTitle eyebrow="Our Process" title="How It Works" subtitle="Three simple steps from quote to delivery. No complexity, no surprises." align="center" />

        <div ref={containerRef} className="relative mt-24 perspective-[1200px]">
          {/* Connector Line (desktop) - now a glowing beam */}
          <div className="hidden md:block absolute top-[44px] left-[16.66%] right-[16.66%] h-[2px] bg-[var(--border-color)] shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <motion.div
              style={{ scaleX: lineScale, transformOrigin: "left" }}
              className="h-full bg-gradient-to-r from-primary via-primary to-accent shadow-[0_0_20px_var(--color-accent)]"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-16 lg:gap-20">
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
  progress: MotionValue<number>;
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
      className="relative text-center flex flex-col items-center transform-style-3d group"
    >
      <div className="relative mx-auto mb-8 cursor-default" data-magnetic>
        {/* Kinetic huge number behind icon */}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-8xl font-black font-display text-[var(--foreground)] opacity-[0.02] leading-none mb-2 select-none group-hover:text-primary transition-colors duration-700 group-hover:opacity-[0.05]">
          {step.number}
        </span>
        
        <div className="w-24 h-24 mx-auto rounded-[2rem] bg-[var(--surface)] flex items-center justify-center text-primary relative shadow-[var(--shadow-elevated)] group-hover:shadow-[0_20px_40px_rgba(11,61,145,0.15)] transition-shadow duration-[var(--duration-xslow)] ease-[var(--ease-cinematic)] border border-[var(--border-color)] group-hover:border-primary/30">
          <Icon className="h-10 w-10 text-primary group-hover:scale-110 group-hover:text-accent transition-all duration-[var(--duration-slow)]" />
          
          <motion.div 
            style={{ scale: dotScale }}
            className="absolute top-0 right-0 w-4 h-4 rounded-full bg-gradient-to-tr from-accent to-accent-hover shadow-[0_0_15px_var(--color-accent)] border-[3px] border-[var(--surface)]" 
          />
        </div>
      </div>

      <h3 className="text-xl font-bold font-display text-[var(--foreground)] mb-3 tracking-tight">
        {step.title}
      </h3>
      <p className="text-[15px] text-[var(--foreground-secondary)] leading-relaxed max-w-[280px] mx-auto">
        {step.description}
      </p>
    </motion.div>
  );
}
