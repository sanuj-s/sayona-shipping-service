"use client";

import { useState, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/container";
import { TrackingSearch } from "@/components/features/tracking-search";
import {
  TrackingResultView,
  TrackingError,
  TrackingSkeleton,
} from "@/components/features/tracking-result";
import { useTracking } from "@/lib/hooks/use-tracking";

function TrackingContent() {
  const [searchId, setSearchId] = useState<string | null>(null);
  const { data, error, isLoading } = useTracking(searchId);

  const handleSearch = useCallback((id: string) => {
    setSearchId(id);
  }, []);

  return (
    <>
      <PageHeader
        title="Track Your Shipment"
        subtitle="Real-time status updates for your cargo worldwide."
      />

      <section className="py-12">
        <Container>
          <TrackingSearch onSearch={handleSearch} isLoading={isLoading} />

          {isLoading && <TrackingSkeleton />}
          {error && <TrackingError message={(error as Error).message} />}
          {data && <TrackingResultView data={data} />}
        </Container>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-[var(--background-alt)]">
        <Container size="sm">
          <div className="max-w-2xl mx-auto prose prose-neutral dark:prose-invert text-[var(--foreground-secondary)] leading-relaxed space-y-4 text-[15px]">
            <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-6">
              How Shipment Tracking Works
            </h2>
            <p>
              <strong className="text-[var(--foreground)]">Sayona Shipping Services</strong> provides
              real-time cargo tracking for all shipments — whether by ocean freight, air cargo, or ground
              transport. Enter your unique Tracking ID or Waybill number above to instantly view your
              shipment&apos;s current status, location, and estimated delivery date.
            </p>
            <p>
              Our tracking system covers the entire logistics journey: from pickup and warehouse processing,
              through customs clearance at origin and destination ports, to final-mile delivery. Each status
              update is timestamped and geo-tagged so you always know exactly where your cargo is.
            </p>
            <h3 className="text-lg font-bold text-[var(--foreground)] mt-8 mb-3">
              What You Can Track
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-[var(--foreground-secondary)]">
              <li>FCL (Full Container Load) ocean freight shipments</li>
              <li>LCL (Less than Container Load) consolidated cargo</li>
              <li>Air freight and express courier packages</li>
              <li>Customs clearance status and documentation progress</li>
              <li>Warehousing and inventory movement updates</li>
            </ul>
            <p>
              Need help locating your Tracking ID? Check your booking confirmation email from Sayona Shipping,
              or contact our support team at{" "}
              <a href="mailto:sayonaexim@gmail.com" className="text-primary font-semibold hover:underline">
                sayonaexim@gmail.com
              </a>{" "}
              for immediate assistance.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function TrackingPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  );
}
