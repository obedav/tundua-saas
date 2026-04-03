import type { MetadataRoute } from "next";
import { clientEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = clientEnv.NEXT_PUBLIC_APP_URL || "https://tundua.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/contact", "/apply", "/terms", "/privacy", "/blog", "/blog/"],
        disallow: ["/dashboard/", "/auth/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
