'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, FlaskConical, Rocket } from 'lucide-react';

const timeline = [
  {
    icon: Users,
    status: 'active',
    title: 'Early Access Waitlist',
    date: 'Now – Summer 2026',
    description: 'Join the waitlist to get early access and shape the platform.',
  },
  {
    icon: FlaskConical,
    status: 'upcoming',
    title: 'Early Access Teaching',
    date: 'Fall 2026',
    description: 'Founding instructors start teaching and testing the platform.',
  },
  {
    icon: Rocket,
    status: 'upcoming',
    title: 'Full Toronto Launch',
    date: 'Spring 2027',
    description: 'Public launch across Toronto with full marketplace features.',
  },
];

export default function RoadmapSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-success bg-success/10';
      case 'active':
        return 'border-coral bg-coral/10';
      default:
        return 'border-sage bg-white';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'active':
        return 'text-coral';
      default:
        return 'text-sage';
    }
  };

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
            Our Launch Timeline
          </h2>
          <p className="text-xl text-neutral-dark/70 max-w-2xl mx-auto">
            We're building Promoga Studio 360 in the open. Here's what's coming.
          </p>
        </motion.div>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative">
          {/* Connecting Line */}
          <div className="absolute top-10 left-0 right-0 h-0.5 bg-sage/50" />
          
          <div className="grid grid-cols-3 gap-8">
            {timeline?.map?.((item, index) => {
              const IconComponent = item?.icon;
              return (
                <motion.div
                  key={item?.title ?? index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div
                    className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto mb-6 bg-white ${getStatusStyles(
                      item?.status ?? ''
                    )}`}
                  >
                    {IconComponent && (
                      <IconComponent size={32} className={getIconColor(item?.status ?? '')} />
                    )}
                  </div>
                  <h4 className="font-heading font-semibold text-lg text-neutral-dark mb-2">
                    {item?.title ?? ''}
                  </h4>
                  <p className="text-sm text-teal font-medium mb-2">{item?.date ?? ''}</p>
                  <p className="text-sm text-neutral-dark/60">{item?.description ?? ''}</p>
                </motion.div>
              );
            }) ?? []}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-8">
          {timeline?.map?.((item, index) => {
            const IconComponent = item?.icon;
            return (
              <motion.div
                key={item?.title ?? index}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div
                  className={`w-16 h-16 rounded-full border-4 flex items-center justify-center flex-shrink-0 ${getStatusStyles(
                    item?.status ?? ''
                  )}`}
                >
                  {IconComponent && (
                    <IconComponent size={24} className={getIconColor(item?.status ?? '')} />
                  )}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-lg text-neutral-dark">
                    {item?.title ?? ''}
                  </h4>
                  <p className="text-sm text-teal font-medium mb-1">{item?.date ?? ''}</p>
                  <p className="text-sm text-neutral-dark/60">{item?.description ?? ''}</p>
                </div>
              </motion.div>
            );
          }) ?? []}
        </div>
      </div>
    </section>
  );
}
