"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function PostHogPageView(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    if (pathname && posthog.__loaded) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PostHog
    if (
      typeof window !== "undefined" &&
      process.env['NEXT_PUBLIC_POSTHOG_KEY'] &&
      !posthog.__loaded
    ) {
      posthog.init(process.env['NEXT_PUBLIC_POSTHOG_KEY'], {
        api_host: process.env['NEXT_PUBLIC_POSTHOG_HOST'] || "https://app.posthog.com",
        capture_pageview: false, // We'll capture manually
        capture_pageleave: true,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") {
            posthog.debug();
          }
        },
        autocapture: {
          dom_event_allowlist: ["click", "submit"], // Only capture clicks and form submissions
          element_allowlist: ["button", "a", "form"],
        },
        session_recording: {
          maskAllInputs: true, // Privacy: mask all input fields
          maskTextSelector: ".sensitive", // Mask elements with 'sensitive' class
        },
      });
    }
  }, []);

  if (!process.env['NEXT_PUBLIC_POSTHOG_KEY']) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}

// Export PostHog instance for use in other components
export { posthog };
