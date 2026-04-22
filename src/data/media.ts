import bannerHero from "@/assets/banner1.webp";
import panoramicHillsideEstatePool from "@/assets/panoramic-hillside-estate-pool.webp";
import clubhouseSunset from "@/assets/estate-clubhouse-sunset.webp";
import eveningDiningGarden from "@/assets/estate-evening-dining-garden.webp";
import masterplanAerial from "@/assets/estate-masterplan-aerial.webp";
import sportsCourtPatio from "@/assets/estate-sports-court-patio.webp";
import formalLawnFountain from "@/assets/formal-estate-lawn-fountain.webp";
import gatedEntrance from "@/assets/grand-gated-estate-entrance.webp";
import modernDriveway from "@/assets/grand-modern-estate-driveway.webp";
import poolGarden from "@/assets/luxury-estate-pool-garden.webp";
import poolGardenEvening from "@/assets/luxury-estate-pool-garden-evening.webp";
import villaExteriorPool from "@/assets/luxury-villa-exterior-pool.webp";
import villaGardenWalkway from "@/assets/luxury-villa-garden-walkway.webp";
import villaPoolsideDeck from "@/assets/luxury-villa-poolside-deck.webp";
import manicuredGarden from "@/assets/manicured-estate-garden.webp";
import glassFacade from "@/assets/modern-farmhouse-glass-facade.webp";
import fitnessCenter from "@/assets/premium-fitness-center.webp";
import cyclingTrack from "@/assets/red-cycling-track-park.webp";
import sunriseManor from "@/assets/sunrise-estate-manor.webp";
import stoneVillaEvening from "@/assets/stone-villa-evening-view.webp";
import courtyardGarden from "@/assets/tropical-courtyard-garden.webp";
import courtyardLiving from "@/assets/tropical-courtyard-living.webp";
import retreatLawn from "@/assets/tropical-retreat-lawn.webp";
import contemporaryLawn from "@/assets/contemporary-estate-lawn.webp";
import countryCurvedLawn from "@/assets/country-estate-curved-lawn.webp";
import tropicalPoolResort from "@/assets/tropical-villa-pool-resort.webp";
import tuscanVillaPool from "@/assets/tuscan-villa-infinity-pool.webp";
import zenCourtyard from "@/assets/zen-courtyard-water-garden.webp";
import landscapeTeam from "@/assets/estate-landscape-garden-team.webp";
import swimmingPool from "@/assets/facalities/swimming-pool.webp";
import familyRetreat from "@/assets/facalities/family-retreat.webp";
import tennisCourt from "@/assets/facalities/tennis-court.webp";
import meditationGarden from "@/assets/facalities/meditation-garden.webp";
import restaurantDining from "@/assets/facalities/restaurant-dining.webp";
import birthdayParty from "@/assets/facalities/birthday_party.webp";
import peaceGarden from "@/assets/facalities/peace_garden.webp";
import sundayHoliday from "@/assets/facalities/sunday_holiday.webp";

export type EstateImage = {
  src: string;
  alt: string;
  ratio: number;
  title: string;
  meta: string;
};

export type FacilityCard = {
  title: string;
  copy: string;
  src: string;
  alt: string;
};

export const heroBannerImage = bannerHero;

const hillsideInfinityPoolUrl = panoramicHillsideEstatePool;
const panoramicPoolUrl = panoramicHillsideEstatePool;
const sunsetPoolHouseUrl = villaPoolsideDeck;
const roseGardenEstateUrl = formalLawnFountain;
const timberStoneDetailUrl = stoneVillaEvening;
const tuscanInfinityPoolUrl = tuscanVillaPool;
const countryCurvedLawnUrl = countryCurvedLawn;
const tropicalPoolResortUrl = tropicalPoolResort;

export const externalEstateImages: EstateImage[] = [];

