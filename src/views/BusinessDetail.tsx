import { useCity } from "@/lib/router";
import { useParams, useNavigate, Link } from "@/lib/router";
import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  BadgeCheck,
  Crown,
  CalendarDays,
  Wrench,
  ChevronRight,
  ShieldCheck,
  FileText,
  Calendar,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import {
  SiTiktok,
  SiThreads,
  SiPinterest,
} from "@icons-pack/react-simple-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AdSlot from "@/components/AdSlot";
import ListingCard from "@/components/ListingCard";
import ImageGallery from "@/components/ImageGallery";
import LeadGenForm from "@/components/LeadGenForm";
import { businesses } from "@/data/listings";
import {
  getBySlug,
  getCategory,
  getBlogsForBusiness,
  getEventsForBusiness,
  parseLocalDate,
} from "@/data/helpers";
import { type CategorySlug } from "@/data/types";
// Detect social platform from URL and return matching icon
// Detect social platform from URL and return matching icon
function getSocialIcon(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes("facebook") || lower.includes("fb.com"))
    return <Facebook className="h-[16px] w-[16px]" />;
  if (lower.includes("instagram"))
    return <Instagram className="h-[16px] w-[16px]" />;
  if (lower.includes("twitter") || lower.includes("x.com"))
    return <Twitter className="h-[16px] w-[16px]" />;
  if (lower.includes("youtube") || lower.includes("youtu.be"))
    return <Youtube className="h-[16px] w-[16px]" />;
  if (lower.includes("tiktok"))
    return <SiTiktok className="h-[16px] w-[16px]" />;
  if (lower.includes("threads"))
    return <SiThreads className="h-[16px] w-[16px]" />;
  if (lower.includes("pinterest"))
    return <SiPinterest className="h-[16px] w-[16px]" />;
  // Unsupported platform — skip rendering
  return null;
}

import { getOpenStatus } from "@/lib/business-hours";

