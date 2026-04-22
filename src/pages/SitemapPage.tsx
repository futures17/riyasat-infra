import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";

const SitemapPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    let cleanupLenis: (() => void) | undefined;
    // setupLenis removed - using global Lenis from App.tsx


    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      gsap.fromTo(
        ".sitemap-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );
    };

    loadGSAP();
    return () => { cleanupLenis?.(); };
  }, []);

  const sitemapSections = [
    {
      title: "Estate Experience",
      links: [
        { name: "Home / Main Estate", path: "/" },
        { name: "Green Glades Project", path: "/projects" },
        { name: "Gallery & Visuals", path: "/gallery" },
        { name: "Events & Celebrations", path: "/events" },
        { name: "Inspirational Quotes", path: "/quotes" },
      ]
    },
    {
      title: "Acquisition & Details",
      links: [
        { name: "About the Project", path: "/about" },
        { name: "Book a Site Visit", path: "/book-visit" },
        { name: "General Contact", path: "/contact" },
      ]
    },
    {
      title: "Corporate & Legal",
      links: [
        { name: "Riyasat Developer", path: "/developer" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms & Conditions", path: "/terms" },
      ]
    }
  ];

  return (
    <div className="overflow-x-hidden bg-background">
      <Navbar />

      <div className="sitemap-content pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body hover:text-gold transition-colors mb-12 flex items-center gap-2"
        >
          <span>←</span> Return
        </button>
        
        <h1 className="luxury-heading text-4xl md:text-6xl mb-4 text-[#4A3B2C]">
          Site<span className="gold-text italic">map</span>
        </h1>
        <p className="font-body text-muted-foreground mb-16 max-w-xl">
          Complete navigation architecture for the Riyasat Green Glades Estate experiential platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sitemapSections.map((section, index) => (
            <div key={index} className="border-t border-[#c8a44b]/30 pt-8">
              <h2 className="text-[#c8a44b] font-heading text-2xl mb-6">{section.title}</h2>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path}
                      className="font-body text-forest-deep/80 hover:text-[#c8a44b] hover:font-bold transition-all text-sm uppercase tracking-wider relative group flex items-center gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8a44b]/0 group-hover:bg-[#c8a44b] transition-colors"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <LuxuryFooter />
    </div>
  );
};

export default SitemapPage;
