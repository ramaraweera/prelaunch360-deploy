'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'When does Promoga Studio 360 launch?',
    answer: "We're targeting a Fall 2026 public launch in Toronto. Founding instructors & studios on the early access list will get early access in Summer 2026.",
  },
  {
    question: 'Is it free for instructors?',
    answer: 'Founding instructors & studios get 6 months free, then 1% commission on bookings. You control your pricing, and there are no monthly subscription fees.',
  },
  {
    question: 'How is Promoga Studio 360 different from Mindbody or Momence?',
    answer: 'We built Studio 360 specifically for independent instructors who teach across multiple studios (the "nomadic model"). Unlike Mindbody\'s enterprise focus or Momence\'s rigid structure, we give you full flexibility on pricing, scheduling, and where you teach. Plus, integrated video means no separate Zoom subscription.',
  },
  {
    question: 'Can I embed my Studio 360 schedule on my own website?',
    answer: 'Yes! Just like Acuity and Momence, we provide embeddable widgets (iframe or React component) that you can add to your Squarespace, WordPress, or custom site. Your branding, your domain.',
  },
  {
    question: 'What payment methods do you support?',
    answer: 'We integrate with Stripe for payments, supporting all major credit cards, Apple Pay, and Google Pay. Instructors receive payouts weekly (or daily for premium members). We also support class packages and monthly memberships.',
  },
  {
    question: 'How does the video feature work?',
    answer: "We use self-hosted jitsi for video streaming—it's more reliable than Zoom for small group classes and comes included at no extra cost. You can host up to 25 participants in a video class, with features like screen sharing, breakout rooms, and class recordings.",
  },
  {
    question: 'What cities will Promoga Studio 360 be available in?',
    answer: "We’re starting in Toronto with early access for founding instructors and studios in 2026, followed by a full Toronto launch in the fall. After that, we’ll expand to other cities like Vancouver, Montreal, and key U.S. hubs.",
  },
  // {
  //   question: 'How do I move up the waitlist?',
  //   answer: "After you join the waitlist, you'll receive a unique referral link. Each friend who signs up using your link moves you up 50 spots. Students also earn credits ($10 per referral) to use on their first classes.",
  // },
];

export default function FAQSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="bg-neutral-light py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs?.map?.((faq, index) => (
            <motion.div
              key={faq?.question ?? index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-heading font-semibold text-neutral-dark pr-4">
                  {faq?.question ?? ''}
                </span>
                <span className="flex-shrink-0 w-8 h-8 bg-teal/10 rounded-full flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus size={18} className="text-teal" />
                  ) : (
                    <Plus size={18} className="text-teal" />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-neutral-dark/70 leading-relaxed">
                        {faq?.answer ?? ''}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )) ?? []}
        </div>
      </div>
    </section>
  );
}
