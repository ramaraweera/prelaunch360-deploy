'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    posthog?: any;
    // Dev-only QA helper — only defined in non-production builds.
    overrideLandingExperiments?: (
      overrides: {
        ab_test_hero?: string;
        ab_test_cta?: string;
        ab_test_social?: string;
      } | false
    ) => void;
    __experimentOverrides?: Record<string, string>;
    __analyticsEventQueue?: Array<{ name: string; properties?: Record<string, unknown> }>;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const OVERRIDE_STORAGE_KEY = '__promoga_experiment_overrides';
const CONSENT_STORAGE_KEY = '__promoga_analytics_consent';
const HERO_VARIANT_STORAGE_KEY = '__promoga_hero_variant';
type ConsentValue = 'granted' | 'denied' | 'unset';

/**
 * Read the user's consent state from localStorage.
 * Defaults to 'unset' (treated as denied for capture, but the banner remains visible).
 */
export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return 'unset';
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (v === 'granted' || v === 'denied') return v;
  } catch {
    /* ignore */
  }
  return 'unset';
}

/**
 * Persist consent state and notify PostHog so it stops or starts capturing.
 * Under CASL/PIPEDA, capture must not run without explicit opt-in.
 */
export function setConsent(value: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
  try {
    if (window.posthog) {
      if (value === 'granted') {
        window.posthog.opt_in_capturing?.();
      } else {
        window.posthog.opt_out_capturing?.();
      }
    }
  } catch {
    /* ignore */
  }
  // If consent was just granted, drain any queued events.
  if (value === 'granted') waitForPostHog();
  // Notify listeners (e.g. Meta Pixel) that consent state changed so they can
  // initialize immediately without requiring a page reload.
  try {
    window.dispatchEvent(new CustomEvent('promoga:consent', { detail: value }));
  } catch {
    /* ignore */
  }
}

/**
 * Load experiment overrides from localStorage into memory.
 */
function loadOverridesFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (stored) {
      window.__experimentOverrides = JSON.parse(stored);
    }
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Flush queued events once PostHog is ready AND consent is granted.
 */
function flushEventQueue(): void {
  if (typeof window === 'undefined' || !window.posthog || !window.__analyticsEventQueue) return;
  if (getConsent() !== 'granted') return;

  const queue = window.__analyticsEventQueue;
  window.__analyticsEventQueue = [];

  for (const event of queue) {
    try {
      window.posthog.capture(event.name, event.properties);
    } catch (err) {
      console.warn('[Analytics] Failed to flush event:', event.name, err);
    }
  }
}

function waitForPostHog(): void {
  if (typeof window === 'undefined') return;
  const checkInterval = setInterval(() => {
    if (window.posthog && window.posthog.__loaded === true) {
      clearInterval(checkInterval);
      flushEventQueue();
    }
  }, 100);
  setTimeout(() => clearInterval(checkInterval), 10000);
}

function isPostHogReady(): boolean {
  if (typeof window === 'undefined' || !window.posthog) return false;
  return window.posthog.__loaded === true;
}

/**
 * Track an analytics event. Respects consent — events are dropped if consent is denied,
 * and queued if consent is granted but PostHog hasn't loaded yet.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const consent = getConsent();
  if (consent === 'denied') return; // Hard drop. Do not queue.

  // If consent is unset, also drop — banner is showing, user hasn't agreed yet.
  // Exception: allow consent_* events to capture for our own audit.
  if (consent === 'unset' && !name.startsWith('consent_')) return;

  if (isPostHogReady()) {
    try {
      window.posthog.capture(name, properties);
    } catch (err) {
      console.warn('[Analytics] Failed to capture event:', name, err);
    }
    return;
  }

  if (!window.__analyticsEventQueue) {
    window.__analyticsEventQueue = [];
    waitForPostHog();
  }
  window.__analyticsEventQueue.push({ name, properties });
}

/**
 * Identify a user once they have submitted a form (have a stable contact ID).
 * Per CASL/PIPEDA, only call after consent is granted AND user has provided info themselves.
 *
 * @param leadId  — internal stable ID (UUID, DB id). NEVER use raw email as distinct_id long-term.
 * @param props   — approved properties only. Do not pass freeform message text or PII.
 */
export function identifyLead(leadId: string, props: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (getConsent() !== 'granted') return;
  if (!isPostHogReady() || !leadId) return;
  try {
    window.posthog.identify(leadId, props);
  } catch (err) {
    console.warn('[Analytics] identify failed', err);
  }
}

/**
 * Get the current variant for a feature flag (with QA override + control fallback).
 */
export function getFlagVariant(flagKey: string): string {
  if (typeof window === 'undefined') return 'control';
  if (!window.__experimentOverrides) loadOverridesFromStorage();
  if (window.__experimentOverrides?.[flagKey]) {
    return window.__experimentOverrides[flagKey];
  }
  if (window.posthog) {
    try {
      const variant = window.posthog.getFeatureFlag(flagKey);
      if (typeof variant === 'string') return variant;
      if (variant === true) return 'control';
    } catch {
      /* ignore */
    }
  }
  return 'control';
}

