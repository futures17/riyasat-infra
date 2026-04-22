import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Globe, Instagram, Facebook, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";
import InvestmentExcellenceSection from "@/components/InvestmentExcellenceSection";

import bhaskarAward from "@/assets/bhaskar_expo_award.webp";
import crownAward from "@/assets/gold_award_crown.webp";
import AwardsMedallions from "@/components/AwardsMedallions";
import { Image, Layout, Users, FileText, Shield, Briefcase, Info, ArrowRight } from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const initScrolling = async () => {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger")
      ]);

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".about-hero",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );

      gsap.utils.toArray<HTMLElement>(".about-section-reveal").forEach((item) => {
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

    initScrolling();
  }, []);

  const whyBhopalItems = [
    {
      label: "Cultural Heritage",
      title: "Eternal Grandeur",
      desc: "The iconic Raja Bhoj statue stands as a testament to Bhopal's rich royal history. It symbolizes a legacy of wisdom and strength.",
      img: "/src/assets/about/statue.webp"
    },
    {
      label: "Global Access",
      title: "Seamless Connectivity",
      desc: "With the Bhopal International Airport just minutes away, Riyasat Estate keeps you connected to the world while preserving your peace.",
      img: "/src/assets/about/airport.webp"
    },
    {
      label: "Modern Infrastructure",
      title: "Bhopal Metro",
      desc: "The upcoming metro rail connectivity ensures that every corner of the city is within your reach, blending heritage with modern convenience.",
      img: "/src/assets/about/metro.webp"
    },
    {
      label: "Historical Echoes",
      title: "City of Lakes",
      desc: "From the magnificent Taj-ul-Masajid to the serene Upper Lake, Bhopal's architecture tells a story of royalty and refinement.",
      img: "/src/assets/about/monument.webp"
    }
  ];

  return (
    <div className="about-page-wrapper bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center about-hero overflow-hidden">
        <div className="absolute inset-0">
          <img src="/src/assets/about/about_header.webp" alt="Riyasat About" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center px-6">
          <button
            onClick={() => navigate("/")}
            className="text-xs uppercase tracking-[0.3em] text-white/70 font-body hover:text-gold transition-colors mb-8 flex items-center gap-2 mx-auto"
          >
            <span>←</span> Back to Estate
          </button>
          <span className="text-xs md:text-sm uppercase tracking-[0.4em] font-bold text-gold mb-4 block">
            The Visionaries
          </span>
          <h1 className="luxury-heading text-5xl md:text-8xl text-white mb-6">
            The Riyasat <span className="text-gold italic">Empire</span>
          </h1>
          <p className="text-white/80 font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Green Glades Estate is a sanctuary for those who seek the perfect balance between nature's tranquility and uncompromising luxury.
          </p>
        </div>
      </div>

      {/* 1. Riyasat Intro Section */}
      <section className="py-24 px-6 md:px-12 bg-white border-b border-gold/10">
        <div className="max-w-4xl mx-auto text-center about-section-reveal">
          <img src="/src/assets/logomain.webp" alt="Riyasat Logo" className="h-24 md:h-32 mb-10 mx-auto object-contain drop-shadow-xl" />
          <h2 className="luxury-heading text-3xl md:text-5xl text-forest-deep mb-8 leading-tight">
            A Legacy of <span className="text-gold italic">Sovereign Excellence.</span>
          </h2>
          <p className="text-forest-deep/80 font-body text-lg md:text-xl leading-relaxed max-w-2xl mx-auto italic">
            "Riyasat Infrastructure is more than a developer; we are creators of legacies. With a commitment to quality, transparency, and sustainable luxury, we build spaces that stand the test of time."
          </p>
          <img src="/src/assets/green_glades/logo/nature_text.webp" alt="Nature Branding" className="h-12 md:h-16 mx-auto mt-8 opacity-60 brightness-0 invert" />
        </div>
      </section>

      {/* 2. Heritage/Values Section */}
      <section className="py-24 px-6 md:px-12 bg-[#F9F6F0]">
        <div className="max-w-7xl mx-auto space-y-24 md:space-y-32">
          
          <div className="about-section-reveal flex flex-col md:flex-row items-center gap-12 md:gap-20 group">
            <div className="w-full md:w-[45%] aspect-[1.4] md:aspect-[1.1] rounded-3xl overflow-hidden shadow-2xl relative border border-gold/10">
              <img src="/src/assets/green_glades/estate_entrance_gate.webp" alt="Land Planning" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
            </div>
            <div className="w-full md:w-[55%]">
               <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold font-bold tracking-widest text-sm">01.</span>
                  <h3 className="luxury-heading text-4xl md:text-5xl lg:text-6xl text-forest-deep leading-tight">Masterful <span className="text-gold italic">Land Planning</span></h3>
               </div>
              <p className="text-forest-deep/70 font-body text-base md:text-lg leading-relaxed mb-6">
                Our approach to land planning ensures that the natural topography is respected and enhanced. Wide internal avenues, carefully positioned plots, and dedicated green reserves create an environment where luxury seamlessly integrates with the earth.
              </p>
              <div className="w-12 h-px bg-gold/50" />
            </div>
          </div>

          <div className="about-section-reveal flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20 group">
            <div className="w-full md:w-[45%] aspect-[1.4] md:aspect-[1.1] rounded-3xl overflow-hidden shadow-2xl relative border border-gold/10">
              <img src="/src/assets/green_glades/facalities/garden.webp" alt="Gated Community" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
            </div>
            <div className="w-full md:w-[55%]">
               <div className="flex items-center gap-3 mb-4 justify-start md:justify-end">
                  <span className="text-gold font-bold tracking-widest text-sm">02.</span>
                  <h3 className="luxury-heading text-4xl md:text-5xl lg:text-6xl text-forest-deep leading-tight text-left md:text-right">A True <span className="text-gold italic">Gated Community</span></h3>
               </div>
              <p className="text-forest-deep/70 font-body text-base md:text-lg leading-relaxed mb-6 text-left md:text-right">
                Security and privacy are the cornerstones of the Riyasat philosophy. The estate is fortified with a monumental entry gate, 24/7 surveillance, and an exclusive community of like-minded individuals who share your appreciation for fine living.
              </p>
              <div className="w-12 h-px bg-gold/50 ml-0 md:ml-auto" />
            </div>
          </div>

          <div className="about-section-reveal flex flex-col md:flex-row items-center gap-12 md:gap-20 group">
            <div className="w-full md:w-[45%] aspect-[1.4] md:aspect-[1.1] rounded-3xl overflow-hidden shadow-2xl relative border border-gold/10">
              <img src="/src/assets/green_glades/luxury_farmhouse_sunset.webp" alt="Value" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
            </div>
            <div className="w-full md:w-[55%]">
               <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold font-bold tracking-widest text-sm">03.</span>
                  <h3 className="luxury-heading text-4xl md:text-5xl lg:text-6xl text-forest-deep leading-tight">Long-Term <span className="text-gold italic">Value</span></h3>
               </div>
              <p className="text-forest-deep/70 font-body text-base md:text-lg leading-relaxed mb-6">
                Acquiring a piece of Riyasat Estate is more than buying land; it is cementing a legacy. Real estate rooted in nature, developed with premier infrastructure, naturally commands long-term appreciation for generations to come.
              </p>
              <div className="w-12 h-px bg-gold/50" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Why in Bhopal Section */}
      <section className="relative py-24 px-6 md:px-12 w-full bg-white overflow-hidden">
        <div className="relative z-10 text-center mb-16 about-section-reveal">
          <span className="text-xs md:text-sm uppercase tracking-[0.4em] font-bold text-gold/80 mb-6 block">The Heart of Central India</span>
          <h2 className="luxury-heading text-4xl md:text-6xl text-forest-deep mb-12">Why Invest in <span className="text-gold italic">Bhopal?</span></h2>
          <div className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-[3rem] overflow-hidden mb-12 relative group shadow-2xl border border-gold/10">
            <img src="/src/assets/about/why_bhopal.webp" alt="Why Bhopal" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
          </div>
          <p className="text-forest-deep/80 font-body max-w-3xl mx-auto leading-relaxed text-lg md:text-xl">
            Beyond the modern infrastructure lies a city that breathes history and art. Bhopal offers the perfect blend of central India's rapid growth and an eternal, serene soul.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-32 mb-32">
          {whyBhopalItems.map((item, idx) => (
              <div key={idx} className={`about-section-reveal flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 group relative`}>
                <div className={`w-full md:w-1/2 rounded-3xl overflow-hidden relative shadow-2xl border border-gold/10 ${idx === 0 ? 'aspect-square' : 'aspect-video md:aspect-[1.5]'}`}>
                   <img 
                    src={item.img} 
                    alt={item.title} 
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ${idx === 0 ? 'object-top' : 'object-center'}`} 
                   />
                </div>
                <div className="w-full md:w-1/2 relative">
                   {/* Background Number */}
                   <div className="absolute -top-12 md:-top-20 left-0 md:left-auto right-0 text-gold/5 font-heading text-9xl md:text-[12rem] font-bold select-none pointer-events-none">
                     {String(idx + 1).padStart(2, '0')}
                   </div>
                   
                   <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-body font-bold text-[#c8a44b] mb-4 block">{item.label}</span>
                   <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-gold font-bold text-xl">0{idx + 1}.</span>
                      <h3 className="font-heading text-4xl md:text-5xl text-forest-deep leading-tight">{item.title.split(' ')[0]} <span className="text-gold italic">{item.title.split(' ').slice(1).join(' ')}</span></h3>
                   </div>
                   <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed">
                     {item.desc}
                   </p>
                </div>
             </div>
          ))}
        </div>

        <div className="mt-40 about-section-reveal">
           <div className="relative aspect-[14/10] md:aspect-[16/10] rounded-xl md:rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(200,164,75,0.15)] border-2 md:border-4 border-[#c8a44b] bg-white transition-all duration-700">
              <img src="/src/assets/about/collage.webp" alt="Bhopal Collage" className="w-full h-full object-cover transition-transform duration-[3000ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent flex items-end justify-center p-6 md:p-12">
                 <h4 className="text-white font-handwritten text-3xl md:text-7xl text-center drop-shadow-2xl">Bhopal: A Symphony of Lakes and Life</h4>
              </div>
           </div>
        </div>

        {/* Awards Section standardized for PC and Mobile */}
        <div className="mt-32 md:mt-48 about-section-reveal">
           <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.4em] font-bold text-gold mb-4 block">Recognised Excellence</span>
              <h2 className="luxury-heading text-4xl md:text-6xl text-forest-deep leading-tight">Built to Be <span className="text-gold italic">Recognised.</span></h2>
              <p className="text-forest-deep/60 max-w-2xl mx-auto mt-4 font-body">While customer satisfaction is our biggest reward, industry recognition affirms that we're on the right path.</p>
           </div>
           
           <div className="max-w-5xl mx-auto px-2">
              <AwardsMedallions />
           </div>
        </div>
      </section>

      <InvestmentExcellenceSection />

      {/* 5. Office Map Section */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto about-section-reveal">
           <div className="text-center mb-16">
              <h2 className="luxury-heading text-4xl md:text-6xl text-forest-deep mb-4">Visit Our <span className="text-gold italic">Office</span></h2>
              <p className="text-forest-deep/60 font-body">Come experience the vision in person at our central headquarters.</p>
           </div>
           <div className="w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-2 border-gold/10 hover:border-gold/30 transition-all duration-700">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3157.3247624313713!2d77.45088369434042!3d23.184209946757683!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDExJzAxLjgiTiA3N8KwMjcnMDguMyJF!5e1!3m2!1sen!2sin!4v1776714272711!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
           </div>
        </div>
      </section>

      {/* 6. Quick Navigation / Action Buttons */}
      <section className="py-20 px-4 md:px-12 bg-[#F9F6F0] about-section-reveal">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <button 
              onClick={() => navigate("/gallery")}
              className="group flex flex-col items-center justify-center p-6 md:p-10 bg-white border border-gold/20 rounded-2xl md:rounded-3xl transition-all duration-500 hover:shadow-2xl hover:border-gold hover:-translate-y-2"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-500">
                <Image size={24} className="md:w-[28px] md:h-[28px]" />
              </div>
              <h3 className="font-heading text-sm md:text-xl text-forest-deep mb-1 md:mb-2 text-center">View Gallery</h3>
              <p className="text-[8px] md:text-xs text-forest-deep/60 font-body uppercase tracking-widest flex items-center gap-1 md:gap-2">Explore <ArrowRight size={10} /></p>
            </button>

            <button 
              onClick={() => navigate("/projects")}
              className="group flex flex-col items-center justify-center p-6 md:p-10 bg-white border border-gold/20 rounded-2xl md:rounded-3xl transition-all duration-500 hover:shadow-2xl hover:border-gold hover:-translate-y-2"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-500">
                <Layout size={24} className="md:w-[28px] md:h-[28px]" />
              </div>
              <h3 className="font-heading text-sm md:text-xl text-forest-deep mb-1 md:mb-2 text-center">View Project</h3>
              <p className="text-[8px] md:text-xs text-forest-deep/60 font-body uppercase tracking-widest flex items-center gap-1 md:gap-2">Masterplan <ArrowRight size={10} /></p>
            </button>

            <button 
              onClick={() => window.open("/auth/signup-member", "_blank")}
              className="group flex flex-col items-center justify-center p-6 md:p-10 bg-white border border-gold/20 rounded-2xl md:rounded-3xl transition-all duration-500 hover:shadow-2xl hover:border-gold hover:-translate-y-2"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-500">
                <Users size={24} className="md:w-[28px] md:h-[28px]" />
              </div>
              <h3 className="font-heading text-sm md:text-xl text-forest-deep mb-1 md:mb-2 text-center">Join Team</h3>
              <p className="text-[8px] md:text-xs text-forest-deep/60 font-body uppercase tracking-widest flex items-center gap-1 md:gap-2">Careers <ArrowRight size={10} /></p>
            </button>

            <button 
              onClick={() => navigate("/developer")}
              className="group flex flex-col items-center justify-center p-6 md:p-10 bg-white border border-gold/20 rounded-2xl md:rounded-3xl transition-all duration-500 hover:shadow-2xl hover:border-gold hover:-translate-y-2"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-500">
                <Briefcase size={24} className="md:w-[28px] md:h-[28px]" />
              </div>
              <h3 className="font-heading text-sm md:text-xl text-forest-deep mb-1 md:mb-2 text-center">Policies</h3>
              <p className="text-[8px] md:text-xs text-forest-deep/60 font-body uppercase tracking-widest flex items-center gap-1 md:gap-2">Legal <ArrowRight size={10} /></p>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Bottom Icons Section - Right above footer */}
      <section className="py-10 bg-forest-deep text-cream overflow-hidden border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-12">
            {[
              { icon: Shield, label: "Secure" },
              { icon: FileText, label: "Trust" },
              { icon: Briefcase, label: "Expertise" },
              { icon: Info, label: "Refined" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-forest-deep transition-all duration-500 shadow-[0_0_10px_rgba(200,164,75,0.15)] group-hover:shadow-[0_0_20px_rgba(200,164,75,0.3)]">
                  <item.icon className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={1.5} />
                </div>
                <span className="text-[7px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.25em] font-body text-gold/70 group-hover:text-gold transition-colors text-center">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Luxury Contact Section */}
      <section className="py-32 px-6 md:px-12 bg-[#FDFBF7] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[#F9F6F0] -skew-x-12 translate-x-32 hidden lg:block" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-pista/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="about-section-reveal">
              <span className="text-gold font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Connect With Us</span>
              <h2 className="luxury-heading text-4xl md:text-6xl text-forest-deep mb-8 leading-tight">
                Your Legacy <br/><span className="text-gold italic">Starts Here.</span>
              </h2>
              <p className="text-forest-deep/60 font-body text-lg mb-12 max-w-xl">
                Ready to explore the finest in luxury estate living? Reach out to our dedicated advisory team for a personalized walkthrough of Green Glades Estate.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-forest-deep text-gold flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(5,28,20,0.2)]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-forest-deep/40 font-bold mb-1">Direct Line</p>
                    <p className="text-xl font-heading text-forest-deep group-hover:text-gold transition-colors">+91 91119 22665</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-forest-deep text-gold flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(5,28,20,0.2)]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-forest-deep/40 font-bold mb-1">Site Address</p>
                    <p className="text-base font-body text-forest-deep group-hover:text-gold transition-colors">Near Kankali Mandir, Raisen Road, Bhopal</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-forest-deep text-gold flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgba(5,28,20,0.2)]">
                    <Globe size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-forest-deep/40 font-bold mb-1">Office Address</p>
                    <p className="text-base font-body text-forest-deep group-hover:text-gold transition-colors">Plot No. 132, Vidhya Nagar Phase 2, Near D-Mart, Hoshangabad Road, Bhopal</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-section-reveal p-12 md:p-16 rounded-[3rem] relative overflow-hidden bg-forest-deep border-[3px] border-transparent" style={{ 
               background: 'linear-gradient(hsl(var(--forest-deep)) 0 0) padding-box, linear-gradient(45deg, #f6dba6, #ffebc4, #f0be79, #8f653b, #673d22, #ba7f3b, #eebc70) border-box' 
            }}>
               <img 
                 src="/src/assets/tropical-courtyard-garden.webp" 
                 alt="" 
                 className="absolute inset-0 w-full h-full object-cover opacity-[0.12] pointer-events-none" 
               />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,164,75,0.1),transparent_70%)]" />
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full -translate-y-32 translate-x-32 blur-[100px]" />
               <div className="relative z-10 text-center md:text-left">
                 <h3 className="font-heading text-4xl md:text-6xl mb-6 text-white leading-tight">
                   Schedule a <br className="md:hidden" />
                   <span className="gold-gradient-text italic">Private Tour</span>
                 </h3>
                 <p className="text-white/70 font-body text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto md:mx-0">
                   Leave your details and our relationship manager will contact you within 24 hours to arrange an exclusive site visit.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                    <button 
                      onClick={() => navigate("/book-visit")}
                      className="Btn"
                    >
                      Book Site Visit
                    </button>
                    <button 
                      onClick={() => navigate("/contact")}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent border border-white/20 text-white text-[11px] font-bold tracking-[0.2em] uppercase font-body hover:uiverse-silver-button hover:border-transparent transition-all duration-300 active:scale-95 min-w-[180px] h-[52px]"
                    >
                      Schedule Meeting
                    </button>
                 </div>
                    <div className="flex items-center justify-center md:justify-start gap-8 mt-14">
                      <a href="https://www.instagram.com/riyasat.bpl/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-all hover:scale-110"><Instagram size={24} /></a>
                      <a href="#" className="text-white/40 hover:text-gold transition-all hover:scale-110"><Facebook size={24} /></a>
                      <a href="#" className="text-white/40 hover:text-gold transition-all hover:scale-110"><Linkedin size={24} /></a>
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

export default AboutPage;
