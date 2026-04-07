"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation";
import { INDUSTRIES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { ArrowRight, Shirt, Car, Cpu, HeartPulse, Sprout, Boxes } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Shirt, Car, Cpu, HeartPulse, Sprout, Boxes,
};

export function IndustriesGrid() {
  return (
    <section id="industries" className="py-[var(--spacing-section)]">
      <Container>
        <SectionTitle title="Industries We Serve" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRIES.map((industry, i) => (
            <IndustryCard key={industry.slug} industry={industry} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function IndustryCard({
  industry,
  index,
}: {
  industry: (typeof INDUSTRIES)[number];
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation();
  const Icon = iconMap[industry.icon] || Boxes;

  return (
    <Link href={`/industries/${industry.slug}`}>
      <div
        ref={ref}
        className={cn(
          "group relative h-64 rounded-[var(--radius-lg)] overflow-hidden transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        {/* Background Image */}
        <Image
          src={industry.image}
          alt={industry.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Arrow */}
        <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <ArrowRight className="h-4 w-4" />
        </span>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-3">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{industry.title}</h3>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
            {industry.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
