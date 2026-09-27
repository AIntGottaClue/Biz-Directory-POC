import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import { searchBusinesses } from "@/data/helpers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const PAGE_SIZE = 20;

export default function SearchPage() {
  const [params] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [params]);

  const results = searchBusinesses(initial);
  const shown = results.slice(0, visible);

  return (
    <div>
      <SEOHead
        title={initial ? `Search: ${initial}` : "Search"}
        description={
          initial
            ? `Search results for "${initial}" in Round Rock, TX. Browse verified local businesses.`
            : "Search all local businesses in Round Rock, TX by name, service, or category."
        }
        canonical={
          initial ? `/search?q=${encodeURIComponent(initial)}` : "/search"
        }
        noIndex
      />

      {/* HERO with image background */}
      <section className="relative">
        <img
          src="https://vibe.filesafe.space/1787129704745061268/assets/383eaf31-0fcd-4b35-9ed2-2bddd672d5ee.png"
          alt="Searching for local businesses in Round Rock"
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
                  Search{initial ? `: ${initial}` : ""}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            <Search className="h-4 w-4 text-accent" /> Find a business
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
            Search the Directory
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Find businesses by name, service, or category.
          </p>
          <div className="mt-8 max-w-xl">
            <SearchBar variant="page" />
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="container mx-auto px-4 py-12">
        <p className="text-sm text-muted-foreground">
          {initial
            ? `${results.length} result${results.length === 1 ? "" : "s"} for "${initial}"`
            : "Start typing to search all listings."}
        </p>

        {results.length > 0 ? (
          <>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((b) => (
                <ListingCard key={b.id} business={b} featured={b.premium} />
              ))}
            </div>
            {visible < results.length && (
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
          </>
        ) : initial ? (
          <p className="mt-8 text-muted-foreground">
            No businesses found. Try a different search term.
          </p>
        ) : null}
      </section>
    </div>
  );
}
