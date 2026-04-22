import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const normalizePhoneToE164 = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return "";

  const lastTenDigits = digits.slice(-10);
  return `+91${lastTenDigits}`;
};

const stackData = [
  {
    title: "Legacy",
    desc: "200K+ Square feet currently under meticulous development.",
    img: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0dccab47-16b0-4716-9e1a-b97f124e3031_1600w.webp"
  },
  {
    title: "Resort",
    desc: "Exclusive clubhouse with dining, gym, and infinity pool for unparalleled leisure.",
    img: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/952269bf-60f5-48dc-afce-13953bead1eb_1600w.webp"
  },
  {
    title: "Nature",
    desc: "Lush plantation landscaping and tranquil water bodies enveloping your sanctuary.",
    img: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/aa5ed4de-1a7e-4bb7-b0ea-1a4c511663df_1600w.webp"
  }
];

const ReviewSection = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please provide both rating and comments.");
      return;
    }
    // Assume user is not logged in for Phase 3 -> show mobile verify popup
    setShowPopup(true);
  };

  const submitFeedback = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedPhone = normalizePhoneToE164(mobileNumber);
    if (!normalizedPhone) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      let resolvedName = "";

      try {
        const { data: matchedContact } = await supabase
          .from("contacts")
          .select("name")
          .eq("phone", normalizedPhone)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        resolvedName = matchedContact?.name?.trim() || "";
      } catch {
        resolvedName = "";
      }

      const fallbackName = `Verified User ${normalizedPhone.slice(-4)}`;
      const { data, error } = await supabase.from('feedback').insert([{
        user_name: resolvedName || fallbackName,
        rating,
        comment: comment.trim(),
        phone_e164: normalizedPhone,
        status: "hidden",
      }]).select();
      
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
      
      console.log("Inserted Feedback:", data);
      toast.success("Thank you for your valuable feedback!");
      setRating(0);
      setComment("");
      setMobileNumber("");
      setShowPopup(false);
    } catch(err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to submit feedback.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-[10vh] pista-bg text-foreground relative overflow-hidden border-t border-[#c8a44b]/20">
      <div className="w-full max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Side: 4 Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stackData.map((item, idx) => (
              <div key={idx} className="relative aspect-[4/3] sm:aspect-square sm:h-[280px] w-full rounded-2xl overflow-hidden group border border-[#c8a44b]/10 hover:border-[#c8a44b]/30 transition-colors duration-500">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 group-hover:brightness-90 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 z-10">
                  <h3 className="text-[#c8a44b] font-heading font-bold text-2xl md:text-3xl mb-2 drop-shadow-md">{item.title}</h3>
                  <div className="w-8 h-px bg-white/40 mb-3" />
                  <p className="text-gray-300 text-xs sm:text-sm font-body font-light leading-relaxed opacity-90">{item.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Box 4: CTA */}
            <div className="relative aspect-[4/3] sm:aspect-square sm:h-[280px] w-full rounded-2xl border border-[#c8a44b]/40 flex flex-col items-center justify-center p-8 text-center group overflow-hidden transition-all duration-700 hover:border-[#c8a44b]/80 hover:shadow-[0_0_30px_rgba(200,164,75,0.3)]">
              {/* Background Image */}
              <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/0dccab47-16b0-4716-9e1a-b97f124e3031_1600w.webp" alt="Dream Place" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[1500ms]" />
              
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f0d]/90 via-[#0a0f0d]/80 to-[#1a201c]/90"></div>
              <div className="noise-texture absolute inset-0 opacity-20 mix-blend-overlay"></div>
              
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-[#c8a44b]/0 group-hover:bg-[#c8a44b]/20 transition-colors duration-700 pointer-events-none mix-blend-overlay" />
              
              <h3 className="text-white font-heading text-xl md:text-2xl lg:text-3xl mb-6 relative z-10 leading-snug drop-shadow-lg">
                Let's find that place you've been <span className="text-[#c8a44b] italic inline-block mt-2">dreaming about</span>
              </h3>
              <a href="#contact" className="relative z-10 px-8 py-3 bg-[#c8a44b]/10 backdrop-blur-sm border border-[#c8a44b]/60 text-[#F5E6CA] font-medium text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#c8a44b] hover:text-white transition-all duration-500 font-body shadow-[0_0_15px_rgba(200,164,75,0.2)] hover:shadow-[0_0_25px_rgba(200,164,75,0.5)] hover:scale-105">
                Book Site Visit
              </a>
            </div>
          </div>

          {/* Right Side: Feedback Form */}
          <div className="flex flex-col justify-center">
            <div className="mb-8 lg:mb-12">
              <div className="text-xs uppercase tracking-[0.2em] mb-4 text-[#c8a44b] font-body font-bold">Share Your Experience</div>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-forest-deep font-bold">
                Give us your <span className="text-[#c8a44b] italic font-medium">feedback</span>
              </h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md border border-[#c8a44b]/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden group hover:border-[#c8a44b]/60 transition-colors duration-500">
              {/* Background Image */}
              <img 
                src="/src/assets/luxury-villa-poolside-deck.webp" 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-[0.25] pointer-events-none group-hover:scale-105 transition-transform duration-700" 
              />
              {/* Golden accent glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#c8a44b]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[#c8a44b]/20 transition-colors duration-500"></div>
              
              <form className="relative z-10 flex flex-col gap-8" onSubmit={handlePreSubmit}>
                
                <div className="flex flex-col gap-3">
                  <label className="text-sm text-forest-deep/80 font-body uppercase tracking-wider font-bold">Rate your experience</label>
                  <div className="rating flex flex-row-reverse justify-end gap-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <React.Fragment key={star}>
                        <input 
                          type="radio" 
                          id={`star${star}`} 
                          name="rating" 
                          value={star} 
                          checked={rating === star}
                          onChange={() => setRating(star)}
                        />
                        <label htmlFor={`star${star}`}></label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label htmlFor="comment" className="text-sm text-forest-deep/80 font-body uppercase tracking-wider font-bold">Your Comments</label>
                  <textarea 
                    id="comment" 
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-white/80 border border-[#c8a44b]/20 rounded-xl p-4 text-forest-deep focus:border-[#c8a44b] focus:ring-1 focus:ring-[#c8a44b] outline-none transition-all resize-none font-body shadow-inner placeholder:text-gray-400 font-medium"
                    placeholder="Tell us what you think..."
                  ></textarea>
                </div>

                <button disabled={isSubmitting} className="Btn mt-2 w-full sm:w-auto self-start uppercase tracking-[0.2em] font-body disabled:opacity-60" type="submit">
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Verification Popup */}
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent className="sm:max-w-md border-gold/30 bg-background/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-forest-deep font-heading text-2xl">Verify to Comment</DialogTitle>
              <DialogDescription className="font-body text-muted-foreground">
                Please enter your registered mobile number to verify you are a genuine client before submitting feedback.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="mobile" className="text-xs uppercase tracking-wider font-bold text-forest-deep">Mobile Number</label>
                <input
                  id="mobile"
                  type="tel"
                  placeholder="+91"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gold/30 bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 font-body text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <button 
                onClick={submitFeedback}
                disabled={isSubmitting}
                className="luxury-btn-solid w-full my-2 disabled:opacity-50"
              >
                {isSubmitting ? "Verifying & Submitting..." : "Verify & Submit Feedback"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
      <style>{`
        /* From Uiverse.io by ForzDz */ 
        .rating {
          display: inline-block;
          opacity: 1;
        }

        .rating input {
          display: none;
          opacity: 1;
        }

        .rating label {
          float: right;
          cursor: pointer;
          color: #FFD700; /* Star color set to yellow-golden */
          opacity: 0.3; /* Default semi-transparent for unselected */
          transition: color 0.3s, transform 0.3s, opacity 0.3s;
        }

        .rating label:before {
          content: '\\2605';
          font-size: 40px;
        }

        .rating input:checked ~ label,
        .rating label:hover,
        .rating label:hover ~ label {
          color: #FFD700;
          opacity: 1; /* Full brightness on select/hover */
          transform: scale(1.15);
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
          animation: bounce 0.5s ease-in-out alternate;
        }

        @keyframes bounce {
          to {
            transform: scale(1.25);
          }
        }

        /* Golden Gradient Button */
        .Btn {
          min-width: 200px;
          height: 48px; /* Slightly taller for better touch target */
          border: none;
          border-radius: 40px;
          background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.8rem;
          color: rgb(121, 103, 3);
          font-weight: 700;
          cursor: pointer;
          position: relative;
          z-index: 2;
          transition-duration: 3s;
          box-shadow: 5px 5px 15px rgba(191, 149, 63, 0.2);
          background-size: 200% 200%;
        }

        .Btn:hover {
          transform: scale(0.98);
          transition-duration: 0.5s;
          animation: btn-gradient 3s ease infinite;
          background-position: right;
          box-shadow: 5px 5px 20px rgba(191, 149, 63, 0.4);
        }

        @keyframes btn-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default ReviewSection;
