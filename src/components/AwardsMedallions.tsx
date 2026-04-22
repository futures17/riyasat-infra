import React from "react";
import bhaskarAward from "@/assets/bhaskar_expo_award.webp";
import crownAward from "@/assets/gold_award_crown.webp";

const AwardsMedallions = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-1 sm:gap-4 md:gap-16 max-w-5xl mx-auto px-2">
      {/* Award 1 */}
      <div className="flex flex-col items-center group">
        <div className="relative w-28 h-14 sm:w-40 sm:h-20 md:w-48 md:h-24 border border-gold/30 rounded-full bg-white shadow-lg flex items-center justify-center p-1 md:p-4 transition-all duration-500 group-hover:-translate-y-2">
          <img src={crownAward} alt="Gold Award" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
          <div className="flex flex-col items-center ml-2">
            <span className="text-[6px] sm:text-[9px] md:text-[11px] font-bold text-[#c8a44b] uppercase tracking-tighter">Times</span>
            <span className="text-[8px] sm:text-[11px] md:text-sm font-bold text-forest-deep uppercase tracking-widest leading-none">Icon</span>
          </div>
        </div>
        <p className="mt-3 text-forest-deep/60 font-bold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest text-center whitespace-nowrap">Premium Excellence</p>
      </div>

      {/* Award 2 (Centerpiece) */}
      <div className="flex flex-col items-center group scale-105 sm:scale-110">
        <div className="relative w-32 h-16 sm:w-48 sm:h-24 md:w-64 md:h-32 border-2 border-gold/50 rounded-full bg-white shadow-2xl flex items-center justify-center p-0.5 md:p-2 transition-all duration-700 group-hover:-translate-y-4">
          <img src={bhaskarAward} alt="Bhaskar Award" className="w-14 h-14 md:w-20 md:h-20 object-contain rounded-full" />
          <div className="flex flex-col items-center ml-3">
            <span className="text-[7px] md:text-[11px] font-bold text-[#c8a44b] uppercase tracking-tighter">Bhaskar</span>
            <span className="text-[9px] md:text-base font-bold text-forest-deep uppercase tracking-widest leading-none">Expo</span>
          </div>
        </div>
        <p className="mt-4 text-gold font-bold text-[9px] sm:text-xs md:text-sm uppercase tracking-[0.1em] sm:tracking-[0.2em] text-center whitespace-nowrap">Best Luxury Project</p>
      </div>

      {/* Award 3 */}
      <div className="flex flex-col items-center group">
        <div className="relative w-28 h-14 sm:w-40 sm:h-20 md:w-48 md:h-24 border border-gold/30 rounded-full bg-white shadow-lg flex items-center justify-center p-1 md:p-4 transition-all duration-500 group-hover:-translate-y-2">
          <img src={crownAward} alt="Gold Award" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
          <div className="flex flex-col items-center ml-2">
            <span className="text-[6px] sm:text-[9px] md:text-[11px] font-bold text-[#c8a44b] uppercase tracking-tighter">Legacy</span>
            <span className="text-[8px] sm:text-[11px] md:text-sm font-bold text-forest-deep uppercase tracking-widest leading-none">Global</span>
          </div>
        </div>
        <p className="mt-3 text-forest-deep/60 font-bold text-[8px] sm:text-[10px] md:text-xs uppercase tracking-widest text-center whitespace-nowrap">Industry Icon</p>
      </div>
    </div>
  );
};

export default AwardsMedallions;
