import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type ContactSectionProps = {
  phone?: string;
  sourcePage?: "home" | "project";
};

const ContactSection = ({
  phone = "+91 91119 22665",
  sourcePage = "home",
}: ContactSectionProps) => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!formData.name || !formData.phone) {
      toast.error("Please provide your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('contacts').insert([{
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        message: formData.message.trim() || null,
        status: 'new',
        source_page: sourcePage,
      }]).select();
      
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
      
      console.log("Inserted Contact:", data);
      toast.success("Thank you for your interest! Our team will contact you shortly.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch(err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send message.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding cream-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="luxury-heading text-4xl md:text-6xl text-center mb-16">
          Get in <span className="gold-text italic">Touch</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="font-heading text-2xl mb-6 text-foreground">We'd love to hear from you</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">
              Whether you're ready to book a visit or simply want to learn more about Green Glades Estate, 
              our dedicated team is here to assist you every step of the way.
            </p>
            <div className="space-y-5">
              {[
                { icon: Phone, text: phone, label: "Call Us" },
                { icon: Mail, text: "info@riyasatinfra.com", label: "Email" },
                { icon: MapPin, text: "Near Kankali Mandir, Raisen Road, Bhopal", label: "Site Address" },
                { icon: MapPin, text: "Plot No. 132, Vidhya Nagar Phase 2, Hoshangabad Road, Bhopal", label: "Office Address" },
              ].map(({ icon: Icon, text, label }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="icon-gold-ring w-12 h-12 rounded-full bg-pista/60 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-body font-bold mb-1">{label}</p>
                    <p className="font-body font-medium text-foreground text-sm leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden p-[3px]" style={{ 
            background: 'linear-gradient(45deg, #f6dba6, #ffebc4, #f0be79, #8f653b, #673d22, #ba7f3b, #eebc70)' 
          }}>
            <div className="relative bg-white rounded-[calc(1.5rem-3px)] p-8 overflow-hidden">
              <img 
                src="/src/assets/tuscan-villa-infinity-pool.webp" 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-[0.55] pointer-events-none" 
              />
              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                {[
                  { name: "name" as const, label: "Full Name", type: "text", placeholder: "Your name" },
                  { name: "phone" as const, label: "Phone", type: "tel", placeholder: "+91" },
                  { name: "email" as const, label: "Email", type: "email", placeholder: "name@gmail.com" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="text-[10px] uppercase tracking-wider text-forest/60 font-body font-bold block mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-forest/10 bg-white/60 backdrop-blur-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-300"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-forest/60 font-body font-bold block mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="I'm interested in..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-forest/10 bg-white/60 backdrop-blur-md font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-300 resize-none"
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="Btn w-full shadow-2xl">
                  {isSubmitting ? "Sending..." : "Send Enquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
