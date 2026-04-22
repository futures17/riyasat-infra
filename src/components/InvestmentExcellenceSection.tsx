import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, TrendingUp, ShieldCheck, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

// Asset Imports
import img1 from "@/assets/green_glades/posters/premium_farmhouse_poster.webp";
import img2 from "@/assets/green_glades/posters/project_expo.webp";
import img3 from "@/assets/green_glades/posters/farmhouse_pricing_poster.webp";
import img4 from "@/assets/green_glades/posters/grand_entrance_promo_poster.webp";
import img5 from "@/assets/green_glades/posters/green_glades_estate_poster.webp";

const posters = [img1, img2, img3, img4, img5];

const InvestmentExcellenceSection = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch support refs
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % posters.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + posters.length) % posters.length);
  }, []);

  // Auto-loop: always loops, pauses only when user interacts
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) { nextSlide(); } else { prevSlide(); }
    }
    // Resume auto-slide after 3s of inactivity
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {/* Change 3: "Investment & Excellence" with proper casing */}
          <h2 className="luxury-heading text-4xl md:text-6xl text-forest-deep mb-4">
            Investment{" "}
            <span className="text-gold">&</span>{" "}
            <span className="italic text-gold">Excellence</span>
          </h2>
          <p className="text-forest-deep/60 font-body max-w-2xl mx-auto">Secure your future with Bhopal's most promising real estate asset.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch border border-gold/20 p-4 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-forest-deep shadow-2xl relative overflow-hidden group mb-8">
          
          {/* Animated Image Showcase with touch support */}
          <div
            className="lg:col-span-5 relative h-full min-h-[400px] lg:min-h-[600px] w-full rounded-2xl overflow-hidden border border-gold/30 bg-black/40 flex flex-col items-center justify-center group/poster"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Slides */}
            <div className="relative w-full h-full flex-1 flex items-center justify-center">
              {posters.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Investment Poster ${idx + 1}`}
                  className={`absolute w-full h-full object-contain p-0 md:p-4 transition-all duration-1000 ease-in-out ${
                    idx === currentIdx ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 translate-x-10 pointer-events-none"
                  }`}
                />
              ))}
            </div>

            {/* Side Navigation Arrows - Moved for better image space */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-gold transition-all active:scale-90 p-2 bg-black/20 hover:bg-black/40 rounded-full border border-white/10 hover:border-gold/50 backdrop-blur-sm"
              aria-label="Previous Poster"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-gold transition-all active:scale-90 p-2 bg-black/20 hover:bg-black/40 rounded-full border border-white/10 hover:border-gold/50 backdrop-blur-sm"
              aria-label="Next Poster"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Bottom Indicators Only */}
            <div className="relative z-20 flex flex-col items-center gap-3 w-full py-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex gap-3">
                {posters.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentIdx(idx); setIsPaused(true); setTimeout(() => setIsPaused(false), 3000); }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIdx ? "bg-gold w-8 shadow-[0_0_10px_#c8a44b]" : "bg-white/20 w-2 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 relative z-10 flex flex-col justify-center text-white py-12 lg:py-0 lg:pl-8">
            <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Exclusive Opportunity</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-[#F5E6CA] font-heading font-medium mb-6 leading-tight">High Yield <br/><span className="text-gold italic">Returns.</span></h2>
            <p className="text-white/70 font-body text-sm md:text-base mb-8 leading-relaxed max-w-xl">
              Our farmhouse plots offer not just luxury, but a tangible legacy that grows with the city's expanding horizon. Based on current growth trajectories, this corridor is set to become Bhopal's premier wealth hub.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                { title: "Premium Location", icon: MapPin },
                { title: "World-Class Club", icon: Scale },
                { title: "Registry Ready", icon: ShieldCheck },
                { title: "High Appreciation", icon: TrendingUp }
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 group/item">
                  <div className="w-8 h-8 rounded-lg border border-gold/30 flex items-center justify-center text-gold group-hover/item:bg-gold group-hover/item:text-forest-deep transition-all duration-500 shrink-0">
                    <item.icon size={14} />
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-white/90">{item.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-row flex-wrap gap-4 items-center justify-center lg:justify-start">
               <button
                 onClick={() => navigate("/book-visit")}
                 className="Btn !h-12 !text-[10px] px-8 min-w-[180px]"
               >
                 Request Quote
               </button>
               <button
                 onClick={() => {
                   const el = document.getElementById("project-brochure");
                   if (el) {
                     if (window.lenis) {
                       window.lenis.scrollTo("#project-brochure", { duration: 1.5 });
                     } else {
                       el.scrollIntoView({ behavior: "smooth" });
                     }
                   } else {
                     navigate("/projects");
                     setTimeout(() => {
                       const el2 = document.getElementById("project-brochure");
                       if (el2) {
                         if (window.lenis) window.lenis.scrollTo("#project-brochure", { duration: 1.5 });
                         else el2.scrollIntoView({ behavior: "smooth" });
                       }
                     }, 100);
                   }
                 }}
                 className="h-12 px-8 min-w-[180px] rounded-full border border-gold text-white text-[10px] uppercase tracking-widest font-bold hover:uiverse-silver-button hover:border-transparent transition-all"
               >
                 View Plans
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6">
          <div className="bg-forest-deep border border-gold/20 p-3 md:p-8 rounded-xl md:rounded-2xl text-center flex flex-col items-center hover:scale-[1.03] hover:border-gold/60 transition-all duration-500 hover:shadow-[0_0_20px_rgba(200,164,75,0.2)] group">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gold flex items-center justify-center mb-2 md:mb-4 text-gold group-hover:bg-gold group-hover:text-forest-deep transition-all duration-500">
              <Scale className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-[#F5E6CA] font-heading text-[10px] md:text-xl mb-1 md:mb-3">Legal Clarity</h3>
            <p className="text-white/40 font-body text-[8px] md:text-xs leading-tight md:leading-relaxed hidden sm:block">100% clear titles and registry ready plots.</p>
          </div>
          <div className="bg-forest-deep border border-gold/20 p-3 md:p-8 rounded-xl md:rounded-2xl text-center flex flex-col items-center hover:scale-[1.03] hover:border-gold/60 transition-all duration-500 hover:shadow-[0_0_20px_rgba(200,164,75,0.2)] group">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gold flex items-center justify-center mb-2 md:mb-4 text-gold group-hover:bg-gold group-hover:text-forest-deep transition-all duration-500">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-[#F5E6CA] font-heading text-[10px] md:text-xl mb-1 md:mb-3">High Returns</h3>
            <p className="text-white/40 font-body text-[8px] md:text-xs leading-tight md:leading-relaxed hidden sm:block">Situated in Bhopal's fastest wealth corridor.</p>
          </div>
          <div className="bg-forest-deep border border-gold/20 p-3 md:p-8 rounded-xl md:rounded-2xl text-center flex flex-col items-center hover:scale-[1.03] hover:border-gold/60 transition-all duration-500 hover:shadow-[0_0_20px_rgba(200,164,75,0.2)] group">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gold flex items-center justify-center mb-2 md:mb-4 text-gold group-hover:bg-gold group-hover:text-forest-deep transition-all duration-500">
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-[#F5E6CA] font-heading text-[10px] md:text-xl mb-1 md:mb-3">Secure Asset</h3>
            <p className="text-white/40 font-body text-[8px] md:text-xs leading-tight md:leading-relaxed hidden sm:block">Tangible legacy asset for preservation.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentExcellenceSection;
