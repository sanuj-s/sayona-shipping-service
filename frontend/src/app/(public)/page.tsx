import { HeroSection } from "@/components/features/hero-section";
import { StatsSection } from "@/components/features/stats-section";
import { ServicesGrid } from "@/components/features/services-grid";
import { HowItWorks } from "@/components/features/how-it-works";
import { AboutSection } from "@/components/features/about-section";
import { IndustriesGrid } from "@/components/features/industries-grid";
import { TrustSignals } from "@/components/features/trust-signals";
import { TestimonialsMarquee } from "@/components/features/testimonials-marquee";
import { FAQSection } from "@/components/features/faq-section";
import { CTASection } from "@/components/features/cta-section";
import { QuoteForm } from "@/components/features/quote-form";
import { ClientMarquee } from "@/components/features/client-marquee";
import { GlobeSection } from "@/components/features/globe-section";
import { Container } from "@/components/ui/container";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* 1. Cinematic Full-Screen Hero */}
      <HeroSection />

      {/* 2. Trust Metrics — Animated Counters with SVG Rings */}
      <StatsSection />

      {/* 3. Partner Logos Marquee */}
      <ClientMarquee />

      {/* 4. Global Network — Interactive Globe + Shipping Routes */}
      <GlobeSection />

      {/* 5. Services — 3D Tilt Cards */}
      <ServicesGrid />

      {/* 6. Process — 5-Step Cinematic Timeline */}
      <HowItWorks />

      {/* 7. Company Identity */}
      <AboutSection />

      {/* 8. Industries */}
      <IndustriesGrid />

      {/* 9. Trust Band */}
      <TrustSignals />

      {/* 10. Social Proof */}
      <TestimonialsMarquee />

      {/* 11. SEO Content */}
      <section className="py-[var(--spacing-section)] bg-[var(--background)]">
        <Container size="sm">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">About</span>
            <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-6">
              India&apos;s Trusted International Shipping Partner
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-[var(--foreground-secondary)] leading-relaxed space-y-4 text-[15px]">
              <p>
                <strong className="text-[var(--foreground)]">Sayona Shipping Services</strong> is a leading international
                freight forwarding and logistics company headquartered in Coimbatore, Tamil Nadu, India. With decades of
                combined industry expertise, we provide end-to-end shipping solutions for businesses across India looking
                to export and import goods worldwide.
              </p>
              <p>
                Our comprehensive logistics services include <strong className="text-[var(--foreground)]">ocean freight (FCL and LCL)</strong>,{" "}
                <strong className="text-[var(--foreground)]">air freight</strong>,{" "}
                <strong className="text-[var(--foreground)]">customs clearance</strong>,{" "}
                <strong className="text-[var(--foreground)]">warehousing and storage</strong>, and complete supply chain management.
              </p>
              <p>
                Sayona Shipping Services operates across <strong className="text-[var(--foreground)]">25+ countries</strong> with
                established trade routes connecting India to the USA, UK, Germany, UAE, China, Japan, and many more. Our 98%
                on-time delivery rate and 500+ satisfied clients speak to our commitment to reliability.
              </p>
              <p>
                Get a{" "}
                <Link href="/contact#quote" className="text-primary font-semibold hover:underline">
                  free shipping quote
                </Link>{" "}
                today or{" "}
                <Link href="/tracking" className="text-primary font-semibold hover:underline">
                  track your shipment
                </Link>{" "}
                in real-time.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 12. FAQ */}
      <FAQSection />

      {/* 13. Cinematic CTA with Particle Background */}
      <CTASection />

      {/* 14. Quote Form */}
      <QuoteForm />
    </>
  );
}
