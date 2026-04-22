import { useEffect } from "react";
import { MapPin, Clock, Car, TreePine } from "lucide-react";

const highlights = [
  { icon: MapPin, title: "Near Bhopal", desc: "Approx. 30 minutes from core city zones" },
  { icon: Car, title: "NH Access", desc: "Direct approach through arterial corridors" },
  { icon: Clock, title: "Airport Reach", desc: "Around 45 minutes to Raja Bhoj Airport" },
  { icon: TreePine, title: "Natural Belt", desc: "Green surroundings and low-density setting" },
];

const LocationSection = () => {
  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".location-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: { trigger: ".location-heading", start: "top 85%", scrub: 1 },
        }
      );
    };

    loadGSAP();
  }, []);

  return (
    <section id="location" className="section-padding pista-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="luxury-heading location-heading text-4xl md:text-6xl mb-8 font-bold">
          Location & <span className="gold-text italic">Master Layout</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="map-embed-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d5582.623740181556!2d77.44971907531861!3d23.18383897906106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDExJzAxLjgiTiA3N8KwMjcnMDguMyJF!5e1!3m2!1sen!2sin!4v1772972717195!5m2!1sen!2sin"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="map-embed-frame"
              referrerPolicy="no-referrer-when-downgrade"
              title="Riyasat Estate location map"
            />
          </div>

          <div>
            <h3 className="font-heading text-2xl md:text-3xl mb-6 text-foreground">Green Glades Estate, Bhopal</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">
              Positioned in Bhopal's emerging green corridor, the estate balances strong connectivity with the
              privacy and calm expected from luxury estate living.
            </p>
            <div className="gold-divider mb-8" />
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item) => (
                <div key={item.title} className="luxury-card p-5 flex items-start gap-3">
                  <div className="icon-gold-ring w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-pista/60">
                    <item.icon className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground">{item.title}</p>
                    <p className="text-muted-foreground text-xs font-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;

