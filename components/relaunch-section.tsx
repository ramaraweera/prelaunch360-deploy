'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LayoutGrid, Users, CalendarCheck } from 'lucide-react';

const highlights = [
  {
    icon: LayoutGrid,
    title: 'One Platform, Not Five',
    description: 'Scheduling, payments, video, messaging, and student discovery—all in one place. No more subscription overload.',
  },
  {
    icon: Users,
    title: 'Your Brand, Your Students',
    description: 'Build direct relationships with your community. No aggregator commissions, no lost visibility.',
  },
  {
    icon: CalendarCheck,
    title: 'Teach More, Admin Less',
    description: 'Automate the busywork—reminders, payments, no-show handling—so you can focus on what you love.',
  },
];

export default function RelaunchSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="relaunch" ref={ref} className="bg-neutral-light py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
            Why We Built Studio 360
          </h2>
          <p className="text-lg text-neutral-dark/70 max-w-3xl mx-auto">
            Independent instructors told us what they needed: fewer tools, more control, and a platform that puts their brand first. Studio 360 is our answer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {highlights?.map?.((item, index) => {
            const IconComponent = item?.icon;
            return (
              <motion.div
                key={item?.title ?? index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {IconComponent && <IconComponent size={32} className="text-teal" />}
                </div>
                <h3 className="font-heading text-xl font-semibold text-neutral-dark mb-3">
                  {item?.title ?? ''}
                </h3>
                <p className="text-neutral-dark/70">
                  {item?.description ?? ''}
                </p>
              </motion.div>
            );
          }) ?? []}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-xl md:text-2xl text-teal font-medium"
        >
          Introducing <strong>Promoga Studio 360</strong>—where instructors, studios, and students connect on their terms.
        </motion.p>
      </div>
    </section>
  );
}
