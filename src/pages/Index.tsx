import { useState, useEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import LuxuryLoader from "@/components/LuxuryLoader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import StorytellingSection from "@/components/StorytellingSection";
import InvestmentExcellenceSection from "@/components/InvestmentExcellenceSection";
import EstateSliderSection from "@/components/EstateSliderSection";
import HorizontalDevelopmentSection from "@/components/HorizontalDevelopmentSection";
import StackedFacilitiesSection from "@/components/StackedFacilitiesSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReviewSection from "@/components/ReviewSection";
import LocationSection from "@/components/LocationSection";
import ContactSection from "@/components/ContactSection";
import LuxuryFooter from "@/components/LuxuryFooter";

const Index = () => {
  const [loaderDone, setLoaderDone] = useState(false);
  const [footerHeight, setFooterHeight] = useState("100vh");
  const footerRef = useRef<HTMLDivElement>(null);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setFooterHeight(`${entry.contentRect.height}px`);
      }
    });
    resizeObserver.observe(footerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!loaderDone) return;
  }, [loaderDone]);

  return (
    <main className="relative bg-background">
      <div className="noise-overlay" />
      <div className="relative z-10 bg-background shadow-[0_50px_100px_rgba(0,0,0,0.5)] transition-[margin-bottom] duration-300 lg:mb-0" style={{ marginBottom: typeof window !== 'undefined' && window.innerWidth >= 1024 ? footerHeight : '0' }}>
        {/* Cinematic loader — shown until 3s animation completes */}
        {!loaderDone && <LuxuryLoader onComplete={handleLoaderComplete} />}

        <Navbar />
        <HeroSection animationReady={loaderDone} />
        <IntroSection />
        <StorytellingSection />
        <InvestmentExcellenceSection />
        
        {/* Curved Arrow Transition Section */}
        <section className="py-24 flex flex-col items-center text-center bg-background">
          <svg className="w-24 h-32 mb-8 text-muted-foreground/40" viewBox="0 0 100 150">
            <path d="M 50 0 C 80 50, 0 80, 50 140" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M 35 125 L 50 145 L 65 125" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="luxury-heading text-4xl md:text-5xl lg:text-6xl px-6 max-w-4xl mx-auto">
            ...and we work with you to <span className="gold-text italic">make it yours.</span>
          </h2>
        </section>

        <HorizontalDevelopmentSection />
        <EstateSliderSection />
        <StackedFacilitiesSection />
        <AmenitiesSection />
        <StatsSection />
        {/* Ribbon animation placeholder: this section will be implemented in a later phase. */}
        <CTASection />
        <ReviewSection />
        <TestimonialsSection />
        <LocationSection />
        <ContactSection sourcePage="home" />
      </div>

      <div ref={footerRef} className="lg:fixed bottom-0 left-0 right-0 z-0 flex flex-col justify-end bg-[#0B1512]">
        <LuxuryFooter />
      </div>
    </main>
  );
};

export default Index;
