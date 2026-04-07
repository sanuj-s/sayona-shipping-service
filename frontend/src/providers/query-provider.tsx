"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 mins
            gcTime: 10 * 60 * 1000, // 10 mins cache retention
            refetchOnWindowFocus: true, // Synchronize on focus
            retry: (failureCount, error) => {
              // Do not retry authorization/authentication errors
              if (error instanceof Error && error.message.includes("401")) return false;
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
