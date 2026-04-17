import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/features/timeline";
import { LocationsGrid } from "@/components/features/locations-grid";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Sayona Shipping Service – Trusted logistics expertise from Tirupur, India. Leading freight forwarder serving 25+ countries.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        title="About Sayona Shipping Services"
        subtitle="Trusted logistics partner delivering reliable cargo solutions across India and globally."
      />

      {/* About Section */}
      <section className="py-[var(--spacing-section)]">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6">
                Engineered for <span className="text-primary">Global Reach</span>
              </h2>
              <p className="text-[var(--foreground-secondary)] leading-relaxed mb-4">
                Established in 2020 and backed by decades of combined industry expertise, Sayona
                Shipping Services is built on a foundation of operational transparency and logistical
                precision. We don&apos;t just move freight; we optimize supply chains for manufacturers,
                exporters, and international businesses.
              </p>
              <p className="text-[var(--foreground-secondary)] leading-relaxed mb-6">
                Handling a diverse portfolio spanning raw textiles to highly sensitive pharmaceuticals,
                our infrastructure is designed to mitigate risk while maximizing transit speed.
              </p>
              <div className="flex gap-5 flex-wrap">
                <Card variant="bordered" padding="sm" className="border-l-4 border-l-primary">
                  <h4 className="font-bold text-[var(--foreground)]">Reliability</h4>
                  <p className="text-sm text-[var(--foreground-secondary)]">24/7 Monitored Routes</p>
                </Card>
                <Card variant="bordered" padding="sm" className="border-l-4 border-l-accent">
                  <h4 className="font-bold text-[var(--foreground)]">Compliance</h4>
                  <p className="text-sm text-[var(--foreground-secondary)]">Industry Standard</p>
                </Card>
              </div>
            </div>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logistics.jpg"
                alt="Sayona Shipping Warehouse"
                width={600}
                height={400}
                className="rounded-xl shadow-[var(--shadow-elevated)] w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-5 -right-3 bg-[var(--surface)] rounded-xl p-4 shadow-[var(--shadow-elevated)] border border-[var(--border-color)]">
                <h3 className="text-2xl font-bold text-primary">500+</h3>
                <p className="text-sm font-semibold text-[var(--foreground)]">Clients Served</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Dark */}
      <section className="py-16 bg-secondary text-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "98%", label: "On-Time Delivery" },
              { value: "1500+", label: "Active Routes" },
              { value: "120+", label: "Global Partners" },
              { value: "15+", label: "Countries Served" },
            ].map((stat) => (
              <div key={stat.label}>
                <h2 className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</h2>
                <p className="text-white/70 mt-1 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission & Timeline */}
      <section className="py-[var(--spacing-section)] bg-[var(--background-alt)]">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <Card variant="elevated" className="border-l-4 border-l-primary">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Our Mission</h3>
                <p className="text-[var(--foreground-secondary)] leading-relaxed">
                  To architect and execute fault-tolerant logistics networks that power international
                  trade. We eliminate supply chain friction through strategic routing, predictive
                  tracking, and unwavering operational integrity.
                </p>
              </Card>
              <Card variant="elevated" className="border-l-4 border-l-accent">
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">Our Vision</h3>
                <p className="text-[var(--foreground-secondary)] leading-relaxed">
                  To be the definitive baseline for freight reliability in South Asia, scaling our
                  digital and physical infrastructure to support next-generation global commerce.
                </p>
              </Card>
            </div>
            <Card variant="elevated">
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">Growth Trajectory</h3>
              <Timeline />
            </Card>
          </div>
        </Container>
      </section>

      {/* Locations */}
      <section className="py-[var(--spacing-section)]">
        <Container>
          <SectionTitle
            title="Strategic Operational Nodes"
            subtitle="Positioned perfectly to intercept global shipping lanes and provide seamless inland distribution networks."
          />
          <LocationsGrid />
        </Container>
      </section>
    </>
  );
}
