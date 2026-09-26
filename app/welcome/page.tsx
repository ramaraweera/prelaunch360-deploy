'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Script from 'next/script';
import { CheckCircle, Instagram, MapPin } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const ROLES: { value: string; label: string }[] = [
  { value: 'solo_instructor', label: 'Solo Instructor' },
  { value: 'small_studio', label: 'Small Studio (1–3 instructors)' },
  { value: 'larger_studio', label: 'Larger Studio (4+ instructors)' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    google?: any;
    __googleMapsLoaded?: boolean;
  }
}

function WelcomeForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const signupId = searchParams?.get('id') ?? '';
  const emailFromQuery = searchParams?.get('email') ?? '';

  const [instagram, setInstagram] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  const cityInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);

  /** Resolve ownership email: URL param first, then waitlist draft. */
  const resolveSignupEmail = (): string => {
    if (emailFromQuery.trim()) return emailFromQuery.trim();
    try {
      const saved = localStorage.getItem('__promoga_waitlist_draft');
      if (saved) {
        const draft = JSON.parse(saved);
        if (typeof draft?.email === 'string' && draft.email.trim()) {
          return draft.email.trim();
        }
      }
    } catch { /* ignore */ }
    return '';
  };

  // Redirect home if no signup id.
  useEffect(() => {
    if (!signupId) {
      router.replace('/');
    }
  }, [signupId, router]);

  // Bootstrap Google Places autocomplete once script is ready.
  useEffect(() => {
    if (!mapsReady) return;
    if (!cityInputRef.current) return;
    if (autocompleteRef.current) return;
    if (!window.google?.maps?.places) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        cityInputRef.current,
        {
          types: ['(cities)'],
          componentRestrictions: { country: 'ca' },
          fields: ['name', 'formatted_address', 'address_components'],
        }
      );
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (!place) return;
        // Prefer the city short name; fall back to formatted_address or input value.
        let cityName = place.name || '';
        if (place.address_components?.length) {
          const locality = place.address_components.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (c: any) => c.types?.includes('locality') || c.types?.includes('postal_town')
          );
          const province = place.address_components.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (c: any) => c.types?.includes('administrative_area_level_1')
          );
          if (locality?.long_name) {
            cityName = province?.short_name
              ? `${locality.long_name}, ${province.short_name}`
              : locality.long_name;
          }
        }
        setCity(cityName || place.formatted_address || '');
      });
    } catch (err) {
      console.warn('Google Places autocomplete failed to initialize:', err);
    }
  }, [mapsReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    // Show validation messages if checkboxes aren't checked
    if (!agreeTerms || !agreeMarketing) {
      setShowValidation(true);
      return;
    }
    if (!instagram.trim() || !city.trim() || !role) return;
    setIsSubmitting(true);
    setErrorMsg('');

    const signupEmail = resolveSignupEmail();
    if (!signupEmail) {
      setErrorMsg('Missing signup email. Please restart from the waitlist form.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/waitlist/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: signupId,
          email: signupEmail,
          instagramHandle: instagram,
          city,
          role,
        }),
      });
      const data = await response.json();
      if (data?.success) {
        trackEvent('waitlist_qualified', {
          role,
          city,
          source: 'welcome_page',
        });
        // Mark the draft as confirmed so the home page shows a persistent "you're on the list" state
        try {
          const saved = localStorage.getItem('__promoga_waitlist_draft');
          if (saved) {
            const draft = JSON.parse(saved);
            draft.confirmed = true;
            localStorage.setItem('__promoga_waitlist_draft', JSON.stringify(draft));
          }
        } catch { /* ignore */ }
        setIsSuccess(true);
      } else {
        setErrorMsg(data?.message ?? 'Something went wrong.');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = instagram.trim() && city.trim() && role && agreeTerms && agreeMarketing;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  return (
    <>
      {apiKey && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          strategy="afterInteractive"
          onLoad={() => setMapsReady(true)}
          onReady={() => setMapsReady(true)}
        />
      )}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal/10 via-white to-coral/10 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
          {isSuccess ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
                  <CheckCircle size={36} className="text-teal" strokeWidth={1.75} />
                </div>
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark mb-3">
                ✅ You&apos;ve applied — welcome to the founding list.
              </h1>
              <p className="text-neutral-dark/80 text-sm leading-relaxed max-w-md mx-auto mb-3">
                We&apos;re hand-selecting 50 founding instructors for the Toronto launch. A real person will review your studio, and we&apos;ll email you the moment your invitation opens.
              </p>
              <p className="text-neutral-dark/80 text-sm leading-relaxed max-w-md mx-auto mb-3">
                Spots go to instructors who are ready to launch — not whoever applied first. Every studio on this list is genuinely in the running.
              </p>
              <p className="text-neutral-dark/50 text-xs mt-2">
                We&apos;ll email you 1–2× per month, max. Unsubscribe anytime.
              </p>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="mt-6 inline-flex items-center gap-2 text-teal hover:text-teal/80 underline text-sm"
              >
                Back to homepage
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark mb-2">
                Almost there — tell us about your studio
              </h1>
              <p className="text-neutral-dark/70 mb-6">
                Three quick details and your founding application is in.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Instagram */}
                <div>
                  <label
                    htmlFor="instagram"
                    className="block text-sm font-medium text-neutral-dark mb-2"
                  >
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-dark/60">
                      <Instagram size={18} />
                    </span>
                    <span className="absolute inset-y-0 left-10 flex items-center text-neutral-dark/70 font-medium pointer-events-none">
                      @
                    </span>
                    <input
                      id="instagram"
                      type="text"
                      required
                      value={instagram}
                      onChange={(e) =>
                        setInstagram((e.target.value ?? '').replace(/^@+/, ''))
                      }
                      placeholder="yourstudio"
                      data-private
                      className="w-full pl-14 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors bg-white"
                    />
                  </div>
                </div>

                {/* City — Google Places */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-neutral-dark mb-2"
                  >
                    City
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-dark/60">
                      <MapPin size={18} />
                    </span>
                    <input
                      id="city"
                      ref={cityInputRef}
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value ?? '')}
                      placeholder="Start typing your city…"
                      autoComplete="off"
                      className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors bg-white"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-neutral-dark/50">
                    Promoga Studio 360 launches in Canada first.
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-neutral-dark mb-2"
                  >
                    I am a…
                  </label>
                  <select
                    id="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors bg-white text-neutral-dark"
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CASL consent checkboxes */}
                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (e.target.checked) setShowValidation(false);
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal flex-shrink-0"
                    />
                    <span className="text-sm text-neutral-dark/80 leading-snug">
                      I agree to the{' '}
                      <a href="https://promoga.com/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-teal/80">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="https://promoga.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-teal underline hover:text-teal/80">
                        Privacy Policy
                      </a>.
                    </span>
                  </label>
                  {showValidation && !agreeTerms && (
                    <p className="text-xs text-red-500 ml-7">You must agree to the Terms of Service and Privacy Policy.</p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreeMarketing}
                      onChange={(e) => {
                        setAgreeMarketing(e.target.checked);
                        if (e.target.checked) setShowValidation(false);
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal flex-shrink-0"
                    />
                    <span className="text-sm text-neutral-dark/80 leading-snug">
                      Yes, I&apos;d like to receive updates from Promoga (promoga.com) about early access, platform news, and founding member offers. I can unsubscribe at any time.
                    </span>
                  </label>
                  {showValidation && !agreeMarketing && (
                    <p className="text-xs text-red-500 ml-7">You must agree to receive updates to confirm your spot.</p>
                  )}
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-600">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="w-full bg-coral hover:bg-coral-600 text-white font-semibold px-6 py-3.5 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Confirming…' : 'Confirm My Spot'}
                </button>

                <p className="text-xs text-neutral-dark/50 text-center">
                  Updates 2×/month max. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </motion.div>
      </section>
    </>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <WelcomeForm />
    </Suspense>
  );
}
