import { useEffect, useRef } from "react";
import { Search, Map, Shield, Key } from "lucide-react";
import gatedEntrance from "@/assets/grand-gated-estate-entrance.webp";
import modernDriveway from "@/assets/grand-modern-estate-driveway.webp";
import glassFacade from "@/assets/modern-farmhouse-glass-facade.webp";
import poolGarden from "@/assets/luxury-estate-pool-garden.webp";

const developmentSteps = [
  {
    step: "01",
    title: "Consultation",
    desc: "Mapping your vision for the perfect getaway.",
    image: gatedEntrance,
    icon: <Search className="w-8 h-8 text-gold mb-4" />,
  },
  {
    step: "02",
    title: "Master Planning",
    desc: "Designing wide roads and generous green spaces.",
    image: modernDriveway,
    icon: <Map className="w-8 h-8 text-gold mb-4" />
  },
  {
    step: "03",
    title: "Development",
    desc: "Ensuring 24-hour water supply & gated security.",
    image: glassFacade,
    icon: <Shield className="w-8 h-8 text-gold mb-4" />
  },
  {
    step: "04",
    title: "Handover",
    desc: "Stepping into your legacy, ready for generations.",
    image: poolGarden,
    icon: <Key className="w-8 h-8 text-gold mb-4" />
  },
];

const HorizontalDevelopmentSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !triggerRef.current) return;

      const pinDistance = sectionRef.current.scrollWidth - window.innerWidth;

      gsap.to(sectionRef.current, {
        x: -pinDistance,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${pinDistance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    };

    loadGSAP();
  }, []);

  return (
    <div ref={triggerRef} className="overflow-hidden bg-background">
      <div 
        ref={sectionRef} 
        className="flex gap-12 px-[10vw] py-24 w-max items-center h-screen"
      >
        {developmentSteps.map((step) => (
          <div 
            key={step.step} 
            className="w-[350px] md:w-[600px] h-[450px] flex-shrink-0 relative rounded-3xl overflow-hidden shadow-2xl group"
          >
            <img 
              src={step.image} 
              alt={step.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <span className="text-gold font-heading text-4xl mb-2 block">{step.step}.</span>
              <h3 className="text-white font-heading text-3xl mb-2">{step.title}</h3>
              <p className="text-white/70 font-body text-sm max-w-[280px]">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalDevelopmentSection;
