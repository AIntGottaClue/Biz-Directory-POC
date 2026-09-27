import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Store, ArrowUpRight, Sparkles, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";
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
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export default function AllCategories() {
  const topCategories = categories.slice(0, 10);
  const otherCategories = categories.slice(10);
  return (
    <div>
      <SEOHead
        title="All Categories"
        description="Browse every local business category in Round Rock, TX — med spas, dentists, restaurants, electricians, roofers, plumbers, mechanics, tattoo parlors, HVAC, and landscaping."
        canonical="/categories"
      />

      {/* Hero band with image */}
      <section className="relative overflow-hidden">
        <img
          src="https://vibe.filesafe.space/1787129704745061268/assets/c0ceb0dd-0959-491b-9032-2d82d7486f8f.png"
          alt="Round Rock downtown with local businesses"
          className="absolute inset-0 h-full w-full object-cover"
        />
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
                  All Categories
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">
            <Store className="h-4 w-4" /> Directory
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
            All Categories
          </h1>
          <p className="mt-2 max-w-xl text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Browse every local business category in Round Rock, TX.
          </p>
        </div>
      </section>

      {/* Top Categories — bento-style grid with images */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="font-display text-2xl font-bold">Top Categories</h2>
        </div>
        <div className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topCategories.map((cat, i) => {
            const Icon = (LucideIcons as any)[cat.icon] ?? Store;
            const isFeature = i === 0 || i === 5;
            return (
              <motion.div
                key={cat.slug}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={isFeature ? "row-span-2" : ""}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="group relative flex h-full flex-col items-start justify-end gap-3 overflow-hidden rounded-2xl border border-border/60 p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-xl"
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
                    <h3 className="font-display text-lg font-semibold text-white drop-shadow-sm">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-white/80 drop-shadow-sm">
                      {cat.blurb}
                    </p>
                  </div>
                  <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-white opacity-0 transition-all duration-300 group-hover:opacity-100" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Other Categories — same dimensions, no cards */}
      {otherCategories.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-accent" />
            <h2 className="font-display text-2xl font-bold">More Categories</h2>
          </div>
          <div className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {otherCategories.map((cat, i) => {
              const Icon = (LucideIcons as any)[cat.icon] ?? Store;
              return (
                <motion.div
                  key={cat.slug}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <Link
                    to={`/category/${cat.slug}`}
                    className="group relative flex h-full flex-col items-start justify-end gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-xl"
                  >
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:shadow-lg">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="relative">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {cat.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {cat.blurb}
                      </p>
                    </div>
                    <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-accent" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
