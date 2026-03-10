import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";
import { galleryImages } from "@/data/media";

// GSAP types are handled via the dynamic import inside initScrolling

const brochureLinks = [
  "cOeQQ0nZOJB",
  "cOeQQ0nZOJg",
  "cOeQQ0nZOJk",
  "cOeQQ0nZOJp",
  "cOeQQ0nZOJC",
  "cOeQQ0nZOJ5",
  "cOeQQ0nZOJE",
  "cOeQQ0nZOJG"
];

const AboutPage = () => {
  const navigate = useNavigate();
  const brochureRef = useRef<HTMLDivElement>(null);
  const [zooms, setZooms] = useState<number[]>(new Array(8).fill(1));

  const updateZoom = (index: number, delta: number) => {
    setZooms(prev => {
      const next = [...prev];
      next[index] = Math.min(Math.max(next[index] + delta, 1), 1.5);
      return next;
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const initScrolling = async () => {
      const [LenisModule, gsapModule, scrollTriggerModule] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);

      const Lenis = LenisModule.default;
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
        lerp: 0.1,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".about-hero",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
        );

        gsap.utils.toArray<HTMLElement>(".about-section-reveal").forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
              },
            }
          );
        });

        // Stacked Cards Logic for Brochure (EXACT 1:1 MATCH with Amenities)
        const cards = gsap.utils.toArray<HTMLElement>(".brochure-card-item");
        cards.forEach((card, i) => {
          const innerCard = card.querySelector(".brochure-card-inner");
          const nextCard = cards[i + 1];
          
          if (nextCard && innerCard) {
            gsap.to(innerCard, {
              scale: 0.9,
              opacity: 0.4,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: nextCard,
                start: "top bottom",
                end: "top 10vh",
                scrub: true,
              },
            });
          }
        });

        ScrollTrigger.refresh();
      }, brochureRef.current);

      return { lenis, ctx, tickerCallback, gsap };
    };

    interface ScrollHandler {
      lenis: { destroy: () => void; raf: (time: number) => void };
      ctx: { revert: () => void };
      tickerCallback: (time: number) => void;
      gsap: { ticker: { remove: (fn: (time: number) => void) => void } };
    }

    let scrollHandler: {
      lenis: { destroy: () => void; raf: (time: number) => void };
      ctx: { revert: () => void };
      tickerCallback: (time: number) => void;
      gsap: { ticker: { remove: (fn: (time: number) => void) => void } };
    } | undefined;
    
    initScrolling().then(instance => {
      scrollHandler = instance;
    });
    
    return () => { 
      scrollHandler?.ctx.revert();
      scrollHandler?.lenis.destroy();
      if (scrollHandler?.gsap && scrollHandler?.tickerCallback) {
        scrollHandler.gsap.ticker.remove(scrollHandler.tickerCallback);
      }
    };
  }, []);

  return (
    <div className="about-page-wrapper bg-background">
      <Navbar />

      {/* Hero Header */}
      <div className="about-hero pt-32 pb-16 px-6 md:px-12 text-center bg-background">
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body hover:text-gold transition-colors mb-8 flex items-center gap-2 mx-auto"
        >
          <span>←</span> Back to Estate
        </button>
        <span className="text-xs uppercase tracking-[0.3em] font-body font-bold text-[#c8a44b] mb-4 block">The Vision</span>
        <h1 className="luxury-heading text-5xl md:text-7xl mb-6">
          About The <span className="gold-text italic">Project</span>
        </h1>
        <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto leading-relaxed">
          Green Glades Estate, situated near the pristine landscapes of Bhopal, is a sanctuary for those who seek the perfect balance between nature's tranquility and uncompromising luxury.
        </p>
        <div className="gold-divider mx-auto mt-10" />
      </div>

      {/* Content Sections */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
        {/* Section 1 */}
        <div className="about-section-reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative aspect-square md:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#c8a44b]/20">
            <img src={galleryImages[18].src} alt="Gated Community" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-forest-deep/10 mix-blend-overlay"></div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-heading text-4xl md:text-5xl text-forest-deep mb-6">Masterful <span className="text-[#c8a44b] italic">Land Planning</span></h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              Our approach to land planning ensures that the natural topography is respected and enhanced. Wide internal avenues, carefully positioned plots, and dedicated green reserves create an environment where luxury seamlessly integrates with the earth.
            </p>
            <div className="w-16 h-px bg-[#c8a44b]/50" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="about-section-reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl text-forest-deep mb-6">A True <span className="text-[#c8a44b] italic">Gated Community</span></h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              Security and privacy are the cornerstones of the Riyasat philosophy. The estate is fortified with a monumental entry gate, 24/7 surveillance, and an exclusive community of like-minded individuals who share your appreciation for fine living.
            </p>
            <div className="w-16 h-px bg-[#c8a44b]/50" />
          </div>
          <div className="relative aspect-square md:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#c8a44b]/20">
            <img src={galleryImages[16].src} alt="Nature Integration" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-forest-deep/10 mix-blend-overlay"></div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="about-section-reveal grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative aspect-square md:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[#c8a44b]/20">
            <img src={galleryImages[26].src} alt="Long Term Value" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-forest-deep/10 mix-blend-overlay"></div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-heading text-4xl md:text-5xl text-forest-deep mb-6">Long-Term <span className="text-[#c8a44b] italic">Value</span></h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-6">
              Acquiring a piece of Riyasat Estate is more than buying land; it is cementing a legacy. Real estate rooted in nature, developed with premier infrastructure, naturally commands long-term appreciation for generations to come.
            </p>
            <div className="w-16 h-px bg-[#c8a44b]/50" />
          </div>
        </div>
      </section>

      {/* Project Brochure - Final Premium Visual Stacking (8 Pages) */}
      <section ref={brochureRef} className="py-24 bg-[#b9cbb5] text-[#1a1a1a] relative">
        <div className="text-center mb-12 px-6">
          <div className="text-xs uppercase tracking-widest mb-4 opacity-70 font-body">The Publication</div>
          <h2 className="font-heading font-light tracking-[0.02em] text-5xl md:text-7xl text-[#4A3B2C]">
            ESTATE <span className="text-[#c8a44b] font-medium italic">CATALOGUE</span>
          </h2>
          <div className="w-24 h-px bg-[#4A3B2C]/20 mx-auto mt-8"></div>
        </div>

        {/* The Stacking Container - Minimized Spacing */}
        <div className="stacked-cards-shell relative w-full max-w-[1500px] mx-auto px-2 md:px-12 flex flex-col gap-0 pb-10">
          {brochureLinks.slice(0, 8).map((linkId, index) => (
            <div 
              key={index} 
              className="brochure-card-item sticky top-[10vh] md:top-[12vh] w-full flex items-start justify-center mb-[8vh] last:mb-0" 
              style={{ zIndex: index + 1 }}
            >
              <div 
                className="brochure-card-inner w-[98%] md:w-full aspect-[16/10] md:aspect-[16/9] bg-[#051C14] relative overflow-hidden shadow-[0_45px_100px_-20px_rgba(0,0,0,0.9)] will-change-transform rounded-[1rem] md:rounded-[2rem] group origin-top transition-all duration-700 ease-out border border-[#E7BC7E]/30 transform-gpu"
                style={{ 
                  transform: `scale(${zooms[index]}) translateZ(0)`,
                  backfaceVisibility: "hidden"
                }}
              >
                {/* Embed Player */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <iframe 
                    style={{ width: "100%", height: "100%", border: 0 }} 
                    scrolling="no" 
                    src={`https://go.screenpal.com/player/${linkId}?ff=0&ahc=1&dcc=0&tl=0&bg=transparent&share=0&download=0&embed=1&cl=0&ap=0&muted=1&showTitle=0&loop=1`} 
                    allow="autoplay; fullscreen"
                    allowFullScreen={true}
                    className="w-full h-full pointer-events-none md:pointer-events-auto"
                  >
                  </iframe>
                  <div className="absolute inset-0 z-10 md:hidden block bg-transparent"></div>
                </div>

                {/* Luxury Gold Label */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                  <div className="bg-gradient-to-r from-[#b8860b] to-[#8b6508] px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span className="text-[9px] md:text-xs text-white uppercase tracking-widest font-bold">Catalogue Page 0{index + 1}</span>
                  </div>
                </div>

                {/* Functional Zoom UI */}
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 flex flex-col gap-2">
                  <button 
                    onClick={() => updateZoom(index, 0.1)}
                    className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#b8860b] transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </button>
                  <button 
                    onClick={() => updateZoom(index, -0.1)}
                    className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#b8860b] transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" /></svg>
                  </button>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#c8a44b]/20 rounded-tr-[1rem] md:rounded-tr-[2rem] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-[#c8a44b]/20 rounded-bl-[1rem] md:rounded-bl-[2rem] pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Improved Download CTA */}
        <div className="text-center mt-12 relative z-30">
          <button 
             onClick={() => window.open('https://drive.google.com/file/d/1Z_50Y1ki3r9-u6lzKzIcoH9gW93cEthz/view?usp=sharing', '_blank')}
             className="uiverse-gold-btn mx-auto"
          >
            <span className="font-heading tracking-[0.2em] text-[10px]">DOWNLOAD BROCHURE</span>
          </button>
          <p className="text-[#4A3B2C]/60 text-[10px] uppercase tracking-widest mt-6 font-bold">Official PDF Catalogue • High Resolution</p>
        </div>
      </section>



      {/* Video Presentation Section */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl text-forest-deep mb-4">Visual <span className="text-[#c8a44b] italic">Walkthrough</span></h2>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">Immerse yourself in carefully curated luxury. Watch our comprehensive presentation on the Green Glades Estate.</p>
        </div>
        
        <div className="w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-[#c8a44b]/30 bg-[#111]">
          <div className="sp-embed-player" data-id="cOeQiPnZOy0" data-aspect-ratio="1.777778" data-padding-top="56.250000%" style={{position: "relative", width: "100%", paddingTop: "56.250000%", height: 0}}>
            <iframe 
              style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0}} 
              scrolling="no" 
              src="https://go.screenpal.com/player/cOeQiPnZOy0?ff=0&ahc=1&dcc=0&tl=0&bg=transparent&share=0&download=0&embed=1&cl=0&ap=1&muted=1&showTitle=0&loop=1" 
              allow="autoplay; fullscreen"
              allowFullScreen={true}>
            </iframe>
          </div>
        </div>
      </section>

      <div className="py-20"></div>
      <LuxuryFooter />
    </div>
  );
};

export default AboutPage;
