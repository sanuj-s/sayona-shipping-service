import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INDUSTRIES, INDUSTRY_CONTENT } from "@/lib/utils/constants";
import { CheckCircle, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INDUSTRIES.map((ind) => ({ slug: ind.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  if (!industry) return {};

  return {
    title: `${industry.title} Shipping & Logistics`,
    description: `Specialized ${industry.title.toLowerCase()} shipping, logistics, and freight forwarding from India. ${industry.description}`,
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  const content = INDUSTRY_CONTENT[slug];

  if (!industry || !content) notFound();

  return (
    <>
      <PageHeader
        title={`${industry.title} Shipping & Logistics`}
        subtitle={industry.description}
        badge={industry.title}
        gradient
      />

      {/* Key Features */}
      <section className="py-[var(--spacing-section)]">
        <Container>
          <SectionTitle
            title="Why Choose Sayona?"
            subtitle={`Specialized logistics infrastructure designed for ${industry.title.toLowerCase()} cargo.`}
          />
          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {content.keyFeatures.map((feature, i) => (
              <Card key={i} variant="elevated" className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">{feature}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Cargo Types & Certifications */}
      <section className="py-16 bg-[var(--background-alt)]">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card variant="elevated">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Cargo We Handle</h3>
              <div className="flex flex-wrap gap-2">
                {content.cargoTypes.map((type) => (
                  <Badge key={type} variant="primary" size="lg">{type}</Badge>
                ))}
              </div>
            </Card>
            <Card variant="elevated">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {content.certifications.map((cert) => (
                  <Badge key={cert} variant="accent" size="lg">{cert}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-[var(--spacing-section)] text-center">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            Ready to Ship {industry.title}?
          </h2>
          <p className="text-lg text-[var(--foreground-secondary)] max-w-xl mx-auto mb-8">
            Get a specialized quote for your {industry.title.toLowerCase()} cargo with competitive rates and reliable transit times.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/contact#quote">
              <Button variant="primary" size="lg">
                Get a Quote <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg">View All Services</Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
