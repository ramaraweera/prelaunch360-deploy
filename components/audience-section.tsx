'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User, Home, ArrowRight } from 'lucide-react';

const audiences = [
  {
    icon: User,
    title: 'Independent Instructors',
    description: 'Teach anywhere. Own your schedule. Keep your revenue. Whether you\'re in a rented studio, a park, or online—Promoga Studio 360 moves with you.',
    linkText: 'Join as Instructor',
    linkHref: '#waitlist',
  },
  {
    icon: Home,
    title: 'Small Studios',
    description: 'One platform replaces five subscriptions. Manage your space, your teachers, and your community without the enterprise price tag.',
    linkText: 'Join as Studio',
    linkHref: '#waitlist',
  },
];

export default function AudienceSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const scrollToWaitlist = () => {
    const element = document?.querySelector?.('#waitlist');
    element?.scrollIntoView?.({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} id="for-instructors" className="bg-neutral-light py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
            Built for Toronto's Wellness Community
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {audiences?.map?.((audience, index) => {
            const IconComponent = audience?.icon;
            return (
              <motion.div
                key={audience?.title ?? index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {IconComponent && <IconComponent size={32} className="text-teal" strokeWidth={1.75} />}
                </div>
                <h3 className="font-heading text-xl font-semibold text-neutral-dark mb-4">
                  {audience?.title ?? ''}
                </h3>
                <p className="text-neutral-dark/70 mb-6 leading-relaxed">
                  {audience?.description ?? ''}
                </p>
                <button
                  onClick={scrollToWaitlist}
                  className="inline-flex items-center gap-2 text-teal font-semibold hover:gap-3 transition-all"
                >
                  {audience?.linkText ?? ''}
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            );
          }) ?? []}
        </div>
      </div>
    </section>
  );
}
