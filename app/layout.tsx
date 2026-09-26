import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import ConsentBanner from '@/components/consent-banner';
import AnalyticsBootstrap from '@/components/analytics-bootstrap';
import MetaPixel from '@/components/meta-pixel';

export const dynamic = 'force-dynamic';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'Promoga Studio 360 | The All-in-One Platform for Independent Studios',
  description:
    'Schedule, teach, and grow—your way. Promoga Studio 360 is the best-of-breed marketplace platform for independent yoga, fitness, and dance studios and instructors. Coming Fall 2026 to Toronto.',
  keywords: [
    'yoga',
    'fitness',
    'dance',
    'studio management',
    'Toronto',
    'wellness',
    'scheduling',
    'booking',
    'instructor',
  ],
  authors: [{ name: 'Promoga' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: '/',
    title: 'Promoga Studio 360 | The All-in-One Platform for Independent Studios',
    description: 'Schedule, teach, and grow—your way. Coming Fall 2026 to Toronto.',
    siteName: 'Promoga Studio 360',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Promoga Studio 360 | The All-in-One Platform for Independent Studios',
    description: 'Schedule, teach, and grow—your way. Coming Fall 2026 to Toronto.',
    images: ['/og-image.png'],
  },
};

// Env-aware analytics gating.
// PostHog is only injected on production. NEXT_PUBLIC_POSTHOG_DISABLED='true' allows force-disable
// (useful for previews / staging). Local dev is opt-in via NEXT_PUBLIC_POSTHOG_ENABLE_DEV='true'.
const NODE_ENV = process.env.NODE_ENV;
const POSTHOG_DISABLED = process.env.NEXT_PUBLIC_POSTHOG_DISABLED === 'true';
const POSTHOG_ENABLE_DEV = process.env.NEXT_PUBLIC_POSTHOG_ENABLE_DEV === 'true';
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Reverse-proxy path — all PostHog traffic routes through promoga.com/relay/*
// via Next.js middleware rewrites, using a non-tracker-like path to bypass
// Chrome Enhanced Tracking Protection (which blocks /e/, /capture/, etc.).
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || '/relay';
const ANALYTICS_ENABLED =
  !POSTHOG_DISABLED && (NODE_ENV === 'production' || POSTHOG_ENABLE_DEV);
const POSTHOG_ENABLED = ANALYTICS_ENABLED && !!POSTHOG_KEY;

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA_ENABLED = ANALYTICS_ENABLED && !!GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" />
        {GA_ENABLED && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                // GA4 with consent mode v2 — denied by default until consent banner grants.
                gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied'
                });
                gtag('config', '${GA_ID}', { 'anonymize_ip': true });
              `}
            </Script>
          </>
        )}
        {POSTHOG_ENABLED && (
          <Script id="posthog" strategy="afterInteractive">
            {`
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="vi init Ti Ci ft Ri Oi ki capture calculateEventProperties Li register register_once register_for_session unregister unregister_for_session zi getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty Ni Ai createPersonProfile setInternalOrTestUser Ui Si Hi opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Fi debug bt ji getPageViewId captureTraceFeedback captureTraceMetric wi".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('${POSTHOG_KEY}', {
                  api_host: '${POSTHOG_HOST}',
                  ui_host: 'https://us.posthog.com',
                  person_profiles: 'identified_only',
                  autocapture: true,
                  // CASL/PIPEDA: do not capture anything until the user explicitly opts in via the consent banner.
                  opt_out_capturing_by_default: true,
                  // DNT removed — we handle consent ourselves via the CASL/PIPEDA banner.
                  // respect_dnt caused silent capture failure in Chrome (which still sends DNT headers)
                  // while Firefox dropped DNT support entirely in v135, creating inconsistent behavior.
                  respect_dnt: false,
                  // Use localStorage as primary persistence so opt-in/out state survives
                  // Chrome's third-party cookie blocking. Falls back to cookie if needed.
                  persistence: 'localStorage+cookie',
                  // Mask sensitive form inputs by default in session recordings.
                  session_recording: {
                    maskAllInputs: true,
                    maskTextSelector: '[data-private]'
                  },
                  // Disable verbose console logging in prod.
                  debug: ${NODE_ENV !== 'production'},
                  loaded: function(ph) {
                    try {
                      var consent = (typeof localStorage !== 'undefined') ? localStorage.getItem('__promoga_analytics_consent') : null;
                      if (consent === 'granted') ph.opt_in_capturing();
                      else ph.opt_out_capturing();
                    } catch (e) { /* ignore */ }
                  }
              })
            `}
          </Script>
        )}
      </head>
      <body className="antialiased">
        {children}
        {ANALYTICS_ENABLED && <AnalyticsBootstrap />}
        {ANALYTICS_ENABLED && <ConsentBanner />}
        <MetaPixel />
      </body>
    </html>
  );
}