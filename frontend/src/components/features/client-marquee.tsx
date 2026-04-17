"use client";

import { motion } from "framer-motion";
import { Ship, Anchor, Globe, Container } from "lucide-react";

const PARTNERS = [
  { name: "Maersk Line", icon: Ship },
  { name: "CMA CGM", icon: Anchor },
  { name: "Hapag-Lloyd", icon: Ship },
  { name: "DHL Global", icon: Globe },
  { name: "MSC", icon: Container },
  { name: "COSCO Shipping", icon: Ship },
  { name: "ONE Line", icon: Anchor },
  { name: "Evergreen Marine", icon: Ship },
  { name: "Yang Ming", icon: Globe },
  { name: "ZIM Integrated", icon: Container },
];

function LogoTile({ name, icon: Icon }: { name: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 mx-3 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover-lift transition-all shrink-0 select-none">
      <div className="w-8 h-8 rounded-lg bg-primary/[0.06] flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary opacity-60" />
      </div>
      <span className="text-sm font-semibold text-[var(--foreground)] whitespace-nowrap">{name}</span>
    </div>
  );
}

export function ClientMarquee() {
  // Double the items for seamless infinite scroll
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section className="py-12 overflow-hidden relative" aria-label="Trusted logistics partners">
      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

      <div className="text-center mb-8">
        <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--foreground-secondary)] opacity-60">
          Trusted by Global Logistics Leaders
        </p>
      </div>

      <motion.div
        className="flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 35,
            ease: "linear",
          },
        }}
      >
        {doubled.map((partner, i) => (
          <LogoTile key={`${partner.name}-${i}`} {...partner} />
        ))}
      </motion.div>
    </section>
  );
}
