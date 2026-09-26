'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, Users, Headphones, Lock, Calendar, CreditCard, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
export default function CyaPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [studioName, setStudioName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Check localStorage for prior redemption
  const [hasMounted, setHasMounted] = useState(false);
  const [priorRedemption, setPriorRedemption] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem('__promoga_cya_redeemed') === 'true') {
        setPriorRedemption(true);
      }
    } catch { /* ignore */ }
    setHasMounted(true);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Focus name field after scroll
    setTimeout(() => {
      const nameInput = formRef.current?.querySelector('input[name="name"]') as HTMLInputElement | null;
      nameInput?.focus();
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setShowValidation(true);
      return;
    }
    if (!name.trim() || !email.trim() || !code.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');
    setIsInvalid(false);
    setIsDuplicate(false);
    setIsClosed(false);

    try {
      const res = await fetch('/api/cya/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          code: code.trim(),
          studioName: studioName.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (data?.success) {
        setIsSuccess(true);
        try { localStorage.setItem('__promoga_cya_redeemed', 'true'); } catch { /* ignore */ }
      } else if (data?.duplicate) {
        setIsDuplicate(true);
      } else if (data?.invalid) {
        setIsInvalid(true);
      } else if (data?.closed) {
        setIsClosed(true);
      } else {
        setErrorMsg(data?.message ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = name.trim() && email.trim() && code.trim() && agreeTerms;

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* ─── A. Header Strip — logos only, no navigation ─── */}
        <header className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-4 flex items-center justify-center gap-4">
            {/* CYA Logo Placeholder */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg px-4 py-2 min-w-[120px] h-12">
              <span className="text-xs text-neutral-dark/50 font-medium">[CYA LOGO — TBD]</span>
            </div>
            <span className="text-neutral-dark/30 text-lg font-light">×</span>
            {/* Promoga Logo */}
            <div className="relative h-10 w-[120px]">
              <Image
                src="/TransparentBackGround.png"
                alt="Promoga Studio 360"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <p className="text-center text-xs text-neutral-dark/50 pb-3 -mt-1">
            An exclusive partnership for Canadian Yoga Alliance members
          </p>
        </header>

        {/* ─── B. Hero — confirm the offer immediately ─── */}
        <section className="bg-gradient-to-br from-teal/5 via-white to-sage/10 py-16 md:py-24">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-heading text-3xl md:text-[2.75rem] font-bold text-neutral-dark leading-tight mb-5"
            >
              CYA Members: Claim Your Founding-Member Spot — Guaranteed.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-neutral-dark/75 leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              Promoga Studio 360 is the all-in-one platform built for independent yoga and fitness instructors — bookings, payments, and student discovery in one place. As a CYA member, you skip the public waitlist and lock in founding terms.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={scrollToForm}
              className="bg-coral hover:bg-coral-600 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105 text-lg shadow-lg shadow-coral/20"
            >
              Enter My Access Code →
            </motion.button>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xs text-neutral-dark/50 mt-4"
            >
              This page is exclusively for Canadian Yoga Alliance members. Your code was distributed by CYA.
            </motion.p>
          </div>
        </section>

        {/* ─── C. Offer clarity block ─── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-6 max-w-2xl">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark mb-8 text-center">
              What you&apos;re locking in:
            </h2>
            <div className="space-y-4">
              {[
                { icon: Shield, text: 'Guaranteed founding-member access — no waitlist, no application' },
                { icon: Zap, text: '6 months completely free (standard pricing applies after)' },
                { icon: Lock, text: '1% commission rate, locked for life — the public rate may rise later' },
                { icon: Users, text: 'First access to new features as they roll out' },
                { icon: Headphones, text: 'A direct line to the founding team during setup' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center mt-0.5">
                    <item.icon size={16} className="text-teal" />
                  </div>
                  <p className="text-neutral-dark/80 text-[15px] leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── D. Brief "What is Promoga?" block ─── */}
        <section className="py-16 md:py-20 bg-neutral-light">
          <div className="container mx-auto px-6 max-w-2xl">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-dark mb-8 text-center">
              Built for instructors running their own practice
            </h2>
            <div className="space-y-4">
              {[
                { icon: Calendar, text: 'Online booking & schedule management' },
                { icon: Users, text: 'Client management and communications' },
                { icon: CreditCard, text: 'Commission & payment tracking' },
                { icon: LayoutGrid, text: 'One platform that replaces several subscriptions' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon size={18} className="text-teal flex-shrink-0" />
                  <p className="text-neutral-dark/75">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── E. CYA Endorsement Block ─── */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100">
              {/* CYA Logo Placeholder */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-lg px-6 py-3 inline-flex items-center justify-center">
                  <span className="text-sm text-neutral-dark/50 font-medium">[CYA LOGO — TBD]</span>
                </div>
              </div>
              {/* Endorsement quote placeholder */}
              <blockquote className="text-neutral-dark/70 text-lg italic leading-relaxed mb-4">
                &ldquo;[CYA ENDORSEMENT QUOTE — TBD]&rdquo;
              </blockquote>
              <p className="text-xs text-neutral-dark/40">
                Placeholder — real endorsed quote and logo to be supplied after CYA approval.
              </p>
            </div>
          </div>
        </section>

        {/* ─── F. Code Redemption Form ─── */}
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #0A7E8C 0%, #A8C5AA 100%)' }}>
          <div className="container mx-auto px-6 max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              {hasMounted && (isSuccess || priorRedemption) ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
                      <CheckCircle size={36} className="text-teal" strokeWidth={1.75} />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-neutral-dark mb-3">
                    ✅ Your founding spot is confirmed — welcome, Canadian Yoga Alliance member.
                  </h3>
                  <p className="text-neutral-dark/70 text-sm leading-relaxed mb-3">
                    You&apos;ve skipped the application: 6 months free, then 1% commission, locked for life. We&apos;ll email your onboarding details before launch.
                  </p>
                  <p className="text-neutral-dark/50 text-xs">
                    We&apos;ll email you 1–2× per month, max. Unsubscribe anytime.
                  </p>
                </motion.div>
              ) : hasMounted && isDuplicate ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
                      <CheckCircle size={36} className="text-teal" strokeWidth={1.75} />
                    </div>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-neutral-dark mb-2">
                    You&apos;ve already claimed your founding spot
                  </h3>
                  <p className="text-neutral-dark/70 text-sm">
                    No need to redeem twice — we&apos;ll be in touch before launch.
                  </p>
                </motion.div>
              ) : hasMounted && isClosed ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <h3 className="font-heading text-lg font-semibold text-neutral-dark mb-3">
                    🎉 All CYA founding spots have been claimed.
                  </h3>
                  <p className="text-neutral-dark/70 text-sm mb-4">
                    You can still apply for a founding spot on our main page and we&apos;ll review your studio. You&apos;re in the running.
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-coral hover:bg-coral-600 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:scale-[1.02]"
                  >
                    Apply on the Main Page
                  </Link>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-heading text-xl font-bold text-neutral-dark mb-1 text-center">
                    Claim Your Founding Spot
                  </h3>
                  <p className="text-center text-neutral-dark/60 text-sm mb-6">
                    Enter the access code from your CYA email.
                  </p>

                  {isInvalid && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 text-center"
                    >
                      <p className="text-sm text-red-700 mb-2">
                        That code isn&apos;t valid or has expired — no problem.
                      </p>
                      <p className="text-sm text-red-600">
                        You can still{' '}
                        <Link href="/" className="text-teal underline hover:text-teal/80 font-medium">
                          apply for a founding spot on our main page
                        </Link>{' '}
                        and we&apos;ll review your studio. You&apos;re in the running.
                      </p>
                    </motion.div>
                  )}

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="cya-name" className="block text-sm font-medium text-neutral-dark mb-1.5">
                        Name
                      </label>
                      <input
                        id="cya-name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="cya-email" className="block text-sm font-medium text-neutral-dark mb-1.5">
                        Email
                      </label>
                      <input
                        id="cya-email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        data-private
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="cya-code" className="block text-sm font-medium text-neutral-dark mb-1.5">
                        CYA Access Code
                      </label>
                      <input
                        id="cya-code"
                        name="code"
                        type="text"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. CYA-FOUNDING-2026"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors font-mono tracking-wider uppercase"
                      />
                    </div>
                    <div>
                      <label htmlFor="cya-studio" className="block text-sm font-medium text-neutral-dark mb-1.5">
                        Studio / Practice Name <span className="text-neutral-dark/40 font-normal">(optional)</span>
                      </label>
                      <input
                        id="cya-studio"
                        name="studioName"
                        type="text"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        placeholder="Your studio or practice name"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors"
                      />
                    </div>

                    {/* CASL consent */}
                    <div className="pt-1">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => {
                            setAgreeTerms(e.target.checked);
                            if (e.target.checked) setShowValidation(false);
                          }}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal flex-shrink-0"
                        />
                        <span className="text-sm text-neutral-dark/70 leading-snug">
                          I agree to the{' '}
                          <Link href="/terms-of-use" target="_blank" className="text-teal underline hover:text-teal/80">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy-policy" target="_blank" className="text-teal underline hover:text-teal/80">
                            Privacy Policy
                          </Link>, and consent to receive updates from Promoga (promoga.com) about early access, platform news, and founding member offers. I can unsubscribe at any time.
                        </span>
                      </label>
                      {showValidation && !agreeTerms && (
                        <p className="text-xs text-red-500 ml-7 mt-1">
                          You must agree to continue.
                        </p>
                      )}
                    </div>

                    {errorMsg && (
                      <p className="text-sm text-red-600 text-center">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !canSubmit}
                      className="w-full bg-coral hover:bg-coral-600 text-white font-semibold py-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? 'Claiming…' : 'Claim My Founding Spot'}
                    </button>
                  </form>

                  <p className="text-center text-xs text-neutral-dark/50 mt-4 leading-relaxed">
                    No credit card required. Your 6 months free starts the day you activate.<br />
                    Your 1% commission rate is locked at signup.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ─── G. Minimal Footer ─── */}
        <footer className="bg-neutral-dark py-8">
          <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 text-sm text-white/60 mb-3">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/terms-of-use" className="hover:text-white transition-colors">
                Terms of Use
              </Link>
            </div>
            <p className="text-xs text-white/40">
              Questions? Email{' '}
              <a href="mailto:support@promoga.com" className="text-white/60 hover:text-white underline transition-colors">
                support@promoga.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
