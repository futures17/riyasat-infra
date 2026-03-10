import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";

const BookVisitPage = () => {
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
        ".book-hero",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );
      
      gsap.fromTo(
        ".book-form-reveal",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );
    };

    loadGSAP();
    return () => { cleanupLenis?.(); };
  }, []);

  return (
    <div className="overflow-x-hidden bg-background">
      <Navbar />

      <div className="book-hero pt-32 pb-12 px-6 md:px-12 text-center bg-background">
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body hover:text-gold transition-colors mb-8 flex items-center gap-2 mx-auto"
        >
          <span>←</span> Back to Estate
        </button>
        <span className="text-xs uppercase tracking-[0.3em] font-body font-bold text-[#c8a44b] mb-4 block">Experience the Vision</span>
        <h1 className="luxury-heading text-5xl md:text-7xl mb-6">
          Book a <span className="gold-text italic">Visit</span>
        </h1>
        <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto leading-relaxed">
          Schedule a private tour of Green Glades Estate. Walk the avenues, inspect the development progress, and sit with our legacy managers.
        </p>
        <div className="gold-divider mx-auto mt-10" />
      </div>

      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
         <div className="book-form-reveal bg-gradient-to-br from-[#1B4332] to-[#2D5A27] p-8 md:p-14 rounded-3xl border border-[#c8a44b]/40 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8a44b]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

           <form className="relative z-10 flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-3">
                 <label htmlFor="fullName" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Full Name</label>
                 <input 
                   type="text" 
                   id="fullName"
                   className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg placeholder:text-white/40 appearance-none rounded-t-lg"
                   placeholder="Your prestigious name"
                 />
               </div>
               <div className="flex flex-col gap-3">
                 <label htmlFor="phone" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Contact Number</label>
                 <input 
                   type="tel" 
                   id="phone"
                   className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg placeholder:text-white/40 appearance-none rounded-t-lg"
                   placeholder="+91"
                 />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col gap-3">
                 <label htmlFor="email" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Email Address</label>
                 <input 
                   type="email" 
                   id="email"
                   className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg placeholder:text-white/40 appearance-none rounded-t-lg"
                   placeholder="name@domain.com"
                 />
               </div>
               <div className="flex flex-col gap-3">
                 <label htmlFor="date" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Preferred Visit Date</label>
                 <input 
                   type="date" 
                   id="date"
                   className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg appearance-none rounded-t-lg [&::-webkit-calendar-picker-indicator]:filter-invert"
                   style={{ colorScheme: 'dark' }}
                 />
               </div>
             </div>

             <div className="flex flex-col gap-3">
               <label htmlFor="message" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Optional Message</label>
               <textarea 
                 id="message" 
                 rows={3}
                 className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg placeholder:text-white/40 resize-none appearance-none rounded-t-lg"
                 placeholder="Any specific plot sizes or times..."
               ></textarea>
             </div>

             <div className="mt-8 flex justify-center">
               <button className="luxury-btn-solid !py-4 !px-12">
                 Request Appointment
               </button>
             </div>
           </form>
         </div>
      </section>

      <div className="py-16"></div>
      <LuxuryFooter />
    </div>
  );
};

export default BookVisitPage;
