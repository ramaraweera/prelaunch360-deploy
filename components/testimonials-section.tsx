'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Managing my yoga classes has become so much more efficient with Promoga. The platform streamlines class management and the marketing support has been invaluable.",
    name: 'Janine N',
    title: 'Innerglow Yoga',
  },
  {
    quote: "Promoga is a wonderful service. They helped us grow our themed classes, reach new students, and made marketing easy so we could just show up and teach without the stress!",
    name: 'Delia B',
    title: 'Green Room Yoga Studio Owner',
  },
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24" style={{ background: 'rgba(168, 197, 170, 0.15)' }}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
            What Instructors Say About Promoga Today
          </h2>
          <p className="text-neutral-dark/70 max-w-2xl mx-auto">
            These reviews are from instructors using earlier Promoga tools. Studio 360 builds on what we’ve learned from their challenges and the solutions that worked.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials?.map?.((testimonial, index) => (
            <motion.div
              key={testimonial?.name ?? index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="text-coral mb-4">
                <Quote size={36} />
              </div>
              <p className="text-neutral-dark/80 text-lg mb-6 leading-relaxed">
                {testimonial?.quote ?? ''}
              </p>
              <div>
                <p className="font-semibold text-neutral-dark">{testimonial?.name ?? ''}</p>
                <p className="text-sm text-neutral-dark/60">{testimonial?.title ?? ''}</p>
              </div>
            </motion.div>
          )) ?? []}
        </div>
      </div>
    </section>
  );
}
