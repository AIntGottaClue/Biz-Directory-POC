import SEOHead from "@/components/SEOHead";
import { Link } from "@/lib/router";
import {
  Table,
  Lock,
  ArrowRight,
  Wrench,
  FileCode2,
  Package,
} from "lucide-react";

const hiddenPages = [
  {
    slug: "/download",
    title: "Download Project",
    description:
      "Generate static HTML for every listing, blog, and event — then download the full project ZIP.",
    icon: FileCode2,
  },
  {
    slug: "/data-explorer",
    title: "Data Explorer",
    description:
      "View, search, copy, and export all listings, blogs, and events data as CSV.",
    icon: Table,
  },
  {
    slug: "/download-source",
    title: "Download Source Files",
    description:
      "Export all custom source files into a single downloadable .txt — boilerplate excluded.",
    icon: Package,
  },
];

export default function Nexus() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Nexus — Round Rock Local"
        description="Internal utility hub for hidden tools and pages."
        canonical="/nexus"
        noIndex
      />

      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/15 via-background to-background pt-28 pb-16 sm:pt-32">
        <div className="absolute inset-0 mesh-blob opacity-40" />
        <div className="container mx-auto max-w-4xl px-4 relative">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg glow-sm">
              <Wrench className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">
                Nexus
              </h1>
              <p className="text-base text-muted-foreground">
                Internal tools and hidden utility pages
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground max-w-2xl">
            <Lock className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              These pages are not indexed by search engines and are not linked
              in the site navigation.
            </span>
          </div>
        </div>
      </section>

      {/* Tool cards */}
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="grid gap-4">
          {hiddenPages.map((page) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.slug}
                to={page.slug}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {page.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {page.description}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground/60">
                    {page.slug}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
