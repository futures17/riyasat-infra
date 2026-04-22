import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/LuxuryFooter";
import InvestmentExcellenceSection from "@/components/InvestmentExcellenceSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import StackedFacilitiesSection from "@/components/StackedFacilitiesSection";
import ContactSection from "@/components/ContactSection";
import {
  MapPin, Home, Maximize, TrendingUp, Download, Phone, Navigation, CheckCircle, Plus, Scale, ShieldCheck, ChevronLeft, ChevronRight
} from "lucide-react";

import bhaskarAward from "@/assets/bhaskar_expo_award.webp";
import crownAward from "@/assets/gold_award_crown.webp";
import AwardsMedallions from "@/components/AwardsMedallions";
import greenGladesWhiteLogo from "@/assets/green_glades/logo/green_glades_white.webp";
import natureTextLogo from "@/assets/green_glades/logo/nature_text.webp";
import constructedDreamImg from "@/assets/green_glades/logo/Contrucred_dream.webp";

// MAIN IMAGES
const galleryImages = [
  "/src/assets/green_glades/estate_clubhouse_road.webp",
  "/src/assets/green_glades/estate_resort_parking.webp",
  "/src/assets/green_glades/kids_play_area.webp",
  "/src/assets/green_glades/luxury_farmhouse_sunset.webp",
  "/src/assets/green_glades/luxury_outdoor_seating.webp",
  "/src/assets/green_glades/luxury_villa_night_view.webp",
  "/src/assets/green_glades/modern_farmhouse_exterior.webp",
  "/src/assets/green_glades/modern_office_exterior.webp",
  "/src/assets/green_glades/modern_villa_day_view.webp",
  "/src/assets/green_glades/modern_villa_exterior_day.webp",
  "/src/assets/green_glades/modern_villa_pool_evening.webp",
  "/src/assets/green_glades/outdoor_jacuzzi_area.webp",
  "/src/assets/green_glades/resort_garden_pathway.webp"
];

// FACILITIES IMAGES
const facilityImages = [
  { img: "/src/assets/green_glades/facalities/birthday_party.webp", title: "Birthday Party" },
  { img: "/src/assets/green_glades/facalities/family-retreat.webp", title: "Family Retreat" },
  { img: "/src/assets/green_glades/facalities/festival_funtion.webp", title: "Festival Function" },
  { img: "/src/assets/green_glades/facalities/garden.webp", title: "Garden" },
  { img: "/src/assets/green_glades/facalities/handi_funtion.webp", title: "Handi Function" },
  { img: "/src/assets/green_glades/facalities/holi_function.webp", title: "Holi Function" },
  { img: "/src/assets/green_glades/facalities/meditation-garden.webp", title: "Meditation Garden" },
  { img: "/src/assets/green_glades/facalities/mehendi_funtion.webp", title: "Mehendi Function" },
  { img: "/src/assets/green_glades/facalities/peace_garden.webp", title: "Peace Garden" },
  { img: "/src/assets/green_glades/facalities/restaurant-dining.webp", title: "Restaurant Dining" },
  { img: "/src/assets/green_glades/facalities/sunday_holiday.webp", title: "Sunday Holiday" },
  { img: "/src/assets/green_glades/facalities/swimming-pool.webp", title: "Swimming Pool" },
  { img: "/src/assets/green_glades/facalities/tennis-court.webp", title: "Tennis Court" }
];

// POSTERS
const posterImages = [
  "/src/assets/green_glades/posters/estate_amenities_poster.webp",
  "/src/assets/green_glades/posters/estate_master_plan.webp",
  "/src/assets/green_glades/posters/farmhouse_pricing_poster.webp",
  "/src/assets/green_glades/posters/grand_entrance_promo_poster.webp",
  "/src/assets/green_glades/posters/green_glades_estate_poster.webp",
  "/src/assets/green_glades/posters/premium_farmhouse_poster.webp",
  "/src/assets/green_glades/posters/project_expo.webp"
];

