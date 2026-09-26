'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Heart } from 'lucide-react';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/promoga' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/livepromoga' },
  { name: 'X', icon: Twitter, href: 'https://x.com/promoga' },
];

const footerLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    // If not on home page, navigate to home with hash
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = '/' + href;
      return;
    }
    const element = document?.querySelector?.(href);
    element?.scrollIntoView?.({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-dark py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="/" className="block mb-6">
              <div className="relative h-14 w-56">
                <Image
                  src="/promoga_logo_green.png"
                  alt="Promoga"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </a>
            <p className="text-white/70 mb-6 max-w-xs">
              The all-in-one platform for independent yoga, fitness, and dance studios. Launching Fall 2026 in Toronto.
            </p>
            <div className="flex gap-4">
              {socialLinks?.map?.((social) => {
                const IconComponent = social?.icon;
                return (
                  <a
                    key={social?.name ?? ''}
                    href={social?.href ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-coral hover:scale-110 transition-all"
                    aria-label={social?.name ?? ''}
                  >
                    {IconComponent && <IconComponent size={20} />}
                  </a>
                );
              }) ?? []}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks?.map?.((link) => (
                <li key={link?.label ?? ''}>
                  <button
                    onClick={() => scrollToSection(link?.href ?? '#')}
                    className="text-white/70 hover:text-coral transition-colors"
                  >
                    {link?.label ?? ''}
                  </button>
                </li>
              )) ?? []}
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white/70 hover:text-coral transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-use"
                  className="text-white/70 hover:text-coral transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Contact</h4>
            <p className="text-white/70">
              Questions?{' '}
              <a href="mailto:support@promoga.com" className="text-coral hover:underline transition-colors">
                Email us at support@promoga.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © 2026 Promoga Technologies Inc. All rights reserved.
          </p>
          <p className="text-white/50 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-coral" /> in Canada
          </p>
        </div>
      </div>
    </footer>
  );
}
