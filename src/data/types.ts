import type { CitySlug } from "./cities";
import type { CategorySlug } from "./categories";
export type { CategorySlug };

// =============================================================
//  BUSINESS TYPE — all fields except id, slug, name, category,
//  categoryName, image, description, verified, premium,
//  createdAt are OPTIONAL. You can leave them out safely.
// =============================================================

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  categoryName: string;
  image: string;
  imageOverride?: string; // Optional image URL submitted by biz owner to replace the default
  gallery?: string[]; // Additional images for premium listings
  description: string;
  phone?: string;
  email?: string;
  hideEmail?: boolean; // Set to true to hide the email from public listing pages
  website?: string;
  address?: string;
  city: string;
  citySlug: CitySlug;
  state?: string;
  zip?: string;
  hours?: { day: string; time: string }[];
  rating?: number;
  reviewCount?: number;
  yearEstablished?: number;
  services?: string[];
  categories?: CategorySlug[]; // Additional categories beyond the primary one
  verified: boolean;
  premium: boolean;
  position?: number; // Manual override: lower number appears first within its tier
  createdAt: string; // ISO date for "latest" ordering
  relatedBlogSlugs?: string[]; // Blog posts linked to this business
  relatedEventSlugs?: string[]; // Events linked to this business
  embeds?: Record<string, string>; // Any key works — reference it in the description as {{embed:keyName}}
  socials?: string[]; // Social media profile URLs (Facebook, Instagram, etc.) — auto-populates JSON-LD sameAs
  geo?: { latitude: number; longitude: number }; // GPS coordinates for schema.org geo
  additionalType?: string; // Additional category type (e.g. "Concrete", "Plumbing")
}
