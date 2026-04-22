import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { heroBannerImage } from "@/data/media";

interface HeroSectionProps {
  animationReady?: boolean;
}

const HeroSection = ({ animationReady = false }: HeroSectionProps) => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!animationReady || hasAnimated.current) return;
    hasAnimated.current = true;

    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      // Word-split animation: each word slides up from translateY(120%)
      const wordInners = sectionRef.current.querySelectorAll<HTMLElement>(".word-inner");

      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-meta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          wordInners,
          { y: "120%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.3"
        )
        .fromTo(
          ".hero-desc",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ".hero-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".scroll-indicator",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.2"
        );

      // Parallax on hero background
      gsap.to(".hero-bg-image", {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    };

    loadGSAP();
  }, [animationReady]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[70vh] md:h-screen overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBannerImage}
          alt="Riyasat Estate luxury estate facade with reflective pool"
          className="hero-bg-image w-full h-[120%] object-cover object-center"
        />
        {/* Darker Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/60 via-forest-deep/40 to-forest-deep/80" />
      </div>

      {/* Content Layer with mix-blend-difference for cinematic effect */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white mix-blend-difference">
        <p className="hero-meta text-[10px] md:text-xs uppercase tracking-[0.45em] font-body mb-8 opacity-0">
          Build. Building. Beyond.
        </p>

        <h1 
          className="luxury-heading text-[13vw] sm:text-7xl md:text-8xl lg:text-[9rem] font-bold tracking-[0.08em] leading-[0.9] text-white" 
        >
          {/* Each word is wrapped in word-clip → word-inner for slide-up reveal */}
          <span className="block word-clip py-2">
            <span className="word-inner opacity-0">RIYASAT</span>
          </span>
          <span className="block word-clip py-2">
            <span className="word-inner opacity-0">INFRA</span>
          </span>
        </h1>

        <p className="hero-desc text-sm md:text-lg font-body font-light tracking-[0.14em] mt-6 max-w-xl opacity-0">
          Where Nature embraces Luxury — Estate living redefined, in Bhopal.
        </p>

        <div className="hero-cta mt-12 opacity-0">
          <button
            onClick={() => {
              const el = document.getElementById("project");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center px-12 py-4 rounded-full bg-transparent border border-white/60 text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-forest-deep transition-all duration-500 backdrop-blur-sm active:scale-95"
          >
            Explore Estate
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
          <span className="text-[10px] uppercase tracking-[0.35em] font-body opacity-60">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent opacity-60 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
