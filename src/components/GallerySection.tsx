import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "@/assets/panoramic-hillside-estate-pool.webp";
import img2 from "@/assets/terraced-rose-garden-estate.webp";
import img3 from "@/assets/luxury-villa-poolside-deck.webp";
import img4 from "@/assets/estate-concept-collage-vertical.webp";
import img5 from "@/assets/tropical-retreat-lawn.webp";
import img6 from "@/assets/zen-courtyard-water-garden.webp";

const homepageImages = [
  { src: img1, alt: "Panoramic Estate View", colSpan: "col-span-1 md:col-span-3", aspect: "aspect-[16/9] md:aspect-[21/9]" },
  { src: img2, alt: "Terraced Rose Garden", colSpan: "col-span-1 md:col-span-2", aspect: "aspect-[4/3] md:aspect-[16/9]" },
  { src: img3, alt: "Luxury Villa Deck", colSpan: "col-span-1 md:col-span-1", aspect: "aspect-[4/3] md:aspect-square" },
  { src: img4, alt: "Estate Collage", colSpan: "col-span-1", aspect: "aspect-square" },
  { src: img5, alt: "Tropical Retreat", colSpan: "col-span-1", aspect: "aspect-square" },
  { src: img6, alt: "Zen Courtyard", colSpan: "col-span-1", aspect: "aspect-square" },
];

const GallerySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".gallery-heading-wrap",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gallery-heading-wrap",
            start: "top 85%",
          },
        }
      );

      // Staggered reveal for gallery items
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 30, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: (i % 6) * 0.1,
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
            },
          }
        );
      });
    };

    loadGSAP();
  }, []);

  return (
    <section ref={sectionRef} id="gallery" className="section-padding bg-background pb-[10vh]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Heading */}
        <div className="gallery-heading-wrap flex flex-col items-center justify-center mb-12 md:mb-16">
          <h2 className="luxury-heading text-4xl md:text-5xl lg:text-6xl text-center mb-4 text-[#4A3B2C]">
            Estate <span className="text-[#c8a44b] italic">Gallery</span>
          </h2>
          <p className="text-center text-[#555] font-body text-xs sm:text-sm tracking-wide">
            Curated frames of villas, landscapes, amenities, and estate life.
          </p>
        </div>

        {/* Structured Grid without pending spaces */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {homepageImages.map((item, index) => (
            <article
              key={index}
              className={`gallery-item group ${item.colSpan} overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer relative`}
            >
              <div
                className={`relative w-full h-full bg-[#111] overflow-hidden ${item.aspect}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:brightness-90"
                />
                
                {/* Gradient overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Text reveals on hover */}
                <div className="absolute left-0 right-0 bottom-0 p-6 md:p-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10 flex flex-col justify-end">
                  <h3 className="text-[#c8a44b] font-heading text-2xl md:text-3xl mb-2 drop-shadow-md">{item.alt}</h3>
                  <div className="w-12 h-px bg-white/50 mb-3" />
                  <p className="text-white text-sm font-body font-light opacity-90 tracking-wide flex items-center gap-2">
                    <span className="uppercase text-[10px] tracking-widest text-[#c8a44b]">Explore</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </p>
                </div>

              </div>
            </article>
          ))}
        </div>

        {/* View Full Gallery CTA */}
        <div className="flex justify-center mt-12 md:mt-16">
          <button
            onClick={() => navigate("/gallery")}
            className="px-8 py-3 border border-[#c8a44b]/50 text-[#c8a44b] font-body text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#c8a44b] hover:text-white transition-all duration-500 shadow-[0_0_15px_rgba(200,164,75,0.1)] hover:shadow-[0_0_20px_rgba(200,164,75,0.4)]"
            aria-label="View full gallery"
          >
            View Full Gallery <span className="ml-2">→</span>
          </button>
        </div>
        
      </div>
    </section>
  );
};

export default GallerySection;
