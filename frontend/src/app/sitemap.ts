import { MetadataRoute } from 'next';
import { clientEnv } from '@/lib/env';
import { SITE_URL } from '@/lib/seo';
import { STUDY_ABROAD_COUNTRIES } from '@/lib/constants/study-abroad';
import { FEATURED_UNIVERSITIES } from '@/lib/constants/featured-universities';

/**
 * Dynamic Sitemap Generator — served by Next.js at /sitemap.xml
 *
 * Static pages carry no lastModified: a fake "now" on every request teaches Google
 * to ignore our dates. Only blog posts, which have real update times, include one.
 * (Google ignores priority/changeFrequency, so they are omitted.)
 */
const STATIC_PATHS = [
  '',
  '/blog',
  '/apply',
  '/pricing',
  // Destination hubs
  '/study-in-uk',
  '/study-in-uk/cost',
  '/study-in-uk/low-deposit',
  '/study-in-uk/universities-accepting-hnd',
  '/study-in-uk/universities-accepting-2-2',
  '/study-in-uk/universities-accepting-third-class',
  '/study-in-uk/without-ielts',
  '/study-in-uk/universities-accepting-waec',
  '/study-in-uk/visa',
  '/study-in-uk/intakes',
  '/study-in-canada',
  '/study-in-canada/cost',
  '/study-in-canada/study-permit',
  '/study-in-australia',
  '/study-in-usa',
  // University directory, intakes, courses
  '/universities',
  '/universities/uk',
  '/intakes/january-2027/uk',
  '/masters/public-health/uk',
  '/visa',
  // Tools
  '/tools/university-finder',
  '/tools/uk-university-eligibility-checker',
  '/tools/proof-of-funds-calculator',
  '/tools/sop-generator',
  // Company
  '/about',
  '/contact',
  '/support',
  '/terms',
  '/privacy',
];

const DYNAMIC_PATHS = [
  ...Object.keys(STUDY_ABROAD_COUNTRIES).map((country) => `/study-abroad/${country}`),
  ...FEATURED_UNIVERSITIES.map((uni) => `/universities/${uni.slug}`),
];

async function getBlogRoutes(): Promise<MetadataRoute.Sitemap> {
  // On any failure we return no blog routes so /sitemap.xml always returns a valid 200 —
  // a 500 causes Google to mark the sitemap as broken and stop using it.
  try {
    const response = await fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/api/v1/knowledge-base/slugs`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Sitemap: blog slug fetch failed (${response.status} ${response.statusText})`);
      return [];
    }

    const data = await response.json();
    if (!data?.success || !Array.isArray(data?.slugs)) {
      console.error('Sitemap: blog slug response malformed', data);
      return [];
    }

    return data.slugs.map((item: { slug: string; updated_at: string }) => ({
      url: `${SITE_URL}/blog/${item.slug}`,
      lastModified: new Date(item.updated_at),
    }));
  } catch (err) {
    console.error('Sitemap: unexpected error fetching blog slugs', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageRoutes = [...STATIC_PATHS, ...DYNAMIC_PATHS].map((path) => ({ url: `${SITE_URL}${path}` }));

  return [...pageRoutes, ...(await getBlogRoutes())];
}
