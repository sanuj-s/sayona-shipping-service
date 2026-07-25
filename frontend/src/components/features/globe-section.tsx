"use client";

import { Suspense } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { InteractiveGlobe } from "@/components/features/interactive-globe";

/* ─── Shipping Routes Data ─── */
const ROUTES = [
  { from: "Mumbai, India", to: "Hamburg, Germany", days: "18-22 days", flag: "🇮🇳→🇩🇪" },
  { from: "Chennai, India", to: "Dubai, UAE", days: "5-7 days", flag: "🇮🇳→🇦🇪" },
  { from: "Nhava Sheva", to: "Los Angeles, USA", days: "22-26 days", flag: "🇮🇳→🇺🇸" },
  { from: "Kolkata, India", to: "Singapore", days: "8-10 days", flag: "🇮🇳→🇸🇬" },
  { from: "Mundra, India", to: "London, UK", days: "24-28 days", flag: "🇮🇳→🇬🇧" },
  { from: "Cochin, India", to: "Shanghai, China", days: "12-14 days", flag: "🇮🇳→🇨🇳" },
];

/* ─── Network Stats ─── */
const NETWORK_STATS = [
  { value: "25+", label: "Countries" },
  { value: "50+", label: "Port Hubs" },
  { value: "500+", label: "Clients" },
  { value: "98%", label: "On-Time" },
];

/* ─── Route Card ─── */
function RouteCard({ route, index }: { route: typeof ROUTES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-accent/20 rounded-xl px-4 py-3 transition-all duration-300 cursor-default"
    >
      <div>
        <p className="text-white/80 text-xs font-semibold">{route.flag}</p>
        <p className="text-white/50 text-[11px] mt-0.5">{route.from} → {route.to}</p>
      </div>
      <span className="text-accent text-[11px] font-bold bg-accent/10 px-2.5 py-1 rounded-full whitespace-nowrap">
        {route.days}
      </span>
    </motion.div>
  );
}

/* ─── Globe Section ─── */
export function GlobeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const smoothY = useSpring(y, { damping: 20, stiffness: 80 });

  return (
    <section
      ref={sectionRef}
      id="global-network"
      className="relative py-[var(--spacing-section)] overflow-hidden bg-secondary"
      aria-label="Global shipping network"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-secondary/95 to-[var(--background)]" />
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(11,61,145,0.2),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.04),transparent_70%)] pointer-events-none" />

      {/* Pulsing ring behind globe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div className="w-[520px] h-[520px] rounded-full border border-white/[0.04] globe-ring-1" />
        <div className="absolute inset-[-40px] rounded-full border border-white/[0.03] globe-ring-2" />
        <div className="absolute inset-[-80px] rounded-full border border-white/[0.02] globe-ring-3" />
      </div>

      <Container className="relative z-10">
        <SectionTitle
          eyebrow="Global Network"
          title="India to the World"
          subtitle="Real-time cargo visibility across 25+ countries. One partner, every port."
          align="center"
          className="[&_h2]:text-white [&_span]:text-accent [&_p]:text-white/60"
        />

        {/* Network stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center gap-8 mb-16"
        >
          {NETWORK_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-accent font-display">{stat.value}</p>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Main layout: routes | globe | routes */}
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">

          {/* Left: Routes from India */}
          <div className="space-y-2.5 hidden lg:block">
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-4">Active Routes</p>
            {ROUTES.slice(0, 3).map((r, i) => (
              <RouteCard key={i} route={r} index={i} />
            ))}
          </div>

          {/* Center: Globe */}
          <motion.div
            style={{ y: smoothY }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Ambient glow beneath globe */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-[radial-gradient(ellipse_at_center,rgba(11,61,145,0.4),transparent_70%)] blur-xl pointer-events-none" />
              <Suspense fallback={
                <div className="w-[420px] h-[420px] rounded-full bg-primary/10 border border-white/5 flex items-center justify-center">
                  <span className="text-white/20 text-sm">Loading globe...</span>
                </div>
              }>
                <InteractiveGlobe className="w-[380px] lg:w-[420px]" />
              </Suspense>

              {/* India origin pin */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                className="absolute top-[42%] right-[28%] flex items-center gap-1.5"
              >
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
                  <div className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                </div>
                <span className="text-[10px] font-bold text-accent/90 bg-secondary/80 backdrop-blur-sm px-1.5 py-0.5 rounded whitespace-nowrap">India Hub</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: More routes */}
          <div className="space-y-2.5 hidden lg:block">
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-4">Destinations</p>
            {ROUTES.slice(3).map((r, i) => (
              <RouteCard key={i} route={r} index={i + 3} />
            ))}
          </div>

          {/* Mobile: All routes */}
          <div className="lg:hidden col-span-1 space-y-2.5">
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-4">Active Routes</p>
            {ROUTES.map((r, i) => (
              <RouteCard key={i} route={r} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-white/25 text-xs mt-12 tracking-widest uppercase"
        >
          Drag to rotate · Real-time port markers
        </motion.p>
      </Container>
    </section>
  );
}
