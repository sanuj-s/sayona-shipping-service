"use client";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { TESTIMONIALS } from "@/lib/utils/constants";
import { Star, StarHalf } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
      {hasHalf && <StarHalf className="h-4 w-4 fill-current" />}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="shrink-0 w-[340px] bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 mx-3 hover:shadow-[var(--shadow-hover)] transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-sm text-[var(--foreground)]">{testimonial.name}</div>
          <div className="text-xs text-[var(--foreground-secondary)]">
            {testimonial.role}, {testimonial.company}
          </div>
        </div>
      </div>

      <StarRating rating={testimonial.rating} />

      <p className="mt-3 text-sm text-[var(--foreground-secondary)] leading-relaxed italic">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
    </div>
  );
}

export function TestimonialsMarquee() {
  // Double the testimonials for seamless loop
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="py-[var(--spacing-section)] overflow-hidden">
      <Container className="mb-8">
        <SectionTitle title="What Our Clients Say" />
      </Container>

      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee w-max">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
