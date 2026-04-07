import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Sayona Shipping Service. Learn how we handle your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="Last Updated: March 2026"
      />

      <section className="py-[var(--spacing-section)]">
        <Container size="sm">
          <Card variant="elevated" padding="lg">
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-[var(--foreground-secondary)] leading-relaxed">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">1. Information We Collect</h2>
                <p>
                  We collect information that you explicitly provide us—such as your name, corporate email, phone number,
                  and cargo details when you request a quote, track a shipment, or contact us. We also collect
                  non-identifying data for basic site analytics.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">2. How We Use Your Data</h2>
                <p>
                  The information we collect is strictly utilized to facilitate shipping services, deliver accurate
                  tracking metrics via our client portal, process customs clearance, and communicate regarding your
                  account.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">3. Data Security and Confidentiality</h2>
                <p>
                  Your shipment data is treated with enterprise-grade confidentiality. Sayona Shipping enforces strict
                  internal access controls and TLS encryption for any transit of your data through our systems.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">4. Third-Party Sharing</h2>
                <p>
                  We do NOT sell your data. We only share information with required operational partners—such as port
                  authorities, customs agencies, and contracted freight carriers—strictly to execute logistics services.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">5. Contact Us</h2>
                <p>
                  If you have questions regarding our privacy practices, please contact us at{" "}
                  <a href="mailto:sayonaexim@gmail.com" className="text-primary font-semibold hover:underline">
                    sayonaexim@gmail.com
                  </a>.
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
