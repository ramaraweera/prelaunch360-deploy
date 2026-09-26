'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { trackEvent, buildHeroCtaClickProps } from '@/lib/analytics';

type NavLink = {
  href: string;
  label: string;
  external?: boolean; // opens in new tab
  highlight?: boolean; // styled text link emphasis
};

const defaultNavLinks: NavLink[] = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '/savings-calculator', label: 'Savings Calculator' },
  { href: '#for-instructors', label: 'For Instructors' },
];

interface NavigationProps {
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  showThemeToggle?: boolean;
  onCtaClick?: () => void;
}

export default function Navigation({
  links,
  ctaLabel = 'Apply for a Founding Spot',
  ctaHref = '#waitlist',
  ctaExternal = false,
  showThemeToggle = false,
  onCtaClick,
}: NavigationProps = {}) {
  const navLinks = links || defaultNavLinks;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);

  useEffect(() => {
    // Determine if we're on the home page
    setIsHomePage(window.location.pathname === '/');

    const handleScroll = () => {
      setIsScrolled(window?.scrollY > 50);
    };

    window?.addEventListener?.('scroll', handleScroll);
    return () => window?.removeEventListener?.('scroll', handleScroll);
  }, []);

  // Dark mode state
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!showThemeToggle) {
      // Ensure dark class is removed when component without toggle mounts
      document.documentElement.classList.remove('dark');
      return;
    }
    // Check system preference or stored preference
    const stored = localStorage.getItem('promoga-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
    return () => {
      // Clean up dark class when leaving this page
      document.documentElement.classList.remove('dark');
    };
  }, [showThemeToggle]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('promoga-theme', next ? 'dark' : 'light');
  };

  const handleNavClick = (link: NavLink) => {
    if (link.external) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
      return;
    }
    // Internal page link (starts with / but not #)
    if (link.href.startsWith('/') && !link.href.startsWith('#')) {
      if (link.href === '/savings-calculator' && isHomePage) {
        window.posthog?.capture('calculator_link_click', {
          source: 'home_page',
          cta_location: 'nav_link',
        });
      }
      setIsMobileMenuOpen(false);
      window.location.href = link.href;
      return;
    }
    scrollToSection(link.href);
  };

  const handleCtaClick = () => {
    onCtaClick?.();
    // Fire hero_cta_click for the header CTA (homepage only)
    if (isHomePage) {
      trackEvent('hero_cta_click', buildHeroCtaClickProps('header'));
    }
    if (ctaExternal) {
      window.open(ctaHref, '_blank', 'noopener,noreferrer');
      return;
    }
    // Internal page link (starts with / — may include a hash, e.g. "/#waitlist").
    // Navigate to that page; the browser handles scrolling to the hash target.
    if (ctaHref.startsWith('/')) {
      setIsMobileMenuOpen(false);
      window.location.href = ctaHref;
      return;
    }
    scrollToSection(ctaHref);
  };

  const scrollToSection = (href: string) => {
    // Close mobile menu first
    setIsMobileMenuOpen(false);

    // If not on home page and it's a hash link, navigate to home with hash
    if (typeof window !== 'undefined' && window.location.pathname !== '/' && href.startsWith('#')) {
      // Check if the target exists on this page first
      const element = document?.querySelector?.(href);
      if (element) {
        // Section exists on this page, scroll to it
        setTimeout(() => {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - navbarHeight;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }, 100);
        return;
      }
      window.location.href = '/' + href;
      return;
    }

    // Small delay to allow mobile menu to close before scrolling
    setTimeout(() => {
      const element = document?.querySelector?.(href);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Always show logo in white since nav bg is transparent (hero) or teal (scrolled)
  const logoStyle = {
    filter: 'drop-shadow(0px 100px 0 #FFFFFF)',
    transform: 'translateY(-100px)',
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-teal shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center overflow-hidden">
          <div className="relative h-16 w-64">
            <Image
              src="/TransparentBackGround.png"
              alt="Promoga"
              fill
              className="object-contain object-left transition-all duration-300"
              style={logoStyle}
              priority
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks?.map?.((link) => (
            <button
              key={link?.href ?? ''}
              onClick={() => handleNavClick(link)}
              className={`font-medium transition-colors text-white hover:text-white/80 ${
                link?.highlight ? 'font-semibold' : ''
              }`}
            >
              {link?.label ?? ''}{link?.highlight && <span className="ml-0.5 opacity-70"> →</span>}
            </button>
          )) ?? []}
          <button
            onClick={handleCtaClick}
            className="bg-coral hover:bg-coral-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-all hover:scale-105"
          >
            {ctaLabel}
          </button>
          {showThemeToggle && (
            <button
              onClick={toggleTheme}
              className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg transition-colors text-white"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-teal shadow-lg"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks?.map?.((link) => (
                <button
                  key={link?.href ?? ''}
                  onClick={() => handleNavClick(link)}
                  className="text-white hover:text-white/80 font-medium text-left py-2"
                >
                  {link?.label ?? ''}
                </button>
              )) ?? []}
              <button
                onClick={handleCtaClick}
                className="bg-coral hover:bg-coral-600 text-white font-semibold px-6 py-3 rounded-lg transition-all w-full"
              >
                {ctaLabel}
              </button>
              {showThemeToggle && (
                <button
                  onClick={toggleTheme}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors self-start"
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}