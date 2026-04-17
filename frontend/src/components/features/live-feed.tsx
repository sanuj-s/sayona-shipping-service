"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Ship, Anchor, Truck } from "lucide-react";
import { EASE, DURATION } from "@/lib/motion/variants";

const SIMULATED_EVENTS = [
  { route: "Mumbai → Hamburg", status: "Cleared Customs", icon: Anchor, time: "2m ago" },
  { route: "Chennai → Dubai", status: "Delivered", icon: CheckCircle, time: "5m ago" },
  { route: "Tirupur → Los Angeles", status: "In Transit", icon: Ship, time: "8m ago" },
  { route: "Delhi → London", status: "Picked Up", icon: Truck, time: "12m ago" },
  { route: "Kolkata → Singapore", status: "At Port", icon: Anchor, time: "15m ago" },
  { route: "Bangalore → Tokyo", status: "Delivered", icon: CheckCircle, time: "18m ago" },
  { route: "Ahmedabad → Rotterdam", status: "In Transit", icon: Ship, time: "22m ago" },
  { route: "Pune → Sydney", status: "Cleared Customs", icon: Anchor, time: "25m ago" },
];

export function LiveFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SIMULATED_EVENTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const event = SIMULATED_EVENTS[currentIndex];
  const Icon = event.icon;

  return (
    <div className="inline-flex items-center gap-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-full px-4 py-2 shadow-[var(--shadow-soft)] overflow-hidden max-w-sm">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: DURATION.normal, ease: EASE.premium }}
          className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-secondary)] whitespace-nowrap"
        >
          <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="text-[var(--foreground)] font-semibold">{event.route}</span>
          <span className="opacity-60">·</span>
          <span>{event.status}</span>
          <span className="opacity-40">{event.time}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
