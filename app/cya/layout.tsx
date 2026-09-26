import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CYA Members — Claim Your Founding Spot | Promoga Studio 360',
  description: 'Exclusive founding-member access for Canadian Yoga Alliance members. Skip the waitlist, lock in 6 months free and 1% commission for life.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://promoga.com/cya',
  },
};

export default function CyaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