export default function BusinessDetail() {
  const city = useCity();
  const { slug } = useParams();
  const navigate = useNavigate();
  const biz = slug ? getBySlug(slug, city.slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  if (!biz) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Listing not found</h1>
        <Button onClick={() => navigate("/")} className="mt-6">
          Back to home
        </Button>
      </div>
    );
  }

  const category = getCategory(biz.category);
  const relatedBlogs = getBlogsForBusiness(biz.slug, city.slug);
  const relatedEvents = getEventsForBusiness(biz.slug, city.slug);
  const related = businesses
    .filter((b) => b.category === biz.category && b.citySlug === city.slug && b.id !== biz.id)
    .slice(0, 3);

  const showAds = !biz.premium && city.slug === "round-rock";
  const { open: isOpen } = getOpenStatus(biz.hours);

  // State abbreviation
  const stateAbbr: Record<string, string> = {
    Texas: "TX",
    California: "CA",
    "New York": "NY",
  };
  const stateShort =
    biz.state && stateAbbr[biz.state]
      ? stateAbbr[biz.state]
      : (biz.state ?? "TX");
  const cityState = `${biz.city ?? "Round Rock"}, ${stateShort}`;
  const pageTitle = `${biz.name} - ${biz.categoryName} in ${cityState} | Round Rock Local`;

  const contactInfoCard =
    biz.phone ||
    biz.email ||
    biz.website ||
    biz.yearEstablished ||
    biz.address ? (
      <Card className="border-border/60">
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-semibold">Contact & Info</h2>
          <div className="mt-4 space-y-3">
            {biz.phone && (
              <a
                href={`tel:${biz.phone}`}
                className="group flex items-center gap-3 rounded-xl p-2 -m-2 transition-colors hover:bg-accent/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm text-accent group-hover:underline">
                    {biz.phone}
                  </p>
                </div>
              </a>
            )}
            {biz.email && !biz.hideEmail && (
              <a
                href={`mailto:${biz.email}`}
                className="group flex items-center gap-3 rounded-xl p-2 -m-2 transition-colors hover:bg-accent/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm text-accent group-hover:underline break-all">
                    {biz.email}
                  </p>
                </div>
              </a>
            )}
            {biz.website && (
              <a
                href={biz.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl p-2 -m-2 transition-colors hover:bg-accent/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Globe className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Website
                  </p>
                  <p className="text-sm text-accent group-hover:underline break-all">
                    {biz.website.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </a>
            )}
            {biz.yearEstablished != null && (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Established
                  </p>
                  <p className="text-sm text-foreground">
                    {String(biz.yearEstablished)}
                  </p>
                </div>
              </div>
            )}
            {biz.address && (
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Address
                  </p>
                  <p className="text-sm text-foreground">
                    {biz.address}
                    {biz.city ? `, ${biz.city}` : ""}
                    {biz.state ? `, ${biz.state}` : ""}
                    {biz.zip ? ` ${biz.zip}` : ""}
                  </p>
                </div>
              </div>
            )}
            {biz.socials && biz.socials.length > 0 && (
              <>
                <hr className="border-border/60 my-2" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                    Follow us:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {biz.socials.map((url) => {
                      const icon = getSocialIcon(url);
                      if (!icon) return null;
                      return (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all hover:border-accent/40 hover:text-accent hover:shadow-sm"
                        >
                          {icon}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    ) : null;

  return (
    <div>
      <SEOHead
        title={pageTitle}
        description={biz.description
          .replace(/\{\{embed:\w+(?:\|[^}]+)?\}\}/g, "")
          .replace(/\{\{image:[^}]+\}\}/g, "")
          .replace(/\n+/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 160)}
        canonical={`/business/${biz.slug}`}
        ogImage={biz.image}
        schemaJson={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              "@id": `/business/${biz.slug}`,
              name: biz.name,
              description: biz.description
                .replace(/\{\{embed:\w+(?:\|[^}]+)?\}\}/g, "")
                .replace(/\{\{image:[^}]+\}\}/g, "")
                .replace(/\n+/g, " ")
                .replace(/\s+/g, " ")
                .trim(),
              image: biz.image,
              url: `/business/${biz.slug}`,
              telephone: biz.phone,
              email: biz.hideEmail ? undefined : biz.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: biz.address,
                addressLocality: biz.city,
                addressRegion: biz.state,
                postalCode: biz.zip,
                addressCountry: "US",
              },
              aggregateRating:
                biz.rating != null
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: biz.rating,
                      reviewCount: biz.reviewCount,
                    }
                  : undefined,
              geo: biz.geo
                ? {
                    "@type": "GeoCoordinates",
                    latitude: biz.geo.latitude,
                    longitude: biz.geo.longitude,
                  }
                : undefined,
              sameAs: [
                ...(biz.socials ?? []),
                ...(biz.website ? [biz.website] : []),
              ],
              additionalType: biz.additionalType,
              priceRange: biz.premium ? "$$" : undefined,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: biz.categoryName,
                  item: `/category/${biz.category}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: biz.name,
                  item: `/business/${biz.slug}`,
                },
              ],
            },
          ],
        }}
      />

      {/* ─── FULL-BLEED HERO ─── */}
      <section className="relative min-h-[240px] overflow-hidden pt-16 md:min-h-[280px] md:pt-20">
        <img
          src={biz.image}
          alt={`${biz.name} in ${city.name}, TX`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/75 to-[#0f172a]/30" />

        <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-5 pt-2">
          {/* Bottom info block */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-5">
              {/* Desktop logo — left, full height of text block */}
              <div className="relative hidden shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-white/10 p-1.5 shadow-2xl backdrop-blur-md md:flex md:self-stretch">
                <img
                  src={biz.image}
                  alt={`${biz.name} logo`}
                  className="h-full w-28 rounded-xl object-cover"
                />
              </div>

              <div className="flex flex-col">
                {/* Breadcrumbs */}
                <nav className="mb-3 flex items-center gap-1 text-sm text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                  <Link
                    to="/"
                    className="text-white/90 hover:text-white hover:underline underline-offset-4"
                  >
                    Home
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-white/70" />
                  <Link
                    to={`/category/${biz.category}`}
                    className="text-white/90 hover:text-white hover:underline underline-offset-4"
                  >
                    {biz.categoryName}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-white">{biz.name}</span>
                </nav>

                {/* Mobile logo — between breadcrumbs and biz name */}
                <div className="mb-3 md:hidden">
                  <div className="relative inline-block overflow-hidden rounded-2xl border-2 border-white/20 bg-white/10 p-1.5 shadow-2xl backdrop-blur-md">
                    <img
                      src={biz.image}
                      alt={`${biz.name} logo`}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-white md:text-4xl [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                    {biz.name}
                  </h1>
                  {biz.verified && (
                    <Badge className="bg-green-600 text-white border-0 gap-1 font-semibold">
                      <BadgeCheck className="h-4 w-4" /> Verified
                    </Badge>
                  )}
                  {biz.premium && (
                    <Badge className="bg-premium text-premium-foreground border-0 gap-1 font-semibold">
                      <Crown className="h-4 w-4" /> Premium
                    </Badge>
                  )}
                </div>
                {/* Plain text info: City, State | Rating | Open status */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                  {biz.address && (
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <MapPin className="h-4 w-4 text-white/70" /> {biz.city},{" "}
                      {biz.state}
                    </span>
                  )}
                  {biz.rating != null && (
                    <>
                      <span className="text-white/40">|</span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Star className="h-4 w-4 fill-premium text-premium" />{" "}
                        {biz.rating.toFixed(1)}
                        {biz.reviewCount != null ? ` (${biz.reviewCount})` : ""}
                      </span>
                    </>
                  )}
                  {biz.hours && biz.hours.length > 0 && (
                    <>
                      <span className="text-white/40">|</span>
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <span
                          className={`flex h-2 w-2 rounded-full animate-pulse ${isOpen ? "bg-green-500" : "bg-destructive"}`}
                        />
                        {isOpen ? "Open now" : "Closed now"}
                      </span>
                    </>
                  )}
                </div>

                {/* Category pills */}
                {(() => {
                  const allCats: CategorySlug[] = [
                    biz.category,
                    ...(biz.categories ?? []),
                  ];
                  const unique = [...new Set(allCats)];
                  return unique.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {unique.map((c) => {
                        const cat = getCategory(c);
                        return cat ? (
                          <Link key={c} to={`/category/${c}`}>
                            <Badge
                              variant="secondary"
                              className="gap-1.5 cursor-pointer border-0 bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
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
            </div>
          </div>
        </div>
      </section>

      {/* White divider between hero and body */}
      <div className="h-px w-full bg-border" />

      {/* ─── BODY: two-column (main content + sidebar) ─── */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* MAIN COLUMN */}
          <div className="min-w-0 space-y-6 overflow-hidden">
            <Link
              to={`/category/${biz.category}`}
              className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to {biz.categoryName}
            </Link>

            {/* Claim banner */}
            {!biz.verified && city.slug === "round-rock" && (
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      Is this your business?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Claim this listing to add a Verified badge and update your
                      info.
                    </p>
                  </div>
                </div>
                <Link to={`/claim/${biz.slug}`}>
                  <Button size="sm" className="shrink-0">
                    <ShieldCheck className="mr-1.5 h-4 w-4" /> Claim
                  </Button>
                </Link>
              </div>
            )}

            {/* Gallery — shown first, above Contact & About */}
            {biz.gallery && biz.gallery.length > 0 && (
              <Card className="overflow-hidden border-border/60">
                <CardContent className="p-6">
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                    <Star className="h-5 w-5 text-accent" /> Photo Gallery
                  </h2>
                  <div className="mt-4">
                    <ImageGallery
                      images={biz.gallery}
                      businessName={biz.name}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact & Info — mobile only, below Gallery, above About */}
            <div className="lg:hidden">{contactInfoCard}</div>

            {/* About */}
            <Card className="border-border/60">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold">
                  About {biz.name}
                </h2>
                <div className="mt-3 leading-relaxed text-foreground/90">
                  {(() => {
                    const parts = biz.description.split(
                      /(\{\{embed:\w+(?:\|[^}]+)?\}\}|\{\{image:[^}]+\}\})/g,
                    );
                    return parts.map((part, i) => {
                      const embedMatch = part.match(
                        /^\{\{embed:(\w+)(?:\|([^}]+))?\}\}$/,
                      );
                      if (embedMatch) {
                        const html = biz.embeds?.[embedMatch[1]];
                        const ratio = embedMatch[2] || "16:9";
                        const aspectClass = ratio.replace(":", "/");
                        return html ? (
                          <div
                            key={i}
                            role="region"
                            aria-label={`${biz.name} embedded media: ${embedMatch[1]}`}
                            className={`my-5 overflow-hidden rounded-xl border border-border/60 [&_iframe]:w-full [&_iframe]:max-w-full [&_video]:w-full [&_video]:max-w-full`}
                            dangerouslySetInnerHTML={{
                              __html: `<div style="position:relative;width:100%;aspect-ratio:${aspectClass};">${html.replace(/height\s*=\s*["'][^"']*["']/gi, 'height="100%"').replace(/width\s*=\s*["'][^"']*["']/i, 'width="100%"')}</div>`,
                            }}
                          />
                        ) : null;
                      }
                      const imageMatch = part.match(
                        /^\{\{image:([^|}]+)(?:\|([^}]*))?\}\}$/,
                      );
                      if (imageMatch) {
                        const imgUrl = imageMatch[1].trim();
                        const imgAlt = (
                          imageMatch[2] || `${biz.name} image`
                        ).trim();
                        return (
                          <figure
                            key={i}
                            className="my-5 overflow-hidden rounded-xl border border-border/60"
                          >
                            <img
                              src={imgUrl}
                              alt={imgAlt}
                              loading="lazy"
                              className="w-full"
                            />
                          </figure>
                        );
                      }
                      return part.trim() ? (
                        <div key={i}>
                          {part.split(/\n+/).map((line, j) =>
                            line.trim() ? (
                              <p key={j} className="mb-3">
                                {line}
                              </p>
                            ) : null,
                          )}
                        </div>
                      ) : null;
                    });
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            {biz.services && biz.services.length > 0 && (
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                    <Wrench className="h-5 w-5 text-accent" /> Services
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {biz.services.map((s) => (
                      <div
                        key={s}
                        className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                      >
                        <ChevronRight className="h-4 w-4 text-accent" /> {s}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lead Gen Form — stays below services */}
            <LeadGenForm business={biz} />

            {/* Hours — moved below services */}
            {biz.hours && biz.hours.length > 0 && (
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                      <Clock className="h-5 w-5 text-accent" /> Business Hours
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                      <span
                        className={`h-2 w-2 rounded-full animate-pulse ${isOpen ? "bg-green-500" : "bg-destructive"}`}
                      />
                      {isOpen ? "Open now" : "Closed now"}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {biz.hours.map((h) => (
                      <div
                        key={h.day}
                        className={`flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm ${h.day === "Sun" || (h.day === "Sat" && h.time === "Closed") ? "sm:col-span-2" : ""}`}
                      >
                        <span className="font-medium">{h.day}</span>
                        <span
                          className={
                            h.time === "Closed"
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {h.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location map — moved below services */}
            {biz.address && (
              <Card className="overflow-hidden border-border/60 p-0">
                <div className="p-6 pb-2">
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                    <MapPin className="h-5 w-5 text-accent" /> Location
                  </h2>
                </div>
                <iframe
                  title={`Map of ${biz.name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${biz.name}${biz.address}${biz.city ? `, ${biz.city}` : ""}${biz.state ? `, ${biz.state}` : ""}${biz.zip ? ` ${biz.zip}` : ""}`)}&hl=en&z=14&output=embed`}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
                <div className="p-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${biz.name}${biz.address}${biz.city ? `, ${biz.city}` : ""}${biz.state ? `, ${biz.state}` : ""}${biz.zip ? ` ${biz.zip}` : ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-medium hover:underline inline-flex items-center gap-1 text-sm"
                  >
                    Get Directions <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Card>
            )}
          </div>

          {/* STICKY SIDEBAR */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="hidden lg:block">{contactInfoCard}</div>
            {/* Sidebar ads */}
            {showAds && (
              <div className="space-y-6">
                <AdSlot variant="sidebar" label="Sponsored Ad" />
                <AdSlot variant="square" label="Featured Sponsor" />
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* ─── RELATED SECTIONS — full width below two-column ─── */}
      <div className="container mx-auto px-4 pb-10 space-y-10">
        {/* Related blog posts */}
        {relatedBlogs.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold">
              <FileText className="h-5 w-5 text-accent" /> Featured in Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-accent">
                      {p.category}
                    </span>
                    <h3 className="mt-1 font-display text-sm font-semibold leading-snug group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
                      Read more <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related events */}
        {relatedEvents.length > 0 && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold">
              <Calendar className="h-5 w-5 text-accent" /> Featured in Events
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map((e) => (
                <Link
                  key={e.id}
                  to={`/events/${e.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-36 overflow-hidden">
                    <img
                      src={e.image}
                      alt={e.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-medium text-accent">
                      {e.category}
                    </span>
                    <h3 className="mt-1 font-display text-sm font-semibold leading-snug group-hover:text-accent transition-colors">
                      {e.title}
                    </h3>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {parseLocalDate(e.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {e.endDate && e.endDate !== e.date
                        ? ` – ${parseLocalDate(e.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : ""}{" "}
                      · {e.endTime ? `${e.time} – ${e.endTime}` : e.time}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
                      View details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related businesses */}
        {related.length > 0 && (
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold">
              More {biz.categoryName} in {city.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <ListingCard key={b.id} business={b} featured={b.premium} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
