import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Award, MapPin, Target, Shield, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";

const DeveloperPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".dev-hero",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );

      gsap.fromTo(
        ".dev-content-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dev-content-reveal",
            start: "top 80%",
          },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <div className="overflow-x-hidden bg-background">
      <Navbar />

      <div className="dev-hero pt-32 pb-16 px-6 md:px-12 text-center bg-background">
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body hover:text-gold transition-colors mb-8 flex items-center gap-2 mx-auto"
        >
          <span>←</span> Back to Estate
        </button>
        <span className="text-xs uppercase tracking-[0.3em] font-body font-bold text-[#c8a44b] mb-4 block">The Builders</span>
        <h1 className="luxury-heading text-5xl md:text-7xl mb-6">
          Riyasat <span className="gold-text italic">Infra</span>
        </h1>
        <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto leading-relaxed">
          Pioneering ultra-luxury living landscapes. We architect the void, building for the next century using the timeless materials of the past.
        </p>
        <div className="gold-divider mx-auto mt-10" />
      </div>

      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto mb-20">
        <div className="dev-content-reveal bg-forest-deep text-cream rounded-[2rem] p-10 md:p-16 border border-[#c8a44b]/30 shadow-2xl relative overflow-hidden">
          {/* Subtle noise/texture overlay for the dark card */}
          <div className="noise-texture absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl mb-6 text-[#F5E6CA]">
                Crafting <span className="text-[#c8a44b] italic">Legacies</span>
              </h2>
              <div className="space-y-6 font-body text-cream/70 text-sm leading-relaxed">
                <p>
                  At Riyasat Infra, our philosophy is anchored in constructing not mere properties, but enduring generational legacies. We don't just develop land; we curate the very essence of a lifestyle.
                </p>
                <p>
                  Our focus is strictly on premier, high-quality gated communities and sprawling luxury estates that act as sanctuaries for the elite. 
                </p>
                <p>
                  Rooted heavily in Bhopal's rapidly appreciating sectors, our infrastructure planning guarantees both serene daily living and unparalleled investment growth.
                </p>
              </div>
              
              <div className="mt-10 pt-8 border-t border-[#c8a44b]/20">
                <p className="font-heading text-[#c8a44b] text-xl">"Architecting the void."</p>
                <p className="text-xs font-body tracking-[0.2em] uppercase mt-2 opacity-60">Company Philosophy</p>
              </div>
            </div>

            <div className="bg-[#0a0f0d] border border-[#c8a44b]/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[300px]">
               <div className="w-20 h-20 rounded-full border border-[#c8a44b]/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(200,164,75,0.15)] bg-gold/5 group">
                 <Building2 className="w-10 h-10 text-[#c8a44b] transition-transform duration-500 group-hover:scale-110" />
               </div>
               <h3 className="font-heading text-3xl mb-2 text-[#F5E6CA]">Riyasat Infra</h3>
               <p className="font-body text-xs uppercase tracking-widest text-cream/50 mb-8">Established Developers</p>
               
               <div className="w-full space-y-4">
                 <div className="flex justify-between items-center border-b border-white/10 pb-2">
                   <div className="flex items-center gap-2">
                     <Award size={14} className="text-gold/60" />
                     <span className="font-body text-sm text-cream/60">Delivered</span>
                   </div>
                   <span className="font-heading text-[#c8a44b]">500K+ SQ.FT.</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-white/10 pb-2">
                   <div className="flex items-center gap-2">
                     <Target size={14} className="text-gold/60" />
                     <span className="font-body text-sm text-cream/60">Focus</span>
                   </div>
                   <span className="font-heading text-[#c8a44b]">Luxury Estates</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <MapPin size={14} className="text-gold/60" />
                     <span className="font-body text-sm text-cream/60">Base</span>
                   </div>
                   <span className="font-heading text-[#c8a44b]">Bhopal, MP</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
};

export default DeveloperPage;
