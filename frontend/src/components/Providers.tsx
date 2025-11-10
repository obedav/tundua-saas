"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PusherProvider } from "@/contexts/PusherContext";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Global Providers Component
 *
 * Wraps the entire app with necessary providers:
 * - ErrorBoundary: Catches and handles React errors
 * - QueryClient: TanStack Query for data fetching
 * - PusherProvider: Real-time notifications
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 3, // Retry failed requests 3 times
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
          },
          mutations: {
            retry: 1, // Retry failed mutations once
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PusherProvider>
          {children}
        </PusherProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
