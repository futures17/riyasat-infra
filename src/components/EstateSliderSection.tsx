import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import img1 from "@/assets/event_home/event_home-1.webp";
import img2 from "@/assets/event_home/event_home-2.webp";
import img3 from "@/assets/event_home/event_home-3.webp";
import img4 from "@/assets/event_home/event_home-4.webp";
import img5 from "@/assets/event_home/event_home-5.webp";
import img6 from "@/assets/event_home/event_home-6.webp";
import img7 from "@/assets/event_home/event_home-7.webp";
import img8 from "@/assets/event_home/event_home-8.webp";

const eventImages = [
  { src: img1, title: "Expo Participation", meta: "2026 Highlight" },
  { src: img2, title: "Brand Presence", meta: "Industry Leader" },
  { src: img3, title: "Awards Gala", meta: "Excellence" },
  { src: img4, title: "Riyasat Connect", meta: "Networking" },
  { src: img5, title: "Real Estate Summit", meta: "Keynote" },
  { src: img6, title: "Grand Opening", meta: "Celebration" },
  { src: img7, title: "Customer Meet", meta: "Community" },
  { src: img8, title: "Vision 2030", meta: "Future Goals" },
];

const EstateSliderSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Duplicate the images to create seamless infinite loop
  const allImages = [...eventImages, ...eventImages];

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);
      
      if (!trackRef.current) return;
      const track = trackRef.current;

      const tween = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 35, // Slower, more luxury feel
        repeat: -1,
      });

      const handleEnter = () => tween.pause();
      const handleLeave = () => tween.play();

      track.addEventListener("mouseenter", handleEnter);
      track.addEventListener("mouseleave", handleLeave);

      // ScrollTrigger background color transition logic
      if (sectionRef.current) {
        gsap.to(sectionRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse",
          },
          backgroundColor: "#0A201C", // Dark green instead of black
          color: "#E3E1DC", // Cream text
          duration: 1.2,
          ease: "power2.inOut",
        });
      }

      return () => {
        track.removeEventListener("mouseenter", handleEnter);
        track.removeEventListener("mouseleave", handleLeave);
        tween.kill();
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    };

    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} id="estate-slider" className="section-padding bg-[#b9cbb5] overflow-hidden text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto mb-14 transition-colors duration-1000">
        <h2 className="font-heading font-light tracking-[0.02em] text-4xl md:text-6xl text-center mb-4">
          Moments & <span className="gold-text italic">Milestones</span>
        </h2>
        <p className="text-center text-muted-foreground font-body text-sm max-w-2xl mx-auto">
          Experience the journey of trust — from grand award galas to exclusive site visits with our esteemed clientele.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Left fade (removed to fix blur/light issues) */}
        {/* Right fade (removed to fix blur/light issues) */}

        <div
          ref={trackRef}
          className="flex gap-5 will-change-transform"
          style={{ width: "max-content" }}
        >
          {allImages.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="group relative overflow-hidden rounded-2xl border border-gold/15 flex-shrink-0 transition-shadow duration-[600ms] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
              style={{ width: "300px", height: "220px" }}
            >
              <img
                src={item.src}
                alt={item.title}
                loading={index < 6 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute left-4 right-4 bottom-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <p className="text-cream text-base font-heading leading-none">{item.title}</p>
                <p className="text-gold-light text-[10px] uppercase tracking-[0.2em] font-body mt-1">{item.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EstateSliderSection;
