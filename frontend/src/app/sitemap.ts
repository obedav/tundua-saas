import { MetadataRoute } from 'next';
import { clientEnv } from '@/lib/env';

/**
 * Dynamic Sitemap Generator
 *
 * Automatically generates sitemap.xml for search engines
 * Next.js will serve this at /sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = clientEnv.NEXT_PUBLIC_APP_URL || 'https://tundua.com';
  const apiUrl = clientEnv.NEXT_PUBLIC_API_URL;

  // Define all static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2026-05-14'),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // Fetch published blog slugs. On any failure we fall back to static routes only
  // so /sitemap.xml always returns a valid 200 response — a 500 causes Google to
  // mark the sitemap as broken and stop using it, which kills blog indexing.
  try {
    const response = await fetch(`${apiUrl}/api/v1/knowledge-base/slugs`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Sitemap: blog slug fetch failed (${response.status} ${response.statusText})`);
      return staticRoutes;
    }

    const data = await response.json();
    if (!data?.success || !Array.isArray(data?.slugs)) {
      console.error('Sitemap: blog slug response malformed', data);
      return staticRoutes;
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
  } catch (err) {
    console.error('Sitemap: unexpected error fetching blog slugs', err);
    return staticRoutes;
  }
}
