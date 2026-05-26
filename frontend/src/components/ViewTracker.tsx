"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  slug: string;
}

// Fires a single POST to increment view_count after the page hydrates.
// Keeping this client-side means bots and Next.js ISR revalidations never
// inflate the count — only real browser sessions are counted.
export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    fetch(`${process.env["NEXT_PUBLIC_API_URL"]}/api/v1/knowledge-base/${slug}/view`, {
      method: "POST",
    }).catch(() => {});
  }, [slug]);

  return null;
}
