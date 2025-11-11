/**
 * Structured Data Component
 *
 * Injects JSON-LD structured data into the page for better SEO
 * Must be placed in the <head> or <body> of your HTML
 */

import Script from 'next/script';
import {
  getOrganizationSchema,
  getWebsiteSchema,
  getServiceSchema,
  combineSchemas,
} from '@/lib/structured-data';

/**
 * Global Structured Data
 *
 * Add this to your root layout to include organization, website,
 * and service schemas on all pages
 */
export function GlobalStructuredData() {
  const schemas = combineSchemas(
    getOrganizationSchema(),
    getWebsiteSchema(),
    getServiceSchema()
  );

  return (
    <Script
      id="structured-data-global"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemas }}
      strategy="beforeInteractive"
    />
  );
}

/**
 * Breadcrumb Structured Data Component
 *
 * Add this to individual pages to show page hierarchy
 *
 * @example
 * ```tsx
 * <BreadcrumbStructuredData
 *   items={[
 *     { name: 'Home', url: '/' },
 *     { name: 'Dashboard', url: '/dashboard' },
 *     { name: 'Applications', url: '/dashboard/applications' },
 *   ]}
 * />
 * ```
 */
export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'}${item.url}`,
    })),
  };

  return (
    <Script
      id="structured-data-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}

/**
 * FAQ Structured Data Component
 *
 * Add this to pages with FAQs to get rich FAQ snippets in search
 *
 * @example
 * ```tsx
 * <FAQStructuredData
 *   faqs={[
 *     {
 *       question: 'How much does it cost?',
 *       answer: 'Our services start at $299.',
 *     },
 *   ]}
 * />
 * ```
 */
export function FAQStructuredData({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="structured-data-faq"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}
