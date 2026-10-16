import type { Metadata } from 'next';
import { PAID_PLANS, priceNGNValue } from '@/lib/plans';

/**
 * Single source of truth for site-wide SEO constants.
 * Import from here instead of re-reading env vars or hardcoding values per page.
 */

export const SITE_URL = process.env['NEXT_PUBLIC_APP_URL'] || 'https://tundua.com';
export const SITE_NAME = 'Tundua';
export const LOGO_URL = `${SITE_URL}/images/logo.png`;

/** Current admissions cycle — bump once a year when content is refreshed, not automatically. */
export const ACADEMIC_CYCLE = '2026–27';

/** Cheapest paid plan, derived from PLANS so marketing copy never drifts from real pricing. */
const STARTING_PLAN = PAID_PLANS[0]!;
export const STARTING_PRICE_NGN = STARTING_PLAN.priceNGN;
export const STARTING_PRICE_NGN_VALUE = String(priceNGNValue(STARTING_PLAN));

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

/**
 * Standard metadata for a static public page: title, description, canonical,
 * and matching Open Graph / Twitter tags so shared links preview the right page.
 */
export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: socialTitle, description, url, type: 'website', siteName: SITE_NAME },
    twitter: { card: 'summary_large_image', title: socialTitle, description },
  };
}
