"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { MessageSquare, FileText, Truck, Globe, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Quote Request",
    description: "Share your shipment details online or by phone. Receive a competitive quote within 2 hours.",
    Icon: MessageSquare,
    color: "from-blue-500 to-blue-700",
    glow: "rgba(59,130,246,0.4)",
    accent: "#3b82f6",
  },
  {
    number: "02",
    title: "Documentation",
    description: "We handle all shipping documents — Bill of Lading, certificates, export declarations.",
    Icon: FileText,
    color: "from-purple-500 to-purple-700",
    glow: "rgba(139,92,246,0.4)",
    accent: "#8b5cf6",
  },
  {
    number: "03",
    title: "Customs Clearance",
    description: "Pre-clearance at origin port. Our customs experts ensure zero delays at every border.",
    Icon: Globe,
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.4)",
    accent: "#f59e0b",
  },
  {
    number: "04",
    title: "Ocean / Air Freight",
    description: "Your cargo is loaded and shipped with real-time GPS tracking and 24/7 support.",
    Icon: Truck,
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.4)",
    accent: "#10b981",
  },
  {
    number: "05",
    title: "Delivery Confirmed",
    description: "Safe delivery with proof-of-delivery report, insurance claim support, and post-shipment review.",
    Icon: CheckCircle2,
    color: "from-green-500 to-green-700",
    glow: "rgba(34,197,94,0.4)",
    accent: "#22c55e",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 18, stiffness: 90, mass: 0.5 });
  const lineScale = useTransform(smoothProgress, [0, 0.9], [0, 1]);

  // Animated glowing dot position along the progress line
  const dotX = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="py-[var(--spacing-section)] relative overflow-hidden flex flex-col items-center border-y border-[var(--border-color)]">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[rgba(11,61,145,0.03)] to-[var(--background-alt)]" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,var(--glow-primary),transparent_70%)] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.04),transparent_70%)] pointer-events-none" />

      <Container className="relative z-10">
        <SectionTitle
          eyebrow="Our Process"
          title="Booking to Delivery"
          subtitle="Five seamless steps from first contact to confirmed delivery. Zero complexity, zero surprises."
          align="center"
        />

        <div ref={containerRef} className="relative mt-24">
          {/* ─── Desktop: horizontal connector line ─── */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px]">
            {/* Track */}
            <div className="absolute inset-0 bg-[var(--border-color)]" />
            {/* Animated fill */}
            <motion.div
              style={{ scaleX: lineScale, transformOrigin: "left" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-amber-500 to-green-500"
            />
            {/* Traveling glow dot */}
            <motion.div
              style={{ left: dotX }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_4px_rgba(245,158,11,0.6),0_0_24px_8px_rgba(11,61,145,0.3)] z-10"
            />
          </div>

          <div className="grid md:grid-cols-5 gap-10 lg:gap-6">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} progress={smoothProgress} total={steps.length} />
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
  total,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const { Icon } = step;
  const start = (index / total) * 0.8;
  const end = start + 0.2;

  const y = useTransform(progress, [start, end], [60, 0]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.85, 1]);
  const dotScale = useTransform(progress, [end - 0.05, end], [0, 1]);
  const iconGlow = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className="relative text-center flex flex-col items-center group"
    >
      {/* Step number label */}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl font-black font-display text-[var(--foreground)] opacity-[0.03] leading-none select-none group-hover:opacity-[0.06] transition-opacity duration-500">
        {step.number}
      </span>

      {/* Icon circle with pulsing ring */}
      <div className="relative mx-auto mb-8">
        {/* Outer pulse ring — activates when this step is reached */}
        <motion.div
          style={{ scale: dotScale, opacity: iconGlow, background: `radial-gradient(circle, ${step.glow}, transparent 70%)` }}
          className="absolute -inset-3 rounded-full"
        />

        {/* Icon container */}
        <div
          className={`w-[88px] h-[88px] mx-auto rounded-[2rem] bg-gradient-to-br ${step.color} flex items-center justify-center relative shadow-[0_8px_32px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-500 ease-[var(--ease-premium)]`}
          style={{
            boxShadow: `0 8px 32px 0 ${step.glow}, 0 2px 8px rgba(0,0,0,0.2)`,
          }}
        >
          <Icon className="h-9 w-9 text-white" />

          {/* Completion dot */}
          <motion.div
            style={{ scale: dotScale }}
            className="absolute top-0 right-0 w-4 h-4 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] border-[3px] border-[var(--surface)]"
          />
        </div>
      </div>

      {/* Mobile connector */}
      <div className="md:hidden w-px h-8 bg-gradient-to-b from-[var(--border-color)] to-transparent mb-3" />

      <h3 className="text-base font-bold font-display text-[var(--foreground)] mb-2 tracking-tight">
        {step.title}
      </h3>
      <p className="text-[13px] text-[var(--foreground-secondary)] leading-relaxed max-w-[180px] mx-auto">
        {step.description}
      </p>

      {/* Active indicator dot */}
      <motion.div
        style={{ scaleX: dotScale, opacity: iconGlow, background: step.accent }}
        className="mt-4 h-0.5 w-8 rounded-full mx-auto"
      />
    </motion.div>
  );
}
