import { useEffect, useRef } from "react";
import {
  Waves, Utensils, Dumbbell, Bike, Gamepad2, TreePine, 
  Fence, Lightbulb, Droplets, Car, Building, Sparkles
} from "lucide-react";

const amenities = [
  { icon: Waves, title: "Swimming Pool", desc: "Resort-style infinity pool" },
  { icon: Building, title: "Banquet Hall", desc: "Grand celebrations venue" },
  { icon: Utensils, title: "Restaurant & Bar", desc: "Fine dining experience" },
  { icon: Bike, title: "Cycling Track", desc: "Scenic nature trails" },
  { icon: Dumbbell, title: "Modern Gym", desc: "State-of-the-art fitness" },
  { icon: Gamepad2, title: "Indoor Games", desc: "Recreation for all ages" },
  { icon: TreePine, title: "Nature Walks", desc: "Landscaped garden paths" },
  { icon: Fence, title: "Grand Entrance", desc: "Majestic gated entry" },
  { icon: Lightbulb, title: "Street Lighting", desc: "Premium LED lighting" },
  { icon: Droplets, title: "24/7 Water Supply", desc: "Assured water system" },
  { icon: Car, title: "Wide Roads", desc: "60ft internal roads" },
  { icon: Sparkles, title: "Resort Living", desc: "Club membership access" },
];

const AmenitiesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(".amenities-heading", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, scrollTrigger: { trigger: ".amenities-heading", start: "top 85%", scrub: 1 },
      });

      gsap.utils.toArray<HTMLElement>(".amenity-card").forEach((card, i) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: { trigger: card, start: "top 80%", end: "top 60%", scrub: 1 },
          }
        );
      });
    };
    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} id="amenities" className="section-padding cream-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="amenities-heading luxury-heading text-4xl md:text-6xl lg:text-7xl text-center mb-4">
          World-Class <span className="gold-text italic">Amenities</span>
        </h2>
        <p className="text-center text-muted-foreground font-body text-sm max-w-xl mx-auto mb-16">
          Every detail crafted for comfort, luxury, and an elevated lifestyle
        </p>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5">
          {amenities.map((amenity) => (
            <div
              key={amenity.title}
              className="amenity-card luxury-card p-3 md:p-8 flex flex-col items-center text-center group"
            >
              <div className="icon-gold-ring w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-2 md:mb-4 bg-pista/60 group-hover:bg-gold/20 transition-colors duration-500">
                <amenity.icon className="w-5 h-5 md:w-6 md:h-6 text-forest group-hover:text-gold transition-colors duration-500" />
              </div>
              <h3 className="font-heading text-[10px] md:text-xl text-foreground mb-1 leading-tight">{amenity.title}</h3>
              <p className="hidden md:block text-muted-foreground text-xs font-body">{amenity.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
