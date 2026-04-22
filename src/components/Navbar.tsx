import { useState, useEffect } from "react";
import { Home, Info, MapPin, Phone, CalendarCheck, X, Menu, Briefcase } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logomain.webp";
import greenGladesGoldLogo from "@/assets/green_glades/logo/green_glades-gold.webp";
import greenGladesWhiteLogo from "@/assets/green_glades/logo/green_glades_white.webp";
import natureTextLogo from "@/assets/green_glades/logo/nature_text.webp";

const navItems = [
  { label: "Home", href: "/", isRoute: true },
  { label: "About Us", href: "/about", isRoute: true },
  { label: "Events", href: "/events", isRoute: true },
  { label: "Projects", href: "/projects", isRoute: true },
  { label: "Career", href: "/auth/signup-member", isRoute: true },
  { label: "Contact", href: "/contact", isRoute: true },
];

const mobileNavItems = [
  { label: "Home", href: "/", icon: Home, isRoute: true },
  { label: "About", href: "/about", icon: Info, isRoute: true },
  { label: "Events", href: "/events", icon: CalendarCheck, isRoute: true },
  { label: "Projects", href: "/projects", icon: MapPin, isRoute: true },
  { label: "Career", href: "/auth/signup-member", icon: Briefcase, isRoute: true },
  { label: "Contact", href: "/contact", icon: Phone, isRoute: true },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = mobileNavItems.map(item => item.href.substring(1));
      let current = "#hero";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = `#${section}`;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      // Show navbar only after 120px scroll to clear the hero text
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string, isRoute: boolean = false) => {
    if (isRoute) {
      navigate(href);
      return;
    }
    
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleMobileMenuClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* Desktop Navbar - Floating Pill Style (Hidden at top, shows on scroll) */}
      <div 
        className={`fixed top-2 left-0 right-0 z-50 hidden md:flex justify-center px-4 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
          scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <nav
          className={`w-full max-w-6xl flex items-center justify-between px-8 py-2 transition-all duration-500 bg-white/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-full border border-gold/20`}
        >
          <button onClick={() => handleClick("#hero")} className="flex items-center gap-2">
            <img src={location.pathname === "/projects" ? greenGladesGoldLogo : logo} alt="Riyasat" className="h-10 md:h-12 object-contain" />
            {location.pathname === "/projects" && (
              <img src={natureTextLogo} alt="Nature" className="h-4 md:h-5 object-contain brightness-0 opacity-40" />
            )}
          </button>

          <div className="flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item.href, item.isRoute)}
                className="text-[13px] text-[#4A3B2C] hover:text-gold-dark transition-colors duration-300 font-body font-semibold"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="hidden lg:inline-flex Btn !h-9 !text-[11px] !min-w-0"
              onClick={() => navigate("/book-visit")}
            >
              Book Visit
            </button>

            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#4A3B2C]/60 hover:bg-gold/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#4A3B2C]/60 hover:bg-gold/5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/></svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Top Header with Hamburger */}
      <div className={`fixed top-0 left-0 right-0 z-[60] md:hidden px-4 py-4 transition-all duration-500 ${scrolled ? "bg-forest-deep/80 backdrop-blur-md border-b border-gold/20" : "bg-transparent"}`}>
        <div className="flex items-center justify-between">
          <button onClick={() => handleClick("/")} className="flex items-center gap-2">
            <img src={location.pathname === "/projects" ? greenGladesGoldLogo : logo} alt="Riyasat" className="h-9 object-contain" />
            {location.pathname === "/projects" && (
              <img src={natureTextLogo} alt="Nature" className="h-3 object-contain brightness-0 opacity-40" />
            )}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile App-Style Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-[#051C14]/95 backdrop-blur-2xl rounded-t-3xl border-t border-gold/20 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] px-6 py-4 flex justify-between items-center text-white">
          {mobileNavItems.map((item) => {
            const isActive = item.isRoute 
              ? location.pathname === item.href 
              : activeSection === item.href;
            return (
              <button
                key={item.label}
                onClick={() => handleClick(item.href, item.isRoute)}
                className="group flex flex-col items-center gap-1.5 transition-all duration-300 active:scale-95"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive ? 'bg-gold/20 border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 border-white/10 group-hover:bg-gold/10 group-hover:border-gold/30'}`}>
                  <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-gold-light drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]' : 'text-white/70 group-hover:text-gold'}`} strokeWidth={isActive ? 2 : 1.5} />
                </div>
                <span className={`text-[9px] uppercase tracking-[0.1em] font-body transition-colors duration-300 ${isActive ? 'text-gold font-bold' : 'text-white/70 font-medium group-hover:text-gold/80'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Side Menu Drawer */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMobileMenuOpen ? "visible" : "invisible"}`}>
        {/* Overlay backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer Content */}
        <div className={`absolute top-0 right-0 h-full w-[80%] max-w-[400px] bg-forest-deep border-l border-gold/20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col h-full p-8 relative">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:bg-gold/10 transition-all"
            >
              <X size={20} />
            </button>

            <div className="mt-12 mb-16">
              <img src={location.pathname === "/projects" ? greenGladesGoldLogo : logo} alt="Riyasat" className="h-16 object-contain" />
            </div>

            <div className="flex flex-col gap-8">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Events", path: "/events" },
                { label: "Projects", path: "/projects" },
                { label: "Career", path: "/auth/signup-member" },
                { label: "Login", path: "/auth/login" },
                { label: "Contact Us", path: "/contact" },
              ].map((item, idx) => (
                <button 
                  key={item.label}
                  onClick={() => handleMobileMenuClick(item.path)}
                  className="text-[#F5E6CA] font-heading text-3xl hover:text-gold transition-all hover:translate-x-2 text-left flex items-center gap-4 group"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <span className="text-[10px] text-gold/40 font-body group-hover:text-gold transition-colors">0{idx + 1}.</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <button 
                onClick={() => handleMobileMenuClick("/book-visit")}
                className="w-full bg-gold text-white py-4 rounded-xl font-body text-xs uppercase tracking-[0.2em] font-bold shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all active:scale-[0.98]"
              >
                Book a Visit
              </button>
              <button 
                onClick={() => handleMobileMenuClick("/contact")}
                className="w-full border border-gold/30 text-gold py-4 rounded-xl font-body text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold/5 transition-all"
              >
                Contact Us
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-4">
               <div className="h-[1px] flex-grow bg-gold/10" />
               <span className="text-[10px] text-gold/30 uppercase tracking-widest">Premium Estate</span>
               <div className="h-[1px] flex-grow bg-gold/10" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;