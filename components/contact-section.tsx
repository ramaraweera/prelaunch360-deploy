'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { trackEvent, identifyLead } from '@/lib/analytics';

export default function ContactSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  const handleFormFocus = () => {
    if (formStarted) return;
    setFormStarted(true);
    trackEvent('contact_form_start', { source: 'contact_section' });
  };

  const emailDomain = (e: string): string => {
    const at = e.indexOf('@');
    return at >= 0 ? e.slice(at + 1).toLowerCase() : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response?.json?.();

      if (data?.success) {
        const leadId = `contact_${Date.now().toString(36)}`;
        identifyLead(leadId, {
          email: formData?.email,
          email_domain: emailDomain(formData?.email ?? ''),
          lead_type: 'contact',
        });
        trackEvent('contact_form_submit', {
          source: 'contact_section',
          email_domain: emailDomain(formData?.email ?? ''),
        });
        setMessage(data?.message ?? 'Message sent successfully!');
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setMessage(data?.message ?? 'Something went wrong');
        setIsSuccess(false);
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="contact" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={32} className="text-teal" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
              Get in Touch
            </h2>
            <p className="text-neutral-dark/70 text-lg">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-neutral-light p-8 rounded-2xl shadow-sm"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData?.name ?? ''}
                    onFocus={handleFormFocus}
                    onChange={(e) =>
                      setFormData({ ...(formData ?? {}), name: e?.target?.value ?? '' })
                    }
                    data-private
                    className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors bg-white"
                    placeholder="Jane Smith"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData?.email ?? ''}
                    onFocus={handleFormFocus}
                    onChange={(e) =>
                      setFormData({ ...(formData ?? {}), email: e?.target?.value ?? '' })
                    }
                    data-private
                    className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors bg-white"
                    placeholder="jane@example.com"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-neutral-dark mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData?.message ?? ''}
                onFocus={handleFormFocus}
                onChange={(e) =>
                  setFormData({ ...(formData ?? {}), message: e?.target?.value ?? '' })
                }
                data-private
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-teal focus:outline-none transition-colors bg-white resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-coral hover:bg-coral-600 text-white font-semibold py-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>

            {message && (
              <p
                className={`text-center text-sm mt-4 font-medium ${
                  isSuccess ? 'text-success' : 'text-error'
                }`}
              >
                {message}
              </p>
            )}

            <p className="text-center text-sm text-neutral-dark/50 mt-4">
              Your information is secure and will never be shared.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
