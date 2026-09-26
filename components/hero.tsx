'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, CheckCircle, Sparkles, ChevronDown } from 'lucide-react';
import { useLandingPageExperiments, getHeroCopy, getCtaCopy } from '@/hooks/useLandingPageExperiments';
import { trackEvent, buildHeroCtaClickProps, getFlagVariant, identifyLead } from '@/lib/analytics';
import { getUTMs } from '@/lib/utm';

const HERO_BG_IMAGE = 'https://cdn.abacus.ai/images/37f48117-2b09-4346-86ad-4318dd61b173.png';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Persistent states from localStorage — only set after mount to avoid hydration mismatch
  const [hasMounted, setHasMounted] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasPendingDraft, setHasPendingDraft] = useState(false);
  const [pendingSignupId, setPendingSignupId] = useState('');
  const [heroFormStarted, setHeroFormStarted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [foundingCount, setFoundingCount] = useState<number | null>(null);
  const [showCounter, setShowCounter] = useState(false);
  const router = useRouter();

  const emailDomain = (e: string): string => {
    const at = e.indexOf('@');
    return at >= 0 ? e.slice(at + 1).toLowerCase() : '';
  };

  const handleHeroFormFocus = () => {
    if (heroFormStarted) return;
    setHeroFormStarted(true);
    trackEvent('waitlist_form_start', { lead_type: 'instructor', source: 'hero', ...getUTMs() });
  };

  // Restore signup state from localStorage AFTER hydration (useEffect)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('__promoga_waitlist_draft');
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft?.confirmed) {
          setIsConfirmed(true);
        } else if (draft?.signupId) {
          setHasPendingDraft(true);
          setPendingSignupId(draft.signupId);
        }
        if (draft?.email) setEmail(draft.email);
      }
    } catch { /* ignore */ }
    setHasMounted(true);
  }, []);

  // Fetch live founding count
  useEffect(() => {
    fetch('/api/waitlist')
      .then((res) => res.json())
      .then((data) => {
        if (data?.foundingCount != null) {
          setFoundingCount(data.foundingCount);
          setShowCounter(!!data.showCounter);
        }
      })
      .catch(() => {});
  }, []);

  const handleClearDraft = () => {
    try { localStorage.removeItem('__promoga_waitlist_draft'); } catch { /* ignore */ }
    setIsConfirmed(false);
    setHasPendingDraft(false);
    setPendingSignupId('');
    setEmail('');
  };

  const prefersReducedMotion = useReducedMotion();
  const { heroVariant, ctaVariant, ready } = useLandingPageExperiments();
  const heroCopy = getHeroCopy(heroVariant);
  const ctaText = getCtaCopy(ctaVariant);

  // Fires on pointerDown so the capture call is issued BEFORE React's
  // re-render cascade from form submit + isSubmitting=true.
  // The ref-guard prevents double-fire from pointerDown + touch events.
  const ctaClickLatchRef = useRef<number>(0);
  const handleCtaPointerDown = useCallback(() => {
    const now = Date.now();
    // De-dupe pointer/mouse/touch events within a 250ms window.
    if (now - ctaClickLatchRef.current < 250) return;
    ctaClickLatchRef.current = now;
    trackEvent('hero_cta_click', buildHeroCtaClickProps('hero'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    if (!email) return;

    setIsSubmitting(true);
    setMessage('');
    setIsDuplicate(false);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'instructor' }),
      });

      const data = await response?.json?.();

      if (data?.success) {
        const leadId = data?.id ? `lead_${data.id}` : `lead_${Date.now().toString(36)}`;
        identifyLead(leadId, {
          email: email,
          email_domain: emailDomain(email),
          lead_type: 'instructor',
          waitlist_position: data?.position,
          ...getUTMs(),
        });
        trackEvent('waitlist_signup', {
          lead_type: 'instructor',
          email_domain: emailDomain(email),
          source: 'hero',
          waitlist_position: data?.position,
          hero_variant: getFlagVariant('ab_test_hero'),
          cta_variant: getFlagVariant('ab_test_cta'),
          social_variant: getFlagVariant('ab_test_social'),
          ...getUTMs(),
        });
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_name: 'hero',
            content_category: 'instructor',
            value: 0,
            currency: 'CAD',
          });
        }
        setIsError(false);
        // Do NOT refresh the live count here — Step 1 (email submit) creates
        // a pending_consent row that is excluded from the public counter.
        // The count only changes when the user completes Step 2 (Confirm My Spot).
        try {
          localStorage.setItem('__promoga_waitlist_draft', JSON.stringify({ email, signupId: data.id }));
        } catch { /* ignore */ }
        setEmail('');
        if (data?.id) {
          router.push(`/welcome?id=${encodeURIComponent(data.id)}&email=${encodeURIComponent(email)}`);
        }
      } else if (data?.duplicate) {
        setIsDuplicate(true);
      } else {
        setMessage(data?.message ?? 'Something went wrong');
        setIsError(true);
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bgStyle = {
    backgroundImage: 'linear-gradient(135deg, rgba(10, 126, 140, 0.7) 0%, rgba(242, 112, 89, 0.5) 100%), url(' + HERO_BG_IMAGE + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[90px] md:pt-[72px]"
      style={bgStyle}
    >
      <div className="container mx-auto px-6 text-center text-white py-8 pb-10 md:py-12 md:pb-14">
        {/* H1 - Headline with A/B variant and flicker prevention */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 30 }}
          transition={{ duration: 0.6 }}
          className={`font-heading text-[2.25rem] md:text-5xl lg:text-[3.5rem] font-bold mb-3 md:mb-5 leading-tight transition-opacity duration-300 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {heroCopy.headline}
        </motion.h1>

        {/* Mobile Copy - Concise, above-the-fold optimized */}
        <div className="md:hidden">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-lg font-medium leading-snug opacity-95 mb-5 px-2 transition-opacity duration-300 ${
              ready ? 'opacity-95' : 'opacity-0'
            }`}
          >
            {heroCopy.mobileSubheadline}
          </motion.p>
        </div>

        {/* Desktop Copy - Clear hierarchy with whitespace */}
        <div className="hidden md:block">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-xl lg:text-[1.35rem] font-medium mb-4 max-w-2xl mx-auto leading-relaxed transition-opacity duration-300 ${
              ready ? 'opacity-95' : 'opacity-0'
            }`}
          >
            {heroCopy.subheadline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base opacity-80 mb-10 max-w-xl mx-auto"
          >
            Early access opening for Toronto instructors in 2026.
          </motion.p>
        </div>

        {hasMounted && isDuplicate ? (
          /* Duplicate application */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle size={24} className="text-green-300" />
              <h4 className="font-heading text-lg font-semibold text-white">
                You&apos;re already on the founding list
              </h4>
            </div>
            <p className="text-white/80 text-sm mb-2">
              No need to apply twice. We&apos;ll be in touch as we review. You&apos;re in the running.
            </p>
            <button
              type="button"
              onClick={() => { setIsDuplicate(false); setEmail(''); }}
              className="text-white/60 hover:text-white/90 text-xs underline transition-colors mt-1"
            >
              Apply with a different email
            </button>
          </motion.div>
        ) : hasMounted && (isSuccess || isConfirmed) ? (
          /* Post-signup confirmation */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle size={24} className="text-green-300" />
              <h4 className="font-heading text-lg font-semibold text-white">
                ✅ You&apos;ve applied — welcome to the founding list.
              </h4>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-lg mx-auto mb-2">
              We&apos;re hand-selecting 50 founding instructors for the Toronto launch. A real person will review your studio, and we&apos;ll email you the moment your invitation opens.
            </p>
            {showCounter && foundingCount != null && (
              <p className="text-white/90 text-sm font-semibold mt-2">
                🔥 {foundingCount} in the running for 50 founding spots
              </p>
            )}
            <p className="text-white/50 text-xs mt-2">
              We&apos;ll email you 1–2× per month, max. Unsubscribe anytime.
            </p>
            <button
              type="button"
              onClick={handleClearDraft}
              className="text-white/60 hover:text-white/90 text-xs underline transition-colors mt-2"
            >
              Not you? Sign up with a different email
            </button>
          </motion.div>
        ) : hasMounted && hasPendingDraft ? (
          /* Resume banner — Screen 1 done, Screen 2 pending */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md rounded-lg px-6 py-4 mb-3">
              <Sparkles size={18} className="text-coral flex-shrink-0" />
              <p className="text-white text-sm font-medium">
                You&apos;re almost there —{' '}
                <button
                  type="button"
                  onClick={() => router.push(`/welcome?id=${encodeURIComponent(pendingSignupId)}`)}
                  className="text-coral hover:text-coral/80 underline font-semibold transition-colors"
                >
                  Complete your signup →
                </button>
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={handleClearDraft}
                className="text-white/60 hover:text-white/90 text-xs underline transition-colors"
              >
                Not you? Sign up with a different email
              </button>
            </div>
          </motion.div>
        ) : (
          /* Normal email form */
          <>
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto mb-4"
            >
              <input
                type="email"
                placeholder="Enter your email to apply"
                value={email}
                onFocus={handleHeroFormFocus}
                onChange={(e) => setEmail(e?.target?.value ?? '')}
                required
                data-private
                className="w-full sm:w-auto flex-1 px-6 py-4 rounded-lg border-2 border-white bg-white/20 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:bg-white/30 transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                onPointerDown={handleCtaPointerDown}
                className={`w-full sm:w-auto bg-coral hover:bg-coral-600 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ${
                  ready ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {isSubmitting ? 'Applying...' : ctaText}
              </button>
            </motion.form>

            {/* Below-button microcopy */}
            <p className="text-xs text-white/60 mt-3 max-w-md mx-auto leading-relaxed">
              We select 50 founding instructors by fit — not first-come. Every application is read by a real person. Whether you&apos;re #5 or #95, you&apos;re in the running.
            </p>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={isError ? 'text-sm mt-3 mb-2 text-red-200' : 'text-sm mt-3 mb-2 text-white'}
              >
                {isError ? 'That email doesn\'t look right — mind checking it? We want to make sure your invitation reaches you.' : message}
              </motion.p>
            )}
          </>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm opacity-90 mb-2 max-w-md mx-auto"
        >
          🎁 Founding instructors in Toronto: 6 months free, then 1% commission — locked for life.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs text-white/60 mb-6 md:mb-8 max-w-md mx-auto"
        >
          Updates 2× per month max. Unsubscribe anytime.
        </motion.p>

        {/* Secondary CTA — savings calculator */}
        <motion.a
          href="/savings-calculator"
          onClick={() =>
            window.posthog?.capture('calculator_link_click', {
              source: 'home_page',
              cta_location: 'hero_cta',
            })
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="inline-block text-sm text-white/85 underline underline-offset-[3px] hover:text-white transition-colors mb-6 md:mb-8"
        >
          → See what you&apos;re currently paying
        </motion.a>

        {/* Social Proof — Counter or Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {showCounter && foundingCount != null ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                🔥 {foundingCount} in the running for 50 founding spots
              </p>
              <p className="text-xs text-white/60 mt-1">
                Selected by fit — every application reviewed.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-lg">🍁</span>
                <span className="text-sm">Canadian-built</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar size={20} />
                <span className="text-sm">No long-term contracts</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-lg">🏅</span>
                <span className="text-sm">1% commission, locked for life</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Scroll cue — in-flow below social proof, always visible with breathing room */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 md:mt-8 flex justify-center cursor-pointer"
          role="button"
          aria-label="Scroll to next section"
          tabIndex={0}
          onClick={() => document.getElementById('relaunch')?.scrollIntoView({ behavior: 'smooth' })}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('relaunch')?.scrollIntoView({ behavior: 'smooth' }); } }}
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
            transition={prefersReducedMotion ? {} : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={28} className="text-white/70" strokeWidth={2} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}