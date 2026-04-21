/**
 * UTM capture + persistence.
 *
 * Captures utm_* params on first landing, stores them in localStorage for 30 days,
 * and lets lead forms attach them to submissions. Without this we can't tell which
 * ad / channel produced which lead — mandatory before spending on paid traffic.
 */

const STORAGE_KEY = 'tundua_utm';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days — matches typical ad-platform attribution windows

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',   // Google Ads click id
  'fbclid',  // Meta click id
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  captured_at?: number;
};

/** Run once on app load (or on any public page) to persist UTMs from the URL. */
export function captureUtmFromUrl(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const captured: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) captured[key] = value;
  }

  // Only overwrite if we actually have UTMs in the current URL.
  // Otherwise the existing stored value (first-touch) wins.
  if (Object.keys(captured).length === 0) return;

  captured.landing_page = url.pathname;
  captured.referrer = document.referrer || undefined;
  captured.captured_at = Date.now();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
  } catch {
    // localStorage can throw in private browsing / full quota — ignore silently.
  }
}

/** Read stored UTMs. Returns empty object if missing, expired, or unavailable. */
export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as UtmParams;
    if (parsed.captured_at && Date.now() - parsed.captured_at > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

/** Format UTMs as a short readable string for embedding in lead messages / CRM notes. */
export function formatUtmForMessage(utm: UtmParams = getUtmParams()): string {
  const parts: string[] = [];
  if (utm.utm_source) parts.push(`src=${utm.utm_source}`);
  if (utm.utm_medium) parts.push(`med=${utm.utm_medium}`);
  if (utm.utm_campaign) parts.push(`camp=${utm.utm_campaign}`);
  if (utm.gclid) parts.push(`gclid=${utm.gclid}`);
  if (utm.fbclid) parts.push(`fbclid=${utm.fbclid}`);
  if (utm.landing_page) parts.push(`landing=${utm.landing_page}`);
  if (utm.referrer) parts.push(`ref=${utm.referrer}`);
  return parts.join(' | ');
}
