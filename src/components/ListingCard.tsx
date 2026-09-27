import { Link } from "@/lib/router";
import { BadgeCheck, Crown, Star, MapPin, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { getOpenStatus } from "@/lib/business-hours";
import type { CategorySlug } from "@/data/categories";
import { getCategory } from "@/data/helpers";

interface ListingCardProps {
  business: {
    slug: string;
    name: string;
    image: string;
    description: string;
    categoryName: string;
    category?: CategorySlug;
    categories?: CategorySlug[];
    city?: string;
    state?: string;
    rating?: number;
    reviewCount?: number;
    verified: boolean;
    premium: boolean;
    hours?: { day: string; time: string }[];
  };
  featured?: boolean;
}

const DESC_LIMIT = 120;

export default function ListingCard({ business }: ListingCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isLong = business.description.length > DESC_LIMIT;
  const shown =
    expanded || !isLong
      ? business.description
      : business.description.slice(0, DESC_LIMIT).trimEnd() + "…";

  const { open: isOpen } = getOpenStatus(business.hours);

  return (
    <Link
      to={`/business/${business.slug}`}
      className="group block h-full no-underline"
    >
      <Card className="relative flex h-full flex-col overflow-hidden border-border/60 p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-2xl">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={business.image}
            alt={`${business.name} — ${business.categoryName} in ${business.city || "Round Rock"}, TX`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

          {/* Badges — premium on left, verified on right */}
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between">
            {business.premium && (
              <Badge className="border-0 bg-premium font-semibold text-premium-foreground shadow-sm">
                <Crown className="h-3 w-3 mr-1" /> Premium
              </Badge>
            )}
            {business.verified && (
              <Badge className="border-0 bg-green-600 font-semibold text-white shadow-sm">
                <BadgeCheck className="h-3 w-3 mr-1" /> Verified
              </Badge>
            )}
          </div>

          {/* Hover arrow */}
          <div className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-accent">
              {business.name}
            </h3>
            {/* Show rating if available, otherwise show open/closed flush with name */}
            {business.rating != null || business.reviewCount != null ? (
              <div className="flex items-center gap-1 text-sm font-medium text-foreground shrink-0">
                {business.rating != null && (
                  <>
                    <Star className="h-3.5 w-3.5 fill-premium text-premium" />
                    {business.rating.toFixed(1)}
                  </>
                )}
                {business.reviewCount != null && (
                  <span className="text-muted-foreground">
                    ({business.reviewCount})
                  </span>
                )}
              </div>
            ) : business.hours && business.hours.length > 0 ? (
              <div
                className={`inline-flex items-center gap-1 text-xs font-bold shrink-0 ${
                  isOpen ? "text-green-600" : "text-destructive"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOpen ? "bg-green-600" : "bg-destructive"}`}
                />
                {isOpen ? "Open" : "Closed"}
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {business.city}, {business.state}
            </div>
            {/* Only show open/closed on city line when there IS a rating */}
            {(business.rating != null || business.reviewCount != null) &&
              business.hours &&
              business.hours.length > 0 && (
                <div
                  className={`inline-flex items-center gap-1 text-xs font-bold ${
                    isOpen ? "text-green-600" : "text-destructive"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full animate-pulse ${isOpen ? "bg-green-600" : "bg-destructive"}`}
                  />
                  {isOpen ? "Open" : "Closed"}
                </div>
              )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {shown}
            {isLong && (
              <button
                className="ml-1 text-accent hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExpanded((v) => !v);
                }}
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </p>

          {/* Category badges */}
          {(() => {
            const allCats: CategorySlug[] = [
              business.category ?? null,
              ...(business.categories ?? []),
            ].filter(Boolean) as CategorySlug[];
            const unique = [...new Set(allCats)];
            return unique.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {unique.map((c) => {
                  const cat = getCategory(c);
                  return cat ? (
                    <Link
                      key={c}
                      to={`/category/${c}`}
                      className="no-underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Badge
                        variant="secondary"
                        className="text-xs cursor-pointer transition-colors hover:bg-accent/10 hover:text-accent"
                      >
                        {cat.name}
                      </Badge>
                    </Link>
                  ) : null;
                })}
              </div>
            ) : null;
          })()}
        </div>
      </Card>
    </Link>
  );
}