export const galleryImages: EstateImage[] = [
  { src: glassFacade, alt: "The Grove luxury villa", ratio: 0.67, title: "The Grove", meta: "10,000 Sqft | 4 Bed | Nature View" },
  { src: villaPoolsideDeck, alt: "Meadow Villa lakeside", ratio: 0.67, title: "Meadow Villa", meta: "6,000 Sqft | Lake Access | Investment" },
  { src: clubhouseSunset, alt: "Resort Clubhouse amenities", ratio: 1, title: "Resort Clubhouse", meta: "Amenities | Pool | Lounge" },
  { src: masterplanAerial, alt: "Riyasat Master Avenue layout", ratio: 1.78, title: "Master Avenue", meta: "Location & Master Layout" },
  { src: courtyardLiving, alt: "Tropical courtyard living area", ratio: 0.67, title: "Courtyard Living", meta: "Open Atrium" },
  { src: contemporaryLawn, alt: "Contemporary estate lawn edge", ratio: 0.67, title: "Lawn Edge", meta: "Landscape Design" },
  { src: villaGardenWalkway, alt: "Luxury villa with garden walkway", ratio: 0.56, title: "Garden Walkway", meta: "Calm Circulation" },
  { src: stoneVillaEvening, alt: "Stone villa lit at dusk", ratio: 0.67, title: "Twilight Residence", meta: "Evening Mood" },
  { src: modernDriveway, alt: "Modern estate driveway approach", ratio: 1.15, title: "Arrival Court", meta: "Grand Entry" },
  { src: courtyardGarden, alt: "Lush tropical courtyard", ratio: 0.88, title: "Lush Garden", meta: "Tropical Pocket" },
  { src: poolGarden, alt: "Luxury estate pool and garden", ratio: 0.56, title: "Pool Garden", meta: "Weekend Retreat" },
  { src: fitnessCenter, alt: "Premium fitness center interior", ratio: 0.8, title: "Fitness Lounge", meta: "Wellness Club" },
  { src: manicuredGarden, alt: "Manicured estate garden landscape", ratio: 0.74, title: "Manicured Greens", meta: "Curated Lawns" },
  { src: sportsCourtPatio, alt: "Sports court near estate patio", ratio: 0.67, title: "Active Court", meta: "Family Recreation" },
  { src: cyclingTrack, alt: "Cycling track in landscaped estate", ratio: 1.5, title: "Cycling Loop", meta: "Daily Fitness" },
  { src: retreatLawn, alt: "Tropical retreat lawn around villas", ratio: 0.56, title: "Retreat Lawn", meta: "Private Greens" },
  { src: formalLawnFountain, alt: "Formal lawn with central fountain", ratio: 1, title: "Formal Lawn", meta: "Classic Planning" },
  { src: poolGardenEvening, alt: "Pool garden by evening lighting", ratio: 0.7, title: "Evening Poolscape", meta: "Warm Lighting" },
  { src: gatedEntrance, alt: "Grand gated estate entrance", ratio: 1.78, title: "Estate Gateway", meta: "Secure Entry" },
  { src: hillsideInfinityPoolUrl, alt: "Hillside infinity pool", ratio: 1.33, title: "Hillside Pool", meta: "Sunset View" },
  { src: panoramicPoolUrl, alt: "Panoramic estate pool in hills", ratio: 1.5, title: "Panoramic Deck", meta: "Valley Facing" },
  { src: sunriseManor, alt: "Sunrise over estate manor", ratio: 1.78, title: "Sunrise Manor", meta: "Signature Home" },
  { src: sunsetPoolHouseUrl, alt: "Sunset pool house", ratio: 1.45, title: "Pool House", meta: "Golden Hour" },
  { src: roseGardenEstateUrl, alt: "Terraced rose garden estate", ratio: 1.5, title: "Rose Terraces", meta: "Garden Court" },
  { src: timberStoneDetailUrl, alt: "Timber and stone estate detail", ratio: 1.45, title: "Material Detail", meta: "Craft Finish" },
  { src: tuscanInfinityPoolUrl, alt: "Tuscan style villa and pool", ratio: 1.4, title: "Tuscan View", meta: "Resort Residence" },
  { src: countryCurvedLawnUrl, alt: "Curved lawn around countryside home", ratio: 1.5, title: "Curved Lawn", meta: "Soft Geometry" },
  { src: eveningDiningGarden, alt: "Estate dining garden setup", ratio: 1, title: "Garden Dining", meta: "Celebration Lawn" },
  { src: villaExteriorPool, alt: "Luxury villa exterior with pool", ratio: 1, title: "Villa Exterior", meta: "Premium Finish" }
];

