"use client";

import { useQuery } from "@tanstack/react-query";
import { getTracking } from "@/lib/api/endpoints";
import type { TrackingResult } from "@/lib/types";

export function useTracking(trackingId: string | null) {
  return useQuery<TrackingResult>({
    queryKey: ["tracking", trackingId],
    queryFn: () => getTracking(trackingId!),
    enabled: !!trackingId,
    retry: false,
    staleTime: 30 * 1000,
  });
}
