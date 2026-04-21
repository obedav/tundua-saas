/**
 * Rewrite misbehaving CTA links inside CMS-authored article HTML.
 *
 * Why: articles are authored in the backend knowledge-base and occasionally ship
 * with CTA anchors that point to `/` (the homepage) instead of `/apply`. Those
 * links bounce users straight back to the homepage — a real conversion bug seen
 * in GA4 (users navigating /blog/<slug> -> /). This runs in the Server Component
 * before dangerouslySetInnerHTML, so it's paid for once per ISR revalidation.
 *
 * Keep it narrow: only rewrite when BOTH the href looks homepage-ish AND the
 * anchor text reads like a funnel CTA. That avoids clobbering legitimate
 * "visit our homepage"-style links.
 */

// Anchor text that almost certainly marks a funnel CTA.
const CTA_TEXT_RE = /\b(apply|start|free|get\s*started|try|begin|chat|book|sign\s*up|let['\u2019]?s\s+go|join\s+now)\b/i;

// href values that resolve to the homepage: "/", "", "#", root with query/hash,
// or absolute URLs to tundua.com with no path.
const HOMEPAGE_HREF_RE = /^(?:https?:\/\/(?:www\.)?tundua\.com)?\/?(?:[#?].*)?$/i;

export function rewriteCtaLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs: string, inner: string) => {
    const hrefMatch = /\bhref\s*=\s*(['"])([^'"]*)\1/i.exec(attrs);
    if (!hrefMatch) return match;

    const href = hrefMatch[2] ?? '';
    if (!HOMEPAGE_HREF_RE.test(href)) return match;

    const text = inner.replace(/<[^>]*>/g, '').trim();
    if (!CTA_TEXT_RE.test(text)) return match;

    const newAttrs = attrs.replace(/\bhref\s*=\s*(['"])[^'"]*\1/i, 'href="/apply"');
    return `<a${newAttrs}>${inner}</a>`;
  });
}
