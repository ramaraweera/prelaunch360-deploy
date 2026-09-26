'use client';

import { useState, useEffect, useRef } from 'react';
import {
  trackEvent,
  getFlagVariant,
  persistHeroVariant,
  onFlagsReady,
  initQAHelper,
} from '@/lib/analytics';

// Copy variants for Hero test
const HERO_COPY: Record<string, { headline: string; subheadline: string; mobileSubheadline: string }> = {
  control: {
    headline: 'Promoga Studio 360',
    subheadline: 'An all-in-one platform for independent instructors and studios — bookings, payments, and student discovery in one place.',
    mobileSubheadline: 'An all-in-one platform for independent instructors — bookings, payments, and discovery in one place.',
  },
  variant_b: {
    headline: 'Stop Juggling 5 Apps. Start Teaching More.',
    subheadline: 'Scheduling, payments, and student discovery — one platform, built for independent Toronto instructors.',
    mobileSubheadline: 'Scheduling, payments, and student discovery — one platform, built for independent Toronto instructors.',
  },
  variant_c: {
    headline: 'Your Students Are Searching for You. Are You Findable?',
    subheadline: 'Studio 360 puts you in front of students actively looking for instructors in Toronto.',
    mobileSubheadline: 'Studio 360 puts you in front of students actively looking for instructors in Toronto.',
  },
};

// Copy variants for CTA test
const CTA_COPY: Record<string, string> = {
  control: 'Apply for a Founding Spot',
  variant_b: 'Apply for a Founding Spot',
  variant_c: 'Apply for a Founding Spot',
};

export function getHeroCopy(variant: string) {
  return HERO_COPY[variant] || HERO_COPY.control;
}

export function getCtaCopy(variant: string): string {
  return CTA_COPY[variant] || CTA_COPY.control;
}

export type SocialVariant = 'control' | 'variant_b' | 'variant_c';

export interface LandingPageExperiments {
  heroVariant: string;
  ctaVariant: string;
  socialVariant: SocialVariant;
  ready: boolean;
}

const SAFETY_TIMEOUT_MS = 400;

export function useLandingPageExperiments(): LandingPageExperiments {
  const [heroVariant, setHeroVariant] = useState('control');
  const [ctaVariant, setCtaVariant] = useState('control');
  const [socialVariant, setSocialVariant] = useState<SocialVariant>('control');
  const [ready, setReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedRef = useRef(false);

  useEffect(() => {
    // Initialize QA helper for manual testing
    initQAHelper();

    // Helper to resolve variants and fire events
    const resolveAndFireEvents = () => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Always read from getFlagVariant which checks localStorage overrides first
      const hero = getFlagVariant('ab_test_hero');
      const cta = getFlagVariant('ab_test_cta');
      const social = getFlagVariant('ab_test_social') as SocialVariant;

      // Persist the same hero value we impress / show — required for calculator
      // attribution even when this resolve used the control fallback before flags loaded.
      persistHeroVariant(hero);

      setHeroVariant(hero);
      setCtaVariant(cta);
      setSocialVariant(social === 'variant_b' || social === 'variant_c' ? social : 'control');
      setReady(true);

      // Fire impression events with actual resolved variants.
      // Use both `flag` (canonical key) and `test` (legacy alias) so historical insights keep working.
      const fireImpression = (test: string, flag: string, variant: string) =>
        trackEvent('ab_impression', {
          test,
          flag,
          flag_key: flag,
          variant,
          source: 'landing_page',
        });
      fireImpression('hero', 'ab_test_hero', hero);
      fireImpression('cta', 'ab_test_cta', cta);
      fireImpression('social', 'ab_test_social', social);
    };

    // Safety timeout - resolve after 400ms if PostHog flags don't respond
    timeoutRef.current = setTimeout(resolveAndFireEvents, SAFETY_TIMEOUT_MS);

    // Also try to wait for PostHog feature flags
    onFlagsReady(resolveAndFireEvents);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { heroVariant, ctaVariant, socialVariant, ready };
}