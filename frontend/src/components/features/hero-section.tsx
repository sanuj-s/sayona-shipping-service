"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCounter } from "@/lib/hooks/use-counter";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { HERO_METRICS } from "@/lib/utils/constants";
import {
  Send, MapPin, Shield, Clock, Headset,
  Target, Globe, Radio, Users,
  Ship, Package
} from "lucide-react";

const metricIcons: Record<string, React.ElementType> = {
  Target, Globe, Radio, Users,
};

/* ─── Animation Variants ─── */
const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Metric Card ─── */
function MetricCard({ value, suffix, label, icon }: { value: number; suffix?: string; label: string; icon: string }) {
  const [ref, isVisible] = useScrollAnimation();
  const count = useCounter({ end: value, duration: 2000, enabled: isVisible });
  const Icon = metricIcons[icon] || Target;

  return (
    <div ref={ref} className="flex items-center gap-3 bg-white/[0.07] backdrop-blur-md rounded-xl px-4 py-3.5 border border-white/[0.08]">
      <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-accent" />
      </div>
      <div>
        <p className="text-lg font-bold text-white leading-none tracking-tight">
          {count}{suffix}
        </p>
        <p className="text-white/50 text-[11px] mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  );
}

/* ─── Dashboard Preview Card ─── */
function DashboardPreview() {
  return (
    <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.1] p-5 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/30 flex items-center justify-center">
            <Ship className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white/80 text-xs font-semibold">Live Tracking</span>
        </div>
        <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Active</span>
      </div>

      {/* Shipment Row */}
      <div className="space-y-2.5">
        {[
          { id: "SYN-7842", route: "Mumbai → Hamburg", status: "In Transit", color: "bg-blue-400" },
          { id: "SYN-7839", route: "Chennai → Dubai", status: "Delivered", color: "bg-emerald-400" },
          { id: "SYN-7836", route: "Tirupur → LA", status: "At Port", color: "bg-violet-400" },
        ].map((s) => (
          <div key={s.id} className="flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <Package className="w-3.5 h-3.5 text-white/40" />
              <div>
                <p className="text-white text-xs font-semibold">{s.id}</p>
                <p className="text-white/40 text-[10px]">{s.route}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
              <span className="text-white/60 text-[10px] font-medium">{s.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/[0.06]">
        <div className="text-center">
          <p className="text-white font-bold text-sm">98%</p>
          <p className="text-white/40 text-[9px] font-medium">On-Time</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">24/7</p>
          <p className="text-white/40 text-[9px] font-medium">Tracking</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">50+</p>
          <p className="text-white/40 text-[9px] font-medium">Countries</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Section ─── */
export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden bg-secondary">
      {/* Background Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 z-[2]" style={{
          background: "linear-gradient(160deg, rgba(7,26,51,0.97) 0%, rgba(7,26,51,0.88) 40%, rgba(7,26,51,0.75) 100%)"
        }} />
        <div className="absolute inset-0 z-[1] opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        {/* Radial Glows */}
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_20%_50%,rgba(232,168,56,0.08),transparent_50%)]" />
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_80%_20%,rgba(11,61,145,0.15),transparent_50%)]" />
        {/* Dot Grid */}
        <div className="absolute inset-0 z-[4] dot-grid opacity-40" />
      </div>

      <Container className="relative z-10 py-16 lg:py-0 w-full">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-center">

          {/* ═══ Left: Content ═══ */}
          <motion.div initial="hidden" animate="show" variants={stagger}>
            {/* Eyebrow Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-md border border-white/[0.12] rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-badge-pulse" />
              <span className="text-white/90 text-[13px] font-semibold tracking-wide">
                Trusted by 500+ Indian Exporters
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-[3.25rem] md:text-[4rem] lg:text-[4.75rem] text-white mb-6 leading-[1.05] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Your Cargo.<br />
              <span className="text-gradient">Our Commitment.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/70 max-w-lg mb-10 leading-relaxed">
              From India to 50+ countries — ocean freight, air cargo &amp; customs clearance delivered with 98% on-time precision.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-10">
              <Link href="/contact#quote">
                <Button variant="accent" size="lg" className="shadow-[var(--shadow-glow-accent)]">
                  <Send className="h-4 w-4" /> Get a Free Quote
                </Button>
              </Link>
              <Link href="/tracking">
                <Button variant="hero-outline" size="lg">
                  <MapPin className="h-4 w-4" /> Track Shipment
                </Button>
              </Link>
            </motion.div>

            {/* Trust Strip */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent/80" /> Fully Insured
              </span>
              <span className="w-px h-4 bg-white/15" />
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent/80" /> Quote in 2 Hours
              </span>
              <span className="w-px h-4 bg-white/15 hidden sm:block" />
              <span className="flex items-center gap-2">
                <Headset className="h-4 w-4 text-accent/80" /> 24/7 Support
              </span>
            </motion.div>
          </motion.div>

          {/* ═══ Right: Dashboard Preview + Metrics ═══ */}
          <motion.div variants={scaleIn} initial="hidden" animate="show" className="hidden lg:flex flex-col gap-4">
            <DashboardPreview />
            <div className="grid grid-cols-2 gap-3">
              {HERO_METRICS.map((metric, i) => (
                <MetricCard key={i} {...metric} />
              ))}
            </div>
          </motion.div>

        </div>
      </Container>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />
    </section>
  );
}
