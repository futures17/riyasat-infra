import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase, type Feedback } from "@/lib/supabase";

type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

const testimonials: TestimonialItem[] = [
  {
    name: "Rajesh Sharma",
    role: "Business Owner, Bhopal",
    quote: "Green Glades is not just a property investment — it's an investment in our family's future. The vision of this estate is unparalleled.",
    rating: 5,
  },
  {
    name: "Priya Malhotra",
    role: "Senior Executive, Indore",
    quote: "The moment I visited the site, I knew this was where I wanted to build our weekend retreat. The natural beauty is breathtaking.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Retired IAS Officer",
    quote: "After decades of service, I wanted a peaceful sanctuary. Green Glades offers exactly that — luxury, privacy, and nature in perfect harmony.",
    rating: 5,
  },
  {
    name: "Aditi Rao",
    role: "Architectural Designer",
    quote: "As someone who understands spaces, Riyasat Infra has achieved a masterstroke here. The balance of built environment and open landscape is flawless.",
    rating: 5,
  },
  {
    name: "Sameer Desai",
    role: "Tech Entrepreneur",
    quote: "I was looking for a breakaway from city chaos. The security, the amenities, and the sheer scale of Green Glades sold me instantly.",
    rating: 5,
  },
  {
    name: "Dr. Ananya Gupta",
    role: "Chief Surgeon",
    quote: "The wellness facilities and the layout of the cycling tracks are exactly what my family needed to adopt a healthier lifestyle.",
    rating: 5,
  },
  {
    name: "Karan Johar",
    role: "Real Estate Investor",
    quote: "In my 20 years of investing across Central India, this is by far the most premium plotting project I have witnessed. Brilliant execution.",
    rating: 5,
  },
  {
    name: "Meera Rajput",
    role: "Boutique Owner",
    quote: "The clubhouse and evening dining gardens feel like a 5-star resort. Hosting our weekend get-togethers here is an absolute joy.",
    rating: 5,
  },
  {
    name: "Siddharth Jain",
    role: "Corporate Lawyer",
    quote: "From the grand entrance to the pristine avenues, every detail screams luxury. It’s an address that commands immediate respect.",
    rating: 5,
  },
  {
    name: "Rohan Kapoor",
    role: "NRI Investor",
    quote: "Managing my plot from abroad has been seamless with the Riyasat team. The estate exceeds international luxury standards effortlessly.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [showLiveReviews, setShowLiveReviews] = useState(false);
  const [liveReviews, setLiveReviews] = useState<TestimonialItem[]>([]);

  const visibleItems = showLiveReviews && liveReviews.length > 0 ? liveReviews : testimonials;

  const next = () => setActive((p) => (p + 1) % visibleItems.length);
  const prev = () => setActive((p) => (p - 1 + visibleItems.length) % visibleItems.length);

  useEffect(() => {
    const fetchLiveReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .eq("status", "shown")
          .eq("is_deleted", false)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        const mappedReviews = ((data as Feedback[]) || []).map((review) => ({
          name: review.user_name,
          role: "Verified Review",
          quote: review.comment,
          rating: review.rating,
        }));

        setLiveReviews(mappedReviews);
      } catch (error) {
        console.error("Failed to fetch shown reviews", error);
      }
    };

    fetchLiveReviews();
  }, []);

  useEffect(() => {
    setActive(0);
  }, [showLiveReviews, liveReviews.length]);

  // Auto-scroll logic fixed with proper reset on manual interaction
  useEffect(() => {
    const next = () => setActive((p) => (p + 1) % visibleItems.length);
    const interval = setInterval(next, 5000); // 5 sec slow scroll
    return () => clearInterval(interval);
  }, [active, visibleItems.length]); // Reset interval when slide changes manually

  const t = visibleItems[active];

  return (
    <section className="section-padding bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="luxury-heading text-4xl md:text-5xl mb-16">
          What Our <span className="gold-text italic">Clients Say</span>
        </h2>

        {liveReviews.length > 0 && (
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => setShowLiveReviews((current) => !current)}
              className="px-6 py-3 rounded-full border border-gold/30 text-forest-deep text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-white transition-all"
            >
              {showLiveReviews ? "Show Testimonials" : "Show Reviews"}
            </button>
          </div>
        )}

        <div className="relative">
          <div className="mb-0 relative h-[300px] md:h-[220px] overflow-hidden">
            {visibleItems.map((t, i) => (
              <div 
                key={i}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${i === active ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"}`}
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="font-heading text-2xl md:text-3xl text-foreground italic leading-relaxed mb-8 w-full px-4 text-center">
                  "{t.quote}"
                </blockquote>
                <div>
                  <p className="font-body font-semibold text-foreground">{t.name}</p>
                  <p className="text-muted-foreground text-sm font-body">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {visibleItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i === active ? "w-8 bg-gold" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default TestimonialsSection;
