"use client";

import Link from "next/link";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { SERVICES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import {
  Ship, Boxes, Plane, FileSignature, Warehouse, ArrowRight,
  Anchor, Globe, Clock, CheckCircle,
} from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";

const iconMap: Record<string, React.ElementType> = {
  Ship, Boxes, Plane, FileSignature, Warehouse,
};

const variantAccents: Record<string, string> = {
  Ship: "from-blue-600/20 to-blue-900/5",
  Boxes: "from-purple-600/20 to-purple-900/5",
  Plane: "from-sky-500/20 to-sky-900/5",
  FileSignature: "from-emerald-600/20 to-emerald-900/5",
  Warehouse: "from-amber-500/20 to-amber-900/5",
};

const iconGlows: Record<string, string> = {
  Ship: "shadow-[0_0_24px_rgba(59,130,246,0.35)]",
  Boxes: "shadow-[0_0_24px_rgba(139,92,246,0.35)]",
  Plane: "shadow-[0_0_24px_rgba(14,165,233,0.35)]",
  FileSignature: "shadow-[0_0_24px_rgba(16,185,129,0.35)]",
  Warehouse: "shadow-[0_0_24px_rgba(245,158,11,0.35)]",
};

const serviceHighlights: Record<string, string[]> = {
  Ship: ["FCL & LCL options", "25+ trade lanes", "Real-time tracking"],
  Boxes: ["Full container load", "Port-to-door", "Reefer available"],
  Plane: ["Express & economy", "Perishables handled", "Dangerous goods"],
  FileSignature: ["Pre-clearance", "HS code advisory", "Duty optimization"],
  Warehouse: ["Bonded storage", "Pick & pack", "Inventory mgmt"],
};

export function ServicesGrid() {
  return (
    <section id="services" className="py-[var(--spacing-section)] section-bg-subtle">
      <Container>
        <SectionTitle eyebrow="What We Do" title="Our Services" subtitle="End-to-end logistics solutions engineered for reliability, speed, and cost efficiency." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon] || Ship;
            return (
              <ServiceCard
                key={service.id}
                service={service}
                Icon={Icon}
                index={i}
                featured={i === 0}
                iconKey={service.icon}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function ServiceCard({
  service,
  Icon,
  index,
  featured,
  iconKey,
}: {
  service: (typeof SERVICES)[number];
  Icon: React.ElementType;
  index: number;
  featured: boolean;
  iconKey: string;
}) {
  const [ref, isVisible] = useScrollAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  const num = String(index + 1).padStart(2, "0");

  // 3D tilt state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });
  const glowX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const highlights = serviceHighlights[iconKey] || [];
  const accentGradient = variantAccents[iconKey] || "from-primary/20 to-primary/5";
  const iconGlow = iconGlows[iconKey] || "";

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <Link href={service.href} tabIndex={-1}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d" as React.CSSProperties["transformStyle"],
          perspective: "1200px",
          transitionDelay: `${index * 80}ms`,
        }}
        className={cn(
          "group relative h-full cursor-pointer",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
          "transition-[opacity,transform] duration-700"
        )}
        whileHover={{ z: 10 }}
        tabIndex={0}
        aria-label={service.title}
      >
        {/* Card body */}
        <article
          ref={ref}
          className={cn(
            "relative p-8 rounded-[var(--radius-xl)] bg-[var(--surface)] h-full overflow-hidden border border-[var(--border-color)]",
            "hover:border-primary/25 hover:shadow-[var(--shadow-elevated)] transition-shadow duration-500",
            featured && "sm:col-span-2 lg:col-span-1"
          )}
          style={{ transitionDelay: `${index * 80}ms` }}
        >
          {/* Dynamic mouse-reactive spotlight */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[var(--radius-xl)]"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(11,61,145,0.06) 0%, transparent 60%)`,
            }}
          />

          {/* Top accent gradient */}
          <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500", accentGradient.split(" ")[0], "via-primary to-accent")} />

          {/* Background diagonal gradient */}
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", accentGradient)} />

          {/* Large faded number */}
          <span className="absolute -top-4 -right-2 text-8xl font-black font-display text-accent opacity-[0.04] leading-none select-none pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-700">
            {num}
          </span>

          {/* Icon — 3D elevated */}
          <div
            className={cn(
              "w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 text-white transition-all duration-500 ease-[var(--ease-premium)] group-hover:scale-110",
              iconGlow
            )}
            style={{ transform: "translateZ(20px)" }}
          >
            <Icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Sheen overlay */}
          <div className="sheen absolute inset-0 rounded-[var(--radius-xl)] pointer-events-none" />

          <h3 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-5">
            {service.description}
          </p>

          {/* Feature highlights */}
          {highlights.length > 0 && (
            <ul className="space-y-1.5 mb-6">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-xs text-[var(--foreground-secondary)]">
                  <CheckCircle className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-accent transition-colors duration-300 uppercase tracking-wide">
              Learn more
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300 ease-[var(--ease-premium)]" />
            </span>
          </div>
        </article>
      </motion.div>
    </Link>
  );
}
