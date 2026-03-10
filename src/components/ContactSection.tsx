import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! Our team will contact you shortly.");
    setFormData({ name: "", phone: "", email: "", message: "" });
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
                { icon: Phone, text: "+91-9000000000", label: "Call Us" },
                { icon: Mail, text: "info@riyasatinfra.com", label: "Email" },
                { icon: MapPin, text: "Near Bhopal, Madhya Pradesh", label: "Location" },
              ].map(({ icon: Icon, text, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="icon-gold-ring w-12 h-12 rounded-full bg-pista/60 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-body">{label}</p>
                    <p className="font-body font-medium text-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="luxury-card p-8 space-y-5">
            {[
              { name: "name" as const, label: "Full Name", type: "text", placeholder: "Your name" },
              { name: "phone" as const, label: "Phone", type: "tel", placeholder: "+91" },
              { name: "email" as const, label: "Email", type: "email", placeholder: "your@email.com" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs uppercase tracking-wider text-muted-foreground font-body block mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-300"
                  required
                />
              </div>
            ))}
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-body block mb-2">
                Message
              </label>
              <textarea
                placeholder="I'm interested in..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-300 resize-none"
              />
            </div>
            <button type="submit" className="luxury-btn-solid w-full">
              Send Enquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
