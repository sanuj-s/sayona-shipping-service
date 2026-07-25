import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions of service for Sayona Shipping Services.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        subtitle="Last updated: January 2026"
      />
      <section className="py-[var(--spacing-section)] bg-[var(--background)]">
        <Container size="sm" className="prose prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            These terms and conditions govern your use of the Sayona Shipping Services platform and the freight forwarding, customs clearance, and logistics services provided by Sayona Shipping. By engaging our services, you agree to these terms in full.
          </p>

          <h2>2. Service Level Agreement (SLA)</h2>
          <p>
            We strive to provide 98% on-time delivery for all confirmed logistics routes. However, transit times are estimates based on normal operating conditions and are subject to port congestion, customs inspections, and force majeure events.
          </p>

          <h2>3. Liability & Insurance</h2>
          <p>
            While all cargo is handled with enterprise-grade care, Sayona Shipping Services strongly recommends clients procure comprehensive cargo insurance. Our standard liability for loss or damage is strictly limited per standard FIATA terms unless additional coverage is declared and purchased.
          </p>

          <h2>4. Quotations & Billing</h2>
          <p>
            Quotes provided are valid for 14 days unless otherwise stated. Rates are subject to changes in fuel surcharges, terminal handling charges, or carrier-imposed General Rate Increases (GRI).
          </p>

          <h2>5. Compliance & Documentation</h2>
          <p>
            The shipper is solely responsible for providing accurate commercial invoices, packing lists, and necessary export/import permits. Sayona Shipping Services will not be held liable for delays caused by inaccurate documentation or restricted cargo.
          </p>
        </Container>
      </section>
    </>
  );
}
