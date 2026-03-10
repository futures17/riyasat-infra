import { useState, useEffect } from "react";
import { Home, Info, MapPin, Phone, CalendarCheck, X, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logomain.png";


const navItems = [
  { label: "Home", href: "/", isRoute: true },
  { label: "About Us", href: "/about", isRoute: true },
  { label: "Amenities", href: "/amenities", isRoute: true },
  { label: "Gallery", href: "/gallery", isRoute: true },
  { label: "Investment", href: "/investment", isRoute: true },
  { label: "Contact", href: "/contact", isRoute: true },
];

const mobileNavItems = [
  { label: "Home", href: "/", icon: Home, isRoute: true },
  { label: "About", href: "/about", icon: Info, isRoute: true },
  { label: "Book", href: "/book-visit", icon: CalendarCheck, isRoute: true },
  { label: "Map", href: "/location", icon: MapPin, isRoute: true },
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
          <button onClick={() => handleClick("#hero")} className="flex items-center gap-3">
            <img src={logo} alt="Riyasat Estate" className="h-8 md:h-10 object-contain drop-shadow-sm" />
          </button>

          <div className="flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item.href, item.isRoute)}
                className="text-[11px] uppercase tracking-[0.22em] text-[#4A3B2C] hover:text-gold-dark transition-colors duration-300 font-body font-bold"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="hidden lg:flex items-center justify-center bg-transparent border border-gold text-gold hover:bg-gold hover:text-forest-deep px-6 py-2 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all duration-300 shadow-sm overflow-hidden relative group/btn"
              onClick={() => navigate("/book-visit")}
            >
              <span className="relative z-10">Book Visit</span>
              <div className="absolute inset-0 bg-gold translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
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
            <img src={logo} alt="Riyasat" className="h-8 object-contain brightness-0 invert" />
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
      
      {/* Full Screen Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-forest-deep/95 backdrop-blur-xl flex flex-col justify-center items-center px-6 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-10 right-6 w-12 h-12 rounded-full border border-[#c8a44b]/30 flex items-center justify-center text-[#c8a44b] hover:bg-[#c8a44b] hover:text-white transition-all shadow-[0_0_15px_rgba(200,164,75,0.2)]"
          >
            <X size={24} />
          </button>

          <img src={logo} alt="Riyasat" className="h-16 mb-12 brightness-0 invert" />

          <div className="flex flex-col items-center gap-6 w-full max-w-sm overflow-y-auto py-10 no-scrollbar">
            <button onClick={() => handleMobileMenuClick("/")} className="text-[#F5E6CA] font-heading text-2xl hover:text-[#c8a44b] transition-colors">Home</button>
            <button onClick={() => handleMobileMenuClick("/about")} className="text-[#F5E6CA] font-heading text-2xl hover:text-[#c8a44b] transition-colors">About Us</button>
            <button onClick={() => handleMobileMenuClick("/master-layout")} className="text-[#F5E6CA] font-heading text-2xl hover:text-[#c8a44b] transition-colors">Master Layout</button>
            <button onClick={() => handleMobileMenuClick("/amenities")} className="text-[#F5E6CA] font-heading text-2xl hover:text-[#c8a44b] transition-colors">Amenities</button>
            <button onClick={() => handleMobileMenuClick("/gallery")} className="text-[#F5E6CA] font-heading text-2xl hover:text-[#c8a44b] transition-colors">Full Gallery</button>
            <button onClick={() => handleMobileMenuClick("/investment")} className="text-[#F5E6CA] font-heading text-2xl hover:text-[#c8a44b] transition-colors">Investment Details</button>
            <button onClick={() => handleMobileMenuClick("/location")} className="text-[#F5E6CA] font-heading text-2xl hover:text-[#c8a44b] transition-colors">Location</button>
            <button onClick={() => handleMobileMenuClick("/developer")} className="text-[#F5E6CA] font-heading text-2xl hover:text-[#c8a44b] transition-colors">The Developer</button>
            <button onClick={() => handleMobileMenuClick("/book-visit")} className="bg-[#c8a44b] text-white px-8 py-3 rounded-full font-body text-sm uppercase tracking-widest font-bold mt-4 shadow-[0_0_20px_rgba(200,164,75,0.4)]">Book a Visit</button>
            <button onClick={() => handleMobileMenuClick("/contact")} className="text-[#c8a44b] font-body text-sm uppercase tracking-widest font-bold mt-2">Contact Us</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;