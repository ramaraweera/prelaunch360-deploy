'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getConsent, setConsent, trackEvent } from '@/lib/analytics';

/**
 * CASL/PIPEDA-compliant consent banner.
 *
 * Behavior:
 *  - Shows on first visit (consent === 'unset').
 *  - "Accept" → opts user into PostHog capture, persists 'granted'.
 *  - "Decline" → opts user out (PostHog stops capturing), persists 'denied'.
 *  - Until a choice is made, no analytics events are sent. The PostHog SDK
 *    still loads but is initialized with `opt_out_capturing_by_default: true`
 *    via the inline init in app/layout.tsx, so no events leave the browser.
 *  - On /savings-calculator mobile, sits above the sticky Apply bar so Accept /
 *    Decline stay tappable (Apply uses z-90; this banner uses z-[100]).
 *
 * Privacy-policy link points to /privacy.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const c = getConsent();
    setVisible(c === 'unset');
  }, []);

  // Lift the banner above the calculator's sticky mobile Apply bar when present.
  useEffect(() => {
    if (!visible) {
      setBottomOffset(0);
      return;
    }

    let ro: ResizeObserver | null = null;
    let observed: HTMLElement | null = null;
    let mo: MutationObserver | null = null;
    let rafId = 0;

    const clearObserved = () => {
      if (ro && observed) {
        ro.unobserve(observed);
        observed = null;
      }
    };

    const measure = () => {
      const el = document.querySelector('.mobile-apply-bar') as HTMLElement | null;
      if (!el || getComputedStyle(el).display === 'none') {
        setBottomOffset(0);
        clearObserved();
        return;
      }

      setBottomOffset(el.offsetHeight);

      if (!ro) {
        ro = new ResizeObserver(() => {
          if (observed && getComputedStyle(observed).display !== 'none') {
            setBottomOffset(observed.offsetHeight);
          } else {
            setBottomOffset(0);
          }
        });
      }

      if (observed !== el) {
        clearObserved();
        ro.observe(el);
        observed = el;
        // Bar found — stop watching the whole body for mount.
        mo?.disconnect();
        mo = null;
      }
    };

    measure();

    // Calculator content can mount after this banner (Suspense / client nav).
    if (!observed) {
      mo = new MutationObserver(() => {
        measure();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      mo?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [visible, pathname]);

  if (!visible) return null;

  const accept = () => {
    setConsent('granted');
    trackEvent('consent_granted', { surface: 'banner' });
    setVisible(false);
  };
  const decline = () => {
    setConsent('denied');
    // We deliberately don't capture an event for declined users.
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and analytics consent"
      className="fixed inset-x-0 z-[100] bg-white border-t border-gray-200 shadow-lg"
      style={{ bottom: bottomOffset }}
    >
      <div className="container mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
        <p className="text-sm text-neutral-dark/80 flex-1">
          We use cookies and analytics to understand how visitors use Promoga and improve the experience. See our{' '}
          <a href="/privacy-policy" className="underline text-teal hover:text-teal/80">
            privacy policy
          </a>
          .
        </p>
        <div className="flex gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={decline}
            className="px-4 py-2 text-sm rounded-lg border-2 border-gray-300 text-neutral-dark hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
