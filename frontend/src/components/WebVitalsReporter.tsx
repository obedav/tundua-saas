'use client';

/**
 * Web Vitals Reporter Component
 *
 * Client component that loads web-vitals library and reports metrics
 * Must be a client component because it uses browser APIs
 *
 * Add this to your root layout to enable performance monitoring
 */

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';
import { captureUtmFromUrl } from '@/lib/utm';

export function WebVitalsReporter() {
  useEffect(() => {
    // Capture UTMs from the landing URL before any link clicks change it.
    // Piggybacks on this component because it already mounts once per session in the root layout.
    captureUtmFromUrl();

    // Dynamically import web-vitals library (reduces initial bundle)
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      // Report Core Web Vitals
      onCLS(reportWebVitals);
      onFID(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
      onINP(reportWebVitals); // New metric that replaces FID
    });
  }, []);

  return null; // This component doesn't render anything
}
