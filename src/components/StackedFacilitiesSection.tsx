import { useEffect, useRef } from "react";
import { facilityCards } from "@/data/media";

const StackedFacilitiesSection = ({ isGrid = false }: { isGrid?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  // Use only 6 facilities as requested
  const limitedFacilities = facilityCards.slice(0, 6);

  useEffect(() => {
    let scrollTriggerInstance: gsap.core.Tween | undefined;

    const initGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (isGrid) {
        // PROJECTS PAGE: Horizontal Scroll Logic
        if (!horizontalRef.current || !triggerRef.current) return;

        // Calculate distance based on actual content width
        const getPinDistance = () => horizontalRef.current!.scrollWidth - window.innerWidth;
        
        scrollTriggerInstance = gsap.to(horizontalRef.current, {
          x: () => -getPinDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${getPinDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      } else {
        // HOME PAGE: Stacked Cards Logic (From Backup)
        if (!containerRef.current) return;
        
        const heading = containerRef.current.querySelector(".stacked-heading");
        if (heading) {
          gsap.fromTo(heading,
            { y: 50, opacity: 0 },
            {
              y: 0, opacity: 1,
              scrollTrigger: {
                trigger: heading,
                start: "top 88%",
                end: "top 60%",
                scrub: 1,
              },
            }
          );
        }

        const cards = gsap.utils.toArray<HTMLElement>(".stack-facility-item");
        cards.forEach((card, i) => {
          const nextCard = cards[i + 1];
          const cardInner = card.querySelector(".stack-facility-card");
          if (nextCard && cardInner) {
            gsap.to(cardInner, {
              scale: 0.95,
              ease: "none",
              scrollTrigger: {
                trigger: nextCard,
                start: "top bottom",
                end: "top 10vh",
                scrub: true,
              },
            });
          }
        });
      }
      
      ScrollTrigger.refresh();
    };

    const timeout = setTimeout(initGSAP, 200);

    return () => {
      clearTimeout(timeout);
      if (scrollTriggerInstance?.scrollTrigger) {
        scrollTriggerInstance.scrollTrigger.kill();
      }
    };
  }, [isGrid]);

  if (isGrid) {
    return (
      <div ref={triggerRef} className="overflow-hidden bg-[#004d4a] relative">
        <div 
          ref={horizontalRef} 
          className="flex gap-8 md:gap-16 px-[5vw] md:px-[10vw] py-24 w-max items-center h-screen"
        >
          {/* Section Introduction Slide */}
          <div className="w-[85vw] md:w-[600px] flex-shrink-0 flex flex-col justify-center text-left pr-10 md:pr-20">
            <span className="text-xs uppercase tracking-[0.4em] font-bold text-gold mb-4 block">World Class Amenities</span>
            <h2 className="luxury-heading text-5xl md:text-8xl text-white mb-8 leading-[1.1]">
              Curated <br/><span className="text-gold italic">Facilities</span>
            </h2>
            <p className="text-white/60 font-body text-sm md:text-xl leading-relaxed max-w-md">
              A symphony of nature and luxury. Every facility at Green Glades is designed to elevate your living experience to the extraordinary.
            </p>
          </div>

          {limitedFacilities.map((card, idx) => (
            <div key={idx} className="w-[85vw] md:w-[500px] h-[55vh] md:h-[65vh] flex-shrink-0 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group border border-gold/20">
              <img src={card.src} alt={card.alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/20 to-transparent" />
              
              <div className="absolute top-6 right-8 text-white/5 font-heading text-[10rem] md:text-[13rem] font-bold select-none pointer-events-none group-hover:text-gold/10 transition-colors duration-700 leading-none">
                {String(idx + 1).padStart(2, '0')}
              </div>

              <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10 md:right-10">
                <div className="flex items-center gap-4 mb-3">
                   <span className="text-gold font-bold text-sm md:text-lg tracking-widest uppercase font-heading">0{idx + 1}.</span>
                   <h3 className="font-heading text-2xl md:text-3xl text-white group-hover:text-gold transition-colors duration-300">{card.title}</h3>
                </div>
                <p className="text-white/70 font-body leading-relaxed text-xs md:text-base">
                  {card.copy}
                </p>
              </div>
            </div>
          ))}

          {/* Minimal ending spacer to prevent over-scrolling */}
          <div className="w-[10vw] flex-shrink-0" />
        </div>
      </div>
    );
  }

  // HOME PAGE STACKED VERSION
  return (
    <section ref={containerRef} id="facilities-stack" className="py-24 bg-[#b9cbb5] text-[#1a1a1a]">
      <div className="text-center mb-20 px-6">
        <div className="text-xs uppercase tracking-widest mb-4 opacity-70 font-body">Estate Facilities</div>
        <h2 className="stacked-heading font-heading font-light tracking-[0.02em] text-5xl md:text-7xl text-[#4A3B2C]">
          <span className="font-medium text-[#4A3B2C]">AMENITIES</span>{' '}
          <span className="text-[#c8a44b] font-medium italic">IN</span>{' '}
          <span className="font-medium text-[#4A3B2C]">LAYERS</span>
        </h2>
      </div>

      <div className="stacked-cards-shell relative pb-[20vh] w-full max-w-[1400px] mx-auto min-h-[100vh]">
        {facilityCards.map((card, index) => (
          <div 
            key={card.title} 
            className="stack-facility-item flex items-center justify-center w-full min-h-[70vh] md:min-h-[70vh] mb-[50vh] last:mb-0 sticky top-[10vh] md:top-[15vh]" 
            style={{ zIndex: index + 1 }}
          >
            <div className="stack-facility-card w-[95%] md:w-[90%] h-auto md:h-[70vh] max-h-[85vh] md:max-h-none bg-[#0a0a0a] border-2 border-[#E7BC7E]/40 relative overflow-y-auto overflow-x-hidden md:overflow-hidden flex flex-col md:grid md:grid-cols-[1fr_1.2fr] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] will-change-transform rounded-2xl group">
              <div className="stack-card-img-wrap relative w-full shrink-0 h-[35vh] md:h-full order-first md:order-last overflow-hidden">
                <img src={card.src} alt={card.alt} className="stack-card-img w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110" loading="lazy" decoding="async" />
              </div>
              
              <div className="stack-card-content cream-bg text-foreground p-6 md:p-12 lg:p-16 flex flex-col justify-between border-r-0 md:border-r border-[#E7BC7E]/20 rounded-b-2xl md:rounded-b-none md:rounded-l-2xl z-10 order-last md:order-first relative">
                <div>
                  <div className="font-heading text-5xl md:text-6xl mb-1 md:mb-2 text-[#c8a44b] font-bold">0{index + 1}.</div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-forest-deep">{card.title}</h3>
                  <p className="text-[10px] md:text-sm mt-2 md:mt-4 text-forest-deep/60 uppercase tracking-widest font-body">Facility</p>
                </div>
                <div className="text-foreground/80 font-light text-xs md:text-sm leading-relaxed max-w-sm font-body space-y-3 md:space-y-4 my-4 md:my-0">
                  <p>{card.copy}</p>
                  <p className="hidden md:block">Discover an environment crafted with meticulous attention to detail. Our spaces are thoughtfully designed to foster both relaxation and dynamic social encounters, enveloped in timeless luxury and elegance.</p>
                </div>
                <button className="text-left text-[#E7BC7E] font-bold uppercase tracking-widest text-[10px] md:text-xs border-b border-[#E7BC7E]/50 pb-1 md:pb-2 w-max hover:text-forest-deep hover:border-forest-deep transition-colors font-body mt-2 md:mt-8">
                  Explore Facility
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StackedFacilitiesSection;
