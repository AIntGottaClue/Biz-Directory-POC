import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import * as LucideIcons from "lucide-react";
import { ArrowLeft, Store, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdSlot from "@/components/AdSlot";
import ListingCard from "@/components/ListingCard";
import { getCategory, getCategoryListingsSorted } from "@/data/helpers";

const PAGE_SIZE = 20;

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const category = slug ? getCategory(slug as any) : undefined;

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Category not found</h1>
        <Button onClick={() => navigate("/")} className="mt-6">
          Back to home
        </Button>
      </div>
    );
  }

  const listings = getCategoryListingsSorted(category.slug);
  const premiumCount = listings.filter((l) => l.premium).length;
  const Icon = (LucideIcons as any)[category.icon] ?? Store;
  const shown = listings.slice(0, visible);

  return (
    <div>
      <SEOHead
        title={category.name}
        description={`${category.blurb} — ${listings.length} businesses in Round Rock, TX. Browse verified and premium ${category.name.toLowerCase()} listings.`}
        canonical={`/category/${category.slug}`}
        ogImage={category.image}
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${category.name} in Round Rock, TX`,
          description: category.blurb,
          url: `/category/${category.slug}`,
        }}
      />

      {/* Banner with category image */}
      <section className="relative overflow-hidden pt-20 md:pt-24">
        {category.image && (
          <>
            <img
              src={category.image}
              alt={`${category.name} in Round Rock, TX`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
          </>
        )}
        <div className="container relative mx-auto px-4 py-12 md:py-14">
          <nav className="flex items-center gap-1 text-sm text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
            <Link
              to="/categories"
              className="inline-flex items-center gap-1 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All categories
            </Link>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
              <Icon className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold md:text-4xl text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                {category.name}
              </h1>
              <p className="mt-1 text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                {category.blurb} · {listings.length} businesses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad banner */}
      <section className="container mx-auto px-4 py-6">
        <AdSlot
          variant="banner"
          subheadline="Sponsored listing"
          headline={`Trusted ${category.name} in Round Rock`}
          description="Get a free, no-obligation quote from top-rated professionals. Same-day service available."
          ctaPhone="(512) 555-0199"
          ctaText="Request Free Quote"
          ctaUrl="#contact"
          badgeText="100% Verified"
        />
      </section>

      {/* Listings */}
      <section className="container mx-auto px-4 pb-16">
        {premiumCount > 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {listings.length} listings · {premiumCount} premium
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((b) => (
            <ListingCard key={b.id} business={b} featured={b.premium} />
          ))}
        </div>
        {visible < listings.length && (
          <div className="mt-10 text-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              View More <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

      {/* Bottom ad */}
      <section className="container mx-auto px-4 pb-16">
        <AdSlot
          variant="banner"
          subheadline="Advertise Here"
          headline="Reach Round Rock Customers"
          description="Promote your business to thousands of local residents searching for services every month."
          ctaPhone="(512) 555-0100"
          ctaText="Get Started"
          ctaUrl="#"
          badgeText="Limited Slots"
        />
      </section>
    </div>
  );
}
