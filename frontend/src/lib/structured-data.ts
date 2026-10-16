/**
 * Structured Data (JSON-LD) Utilities
 *
 * Generates schema.org structured data for better SEO and rich snippets
 * in search results.
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

import type { Organization, WebSite, BreadcrumbList, Service, BlogPosting } from 'schema-dts';
import { SITE_URL as APP_URL, LOGO_URL, STARTING_PRICE_NGN, STARTING_PRICE_NGN_VALUE } from '@/lib/seo';

const AREA_SERVED = ['NG', 'GH', 'KE', 'ZM', 'UG', 'TZ', 'EG', 'MA'];

/**
 * Organization Schema
 * Helps search engines understand your business information
 * Can result in Knowledge Graph panels
 */
export function getOrganizationSchema(): Organization {
  return {
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${APP_URL}#organization`,
    name: 'Tundua',
    alternateName: 'Tundua Edu Consults',
    url: APP_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: '200',
      height: '67',
    },
    description: `Tundua is a study abroad application platform helping Nigerian and African students find and apply to universities in the UK, Canada, Australia and the USA. Expert counseling, AI tools, and end-to-end application support from ${STARTING_PRICE_NGN}.`,
    email: 'support@tundua.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2 Akinwale Street, off Yaya Abatan Road',
      addressLocality: 'Ogba',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    areaServed: AREA_SERVED,
    knowsAbout: [
      'University applications',
      'Study abroad',
      'UK student visa',
      'Canada student visa',
      'Statement of Purpose writing',
      'International student admissions',
    ],
    sameAs: [
      'https://x.com/tundua',
      'https://www.instagram.com/tundua',
      'https://www.linkedin.com/company/tundua',
    ],
  } as unknown as Organization;
}

/**
 * Website Schema
 * Defines your website for search engines
 */
export function getWebsiteSchema(): WebSite {
  return {
    '@type': 'WebSite',
    '@id': `${APP_URL}#website`,
    url: APP_URL,
    name: 'Tundua - Study Abroad Application Platform',
    description: `Complete study abroad application support from ${STARTING_PRICE_NGN}. Apply to top universities with expert guidance.`,
    publisher: {
      '@id': `${APP_URL}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  } as unknown as WebSite;
}

/**
 * Service Schema
 * Defines the services you offer
 * Can appear in service-related searches
 */
export function getServiceSchema(): Service {
  return {
    '@type': 'Service',
    '@id': `${APP_URL}#service`,
    serviceType: 'Study Abroad Application Support',
    provider: {
      '@id': `${APP_URL}#organization`,
    },
    name: 'Study Abroad Application Platform',
    description: 'Complete study abroad application support including professional counseling, document review, and application management.',
    offers: {
      '@type': 'Offer',
      price: STARTING_PRICE_NGN_VALUE,
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
    },
    areaServed: AREA_SERVED,
  };
}

/**
 * Breadcrumb Schema Generator
 * Helps search engines understand page hierarchy
 * Can result in breadcrumb rich snippets
 *
 * @example
 * ```ts
 * const breadcrumbs = getBreadcrumbSchema([
 *   { name: 'Home', url: '/' },
 *   { name: 'Dashboard', url: '/dashboard' },
 *   { name: 'Applications', url: '/dashboard/applications' },
 * ]);
 * ```
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${APP_URL}${item.url}`,
    })),
  };
}

/**
 * Blog Post Schema
 * Generates BlogPosting structured data for individual blog articles
 */
export function getBlogPostSchema(article: {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  published_at?: string;
  updated_at?: string;
  author_name?: string;
  featured_image?: string | null;
  api_url?: string;
}): BlogPosting {
  // Calculate word count from raw content (strip tags first) for richer schema signals
  const wordCount = article.content
    ? article.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
    : undefined;

  // Resolve absolute image URL — Google requires absolute URLs in structured data
  let imageUrl: string | undefined;
  if (article.featured_image) {
    if (article.featured_image.startsWith('http')) {
      imageUrl = article.featured_image;
    } else if (article.api_url) {
      imageUrl = `${article.api_url}${article.featured_image}`;
    }
  }

  return {
    '@type': 'BlogPosting',
    headline: article.title,
    url: `${APP_URL}/blog/${article.slug}`,
    ...(article.excerpt ? { description: article.excerpt } : {}),
    inLanguage: 'en-NG',
    datePublished: article.published_at || article.updated_at || new Date().toISOString(),
    dateModified: article.updated_at || new Date().toISOString(),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(wordCount ? { wordCount } : {}),
    author: {
      '@type': 'Organization',
      '@id': `${APP_URL}#organization`,
      name: article.author_name || 'Tundua',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${APP_URL}#organization`,
      name: 'Tundua Edu Consults',
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${APP_URL}/blog/${article.slug}`,
    },
    ...(article.category ? { articleSection: article.category } : {}),
  } as unknown as BlogPosting;
}



/**
 * Generate JSON-LD script tag content
 * Use this to inject structured data into your pages
 *
 * @example
 * ```tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: generateJsonLd(schema) }}
 * />
 * ```
 */
export function generateJsonLd(data: object): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  });
}


/**
 * Combine multiple schemas into one JSON-LD graph
 * More efficient than multiple script tags
 */
export function combineSchemas(...schemas: Array<Record<string, any>>): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  });
}
