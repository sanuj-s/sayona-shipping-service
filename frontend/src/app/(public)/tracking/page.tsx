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
