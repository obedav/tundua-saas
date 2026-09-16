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

  const now = new Date();

  // Define all static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Destination hub pages — high commercial intent
    {
      url: `${baseUrl}/study-in-uk`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    { url: `${baseUrl}/study-in-uk/cost`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/study-in-uk/low-deposit`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/study-in-uk/universities-accepting-hnd`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/study-in-uk/universities-accepting-2-2`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/study-in-uk/universities-accepting-third-class`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/study-in-uk/without-ielts`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/study-in-uk/universities-accepting-waec`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/study-in-uk/visa`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/study-in-uk/intakes`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Canada hub
    { url: `${baseUrl}/study-in-canada`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/study-in-canada/cost`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/study-in-canada/study-permit`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    // Other destination hubs — stub pages
    {
      url: `${baseUrl}/study-in-australia`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/study-in-usa`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // University directory
    { url: `${baseUrl}/universities`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/universities/uk`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    // Intake pages — high time-sensitive intent
    { url: `${baseUrl}/intakes/january-2027/uk`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // Course/Masters pages
    { url: `${baseUrl}/masters/public-health/uk`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Visa guidance — high intent, regularly updated
    {
      url: `${baseUrl}/visa`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    // Tool landing pages — link-worthy, indexable
    {
      url: `${baseUrl}/tools/university-finder`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/tools/uk-university-eligibility-checker`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/tools/proof-of-funds-calculator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/sop-generator`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
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