export const sliderImages: EstateImage[] = [
  { src: glassFacade, alt: "The Grove", ratio: 1.78, title: "The Grove", meta: "10,000 Sqft | 4 Bed" },
  { src: villaPoolsideDeck, alt: "Meadow Villa", ratio: 1.78, title: "Meadow Villa", meta: "6,000 Sqft | Lake Access" },
  { src: clubhouseSunset, alt: "Resort Clubhouse", ratio: 1, title: "Resort Clubhouse", meta: "Pool & Lounge" },
  { src: masterplanAerial, alt: "Master Avenue", ratio: 1.78, title: "Master Avenue", meta: "Layout & Vision" },
  { src: tropicalPoolResortUrl, alt: "Resort pool deck", ratio: 1.5, title: "Resort Deck", meta: "Weekend Escape" },
  { src: hillsideInfinityPoolUrl, alt: "Hillside infinity pool", ratio: 1.33, title: "Hillside Vista", meta: "Nature Facing" },
];

export const facilityCards: FacilityCard[] = [
  {
    title: "Infinity Pool Deck",
    copy: "Temperature-balanced pool with open valley views for sunrise and sunset sessions.",
    src: poolGarden,
    alt: "Infinity pool and deck seating",
  },
  {
    title: "Gated Security",
    copy: "24/7 guarded entrance with high-definition surveillance for your family's ultimate safety.",
    src: gatedEntrance,
    alt: "Gated estate security entrance",
  },
  {
    title: "Modern Lifestyle",
    copy: "Experience elevated living with smart infrastructure, high-speed connectivity, and elite social circles.",
    src: modernDriveway,
    alt: "Modern lifestyle driveway",
  },
  {
    title: "Sustainable Living",
    copy: "Eco-conscious design featuring rainwater harvesting, solar-powered streets, and organic green belts.",
    src: zenCourtyard,
    alt: "Sustainable green living",
  },
  {
    title: "Private Clubhouse",
    copy: "A calm social core with lounge seating, indoor recreation, and weekend dining.",
    src: clubhouseSunset,
    alt: "Clubhouse sunset exterior",
  },
  {
    title: "Curated Lawn Courts",
    copy: "Large event lawns designed for family functions, gatherings, and open-air evenings.",
    src: formalLawnFountain,
    alt: "Curated lawns and terraced gardens",
  },
  {
    title: "Cycling Green Loop",
    copy: "Dedicated cycling paths and morning walking tracks through landscaped green belts.",
    src: cyclingTrack,
    alt: "Cycling and walking track",
  },
  {
    title: "Family Retreat Zones",
    copy: "Quiet corners with shaded seating for reading, conversations, and weekend breaks.",
    src: retreatLawn,
    alt: "Family retreat lawn zone",
  },
  {
    title: "Wellness Studio",
    copy: "Modern fitness and wellness areas integrated with fresh light and estate views.",
    src: fitnessCenter,
    alt: "Modern fitness center",
  },
];

export const storytellingCards = [
  {
    num: "I.",
    label: "Discover",
    title: "Start with the land that already feels like home",
    copy:
      "Walk the estate at first light, explore the approach roads, and pick the part of the landscape that fits your family rhythm.",
    image: gatedEntrance,
    alt: "Grand estate arrival gate",
  },
  {
    num: "II.",
    label: "Design",
    title: "Shape your estate vision around daily living",
    copy:
      "Position your home for breeze, sunlight, and long open views while keeping room for gardens, pool decks, and weekend gatherings. Extend your vision to embrace the tranquility of lush, private acres designed just for you.",
    image: formalLawnFountain,
    alt: "Formal lawn with fountain",
  },
  {
    num: "III.",
    label: "Belong",
    title: "Settle into a lifestyle built for generations",
    copy:
      "From clubhouse evenings to cycling mornings and lawn celebrations, the estate supports both quiet retreats and shared family milestones.",
    image: countryCurvedLawnUrl,
    alt: "Curved lawns and estate residence",
  },
];
