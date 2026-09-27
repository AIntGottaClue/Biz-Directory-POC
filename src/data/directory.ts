/**
 * directory.ts — barrel / re-export file.
 *
 * The data is now split into three files for easier editing:
 *   - categories.ts  → category definitions (add/remove categories here)
 *   - listings.ts     → business listings (add/remove businesses here)
 *   - helpers.ts      → search, sort, open-status, hero image (don't edit)
 *   - types.ts        → TypeScript interfaces (don't edit unless adding fields)
 *
 * This file re-exports everything so existing imports like
 *   import { businesses, categories, getBySlug } from "@/data/directory"
 * continue to work unchanged.
 *
 * New code can also import directly from the split files:
 *   import { businesses } from "@/data/listings"
 *   import { categories } from "@/data/categories"
 */

export type { Business } from "./types";
export type { Category, CategorySlug } from "./categories";

export { categories, getCategory } from "./categories";
export { businesses } from "./listings";
export {
  HERO_IMAGE,
  getFeatured,
  getLatest,
  getByCategory,
  getBySlug,
  getCategoryListingsSorted,
  searchBusinesses,
  getSuggestions,
  getOpenStatus,
} from "./helpers";
