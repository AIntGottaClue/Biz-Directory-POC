import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { events } from "@/data/events";
import { parseLocalDate } from "@/data/helpers";
import AdSlot from "@/components/AdSlot";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function Events() {
  const formatDate = (iso: string) =>
    parseLocalDate(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const formatDateShort = (iso: string) =>
    parseLocalDate(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const formatDateRange = (start: string, end?: string) =>
    end && end !== start
      ? `${formatDate(start)} – ${formatDate(end)}`
      : formatDate(start);

  const formatTimeRange = (start: string, end?: string) =>
    end ? `${start} – ${end}` : start;

  const isUpcoming = (iso: string) =>
    parseLocalDate(iso) >= new Date(new Date().toDateString());

  const sorted = [...events].sort(
    (a, b) =>
      parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime(),
  );
  const [featured, ...rest] = sorted;

  return (
    <div>
      <SEOHead
        title="Events"
        description="Upcoming community events, festivals, and local gatherings in Round Rock, Texas. Find farmers markets, music festivals, business expos, and charity events."
        canonical="/events"
      />

      {/* Hero band with image */}
      <section className="relative overflow-hidden">
        <img
          src="https://vibe.filesafe.space/1787129704745061268/assets/3ecb50d1-c1e0-440f-b8d1-ccfe9f2611d8.png"
          alt="Community festival in Round Rock town square"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="container relative mx-auto px-4 pt-20 py-14 md:pt-24 md:py-16">
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
                <BreadcrumbPage className="text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                  Events
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">
            <CalendarDays className="h-4 w-4" /> Community
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
            Round Rock Events
          </h1>
          <p className="mt-2 max-w-xl text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Upcoming community events, festivals, and local gatherings
          </p>
        </div>
      </section>

      {/* Ad banner */}
      <section className="container mx-auto px-4 pt-8">
        <AdSlot variant="banner" label="Sponsored Event" />
      </section>

      {/* Featured event hero */}
      {featured && (
        <section className="container mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to={`/events/${featured.slug}`}
              className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-3xl border border-border/60"
            >
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Date badge */}
              <div className="absolute left-6 top-6 flex flex-col items-center justify-center rounded-2xl bg-white/15 px-4 py-3 text-white backdrop-blur-md ring-1 ring-white/20">
                <span className="font-display text-3xl font-bold leading-none">
                  {parseLocalDate(featured.date).getDate()}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide">
                  {parseLocalDate(featured.date).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
              </div>

              {/* Status badge */}
              <div className="absolute right-6 top-6">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                    isUpcoming(featured.date)
                      ? "bg-verified/90 text-verified-foreground"
                      : "bg-white/15 text-white ring-1 ring-white/20"
                  }`}
                >
                  {isUpcoming(featured.date) ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {isUpcoming(featured.date) ? "Upcoming" : "Past Event"}
                </span>
              </div>

              <div className="relative p-7 text-white">
                <span className="mb-2 inline-block w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {featured.category}
                </span>
                <h2 className="font-display text-2xl font-bold leading-tight transition-colors group-hover:text-accent md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-2 max-w-xl text-white/80 leading-relaxed line-clamp-2">
                  {featured.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4 text-accent" />
                    {formatDateRange(featured.date, featured.endDate)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-white/80">
                    <Clock className="h-4 w-4" />{" "}
                    {formatTimeRange(featured.time, featured.endTime)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-white/80">
                    <MapPin className="h-4 w-4" /> {featured.location}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors group-hover:bg-white/25">
                  View Details{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Remaining events — image card grid */}
      <section className="container mx-auto px-4 pb-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((evt, i) => {
            const upcoming = isUpcoming(evt.date);
            return (
              <motion.div
                key={evt.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <Link
                  to={`/events/${evt.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
                >
                  {/* Image with date block */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Date block */}
                    <div className="absolute left-3 top-3 flex flex-col items-center justify-center rounded-xl bg-white/15 px-3 py-2 text-white backdrop-blur-md ring-1 ring-white/20">
                      <span className="font-display text-xl font-bold leading-none">
                        {parseLocalDate(evt.date).getDate()}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wide">
                        {parseLocalDate(evt.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    {/* Status pill */}
                    <div className="absolute right-3 top-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
                          upcoming
                            ? "bg-verified/90 text-verified-foreground"
                            : "bg-white/15 text-white ring-1 ring-white/20"
                        }`}
                      >
                        {upcoming ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {upcoming ? "Upcoming" : "Past"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="mb-2 inline-block w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {evt.category}
                    </span>
                    <h3 className="font-display text-lg font-bold leading-snug transition-colors group-hover:text-accent">
                      {evt.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                      {evt.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        {formatDateRange(evt.date, evt.endDate)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />{" "}
                        {formatTimeRange(evt.time, evt.endTime)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {evt.location}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
