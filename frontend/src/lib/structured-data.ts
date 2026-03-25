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

const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';

/**
 * Organization Schema
 * Helps search engines understand your business information
 * Can result in Knowledge Graph panels
 */
export function getOrganizationSchema(): Organization {
  return {
    '@type': 'Organization',
    '@id': `${APP_URL}#organization`,
    name: 'Tundua',
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    description: 'Complete study abroad application support from ₦89,000. Apply to top universities with expert guidance.',
    email: 'support@tundua.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '2 Akinwale Street, off Yaya Abatan Road',
      addressLocality: 'Ogba',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    } as any,
    sameAs: [
      'https://x.com/tundua',
      'https://www.instagram.com/tundua',
      'https://www.linkedin.com/company/tundua',
    ],
  } as Organization;
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
    description: 'Complete study abroad application support from ₦89,000. Apply to top universities with expert guidance.',
    publisher: {
      '@id': `${APP_URL}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    } as any,
  };
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
      price: '89000',
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Global',
    },
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
}): BlogPosting {
  return {
    '@type': 'BlogPosting',
    headline: article.title,
    url: `${APP_URL}/blog/${article.slug}`,
    description: article.excerpt || '',
    datePublished: article.published_at || article.updated_at || new Date().toISOString(),
    dateModified: article.updated_at || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      '@id': `${APP_URL}#organization`,
      name: article.author_name || 'Tundua',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${APP_URL}#organization`,
      name: 'Tundua',
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/logo.png`,
      },
    } as any,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${APP_URL}/blog/${article.slug}`,
    },
    ...(article.category ? { articleSection: article.category } : {}),
  };
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
