import { HeroSection } from "@/components/features/hero-section";
import { StatsSection } from "@/components/features/stats-section";
import { ServicesGrid } from "@/components/features/services-grid";
import { HowItWorks } from "@/components/features/how-it-works";
import { IndustriesGrid } from "@/components/features/industries-grid";
import { AboutSection } from "@/components/features/about-section";
import { TrustSignals } from "@/components/features/trust-signals";
import { TestimonialsMarquee } from "@/components/features/testimonials-marquee";
import { FAQSection } from "@/components/features/faq-section";
import { CTASection } from "@/components/features/cta-section";
import { QuoteForm } from "@/components/features/quote-form";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Carrier Networks Text */}
      <section className="py-10 bg-[var(--background)]">
        <Container className="text-center">
          <p className="text-[var(--foreground-secondary)] max-w-3xl mx-auto leading-relaxed">
            We move your cargo through leading global networks — ocean freight via Maersk, MSC, CMA CGM and Hapag-Lloyd,
            air freight via Emirates SkyCargo and major Indian carriers.
          </p>
        </Container>
      </section>

      <StatsSection />
      <ServicesGrid />
      <HowItWorks />
      <IndustriesGrid />
      <AboutSection />
      <TrustSignals />
      <TestimonialsMarquee />

      {/* SEO Content */}
      <section className="py-[var(--spacing-section)] bg-[var(--background-alt)]">
        <Container size="sm">
          <SectionTitle title="India's Trusted International Shipping Partner" />
          <div className="prose prose-neutral dark:prose-invert max-w-none text-[var(--foreground-secondary)] leading-relaxed space-y-4 text-[15px]">
            <p>
              <strong className="text-[var(--foreground)]">Sayona Shipping Service</strong> is a leading international
              freight forwarding and logistics company headquartered in Tirupur, Tamil Nadu, India. With decades of
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
              Sayona Shipping Service operates across <strong className="text-[var(--foreground)]">25+ countries</strong> with
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
        </Container>
      </section>

      <FAQSection />
      <CTASection />
      <QuoteForm />
    </>
  );
}
