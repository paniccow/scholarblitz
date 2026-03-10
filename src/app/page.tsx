import { Navbar } from '@/components/layout/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Categories from '@/components/landing/Categories';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Categories />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
