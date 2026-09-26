'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, X, Minus } from 'lucide-react';

const comparisonData = [
  {
    feature: 'Built for independents',
    acuity: 'check',
    momence: 'partial',
    mindbody: 'no',
    promoga: 'double',
  },
  {
    feature: 'Integrated video (no Zoom cost)',
    acuity: 'no',
    momence: 'no',
    mindbody: 'no',
    promoga: 'check',
  },
  {
    feature: 'Nomadic studio model',
    acuity: 'no',
    momence: 'no',
    mindbody: 'no',
    promoga: 'check',
  },
  {
    feature: 'Corporate wellness bookings',
    acuity: 'no',
    momence: 'partial',
    mindbody: 'check',
    promoga: 'check',
  },
  {
    feature: 'Transparent pricing',
    acuity: 'check',
    momence: 'partial',
    mindbody: 'no',
    promoga: 'check',
  },
  {
    feature: 'Starting price',
    acuity: '$16/mo',
    momence: '$99/mo',
    mindbody: '$159/mo',
    promoga: '6 months free, then 1% commission*',
  },
];

function StatusIcon({ status }: { status: string }) {
  if (status === 'check') {
    return <Check size={20} className="text-success mx-auto" />;
  }
  if (status === 'double') {
    return (
      <div className="flex justify-center gap-0.5">
        <Check size={18} className="text-success" />
        <Check size={18} className="text-success" />
      </div>
    );
  }
  if (status === 'no') {
    return <X size={20} className="text-error mx-auto" />;
  }
  if (status === 'partial') {
    return <Minus size={20} className="text-amber-accent mx-auto" />;
  }
  // Price or text value - special color for founding instructors pricing
  if (status?.toLowerCase?.()?.includes?.('founding')) {
    return <span className="font-semibold" style={{ color: '#008cae' }}>{status ?? ''}</span>;
  }
  return <span className="text-neutral-dark/80">{status ?? ''}</span>;
}

export default function ComparisonSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} id="pricing" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
            How Studio 360 Stacks Up for Independents
          </h2>
          <p className="text-xl text-neutral-dark/70 max-w-2xl mx-auto">
            We took the best from every competitor and built it for independents.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="overflow-x-auto"
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden min-w-[700px]">
            <table className="w-full">
              <thead>
                <tr className="bg-teal text-white">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold text-center">Acuity</th>
                  <th className="p-4 font-semibold text-center">Momence</th>
                  <th className="p-4 font-semibold text-center">Mindbody</th>
                  <th className="p-4 font-semibold text-center bg-white/15">Promoga Studio 360</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData?.map?.((row, index) => (
                  <tr
                    key={row?.feature ?? index}
                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="p-4 font-medium text-neutral-dark">{row?.feature ?? ''}</td>
                    <td className="p-4 text-center">
                      <StatusIcon status={row?.acuity ?? ''} />
                    </td>
                    <td className="p-4 text-center">
                      <StatusIcon status={row?.momence ?? ''} />
                    </td>
                    <td className="p-4 text-center">
                      <StatusIcon status={row?.mindbody ?? ''} />
                    </td>
                    <td className="p-4 text-center bg-teal/[0.07] font-semibold text-teal">
                      {row?.promoga === 'Free for founders' ? (
                        <strong className="text-teal">{row?.promoga ?? ''}</strong>
                      ) : (
                        <StatusIcon status={row?.promoga ?? ''} />
                      )}
                    </td>
                  </tr>
                )) ?? []}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-neutral-dark/50 mt-6"
        >
          * Pricing as of May 2026. Founding instructors & studios get 6 months free, then 1% commission on bookings — locked for life.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-4"
        >
          <a
            href="/savings-calculator"
            onClick={() =>
              window.posthog?.capture('calculator_link_click', {
                source: 'home_page',
                cta_location: 'comparison_section',
              })
            }
            className="inline-block text-sm font-semibold text-teal border-b-[1.5px] border-current pb-px hover:opacity-75 transition-opacity"
          >
            Calculate your savings with your actual revenue →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
