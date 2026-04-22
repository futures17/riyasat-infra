import { useEffect, useRef } from "react";
import logo from "@/assets/corelogo.webp";

interface LuxuryLoaderProps {
  onComplete: () => void;
}

const LuxuryLoader = ({ onComplete }: LuxuryLoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fail-safe: Always hide loader and call onComplete after 7 seconds max
    const safeTimeout = setTimeout(() => {
      if (loaderRef.current && loaderRef.current.style.display !== "none") {
        console.warn("LuxuryLoader: Fail-safe triggered.");
        document.body.style.overflow = "";
        loaderRef.current.style.display = "none";
        onComplete();
      }
    }, 7000);

    const runLoader = async () => {
      try {
        const gsap = (await import("gsap")).default;

        if (!loaderRef.current) {
          onComplete();
          return;
        }

        document.body.style.overflow = "hidden";

        const tl = gsap.timeline({
          onComplete: () => {
            clearTimeout(safeTimeout);
            document.body.style.overflow = "";
            if (loaderRef.current) loaderRef.current.style.display = "none";
            onComplete();
          }
        });

        // Animation with optional existence checks
        if (logoRef.current) tl.fromTo(logoRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "power2.out" });
        if (textRef.current) tl.fromTo(textRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5");
        if (barRef.current) tl.to(barRef.current, { width: "100%", duration: 2.5, ease: "slow(0.7, 0.7, false)" }, 0);
        if (textContainerRef.current) tl.to(textContainerRef.current, { y: -30, opacity: 0, duration: 0.4, ease: "power2.inOut" });
        
        tl.to(loaderRef.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });
      } catch (err) {
        console.error("LuxuryLoader Error:", err);
        clearTimeout(safeTimeout);
        document.body.style.overflow = "";
        if (loaderRef.current) loaderRef.current.style.display = "none";
        onComplete();
      }
    };

    runLoader();
    return () => clearTimeout(safeTimeout);
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#0f2f2a" }}
    >
      <div ref={textContainerRef} className="mb-8 flex flex-col items-center justify-center">
        <img ref={logoRef} src={logo} alt="Riyasat Infra" className="h-32 md:h-48 object-contain drop-shadow-2xl" />
        <h1 ref={textRef} className="text-gold font-heading text-3xl md:text-5xl mt-6 tracking-widest uppercase">
          Riyasat <span className="italic">Infra</span>
        </h1>
      </div>
      
      {/* Sliding progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#C8A44B] via-[#E5C97A] to-[#A8872A] w-0" ref={barRef} />
    </div>
  );
};

export default LuxuryLoader;
