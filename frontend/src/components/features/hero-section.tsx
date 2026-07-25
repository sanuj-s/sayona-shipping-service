"use client";

import React, { useRef, Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic-button";
import { LiveFeed } from "@/components/features/live-feed";
import { useCounter } from "@/lib/hooks/use-counter";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { useMouseParallax } from "@/lib/hooks/use-mouse-parallax";
import { HERO_METRICS } from "@/lib/utils/constants";
import { stagger, fadeUp, kineticWord, signatureReveal, DURATION, EASE } from "@/lib/motion/variants";
import {
  Send, Search, Shield, Clock, Headset,
  Target, Globe, Radio, Users,
  Ship, Package, ArrowRight, Phone,
  MapPin,
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

/* ─── Animated Route Pins ─── */
const ROUTES = [
  { label: "Mumbai → Hamburg", delay: 0.5 },
  { label: "Chennai → Dubai", delay: 0.7 },
  { label: "Tirupur → Los Angeles", delay: 0.9 },
];

function RoutePins() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 1.4 } } }}
      className="flex flex-wrap gap-2"
    >
      {ROUTES.map((r) => (
        <motion.div
          key={r.label}
          variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
          className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full px-3 py-1.5 text-[11px] font-medium text-white/70 backdrop-blur-sm"
        >
          <MapPin className="h-3 w-3 text-accent" />
          {r.label}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Cinematic Video Background ─── */
function CinematicBackground({ parallaxX, parallaxY }: { parallaxX: number; parallaxY: number }) {
  return (
    <div className="absolute inset-0">
      {/* Layer 1: Deep base gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#020d1f] via-secondary/95 to-[#071e3d]" />

      {/* Layer 2: Video background (falls back gracefully) */}
      <div className="absolute inset-0 z-[2] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-bg.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-25 scale-110"
          style={{
            transform: `scale(1.12) translate(${parallaxX * -8}px, ${parallaxY * -8}px)`,
            transition: "transform 0.1s linear",
          }}
          aria-hidden="true"
        >
          {/* Add your mp4 video here when available */}
          {/* <source src="/videos/hero-ship.mp4" type="video/mp4" /> */}
        </video>
        {/* Fallback animated gradient when no video */}
        <div className="absolute inset-0 hero-animated-gradient opacity-40" />
      </div>

      {/* Layer 3: Cinematic radial glows — parallax reactive */}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: `radial-gradient(ellipse at ${50 + parallaxX * 5}% ${50 + parallaxY * 5}%, rgba(11,61,145,0.35), transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background: `radial-gradient(ellipse at ${80 + parallaxX * 3}% ${20 + parallaxY * 3}%, rgba(245,158,11,0.12), transparent 50%)`,
        }}
      />

      {/* Layer 4: WebGL Canvas */}
      <div className="absolute inset-0 z-[4]">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />}>
          <LuxuryFluidCanvas />
        </Suspense>
      </div>

      {/* Layer 5: Dot grid */}
      <div className="absolute inset-0 z-[5] dot-grid opacity-30 mix-blend-overlay" />

      {/* Layer 6: Floating particles */}
      <div className="absolute inset-0 z-[5] hero-particles pointer-events-none" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${6 + i * 1.5}s`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      {/* Layer 7: Vignette */}
      <div className="absolute inset-0 z-[6] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}

/* ─── Hero Section ─── */
export function HeroSection() {
  const { x: pX, y: pY } = useMouseParallax(1);

  return (
    <section id="hero" className="relative min-h-[96vh] flex items-center overflow-hidden bg-[#020d1f]">
      <CinematicBackground parallaxX={pX} parallaxY={pY} />

      <Container className="relative z-10 py-20 lg:py-0 w-full">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-center">

          {/* ═══ Left: Content ═══ */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger(0.12, 0.1)}
            style={{
              transform: `translate(${pX * -6}px, ${pY * -6}px)`,
              transition: "transform 0.15s linear",
            }}
          >
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
              <span className="sr-only">International Shipping &amp; Freight Forwarding from India – Sayona Shipping Services</span>
              <KineticHeadline text="The Architecture" className="font-light block" aria-hidden="true" />
              <KineticHeadline text="Of Global Trade." className="text-accent font-medium block" aria-hidden="true" />
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp()} className="text-lg md:text-xl text-white/80 max-w-lg mb-8 leading-relaxed font-light">
              From India to 50+ countries — ocean freight, air cargo &amp; customs clearance delivered with 98% on-time precision.
            </motion.p>

            {/* Route Pills */}
            <motion.div variants={fadeUp()} className="mb-8">
              <RoutePins />
            </motion.div>

            {/* Inline Tracking Input */}
            <div className="mb-6">
              <HeroTrackingInput />
            </div>

            {/* Live Feed */}
            <motion.div variants={fadeUp()} className="mb-10 scale-95 origin-left">
              <LiveFeed />
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp()} className="flex flex-wrap gap-4 mb-8">
              <Magnetic strength={10}>
                <Link href="/contact#quote">
                  <Button variant="accent" size="lg" className="shadow-[var(--shadow-glow-accent)] sheen relative overflow-hidden">
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
            style={{
              transform: `translate(${pX * 8}px, ${pY * 6}px)`,
              transition: "transform 0.15s linear",
            }}
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

      {/* Cinematic bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-hero-scroll-line" />
      </motion.div>
    </section>
  );
}
