import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    let cleanupLenis: (() => void) | undefined;
    // setupLenis removed - using global Lenis from App.tsx


    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      gsap.fromTo(
        ".policy-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.1 }
      );
    };

    loadGSAP();
    return () => { cleanupLenis?.(); };
  }, []);

  return (
    <div className="overflow-x-hidden bg-background">
      <Navbar />

      <div className="policy-content pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body hover:text-gold transition-colors mb-12 flex items-center gap-2"
        >
          <span>←</span> Return
        </button>
        
        <h1 className="luxury-heading text-4xl md:text-6xl mb-12 text-[#4A3B2C]">
          Privacy <span className="gold-text italic">Policy</span>
        </h1>

        <div className="prose prose-lg prose-p:text-muted-foreground prose-headings:text-forest-deep prose-headings:font-heading prose-a:text-[#c8a44b] max-w-none font-body">
          <p className="lead text-xl text-forest-deep mb-8">
            Your privacy is our utmost priority. Green Glades Estate and Riyasat Infra respects the confidentiality of all our clients.
          </p>

          <h2>Information Collection</h2>
          <p>
            When you interact with our luxury portals, we may collect personal identification information such as names, email addresses, phone numbers, and investment preferences solely for the purpose of curating your property acquisition experience.
          </p>

          <h2>Information Usage</h2>
          <p>
            Any collected data is utilized exclusively to provide tailored property recommendations, schedule private estate visits, and maintain correspondence regarding Riyasat Infra developments.
          </p>

          <h2>Data Protection</h2>
          <p>
            We implement stringent digital security measures. We do not sell, trade, or rent personal identification information to unauthorized third-party organizations under any circumstances.
          </p>

          <h2>Consent</h2>
          <p>
            By using this website, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our site.
          </p>
          
          <p className="text-sm mt-12 text-gray-500">Last Updated: April 2026</p>
        </div>
      </div>

      <LuxuryFooter />
    </div>
  );
};

export default PrivacyPolicyPage;
