import { useEffect } from "react";
import familyImage from "@/assets/green_glades/posters/green_glades_estate_poster.webp";

const FamilyFutureSection = () => {
  useEffect(() => {
    const initScrolling = async () => {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".family-text",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".family-section",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".family-img",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".family-section",
            start: "top 80%",
          },
        }
      );
    };

    initScrolling();
  }, []);

  return (
    <section className="family-section py-24 md:py-32 bg-white overflow-hidden relative border-y border-gold/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          
          {/* Image Side */}
          <div className="relative group">
            <div className="family-img overflow-hidden rounded-3xl md:rounded-[3rem] shadow-2xl bg-forest-deep flex items-center justify-center p-4 md:p-8">
              <img 
                src={familyImage} 
                alt="Luxury living for families" 
                className="w-full h-auto max-h-[70vh] object-contain transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            {/* Subtle floating accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/10 backdrop-blur-3xl rounded-full -z-10 animate-pulse" />
          </div>

          {/* Text Side */}
          <div className="family-text flex flex-col gap-8">
            <h2 className="luxury-heading normal-case text-4xl md:text-5xl lg:text-7xl text-forest-deep leading-[1.1]">
              A Secure <span className="text-gold italic">Future</span> For Your <span className="text-gold italic">Family.</span>
            </h2>
            <p className="text-forest-deep/70 font-body text-lg md:text-xl leading-relaxed">
              Invest in more than just land. Build a legacy of peace, security, and luxury for your loved ones. Green Glades Estate offers the perfect environment for families to grow and thrive amidst nature.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-white transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.357 11.357 0 00-1.026 7.942c.592 4.257 3.6 8.301 6.665 10.658a.53.53 0 00.632 0c3.066-2.357 6.073-6.401 6.665-10.658a11.357 11.357 0 00-1.026-7.942z" /></svg>
                </div>
                <div>
                  <h4 className="font-heading text-xl text-forest-deep mb-1">Gated Security</h4>
                  <p className="text-forest-deep/60 text-sm">24/7 guarded entrance for your family's safety.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-white transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-heading text-xl text-forest-deep mb-1">Modern Lifestyle</h4>
                  <p className="text-forest-deep/60 text-sm">Access to premium amenities and resort lifestyle.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-white transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>
                <div>
                  <h4 className="font-heading text-xl text-forest-deep mb-1">Prime Investment</h4>
                  <p className="text-forest-deep/60 text-sm">Assured appreciation and high rental potential.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-white transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                </div>
                <div>
                  <h4 className="font-heading text-xl text-forest-deep mb-1">Natural Harmony</h4>
                  <p className="text-forest-deep/60 text-sm">Lush green landscapes for a healthy soul.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FamilyFutureSection;
