import { useCity } from "@/lib/router";
import { Link, useNavigate } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import SearchBar from "@/components/SearchBar";
import { getFeatured } from "@/data/helpers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const PAGE_SIZE = 20;

export default function PremiumListings() {
  const city = useCity();
  const navigate = useNavigate();

  const allPremium = getFeatured(999, city.slug);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = allPremium.slice(0, visible);

  return (
    <div>
      <SEOHead
        title="Premium Listings"
        description={`Browse featured local businesses in ${city.name}, TX. Browse all premium listings.`}
        canonical="/premium"
      />
      {/* HERO with image */}
      <section className="relative isolate overflow-hidden">
        <img
          src="https://vibe.filesafe.space/1787129704745061268/assets/c12aafaa-617e-4481-9114-72529ff9d8a8.png"
          alt="Premium boutique storefront"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="container relative mx-auto px-4 pt-20 py-16 text-white md:pt-24 md:py-24">
          <Breadcrumb className="mb-6">
            <BreadcrumbList className="[&_.text-muted-foreground]:text-white/90 [&_.text-foreground]:text-white [&_a]:text-white/90 [&_span]:text-white [&_svg]:text-white/70">
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-white/90 hover:text-white hover:underline underline-offset-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]"
                >
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                  Premium Listings
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-display text-4xl font-bold md:text-5xl tracking-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
            Premium Listings
          </h1>
          <p className="mt-3 text-lg text-white/85 max-w-2xl [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Featured local businesses in {city.name}.
          </p>
          <div className="mt-8 max-w-xl">
            <SearchBar variant="page" />
          </div>
        </div>
      </section>

      {/* AD BANNER */}
      {city.slug === "round-rock" && <div className="container mx-auto px-4 mt-8">
        <AdSlot
          variant="banner"
          label="Sponsored"
          subheadline="Featured Opportunity"
          headline="Grow Your Business in Round Rock"
          description="Get your business in front of thousands of local customers. Premium placement guaranteed."
          ctaText="Contact for Pricing"
          badgeText="Verified"
        />
      </div>}

      {/* LISTINGS GRID */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {allPremium.length} premium{" "}
            {allPremium.length === 1 ? "business" : "businesses"} found
          </p>
        </div>

        {allPremium.length === 0 && <p className="text-muted-foreground">No premium listings for {city.name} yet.</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((b) => (
            <ListingCard key={b.id} business={b} featured={b.premium} />
          ))}
        </div>

        {visible < allPremium.length && (
          <div className="mt-10 text-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              View More Premium Listings <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
