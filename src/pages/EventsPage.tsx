import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import FamilyFutureSection from "@/components/FamilyFutureSection";
import LuxuryFooter from "@/components/LuxuryFooter";
import { Building2, Map as MapIcon, Home, Store } from "lucide-react";
import logo from "@/assets/logomain.webp";
import AwardsMedallions from "@/components/AwardsMedallions";

// Generate image imports
const eventImages = Array.from({ length: 21 }, (_, i) => 
  new URL(`../assets/event/event_celebration_${i + 1}.webp`, import.meta.url).href
);

const EventsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".event-hero",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );

      gsap.utils.toArray<HTMLElement>(".reveal-element").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });
    };

    loadGSAP();
  }, []);

  return (
    <div className="overflow-x-hidden bg-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Top Image & Logo Hero Section */}
        <div className="event-hero text-center px-6 max-w-4xl mx-auto mb-20 flex flex-col items-center">
          <img src={logo} alt="Riyasat Logo" className="h-24 md:h-32 mb-8 object-contain drop-shadow-xl" />
          <h1 className="luxury-heading text-4xl md:text-5xl text-forest-deep mb-6">
            A Legacy of <span className="text-gold italic">Celebrations</span>
          </h1>
          <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl text-center">
            At Riyasat, every milestone is a grand celebration. Witness our vibrant community, award-winning infrastructure, and the trust we have built over the years.
          </p>
          <div className="gold-divider mx-auto mt-10" />
        </div>

        {/* 3 Rows of Auto-Sliding Marquee Images */}
        <div className="w-full overflow-hidden space-y-6 py-10 relative bg-forest-deep reveal-element shadow-2xl">
          {/* Row 1 */}
          <div className="relative w-full py-4 overflow-hidden">
            <div className="flex w-max gap-6 px-6 animate-marquee-reverse hover:[animation-play-state:paused] cursor-pointer">
              {[...eventImages.slice(0, 7), ...eventImages.slice(0, 7)].map((src, index) => (
                <div 
                  key={`row1-${index}`} 
                  onClick={() => window.open(src, '_blank')}
                  className="w-[220px] md:w-[300px] aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-lg flex-shrink-0 relative group cursor-zoom-in"
                >
                  <img src={src} alt="Event" loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div className="relative w-full py-4 overflow-hidden">
            <div className="flex w-max gap-6 px-6 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
              {[...eventImages.slice(7, 14), ...eventImages.slice(7, 14)].map((src, index) => (
                <div 
                  key={`row2-${index}`} 
                  onClick={() => window.open(src, '_blank')}
                  className="w-[220px] md:w-[300px] aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-lg flex-shrink-0 relative group cursor-zoom-in"
                >
                  <img src={src} alt="Event" loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="relative w-full py-4 overflow-hidden">
            <div className="flex w-max gap-6 px-6 animate-marquee-reverse hover:[animation-play-state:paused] cursor-pointer">
              {[...eventImages.slice(14, 21), ...eventImages.slice(14, 21)].map((src, index) => (
                <div 
                  key={`row3-${index}`} 
                  onClick={() => window.open(src, '_blank')}
                  className="w-[220px] md:w-[300px] aspect-[4/3] rounded-xl overflow-hidden border border-gold/20 shadow-lg flex-shrink-0 relative group cursor-zoom-in"
                >
                  <img src={src} alt="Event" loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Build. Building. Beyond. Section */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-32 mb-24 reveal-element bg-white/60 py-16 rounded-[3rem] shadow-xl border border-gold/10">
          <h2 className="luxury-heading text-4xl md:text-5xl text-center mb-16 text-forest-deep">
            Build. <span className="gold-text italic">Building.</span> Beyond.
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-gold/30 flex items-center justify-center mb-4 md:mb-8 shadow-xl bg-white relative transition-all duration-700 group-hover:scale-110 group-hover:border-gold group-hover:shadow-gold/20 overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Building2 className="text-[#c8a44b] relative z-10 w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
              </div>
              <h3 className="text-2xl md:text-4xl font-heading text-[#3D2B1F] font-bold mb-1 drop-shadow-sm leading-none group-hover:text-gold transition-colors">50+</h3>
              <p className="text-forest-deep/60 font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">Projects Delivered</p>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-gold/30 flex items-center justify-center mb-4 md:mb-8 shadow-xl bg-white relative transition-all duration-700 group-hover:scale-110 group-hover:border-gold group-hover:shadow-gold/20 overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <MapIcon className="text-[#c8a44b] relative z-10 w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
              </div>
              <h3 className="text-2xl md:text-4xl font-heading text-[#3D2B1F] font-bold mb-1 drop-shadow-sm uppercase leading-none group-hover:text-gold transition-colors">6M</h3>
              <p className="text-forest-deep/60 font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">SQ. FT. Developed</p>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-gold/30 flex items-center justify-center mb-4 md:mb-8 shadow-xl bg-white relative transition-all duration-700 group-hover:scale-110 group-hover:border-gold group-hover:shadow-gold/20 overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Home className="text-[#c8a44b] relative z-10 w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
              </div>
              <h3 className="text-2xl md:text-4xl font-heading text-[#3D2B1F] font-bold mb-1 drop-shadow-sm uppercase leading-none group-hover:text-gold transition-colors">7.5K</h3>
              <p className="text-forest-deep/60 font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">Happy Families</p>
            </div>
            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-gold/30 flex items-center justify-center mb-4 md:mb-8 shadow-xl bg-white relative transition-all duration-700 group-hover:scale-110 group-hover:border-gold group-hover:shadow-gold/20 overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Store className="text-[#c8a44b] relative z-10 w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
              </div>
              <h3 className="text-2xl md:text-4xl font-heading text-[#3D2B1F] font-bold mb-1 drop-shadow-sm uppercase leading-none group-hover:text-gold transition-colors">300+</h3>
              <p className="text-forest-deep/60 font-body text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">Commercial Plots</p>
            </div>
          </div>
        </div>

        {/* Built to Be Recognised Section (Awards) */}
        <div className="w-full mb-32 pt-20 border-t border-gold/10 reveal-element bg-cream">
          <div className="text-center mb-16 px-6">
            <div className="inline-block px-8 py-2 rounded-full border border-gold/30 bg-white/50 text-xs font-bold uppercase tracking-widest text-forest-deep mb-8">
              Events
            </div>
            <h2 className="luxury-heading text-4xl md:text-5xl text-forest-deep mb-6">
              Built to Be <span className="gold-text italic">Recognised.</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
              While customer satisfaction is our biggest reward, industry recognition affirms that we're on the right path.
            </p>
          </div>

          <div className="max-w-5xl mx-auto px-2 py-8">
              <AwardsMedallions />
          </div>
        </div>

        <FamilyFutureSection />
      </main>

      <LuxuryFooter />
    </div>
  );
};

export default EventsPage;
