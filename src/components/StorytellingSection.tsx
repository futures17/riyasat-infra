import { useEffect, useRef } from "react";
import { storytellingCards } from "@/data/media";

const StorytellingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      gsap.fromTo(
        ".story-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: { trigger: ".story-heading", start: "top 85%", scrub: 1 },
        }
      );

      gsap.utils.toArray<HTMLElement>(".story-card").forEach((card, i) => {
        const dir = i % 2 === 0 ? -60 : 60;
        gsap.fromTo(
          card,
          { x: dir, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: { trigger: card, start: "top 85%", end: "top 55%", scrub: 1 },
          }
        );
      });
    };

    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} id="project" className="section-padding pista-bg overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="luxury-heading story-heading text-4xl md:text-6xl lg:text-7xl mb-8 font-bold">
          We build it with <span className="gold-text italic">intent and care.</span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl font-body font-light leading-relaxed max-w-3xl mx-auto uppercase tracking-wide">
          We are focused exclusively on delivering a premium rural lifestyle. RIYASAT crafts beautiful properties through masterful guidance, pure intent, and uncompromising care. Over 200,000 sq ft dedicated to pure nature, wide roads, and resort-level amenities.
        </p>
        <div className="space-y-16 md:space-y-24 mt-16">
          {storytellingCards.map((card, index) => {
            const reverse = index % 2 === 1;

            return (
              <div
                key={card.title}
                className={`story-card flex flex-col items-center gap-8 md:gap-16 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <div className="w-full md:w-1/2 group [perspective:2000px]">
                  <div className="relative w-full h-64 md:h-96 [transform-style:preserve-3d] transition-all duration-[3000ms] group-hover:[transform:rotateY(180deg)] drop-shadow-2xl rounded-2xl cursor-pointer">
                    {/* Front */}
                    <div className="absolute inset-0 [backface-visibility:hidden] overflow-hidden rounded-2xl border border-[#c8a44b]/20 bg-white">
                      <img src={card.image} alt={card.alt} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden rounded-2xl border border-[#c8a44b]/60 shadow-[0_0_30px_rgba(200,164,75,0.15)] bg-[#0a0f0d] z-20 flex flex-col items-center justify-center p-8 text-center">
                      <div className="absolute inset-0 bg-forest-deep/90 z-0"></div>
                      <img src={card.image} alt={card.alt} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 mix-blend-overlay z-0" loading="lazy" />
                      
                      <div className="relative z-30 flex flex-col items-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#c8a44b] mb-4 drop-shadow-[0_0_8px_rgba(200,164,75,0.8)]"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                        <h4 className="text-[#c8a44b] font-heading text-2xl md:text-3xl mb-3 tracking-wide">{card.label}</h4>
                        <div className="w-12 h-px bg-[#c8a44b]/40 mb-4"></div>
                        <p className="text-[#F5E6CA] font-body text-[13px] md:text-sm leading-relaxed max-w-[280px] drop-shadow-sm font-medium">{card.copy}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <span className="text-xs uppercase tracking-[0.3em] font-body font-bold flex items-center">
                    <span className="text-[#c8a44b]">{card.label}</span>
                  </span>
                  <h3 className={`font-heading text-3xl md:text-4xl mt-3 mb-4 font-medium drop-shadow-sm transition-colors text-[#8C6239] flex items-start gap-3`}>
                    <span className="font-serif italic text-3xl md:text-4xl text-[#c8a44b]/80 shrink-0">{card.num}</span>
                    <span>{card.title}</span>
                  </h3>
                  <div className="w-16 h-px bg-[#c8a44b]/50 mb-6" />
                  <p className="text-[#4A3B2C]/80 font-body text-sm leading-relaxed xl:text-[15px]">{card.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-20 flex justify-center">
          <button 
            className="inline-flex items-center justify-center px-10 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase font-body transition-all duration-[3000ms] shadow-[5px_5px_10px_rgba(0,0,0,0.144)] bg-[length:200%_200%] hover:scale-[0.95] hover:bg-right hover:animate-[gradient_5s_ease_infinite]"
            style={{ 
              background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
              color: 'rgb(121, 103, 3)'
            }}
          >
            See The Vision
          </button>
        </div>
      </div>
    </section>
  );
};

export default StorytellingSection;

