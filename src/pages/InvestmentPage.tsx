import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";
import { galleryImages } from "@/data/media";
import { Scale, TrendingUp, ShieldCheck } from "lucide-react";

const InvestmentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const setupLenis = async () => {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });
      lenis.scrollTo(0, { immediate: true });
      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    };

    let cleanupLenis: (() => void) | undefined;
    setupLenis().then((cleanup) => { cleanupLenis = cleanup; });

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".invest-hero",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );

      gsap.utils.toArray<HTMLElement>(".invest-reveal").forEach((item) => {
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
    };

    loadGSAP();
    return () => { cleanupLenis?.(); };
  }, []);

  return (
    <div className="overflow-x-hidden bg-background">
      <Navbar />

      <div className="invest-hero pt-32 pb-16 px-6 md:px-12 text-center bg-background">
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body hover:text-gold transition-colors mb-8 flex items-center gap-2 mx-auto"
        >
          <span>←</span> Back to Estate
        </button>
        <span className="text-xs uppercase tracking-[0.3em] font-body font-bold text-[#c8a44b] mb-4 block">Legacy Portfolios</span>
        <h1 className="luxury-heading text-5xl md:text-7xl mb-6">
          Investment <span className="gold-text italic">Details</span>
        </h1>
        <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto leading-relaxed">
          Estate ownership offers incredible generational wealth potential and an elevated lifestyle. Uncover the clarity, stability, and high returns of investing in Riyasat Estate.
        </p>
        <div className="gold-divider mx-auto mt-10" />
      </div>

      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="invest-reveal grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border border-[#c8a44b]/20 p-8 md:p-12 rounded-[2rem] bg-forest-deep shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#c8a44b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl text-[#F5E6CA] font-heading font-medium mb-6">Exclusive Estate Plots</h2>
            <p className="text-[#F5E6CA]/70 font-body leading-relaxed mb-8">
              Premium land parcels primed for grand estate development. Owning highly secure, managed estates in rapidly expanding zones near Bhopal is the definitive modern investment strategy.
            </p>
            
            <div className="space-y-6">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#c8a44b] mb-2 font-bold">Plot Sizes Available</span>
                <span className="text-2xl font-body text-white">6,000 Sq. Ft. & 11,000 Sq. Ft.</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/book-visit")}
              className="mt-10 luxury-btn-solid !py-3 !px-10"
            >
              Enquire for Pricing
            </button>
          </div>

          <div className="relative h-[40vh] md:h-full min-h-[400px] w-full rounded-2xl overflow-hidden border border-[#c8a44b]/30">
            <img src={galleryImages[1].src} alt="Luxury Villa Potential" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="invest-reveal group text-center p-8 bg-forest-deep border border-[#c8a44b]/20 rounded-2xl hover:border-[#c8a44b]/60 transition-all duration-500 shadow-xl hover:-translate-y-2">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full border border-[#c8a44b]/30 flex items-center justify-center group-hover:bg-[#c8a44b] group-hover:border-[#c8a44b] transition-all duration-500 shadow-[0_0_15px_rgba(200,164,75,0.1)] group-hover:shadow-[0_0_25px_rgba(200,164,75,0.4)]">
                <Scale className="w-8 h-8 text-[#c8a44b] group-hover:text-forest-deep transition-colors duration-500" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl text-[#F5E6CA] font-heading font-medium mb-3">Legal Clarity</h3>
            <p className="text-[#F5E6CA]/60 font-body text-sm leading-relaxed">
              100% clear titles, registry ready plots, and entirely legally compliant land ensuring entirely stress-free ownership.
            </p>
          </div>
          <div className="invest-reveal group text-center p-8 bg-forest-deep border border-[#c8a44b]/20 rounded-2xl hover:border-[#c8a44b]/60 transition-all duration-500 shadow-xl hover:-translate-y-2" style={{ transitionDelay: '0.1s' }}>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full border border-[#c8a44b]/30 flex items-center justify-center group-hover:bg-[#c8a44b] group-hover:border-[#c8a44b] transition-all duration-500 shadow-[0_0_15px_rgba(200,164,75,0.1)] group-hover:shadow-[0_0_25px_rgba(200,164,75,0.4)]">
                <TrendingUp className="w-8 h-8 text-[#c8a44b] group-hover:text-forest-deep transition-colors duration-500" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl text-[#F5E6CA] font-heading font-medium mb-3">High APY Returns</h3>
            <p className="text-[#F5E6CA]/60 font-body text-sm leading-relaxed">
              Situated in Bhopal's fastest expanding wealth corridor, expect formidable capital appreciation over the next five to ten years.
            </p>
          </div>
          <div className="invest-reveal group text-center p-8 bg-forest-deep border border-[#c8a44b]/20 rounded-2xl hover:border-[#c8a44b]/60 transition-all duration-500 shadow-xl hover:-translate-y-2" style={{ transitionDelay: '0.2s' }}>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full border border-[#c8a44b]/30 flex items-center justify-center group-hover:bg-[#c8a44b] group-hover:border-[#c8a44b] transition-all duration-500 shadow-[0_0_15px_rgba(200,164,75,0.1)] group-hover:shadow-[0_0_25px_rgba(200,164,75,0.4)]">
                <ShieldCheck className="w-8 h-8 text-[#c8a44b] group-hover:text-forest-deep transition-colors duration-500" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-xl text-[#F5E6CA] font-heading font-medium mb-3">Asset Protection</h3>
            <p className="text-[#F5E6CA]/60 font-body text-sm leading-relaxed">
              Tangible legacy asset class perfectly suited for wealth preservation, shielding your portfolio from market volatility.
            </p>
          </div>
        </div>
      </section>

      <div className="py-12"></div>
      <LuxuryFooter />
    </div>
  );
};

export default InvestmentPage;
