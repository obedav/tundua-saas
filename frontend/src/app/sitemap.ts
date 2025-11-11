import { MetadataRoute } from 'next';
import { clientEnv } from '@/lib/env';

/**
 * Dynamic Sitemap Generator
 *
 * Automatically generates sitemap.xml for search engines
 * Next.js will serve this at /sitemap.xml
 *
 * Update this as you add more pages!
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = clientEnv.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Define all public pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/auth/login',
    '/auth/register',
  ];

  // Generate sitemap entries
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}
