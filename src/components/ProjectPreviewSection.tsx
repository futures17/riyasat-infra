import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import img1 from "@/assets/green_glades/estate_clubhouse_road.webp";
import img2 from "@/assets/green_glades/luxury_farmhouse_sunset.webp";
import img3 from "@/assets/green_glades/luxury_villa_night_view.webp";
import img4 from "@/assets/green_glades/modern_farmhouse_exterior.webp";
import img5 from "@/assets/green_glades/modern_villa_pool_evening.webp";
import img6 from "@/assets/green_glades/outdoor_jacuzzi_area.webp";

const previewItems = [
  { src: img1, title: "Clubhouse Road" },
  { src: img2, title: "Farmhouse Sunset" },
  { src: img3, title: "Villa Night View" },
  { src: img4, title: "Modern Farmhouse" },
  { src: img5, title: "Pool Evening" },
  { src: img6, title: "Outdoor Jacuzzi" },
];

const ProjectPreviewSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-background text-[#4A3B2C] border-t border-gold/10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16 text-center">
        <h2 className="luxury-heading text-4xl md:text-5xl lg:text-6xl mb-4 text-forest-deep">
          Project <span className="text-[#c8a44b] italic">Preview</span>
        </h2>
        <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto">
          Discover our real clients, active site visits, and community trust.
        </p>
      </div>

      <div className="relative w-full py-10">
        <div className="flex w-max gap-6 px-6" style={{ animation: 'marquee-scroll-reverse 40s linear infinite' }}>
          {[...previewItems, ...previewItems, ...previewItems].map((item, index) => (
            <div 
              key={index} 
              className="relative w-[300px] md:w-[450px] lg:w-[600px] aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-gold/20 group flex-shrink-0 cursor-pointer"
              onClick={() => navigate("/projects")}
            >
              <img 
                src={item.src} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                <h3 className="text-[#F5E6CA] font-heading text-xl md:text-2xl drop-shadow-md">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <button 
          onClick={() => navigate("/projects")}
          className="px-8 py-3 rounded-full border border-gold/40 text-gold font-body text-xs uppercase tracking-widest hover:bg-gold/10 transition-colors"
        >
          View Full Project ↗
        </button>
      </div>
    </section>
  );
};

export default ProjectPreviewSection;
