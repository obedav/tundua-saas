import { COUNTRY_ISO, COUNTRY_NAMES } from '@/lib/constants/countries';

/**
 * geo.* meta tags for content targeted at a specific origin country.
 *
 * Deliberately emits no hreflang: all content is English and there are no
 * per-language equivalents, so hreflang alternates would point at unrelated pages.
 */
export function buildGeoMetadata(targetCountry: string | null | undefined): Record<string, string> | null {
  if (!targetCountry) return null;

  const slug = targetCountry.toLowerCase().trim();
  const iso = COUNTRY_ISO[slug];

  if (!iso) return null;

  return {
    'geo.region': iso,
    'geo.placename': COUNTRY_NAMES[slug] ?? slug,
  };
}
