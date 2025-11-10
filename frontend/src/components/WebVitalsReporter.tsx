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

export function WebVitalsReporter() {
  useEffect(() => {
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
