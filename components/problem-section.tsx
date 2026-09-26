'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { DollarSign, EyeOff, Clock } from 'lucide-react';

const problems = [
  {
    icon: DollarSign,
    title: 'Subscription Overload',
    description: 'Acuity + Zoom + Mailchimp + Stripe + scheduling tools. Five subscriptions adding up to $150–300/month just to run your business.',
  },
  {
    icon: EyeOff,
    title: 'Lost in the Noise',
    description: 'Big aggregators take 40% commission while giving you zero brand visibility. Your students become their customers.',
  },
  {
    icon: Clock,
    title: 'Admin, Not Teaching',
    description: '10+ hours per week on scheduling, emails, payments, and no-shows. Time that should be spent doing what you love.',
  },
];

export default function ProblemSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
            Why Independent Instructors Are Struggling
          </h2>
          <p className="text-xl text-neutral-dark/70 max-w-2xl mx-auto">
            Running your wellness business shouldn't mean juggling five different apps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems?.map?.((problem, index) => {
            const IconComponent = problem?.icon;
            return (
              <motion.div
                key={problem?.title ?? index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-neutral-light p-8 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mb-6">
                  {IconComponent && <IconComponent size={32} className="text-coral" />}
                </div>
                <h3 className="font-heading text-xl font-semibold text-neutral-dark mb-3">
                  {problem?.title ?? ''}
                </h3>
                <p className="text-neutral-dark/70 leading-relaxed">
                  {problem?.description ?? ''}
                </p>
              </motion.div>
            );
          }) ?? []}
        </div>
      </div>
    </section>
  );
}
