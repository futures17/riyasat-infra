import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";

const TermsConditionsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    let cleanupLenis: (() => void) | undefined;
    // setupLenis removed - using global Lenis from App.tsx


    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      gsap.fromTo(
        ".terms-content",
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

      <div className="terms-content pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-body hover:text-gold transition-colors mb-12 flex items-center gap-2"
        >
          <span>←</span> Return
        </button>
        
        <h1 className="luxury-heading text-4xl md:text-6xl mb-12 text-[#4A3B2C]">
          Terms & <span className="gold-text italic">Conditions</span>
        </h1>

        <div className="prose prose-lg prose-p:text-muted-foreground prose-headings:text-forest-deep prose-headings:font-heading prose-a:text-[#c8a44b] max-w-none font-body">
          <p className="lead text-xl text-forest-deep mb-8">
            Access to and use of the Riyasat Infra Green Glades Estate website is subject to the following Legal Terms and Conditions.
          </p>

          <h2>General Disclaimer</h2>
          <p>
            The information contained on this website is for general informational purposes only. The visual representations, layouts, architectural renders, and development specifications are indicative and subject to change without prior notice at the discretion of Riyasat Infra.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content, high-resolution imagery, logos, architectural designs, and text present on this platform are the exclusive intellectual property of Riyasat Infra. Unauthorized replication or distribution is strictly prohibited.
          </p>

          <h2>Property Offerings</h2>
          <p>
            The availability, pricing (including the ₹1CR-2CR estimated range), and plot sizes mentioned are approximate and subject to current market valuations at the time of official booking. Standard terms of sale apply to all acquisitions.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            Riyasat Infra shall not be legally held liable for any inaccuracies, errors, or omissions regarding the project details displayed. Final agreements will be based solely on the formal physical contracts signed between the acquiring party and the developer.
          </p>
          
          <p className="text-sm mt-12 text-gray-500">Last Updated: April 2026</p>
        </div>
      </div>

      <LuxuryFooter />
    </div>
  );
};

export default TermsConditionsPage;
