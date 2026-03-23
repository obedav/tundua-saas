import { useEffect, useState } from 'react';

export interface BadgeCounts {
  applications: number;
  documents: number;
  support: number;
  notifications: number;
}

/**
 * Hook to fetch real-time badge counts
 * Uses polling for now - can be upgraded to WebSocket later
 */
export function useBadgeCounts() {
  const [counts, setCounts] = useState<BadgeCounts>({
    applications: 0,
    documents: 0,
    support: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchCounts = async () => {
      // Skip if we've exceeded retry limit on initial load
      if (!isMounted || (retryCount >= maxRetries && loading)) {
        setLoading(false);
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetch('/api/dashboard/badge-counts', {
          credentials: 'include',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          if (data.counts && isMounted) {
            setCounts(data.counts);
            setError(null);
            retryCount = 0; // Reset retry count on success
          }
        } else {
          // Silently handle HTTP errors without console.error
          setError(`Status ${response.status}`);
        }
      } catch (error: any) {
        if (!isMounted) return;

        retryCount++;

        // Only log on first attempt or if not an abort error
        if (retryCount === 1 && error.name !== 'AbortError') {
          console.warn('[Badge Counts] Fetch failed, will retry silently:', error.message);
        }

        // Don't spam console with errors
        setError(error.message || 'Network error');

        // Keep existing counts on error instead of resetting to 0
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Delay initial fetch to give server time to be ready
    const initialTimer = setTimeout(() => {
      if (isMounted) {
        fetchCounts();
      }
    }, 500);

    // Poll every 30 seconds for updates
    const interval = setInterval(() => {
      if (isMounted) {
        fetchCounts();
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return { counts, loading, error };
}
