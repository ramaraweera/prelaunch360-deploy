'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getConsent } from '@/lib/analytics';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Meta (Facebook) Pixel loader.
 *
 * Privacy-first: the pixel script is NOT injected until the visitor has
 * explicitly granted analytics consent (CASL/PIPEDA). Unlike PostHog, the
 * Meta Pixel has no reliable runtime opt-out, so we simply avoid loading it
 * at all until consent is present.
 *
 * Self-disables when NEXT_PUBLIC_META_PIXEL_ID is not configured (dev/preview),
 * mirroring the GA4 pattern.
 */
export default function MetaPixel() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!PIXEL_ID) return;

    const check = () => {
      if (getConsent() === 'granted') setConsented(true);
    };

    // Initial check (consent may already be granted from a prior visit).
    check();

    // React to consent granted in this tab (custom event from setConsent)
    // or in another tab (storage event).
    window.addEventListener('promoga:consent', check);
    window.addEventListener('storage', check);
    return () => {
      window.removeEventListener('promoga:consent', check);
      window.removeEventListener('storage', check);
    };
  }, []);

  if (!PIXEL_ID || !consented) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
