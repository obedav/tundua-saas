"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { pageview, trackTiming, event } from "@/lib/analytics";

interface ConversionEvent {
  type: "page_view" | "button_click" | "form_submit" | "application_start" | "payment_complete";
  page: string;
  timestamp: string;
  userId?: number;
  metadata?: Record<string, any>;
}

interface DashboardConversionWrapperProps {
  children: React.ReactNode;
}

export default function DashboardConversionWrapper({ children }: DashboardConversionWrapperProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sessionStart] = useState(new Date().toISOString());

  // Track page views with Google Analytics
  useEffect(() => {
    if (pathname) {
      pageview(pathname);
      trackEvent({
        type: "page_view",
        page: pathname,
        timestamp: new Date().toISOString(),
        userId: user?.id,
      });
    }
  }, [pathname, user]);

  // Track time on page
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);

      // Track time spent on page
      if (timeSpent > 2) { // Only track if user stayed more than 2 seconds
        trackTiming(pathname || '/dashboard', timeSpent, 'Page Engagement');
      }

      trackEvent({
        type: "page_view",
        page: pathname || "/dashboard",
        timestamp: new Date().toISOString(),
        userId: user?.id,
        metadata: {
          time_spent_seconds: timeSpent,
          session_start: sessionStart,
        },
      });
    };
  }, [pathname, user, sessionStart]);

  const trackEvent = (conversionEvent: ConversionEvent) => {
    // Send to Google Analytics
    event({
      action: conversionEvent.type,
      category: 'Dashboard',
      label: conversionEvent.page,
      value: conversionEvent.userId,
      userId: conversionEvent.userId,
    });

    // Also send to your backend for custom analytics
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", conversionEvent);
    }

    // Store in localStorage for debugging
    try {
      const events = JSON.parse(localStorage.getItem("analytics_events") || "[]");
      events.push(conversionEvent);
      // Keep only last 100 events
      if (events.length > 100) events.shift();
      localStorage.setItem("analytics_events", JSON.stringify(events));
    } catch (error) {
      console.error("Failed to store analytics event:", error);
    }
  };

  // Expose tracking function globally
  useEffect(() => {
    (window as any).trackConversion = trackEvent;
  }, []);

  return (
    <div className="dashboard-conversion-wrapper">
      {/* Conversion Tracking Script Placeholder */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Conversion tracking helpers
            window.trackApplicationStart = function() {
              if (window.trackConversion) {
                window.trackConversion({
                  type: 'application_start',
                  page: window.location.pathname,
                  timestamp: new Date().toISOString(),
                });
              }
            };

            window.trackPaymentComplete = function(amount) {
              if (window.trackConversion) {
                window.trackConversion({
                  type: 'payment_complete',
                  page: window.location.pathname,
                  timestamp: new Date().toISOString(),
                  metadata: { amount: amount }
                });
              }
            };
          `,
        }}
      />

      {children}
    </div>
  );
}
