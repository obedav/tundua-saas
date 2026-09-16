/**
 * Structured Data Component
 *
 * Injects JSON-LD structured data into the page for better SEO
 * Must be placed in the <head> or <body> of your HTML
 */

import {
  getOrganizationSchema,
  getWebsiteSchema,
  getServiceSchema,
  getHowToSchema,
  getBlogPostSchema,
  getReviewsSchema,
  combineSchemas,
} from '@/lib/structured-data';
import type { ReviewInput } from '@/lib/structured-data';

/**
 * Global Structured Data
 *
 * Add this to your root layout to include organization, website,
 * and service schemas on all pages
 */
const APPLICATION_HOW_TO = getHowToSchema({
  name: 'How to Apply to Universities Abroad with Tundua',
  description: 'A step-by-step guide for Nigerian and African students to apply to universities in the UK, Canada, Australia and the USA using the Tundua study abroad platform.',
  totalTime: 'P4W',
  steps: [
    {
      name: 'Create your free account',
      text: 'Sign up on Tundua for free. No credit card required. Choose the package that matches your needs — from self-service to full Concierge support.',
      url: '/apply',
    },
    {
      name: 'Get matched with a dedicated counselor',
      text: 'We assign you an experienced study abroad consultant who specialises in your destination country and your academic background.',
    },
    {
      name: 'Build and review your application',
      text: 'Work together on your Statement of Purpose, personal statement, CV, and supporting documents. Use our AI tools to strengthen each piece before human review.',
    },
    {
      name: 'Submit applications and track progress',
      text: 'Submit to your shortlisted universities through your application dashboard. Monitor status updates, respond to offer conditions, and receive acceptance letters.',
      url: '/dashboard',
    },
  ],
});

export function GlobalStructuredData() {
  const schemas = combineSchemas(
    getOrganizationSchema() as Record<string, any>,
    getWebsiteSchema() as Record<string, any>,
    getServiceSchema() as Record<string, any>,
    APPLICATION_HOW_TO as Record<string, any>
  ) as string;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemas }}
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
      item: `${process.env['NEXT_PUBLIC_APP_URL'] || 'https://tundua.com'}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
 *       answer: 'Our services start at ₦89,000.',
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Reviews + AggregateRating Structured Data Component
 *
 * Outputs a SoftwareApplication schema with aggregateRating and review[].
 * Google uses this to render star ratings directly in SERPs.
 * Place on any page that displays visible review/testimonial content.
 */
export function ReviewsStructuredData({ reviews }: { reviews: ReviewInput[] }) {
  if (reviews.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    ...getReviewsSchema(reviews),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * HowTo Structured Data Component
 *
 * Add to pages that describe a multi-step process to unlock HowTo rich results.
 */
export function HowToStructuredData({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; url?: string }>;
  totalTime?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    ...getHowToSchema({ name, description, steps, totalTime }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Blog Post Structured Data Component
 *
 * Add this to individual blog post pages for BlogPosting rich results
 */
export function BlogPostStructuredData({
  article,
}: {
  article: {
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
  };
}) {
  const schema = {
    '@context': 'https://schema.org',
    ...getBlogPostSchema(article),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
