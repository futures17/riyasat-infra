import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";
import { supabase } from "@/lib/supabase";
import { Upload } from "lucide-react";
import { toast } from "sonner";

const BookVisitPage = () => {
  const navigate = useNavigate();
  const { refId: routeRefId } = useParams();
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    date: "",
    message: "",
    refId: routeRefId || "",
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Removed local storage fallback check
    
    window.scrollTo(0, 0);

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(".book-hero", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 });
      gsap.fromTo(".book-form-reveal", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.3 });
    };

    loadGSAP();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.date) {
      toast.error("Please fill in required fields (Name, Phone, Date)");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('visits').insert([{
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        preferred_date: formData.date,
        message: formData.message.trim() || null,
        ref_id: formData.refId.trim() || null,
        status: 'pending',
        visit_status: 'scheduled',
      }]).select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Inserted Visit:", data);
      setIsSubmitted(true);
      toast.success("Visit booked successfully!");
    } catch (err: unknown) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Failed to submit request.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="book-form-reveal bg-gradient-to-br from-[#0B1512] to-[#1B4332] p-8 md:p-14 rounded-3xl border border-[#c8a44b]/40 shadow-2xl relative overflow-hidden">
          <img 
            src="/src/assets/luxury-villa-poolside-deck.webp" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-[0.25] pointer-events-none" 
          />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c8a44b]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          {isSubmitted ? (
            <div className="relative z-10 text-center py-12">
               <h3 className="text-3xl font-heading text-gold mb-4">Visit Request Received</h3>
               <p className="text-white/80 font-body max-w-md mx-auto">
                 We have already received your request for a site visit. Our executive will contact you shortly to confirm the appointment.
               </p>
               <button onClick={() => navigate("/")} className="mt-8 luxury-btn-solid !py-3 !px-8">
                 Return Home
               </button>
            </div>
          ) : (
            <form className="relative z-10 flex flex-col gap-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="fullName" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Full Name *</label>
                  <input 
                    type="text" id="fullName" required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg placeholder:text-white/40 appearance-none rounded-t-lg"
                    placeholder="Your prestigious name"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="phone" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Contact Number *</label>
                  <input 
                    type="tel" id="phone" required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg placeholder:text-white/40 appearance-none rounded-t-lg"
                    placeholder="+91"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label htmlFor="email" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Email Address</label>
                  <input 
                    type="email" id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg placeholder:text-white/40 appearance-none rounded-t-lg"
                    placeholder="name@gmail.com"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label htmlFor="date" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Preferred Visit Date *</label>
                  <input 
                    type="date" id="date" required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg appearance-none rounded-t-lg [&::-webkit-calendar-picker-indicator]:filter-invert"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>


              <div className="flex flex-col gap-3">
                <label htmlFor="message" className="text-xs text-[#F5E6CA] font-body uppercase tracking-widest font-bold">Optional Message</label>
                <textarea 
                  id="message" rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/10 border-b border-[#c8a44b]/30 px-4 py-3 text-white focus:border-[#c8a44b] focus:bg-white/20 outline-none transition-all font-body text-lg placeholder:text-white/40 resize-none appearance-none rounded-t-lg"
                  placeholder="Any specific plot sizes or times..."
                ></textarea>
              </div>

              <div className="mt-8 flex justify-center">
                <button type="submit" disabled={isSubmitting} className="luxury-btn-solid !py-4 !px-12 disabled:opacity-50">
                  {isSubmitting ? "Submitting..." : "Request Appointment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <div className="py-16"></div>
      <LuxuryFooter />
    </div>
  );
};

export default BookVisitPage;
