// =============================================================
//  EVENTS — edit freely. Add or remove items as needed.
// =============================================================

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string[]; // array of paragraphs
  date: string; // ISO date (start)
  time: string; // start time
  endDate?: string; // optional ISO end date (for multi-day events)
  endTime?: string; // optional end time
  location: string;
  address: string;
  image: string;
  gallery?: string[]; // optional additional images
  category: string;
  relatedBusinessSlugs?: string[]; // Business listings linked to this event
  relatedBlogSlugs?: string[]; // Blog posts linked to this event
}

export const events: EventItem[] = [
  {
    id: "evt_q7r2s5m8",
    slug: "round-rock-farmers-market",
    title: "Round Rock Farmers Market",
    description:
      "Fresh produce, local crafts, live music, and food trucks every Saturday morning in downtown Round Rock.",
    content: [
      "The Round Rock Farmers Market is a beloved weekly tradition that brings together local farmers, artisans, and food vendors in the heart of downtown. Every Saturday morning, the plaza transforms into a vibrant marketplace filled with the colors and aromas of fresh, locally grown produce.",
      "Shoppers can browse stalls offering everything from heirloom tomatoes and farm-fresh eggs to homemade jams and artisanal breads. Many of the vendors are small family farms from the surrounding Williamson County area, so you're directly supporting local agriculture with every purchase.",
      "Live music from local performers adds to the festive atmosphere, and a rotating selection of food trucks means you can grab breakfast or lunch while you shop. The market also features a kids' activity area, making it a great family outing.",
      "Parking is free in the downtown area, and the market is wheelchair accessible. Well-behaved leashed dogs are welcome too. Bring your reusable bags and arrive early for the best selection — popular items like fresh berries and pasture-raised eggs tend to sell out fast.",
    ],
    date: "2026-08-11",
    endDate: "2026-08-11",
    time: "9:00 AM",
    endTime: "1:00 PM",
    location: "Downtown Round Rock Plaza",
    address: "1000 E Main St, Round Rock, TX 78664",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/e03a2a73-7cae-4f9a-8eb5-2918a2eeadfa.png",
    gallery: [
      "https://vibe.filesafe.space/1787129704745061268/assets/5ba91083-63ed-416e-9814-b0e24caa9ca3.png||Round Rock Farmers Market vendor stalls with fresh produce",
      "https://vibe.filesafe.space/1787129704745061268/assets/e03a2a73-7cae-4f9a-8eb5-2918a2eeadfa.png||Round Rock Farmers Market crowd shopping on a Saturday morning",
    ],
    category: "Community",
  },
  {
    id: "evt_t4m9k3n1",
    slug: "round-rock-night-live",
    title: "Round Rock Night Live — Music & Food Festival",
    description:
      "An evening of live local bands, craft beer, and food vendors at the Round Rock Amphitheater.",
    content: [
      "Round Rock Night Live returns for its biggest year yet, bringing an unforgettable evening of live music, craft beer, and incredible food to the Round Rock Amphitheater. This annual festival celebrates the best of the local music scene with a lineup of bands spanning rock, country, blues, and indie.",
      "This year's headliner is The Round Rock Ramblers, a hometown favorite that's been packing venues across Central Texas with their high-energy blend of country and southern rock. They're joined by three supporting acts, ensuring the music never stops from the moment gates open.",
      "The craft beer garden features pours from local breweries including Austin-area favorites and Round Rock's own craft scene. Food vendors will be serving up everything from brisket tacos and loaded fries to gourmet grilled cheese and fresh-squeezed lemonade.",
      "Tickets are $15 in advance or $20 at the gate, with kids under 12 admitted free. Lawn chairs and blankets are welcome, but outside food and drink are not permitted. The amphitheater offers ample parking, and a free shuttle runs from the Round Rock Sports Center every 15 minutes.",
    ],
    date: "2026-08-22",
    endDate: "2026-08-22",
    time: "6:00 PM",
    endTime: "11:00 PM",
    location: "Round Rock Amphitheater",
    address: "301 W Bagdad Ave, Round Rock, TX 78664",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/77c0bde4-514d-4fa6-b33d-e68a6b7176a7.png",
    gallery: [
      "https://vibe.filesafe.space/1787129704745061268/assets/1328096e-1f89-4965-a1b0-6caeac1f80e3.png||Round Rock Night Live concert stage with live band performing",
      "https://vibe.filesafe.space/1787129704745061268/assets/77c0bde4-514d-4fa6-b33d-e68a6b7176a7.png||Round Rock Night Live crowd enjoying music at the amphitheater",
    ],
    category: "Music",
  },
  {
    id: "evt_v8k2q6t5",
    slug: "small-business-expo-2026",
    title: "Round Rock Small Business Expo 2026",
    description:
      "Connect with dozens of local businesses, discover new services, and enjoy free workshops and networking.",
    content: [
      "The Round Rock Small Business Expo is the premier networking event for local entrepreneurs, small business owners, and residents alike. Now in its fifth year, the expo brings together over 80 local businesses under one roof at the Round Rock Sports Center.",
      "Attendees can browse vendor booths showcasing products and services from every category — from med spas and restaurants to plumbers, electricians, and tech startups. It's a one-stop shop to meet the people behind the businesses you see in our directory and discover new local services you didn't know existed.",
      "The expo also features a series of free workshops throughout the day. Topics include digital marketing on a small budget, navigating Texas business licenses, and a panel discussion with successful Round Rock entrepreneurs sharing their journeys. Seating is first-come, first-served.",
      "Admission is completely free, and the first 200 attendees receive a swag bag filled with goodies from participating vendors. Whether you're a business owner looking to connect, a job seeker exploring opportunities, or a resident who wants to support local, this is an event you won't want to miss.",
    ],
    date: "2026-09-12",
    endDate: "2026-09-12",
    time: "10:00 AM",
    endTime: "4:00 PM",
    location: "Round Rock Sports Center",
    address: "611 Windy Knoll Dr, Round Rock, TX 78681",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/3597de7f-cb9c-4b67-b298-cdc9380880ea.png",
    gallery: [
      "https://vibe.filesafe.space/1787129704745061268/assets/06824bee-7db1-4eba-ae4d-d399f0a71424.png||Round Rock Small Business Expo vendor booths at the Sports Center",
      "https://vibe.filesafe.space/1787129704745061268/assets/3597de7f-cb9c-4b67-b298-cdc9380880ea.png||Round Rock Small Business Expo networking and workshops in progress",
    ],
    category: "Business",
  },
  {
    id: "evt_w1m5n9r3",
    slug: "round-rock-car-show-2026",
    title: "Round Rock Classic Car Show 2026",
    description:
      "Showcase of classic cars, trucks, and motorcycles with food trucks, live music, and awards for best in show. Free admission for the whole family.",
    content: [
      "The Round Rock Classic Car Show returns for its 8th year, bringing together car enthusiasts from across Central Texas for a day of chrome, horsepower, and nostalgia. The event takes over the Round Rock Sports Center parking lot with over 150 vehicles on display, ranging from meticulously restored classics to custom builds and modern muscle.",
      "Registration is open to all vehicles — classics, trucks, motorcycles, and modified builds. Trophies are awarded in multiple categories including Best in Show, Best Paint, People's Choice, and Best Engine Bay. Pre-registration is $20 per vehicle, or $25 on the day of the event. Dash plaques go to the first 100 registrants.",
      "Food trucks will be on-site serving up BBQ, tacos, and burgers, and a live DJ spins classic rock and oldies throughout the day. There's also a kids' zone with face painting and games, making it a great family outing.",
      "Local auto shops including Round Rock Auto Repair will have booths set up to answer questions about maintenance and restoration. Whether you're a gearhead or just appreciate beautiful machines, this free event is a can't-miss Saturday in Round Rock.",
    ],
    date: "2026-09-20",
    endDate: "2026-09-20",
    time: "10:00 AM",
    endTime: "4:00 PM",
    location: "Round Rock Sports Center",
    address: "611 Windy Knoll Dr, Round Rock, TX 78681",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/cef62a8e-2deb-4ac3-b528-04887b23dc5c.png",
    gallery: [
      "https://vibe.filesafe.space/1787129704745061268/assets/cef62a8e-2deb-4ac3-b528-04887b23dc5c.png||Classic cars on display at the Round Rock Classic Car Show",
      "https://vibe.filesafe.space/1787129704745061268/assets/3597de7f-cb9c-4b67-b298-cdc9380880ea.png||Car show attendees browsing restored vehicles and custom builds",
    ],
    category: "Community",
    relatedBusinessSlugs: ["round-rock-auto-repair"],
    relatedBlogSlugs: ["round-rock-auto-repair-trust"],
  },
  {
    id: "evt_x6t3k7m2",
    slug: "bbq-and-blues-festival-2026",
    title: "Round Rock BBQ & Blues Festival 2026",
    description:
      "A full day of slow-smoked BBQ from Round Rock's top pitmasters and live blues music, co-hosted by The Round Rock Diner and Smokehouse Round Rock.",
    content: [
      "The inaugural Round Rock BBQ & Blues Festival brings together two of the city's best BBQ joints — The Round Rock Diner and Smokehouse Round Rock — for a day of mouthwatering smoked meats and live blues music at Old Settlers Park. This family-friendly festival celebrates Central Texas barbecue culture with a lineup that pitmasters travel for.",
      "The Round Rock Diner will be serving up their famous hand-pressed burgers alongside a special BBQ brisket sandwich, while Smokehouse Round Rock brings their 14-hour post oak smoked brisket, jalapeño cheese sausage, and banana pudding. Together they're curating a collaborative menu available only at the festival.",
      "Live blues performances run all day, featuring local favorites The Cedar Branch Blues Band and Austin-based headliner The Delta Sons. Between sets, browse vendor booths from local artisans, grab a craft beer from the beer garden, and let the kids enjoy the dedicated play area with games and face painting.",
      "Tickets are $12 in advance or $15 at the gate, with kids under 10 admitted free. A portion of proceeds benefits the Round Rock Food Bank. Bring lawn chairs and blankets, leave coolers at home. Free parking is available at Old Settlers Park with a shuttle running from the Round Rock Sports Center.",
    ],
    date: "2026-10-04",
    endDate: "2026-10-05",
    time: "11:00 AM",
    endTime: "9:00 PM",
    location: "Old Settlers Park Pavilion",
    address: "3300 E Palm Valley Blvd, Round Rock, TX 78665",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/c70df296-3dc8-48a5-ad29-46e48d38d90f.png",
    gallery: [
      "https://vibe.filesafe.space/1787129704745061268/assets/c70df296-3dc8-48a5-ad29-46e48d38d90f.png||BBQ pitmasters smoking brisket at the Round Rock BBQ & Blues Festival",
      "https://vibe.filesafe.space/1787129704745061268/assets/28680a20-9c02-4a6c-a6ee-64c1b4e8d5a7.png||Festival attendees enjoying BBQ and live blues music at Old Settlers Park",
    ],
    category: "Food & Music",
    relatedBusinessSlugs: ["the-round-rock-diner", "salt-and-stone-kitchen"],
    relatedBlogSlugs: ["bbq-and-blues-festival-guide"],
  },
  {
    id: "evt_y9n4q1t8",
    slug: "round-rock-gives-back-2026",
    title: "Round Rock Gives Back 2026 — Charity Festival",
    description:
      "Five local businesses team up for a one-day charity festival benefiting the Round Rock ISD Education Foundation. Food, music, family fun, and community spirit — 100% of proceeds go to local schools.",
    content: [
      "Last spring, a Round Rock ISD teacher named Maria Gonzalez posted a photo that stopped our community in its tracks. Her third-grade classroom at Caldwell Heights Elementary had exactly four boxes of crayons, two working glue sticks, and a single pair of scissors — shared among 22 students. The post was simple: \"My kids deserve better. I'll make it work, but if anyone out there can help, we'd be forever grateful.\"",
      "That photo found its way to five local business owners who decided they couldn't just scroll past. Within a week, they were on a group call, hatching a plan to do more than write a check — they wanted to throw a party. A real, all-day, bring-the-whole-family festival where every dollar raised would go straight to the Round Rock ISD Education Foundation, which funds classroom grants, teacher supplies, and STEM programs across the district.",
      "The result is Round Rock Gives Back 2026 — a free-admission charity festival taking over the Old Settlers Park Pavilion on October 18. The five businesses splitting the hosting duties are The Round Rock Diner, Voltaic Electrical Services, Capitol City Roofing, Round Rock Plumbing Pros, and Iron Ink Tattoo Studio. Each one is contributing something different: food, logistics, staging, raffle prizes, and even live tattoos with proceeds donated.",
      "The Round Rock Diner is running the main food tent, serving their famous hand-pressed burgers, chicken-fried steak sliders, and fresh-baked pies — with every penny of food sales going to the foundation. Voltaic Electrical Services is powering the entire event with a mobile generator setup and handling all the lighting and sound wiring at no cost. Capitol City Roofing built and donated the main stage and shade structures. Round Rock Plumbing Pros set up the portable hand-washing stations and water stations throughout the park. And Iron Ink Tattoo Studio is running a charity flash tattoo booth — pick from a sheet of pre-designed $50 tattoos, 100% donated.",
      "The festival runs from 11 AM to 7 PM with live music from three local bands, a kids' zone with games and face painting, a silent auction with items donated by dozens of Round Rock businesses, and a 50/50 raffle drawing at 6 PM. Last year's pilot version raised $14,000. This year, the goal is $40,000 — enough to fund classroom supply grants for an entire elementary school. Bring your family, bring your appetite, and bring your generosity. Round Rock takes care of its own.",
    ],
    date: "2026-10-18",
    endDate: "2026-10-18",
    time: "11:00 AM",
    endTime: "7:00 PM",
    location: "Old Settlers Park Pavilion",
    address: "3300 E Palm Valley Blvd, Round Rock, TX 78665",
    image:
      "https://vibe.filesafe.space/1787129704745061268/assets/04b080c3-60bb-4886-96c3-20529c7f424b.png",
    gallery: [
      "https://vibe.filesafe.space/1787129704745061268/assets/0c9ca83c-32ee-4cb7-863a-47bcdff346fd.png||Round Rock Gives Back charity festival crowd and food tent",
      "https://vibe.filesafe.space/1787129704745061268/assets/04b080c3-60bb-4886-96c3-20529c7f424b.png||Volunteers and families at the Round Rock Gives Back community event",
    ],
    category: "Charity",
    relatedBusinessSlugs: [
      "the-round-rock-diner",
      "voltaic-electrical-services",
      "capitol-city-roofing",
      "round-rock-plumbing-pros",
      "iron-ink-tattoo-studio",
    ],
    relatedBlogSlugs: ["round-rock-gives-back-charity-festival"],
  },
];
