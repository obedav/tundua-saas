const STRIP_HTML_RE = /<[^>]*>/g;
const COLLAPSE_SPACE_RE = /\s+/g;

function stripHtml(html: string): string {
  return html.replace(STRIP_HTML_RE, '').replace(COLLAPSE_SPACE_RE, ' ').trim();
}

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
}

/**
 * Builds a clean meta description from CMS-authored text.
 *
 * - Strips HTML tags before measuring length
 * - Never exceeds `max` characters (default 155)
 * - Truncates at a word boundary, never mid-word
 * - Appends a country signal when the country is not already mentioned
 *
 * Pass `article.metadata?.meta_description` as `rawText` to honour
 * explicit editor overrides; fall back to excerpt or content otherwise.
 */
export function buildMetaDescription(
  rawText: string,
  country?: string,
  max = 155,
): string {
  const plain = stripHtml(rawText);

  if (!country || plain.toLowerCase().includes(country.toLowerCase())) {
    return truncateAtWord(plain, max);
  }

  const suffix = ` Ideal for students from ${country}.`;
  return truncateAtWord(plain, max - suffix.length) + suffix;
}
