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
    <div ref={ref} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-accent" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white leading-none">
          {count}{suffix}
        </h3>
        <p className="text-white/60 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(7,26,51,0.92) 0%, rgba(7,26,51,0.75) 50%, rgba(7,26,51,0.6) 100%), url('/images/hero-bg.jpg') center/cover",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,168,56,0.08),transparent_60%)]" />

      <Container className="relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-badge-pulse" />
              <span className="text-white/80 text-sm font-medium">
                Trusted by 500+ Indian Exporters
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Your Cargo.<br />
              <span className="text-gradient">Our Commitment.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8 leading-relaxed">
              From India to 50+ countries — ocean freight, air cargo &amp; customs clearance delivered with 98% on-time precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/contact#quote">
                <Button variant="accent" size="lg">
                  <Send className="h-4 w-4" /> Get a Free Quote
                </Button>
              </Link>
              <Link href="/tracking">
                <Button variant="hero-outline" size="lg">
                  <MapPin className="h-4 w-4" /> Track Shipment
                </Button>
              </Link>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" /> Fully Insured
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" /> Quote in 2 Hours
              </span>
              <span className="flex items-center gap-2">
                <Headset className="h-4 w-4 text-accent" /> 24/7 Support
              </span>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-3 lg:w-[280px]"
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
