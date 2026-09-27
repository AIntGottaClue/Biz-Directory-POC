import type { CitySlug } from "./cities";
import type { Business } from "./types";
import { businesses } from "./listings";
import { categories, getCategory } from "./categories";
import type { CategorySlug } from "./categories";
import { blogPosts } from "./blog";
import { events } from "./events";

// =============================================================
//  HELPERS & CONSTANTS — you should not need to edit this file.
//  All business data lives in listings.ts and all categories
//  live in categories.ts.
// =============================================================

export const HERO_IMAGE =
  "https://vibe.filesafe.space/1787129704745061268/assets/0a544563-516b-4b2d-bd64-77d6dd37d572.png";

/**
 * Parse an ISO date string (e.g. "2026-10-18") as a LOCAL date,
 * avoiding the UTC-midnight timezone shift that causes off-by-one display.
 */
export const parseLocalDate = (iso: string): Date => {
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

// --- Re-exports so existing imports keep working ---
export { businesses } from "./listings";
export { categories, getCategory } from "./categories";
export type { Business } from "./types";
export type { Category, CategorySlug } from "./categories";

// --- Query helpers ---
// Premium listings show in the "Featured" section on the homepage.
export const getFeatured = (limit = 10, city: CitySlug = 'round-rock') =>
  businesses.filter((b) => b.premium && b.citySlug === city).slice(0, limit);

export const getLatest = (limit = 10, city: CitySlug = 'round-rock') =>
  businesses.filter(b => b.citySlug === city)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);

export const getByCategory = (slug: CategorySlug, city: CitySlug = 'round-rock') =>
  businesses.filter((b) => b.category === slug && b.citySlug === city);

export const getBySlug = (slug: string, city: CitySlug = 'round-rock') =>
  businesses.find((b) => b.slug === slug && b.citySlug === city);

export const getCategoryListingsSorted = (slug: CategorySlug, city: CitySlug = 'round-rock') => {
  const list = getByCategory(slug, city);
  // Premium listings first, then the rest.
  const tier = (b: Business) => (b.premium ? 0 : 1);
  return [...list].sort((a, b) => {
    // Listings with an explicit position always come first (sorted by position),
    // regardless of tier. This lets you pin any listing to the top.
    const pa = a.position ?? Infinity;
    const pb = b.position ?? Infinity;
    const aHas = a.position != null;
    const bHas = b.position != null;
    if (aHas && bHas) return pa - pb;
    if (aHas) return -1;
    if (bHas) return 1;
    // Remaining listings sort by tier (Premium → rest)
    return tier(a) - tier(b);
  });
};

export const searchBusinesses = (q: string, city: CitySlug = 'round-rock') => {
  const term = q.trim().toLowerCase();
  const tier = (b: Business) => (b.premium ? 0 : 1);
  const cityBusinesses = businesses.filter(b => b.citySlug === city);
  const base = !term
    ? cityBusinesses
    : cityBusinesses.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          b.categoryName.toLowerCase().includes(term) ||
          (b.categories ?? []).some((c) => {
            const cat = getCategory(c);
            return cat?.name.toLowerCase().includes(term);
          }) ||
          (b.services ?? []).some((s) => s.toLowerCase().includes(term)),
      );
  return [...base].sort((a, b) => {
    const aHas = a.position != null;
    const bHas = b.position != null;
    if (aHas && bHas) return a.position! - b.position!;
    if (aHas) return -1;
    if (bHas) return 1;
    return tier(a) - tier(b);
  });
};

/**
 * Return autosuggest matches: business names, categories, and service keywords.
 * Results are grouped into "businesses", "categories", and "keywords" (max 6 each).
 */
