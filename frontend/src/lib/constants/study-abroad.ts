import { ACADEMIC_CYCLE } from '@/lib/seo';
import { COUNTRY_ADJECTIVES, COUNTRY_NAMES } from '@/lib/constants/countries';

export interface CountryConfig {
  name: string;
  adjective: string;
  h1: string;
  metaDescription: string;
  searchTerm: string;
}

const DEFAULT_HIGHLIGHTS =
  'UK universities, Canadian study permits, Australian visa requirements, and Tundua application support';

// Open/Closed: add a country by adding its slug here (and to constants/countries). No new files.
// A value overrides the default description highlights for that country.
const ORIGIN_COUNTRIES: Record<string, string | null> = {
  nigeria: 'cheapest UK universities, Canadian study permits, Australian visa costs, and step-by-step application help',
  ghana: null,
  egypt: null,
  morocco: null,
  kenya: null,
  zambia: null,
};

/** Origin-country landing pages served at /study-abroad/[country]. Shared by the page and the sitemap. */
export const STUDY_ABROAD_COUNTRIES: Record<string, CountryConfig> = Object.fromEntries(
  Object.entries(ORIGIN_COUNTRIES).map(([slug, highlights]) => {
    const name = COUNTRY_NAMES[slug] ?? slug;
    const adjective = COUNTRY_ADJECTIVES[slug] ?? name;
    return [
      slug,
      {
        name,
        adjective,
        searchTerm: name,
        h1: `Study Abroad from ${name} (${ACADEMIC_CYCLE})`,
        metaDescription: `The complete guide for ${adjective} students studying abroad in ${ACADEMIC_CYCLE} — ${highlights ?? DEFAULT_HIGHLIGHTS}.`,
      },
    ];
  })
);
