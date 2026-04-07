"use client";

import { useState, useCallback, Suspense } from "react";
import { TrackingSearch } from "@/components/features/tracking-search";
import { TrackingResultView, TrackingError, TrackingSkeleton } from "@/components/features/tracking-result";
import { useTracking } from "@/lib/hooks/use-tracking";

function TrackContent() {
  const [searchId, setSearchId] = useState<string | null>(null);
  const { data, error, isLoading } = useTracking(searchId);

  const handleSearch = useCallback((id: string) => setSearchId(id), []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Track Shipment</h1>
      <TrackingSearch onSearch={handleSearch} isLoading={isLoading} />
      {isLoading && <TrackingSkeleton />}
      {error && <TrackingError message={(error as Error).message} />}
      {data && <TrackingResultView data={data} />}
    </div>
  );
}

export default function ClientTrackPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  );
}