export const getSuggestions = (q: string, city: CitySlug = 'round-rock') => {
  const term = q.trim().toLowerCase();
  if (!term)
    return {
      businesses: [] as Business[],
      categories: [] as { name: string; slug: string }[],
      keywords: [] as string[],
    };

  const bizMatches = businesses.filter(b => b.citySlug === city)
    .filter((b) => b.name.toLowerCase().includes(term))
    .slice(0, 6);

  const categoryMatches = categories
    .filter((c) => c.name.toLowerCase().includes(term))
    .slice(0, 6)
    .map((c) => ({ name: c.name, slug: c.slug }));

  const categoryNames = new Set(categories.map((c) => c.name.toLowerCase()));

  const keywordSet = new Set<string>();
  for (const b of businesses.filter(b => b.citySlug === city)) {
    (b.categories ?? []).forEach((c) => {
      const cat = getCategory(c);
      if (
        cat &&
        !categoryNames.has(cat.name.toLowerCase()) &&
        cat.name.toLowerCase().includes(term)
      ) {
        keywordSet.add(cat.name);
      }
    });
    (b.services ?? []).forEach((s) => {
      if (s.toLowerCase().includes(term)) keywordSet.add(s);
    });
  }
  const keywords = [...keywordSet].slice(0, 6);

  return { businesses: bizMatches, categories: categoryMatches, keywords };
};

// --- Blog / Event ↔ Business linking ---
export const getBlogsForBusiness = (slug: string, city: CitySlug = 'round-rock') =>
  blogPosts.filter((p) => p.citySlug === city && (p.relatedBusinessSlugs ?? []).includes(slug));

export const getEventsForBusiness = (slug: string, city: CitySlug = 'round-rock') =>
  events.filter((e) => e.citySlug === city && (e.relatedBusinessSlugs ?? []).includes(slug));

export const getBusinessesForBlog = (slugs: string[] | undefined, city: CitySlug = 'round-rock') =>
  !slugs ? [] : businesses.filter((b) => b.citySlug === city && slugs.includes(b.slug));

export const getBusinessesForEvent = (slugs: string[] | undefined, city: CitySlug = 'round-rock') =>
  !slugs ? [] : businesses.filter((b) => b.citySlug === city && slugs.includes(b.slug));

// --- Blog ↔ Event linking ---
export const getEventsForBlog = (slugs: string[] | undefined, city: CitySlug = 'round-rock') =>
  !slugs ? [] : events.filter((e) => e.citySlug === city && slugs.includes(e.slug));

export const getBlogsForEvent = (slugs: string[] | undefined, city: CitySlug = 'round-rock') =>
  !slugs ? [] : blogPosts.filter((p) => p.citySlug === city && slugs.includes(p.slug));

// --- Open / closed status ---
const DAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function parseTimeToMinutes(t: string): number | null {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

/**
 * Determine whether a business is currently open, closed, or unknown.
 * Returns "Open", "Closed", or "Hours unavailable".
 */
export function getOpenStatus(
  hours: { day: string; time: string }[] | undefined,
  now: Date = new Date(),
): { status: "Open" | "Closed" | "Unknown"; closesAt?: string } {
  if (!hours || hours.length === 0) return { status: "Unknown" };

  const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    now.getDay()
  ];
  const today = hours.find((h) => h.day === dayName);
  if (!today) return { status: "Unknown" };

  if (!today.time || today.time.trim().toLowerCase() === "closed")
    return { status: "Closed" };

  // Split on en-dash, em-dash, or hyphen
  const parts = today.time.split(/[–—-]/).map((s) => s.trim());
  if (parts.length < 2) return { status: "Unknown" };

  const openMin = parseTimeToMinutes(parts[0]);
  const closeMin = parseTimeToMinutes(parts[1]);
  if (openMin == null || closeMin == null) return { status: "Unknown" };

  const curMin = now.getHours() * 60 + now.getMinutes();

  // Handle overnight (close after midnight) — e.g. closes at 2:00 AM
  const adjustedClose = closeMin <= openMin ? closeMin + 24 * 60 : closeMin;
  const adjustedCur = curMin < openMin ? curMin + 24 * 60 : curMin;

  if (adjustedCur >= openMin && adjustedCur < adjustedClose) {
    // Format closesAt back to 12-hour
    const ch = Math.floor(closeMin / 60);
    const cm = closeMin % 60;
    const period = ch >= 12 ? "PM" : "AM";
    const h12 = ch % 12 === 0 ? 12 : ch % 12;
    return {
      status: "Open",
      closesAt: `${h12}:${cm.toString().padStart(2, "0")} ${period}`,
    };
  }
  return { status: "Closed" };
}
