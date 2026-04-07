import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JOB_LISTINGS, CAREER_PERKS } from "@/lib/utils/constants";
import { TrendingUp, Globe, GraduationCap, Heart, MapPin, Briefcase, Clock } from "lucide-react";

const perkIconMap: Record<string, React.ElementType> = {
  TrendingUp, Globe, GraduationCap, Heart,
};

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Sayona Shipping Service – careers in international logistics, freight forwarding & supply chain management.",
};

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 text-center bg-gradient-to-br from-secondary via-[#0a2540] to-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,114,255,0.15),transparent_50%)]" />
        <Container className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Build Your Career in Global Logistics
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Join a fast-growing international shipping company and help move India&apos;s exports to the world.
          </p>
        </Container>
      </section>

      {/* Why Join */}
      <section className="py-[var(--spacing-section)] bg-[var(--background-alt)]">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--foreground)] mb-12">
            Why Join Sayona?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAREER_PERKS.map((perk) => {
              const Icon = perkIconMap[perk.icon] || TrendingUp;
              return (
                <Card key={perk.title} variant="elevated" className="text-center hover:-translate-y-1.5 transition-transform">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{perk.title}</h3>
                  <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">{perk.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Open Positions */}
      <section className="py-[var(--spacing-section)]">
        <Container size="sm">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--foreground)] mb-12">
            Open Positions
          </h2>
          <div className="space-y-4">
            {JOB_LISTINGS.map((job) => (
              <Card
                key={job.title}
                variant="elevated"
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-primary/30 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--foreground-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-primary" /> {job.department}
                    </span>
                  </div>
                </div>
                <Link href={`mailto:sayonaexim@gmail.com?subject=Application: ${job.title}`}>
                  <Button variant="primary" size="sm">Apply Now</Button>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-info text-center">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don&apos;t See Your Role?
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll be in touch.
          </p>
          <a href="mailto:sayonaexim@gmail.com?subject=General Application">
            <Button variant="accent" size="lg">Send Your Resume</Button>
          </a>
        </Container>
      </section>
    </>
  );
}
