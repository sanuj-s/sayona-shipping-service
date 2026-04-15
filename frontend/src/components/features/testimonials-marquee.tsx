"use client";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { TESTIMONIALS } from "@/lib/utils/constants";
import { Star, StarHalf, Quote } from "lucide-react";

function avatarBg(avatarColor: string) {
  switch (avatarColor) {
    case "success":
      return "var(--color-success)";
    case "primary":
      return "var(--color-primary)";
    case "info":
    default:
      return "var(--color-info)";
  }
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="flex gap-0.5 text-accent">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-current" />
      ))}
      {hasHalf && <StarHalf className="h-3.5 w-3.5 fill-current" />}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="shrink-0 w-[340px] bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-lg)] mx-3 overflow-hidden hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-[var(--duration-normal)]">
      {/* Top gradient bar */}
      <div className="h-[3px] bg-gradient-to-r from-primary via-primary to-accent" />

      <div className="p-6">
        {/* Decorative quote */}
        <Quote className="h-6 w-6 text-accent/15 mb-3 -scale-x-100" />

        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed mb-5">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-[var(--border-color)]"
              style={{ backgroundColor: avatarBg(testimonial.avatarColor) }}
            >
              {testimonial.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-sm text-[var(--foreground)]">{testimonial.name}</div>
              <div className="text-[11px] text-[var(--foreground-secondary)]">
                {testimonial.role}, {testimonial.company}
              </div>
            </div>
          </div>
          <StarRating rating={testimonial.rating} />
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="py-[var(--spacing-section)] overflow-hidden section-bg-subtle">
      <Container className="mb-10">
        <SectionTitle eyebrow="Social Proof" title="What Our Clients Say" subtitle="Trusted by exporters, manufacturers, and traders across India." />
      </Container>

      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee w-max">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
