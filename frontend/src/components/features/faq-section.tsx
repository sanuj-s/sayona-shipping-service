"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { FAQS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-[var(--spacing-section)] bg-[var(--background-alt)]">
      <Container size="sm">
        <SectionTitle title="Frequently Asked Questions" />
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
        "rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--surface)] overflow-hidden transition-all duration-500",
        isOpen && "border-primary/30 shadow-[var(--shadow-soft)]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
      >
        <span className="text-[15px] font-semibold text-[var(--foreground)] pr-4">
          {faq.question}
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
            <div className="px-6 pb-5 text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
