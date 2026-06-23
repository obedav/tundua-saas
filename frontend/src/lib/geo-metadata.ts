import { COUNTRY_ISO, COUNTRY_LANG, COUNTRY_NAMES } from '@/lib/constants/countries';

const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://tundua.com';

export interface GeoMetaAdditions {
  other: Record<string, string>;
  languages: Record<string, string>;
}

export function buildGeoMetadata(targetCountry: string | null | undefined): GeoMetaAdditions | null {
  if (!targetCountry) return null;

  const slug = targetCountry.toLowerCase().trim();
  const iso = COUNTRY_ISO[slug];
  const lang = COUNTRY_LANG[slug];

  if (!iso || !lang) return null;

  return {
    other: {
      'geo.region': iso,
      'geo.placename': COUNTRY_NAMES[slug] ?? slug,
    },
    languages: {
      [lang]: `${APP_URL}/study-abroad/${slug}`,
    },
  };
}
