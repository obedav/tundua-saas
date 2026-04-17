import { MetadataRoute } from 'next';
import { clientEnv } from '@/lib/env';

/**
 * Dynamic Sitemap Generator
 *
 * Automatically generates sitemap.xml for search engines
 * Next.js will serve this at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = clientEnv.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const apiUrl = clientEnv.NEXT_PUBLIC_API_URL;

  // Define all static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...['about', 'contact', 'terms', 'privacy'].map(
      (route) => ({
        url: `${baseUrl}/${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    ),
  ];

  // Fetch published blog slugs.
  // We throw on failure so a broken sitemap never ships silently — Next.js will
  // surface a 500 and we keep the previous (cached) sitemap rather than serving
  // a truncated one that pushes blog URLs into "Discovered – not indexed".
  const response = await fetch(`${apiUrl}/api/v1/knowledge-base/slugs`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Sitemap: blog slug fetch failed (${response.status} ${response.statusText})`
    );
  }

  const data = await response.json();
  if (!data?.success || !Array.isArray(data?.slugs)) {
    throw new Error('Sitemap: blog slug response malformed');
  }

  const blogRoutes: MetadataRoute.Sitemap = data.slugs.map(
    (item: { slug: string; updated_at: string }) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...blogRoutes];
}
