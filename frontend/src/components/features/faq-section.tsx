"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/ui/container";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { FAQS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-[var(--spacing-section)] bg-[var(--background-alt)]">
      <Container>
        <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-16">
          {/* ═══ Left: Context ═══ */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6">
              Everything you need to know about our shipping services, customs clearance, and tracking capabilities.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/[0.05] border border-primary/10">
              <HelpCircle className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-[var(--foreground-secondary)]">
                Can&apos;t find your answer? <a href="/contact" className="text-primary font-semibold hover:underline">Contact us</a>
              </p>
            </div>
          </div>

          {/* ═══ Right: Accordion ═══ */}
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                index={i}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--radius-lg)] border bg-[var(--surface)] overflow-hidden transition-all duration-[var(--duration-normal)]",
        isOpen ? "border-primary/20 shadow-[var(--shadow-soft)]" : "border-[var(--border-color)]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
          {/* Active accent bar */}
          <span className={cn(
            "w-1 h-6 rounded-full transition-all duration-[var(--duration-normal)]",
            isOpen ? "bg-primary" : "bg-transparent"
          )} />
          <span className={cn(
            "text-[15px] font-semibold transition-colors duration-[var(--duration-normal)]",
            isOpen ? "text-primary" : "text-[var(--foreground)]"
          )}>
            {faq.question}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-[var(--foreground-secondary)] shrink-0 transition-transform duration-300",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 pb-5 pl-[52px] text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
