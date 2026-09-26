'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, Flame, CheckCircle, Bell, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { trackEvent, buildHeroCtaClickProps, getFlagVariant, identifyLead } from '@/lib/analytics';
import { getUTMs } from '@/lib/utm';

export default function WaitlistSection() {
  const router = useRouter();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasPendingDraft, setHasPendingDraft] = useState(false);
  const [pendingSignupId, setPendingSignupId] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('__promoga_waitlist_draft');
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft?.confirmed) {
          setIsConfirmed(true);
        } else if (draft?.signupId && draft?.email) {
          setHasPendingDraft(true);
          setPendingSignupId(draft.signupId);
        }
      }
    } catch {}
    setHasMounted(true);
  }, []);

  const handleClearDraft = () => {
    localStorage.removeItem('__promoga_waitlist_draft');
    setIsConfirmed(false);
    setHasPendingDraft(false);
    setPendingSignupId(null);
    setIsSuccess(false);
  };
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [studentSubmitting, setStudentSubmitting] = useState(false);
  const [studentMessage, setStudentMessage] = useState('');
  const [studentSuccess, setStudentSuccess] = useState(false);
  const [studentConfirmed, setStudentConfirmed] = useState(false);
  const [foundingCount, setFoundingCount] = useState<number | null>(null);
  const [showCounter, setShowCounter] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [instructorFormStarted, setInstructorFormStarted] = useState(false);
  const [studentFormStarted, setStudentFormStarted] = useState(false);

  // Restore student confirmed state from sessionStorage.
  // Scoped to the current session (not localStorage) so a one-time student
  // signup does not permanently overwrite the student entry-point link and
  // bleed into the instructor flow on every future visit / shared device.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('__promoga_student_confirmed');
      if (saved === 'true') {
        setStudentConfirmed(true);
      }
    } catch { /* ignore */ }
  }, []);

  const handleDismissStudentConfirmed = () => {
    setStudentConfirmed(false);
    try { sessionStorage.removeItem('__promoga_student_confirmed'); } catch { /* ignore */ }
  };

  const emailDomain = (e: string): string => {
    const at = e.indexOf('@');
    return at >= 0 ? e.slice(at + 1).toLowerCase() : '';
  };

  const handleInstructorFocus = () => {
    if (instructorFormStarted) return;
    setInstructorFormStarted(true);
    trackEvent('waitlist_form_start', { lead_type: 'instructor', source: 'waitlist_section', ...getUTMs() });
  };

  const handleStudentFocus = () => {
    if (studentFormStarted) return;
    setStudentFormStarted(true);
    trackEvent('waitlist_form_start', { lead_type: 'student', source: 'student_modal', ...getUTMs() });
  };

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

  // Fires on pointerDown so the below-fold CTA is tracked at button-press time —
  // the same interaction model as the header/hero CTAs — rather than during the
  // form-submit flow. Latch de-dupes pointer/mouse/touch within a 250ms window.
  const belowFoldCtaLatchRef = useRef<number>(0);
  const handleBelowFoldCtaPointerDown = useCallback(() => {
    const now = Date.now();
    if (now - belowFoldCtaLatchRef.current < 250) return;
    belowFoldCtaLatchRef.current = now;
    trackEvent('hero_cta_click', buildHeroCtaClickProps('below_fold'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);
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
          source: 'waitlist_section',
          waitlist_position: data?.position,
          hero_variant: getFlagVariant('ab_test_hero'),
          cta_variant: getFlagVariant('ab_test_cta'),
          social_variant: getFlagVariant('ab_test_social'),
          ...getUTMs(),
        });
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_name: 'waitlist_section',
            content_category: 'instructor',
            value: 0,
            currency: 'CAD',
          });
        }
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
        setMessage(data?.message ?? 'Something went wrong. Please try again.');
        setIsError(true);
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setStudentSubmitting(true);
    setStudentMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentEmail, type: 'student' }),
      });
      const data = await response?.json?.();

      if (data?.success) {
        const leadId = data?.id ? `lead_${data.id}` : `lead_${Date.now().toString(36)}`;
        identifyLead(leadId, {
          email: studentEmail,
          email_domain: emailDomain(studentEmail),
          lead_type: 'student',
          waitlist_position: data?.position,
          ...getUTMs(),
        });
        trackEvent('waitlist_signup', {
          lead_type: 'student',
          email_domain: emailDomain(studentEmail),
          source: 'student_modal',
          waitlist_position: data?.position,
          hero_variant: getFlagVariant('ab_test_hero'),
          cta_variant: getFlagVariant('ab_test_cta'),
          social_variant: getFlagVariant('ab_test_social'),
          ...getUTMs(),
        });
        if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_name: 'student_modal',
            content_category: 'student',
            value: 0,
            currency: 'CAD',
          });
        }
        setStudentSuccess(true);
        setStudentConfirmed(true);
        setStudentEmail('');
        // Persist confirmed state for the current session only, so the
        // confirmation reflects the just-completed action without becoming a
        // permanent fixture shown to instructors / other visitors later.
        try { sessionStorage.setItem('__promoga_student_confirmed', 'true'); } catch { /* ignore */ }
      } else {
        setStudentMessage(data?.message ?? 'Something went wrong');
      }
    } catch {
      setStudentMessage('Something went wrong. Please try again.');
    } finally {
      setStudentSubmitting(false);
    }
  };

  return (
    <section
      ref={ref}
      id="waitlist"
      className="py-24"
      style={{
        background: 'linear-gradient(135deg, #0A7E8C 0%, #A8C5AA 100%)',
      }}
    >
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-heading text-3xl md:text-4xl font-bold text-white text-center mb-12"
        >
          Early Access for Founding Instructors and Studios
        </motion.h2>

        <div className="flex justify-center">
          {/* Instructors Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={32} className="text-teal" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-neutral-dark">
                For Founding Instructors & Studios
              </h3>
            </div>
            <p className="text-neutral-dark/70 text-center mb-6">
              Apply as a founding instructor or studio. 6 months free, then 1% commission on bookings.
            </p>

            {hasMounted && isDuplicate ? (
              /* Duplicate application */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle size={24} className="text-green-500" />
                  <h4 className="font-heading text-lg font-semibold text-neutral-dark">
                    You&apos;re already on the founding list
                  </h4>
                </div>
                <p className="text-neutral-dark/70 text-sm leading-relaxed">
                  No need to apply twice. We&apos;ll be in touch as we review. You&apos;re in the running.
                </p>
                <button
                  onClick={() => { setIsDuplicate(false); setEmail(''); }}
                  className="mt-3 text-xs text-teal hover:underline"
                >
                  Apply with a different email
                </button>
              </motion.div>
            ) : hasMounted && (isConfirmed || isSuccess) ? (
              /* Post-signup confirmation */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle size={24} className="text-green-500" />
                  <h4 className="font-heading text-lg font-semibold text-neutral-dark">
                    ✅ You&apos;ve applied — welcome to the founding list.
                  </h4>
                </div>
                <p className="text-neutral-dark/70 text-sm leading-relaxed mb-3">
                  We&apos;re hand-selecting 50 founding instructors for the Toronto launch. A real person will review your studio, and we&apos;ll email you the moment your invitation opens.
                </p>
                <p className="text-neutral-dark/70 text-sm leading-relaxed mb-3">
                  Spots go to instructors who are ready to launch — not whoever applied first. Every studio on this list is genuinely in the running.
                </p>
                {showCounter && foundingCount != null && (
                  <p className="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-dark mt-2">
                    <Flame size={16} className="text-coral" />
                    {foundingCount} in the running for 50 founding spots
                  </p>
                )}
                <p className="text-neutral-dark/50 text-xs mt-3">
                  We&apos;ll email you 1–2× per month, max. Unsubscribe anytime.
                </p>
                <button
                  onClick={handleClearDraft}
                  className="mt-3 text-xs text-teal hover:underline"
                >
                  Not you? Sign up with a different email
                </button>
              </motion.div>
            ) : hasMounted && hasPendingDraft ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <button
                  onClick={() => router.push(`/welcome?id=${pendingSignupId}`)}
                  className="inline-flex items-center gap-2 text-teal hover:text-teal/80 font-medium transition-colors"
                >
                  <Sparkles size={16} />
                  You&apos;re almost there — Complete your application →
                </button>
                <button
                  onClick={handleClearDraft}
                  className="mt-2 block mx-auto text-xs text-neutral-dark/50 hover:underline"
                >
                  Not you? Sign up with a different email
                </button>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email to apply"
                    required
                    value={email}
                    onFocus={handleInstructorFocus}
                    onChange={(e) => setEmail(e?.target?.value ?? '')}
                    data-private
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-100 focus:border-teal focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    onPointerDown={handleBelowFoldCtaPointerDown}
                    disabled={isSubmitting}
                    className="w-full bg-coral hover:bg-coral-600 text-white font-semibold py-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-70"
                  >
                    {isSubmitting ? 'Applying...' : 'Apply for a Founding Spot'}
                  </button>
                </form>

                {/* Below-button microcopy */}
                <p className="text-center text-xs text-neutral-dark/60 mt-4 leading-relaxed px-2">
                  We select 50 founding instructors by fit — not first-come. Every application is read by a real person. Whether you&apos;re #5 or #95, you&apos;re in the running.
                </p>

                {message && (
                  <p className={`text-center text-sm mt-3 font-medium ${isError ? 'text-red-500' : 'text-teal'}`}>
                    {isError ? 'That email doesn\'t look right — mind checking it? We want to make sure your invitation reaches you.' : message}
                  </p>
                )}

                <p className="text-center text-xs text-neutral-dark/50 mt-3">
                  Updates 1–2× per month, max. Unsubscribe anytime.
                </p>
              </>
            )}

            {/* Counter or trust badges */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              {showCounter && foundingCount != null ? (
                <div className="text-center">
                  <p className="flex items-center justify-center gap-2 text-sm font-semibold text-neutral-dark">
                    <Flame size={16} className="text-coral" />
                    🔥 {foundingCount} in the running for 50 founding spots
                  </p>
                  <p className="text-xs text-neutral-dark/50 mt-1">
                    Selected by fit — every application reviewed.
                  </p>
                </div>
              ) : (
                <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-neutral-dark/70">
                  <span>🍁 Canadian-built</span>
                  <span className="text-neutral-dark/30">·</span>
                  <span>📅 No long-term contracts</span>
                  <span className="text-neutral-dark/30">·</span>
                  <span>🏅 1% commission, locked for life</span>
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Student Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-5"
        >
          {hasMounted && studentConfirmed ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[14px] leading-relaxed text-white">
              <CheckCircle size={16} className="shrink-0 text-green-300" />
              <span>You&apos;re on the student launch list — we&apos;ll email you the moment Promoga launches in Toronto.</span>
              <button
                type="button"
                onClick={handleDismissStudentConfirmed}
                aria-label="Dismiss"
                className="ml-1 shrink-0 rounded-full p-0.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ) : (
            <button
              onClick={() => setShowStudentModal(true)}
              className="inline-flex items-center gap-2 text-[15px] leading-relaxed text-white/80 hover:underline underline-offset-4 decoration-white/50 transition-all"
            >
              <Bell size={16} className="shrink-0" />
              Are you a student? Get notified when we launch
            </button>
          )}
        </motion.div>
      </div>

      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
          >
            <button
              onClick={() => {
                setShowStudentModal(false);
                setStudentMessage('');
              }}
              className="absolute top-4 right-4 text-neutral-dark/50 hover:text-neutral-dark text-2xl leading-none"
            >
              &times;
            </button>
            <div className="text-center mb-6">
              <h3 className="font-heading text-xl font-semibold text-neutral-dark mb-2">
                Student Notification List
              </h3>
              <p className="text-neutral-dark/70 text-sm">
                Be first to discover Toronto's best independent classes when we launch.
              </p>
            </div>

            {studentSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-4"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle size={24} className="text-green-500" />
                  <h4 className="font-heading text-lg font-semibold text-neutral-dark">
                    You&apos;re on the list 🎉
                  </h4>
                </div>
                <p className="text-neutral-dark/70 text-sm mb-6">
                  We&apos;ll notify you when Promoga launches in Toronto.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowStudentModal(false);
                    setStudentMessage('');
                  }}
                  className="bg-teal hover:bg-teal/90 text-white font-semibold px-8 py-3 rounded-lg transition-all"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={studentEmail}
                    onFocus={handleStudentFocus}
                    onChange={(e) => setStudentEmail(e?.target?.value ?? '')}
                    data-private
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-100 focus:border-teal focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={studentSubmitting}
                    className="w-full bg-coral hover:bg-coral-600 text-white font-semibold py-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-70"
                  >
                    {studentSubmitting ? 'Joining...' : 'Notify Me'}
                  </button>
                </form>

                {/* CASL consent fine print */}
                <p className="text-center text-xs text-neutral-dark/50 mt-4 leading-relaxed px-2">
                  By clicking Notify Me, you agree to Promoga&apos;s{' '}
                  <Link href="/terms-of-use" target="_blank" className="underline hover:text-teal transition-colors">Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" target="_blank" className="underline hover:text-teal transition-colors">Privacy Policy</Link>,
                  and consent to receive a launch notification email from Promoga (promoga.com).
                  You can unsubscribe at any time.
                </p>

                {studentMessage && (
                  <p className="text-center text-sm mt-4 text-teal font-medium">{studentMessage}</p>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}