import { useEffect } from "react";
import poolAmenity from "@/assets/pool-amenity.jpg";

const CTASection = () => {
  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(".cta-content", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1,
        scrollTrigger: { trigger: ".cta-content", start: "top 80%", scrub: 1 },
      });
    };
    loadGSAP();
  }, []);

  return (
    <section id="book-visit" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={poolAmenity} alt="Resort lifestyle" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-forest-deep/75" />
      </div>

      <div className="cta-content relative z-10 text-center px-6 max-w-3xl">
        <h2 className="luxury-heading text-4xl md:text-6xl lg:text-7xl text-cream mb-6">
          Let's find that place<br />
          <span className="gold-text italic">you've been dreaming about</span>
        </h2>
        <p className="text-cream/60 font-body text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed">
          Schedule a private site visit and experience the serenity of Green Glades Estate firsthand. 
          Our team will guide you through every aspect of your future sanctuary.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.href = "/book-visit"} 
            className="luxury-btn-solid"
          >
            Book Site Visit
          </button>
          <button 
            onClick={() => window.location.href = "/contact"} 
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-medium tracking-wider uppercase font-body border border-cream/30 text-cream hover:uiverse-silver-button hover:border-transparent transition-all duration-300"
          >
            Schedule Meeting
          </button>
        </div>

      </div>
    </section>
  );
};

export default CTASection;
