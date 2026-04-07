"use client";

import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { TIMELINE } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";

export function Timeline() {
  return (
    <div className="space-y-0">
      {TIMELINE.map((entry, i) => (
        <TimelineItem key={entry.year} entry={entry} index={i} isLast={i === TIMELINE.length - 1} />
      ))}
    </div>
  );
}

function TimelineItem({
  entry,
  index,
  isLast,
}: {
  entry: (typeof TIMELINE)[number];
  index: number;
  isLast: boolean;
}) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-5 transition-all duration-600",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Timeline marker */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
          {entry.year}
        </div>
        {!isLast && <div className="w-px flex-1 bg-[var(--border-color)] min-h-[40px]" />}
      </div>

      {/* Content */}
      <div className="pb-8">
        <h4 className="font-bold text-[var(--foreground)] mb-1">{entry.title}</h4>
        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">{entry.description}</p>
      </div>
    </div>
  );
}
