import { useCity } from "@/lib/router";
import { Link } from "@/lib/router";
import {
  Calendar,
  Clock,
  ArrowRight,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blog";
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

export default function Blog() {
  const city = useCity();
  const formatDate = (iso: string) =>
    parseLocalDate(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const sorted = blogPosts.filter(p => p.citySlug === city.slug).sort(
    (a, b) =>
      parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime(),
  );
  const [featured, second, third, ...rest] = sorted;

  return (
    <div>
      <SEOHead
        title="Blog"
        description={`Guides and local stories from ${city.name}, Texas.`}
        canonical="/blog"
      />

      {/* Hero band with image */}
      <section className="relative overflow-hidden">
        <img
          src="https://vibe.filesafe.space/1787129704745061268/assets/42a5096b-d4fe-466c-854e-dc821e6f0182.png"
          alt="Notebook and pen on a rustic table in a local cafe"
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
                  Blog
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">
            <Newspaper className="h-4 w-4" /> Stories & Guides
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
            {city.name} Local Blog
          </h1>
          <p className="mt-2 max-w-xl text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            Guides, stories, and local insights from {city.name}, Texas
          </p>
        </div>
      </section>

      {sorted.length === 0 && <p className="container mx-auto px-4 py-10 text-muted-foreground">No stories for {city.name} yet. These sample city hubs are still being built.</p>}
      {/* Ad banner */}
      <section className="container mx-auto px-4 pt-8">
        {city.slug === "round-rock" && <AdSlot variant="banner" label="Sponsored Content" />}
      </section>

      {/* Magazine hero — featured + two sidekicks */}
      {featured && (
        <section className="container mx-auto px-4 py-10">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Featured */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to={`/blog/${featured.slug}`}
                className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl border border-border/60"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
                  Featured
                </span>
                <div className="relative p-7 text-white">
                  <span className="mb-3 inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {featured.category}
                  </span>
                  <h2 className="font-display text-2xl font-bold leading-tight transition-colors group-hover:text-accent md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-white/80 leading-relaxed line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />{" "}
                      {formatDate(featured.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {featured.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Sidekicks */}
            <div className="flex flex-col gap-6">
              {[second, third].filter(Boolean).map((post, i) => (
                <motion.div
                  key={post.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="flex-1"
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg sm:flex-row lg:flex-col xl:flex-row"
                  >
                    <div className="relative h-40 overflow-hidden sm:w-32 lg:w-full xl:w-32 sm:shrink-0 lg:shrink-0 xl:shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <span className="mb-1.5 inline-block w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {post.category}
                      </span>
                      <h3 className="font-display text-base font-semibold leading-snug transition-colors group-hover:text-accent">
                        {post.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{" "}
                          {formatDate(post.date)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider with label */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            <TrendingUp className="h-4 w-4" /> More Stories
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </div>
      </div>

      {/* Posts grid */}
      <section className="container mx-auto px-4 py-10 pb-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <motion.article
              key={post.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
            >
              <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-2 inline-block w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {post.category}
                </span>
                <h3 className="font-display text-lg font-semibold leading-snug">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {post.readTime}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
