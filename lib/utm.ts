'use client';

/**
 * First-touch UTM capture + retrieval.
 *
 * PostHog attaches utm_* to the initial $pageview automatically, but NOT to
 * subsequent custom events. To measure paid-ad ROI we persist the landing UTMs
 * to sessionStorage on first load and re-attach them to meaningful events
 * (waitlist_form_start, waitlist_signup, identifyLead, calculator_* etc.).
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const STORAGE_KEY = '__promoga_utms';

/**
 * Capture utm_* params from the current URL and persist them (first-touch only).
 * Safe to call multiple times — it will not overwrite an existing first-touch set.
 */
export function captureUTMs(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) found[k] = v;
    }
    if (Object.keys(found).length > 0 && !sessionStorage.getItem(STORAGE_KEY)) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    }
  } catch {
    /* ignore */
  }
}

/**
 * Return the persisted first-touch UTMs (or an empty object). Never throws.
 */
export function getUTMs(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
