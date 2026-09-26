'use client';

import { useEffect } from 'react';
import { captureFirstTouchAttribution, getConsent } from '@/lib/analytics';
import { captureUTMs } from '@/lib/utm';

/**
 * Runs once on the client after PostHog has had a chance to load.
 *  - Captures first-touch UTM/referrer (if consent granted)
 *  - Re-applies opt-out preference if user previously declined
 */
export default function AnalyticsBootstrap() {
  useEffect(() => {
    // Persist first-touch UTMs as early as possible (independent of consent so
    // they survive to the eventual signup event once consent is granted).
    captureUTMs();
    const consent = getConsent();
    // Re-apply preference on every page load — guards against SDK reset.
    if (typeof window !== 'undefined' && (window as any).posthog) {
      try {
        if (consent === 'denied') (window as any).posthog.opt_out_capturing?.();
        if (consent === 'granted') (window as any).posthog.opt_in_capturing?.();
      } catch {
        /* ignore */
      }
    }
    // Wait briefly for PostHog to load, then capture first-touch attribution.
    const t = setTimeout(captureFirstTouchAttribution, 800);
    return () => clearTimeout(t);
  }, []);
  return null;
}
