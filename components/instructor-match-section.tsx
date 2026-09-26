'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Search by Style & Vibe',
    description: 'Students filter by yoga type, fitness style, schedule, and location to find exactly what they need.',
  },
  {
    icon: MapPin,
    title: 'Local Discovery',
    description: 'Toronto students searching for classes in their neighbourhood see you first—no algorithm games.',
  },
  {
    icon: Sparkles,
    title: 'Right Fit, Every Time',
    description: 'When students find you through search, they\'re already looking for what you offer.',
  },
];

export default function InstructorMatchSection() {
  return (
    <section className="py-24 bg-white" id="instructor-match">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://cdn.abacus.ai/images/907663a5-d3da-4bc7-912f-af22fa9fc840.png"
                alt="Students discovering and booking fitness classes together"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-teal/10 rounded-full -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-coral/10 rounded-full -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-coral font-semibold text-sm uppercase tracking-wider mb-4 block">
              Student Discovery
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-dark mb-6 leading-tight">
              Students Who Are Looking for You
            </h2>
            <p className="text-lg text-neutral-dark/70 mb-10">
              Students search by style, schedule, and vibe—Studio 360 shows them instructors and studios 
              that truly fit, so the right people find you instead of scrolling past.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-teal" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-dark mb-1">{feature.title}</h3>
                      <p className="text-neutral-dark/60 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              onClick={() => document.querySelector('#waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-10 px-8 py-4 bg-coral text-white font-semibold rounded-xl hover:bg-coral/90 transition-all hover:scale-105 shadow-lg shadow-coral/25"
            >
              Join the Early Access List
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
