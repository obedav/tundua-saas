"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { PusherProvider } from "@/contexts/PusherContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Global Providers Component
 *
 * Wraps the entire app with necessary providers:
 * - ErrorBoundary: Catches and handles React errors
 * - ThemeProvider: Dark mode support (2025 standard)
 * - CurrencyProvider: Multi-currency support (NGN/USD)
 * - QueryClient: TanStack Query for data fetching
 * - AuthProvider: Centralized authentication state (MUST be before PusherProvider)
 * - PusherProvider: Real-time notifications (depends on AuthProvider)
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
      <ThemeProvider>
        <CurrencyProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <PusherProvider>
                {children}
              </PusherProvider>
            </AuthProvider>
          </QueryClientProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
