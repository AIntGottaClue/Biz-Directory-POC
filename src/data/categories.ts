// =============================================================
//  CATEGORIES — edit this file to add / remove categories
//  Each category needs: slug, name, icon (lucide-react name), blurb
//  The slug must also be added to the CategorySlug union below.
// =============================================================

export type CategorySlug =
  | "med-spa"
  | "dentist"
  | "restaurants"
  | "electricians"
  | "roofers"
  | "plumbers"
  | "mechanics"
  | "tattoo-parlors"
  | "hvac"
  | "landscaping"
  | "pet-services"
  | "fitness-gyms"
  | "hair-beauty"
  | "real-estate"
  | "legal-services"
  | "coffee-shops"
  | "auto-detailing"
  | "childcare"
  | "photography"
  | "event-venues";

export interface Category {
  slug: CategorySlug;
  name: string;
  icon: string; // lucide icon name
  blurb: string;
  image?: string; // optional category image URL
}

export const categories: Category[] = [
  {
    slug: "med-spa",
    name: "Med Spa",
    icon: "Sparkles",
    blurb: "Aesthetics, skin & wellness",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/08732e51-abb6-4371-8c29-8402d0e47832.png",
  },
  {
    slug: "dentist",
    name: "Dentist",
    icon: "Smile",
    blurb: "Family & cosmetic dentistry",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/1426cdea-122d-43be-b5ad-45215e98c999.png",
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    icon: "UtensilsCrossed",
    blurb: "Local dining & takeout",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/63fa2909-b8b3-42fb-a374-275f7f98dfe1.png",
  },
  {
    slug: "electricians",
    name: "Electricians",
    icon: "Zap",
    blurb: "Wiring, panels & repairs",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/837101d6-9b25-445d-8b39-afac479fdf25.png",
  },
  {
    slug: "roofers",
    name: "Roofers",
    icon: "Home",
    blurb: "Roof repair & replacement",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/2a7d51a6-2c8a-42a2-ba85-464e8f866fa6.png",
  },
  {
    slug: "plumbers",
    name: "Plumbers",
    icon: "Wrench",
    blurb: "Leaks, drains & installs",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/5d4e25a7-bf9e-4082-ad40-ea3230ccc113.png",
  },
  {
    slug: "mechanics",
    name: "Mechanics",
    icon: "Car",
    blurb: "Auto repair & maintenance",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/c89f37bf-5fcc-4de6-abec-bce685c10605.png",
  },
  {
    slug: "tattoo-parlors",
    name: "Tattoo Parlors",
    icon: "PenTool",
    blurb: "Custom ink & piercing",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/61f1e8ba-f183-4bdb-bde9-5536cb3e4981.png",
  },
  {
    slug: "hvac",
    name: "HVAC",
    icon: "Wind",
    blurb: "Heating & air conditioning",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/8c34538d-5d9d-474e-ad30-06eb47a135a8.png",
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    icon: "Trees",
    blurb: "Lawn care & outdoor design",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/0c217fc3-2111-49fe-aa70-135d81dc7a3e.png",
  },
  {
    slug: "pet-services",
    name: "Pet Services",
    icon: "PawPrint",
    blurb: "Grooming, boarding & vet care",
  },
  {
    slug: "fitness-gyms",
    name: "Fitness & Gyms",
    icon: "Dumbbell",
    blurb: "Gyms, yoga & personal training",
  },
  {
    slug: "hair-beauty",
    name: "Hair & Beauty",
    icon: "Scissors",
    blurb: "Salons, barbers & styling",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: "Building2",
    blurb: "Agents, brokers & property management",
  },
  {
    slug: "legal-services",
    name: "Legal Services",
    icon: "Scale",
    blurb: "Attorneys & legal counsel",
  },
  {
    slug: "coffee-shops",
    name: "Coffee Shops",
    icon: "Coffee",
    blurb: "Local cafes & roasters",
  },
  {
    slug: "auto-detailing",
    name: "Auto Detailing",
    icon: "CarFront",
    blurb: "Detailing, wraps & ceramic coating",
  },
  {
    slug: "childcare",
    name: "Childcare",
    icon: "Baby",
    blurb: "Daycare, preschool & after-school",
  },
  {
    slug: "event-venues",
    name: "Event Venues",
    icon: "PartyPopper",
    blurb: "Weddings, parties & corporate events",
  },
];

export const getCategory = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug);
