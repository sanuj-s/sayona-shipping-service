import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/features/contact-form";
import { SITE } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Contact Us / Get a Quote",
  description:
    "Get a free shipping quote from Sayona Shipping Services. Instant rates for international cargo, ocean & air freight from India.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Get a Quote"
        subtitle="Tell us about your shipment and we will provide a competitive rate within 24 hours."
      />

      {/* Contact Form */}
      <section id="quote" className="py-[var(--spacing-section)] bg-[var(--background-alt)]">
        <Container size="sm">
          <ContactForm />
        </Container>
      </section>

      {/* Contact Info */}
      <section className="py-[var(--spacing-section)]">
        <Container size="sm">
          <SectionTitle title="Reach Us" />
          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            <Card variant="elevated" className="text-center">
              <h4 className="font-bold text-primary mb-2">Email</h4>
              <p className="text-sm text-[var(--foreground-secondary)]">{SITE.email}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">{SITE.salesEmail}</p>
            </Card>
            <Card variant="elevated" className="text-center">
              <h4 className="font-bold text-primary mb-2">Phone</h4>
              <p className="text-sm text-[var(--foreground-secondary)]">{SITE.phoneDisplay}</p>
              <p className="text-xs text-primary font-medium mt-1">{SITE.contactPerson}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">Mon-Sat, 9am - 7pm IST</p>
            </Card>
            <Card variant="elevated" className="text-center">
              <h4 className="font-bold text-primary mb-2">Headquarters</h4>
              <p className="text-sm text-[var(--foreground-secondary)]">{SITE.address.street},</p>
              <p className="text-sm text-[var(--foreground-secondary)]">{SITE.address.city}, {SITE.address.state}</p>
            </Card>
          </div>

          {/* Support UX & SLA */}
          <SectionTitle title="Support Operations" className="mt-20" />
          <div className="grid sm:grid-cols-2 gap-5 mb-16">
            <Card className="p-6 bg-white/[0.02]">
              <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-accent" /> Guaranteed SLA
              </h4>
              <p className="text-sm text-[var(--foreground-secondary)] mb-4">
                Enterprise clients receive priority routing. All quotes are returned within 2 hours. Customs clearance initiated immediately upon document receipt.
              </p>
            </Card>
            <Card className="p-6 bg-white/[0.02]">
              <h4 className="font-bold text-error flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-error" /> Escalation Path
              </h4>
              <p className="text-sm text-[var(--foreground-secondary)] mb-4">
                For shipments encountering severe delays or exceptions, our 24/7 incident response team is available.
              </p>
              <a href="mailto:escalations@sayonashipping.com" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                escalations@sayonashipping.com
              </a>
            </Card>
          </div>

          {/* Map */}
          <div className="rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-soft)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655.228551711208!2d77.34685031548842!3d11.127622919106093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907ab0bdf99ed%3A0xc6cb51532cb12d90!2sTiruppur%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1705624796347!5m2!1sen!2sin"
              width="100%"
              height="400"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sayona Shipping Services Location"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
