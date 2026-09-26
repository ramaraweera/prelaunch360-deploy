'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { LayoutGrid, UserSearch, Timer } from 'lucide-react';

const pillars = [
  {
    icon: LayoutGrid,
    title: 'One Platform, No Juggling',
    description: 'Scheduling, payments, video, messaging, and student discovery in one place. Replace 5+ tools and save $150–300/month in subscriptions.',
    image: 'https://cdn.abacus.ai/images/3258cbc0-7c60-403f-8af0-9cce3e8dc680.png',
    imageAlt: 'Unified dashboard showing schedule calendar, payments panel, and analytics on one screen',
  },
  {
    icon: UserSearch,
    title: 'Students Who Are Looking for You',
    description: 'Students search by style, schedule, and location—Studio 360 connects them with instructors and studios that fit, so you get discovered without relying on Instagram.',
    image: 'https://cdn.abacus.ai/images/8a6c93b1-1aa9-4973-86e5-53cfd2e95603.png',
    imageAlt: 'Students browsing a class discovery interface on a tablet in a studio lounge',
  },
  {
    icon: Timer,
    title: 'Teach More, Admin Less',
    description: 'Automated reminders, payments, and student communications give you back ~10 hours a week to focus on teaching.',
    image: 'https://cdn.abacus.ai/images/a48befc3-045c-4b18-a257-7797da7496b6.png',
    imageAlt: 'Instructor leading a yoga class with a laptop managing admin in the background',
  },
];

export default function SolutionSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section ref={ref} id="how-it-works" className="bg-neutral-light py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
            Introducing Promoga Studio 360
          </h2>
          <p className="text-xl text-neutral-dark/70 max-w-2xl mx-auto">
            One platform, three game-changing pillars. Zero compromises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars?.map?.((pillar, index) => {
            const IconComponent = pillar?.icon;
            return (
              <motion.div
                key={pillar?.title ?? index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={pillar?.image ?? ''}
                    alt={pillar?.imageAlt ?? ''}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mb-4">
                    {IconComponent && <IconComponent size={24} className="text-teal" />}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-neutral-dark mb-3">
                    {pillar?.title ?? ''}
                  </h3>
                  <p className="text-neutral-dark/70 leading-relaxed">
                    {pillar?.description ?? ''}
                  </p>
                </div>
              </motion.div>
            );
          }) ?? []}
        </div>
      </div>
    </section>
  );
}
