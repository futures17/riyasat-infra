import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";

const ContactPage = () => {
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
        ".contact-hero",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );

      gsap.utils.toArray<HTMLElement>(".contact-reveal").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
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

      <div className="contact-hero pt-32 pb-16 px-6 md:px-12 text-center bg-background">
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body hover:text-gold transition-colors mb-8 flex items-center gap-2 mx-auto"
        >
          <span>←</span> Back to Estate
        </button>
        <span className="text-xs uppercase tracking-[0.3em] font-body font-bold text-[#c8a44b] mb-4 block">Reach Out</span>
        <h1 className="luxury-heading text-5xl md:text-7xl mb-6">
          Contact <span className="gold-text italic">Us</span>
        </h1>
        <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto leading-relaxed">
          For general inquiries, partnership opportunities, and direct correspondence with Riyasat Infra management.
        </p>
        <div className="gold-divider mx-auto mt-10" />
      </div>

      <section className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div className="contact-reveal flex flex-col justify-center border-r border-transparent md:border-[#c8a44b]/20 md:pr-16">
            <h2 className="text-3xl text-forest-deep font-heading font-medium mb-12">Headquarters.</h2>
            
            <div className="space-y-10">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#c8a44b] font-bold mb-3">Corporate Office</div>
                <p className="font-body text-forest-deep/80 leading-relaxed max-w-xs text-lg font-medium">
                  Riyasat Infra HQ,<br/>
                  Near Bhopal City Center,<br/>
                  Madhya Pradesh, India
                </p>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-[#c8a44b] font-bold mb-3">Direct Lines</div>
                <p className="font-body text-forest-deep/80 text-lg hover:text-[#c8a44b] font-medium cursor-pointer transition-colors">+91-90000 00000</p>
                <p className="font-body text-forest-deep/80 text-lg hover:text-[#c8a44b] font-medium cursor-pointer transition-colors mt-1">+91-91111 11111</p>
              </div>


              <div>
                <div className="text-xs uppercase tracking-widest text-[#c8a44b] font-bold mb-3">Electronic Mail</div>
                <p className="font-body text-forest-deep/80 text-lg hover:text-[#c8a44b] font-medium cursor-pointer transition-colors">inquiries@riyasatinfra.com</p>
              </div>
            </div>
          </div>

          <div className="contact-reveal">
            <form className="bg-gradient-to-br from-[#1B4332] to-[#2D5A27] p-8 md:p-10 rounded-2xl border border-[#c8a44b]/50 shadow-2xl flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
               <div className="flex flex-col gap-2">
                 <label className="text-xs text-[#F5E6CA] uppercase tracking-widest font-bold">Name</label>
                 <input type="text" className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-2 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none font-body appearance-none rounded-t-lg transition-all" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-xs text-[#F5E6CA] uppercase tracking-widest font-bold">Email</label>
                 <input type="email" className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-2 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none font-body appearance-none rounded-t-lg transition-all" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-xs text-[#F5E6CA] uppercase tracking-widest font-bold">Subject</label>
                 <input type="text" className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-2 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none font-body appearance-none rounded-t-lg transition-all" />
               </div>
               <div className="flex flex-col gap-2 mt-4">
                 <label className="text-xs text-[#F5E6CA] uppercase tracking-widest font-bold">Message</label>
                 <textarea rows={4} className="w-full bg-white/10 border border-[#c8a44b]/30 rounded-lg p-4 mt-2 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none font-body resize-none appearance-none transition-all"></textarea>
               </div>
                <button className="mt-6 luxury-btn-solid self-start !py-3 !px-10">
                  Send Message
                </button>
            </form>
          </div>

        </div>
      </section>

      <div className="py-16"></div>
      <LuxuryFooter />
    </div>
  );
};

export default ContactPage;