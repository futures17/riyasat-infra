import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedMessage = useMemo(() => {
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (subject && message) {
      return `Subject: ${subject}\n\n${message}`;
    }

    return message || (subject ? `Subject: ${subject}` : "");
  }, [formData.message, formData.subject]);

  useEffect(() => {
    window.scrollTo(0, 0);

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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Please provide your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contacts").insert([{
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        message: normalizedMessage || null,
        status: "new",
        source_page: "contact",
      }]);

      if (error) {
        throw error;
      }

      toast.success("Your message has been sent successfully.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send message.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-x-hidden bg-background">
      <Navbar />

      <div className="contact-hero pt-24 md:pt-32 pb-12 md:pb-16 px-6 md:px-12 text-center bg-background">
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

      <section className="py-12 md:py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          
          <div className="contact-reveal flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#c8a44b]/20 pb-12 md:pb-0 md:pr-16">
            <h2 className="text-3xl text-forest-deep font-heading font-medium mb-12">Headquarters.</h2>
            
            <div className="space-y-10">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#c8a44b] font-bold mb-3">Corporate Office</div>
                <p className="font-body text-forest-deep/80 leading-relaxed max-w-xs text-lg font-medium">
                  Plot No. 132, Vidhya Nagar Phase 2,<br/>
                  Near D-Mart, Hoshangabad Road,<br/>
                  Bhopal
                </p>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-[#c8a44b] font-bold mb-3">Direct Line</div>
                <p className="font-body text-forest-deep/80 text-lg hover:text-[#c8a44b] font-medium cursor-pointer transition-colors">+91 91119 22665</p>
              </div>


              <div>
                <div className="text-xs uppercase tracking-widest text-[#c8a44b] font-bold mb-3">Electronic Mail</div>
                <p className="font-body text-forest-deep/80 text-lg hover:text-[#c8a44b] font-medium cursor-pointer transition-colors">info@riyasatinfra.com</p>
              </div>

              <div className="pt-6">
                <button onClick={() => navigate("/developer")} className="Btn !w-auto flex items-center justify-center text-center">The Developer</button>
              </div>
            </div>
          </div>

          <div className="contact-reveal relative p-[3px] rounded-3xl overflow-hidden shadow-2xl" style={{ 
            background: 'linear-gradient(45deg, #f6dba6, #ffebc4, #f0be79, #8f653b, #673d22, #ba7f3b, #eebc70)' 
          }}>
            <div className="relative bg-forest-deep rounded-[calc(1.5rem-3px)] p-8 md:p-12 overflow-hidden">
              <img 
                src="/src/assets/tropical-retreat-lawn.webp" 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-[0.35] pointer-events-none" 
              />
              <div className="absolute inset-0 bg-forest-deep/60 pointer-events-none" />
              
              <form className="relative z-10 flex flex-col gap-6" onSubmit={handleSubmit}>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Name</label>
                   <input
                     type="text"
                     placeholder="Your name"
                     value={formData.name}
                     onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))}
                     className="w-full bg-white/5 border-b border-gold/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold focus:bg-white/10 outline-none font-body transition-all rounded-t-lg"
                     required
                   />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Phone</label>
                   <input
                     type="tel"
                     placeholder="+91"
                     value={formData.phone}
                     onChange={(e) => setFormData((current) => ({ ...current, phone: e.target.value }))}
                     className="w-full bg-white/5 border-b border-gold/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold focus:bg-white/10 outline-none font-body transition-all rounded-t-lg"
                     required
                   />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Email</label>
                   <input
                     type="email"
                     placeholder="name@gmail.com"
                     value={formData.email}
                     onChange={(e) => setFormData((current) => ({ ...current, email: e.target.value }))}
                     className="w-full bg-white/5 border-b border-gold/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold focus:bg-white/10 outline-none font-body transition-all rounded-t-lg"
                   />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Subject</label>
                   <input
                     type="text"
                     placeholder="Inquiry about..."
                     value={formData.subject}
                     onChange={(e) => setFormData((current) => ({ ...current, subject: e.target.value }))}
                     className="w-full bg-white/5 border-b border-gold/30 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold focus:bg-white/10 outline-none font-body transition-all rounded-t-lg"
                   />
                 </div>
                 <div className="flex flex-col gap-2 mt-4">
                   <label className="text-[10px] text-gold uppercase tracking-widest font-bold">Message</label>
                   <textarea
                     rows={4}
                     placeholder="Your message"
                     value={formData.message}
                     onChange={(e) => setFormData((current) => ({ ...current, message: e.target.value }))}
                     className="w-full bg-white/5 border border-gold/30 rounded-lg p-4 mt-2 text-white placeholder:text-white/40 focus:border-gold focus:bg-white/10 outline-none font-body resize-none transition-all"
                   ></textarea>
                 </div>
                  <button type="submit" disabled={isSubmitting} className="mt-6 Btn !w-full md:!w-auto md:self-start disabled:opacity-60">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      <div className="py-12 md:py-16"></div>
      <LuxuryFooter />
    </div>
  );
};

export default ContactPage;
