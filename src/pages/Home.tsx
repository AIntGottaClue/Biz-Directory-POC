import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Heart,
  CalendarDays,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import SEOHead from "@/components/SEOHead";
import { categories } from "@/data/categories";
import { getFeatured, getLatest, HERO_IMAGE } from "@/data/helpers";
import { blogPosts } from "@/data/blog";
import { events } from "@/data/events";
import { parseLocalDate } from "@/data/helpers";

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

export default function Home() {
  const navigate = useNavigate();
  const featured = getFeatured(8);
  const latest = getLatest(8);

  const upcomingEvents = [...events]
    .sort(
      (a, b) =>
        parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime(),
    )
    .slice(0, 3);
  const latestPosts = [...blogPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div>
      <SEOHead
        title="Round Rock Local — Round Rock, TX Business Directory"
        description="Discover trusted local businesses in Round Rock, Texas. Browse verified and premium listings across every category — med spas, dentists, restaurants, electricians, roofers, plumbers, mechanics, and more."
        canonical="/"
        ogImage={HERO_IMAGE}
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Round Rock Local",
          url: "/",
          description: "Local business directory for Round Rock, Texas.",
          areaServed: { "@type": "City", name: "Round Rock, TX" },
        }}
      />

      {/* ─── HERO SECTION matching homey layout ─── */}
      <section className="relative bg-[#0f172a] text-white">
        <div className="relative min-h-[580px] pt-24 pb-16 flex items-center lg:min-h-[640px]">
          <img
            src={HERO_IMAGE}
            alt="Round Rock, Texas"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/60 via-[#0f172a]/80 to-[#0f172a]" />

          <div className="relative z-10 mx-auto max-w-[1400px] px-5 flex flex-col items-start text-left w-full">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-3xl leading-[1.1]"
            >
              Find real local Round Rock businesses.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-4 text-base sm:text-lg text-white/70 max-w-xl font-medium"
            >
              Free to list • Local-first results • Manually checked
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 w-full max-w-3xl"
            >
              <SearchBar variant="hero" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-5 flex flex-wrap gap-2.5"
            >
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/10 hover:text-white"
                >
                  {cat.name}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── BENTO CATEGORY GRID ─── */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              <Sparkles className="h-4 w-4" /> Explore
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Top Categories
            </h2>
            <p className="mt-2 text-muted-foreground">
              Explore top local services in Round Rock
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/categories")}
            className="self-start sm:self-auto group"
          >
            All categories
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        {/* Bento grid — image-backed tiles */}
        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 10).map((cat, i) => {
            const Icon = (LucideIcons as any)[cat.icon] ?? LucideIcons.Store;
            const isFeature = i === 0 || i === 5;
            return (
              <motion.button
                key={cat.slug}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className={`group relative flex flex-col items-start justify-end gap-2 overflow-hidden rounded-2xl border border-border/60 p-5 text-left card-lift hover:border-accent/50 hover:shadow-xl hover:glow-sm ${
                  isFeature ? "row-span-2" : ""
                }`}
              >
                {/* Background image */}
                {cat.image ? (
                  <>
                    <img
                      src={cat.image}
                      alt={`${cat.name} in Round Rock, TX`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-card bg-gradient-to-br from-accent/0 via-accent/0 to-accent/5" />
                )}
                {isFeature && (
                  <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-accent/10 blur-2xl transition-opacity group-hover:bg-accent/20" />
                )}
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20 transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent group-hover:shadow-lg">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="relative">
                  <h3 className="font-display font-semibold text-white drop-shadow-sm">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/80 drop-shadow-sm">
                    {cat.blurb}
                  </p>
                </div>
                <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2" />
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ─── SPOTLIGHT + FEATURED (asymmetric) ─── */}
      <section className="relative overflow-hidden border-y border-border/50 bg-muted/30 py-16 md:py-20">
        <div className="absolute -top-32 left-1/2 -z-10 h-64 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]" />

        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-premium">
                <TrendingUp className="h-4 w-4" /> Premium Picks
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                Featured Listings
              </h2>
              <p className="mt-2 text-muted-foreground">
                Top-rated and premium businesses in Round Rock
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/premium")}
              className="self-start sm:self-auto group"
            >
              View All Premium
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

          {/* Even grid — same as Latest Listings */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((b, i) => (
              <motion.div
                key={b.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <ListingCard business={b} featured={b.premium} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST — full-width band ─── */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              <Clock className="h-4 w-4" /> Just Added
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Latest Listings
            </h2>
            <p className="mt-2 text-muted-foreground">
              Newest additions to the directory
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/search")}
            className="self-start sm:self-auto group"
          >
            View All Listings
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {latest.map((b, i) => (
            <motion.div
              key={b.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <ListingCard business={b} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── COMMUNITY PULSE — events + blog ─── */}
      <section className="relative overflow-hidden border-y border-border/50 bg-muted/30 py-16 md:py-20">
        <div className="absolute -top-32 right-1/4 -z-10 h-64 w-[500px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/4 -z-10 h-64 w-[500px] rounded-full bg-primary/10 blur-[100px]" />

        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              <Heart className="h-4 w-4" /> Community Pulse
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              What's Happening in Round Rock
            </h2>
            <p className="mt-2 text-muted-foreground">
              Local events and stories from the heart of the community
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Upcoming Events */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                  <CalendarDays className="h-5 w-5 text-accent" /> Upcoming
                  Events
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/events")}
                  className="group"
                >
                  All events{" "}
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((ev, i) => {
                  const d = parseLocalDate(ev.date);
                  const day = d.getDate();
                  const month = d.toLocaleDateString("en-US", {
                    month: "short",
                  });
                  return (
                    <motion.div
                      key={ev.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <Link
                        to={`/events/${ev.slug}`}
                        className="group flex items-stretch gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card card-lift hover:border-accent/40 hover:shadow-lg"
                      >
                        {/* Date block */}
                        <div className="flex w-16 shrink-0 flex-col items-center justify-center bg-[#e5a84b] text-[#0f172a]">
                          <span className="font-display text-2xl font-bold leading-none">
                            {day}
                          </span>
                          <span className="mt-0.5 text-xs font-medium uppercase tracking-wider">
                            {month}
                          </span>
                        </div>
                        {/* Image */}
                        <div className="relative hidden w-28 shrink-0 overflow-hidden sm:block">
                          <img
                            src={ev.image}
                            alt={ev.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-center py-3 pr-4">
                          <span className="text-xs font-medium uppercase tracking-wider text-accent">
                            {ev.category}
                          </span>
                          <h4 className="mt-1 font-display font-semibold leading-snug group-hover:text-accent transition-colors">
                            {ev.title}
                          </h4>
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {ev.location}
                          </p>
                        </div>
                        <ChevronRight className="my-auto mr-3 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Latest Blog Posts */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-xl font-bold">
                  <BookOpen className="h-5 w-5 text-accent" /> From the Blog
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/blog")}
                  className="group"
                >
                  All posts{" "}
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
              <div className="space-y-4">
                {latestPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group flex items-stretch gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card card-lift hover:border-accent/40 hover:shadow-lg"
                    >
                      {/* Image */}
                      <div className="relative w-28 shrink-0 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-center py-3 pr-4">
                        <span className="text-xs font-medium uppercase tracking-wider text-accent">
                          {post.category}
                        </span>
                        <h4 className="mt-1 font-display font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {post.readTime} · {post.date}
                        </p>
                      </div>
                      <ChevronRight className="my-auto mr-3 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
    </div>
  );
}
