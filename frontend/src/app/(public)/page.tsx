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
import { Container } from "@/components/ui/container";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* 1. Immediate Value Proposition */}
      <HeroSection />

      {/* 2. Credibility Bar */}
      <StatsSection />

      {/* 3. Trust Marquee — Animated Partner Logos */}
      <ClientMarquee />

      {/* 4. Services */}
      <ServicesGrid />

      {/* 5. Process Clarity */}
      <HowItWorks />

      {/* 6. Company Identity */}
      <AboutSection />

      {/* 7. Industries */}
      <IndustriesGrid />

      {/* 8. Trust Band */}
      <TrustSignals />

      {/* 9. Social Proof */}
      <TestimonialsMarquee />

      {/* 10. SEO Content */}
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

      {/* 11. Objection Handling */}
      <FAQSection />

      {/* 12. Final Conversion */}
      <CTASection />

      {/* 13. Action */}
      <QuoteForm />
    </>
  );
}
