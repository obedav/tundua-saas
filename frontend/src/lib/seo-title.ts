import { COUNTRY_ADJECTIVES, COUNTRY_NAMES } from '@/lib/constants/countries';

function detectOriginAdjective(title: string, tags: string[]): string {
  const haystack = [...tags, title].join(' ').toLowerCase();
  const match = Object.keys(COUNTRY_NAMES).find((slug) =>
    haystack.includes(COUNTRY_NAMES[slug]!.toLowerCase())
  );
  return match ? `${COUNTRY_ADJECTIVES[match]} Students` : 'African Students';
}

function extractCostSignal(title: string): string | null {
  return title.match(/[£$€][\d,]+(?:\s*[kK])?(?:\s*(?:per year|a year))?/)?.[0] ?? null;
}

/**
 * Rewrites a blog post title for higher SERP CTR by injecting a country-specific
 * audience signal and front-loading the destination for list-style articles.
 *
 * Pattern matched:  "N Cheapest/Best Universities in [dest] for ... (year)"
 * Pattern output:   "N [dest] Universities Where [Country] Students Can Study for [cost] (year)"
 * Fallback:         "original title | Tundua"
 *
 * Pass `year` from the article's last update so the title never claims a
 * freshness (e.g. a new calendar year) the content hasn't earned.
 */
export function buildSeoTitle(
  title: string,
  tags: string[] = [],
  year: number = new Date().getFullYear()
): string {

  const listMatch = title.match(
    /^(\d+)\s+(?:cheapest|best|most affordable|top)\s+universities?\s+in\s+(?:the\s+)?([A-Z][\w\s]+?)(?:\s+for\s+|\s*\(|$)/i
  );

  if (listMatch) {
    const [, count, rawDest] = listMatch;
    const dest = (rawDest ?? '').trim();
    const who = detectOriginAdjective(title, tags);
    const cost = extractCostSignal(title);

    return cost
      ? `${count} ${dest} Universities Where ${who} Can Study for ${cost} (${year})`
      : `${count} Cheapest ${dest} Universities for ${who} (${year})`;
  }

  return title;
}
