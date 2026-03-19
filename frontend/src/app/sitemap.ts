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
    ...['about', 'contact', 'terms', 'privacy', 'auth/login', 'auth/register'].map(
      (route) => ({
        url: `${baseUrl}/${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    ),
  ];

  // Fetch published blog slugs
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${apiUrl}/api/knowledge-base/slugs`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.success && data?.slugs) {
        blogRoutes = data.slugs.map(
          (item: { slug: string; updated_at: string }) => ({
            url: `${baseUrl}/blog/${item.slug}`,
            lastModified: new Date(item.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          })
        );
      }
    }
  } catch (error) {
    console.error('Error fetching blog slugs for sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes];
}
