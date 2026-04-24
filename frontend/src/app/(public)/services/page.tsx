import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { ServiceBlock } from "@/components/features/service-block";
import { StatsSection } from "@/components/features/stats-section";
import { SERVICES } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Sayona Logistics Platform offers ocean freight (FCL/LCL), air cargo, customs clearance, warehousing & supply chain logistics from India.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Export & Import Services"
        subtitle="Reliable ocean freight, air freight, customs clearance, and warehousing solutions for all types of cargo worldwide."
        badge="Global Logistics Solutions"
        gradient
      />

      <StatsSection />

      <section className="py-8">
        <Container>
          {SERVICES.map((service, i) => (
            <ServiceBlock key={service.id} service={service} reversed={i % 2 !== 0} />
          ))}
        </Container>
      </section>
    </>
  );
}
