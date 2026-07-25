"use client";

import Link from "next/link";
import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic-button";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { cn } from "@/lib/utils/cn";
import { Send, ArrowRight, Globe, Ship, Plane } from "lucide-react";

/* ─── Particle Canvas ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Create particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W();
        if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H();
        if (p.y > H()) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${p.alpha})`;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(11,61,145,${0.08 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

/* ─── Pulsing Globe Ring ─── */
function GlobeRing() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
      <div className="cta-ring w-[300px] h-[300px] rounded-full border border-white/[0.04]" />
      <div className="cta-ring cta-ring-2 absolute inset-[-40px] rounded-full border border-white/[0.03]" />
      <div className="cta-ring cta-ring-3 absolute inset-[-80px] rounded-full border border-white/[0.02]" />
      <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 text-white/[0.03]" />
    </div>
  );
}

/* ─── Floating Logistics Icons ─── */
function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <Ship className="absolute top-[15%] left-[8%] h-16 w-16 text-white/[0.04] animate-float" style={{ animationDelay: "0s" }} />
      <Plane className="absolute top-[20%] right-[10%] h-12 w-12 text-white/[0.04] animate-float" style={{ animationDelay: "1s" }} />
      <Globe className="absolute bottom-[20%] left-[12%] h-14 w-14 text-white/[0.04] animate-float" style={{ animationDelay: "2s" }} />
      <Ship className="absolute bottom-[15%] right-[8%] h-20 w-20 text-white/[0.04] animate-float" style={{ animationDelay: "0.5s" }} />
    </div>
  );
}

export function CTASection() {
  const [ref, isVisible] = useScrollAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="py-[var(--spacing-section)] bg-gradient-to-br from-[#020d1f] via-secondary to-primary/70 relative overflow-hidden"
    >
      {/* Animated particle canvas */}
      <ParticleCanvas />

      {/* Pulsing globe rings */}
      <GlobeRing />

      {/* Floating logistics icons */}
      <FloatingIcons />

      {/* Moving gradient overlay */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-20%] bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none"
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-20" />

      {/* Gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020d1f]/60 via-transparent to-[#020d1f]/40 pointer-events-none" />

      <Container className="relative z-10">
        <div
          ref={ref}
          className={cn(
            "text-center max-w-3xl mx-auto transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-badge-pulse" />
            <span className="text-accent text-xs font-bold uppercase tracking-widest">Start Today</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-[1.1] font-display font-black tracking-tight"
          >
            Ready to Ship Your{" "}
            <span className="text-gradient-cta">Cargo?</span>
          </motion.h2>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/55 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Get a competitive quote in under 2 hours and experience premium logistics trusted by 500+ businesses across India.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Magnetic strength={12}>
              <Link href="/contact#quote">
                <Button
                  variant="accent"
                  size="lg"
                  className="shadow-[0_0_40px_rgba(245,158,11,0.35),0_0_80px_rgba(245,158,11,0.15)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5),0_0_120px_rgba(245,158,11,0.2)] transition-shadow duration-500 animate-glow-pulse sheen"
                >
                  <Send className="h-4 w-4" />
                  Request a Quote Now
                </Button>
              </Link>
            </Magnetic>

            <Magnetic strength={10}>
              <Link href="/tracking">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/15 text-white hover:bg-white/10 backdrop-blur-sm bg-white/[0.05]"
                >
                  Track Shipment
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
          </motion.div>

          {/* Trust micro-copy */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-white/30 text-xs mt-8 tracking-wide"
          >
            No commitment · Free consultation · Quote in 2 hours
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
