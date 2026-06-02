/**
 * Web Vitals Performance Monitoring
 *
 * Tracks Core Web Vitals and sends them to analytics
 * These metrics affect SEO rankings and user experience
 *
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint): Loading performance - should be < 2.5s
 * - FID (First Input Delay): Interactivity - should be < 100ms
 * - CLS (Cumulative Layout Shift): Visual stability - should be < 0.1
 *
 * Other Important Metrics:
 * - FCP (First Contentful Paint): When first content appears - should be < 1.8s
 * - TTFB (Time to First Byte): Server response time - should be < 600ms
 * - INP (Interaction to Next Paint): Replaces FID - should be < 200ms
 *
 * @see https://web.dev/vitals/
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/analytics
 */

import type { Metric } from 'web-vitals';

/**
 * Performance thresholds based on Google's recommendations
 */
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 600, needsImprovement: 1500 },
  INP: { good: 200, needsImprovement: 500 },
} as const;

/**
 * Get performance rating based on thresholds
 */
function getRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';

  if (metric.value <= threshold.good) return 'good';
  if (metric.value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Log metric to the dev console only — NOT sent to GA4.
 *
 * Core Web Vitals (LCP, CLS, INP) are already collected automatically by
 * Google Search Console via the Chrome UX Report, so sending them as GA4
 * events is redundant and pollutes the event stream (they were 43 % of all
 * events). Keep them here purely for local performance debugging.
 */
function sendToGoogleAnalytics(metric: Metric) {
  if (process.env.NODE_ENV === 'development') {
    const rating = getRating(metric);
    console.log('[Web Vitals]', {
      name: metric.name,
      value: metric.value,
      rating,
      id: metric.id,
    });
    if (rating === 'poor') {
      console.warn(
        `⚠️ Poor ${metric.name}: ${metric.value.toFixed(2)} (threshold: ${
          THRESHOLDS[metric.name as keyof typeof THRESHOLDS]?.needsImprovement
        })`
      );
    }
  }
}

/**
 * Send metric to custom analytics endpoint
 * Use this if you want to store metrics in your own database
 *
 * This function is currently unused but kept for future use
 */
// function sendToCustomAnalytics(metric: Metric): void {
//   const rating = getRating(metric);

//   // Send to your custom API endpoint
//   const body = JSON.stringify({
//     name: metric.name,
//     value: metric.value,
//     rating,
//     id: metric.id,
//     delta: metric.delta,
//     navigationType: metric.navigationType,
//     timestamp: Date.now(),
//     url: window.location.href,
//     userAgent: navigator.userAgent,
//   });

//   // Use sendBeacon if available (non-blocking)
//   if (navigator.sendBeacon) {
//     navigator.sendBeacon('/api/analytics/web-vitals', body);
//   } else {
//     // Fallback to fetch
//     fetch('/api/analytics/web-vitals', {
//       method: 'POST',
//       body,
//       headers: { 'Content-Type': 'application/json' },
//       keepalive: true,
//     }).catch((error) => {
//       if (process.env.NODE_ENV === 'development') {
//         console.error('Failed to send web vitals:', error);
//       }
//     });
//   }
// }

/**
 * Main reporting function
 * Sends metrics to both Google Analytics and custom endpoint
 */
export function reportWebVitals(metric: Metric) {
  // Dev console logging only — GA4 reporting intentionally removed.
  // See sendToGoogleAnalytics for the reasoning.
  sendToGoogleAnalytics(metric);

  // Uncomment to also send to your own API endpoint:
  // sendToCustomAnalytics(metric);
}

/**
 * TypeScript declarations for gtag
 */

/**
 * Performance monitoring utilities
 */
export const performance = {
  /**
   * Measure time between two marks
   */
  measure: (name: string, startMark: string, endMark: string): PerformanceMeasure | undefined => {
    if (typeof window === 'undefined' || !window.performance) return undefined;

    try {
      performance.mark(endMark);
      const measure = window.performance.measure(name, startMark, endMark);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
      }

      return measure;
    } catch (error) {
      // Marks might not exist
      if (process.env.NODE_ENV === 'development') {
        console.error('Performance measurement failed:', error);
      }
      return undefined;
    }
  },

  /**
   * Create a performance mark
   */
  mark: (name: string) => {
    if (typeof window === 'undefined' || !window.performance) return;
    window.performance.mark(name);
  },

  /**
   * Get navigation timing
   */
  getNavigationTiming: () => {
    if (typeof window === 'undefined' || !window.performance) return null;

    const navigation = window.performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (!navigation) return null;

    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart,
      loadComplete: navigation.loadEventEnd - navigation.fetchStart,
    };
  },
};
