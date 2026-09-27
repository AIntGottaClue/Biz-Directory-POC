import { useCity } from "@/lib/router";
import { useParams, Link, Navigate } from "@/lib/router";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { events } from "@/data/events";
import {
  getBusinessesForEvent,
  getBlogsForEvent,
  parseLocalDate,
} from "@/data/helpers";
import AdSlot from "@/components/AdSlot";
import ImageGallery from "@/components/ImageGallery";
import ListingCard from "@/components/ListingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function EventDetail() {
  const city = useCity();
  const { slug } = useParams<{ slug: string }>();
  const evt = events.find((e) => e.slug === slug && e.citySlug === city.slug);

  if (!evt) return <Navigate to="/events" replace />;

  const isUpcoming =
    parseLocalDate(evt.date) >= new Date(new Date().toDateString());
  const allImages =
    evt.gallery && evt.gallery.length > 0 ? evt.gallery : [evt.image];

  const formatDate = (iso: string) =>
    parseLocalDate(iso).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatShort = (iso: string) => {
    const d = parseLocalDate(iso);
    return {
      day: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    };
  };

  const moreEvents = events.filter((e) => e.id !== evt.id && e.citySlug === city.slug).slice(0, 3);
  const relatedBiz = getBusinessesForEvent(evt.relatedBusinessSlugs, city.slug);
  const relatedBlogs = getBlogsForEvent(evt.relatedBlogSlugs, city.slug);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(evt.address || evt.location)}&output=embed`;
  const dateBadge = formatShort(evt.date);

  return (
    <div>
      <SEOHead
        title={evt.title}
        description={evt.description}
        canonical={`/events/${evt.slug}`}
        ogImage={evt.image}
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: evt.title,
          description: evt.description,
          startDate: `${evt.date}T${evt.time.replace(/[^\d:APM]/g, "")}`,
          endDate: evt.endDate
            ? `${evt.endDate}T${(evt.endTime ?? evt.time).replace(/[^\d:APM]/g, "")}`
            : undefined,
          location: {
            "@type": "Place",
            name: evt.location,
            address: evt.address,
          },
          image: evt.image,
        }}
      />

      {/* ─── HERO WITH DATE BADGE ─── */}
      <section className="relative overflow-hidden">
        <div className="relative h-80 pt-20 md:h-[440px] md:pt-24">
          <img
            src={evt.image}
            alt={evt.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        </div>

        <div className="container relative mx-auto -mt-32 px-4 md:-mt-40">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-4">
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
                  <BreadcrumbLink
                    asChild
                    className="text-white/90 hover:text-white hover:underline underline-offset-4 [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]"
                  >
                    <Link to="/events">Events</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[200px] truncate text-white md:max-w-none [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                    {evt.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-start gap-4">
              {/* Date badge */}
              <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-white px-4 py-3 text-primary shadow-xl">
                <span className="text-xs font-bold uppercase tracking-wide text-accent">
                  {dateBadge.month}
                </span>
                <span className="font-display text-3xl font-bold leading-none">
                  {dateBadge.day}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {evt.category}
                  </span>
                  <span
                    className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${isUpcoming ? "bg-verified text-verified-foreground" : "bg-destructive/80 text-destructive-foreground"}`}
                  >
                    {isUpcoming ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {isUpcoming ? "Upcoming" : "Past Event"}
                  </span>
                </div>
                <h1 className="mt-2 font-display text-2xl font-bold text-white md:text-4xl [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                  {evt.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BODY: two-column ─── */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* MAIN COLUMN */}
          <article className="space-y-6">
            {/* Lede */}
            <p className="text-xl font-medium leading-relaxed text-foreground">
              {evt.description}
            </p>

            {/* Content */}
            <div className="space-y-4">
              {evt.content.map((para, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Gallery */}
            {allImages.length > 1 && (
              <div>
                <h3 className="mb-3 font-display text-lg font-semibold">
                  Gallery
                </h3>
                <ImageGallery images={allImages} businessName={evt.title} />
              </div>
            )}

            {/* In-article ad */}
            <div className="my-8">
              <AdSlot variant="banner" label="Sponsored" />
            </div>

            {/* Related businesses */}
            {relatedBiz.length > 0 && (
              <div>
                <h3 className="mb-4 font-display text-xl font-semibold">
                  Businesses at This Event
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {relatedBiz.map((b) => (
                    <ListingCard key={b.id} business={b} featured={b.premium} />
                  ))}
                </div>
              </div>
            )}

            {/* Related blog posts */}
            {relatedBlogs.length > 0 && (
              <div>
                <h3 className="mb-4 font-display text-xl font-semibold">
                  Related Articles
                </h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {relatedBlogs.map((p) => (
                    <Link
                      key={p.id}
                      to={`/blog/${p.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg sm:flex-row"
                    >
                      <div className="h-36 overflow-hidden sm:h-auto sm:w-40 shrink-0">
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
                        <h4 className="mt-1 font-display text-sm font-semibold leading-snug group-hover:text-accent transition-colors">
                          {p.title}
                        </h4>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
                          Read more <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* More events */}
            <div className="border-t border-border pt-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-2xl font-semibold">
                  More events
                </h3>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {moreEvents.map((e) => (
                  <Link
                    key={e.id}
                    to={`/events/${e.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-44 overflow-hidden">
                      <img
                        src={e.image}
                        alt={e.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-display text-base font-semibold leading-snug group-hover:text-accent transition-colors">
                        {e.title}
                      </h4>
                      <span className="mt-1 block text-xs text-muted-foreground">
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
                        View details <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* STICKY SIDEBAR */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Info card */}
            <div className="rounded-2xl border border-border/60 bg-card p-6">
              <h3 className="font-display text-lg font-semibold">
                Event Details
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Date
                    </p>
                    <p className="text-sm font-semibold">
                      {evt.endDate && evt.endDate !== evt.date
                        ? `${formatDate(evt.date)} – ${formatDate(evt.endDate)}`
                        : formatDate(evt.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Time
                    </p>
                    <p className="text-sm font-semibold">
                      {evt.endTime ? `${evt.time} – ${evt.endTime}` : evt.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Location
                    </p>
                    <p className="text-sm font-semibold">{evt.location}</p>
                    {evt.address && (
                      <p className="text-xs text-muted-foreground">
                        {evt.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-border/60">
              <iframe
                title={`Map of ${evt.title}`}
                src={mapSrc}
                className="h-56 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Ads */}
            <AdSlot variant="sidebar" label="Advertisement" />
            <AdSlot variant="sidebar" label="Advertisement" />
          </aside>
        </div>
      </div>
    </div>
  );
}
