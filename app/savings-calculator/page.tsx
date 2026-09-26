'use client';

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { trackEvent, buildCalculatorCtaClickProps, type CalculatorCtaButtonLocation } from '@/lib/analytics';
import { getUTMs } from '@/lib/utm';
import './calculator.css';

// Minimal debounce helper (avoids a dependency on lodash types).
function debounce<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* ------------------------------------------------------------------ */
/*  Types & constants                                                   */
/* ------------------------------------------------------------------ */

interface Tool {
  id: string;
  name: string;
  desc: string;
  pay: number;   // CAD/mo
  tag: string;
  tagType: 'replaced' | 'included';
  replaces: boolean;
  pnote: string;
}

const TOOLS: Tool[] = [
  { id: 'gcal',     name: 'Google Calendar sync + client booking', desc: 'Prevents double-bookings',     pay: 0,      tag: 'Included',          tagType: 'included', replaces: false, pnote: 'Syncs with Google Calendar — no double-bookings' },
  { id: 'acuity',   name: 'Acuity (scheduling & booking)',         desc: 'USD $20 → CAD',                 pay: 28,  tag: 'Replaced',          tagType: 'replaced', replaces: true,  pnote: 'Scheduling & booking included' },
  { id: 'zoom',     name: 'Zoom Pro',                              desc: 'Virtual classes',                pay: 22.90,  tag: 'Replaced',          tagType: 'replaced', replaces: true,  pnote: 'Scheduler links to your Zoom or free Google Meet †' },
  { id: 'mail',     name: 'Email Marketing',                       desc: 'Mailchimp ~500 contacts',           pay: 18.30,  tag: 'Included',          tagType: 'included', replaces: false, pnote: 'Email campaigns built in' },
  { id: 'site',     name: 'Website & Online Presence',              desc: 'Squarespace / Wix basic',           pay: 18.00,  tag: 'Included',          tagType: 'included', replaces: false, pnote: 'Studio profile page + embedded scheduler' },
  { id: 'momence',  name: 'Momence (mid tier)',                     desc: 'Base + transaction fees',           pay: 84.00,  tag: 'Replaces Momence',  tagType: 'replaced', replaces: true,  pnote: 'Embedded scheduler + 1% vs Momence ~6.4–8.9% all-in' },
  { id: 'mindbody', name: 'Mindbody (Starter)',                     desc: 'USD $79 → CAD',                 pay: 110,    tag: 'Replaces Mindbody', tagType: 'replaced', replaces: true,  pnote: 'Embedded scheduler + booking at 1% commission' },
];

const STAGE_TOOLS: Record<number, string[]> = {
  500:  ['acuity', 'zoom', 'mail'],
  1500: ['acuity', 'zoom', 'mail'],
  3000: ['acuity', 'zoom', 'mail', 'site'],
  7000: ['momence'],
};

const STAGES = [
  { value: 500,  label: 'Just starting' },
  { value: 1500, label: 'Building' },
  { value: 3000, label: 'Full-time' },
  { value: 7000, label: 'Small studio' },
];

