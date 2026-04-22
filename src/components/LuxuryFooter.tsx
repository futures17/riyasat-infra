import { Facebook, Instagram, Linkedin, Twitter, Github } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import footerLogo from "@/assets/footerlogo.webp";
import greenGladesWhiteLogo from "@/assets/green_glades/logo/green_glades_white.webp";
import natureLogo from "@/assets/green_glades/logo/nature_text.webp";

const LuxuryFooter = () => {
  const location = useLocation();

  return (
    <footer className="bg-[#1B3B2A] text-cream font-body relative pt-12 md:pt-24 overflow-hidden selection:bg-gold selection:text-forest-deep border-t border-gold/40 group">
      {/* Huge Background Text - Visible only on hover for premium feel */}
      <div className="absolute top-[30%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none select-none z-0">
        <span className="font-heading text-[30vw] md:text-[24vw] text-transparent font-light whitespace-nowrap leading-none tracking-tighter transition-all duration-[1500ms] ease-out group-hover:text-gold/[0.15] group-hover:scale-105 drop-shadow-sm">
          RIYASAT
        </span>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 pt-4 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-8 md:mb-12">
          
          {/* Logo & Description (Centered and Enlarged) */}
          <div className="lg:col-span-12 flex flex-col items-center text-center mb-10 md:mb-16">
            <div className="flex items-center justify-center mb-6 md:mb-8">
              <img 
                src={location.pathname === "/projects" ? greenGladesWhiteLogo : footerLogo} 
                alt="Riyasat" 
                className="h-20 md:h-32 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <p className="text-gold/60 text-base md:text-lg leading-relaxed max-w-2xl font-body italic">
              "Architecting the void. We build for the next century, using the materials of the past. Based in Bhopal."
            </p>
            <div className="w-24 h-px bg-gold/30 mt-6 md:mt-8" />
          </div>
          
          {/* Links Grid (Responsive & Balanced) */}
          <div className="lg:col-span-12 flex flex-wrap justify-center md:justify-center gap-x-12 lg:gap-x-32 gap-y-10">
            <div className="flex flex-col gap-4 min-w-[140px] items-center md:items-start text-center md:text-left">
              <h4 className="text-cream/90 font-bold mb-1 uppercase tracking-widest text-[11px] md:text-[12px] cursor-default opacity-80 border-b border-gold/20 pb-1 w-fit">Estate</h4>
              <div className="flex flex-col gap-3">
                <Link to="/about" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">About Us</Link>
                <Link to="/events" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">Events</Link>
                <Link to="/projects" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">Projects</Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 min-w-[140px] items-center md:items-start text-center md:text-left">
              <h4 className="text-cream/90 font-bold mb-1 uppercase tracking-widest text-[11px] md:text-[12px] cursor-default opacity-80 border-b border-gold/20 pb-1 w-fit">Acquisition</h4>
              <div className="flex flex-col gap-3">
                <Link to="/gallery" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">Gallery</Link>
                <Link to="/book-visit" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">Book an Appointment</Link>
                <Link to="/contact" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">Contact Us</Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 min-w-[140px] items-center md:items-start text-center md:text-left">
              <h4 className="text-cream/90 font-bold mb-1 uppercase tracking-widest text-[11px] md:text-[12px] cursor-default opacity-80 border-b border-gold/20 pb-1 w-fit">Riyasat Infra</h4>
              <div className="flex flex-col gap-3">
                <Link to="/developer" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">The Developer</Link>
                <Link to="/auth/signup-member" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">Join Team</Link>
                <Link to="/auth/login" className="text-gold/80 hover:text-gold transition-colors text-[16px] font-bold">Staff Portal</Link>
              </div>
            </div>
          </div>
          
          {/* Nature Branding Logo */}
          <div className="lg:col-span-12 flex justify-center mb-12">
            <img src={natureLogo} alt="Green Glades Nature" className="h-16 md:h-24 object-contain opacity-70 hover:opacity-100 transition-opacity duration-1000" />
          </div>
        </div>

        {/* Social Icons matching Velos layout */}
        <div className="flex justify-center gap-6 mb-24 md:mb-16 relative z-10">
          <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold/80 hover:text-forest-deep hover:bg-gold hover:border-gold hover:scale-110 shadow-[0_0_15px_rgba(200,164,75,0.1)] hover:shadow-[0_0_20px_rgba(200,164,75,0.4)] transition-all duration-500">
            <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a href="https://www.instagram.com/riyasat.bpl/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold/80 hover:text-forest-deep hover:bg-gold hover:border-gold hover:scale-110 shadow-[0_0_15px_rgba(200,164,75,0.1)] hover:shadow-[0_0_20px_rgba(200,164,75,0.4)] transition-all duration-500">
            <Instagram className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold/80 hover:text-forest-deep hover:bg-gold hover:border-gold hover:scale-110 shadow-[0_0_15px_rgba(200,164,75,0.1)] hover:shadow-[0_0_20px_rgba(200,164,75,0.4)] transition-all duration-500">
            <Twitter className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold/80 hover:text-forest-deep hover:bg-gold hover:border-gold hover:scale-110 shadow-[0_0_15px_rgba(200,164,75,0.1)] hover:shadow-[0_0_20px_rgba(200,164,75,0.4)] transition-all duration-500">
            <Facebook className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        </div>

        {/* Middle Divider & Compact Links */}
        <div className="border-t border-gold/40 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gold/60 text-[10px] uppercase tracking-wider font-semibold">
          <p className="text-center md:text-left">© 2026 MADE BY PRANAV SAHU | FOUNDER OF HEXATOM | AI AND AGENTIC FULL STACK DEVELOPER TEAM</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-gold transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* DEVELOPER IDENTITY FOOTER — PRANAV SAHU | HEXATOM (As requested in ref) */}
      <div className="bg-[#0a201c] border-t border-gold/40 pt-8 pb-32 px-6 md:px-12 mt-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gold/20 items-start">
            
            {/* Developer Identity */}
            <div className="flex md:block items-center gap-3 md:gap-0">
              <div className="text-[9px] font-semibold text-gold/80 tracking-[0.12em] uppercase mb-2 hidden md:block">Designed &amp; Built by</div>
              <div>
                <div className="text-[14px] md:text-[16px] font-semibold text-cream tracking-tight mb-0.5">Pranav Sahu</div>
                <div className="text-[10px] md:text-[12px] text-cream/50 leading-relaxed font-light">Software Developer &amp; AI Architect</div>
              </div>
            </div>

            {/* Brands */}
            <div>
              <div className="text-[9px] font-semibold text-gold/80 tracking-[0.12em] uppercase mb-2">Platform Credits</div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] text-cream/50">Created by <span className="text-gold/70">Hexatom Team</span></span>
                <span className="text-[12px] text-cream/50">AI Chat &amp; Security by <span className="text-gold/70">Aronar AI</span></span>
                <span className="text-[11px] text-cream/30 mt-1">© All Copy Rights Reserved</span>
              </div>
            </div>

            {/* Social Links Formatted */}
            <div>
              <div className="text-[9px] font-semibold text-gold/80 tracking-[0.12em] uppercase mb-2">Connect</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Linkedin, href: "https://www.linkedin.com/in/pranav-sahu-bb86b8234/" },
                  { icon: Instagram, href: "https://www.instagram.com/the_future_of_explainer/" },
                  { icon: Github, href: "https://github.com/pranavsahu005" },
                  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=100078424104712" },
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-[32px] h-[32px] rounded-md border border-gold/30 flex items-center justify-center text-gold/60 hover:border-gold hover:text-forest-deep hover:bg-gold hover:-translate-y-0.5 transition-all group relative"
                  >
                    <social.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>

            </div>
          </div>

          <div className="flex justify-between items-center pt-4 flex-wrap gap-3 relative z-[60]">
            <span className="text-[10px] text-gold/50 tracking-wide">© 2026 Pranav Sahu. All rights reserved.</span>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold/60 hover:bg-gold hover:text-forest-deep transition-all"
                aria-label="Back to top"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
              </button>

              <a href="https://pranav005-portfolio.netlify.app" target="_blank" rel="noopener noreferrer" className="text-[10px] text-gold/80 hover:text-gold transition-colors uppercase tracking-widest flex items-center gap-1.5">
                Portfolio <span className="text-sm leading-none">→</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default LuxuryFooter;
