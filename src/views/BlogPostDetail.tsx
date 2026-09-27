import { useCity } from "@/lib/router";
import { useParams, Link, Navigate } from "@/lib/router";
import { Calendar, Clock, ArrowRight, ChevronRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { blogPosts } from "@/data/blog";
import {
  getBusinessesForBlog,
  getEventsForBlog,
  parseLocalDate,
} from "@/data/helpers";
import AdSlot from "@/components/AdSlot";
import ListingCard from "@/components/ListingCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function BlogPostDetail() {
  const city = useCity();
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug && p.citySlug === city.slug);

  if (!post) return <Navigate to="/blog" replace />;

  const formatDate = (iso: string) =>
    parseLocalDate(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const morePosts = blogPosts.filter((p) => p.id !== post.id && p.citySlug === city.slug).slice(0, 3);
  const relatedBiz = getBusinessesForBlog(post.relatedBusinessSlugs, city.slug);
  const relatedEvents = getEventsForBlog(post.relatedEventSlugs, city.slug);

  return (
    <div>
      <SEOHead
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogImage={post.image}
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Organization", name: post.author },
          image: post.image,
          url: `/blog/${post.slug}`,
        }}
      />

      {/* ─── EDITORIAL HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="relative h-80 pt-20 md:h-[440px] md:pt-24">
          <img
            src={post.image}
            alt={post.imageAlt ?? post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        </div>

        <div className="container relative mx-auto -mt-32 px-4 md:-mt-40">
          <div className="mx-auto max-w-3xl">
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
                    <Link to="/blog">Blog</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-[200px] truncate text-white md:max-w-none [text-shadow:0_1px_3px_rgba(0,0,0,0.6)]">
                    {post.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <span className="mb-3 inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {post.category}
            </span>
            <h1 className="font-display text-3xl font-bold text-white md:text-5xl [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ─── ARTICLE BODY ─── */}
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          {/* Meta bar */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
            <span>By {post.author}</span>
          </div>

          {/* Lede */}
          <p className="mb-8 text-xl font-medium leading-relaxed text-foreground">
            {post.excerpt}
          </p>

          {/* Content */}
          <div className="space-y-5">
            {post.content.split(/\n\s*\n/).map((para, i) => {
              const trimmed = para.trim();
              const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
              if (imgMatch) {
                return (
                  <figure key={i} className="my-8">
                    <img
                      src={imgMatch[2]}
                      alt={imgMatch[1]}
                      loading="lazy"
                      className="w-full rounded-xl border border-border"
                    />
                    {imgMatch[1] && (
                      <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                        {imgMatch[1]}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* In-article ad */}
          <div className="my-10">
            <AdSlot variant="banner" label="Sponsored" />
          </div>

          {/* Related businesses */}
          {relatedBiz.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 font-display text-xl font-semibold">
                Featured in This Article
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedBiz.map((b) => (
                  <ListingCard key={b.id} business={b} featured={b.premium} />
                ))}
              </div>
            </div>
          )}

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 font-display text-xl font-semibold">
                Related Events
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {relatedEvents.map((e) => (
                  <Link
                    key={e.id}
                    to={`/events/${e.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg sm:flex-row"
                  >
                    <div className="h-36 overflow-hidden sm:h-auto sm:w-40 shrink-0">
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
                      <h4 className="mt-1 font-display text-sm font-semibold leading-snug group-hover:text-accent transition-colors">
                        {e.title}
                      </h4>
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
                        View details <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* More posts — full-width band */}
        <div className="mt-12 border-t border-border pt-10">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold">
              More from the blog
            </h3>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {morePosts.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-accent">
                    {p.category}
                  </span>
                  <h4 className="mt-1.5 font-display text-base font-semibold leading-snug group-hover:text-accent transition-colors">
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
      </div>
    </div>
  );
}