const COMMISSION = 0.01;
const FREE_MONTHS = 6;
const MIN_REV = 200;
const MAX_REV = 7000;

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString('en-CA', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/* ------------------------------------------------------------------ */
/*  Inner component (needs useSearchParams)                             */
/* ------------------------------------------------------------------ */

function CalculatorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Hydrate from URL or defaults
  const initRev = (() => {
    const p = searchParams.get('rev');
    if (p) { const n = parseInt(p, 10); if (!isNaN(n)) return Math.min(MAX_REV, Math.max(MIN_REV, n)); }
    return 1500;
  })();

  const initTools = (() => {
    const p = searchParams.get('on');
    if (p) {
      const ids = p.split(',');
      const map: Record<string, boolean> = {};
      TOOLS.forEach(t => { map[t.id] = ids.includes(t.id); });
      return map;
    }
    // Default = $1500 stage tools
    const map: Record<string, boolean> = {};
    TOOLS.forEach(t => { map[t.id] = STAGE_TOOLS[1500].includes(t.id); });
    return map;
  })();

  const initPeriod = (searchParams.get('p') === 'monthly' ? 'monthly' : 'annual') as 'monthly' | 'annual';

  const [revenue, setRevenue] = useState(initRev);
  const [tools, setTools] = useState<Record<string, boolean>>(initTools);
  const [period, setPeriod] = useState<'monthly' | 'annual'>(initPeriod);
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [displaySavings, setDisplaySavings] = useState(0);
  const animRef = useRef<number | null>(null);
  const prevSavingsRef = useRef(0);
  const resultShownRef = useRef(false);
  const ctaClickLatchRef = useRef<number>(0);

  // ---- Computations ----
  const todayMonthly = useMemo(() => TOOLS.reduce((s, t) => s + (tools[t.id] ? t.pay : 0), 0), [tools]);
  const promFee = COMMISSION * revenue;
  const promYr1 = promFee * (12 - FREE_MONTHS);
  const saveYr = Math.max(0, todayMonthly * 12 - promYr1);
  const saveMoRec = Math.max(0, todayMonthly - promFee);
  const savings = period === 'annual' ? saveYr : saveMoRec;
  const todayBox = todayMonthly * (period === 'annual' ? 12 : 1);
  const ctaAmount = saveYr;
  const equivMonths = Math.max(1, Math.round(saveYr / 200));

  const handleCalculatorCtaPointerDown = useCallback(
    (buttonLocation: CalculatorCtaButtonLocation) => {
      const now = Date.now();
      if (now - ctaClickLatchRef.current < 250) return;
      ctaClickLatchRef.current = now;
      trackEvent(
        'calculator_cta_click',
        buildCalculatorCtaClickProps(buttonLocation, revenue, ctaAmount),
      );
    },
    [revenue, ctaAmount],
  );

  // Active preset
  const activePreset = STAGES.find(s => s.value === revenue)?.value ?? null;

  // ---- Count-up animation ----
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) { setDisplaySavings(savings); return; }

    const from = prevSavingsRef.current;
    const to = savings;
    prevSavingsRef.current = to;
    if (from === to) { setDisplaySavings(to); return; }

    const duration = 500;
    const start = performance.now();
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplaySavings(Math.round(from + (to - from) * eased));
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [savings]);

  // ---- Analytics: fire once on mount ----
  useEffect(() => {
    trackEvent('calculator_viewed', {
      source: 'savings_calculator_page',
      initial_revenue: revenue,
      ...getUTMs(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Analytics: fire once when a positive savings value first appears ----
  useEffect(() => {
    if (!resultShownRef.current && savings > 0) {
      resultShownRef.current = true;
      trackEvent('calculator_result_shown', { revenue, savings, ...getUTMs() });
    }
  }, [savings, revenue]);

  // ---- Analytics: debounced input-change tracker (avoids per-keystroke spam) ----
  const trackInputChanged = useMemo(
    () =>
      debounce((value: number, source: 'preset' | 'slider' | 'input') => {
        trackEvent('calculator_input_changed', { revenue: value, source, ...getUTMs() });
      }, 300),
    []
  );

  // ---- Handlers ----
  const handlePreset = useCallback((value: number) => {
    setRevenue(value);
    trackInputChanged(value, 'preset');
    const stageTools = STAGE_TOOLS[value] || [];
    const newTools: Record<string, boolean> = {};
    TOOLS.forEach(t => { newTools[t.id] = stageTools.includes(t.id); });
    setTools(newTools);
  }, [trackInputChanged]);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    setRevenue(v);
    trackInputChanged(v, 'slider');
  }, [trackInputChanged]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') { setRevenue(MIN_REV); return; }
    const n = parseInt(raw, 10);
    const clamped = Math.min(MAX_REV, Math.max(MIN_REV, n));
    setRevenue(clamped);
    trackInputChanged(clamped, 'input');
  }, [trackInputChanged]);

  const toggleTool = useCallback((id: string) => {
    setTools(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleCopy = useCallback(() => {
    const onTools = TOOLS.filter(t => tools[t.id]).map(t => t.id).join(',');
    const url = `${window.location.origin}/savings-calculator?rev=${revenue}&on=${onTools}&p=${period}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [revenue, tools, period]);

  const sliderPercent = ((revenue - MIN_REV) / (MAX_REV - MIN_REV)) * 100;

  // ---- Render ----
  return (
    <div className={`calc-root ${theme}`} data-theme={theme}>

      <Navigation
        links={[
          { href: '#faq', label: 'FAQ' },
          { href: '/', label: 'About Promoga' },
        ]}
        ctaLabel="Apply for a Founding Spot"
        ctaHref="/#waitlist"
        ctaExternal={false}
        showThemeToggle={false}
        onCtaClick={() => handleCalculatorCtaPointerDown('calculator_header')}
      />

      <main className="calc-main">
        {/* Hero */}
        <section className="calc-hero">
          <div className="calc-hero-inner">
            <p className="calc-eyebrow">SAVINGS CALCULATOR · ALL PRICES IN CAD</p>
            <h1 className="calc-h1">See what your studio software really costs.</h1>
            <p className="calc-sub">See your real software costs vs Promoga's 1% — in 30 seconds.</p>
          </div>
        </section>

        {/* Body */}
        <div className="calc-body">
          <div className="calc-grid">
            {/* ---- CONTROLS CARD ---- */}
            <div className="calc-card">
              <h2 className="calc-q">How much do you earn from bookings each month?</h2>
              <p className="calc-context">We'll show what you'd save with Promoga.</p>

              {/* Stage presets */}
              <div className="calc-presets">
                {STAGES.map(s => (
                  <button
                    key={s.value}
                    className={`calc-preset ${activePreset === s.value ? 'active' : ''}`}
                    onClick={() => handlePreset(s.value)}
                    aria-pressed={activePreset === s.value}
                  >
                    <span className="preset-amount">${fmt(s.value)}</span>
                    <span className="preset-label">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div className="calc-slider-section">
                <div className="calc-slider-wrap">
                  <input
                    type="range"
                    min={MIN_REV}
                    max={MAX_REV}
                    step={100}
                    value={revenue}
                    onChange={handleSlider}
                    aria-label="Monthly booking revenue"
                    className="calc-slider"
                    style={{ '--fill': `${sliderPercent}%` } as React.CSSProperties}
                  />
                  <div className="calc-slider-labels">
                    <span>$200</span>
                    <span>$7,000+</span>
                  </div>
                </div>
                <div className="calc-input-wrap">
                  <span className="calc-input-prefix">CAD $</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="calc-input"
                    value={fmt(revenue)}
                    onChange={handleInput}
                    aria-label="Monthly booking revenue in CAD"
                  />
                  <span className="calc-input-suffix">/ mo</span>
                </div>
              </div>

              {/* Tool toggles */}
              <div className="calc-tools-header">
                <h3 className="calc-tools-title">Your stack today vs Promoga</h3>
                <span className="calc-tools-hint">auto-set by stage · tap to adjust</span>
              </div>
              <div className="calc-tools">
                {TOOLS.map(tool => {
                  const on = tools[tool.id];
                  return (
                    <div key={tool.id} className={`calc-tool ${on ? '' : 'off'}`}>
                      <button
                        className={`calc-toggle ${on ? 'active' : ''}`}
                        onClick={() => toggleTool(tool.id)}
                        role="switch"
                        aria-checked={on}
                        aria-label={`Toggle ${tool.name}`}
                      >
                        <span className="toggle-thumb" />
                      </button>
                      <div className="tool-info">
                        <span className="tool-name">{tool.name}</span>
                        <span className="tool-desc">{tool.desc}</span>
                      </div>
                      <div className="tool-vs">
                        <div className="side today">
                          <span className="side-label">TODAY</span>
                          <span className="side-val today-val">CAD ${fmt(tool.pay, 2)}</span>
                        </div>
                        <span className="arrow">→</span>
                        <div className="side prom">
                          <span className="side-label">WITH PROMOGA</span>
                          <span className="side-val prom-val">$0 <span className={`status-tag ${tool.tagType}`}>{tool.tag}</span></span>
                          <span className="pnote">{tool.pnote}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Disclosure */}
              <details className="calc-disclosure">
                <summary>▸ How we calculate this & full vendor pricing</summary>
                <div className="disc-content">
                  <p>Today’s cost sums your toggled tools. USD vendors are converted at 1 USD = 1.40 CAD. Vendor pricing as of June 2026.</p>
                  <p>Promoga includes scheduling, booking, email, and a studio profile at <strong>CAD $0/mo</strong>. Promoga earns <strong>1% on bookings, only when you do</strong> — locked for life at the founding rate.</p>
                  <p><strong>Live video:</strong> Promoga’s scheduler links to your existing Zoom or to free Google Meet — so the Zoom line drops to CAD $0. If you choose Google Workspace Starter for longer/branded meetings, that’s USD $7 → CAD $9.80/mo paid <strong>to Google, not Promoga</strong>, and is <strong>not</strong> counted in savings.</p>
                  <p><strong>First 6 months free</strong> (Promoga earns CAD $0); then 1% of booking revenue.</p>
                  <p><strong>Stripe:</strong> 2.9% + CAD $0.30 applies to all platforms including Promoga — it’s a bank fee, not a Promoga fee.</p>
                  <p>Cohort note: solo instructors average CAD $58–72/mo in tool spend before switching.</p>
                </div>
              </details>
            </div>

            {/* ---- RESULT CARD ---- */}
            <div className="calc-card result-card">
              <div className="result-label">YOUR ESTIMATED SAVINGS</div>

              {/* Period toggle */}
              <div className="period-toggle">
                <button
                  className={`period-btn ${period === 'monthly' ? 'active' : ''}`}
                  onClick={() => setPeriod('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`period-btn ${period === 'annual' ? 'active' : ''}`}
                  onClick={() => setPeriod('annual')}
                >
                  Annual
                </button>
              </div>

              {/* Big number */}
              <div className="result-big">
                <span className="result-you-save">You save</span>
                <span className="result-number">
                  CAD ${fmt(displaySavings)}
                  <span className="result-suffix"> {period === 'annual' ? '/yr' : '/mo'}</span>
                </span>
              </div>

              {/* Two-box comparison */}
              <div className="result-boxes">
                <div className="result-box today-box">
                  <span className="box-label">TODAY</span>
                  <span className="box-amount today-amount">CAD ${fmt(todayBox, 0)}</span>
                  <span className="box-caption">on your current tools {period === 'annual' ? '/yr' : '/mo'}</span>
                </div>
                <div className="result-box promoga-box">
                  <span className="box-label">WITH PROMOGA</span>
                  <span className="box-amount promoga-amount">CAD $0</span>
                  <span className="box-caption">for your first 6 months</span>
                  <div className="box-divider" />
                  <span className="box-line2">then 1% · ≈ CAD ${fmt(promYr1, 0)} (yr 1)</span>
                </div>
              </div>

              {/* Equivalence line */}
              <p className="result-equiv">💡 That’s ≈ {equivMonths} month{equivMonths !== 1 ? 's' : ''} of marketing covered.</p>

              <div className="time-bonus">⏱️ <span>Plus you reclaim ~5–10 hrs/week now lost to juggling logins and double entry — that's the all-in-one advantage.</span></div>

              {/* CTA — directly after comparison to stay above fold */}
              <Link
                href="/#waitlist"
                className="result-cta"
                onPointerDown={() => handleCalculatorCtaPointerDown('calculator_primary')}
              >
                Apply for a Founding Spot — keep CAD ${fmt(ctaAmount)}/yr →
              </Link>

              {/* Single reassurance line */}
              <p className="result-reassurance-line">6 months free · no credit card · 1% locked for life</p>

              {/* Copy link */}
              <button className="result-copy" onClick={handleCopy}>
                {copied ? '✅ Link copied!' : '🔗 Copy result link'}
              </button>

              {/* Fineprint */}
              <p className="result-fineprint">
                Estimate only. Tax and reporting are the instructor’s responsibility. Promoga is CAD $0/mo for your first 6 months, then 1% of bookings. Your annual savings figure already subtracts that 1% for months 7–12 (e.g. at $3,000/mo bookings ≈ CAD $180 in year 1), so it reflects your true first-year net. Live video runs on your existing Zoom or free Google Meet — an optional Google Workspace Starter plan (USD $7 → CAD $9.80/mo) is paid to Google, not Promoga.
              </p>
            </div>
          </div>

          {/* Reassurance strip */}
          <div className="calc-reassurance">
            <span>🇨🇦 Canadian-built</span>
            <span className="dot">·</span>
            <span>📅 No long-term contracts</span>
            <span className="dot">·</span>
            <span>🏅 1% commission, locked for life</span>
          </div>
        </div>

        {/* §4.8 — Trust trio */}
        <section className="trust-section">
          <div className="trust-inner">
            <h2 className="trust-heading">How does Promoga stay free for 6 months?</h2>
            <div className="trust-grid">
              <div className="trust-card">
                <span className="trust-icon">⏱</span>
                <h3 className="trust-card-title">You earn first, we earn after</h3>
                <p className="trust-card-body">Promoga earns 1% on bookings — only when you do. During the 6-month free period, Promoga earns CAD $0. At CAD $1,500/mo that's CAD $15/mo after — vs CAD $60–250/mo today.</p>
              </div>
              <div className="trust-card">
                <span className="trust-icon">🛡</span>
                <h3 className="trust-card-title">No hidden fees</h3>
                <p className="trust-card-body">The 1% founding rate is locked for life. The only other charge is Stripe's 2.9% + CAD $0.30 — identical to every platform you already use. Compare this to Momence's 3.9% + CAD $0.30 transaction fee.</p>
              </div>
              <div className="trust-card">
                <span className="trust-icon">🖥</span>
                <h3 className="trust-card-title">Studio profile + scheduler included</h3>
                <p className="trust-card-body">Every instructor gets a personalized studio profile page with a live booking scheduler. No website? Use it as your online home. Already have a site? Embed the scheduler free — no extra cost.</p>
              </div>
            </div>
          </div>
        </section>

        {/* §4.9 — FAQ accordion */}
        <section className="faq-section" id="faq">
          <div className="faq-inner">
            <h2 className="faq-heading">Questions instructors ask us</h2>
            <div className="faq-list">
              {[
                { q: 'How does Promoga make money if it\'s free for 6 months?', a: 'We earn a flat 1% on your bookings, only after your first 6 months. You build your client base risk-free first; we only earn when you do. No monthly subscription, ever.' },
                { q: 'What is the studio profile and do I need a website?', a: 'Every instructor gets a personalized studio profile page with a live booking scheduler built in. No separate website needed; if you already have a site, embed the scheduler free.' },
                { q: 'What happens after the 6 months free?', a: 'A flat 1% on bookings, locked for life at the founding rate. No monthly, setup, or per-feature fees.' },
                { q: 'Is the 1% rate really locked forever?', a: 'Yes. Founding instructors/studios keep 1% for life, even as prices rise for later sign-ups. Part of the Toronto launch founding offer.' },
                { q: 'How do Promoga\'s fees compare to Momence\'s transaction fees?', a: 'Promoga is 1% + standard Stripe (2.9% + CAD $0.30). All-in platforms like Momence add their own ~3.9% + CAD $0.30 fee on top of subscription tiers, so their effective all-in cost runs ~6.4–8.9%.' },
                { q: 'Are there any other hidden fees?', a: 'No. Only the 1% on bookings (after 6 months) and Stripe\'s standard processing fee (a bank fee, not a Promoga fee).' },
                { q: 'Can I cancel anytime?', a: 'Yes; no long-term contracts, cancel any time, no credit card to start.' },
              ].map((item, i) => (
                <details key={i} className="faq-item">
                  <summary className="faq-question">
                    <span>{item.q}</span>
                    <svg className="faq-chevron" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </summary>
                  <div className="faq-answer">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* §4.10 — Closing CTA band */}
        <section className="closing-cta">
          <div className="closing-cta-inner">
            <h2 className="closing-cta-heading">Ready to keep more of what you earn?</h2>
            <p className="closing-cta-sub">6 months free · then just 1% · locked for life.</p>
            <Link
              href="/#waitlist"
              className="closing-cta-btn"
              onPointerDown={() => handleCalculatorCtaPointerDown('calculator_secondary')}
            >
              Apply for a Founding Spot →
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky mobile Apply bar (≤900px) */}
      <div className="mobile-apply-bar">
        <Link
          href="/#waitlist"
          className="mobile-apply-btn"
          onPointerDown={() => handleCalculatorCtaPointerDown('calculator_mobile')}
        >
          Apply — keep CAD ${fmt(ctaAmount)}/yr →
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper with Suspense (for useSearchParams)                     */
/* ------------------------------------------------------------------ */

export default function SavingsCalculator3Page() {
  return (
    <Suspense fallback={<div style={{ background: '#101311', minHeight: '100vh' }} />}>
      <CalculatorInner />
    </Suspense>
  );
}