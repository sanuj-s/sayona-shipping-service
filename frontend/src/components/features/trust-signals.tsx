"use client";

import { Container } from "@/components/ui/container";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { TRUST_SIGNALS } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { CheckCircle, ShieldCheck, Handshake, Headset } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  CheckCircle, ShieldCheck, Handshake, Headset,
};

export function TrustSignals() {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className="py-16 bg-secondary/[0.03] border-y border-[var(--border-color)]">
      <Container>
        <div
          ref={ref}
          className={cn(
            "flex flex-wrap justify-center gap-8 md:gap-0 md:divide-x md:divide-[var(--border-color)] transition-[opacity,transform] duration-700 ease-[var(--ease-premium)]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {TRUST_SIGNALS.map((signal, i) => {
            const Icon = iconMap[signal.icon] || CheckCircle;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 px-8 transition-[opacity,transform] duration-500 ease-[var(--ease-premium)]",
                  isVisible ? "opacity-100" : "opacity-0"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/[0.08] flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--foreground)] leading-tight">{signal.title}</h4>
                  <p className="text-xs text-[var(--foreground-secondary)]">{signal.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
