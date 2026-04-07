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
    <section className="py-16 bg-[var(--background-alt)]">
      <Container>
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-2 md:grid-cols-4 gap-8 text-center transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {TRUST_SIGNALS.map((signal, i) => {
            const Icon = iconMap[signal.icon] || CheckCircle;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <Icon className="h-8 w-8 text-accent mb-1" />
                <h4 className="font-bold text-[var(--foreground)]">{signal.title}</h4>
                <p className="text-sm text-[var(--foreground-secondary)]">{signal.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