// MAPS & PLANS
const mapImages = [
  "/src/assets/green_glades/visit map/aerial_master_plan.webp",
  "/src/assets/green_glades/visit map/estate_main_entrance.webp",
  "/src/assets/green_glades/visit map/location_map_bhopal.webp",
  "/src/assets/green_glades/visit map/site_layout_plan.webp",
  "/src/assets/green_glades/visit map/villa_type_a_plan.webp",
  "/src/assets/green_glades/visit map/villa_type_b_plan.webp"
];

// BROCHURE
const brochurePages = [
  "/src/assets/green_glades/broucher/brochure-1.webp",
  "/src/assets/green_glades/broucher/brochure-2.webp",
  "/src/assets/green_glades/broucher/brochure-3.webp",
  "/src/assets/green_glades/broucher/brochure-4.webp",
  "/src/assets/green_glades/broucher/brochure-5.webp",
  "/src/assets/green_glades/broucher/brochure-6.webp",
  "/src/assets/green_glades/broucher/brochure-7.webp",
  "/src/assets/green_glades/broucher/brochure-8.webp"
];

type SliderItem = string | { img: string; title: string };

const MarqueeSlider = ({ items, isFacilities = false }: { items: SliderItem[], isFacilities?: boolean }) => {
  const getSrc = (item: SliderItem) => typeof item === "string" ? item : item.img;
  const getLabel = (item: SliderItem) => typeof item === "string" ? "" : item.title;

  const half = Math.ceil(items.length / 2);
  const row1 = [...items.slice(0, half), ...items.slice(0, half)];
  const row2 = [...items.slice(half), ...items.slice(half)];

  const Card = ({ item, keyStr }: { item: SliderItem; keyStr: string }) => (
    <div key={keyStr} onClick={() => window.open(getSrc(item), "_blank")} className={`w-[220px] md:w-[290px] ${isFacilities ? "aspect-[4/5]" : "aspect-[4/3]"} rounded-xl overflow-hidden border border-gold/20 shadow-lg flex-shrink-0 relative group cursor-zoom-in`}>
      <img src={getSrc(item)} alt={getLabel(item) || "Gallery"} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
      {isFacilities && getLabel(item) && (
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent flex items-end p-4">
          <h3 className="text-base md:text-lg font-heading text-white border-b border-gold/50 pb-1">{getLabel(item)}</h3>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gold/90 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">View</span>
      </div>
    </div>
  );

  return (
    <div className="w-full overflow-hidden space-y-5 py-6">
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max gap-5 px-4 animate-marquee hover:[animation-play-state:paused]">
          {row1.map((item, i) => <Card key={`r1-${i}`} item={item} keyStr={`r1-${i}`} />)}
        </div>
      </div>
      {row2.length > 0 && (
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max gap-5 px-4 animate-marquee-reverse hover:[animation-play-state:paused]">
            {row2.map((item, i) => <Card key={`r2-${i}`} item={item} keyStr={`r2-${i}`} />)}
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState("Photos");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentBrochurePage, setCurrentBrochurePage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const heroImages = [
    "/src/assets/green_glades/estate_entrance_gate.webp",
    "/src/assets/green_glades/luxury_villa_night_view.webp",
    "/src/assets/green_glades/modern_villa_exterior_day.webp"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 10000);

    const loaderTimer = setTimeout(() => {
        setIsLoading(false);
    }, 2500);

    return () => {
        clearInterval(timer);
        clearTimeout(loaderTimer);
    };
  }, [heroImages.length]);

  const handleBrochureNext = () => {
    setCurrentBrochurePage(p => (p + 1) % brochurePages.length);
  };

  const handleBrochurePrev = () => {
    setCurrentBrochurePage(p => (p - 1 + brochurePages.length) % brochurePages.length);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#004d4a] transition-opacity duration-500 overflow-hidden">
        {/* Grainy/Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-black/10 blend-overlay" />
        
        <div className="relative flex flex-col items-center">
           <img src={greenGladesWhiteLogo} alt="Logo" className="h-56 md:h-72 object-contain mb-8 animate-pulse drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]" />
           <img src={natureTextLogo} alt="Nature Text" className="h-20 md:h-28 object-contain opacity-80 brightness-0 invert" />
        </div>
        
        {/* PROGRESS BAR AT THE ABSOLUTE BOTTOM (matching Riyasat Infra style) */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/5">
          <div className="h-full bg-gradient-to-r from-transparent via-gold to-gold animate-loader-progress shadow-[0_0_20px_#c8a44b]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-forest-deep font-body flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative h-[65vh] md:h-[85vh] w-full flex items-center justify-center overflow-hidden bg-forest-deep">
          <div className="absolute inset-0">
            {heroImages.map((img, idx) => (
              <div 
                key={idx} 
                className={`absolute inset-0 transition-all duration-[5000ms] ease-in-out ${idx === heroIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
              >
                <img src={img} alt="Estate Hero" loading="lazy" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/30 via-transparent to-forest-deep/40" />
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 flex gap-2 z-20">
            {heroImages.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} className={`h-1 rounded-full transition-all duration-500 ${i === heroIdx ? "bg-gold w-8" : "bg-white/30 w-2"}`} />
            ))}
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white w-full max-w-4xl mt-16 md:mt-0">
            <img src={greenGladesWhiteLogo} alt="Green Glades Logo" className="h-28 md:h-40 object-contain mb-4 drop-shadow-2xl" />
            <img src={natureTextLogo} alt="Nature Logo" className="h-10 md:h-14 object-contain mb-6 opacity-90 brightness-0 invert" />
            <h1 className="luxury-heading text-4xl md:text-6xl lg:text-7xl mb-4 leading-tight drop-shadow-xl text-white">Green Glades Estate</h1>
            <p className="text-gold italic font-heading text-lg md:text-2xl mb-10 drop-shadow-md">Nature Meets Luxury Living</p>
            <button 
              onClick={() => document.getElementById("project-overview")?.scrollIntoView({ behavior: "smooth" })} 
              className="Btn !h-10 !px-10 !text-[10px] mb-8"
            >
              Explore Project
            </button>
            <img 
              src={constructedDreamImg} 
              alt="Constructed with dreams" 
              className="h-8 md:h-16 w-auto max-w-[80%] object-contain opacity-90 drop-shadow-lg mt-2 mx-auto" 
            />
          </div>
        </section>

        {/* INFO STRIP */}
        <section className="py-16 md:py-20 bg-white relative z-20 shadow-xl border-y border-gold/10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
              <div className="flex flex-col items-center justify-center px-2 group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold/30 flex items-center justify-center mb-4 md:mb-6 shadow-xl bg-white relative transition-all duration-700 group-hover:scale-110 overflow-hidden">
                  <TrendingUp className="text-[#c8a44b] relative z-10 w-8 h-8" strokeWidth={1} />
                </div>
                <h3 className="text-xl md:text-2xl font-heading text-[#3D2B1F] font-bold mb-1">Under Dev</h3>
                <p className="text-forest-deep/60 text-[10px] uppercase tracking-[0.2em] font-bold">Status</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2 group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold/30 flex items-center justify-center mb-4 md:mb-6 shadow-xl bg-white relative transition-all duration-700 group-hover:scale-110 overflow-hidden">
                  <Home className="text-[#c8a44b] relative z-10 w-8 h-8" strokeWidth={1} />
                </div>
                <h3 className="text-xl md:text-2xl font-heading text-[#3D2B1F] font-bold mb-1">Farmhouse</h3>
                <p className="text-forest-deep/60 text-[10px] uppercase tracking-[0.2em] font-bold">Project Type</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2 group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold/30 flex items-center justify-center mb-4 md:mb-6 shadow-xl bg-white relative transition-all duration-700 group-hover:scale-110 overflow-hidden">
                  <MapPin className="text-[#c8a44b] relative z-10 w-8 h-8" strokeWidth={1} />
                </div>
                <h3 className="text-xl md:text-2xl font-heading text-[#3D2B1F] font-bold mb-1">Raisen Rd</h3>
                <p className="text-forest-deep/60 text-[10px] uppercase tracking-[0.2em] font-bold">Location</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2 group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gold/30 flex items-center justify-center mb-4 md:mb-6 shadow-xl bg-white relative transition-all duration-700 group-hover:scale-110 overflow-hidden">
                  <Maximize className="text-[#c8a44b] relative z-10 w-8 h-8" strokeWidth={1} />
                </div>
                <h3 className="text-lg md:text-xl font-heading text-[#3D2B1F] font-bold mb-1">6K / 11K</h3>
                <p className="text-forest-deep/60 text-[10px] uppercase tracking-[0.2em] font-bold">Sqft Plots</p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[#0c3e3e] py-4 text-center px-4 border-y border-gold/10">
          <p className="text-white text-sm md:text-base font-medium tracking-widest">
              <span className="text-gold font-bold">₹950/SQFT</span> (PLOT) &nbsp;|&nbsp; <span className="text-gold font-bold">₹1500/SQFT</span> (CONSTRUCTION)
          </p>
        </div>

        {/* ABOUT PROJECT */}
        <section id="project-overview" className="py-16 md:py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left items-center md:items-start">
              <span className="text-xs uppercase tracking-[0.4em] font-bold text-gold block">Project Overview</span>
              <h2 className="luxury-heading text-4xl md:text-5xl text-forest-deep leading-tight">Escape the City Chaos. <br/><span className="text-gold italic">Embrace Luxury.</span></h2>
              <p className="text-forest-deep/80 text-lg font-body">Green Glades Estate is an exclusive sanctuary designed for those who seek the perfect balance between nature's tranquility and uncompromising luxury.</p>
              <button onClick={() => navigate("/book-visit")} className="Btn w-fit px-10">Book A Site Visit</button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative border border-gold/20 p-2">
                <img src="/src/assets/green_glades/modern_villa_day_view.webp" alt="Modern Villa" loading="lazy" className="w-full h-full object-cover rounded-[1.5rem]" />
              </div>
            </div>
          </div>
        </section>

        {/* COMBINED MEDIA SECTION */}
        <section id="project-media" className="py-16 md:py-24 px-6 bg-white border-y border-gold/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="luxury-heading text-4xl md:text-5xl text-forest-deep mb-8">Estate <span className="text-gold italic">Gallery &amp; Media</span></h2>
              <div className="flex justify-center gap-3 flex-wrap">
                {["Estate Highlights", "Photos", "Site Plans", "Estate Portraits"].map((tab) => (
                  <button key={tab} onClick={() => { setActiveMediaTab(tab); setShowAllPhotos(false); }} className={`px-6 py-3 rounded-full uppercase tracking-[0.15em] text-xs font-bold transition-all border ${activeMediaTab === tab ? "bg-[#c8a44b] text-white border-[#c8a44b] shadow-lg" : "bg-transparent text-forest-deep border-forest-deep/20 hover:border-[#c8a44b]"}`}>{tab}</button>
                ))}
              </div>
            </div>

            <div className="w-full">
              {activeMediaTab === "Estate Highlights" && (
                <div className="bg-forest-deep rounded-2xl overflow-hidden py-8">
                  <MarqueeSlider items={galleryImages} />
                </div>
              )}

              {activeMediaTab === "Photos" && (
                <div className="flex flex-col items-center gap-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
                    {(showAllPhotos ? galleryImages : galleryImages.slice(0, 4)).map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer" className="relative aspect-video rounded-xl overflow-hidden bg-forest-deep/5 border border-forest-deep/10 group block shadow-md">
                        <img src={img} loading="lazy" alt={`Photo ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold uppercase tracking-widest bg-black/60 px-4 py-2 rounded-full">View Full</span>
                        </div>
                        </a>
                    ))}
                    </div>
                    <div className="flex gap-4">
                        {!showAllPhotos ? (
                            <button 
                                onClick={() => setShowAllPhotos(true)} 
                                className="flex items-center gap-2 px-8 py-3 rounded-full bg-gray-200 text-gray-700 font-bold uppercase tracking-widest text-xs hover:bg-gray-300 transition-all border border-gray-300 shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> View More
                            </button>
                        ) : (
                            <button 
                                onClick={() => { setShowAllPhotos(false); window.scrollTo({ top: document.getElementById('project-media')?.offsetTop || 0, behavior: 'smooth' }); }} 
                                className="flex items-center gap-2 px-8 py-3 rounded-full bg-gray-200 text-gray-700 font-bold uppercase tracking-widest text-xs hover:bg-gray-300 transition-all border border-gray-300 shadow-sm"
                            >
                                <span>-</span> View Less
                            </button>
                        )}
                    </div>
                </div>
              )}

              {activeMediaTab === "Site Plans" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {mapImages.map((img, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-forest-deep/5 border border-forest-deep/10 p-4">
                      <img src={img} loading="lazy" alt={`Plan ${i}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              )}

              {activeMediaTab === "Estate Portraits" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {posterImages.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-forest-deep/5 border border-forest-deep/10 p-2 md:p-4">
                      <img src={img} loading="lazy" alt={`Poster ${i}`} className="w-full h-auto object-contain rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FACILITIES SLIDER */}
        <section className="py-16 md:py-24 bg-forest-deep overflow-hidden border-t border-gold/10">
          <div className="text-center mb-6 px-6">
             <span className="text-xs uppercase tracking-[0.4em] font-bold text-gold/80 mb-4 block">Resort Access</span>
             <h2 className="luxury-heading text-4xl md:text-5xl text-white">Elevated <span className="gold-text italic">Lifestyle</span></h2>
          </div>
          <MarqueeSlider items={facilityImages} isFacilities={true} />
        </section>

        {/* INVESTMENT PLANS SECTION */}
        <section className="py-24 md:py-32 bg-white border-t border-gold/10 overflow-hidden relative">
          {/* Subtle Decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Left: Poster Image with decoration */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gold/10 rounded-[2.5rem] blur-2xl group-hover:bg-gold/20 transition-all duration-700" />
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-gold/30 bg-forest-deep p-2 md:p-4 flex items-center justify-center">
                    <img 
                      src="/src/assets/green_glades/posters/investment_plan_poster.webp" 
                      loading="lazy" 
                      alt="Investment Plan" 
                      className="w-full h-auto object-contain rounded-[2rem] transition-transform duration-700 group-hover:scale-[1.02]" 
                    />
                  </div>
                </div>
              </div>

              {/* Right: Detailed Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-8">
                <div>
                   <span className="text-gold font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">Wealth Creation</span>
                   <h2 className="luxury-heading text-4xl md:text-5xl lg:text-6xl text-forest-deep mb-6 leading-tight">Strategic <br/><span className="text-gold italic">Investment Plans.</span></h2>
                   <p className="text-forest-deep/70 text-lg leading-relaxed max-w-xl">
                     Discover high-yield opportunities at Green Glades Estate. Our structured plans are designed to offer maximum capital appreciation while providing consistent monthly returns.
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-6">
                  {[
                    { title: "Plan A: Premium", desc: "Investment of ₹1 Crore with ₹50,000/month rental returns.", icon: TrendingUp },
                    { title: "Plan B: Strategic", desc: "Investment of ₹50 Lakh with ₹25,000/month rental returns.", icon: Scale },
                    { title: "Registry Ready", desc: "100% legal clarity with immediate registry and possession.", icon: ShieldCheck },
                    { title: "Asset Protection", desc: "Professional management for long-term value preservation.", icon: Home }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-forest-deep/5 border border-forest-deep/10 hover:border-gold/30 transition-all group">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white shadow-sm flex items-center justify-center text-gold mb-3 md:mb-4 group-hover:bg-gold group-hover:text-white transition-all duration-500">
                        <item.icon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                      </div>
                      <h4 className="font-heading text-xs md:text-lg text-forest-deep mb-1 md:mb-2 leading-tight">{item.title}</h4>
                      <p className="text-forest-deep/60 text-[9px] md:text-sm leading-tight md:leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mt-6 justify-center lg:justify-start">
                   <button onClick={() => navigate("/book-visit")} className="Btn w-fit px-10">Request Full Details</button>
                   <button onClick={() => navigate("/contact")} className="inline-flex items-center justify-center px-10 py-3 rounded-full border border-gold/30 text-forest-deep text-[10px] uppercase tracking-widest font-bold hover:uiverse-silver-button hover:border-transparent transition-all w-fit">Consult Expert</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-[0.4em] font-bold text-gold mb-8 block">Recognized Excellence</span>
              
              <AwardsMedallions />
            </div>
          </div>
          <InvestmentExcellenceSection />
        </section>

        {/* BROCHURE VIEWER REFINED */}
        <section id="project-brochure" className="py-16 md:py-24 px-6 bg-forest-deep border-y border-gold/20 text-white">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.4em] font-bold text-gold mb-4 block text-center">Official Documentation</span>
            <h2 className="luxury-heading text-4xl md:text-5xl text-white mb-12 text-center">Project Brochure</h2>
            
            <div className="w-full md:max-w-[850px] relative mb-12 group">
               <div className="relative w-full aspect-[1.414/1] rounded-xl overflow-hidden border-2 border-gold/30 shadow-[0_0_40px_rgba(200,164,75,0.2)] bg-black/20">
                 <div 
                   className="flex h-full transition-transform duration-700 ease-in-out" 
                   style={{ transform: `translateX(-${currentBrochurePage * 100}%)` }}
                 >
                   {brochurePages.map((page, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => window.open(page, "_blank")}
                        className="w-full h-full flex-shrink-0 flex items-center justify-center bg-forest-deep relative group/page cursor-zoom-in"
                      >
                        <img 
                          src={page} 
                          alt={`Brochure Page ${idx + 1}`} 
                          loading="lazy"
                          className="w-full h-full object-contain transition-transform duration-700 group-hover/page:scale-[1.02]"
                        />
                        {/* VIEW OVERLAY */}
                        <div className="absolute inset-0 bg-black/0 group-hover/page:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover/page:opacity-100 transform translate-y-4 group-hover/page:translate-y-0 transition-all duration-300 bg-gold/90 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-sm border border-white/20">
                                View Full Image
                            </div>
                        </div>
                      </div>
                   ))}
                 </div>

                 {/* Side Navigation for Brochure */}
                 <button 
                    onClick={handleBrochurePrev} 
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-gold text-white p-2 md:p-3 rounded-full border border-gold/30 transition-all active:scale-90"
                 >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                 </button>
                 <button 
                    onClick={handleBrochureNext} 
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-gold text-white p-2 md:p-3 rounded-full border border-gold/30 transition-all active:scale-90"
                 >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                 </button>
               </div>

               {/* Page Indicator */}
               <div className="flex justify-center mt-6">
                  <div className="text-gold font-bold tracking-[0.3em] text-[10px] md:text-xs bg-white/5 py-2 px-6 rounded-full border border-gold/20">
                    PAGE {currentBrochurePage + 1} OF {brochurePages.length}
                  </div>
               </div>
            </div>

            <a 
              href="/src/assets/green_glades/broucher/Final Green Glade Brochure.pdf" 
              download 
              className="flex items-center justify-center gap-2 bg-[#c8a44b] text-white px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-[#a68435] transition-all shadow-lg active:scale-95 !w-auto mt-4"
            >
              <Download className="w-4 h-4" /> Download PDF
            </a>
          </div>
        </section>

        {/* MAP & LAYOUT SECTION */}
        <section className="py-16 md:py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="luxury-heading text-4xl md:text-5xl text-forest-deep">Layout <span className="text-gold italic">&amp;</span> Project <span className="text-gold italic">Plan</span></h2>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-16 px-2">
              {mapImages.map((img, i) => (
                <a key={i} href={img} target="_blank" rel="noreferrer" className="relative aspect-[3/4.5] md:aspect-[3/4] rounded-2xl overflow-hidden border border-gold/20 bg-white shadow-xl group block">
                  <img src={img} loading="lazy" alt={`Layout Plan ${i + 1}`} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.08]" />
                  <div className="absolute inset-0 bg-forest-deep/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-gold text-white px-6 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-lg">View Plan</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-forest-deep rounded-3xl p-8 md:p-16 mb-12 text-white text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-[0.4em] font-bold text-gold/90 block mb-4">Elite Planning</span>
                <h3 className="font-heading text-3xl md:text-5xl text-white mb-6 leading-tight">Masterfully Crafted <br/><span className="text-gold italic">For Your Future.</span></h3>
                <p className="text-white/80 font-body text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-10">
                    Our site layout is designed to maximize privacy while fostering community. With wide 60ft tree-lined avenues, perfectly oriented plots, and direct access to premium lifestyle amenities, every square inch of Green Glades Estate is a testament to architectural excellence.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-12">
                    {[
                    { val: "60 Ft", label: "Wide Roads", icon: Navigation },
                    { val: "Elite", label: "Neighborhood", icon: Home },
                    { val: "100%", label: "Green Energy", icon: CheckCircle },
                    { val: "Premium", label: "Site Layout", icon: Maximize }
                    ].map(({ val, label, icon: Icon }) => (
                    <div key={label} className="flex flex-col items-center group">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gold/40 flex items-center justify-center mb-4 relative transition-all duration-500 group-hover:scale-110">
                        <Icon className="text-gold w-8 h-8" strokeWidth={1.5} />
                        </div>
                        <span className="text-gold font-heading text-xl md:text-2xl font-bold">{val}</span>
                        <span className="text-white/60 font-body text-[10px] md:text-[11px] uppercase tracking-wider mt-1">{label}</span>
                    </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              <div className="w-full md:w-1/2 aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gold/20 bg-white relative">
                 <img src="/src/assets/green_glades/visit map/location_map_bhopal.webp" alt="Location Map Bhopal" className="w-full h-full object-contain" />
                 <a 
                    href="/src/assets/green_glades/visit map/location_map_bhopal.webp" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-gold/90 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">View Full Map</span>
                 </a>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center bg-forest-deep rounded-3xl p-8 md:p-16 text-white shadow-2xl">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 rounded-full border-2 border-gold/60 bg-gold/10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold/10"><MapPin className="w-8 h-8 text-gold" /></div>
                   <span className="font-heading text-gold text-xl font-semibold tracking-wide">Prime Connectivity</span>
                 </div>
                 <h3 className="luxury-heading text-4xl md:text-6xl mb-6 tracking-tight">Map <span className="gold-text italic">&amp;</span> <span className="gold-text">Location</span></h3>
                 <p className="text-white/80 leading-relaxed font-body text-lg mb-10">Strategically situated on Raisen Road, Bhopal — just minutes away from major landmarks yet tucked away in nature's lap.</p>
                  <a href="#contact" className="Btn !w-auto shadow-xl shadow-gold/20">Book Site Visit</a>
              </div>
            </div>
          </div>
        </section>

        <AmenitiesSection />
        <StackedFacilitiesSection isGrid={true} />

        <div className="bg-forest-deep py-24 px-6 flex flex-col items-center justify-center text-center">
          <h2 className="luxury-heading text-4xl md:text-5xl text-white mb-8">Ready to <span className="text-gold italic">Invest?</span></h2>
          <p className="text-white/80 font-body max-w-xl mx-auto mb-10 text-lg">Schedule a site visit today and witness the grandeur of Green Glades Estate firsthand.</p>
          <a href="tel:9111922665" className="Btn w-fit px-10"><Phone className="w-5 h-5 mr-3" /> Call 91119 22665</a>
        </div>
        <ContactSection phone="+91 91119 22665" sourcePage="project" />
      </main>
      <LuxuryFooter />
    </div>
  );
};

export default ProjectsPage;
