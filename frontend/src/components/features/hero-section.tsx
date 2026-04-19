"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic-button";
import { LiveFeed } from "@/components/features/live-feed";
import { useCounter } from "@/lib/hooks/use-counter";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { HERO_METRICS } from "@/lib/utils/constants";
import { stagger, fadeUp, kineticWord, signatureReveal, DURATION, EASE } from "@/lib/motion/variants";
import {
  Send, Search, Shield, Clock, Headset,
  Target, Globe, Radio, Users,
  Ship, Package, ArrowRight, Phone,
} from "lucide-react";
import { LuxuryFluidCanvas } from "@/components/ui/luxury-fluid-canvas";

const metricIcons: Record<string, React.ElementType> = {
  Target, Globe, Radio, Users,
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
    <div className="bg-white/[0.04] backdrop-blur-md rounded-xl border border-white/[0.08] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
            <Ship className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-white/80 text-xs font-semibold">Live Tracking</span>
        </div>
        <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Active</span>
      </div>

      <div className="space-y-2.5">
        {[
          { id: "SYN-7842", route: "Mumbai → Hamburg", status: "In Transit", color: "bg-[var(--color-status-transit)]" },
          { id: "SYN-7839", route: "Chennai → Dubai", status: "Delivered", color: "bg-[var(--color-status-delivered)]" },
          { id: "SYN-7836", route: "Tirupur → LA", status: "At Port", color: "bg-[var(--color-status-warehouse)]" },
        ].map((s) => (
          <div key={s.id} className="flex items-center justify-between bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <Package className="w-3.5 h-3.5 text-white/50" />
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

/* ─── Kinetic Text (word-by-word reveal) ─── */
function KineticHeadline({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      style={{ perspective: "800px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={kineticWord}
          className="inline-block mr-[0.3em]"
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ─── Inline Hero Tracking Input ─── */
function HeroTrackingInput() {
  const [trackingId, setTrackingId] = useState("");
  const router = useRouter();

  const handleTrack = () => {
    const id = trackingId.trim().toUpperCase();
    if (!id) return;
    localStorage.setItem("lastTrackingId", id);
    router.push(`/tracking?id=${id}`);
  };

  return (
    <motion.div
      variants={fadeUp()}
      className="flex items-center gap-0 bg-white/[0.08] backdrop-blur-lg rounded-2xl border border-white/[0.12] p-1.5 max-w-lg w-full shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
    >
      <div className="flex items-center gap-2 flex-1 px-3">
        <Search className="h-4 w-4 text-white/40 shrink-0" />
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          placeholder="Enter Tracking ID..."
          className="bg-transparent text-white placeholder:text-white/30 text-sm font-medium w-full outline-none py-2"
          aria-label="Track shipment by ID"
        />
      </div>
      <Magnetic strength={8}>
        <button
          onClick={handleTrack}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-secondary font-bold text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          Track <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </Magnetic>
    </motion.div>
  );
}

/* ─── Hero Section ─── */
export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden bg-secondary">
      {/* Background Layers — Depth System */}
      <div className="absolute inset-0">
        {/* Layer 1: Base gradient */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-secondary/95 via-secondary/85 to-secondary/70" />
        {/* Layer 2: Image (mid layer) */}
        <div className="absolute inset-0 z-[2] opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        {/* Layer 3: Radial Glows */}
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_20%_50%,var(--glow-accent),transparent_50%)]" />
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_80%_20%,var(--glow-primary),transparent_60%)]" />
        {/* Layer 4: WebGL Canvas */}
        <div className="absolute inset-0 z-[4]">
           <LuxuryFluidCanvas />
        </div>
        {/* Layer 5: Noise texture */}
        <div className="absolute inset-0 z-[5] dot-grid opacity-40 mix-blend-overlay" />
        {/* Layer 6: Subtle vignette */}
        <div className="absolute inset-0 z-[6] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <Container className="relative z-10 py-16 lg:py-0 w-full">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-center">

          {/* ═══ Left: Content ═══ */}
          <motion.div initial="hidden" animate="show" variants={stagger(0.12, 0.1)}>
            {/* Eyebrow */}
            <motion.div variants={fadeUp()} className="inline-flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-md border border-white/[0.12] rounded-full px-4 py-2 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-badge-pulse" />
              <span className="text-white/90 text-[13px] font-semibold tracking-wide">
                Trusted by 500+ Indian Exporters
              </span>
            </motion.div>

            {/* Kinetic Headline */}
            <motion.h1
              variants={stagger(0.06, 0.2)}
              initial="hidden"
              animate="show"
              className="text-[3.25rem] md:text-[4rem] lg:text-[4.75rem] text-white mb-6 leading-[1.05] tracking-tight"
            >
              <KineticHeadline text="Seamless Freight." className="font-light block" />
              <KineticHeadline text="Limitless Reach." className="text-accent font-medium block" />
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp()} className="text-lg md:text-xl text-white/80 max-w-lg mb-10 leading-relaxed font-light">
              From India to 50+ countries — ocean freight, air cargo &amp; customs clearance delivered with 98% on-time precision.
            </motion.p>

            {/* Inline Tracking Input */}
            <div className="mb-6">
              <HeroTrackingInput />
            </div>

            {/* Live Feed Repositioned Here */}
            <motion.div variants={fadeUp()} className="mb-10 scale-95 origin-left">
              <LiveFeed />
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp()} className="flex flex-wrap gap-4 mb-8">
              <Magnetic strength={10}>
                <Link href="/contact#quote">
                  <Button variant="accent" size="lg" className="shadow-[var(--shadow-glow-accent)]">
                    <Send className="h-4 w-4" /> Get a Free Quote
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={10}>
                <Link href="tel:+919876543210">
                  <Button variant="outline" size="lg" className="bg-white/[0.05] border-white/10 text-white hover:bg-white/10 backdrop-blur-sm">
                    <Phone className="h-4 w-4" /> Call Expert Now
                  </Button>
                </Link>
              </Magnetic>
            </motion.div>

            {/* Trust Strip */}
            <motion.div variants={fadeUp()} className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
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
          <motion.div
            variants={signatureReveal}
            initial="hidden"
            animate="show"
            className="hidden lg:flex flex-col gap-4"
          >
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
