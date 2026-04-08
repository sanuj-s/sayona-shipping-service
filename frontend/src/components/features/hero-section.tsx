"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCounter } from "@/lib/hooks/use-counter";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { HERO_METRICS } from "@/lib/utils/constants";
import {
  Send, MapPin, Shield, Clock, Headset,
  Target, Globe, Radio, Users
} from "lucide-react";

const metricIcons: Record<string, React.ElementType> = {
  Target, Globe, Radio, Users,
};

function MetricCard({ value, suffix, label, icon }: { value: number; suffix?: string; label: string; icon: string }) {
  const [ref, isVisible] = useScrollAnimation();
  const count = useCounter({ end: value, duration: 2000, enabled: isVisible });
  const Icon = metricIcons[icon] || Target;

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-4 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] cursor-default"
    >
      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white leading-none">
          {count}{suffix}
        </h3>
        <p className="text-white/60 text-xs mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

import type { Variants } from "framer-motion";

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-secondary"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 z-10" 
          style={{
            background: "linear-gradient(135deg, rgba(7,26,51,0.95) 0%, rgba(7,26,51,0.85) 50%, rgba(7,26,51,0.7) 100%)"
          }}
        />
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center" 
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(232,168,56,0.15),transparent_50%)]" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_bottom_right,rgba(11,61,145,0.4),transparent_60%)]" />
      </div>

      <Container className="relative z-20 py-20 lg:py-0 w-full">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.12 }
              }
            }}
          >
            {/* Badge */}
            <motion.div variants={item} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-badge-pulse" />
              <span className="text-white/90 text-sm font-semibold tracking-wide">
                Trusted by 500+ Indian Exporters
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={item} className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 drop-shadow-sm" style={{ fontFamily: "var(--font-display)" }}>
              Your Cargo.<br />
              <span className="text-gradient drop-shadow-md">Our Commitment.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={item} className="text-lg md:text-xl text-white/80 max-w-xl mb-8 leading-relaxed font-medium">
              From India to 50+ countries — ocean freight, air cargo &amp; customs clearance delivered with 98% on-time precision.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-4 mb-10">
              <Link href="/contact#quote">
                <Button variant="accent" size="lg" className="px-8 shadow-xl hover:shadow-[0_8px_30px_rgba(232,168,56,0.5)]">
                  <Send className="h-5 w-5" /> Get a Free Quote
                </Button>
              </Link>
              <Link href="/tracking">
                <Button variant="hero-outline" size="lg" className="px-8">
                  <MapPin className="h-5 w-5" /> Track Shipment
                </Button>
              </Link>
            </motion.div>

            {/* Trust Row */}
            <motion.div variants={item} className="flex flex-wrap gap-6 text-white/80 text-sm font-medium bg-white/5 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10 w-fit">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" /> Fully Insured
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" /> Quote in 2 Hours
              </span>
              <span className="flex items-center gap-2">
                <Headset className="h-4 w-4 text-accent" /> 24/7 Support
              </span>
            </motion.div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-4 lg:w-[320px] perspective-1000"
          >
            {HERO_METRICS.map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
