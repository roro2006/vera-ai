import FloatingDots from '@/components/landing/FloatingDots';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import Architecture from '@/components/landing/Architecture';
import Features from '@/components/landing/Features';
import TechStack from '@/components/landing/TechStack';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-[family-name:var(--font-dm-sans)]">
      <FloatingDots />
      <Hero />
      <Problem />
      <Architecture />
      <Features />
      <TechStack />
      <Footer />
    </div>
  );
}
