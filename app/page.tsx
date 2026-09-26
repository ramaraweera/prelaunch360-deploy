import Navigation from '@/components/navigation';
import Hero from '@/components/hero';
import RelaunchSection from '@/components/relaunch-section';
import ProblemSection from '@/components/problem-section';
import SolutionSection from '@/components/solution-section';
import ComparisonSection from '@/components/comparison-section';
import AudienceSection from '@/components/audience-section';
import TestimonialsSection from '@/components/testimonials-section';
import RoadmapSection from '@/components/roadmap-section';
import WaitlistSection from '@/components/waitlist-section';
import FAQSection from '@/components/faq-section';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <RelaunchSection />
      <ProblemSection />
      <SolutionSection />
      <ComparisonSection />
      <AudienceSection />
      <TestimonialsSection />
      <RoadmapSection />
      <WaitlistSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