/**
 * Like getFlagVariant, but returns null when the visitor has NO real assignment
 * for this flag (PostHog not loaded, or flag not bucketed for them) instead of
 * collapsing the unknown case to 'control'. A genuine 'control' assignment still
 * returns the string 'control'. Used off the homepage (e.g. the calculator) so a
 * direct visitor can be labelled 'direct' rather than mislabelled as 'control'.
 */
export function getFlagVariantOrNull(flagKey: string): string | null {
  if (typeof window === 'undefined') return null;
  if (!window.__experimentOverrides) loadOverridesFromStorage();
  if (window.__experimentOverrides?.[flagKey]) {
    return window.__experimentOverrides[flagKey];
  }
  if (window.posthog) {
    try {
      const variant = window.posthog.getFeatureFlag(flagKey);
      if (typeof variant === 'string') return variant;
      if (variant === true) return 'control';
    } catch {
      /* ignore */
    }
  }
  return null;
}

/**
 * First-touch only. Persists the homepage hero variant attributed to this session
 * (the same value sent on ab_impression / hero_cta_click) so calculator CTAs can
 * carry it across page navigations. Safe to call multiple times — will not overwrite.
 */
export function persistHeroVariant(variant: string): void {
  if (typeof window === 'undefined' || !variant) return;
  try {
    if (!sessionStorage.getItem(HERO_VARIANT_STORAGE_KEY)) {
      sessionStorage.setItem(HERO_VARIANT_STORAGE_KEY, variant);
    }
  } catch {
    /* ignore */
  }
}

/** Return the session-persisted homepage hero variant, or null if unset. */
export function getPersistedHeroVariant(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = sessionStorage.getItem(HERO_VARIANT_STORAGE_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

/**
 * Resolve hero variant for calculator / off-homepage CTAs:
 * persisted homepage attribution → live PostHog/override → 'direct'.
 */
export function resolveCalculatorHeroVariant(): string {
  return (
    getPersistedHeroVariant() ??
    getFlagVariantOrNull('ab_test_hero') ??
    'direct'
  );
}

export type HeroCtaButtonLocation = 'header' | 'hero' | 'below_fold';
export type CalculatorCtaButtonLocation =
  | 'calculator_header'
  | 'calculator_primary'
  | 'calculator_secondary'
  | 'calculator_mobile';

export function buildHeroCtaClickProps(buttonLocation: HeroCtaButtonLocation) {
  // Persist the exact variant we emit so calculator events match hero_cta_click,
  // including the control fallback when flags are not ready yet.
  const variant = getFlagVariant('ab_test_hero');
  persistHeroVariant(variant);
  return {
    button_location: buttonLocation,
    source: 'landing_page' as const,
    variant,
  };
}

export function buildCalculatorCtaClickProps(
  buttonLocation: CalculatorCtaButtonLocation,
  revenue: number,
  savings: number,
) {
  return {
    revenue,
    savings,
    source: 'savings_calculator_page' as const,
    button_location: buttonLocation,
    variant: resolveCalculatorHeroVariant(),
  };
}

export function onFlagsReady(callback: () => void): void {
  if (typeof window === 'undefined') {
    callback();
    return;
  }
  if (window.posthog) {
    try {
      window.posthog.onFeatureFlags(callback);
    } catch {
      callback();
    }
  } else {
    callback();
  }
}

/**
 * QA helper for manual variant testing. Persists to localStorage.
 */
export function initQAHelper(): void {
  if (typeof window === 'undefined') return;
  loadOverridesFromStorage();
  // Dev-only QA helper. Never expose in production — allows anyone
  // to force a variant into their own browser session via the console.
  // process.env.NODE_ENV is statically replaced at build time by Next.js,
  // so this whole block is dead-code-eliminated from the production bundle.
  if (process.env.NODE_ENV !== 'production') {
    window.overrideLandingExperiments = (overrides) => {
      if (overrides === false) {
        delete window.__experimentOverrides;
        localStorage.removeItem(OVERRIDE_STORAGE_KEY);
        console.log('[Experiments] Overrides cleared. Refresh to see control variants.');
      } else {
        window.__experimentOverrides = { ...overrides };
        localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(overrides));
        console.log('[Experiments] Overrides set:', overrides);
      }
    };
  }
}

/**
 * Capture UTM + referrer once on first pageview and store as person properties via $set_once.
 * Cheap, no third-party dep.
 */
export function captureFirstTouchAttribution(): void {
  if (typeof window === 'undefined') return;
  if (getConsent() !== 'granted') return;
  if (!isPostHogReady()) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const utmPerson: Record<string, string> = {};
    const utmEvent: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
      const v = params.get(k);
      if (v) {
        utmPerson[`$initial_${k}`] = v;
        utmEvent[`$${k}`] = v;
      }
    });
    if (document.referrer) {
      try {
        utmPerson['$initial_referring_domain'] = new URL(document.referrer).hostname;
      } catch {
        /* ignore */
      }
    }
    if (Object.keys(utmPerson).length > 0) {
      window.posthog.setPersonProperties(undefined, utmPerson); // $set_once-style for initial_*
      window.posthog.register(utmEvent); // per-session UTM for all subsequent events
    }
  } catch {
    /* ignore */
  }
}