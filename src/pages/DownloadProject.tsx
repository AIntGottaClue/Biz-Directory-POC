import { useState, useMemo } from "react";
import JSZip from "jszip";
import {
  FileCode2,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Zap,
  Download,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { businesses } from "@/data/listings";
import { blogPosts, type BlogPost } from "@/data/blog";
import { events, type EventItem } from "@/data/events";
import { categories } from "@/data/categories";
import type { Business } from "@/data/types";

const SITE_URL = "https://roundrocklocal.com"; // ← Replace with your real domain
const VERSION = "1.0.0";

// Shared CSS (dark Terracotta & Sage theme) — inlined into every page
const SHARED_CSS = `
:root {
  --background: oklch(0.19 0.02 135); --foreground: oklch(0.94 0.01 85);
  --card: oklch(0.23 0.025 135); --card-foreground: oklch(0.94 0.01 85);
  --primary: oklch(0.68 0.09 130); --primary-foreground: oklch(0.19 0.02 135);
  --muted: oklch(0.26 0.03 135); --muted-foreground: oklch(0.70 0.025 85);
  --accent: oklch(0.65 0.15 45); --accent-foreground: oklch(0.99 0.005 85);
  --border: oklch(0.32 0.03 135 / 0.6);
  --verified: oklch(0.62 0.13 130); --verified-foreground: oklch(0.99 0.005 85);
  --premium: oklch(0.78 0.13 70); --premium-foreground: oklch(0.30 0.05 65);
  --destructive: oklch(0.65 0.2 25); --destructive-foreground: oklch(0.99 0.005 85);
  --radius: 0.75rem;
  --font-display: "Outfit", system-ui, sans-serif; --font-body: "Figtree", system-ui, sans-serif;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--font-body); background: var(--background); color: var(--foreground); -webkit-font-smoothing: antialiased; line-height: 1.6; }
h1,h2,h3,h4,h5,h6 { font-family: var(--font-display); letter-spacing: -0.02em; }
a { color: var(--accent); text-decoration: none; } a:hover { text-decoration: underline; }
img { max-width: 100%; display: block; }
.container { max-width: 1400px; margin: 0 auto; padding: 0 1rem; }
.badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
.badge-verified { background: var(--verified); color: var(--verified-foreground); }
.badge-premium { background: var(--premium); color: var(--premium-foreground); }
.badge-open { background: oklch(1 0 0 / 0.1); backdrop-filter: blur(8px); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.4rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot-open { background: var(--verified); } .dot-closed { background: var(--destructive); }
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.hero { position: relative; height: 480px; overflow: hidden; }
.hero img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, oklch(0.19 0.02 135), oklch(0.19 0.02 135 / 0.7), oklch(0.19 0.02 135 / 0.3)); }
.hero-content { position: relative; height: 100%; max-width: 1400px; margin: 0 auto; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; }
.breadcrumb { display: flex; align-items: center; gap: 0.25rem; font-size: 0.85rem; color: rgba(255,255,255,0.9); text-shadow: 0 1px 3px rgba(0,0,0,0.6); padding-top: 5rem; }
.breadcrumb a { color: rgba(255,255,255,0.9); } .breadcrumb span { color: rgba(255,255,255,0.5); }
.hero-bottom { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem; padding-bottom: 1.5rem; }
.hero-title { font-size: 3rem; font-weight: 700; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.5); display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.hero-meta { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.75rem; }
.hero-meta span { color: rgba(255,255,255,0.9); text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
.cta-group { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.25rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 600; transition: all 0.2s; }
.btn-primary { background: #fff; color: oklch(0.19 0.02 135); }
.btn-outline { background: oklch(1 0 0 / 0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px); }
.body-grid { display: grid; gap: 2rem; padding: 2.5rem 0; }
@media (min-width: 1024px) { .body-grid { grid-template-columns: 1fr 360px; } }
.main-col { display: flex; flex-direction: column; gap: 1.5rem; }
.sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
@media (min-width: 1024px) { .sidebar { position: sticky; top: 6rem; align-self: start; } }
.section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
.services-grid { display: grid; gap: 0.75rem; }
@media (min-width: 640px) { .services-grid { grid-template-columns: 1fr 1fr; } }
.service-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border: 1px solid var(--border); background: oklch(0.26 0.03 135 / 0.3); border-radius: 0.75rem; font-size: 0.875rem; }
.categories { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.25rem; }
.category-badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; background: var(--muted); color: var(--foreground); text-decoration: none; transition: background 0.15s; }
.category-badge:hover { background: oklch(0.65 0.15 45 / 0.15); color: var(--accent); }
.contact-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.5rem 0; }
.contact-icon { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; background: oklch(0.65 0.15 45 / 0.1); color: var(--accent); }
.contact-label { font-size: 0.7rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-foreground); }
.contact-value { font-size: 0.875rem; color: var(--accent); }
.contact-value-plain { font-size: 0.875rem; color: var(--foreground); }
.social-icons-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; }
.social-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border); background: var(--card); color: var(--muted-foreground); font-size: 1.1rem; text-decoration: none; transition: all 0.2s; }
.social-icon-btn:hover { border-color: oklch(0.65 0.15 45 / 0.4); color: var(--accent); box-shadow: 0 2px 8px -2px rgba(0,0,0,0.15); }
.hours-row { display: flex; justify-content: space-between; padding: 0.4rem 0.75rem; border-radius: 0.5rem; background: oklch(0.26 0.03 135 / 0.3); font-size: 0.875rem; margin-bottom: 0.4rem; }
.hours-row .closed { color: var(--destructive); } .hours-row .time { color: var(--muted-foreground); }
.map iframe { width: 100%; height: 220px; border: 0; border-radius: 0 0 var(--radius) var(--radius); }
.related { max-width: 1400px; margin: 0 auto; padding: 0 1rem 2.5rem; display: flex; flex-direction: column; gap: 2.5rem; }
.related-grid { display: grid; gap: 1.5rem; }
@media (min-width: 640px) { .related-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .related-grid { grid-template-columns: repeat(3, 1fr); } }
.related-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 0.75rem; border: 1px solid var(--border); background: var(--card); transition: transform 0.2s; }
.related-card:hover { transform: translateY(-4px); }
.related-card img { height: 144px; width: 100%; object-fit: cover; }
.related-card-body { padding: 1rem; }
.related-card-cat { font-size: 0.75rem; font-weight: 500; color: var(--accent); }
.related-card-title { font-size: 0.875rem; font-weight: 600; margin-top: 0.25rem; }
.related-card-link { font-size: 0.75rem; color: var(--accent); margin-top: 0.5rem; display: inline-flex; align-items: center; gap: 0.25rem; }
.gallery-grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
@media (min-width: 640px) { .gallery-grid { grid-template-columns: 1fr 1fr; } }
.gallery-grid img { width: 100%; border-radius: 0.75rem; border: 1px solid var(--border); }
.back-link { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; color: var(--accent); }
.lead-form { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.lead-form h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; }
.lead-form p { font-size: 0.875rem; color: var(--muted-foreground); margin-bottom: 1rem; }
.lead-form input, .lead-form textarea { width: 100%; padding: 0.6rem 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--muted); color: var(--foreground); font-family: var(--font-body); font-size: 0.875rem; margin-bottom: 0.75rem; }
.lead-form button { padding: 0.6rem 1.5rem; border-radius: 0.5rem; border: 0; background: var(--accent); color: var(--accent-foreground); font-weight: 600; cursor: pointer; font-size: 0.875rem; }
.cat-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; background: var(--accent); color: var(--accent-foreground); margin-bottom: 0.75rem; }
.meta-bar { display: flex; flex-wrap: wrap; gap: 1rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); margin-bottom: 2rem; font-size: 0.875rem; color: var(--muted-foreground); }
.meta-bar span { display: inline-flex; align-items: center; gap: 0.25rem; }
.lede { font-size: 1.25rem; font-weight: 500; line-height: 1.6; margin-bottom: 2rem; color: var(--foreground); }
.article-body { max-width: 768px; margin: 0 auto; padding: 2.5rem 1rem; }
.article-body p { font-size: 1.1rem; line-height: 1.8; color: var(--muted-foreground); margin-bottom: 1.25rem; }
.article-body figure { margin: 2rem 0; }
.article-body figure img { width: 100%; border-radius: 0.75rem; border: 1px solid var(--border); }
.article-body figcaption { text-align: center; font-size: 0.875rem; color: var(--muted-foreground); margin-top: 0.5rem; }
.ad-banner { margin: 2.5rem 0; padding: 2rem; border: 1px dashed var(--border); border-radius: var(--radius); text-align: center; color: var(--muted-foreground); font-size: 0.875rem; }
.date-badge { display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; color: oklch(0.19 0.02 135); padding: 0.75rem 1rem; border-radius: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.3); flex-shrink: 0; }
.date-badge .month { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--accent); }
.date-badge .day { font-size: 1.75rem; font-weight: 700; line-height: 1; }
.hero-flex { display: flex; align-items: flex-start; gap: 1rem; }
.status-badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background: var(--verified); color: var(--verified-foreground); }
.content p { font-size: 1.1rem; line-height: 1.8; color: var(--muted-foreground); margin-bottom: 1rem; }
.info-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.info-card h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }
.info-row { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; }
.info-icon { width: 36px; height: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; background: oklch(0.65 0.15 45 / 0.1); color: var(--accent); }
.info-label { font-size: 0.7rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-foreground); }
.info-value { font-size: 0.875rem; font-weight: 600; }
.info-sub { font-size: 0.75rem; color: var(--muted-foreground); }
.map-card { overflow: hidden; border-radius: var(--radius); border: 1px solid var(--border); }
.map-card iframe { width: 100%; height: 224px; border: 0; }
.more-posts { max-width: 1400px; margin: 0 auto; padding: 2.5rem 1rem; border-top: 1px solid var(--border); }
.more-posts-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.more-posts h3 { font-size: 1.5rem; font-weight: 600; }
.more-posts-grid { display: grid; gap: 1.5rem; }
@media (min-width: 640px) { .more-posts-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .more-posts-grid { grid-template-columns: repeat(3, 1fr); } }
.description-content { line-height: 1.8; color: oklch(0.94 0.01 85 / 0.9); }
.description-content p { margin-bottom: 1rem; font-size: 1.05rem; }
.description-content .embed-container { margin: 1.5rem 0; overflow: hidden; border-radius: 0.75rem; border: 1px solid var(--border); }
.description-content .embed-container iframe { width: 100%; height: 100%; border: 0; display: block; position: absolute; top: 0; left: 0; }
.description-content .embed-container video { width: 100%; height: 100%; display: block; position: absolute; top: 0; left: 0; object-fit: cover; }
.description-content figure.desc-image { margin: 1.5rem 0; }
.description-content figure.desc-image img { width: 100%; border-radius: 0.75rem; border: 1px solid var(--border); }
.description-content figure.desc-image figcaption { text-align: center; font-size: 0.85rem; color: var(--muted-foreground); margin-top: 0.5rem; }
.gallery-video { border-radius: 0.75rem; border: 1px solid var(--border); overflow: hidden; }
.gallery-video iframe { width: 100%; height: 300px; border: 0; }
.gallery-video video { width: 100%; height: auto; display: block; }
`;

const TRACKING_SCRIPT = `<script src="https://api.airchatty.com/js/external-tracking.js" data-tracking-id="tk_61d238e145314251999b74fdd5c953cf"></script>`;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const HOME_SERVICE_CATS = new Set([
  "electricians",
  "roofers",
  "plumbers",
  "mechanics",
  "hvac",
]);

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getMonthShort(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
  });
}

function getDayNum(iso: string): string {
  return String(new Date(iso + "T00:00:00").getDate());
}

function dateRangeStr(start: string, end?: string): string {
  if (!end || end === start) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function timeRangeStr(time: string, endTime?: string): string {
  return endTime ? `${time} – ${endTime}` : time;
}

// --- Business HTML generator ---
// Strip {{embed:...}} and {{image:...}} markers from text (for meta tags, JSON-LD)
function stripMarkers(text: string): string {
  return text
    .replace(/\{\{embed:\w+(?:\|[^}]+)?\}\}/g, "")
    .replace(/\{\{image:[^}]+\}\}/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Parse a gallery item string: "url|thumbnail|alt" or "url||alt" or "url"
function parseGalleryItem(g: string): {
  src: string;
  thumb: string;
  isVideo: boolean;
  isYouTube: boolean;
  alt: string;
} {
  const parts = g.split("|");
  const url = (parts[0] || "").trim();
  const thumb = (parts[1] || "").trim();
  const alt = (parts[2] || "").trim();
  const isYouTube =
    url.includes("youtube.com/embed") || url.includes("youtu.be/");
  const isVideo =
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".mov") ||
    isYouTube;
  return { src: url, thumb, isVideo, isYouTube, alt };
}

// Render description with embeds, images, and line breaks as HTML
function renderDescriptionHTML(
  description: string,
  embeds?: Record<string, string>,
  bizName?: string,
): string {
  const parts = description.split(
    /(\{\{embed:\w+(?:\|[^}]+)?\}\}|\{\{image:[^}]+\}\})/g,
  );
  return parts
    .map((part) => {
      const embedMatch = part.match(/^\{\{embed:(\w+)(?:\|([^}]+))?\}\}$/);
      if (embedMatch && embeds) {
        const html = embeds[embedMatch[1]];
        const ratio = embedMatch[2] || "16:9";
        const aspectCSS = ratio.replace(":", "/");
        return html
          ? `<div class="embed-container" style="position:relative;aspect-ratio:${aspectCSS};">${html.replace(/height\s*=\s*["'][^"']*["']/gi, 'height="100%"').replace(/width\s*=\s*["'][^"']*["']/i, 'width="100%"')}</div>`
          : "";
      }
      const imageMatch = part.match(/^\{\{image:([^|}]+)(?:\|([^}]*))?\}\}$/);
      if (imageMatch) {
        const imgUrl = imageMatch[1].trim();
        const imgAlt = (imageMatch[2] || `${bizName || ""} image`).trim();
        return `<figure class="desc-image"><img src="${imgUrl}" alt="${esc(imgAlt)}" loading="lazy" /><figcaption>${esc(imgAlt)}</figcaption></figure>`;
      }
      // Regular text — split on \n into paragraphs
      return part
        .split(/\n+/)
        .filter((p) => p.trim())
        .map((p) => `<p>${esc(p)}</p>`)
        .join("\n        ");
    })
    .filter((p) => p.trim())
    .join("\n        ");
}

function generateBusinessHTML(biz: Business): string {
  const url = `${SITE_URL}/business/${biz.slug}`;
  const fullAddress = [biz.address, biz.city, biz.state, biz.zip]
    .filter(Boolean)
    .join(", ");
  const mapQ = encodeURIComponent(`${biz.name} ${fullAddress}`);
  const relatedBlogs = blogPosts.filter((p) =>
    (p.relatedBusinessSlugs ?? []).includes(biz.slug),
  );
  const relatedEvents = events.filter((e) =>
    (e.relatedBusinessSlugs ?? []).includes(biz.slug),
  );
  const sameCategory = businesses
    .filter((b) => b.category === biz.category && b.slug !== biz.slug)
    .slice(0, 3);
  const showLeadForm = !biz.premium && HOME_SERVICE_CATS.has(biz.category);

  const cleanDescription = stripMarkers(biz.description);

  // State abbreviation map
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

  // Title: {biz name} - {Category} in {City}, {State} | Round Rock Local
  const pageTitle = `${biz.name} - ${biz.categoryName} in ${cityState} | Round Rock Local`;

  // Build @graph array (LocalBusiness + BreadcrumbList) — matches competitor schema
  const graph: Record<string, unknown>[] = [];

  const localBiz: Record<string, unknown> = {
    "@type": "LocalBusiness",
    "@id": url,
    name: biz.name,
    description: cleanDescription,
    image: biz.image,
    url,
    telephone: biz.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: biz.address ?? "",
      addressLocality: biz.city ?? "",
      addressRegion: biz.state ?? "",
      postalCode: biz.zip ?? "",
      addressCountry: "US",
    },
  };
  if (biz.email && !biz.hideEmail) localBiz.email = biz.email;
  if (biz.rating) {
    localBiz.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: biz.rating,
      reviewCount: biz.reviewCount ?? 0,
    };
  }
  if (biz.geo) {
    localBiz.geo = {
      "@type": "GeoCoordinates",
      latitude: biz.geo.latitude,
      longitude: biz.geo.longitude,
    };
  }
  const sameAsLinks = [
    ...(biz.socials ?? []),
    ...(biz.website ? [biz.website] : []),
  ];
  if (sameAsLinks.length > 0) {
    localBiz.sameAs = sameAsLinks;
  }
  if (biz.additionalType) {
    localBiz.additionalType = biz.additionalType;
  }
  graph.push(localBiz);

  // BreadcrumbList structured data
  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: biz.categoryName,
        item: `${SITE_URL}/category/${biz.category}`,
      },
      { "@type": "ListItem", position: 3, name: biz.name, item: url },
    ],
  });

  const ld = { "@context": "https://schema.org", "@graph": graph };

  const hoursHTML = (biz.hours ?? [])
    .map(
      (h) =>
        `<div class="hours-row"><span>${esc(h.day)}</span><span class="time${h.time.toLowerCase() === "closed" ? " closed" : ""}">${esc(h.time)}</span></div>`,
    )
    .join("\n        ");

  const servicesHTML = (biz.services ?? [])
    .map((s) => `<div class="service-item">› ${esc(s)}</div>`)
    .join("\n          ");

  const allCats = [biz.category, ...(biz.categories ?? [])];
  const uniqueCats = [...new Set(allCats)];
  const categoriesHTML = uniqueCats
    .map((c) => {
      const cat = categories.find((cat) => cat.slug === c);
      return cat
        ? `<a href="/category/${c}" class="category-badge">📁 ${esc(cat.name)}</a>`
        : "";
    })
    .filter(Boolean)
    .join("\n          ");

  const galleryHTML = (biz.gallery ?? [])
    .map((g, i) => {
      const item = parseGalleryItem(g);
      const altText = item.alt || `${biz.name} photo ${i + 1}`;
      const poster = item.thumb || biz.image;
      if (item.isYouTube) {
        return `<div class="gallery-video"><iframe src="${item.src}" title="${esc(altText)}" loading="lazy" allowfullscreen frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>`;
      }
      if (item.isVideo) {
        return `<video controls preload="none" poster="${poster}" class="gallery-video" aria-label="${esc(altText)}"><source src="${item.src}" type="video/mp4" /></video>`;
      }
      return `<img src="${item.src}" alt="${esc(altText)}" loading="lazy" />`;
    })
    .join("\n          ");

  const descriptionHTML = renderDescriptionHTML(
    biz.description,
    biz.embeds,
    biz.name,
  );

  const contactItems: string[] = [];
  if (biz.phone)
    contactItems.push(
      `<div class="contact-item"><div class="contact-icon">📞</div><div><div class="contact-label">Phone</div><div class="contact-value">${esc(biz.phone)}</div></div></div>`,
    );
  if (biz.email && !biz.hideEmail)
    contactItems.push(
      `<div class="contact-item"><div class="contact-icon">✉️</div><div><div class="contact-label">Email</div><div class="contact-value">${esc(biz.email)}</div></div></div>`,
    );
  if (biz.website) {
    const display = biz.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
    contactItems.push(
      `<div class="contact-item"><div class="contact-icon">🌐</div><div><div class="contact-label">Website</div><div class="contact-value">${esc(display)}</div></div></div>`,
    );
  }
  if (biz.yearEstablished)
    contactItems.push(
      `<div class="contact-item"><div class="contact-icon">📅</div><div><div class="contact-label">Established</div><div class="contact-value-plain">${biz.yearEstablished}</div></div></div>`,
    );
  if (fullAddress)
    contactItems.push(
      `<div class="contact-item"><div class="contact-icon">📍</div><div><div class="contact-label">Address</div><div class="contact-value-plain">${esc(fullAddress)}</div></div></div>`,
    );
  // Social links
  if (biz.socials && biz.socials.length > 0) {
    const socialIcons = biz.socials
      .map((url: string) => {
        const lower = url.toLowerCase();
        let icon = "🔗";
        let label = "External link";
        if (lower.includes("facebook")) {
          icon = "📘";
          label = "Facebook";
        } else if (lower.includes("instagram")) {
          icon = "📷";
          label = "Instagram";
        } else if (lower.includes("twitter") || lower.includes("x.com")) {
          icon = "🐦";
          label = "Twitter";
        } else if (lower.includes("youtube") || lower.includes("youtu.be")) {
          icon = "▶️";
          label = "YouTube";
        } else if (lower.includes("linkedin")) {
          icon = "💼";
          label = "LinkedIn";
        } else if (lower.includes("tiktok")) {
          icon = "🎵";
          label = "TikTok";
        } else if (lower.includes("whatsapp")) {
          icon = "💬";
          label = "WhatsApp";
        } else if (lower.includes("twitch")) {
          icon = "🎮";
          label = "Twitch";
        } else if (lower.includes("yelp")) {
          icon = "⭐";
          label = "Yelp";
        } else if (lower.includes("pinterest")) {
          icon = "📌";
          label = "Pinterest";
        } else if (lower.includes("threads")) {
          icon = "🧵";
          label = "Threads";
        }
        return `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${label}" class="social-icon-btn">${icon}</a>`;
      })
      .join("\n          ");
    contactItems.push(
      `<hr style="border-color: var(--border); margin: 0.75rem 0;" /><div><div class="contact-label" style="margin-bottom: 0.5rem;">Follow us:</div><div class="social-icons-row">${socialIcons}</div></div>`,
    );
  }
  const contactHTML = contactItems.join("\n        ");

  const blogCardsHTML = relatedBlogs
    .map(
      (p) =>
        `<a href="/blog/${p.slug}" class="related-card"><img src="${p.image}" alt="${esc(p.title)}" loading="lazy" /><div class="related-card-body"><span class="related-card-cat">${esc(p.category)}</span><h3 class="related-card-title">${esc(p.title)}</h3><span class="related-card-link">Read more ›</span></div></a>`,
    )
    .join("\n      ");

  const eventCardsHTML = relatedEvents
    .map(
      (e) =>
        `<a href="/events/${e.slug}" class="related-card"><img src="${e.image}" alt="${esc(e.title)}" loading="lazy" /><div class="related-card-body"><span class="related-card-cat">${esc(e.category)}</span><h3 class="related-card-title">${esc(e.title)}</h3><span style="font-size: 0.75rem; color: var(--muted-foreground);">${formatShortDate(e.date)}${e.endDate && e.endDate !== e.date ? " – " + formatShortDate(e.endDate) : ""} · ${timeRangeStr(e.time, e.endTime)}</span><span class="related-card-link">View details ›</span></div></a>`,
    )
    .join("\n      ");

  const sameCatCardsHTML = sameCategory
    .map(
      (b) =>
        `<a href="/business/${b.slug}" class="related-card"><img src="${b.image}" alt="${esc(b.name)}" loading="lazy" /><div class="related-card-body"><h3 class="related-card-title">${esc(b.name)}</h3><span style="font-size: 0.75rem; color: var(--muted-foreground);">${b.rating ? `★ ${b.rating} (${b.reviewCount ?? 0})` : ""}</span></div></a>`,
    )
    .join("\n      ");

  const leadFormHTML = showLeadForm
    ? `<div class="lead-form"><h2>Get a Free ${esc(biz.categoryName)} Estimate</h2><p>Fill out the form below and we'll get back to you as soon as possible.</p><form><input type="text" placeholder="Your Name" required /><input type="email" placeholder="Your Email" required /><input type="tel" placeholder="Your Phone" /><textarea rows="3" placeholder="Briefly describe what you need..."></textarea><button type="submit">Get Your Free ${esc(biz.categoryName)} Quote</button></form><p style="margin-top: 0.75rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-foreground);">By submitting, you agree to be contacted about your request.</p></div>`
    : "";

  const relatedSections: string[] = [];
  if (relatedBlogs.length > 0)
    relatedSections.push(
      `<div><h2 class="section-title">📄 Featured in Articles</h2><div class="related-grid">${blogCardsHTML}</div></div>`,
    );
  if (relatedEvents.length > 0)
    relatedSections.push(
      `<div><h2 class="section-title">📅 Featured in Events</h2><div class="related-grid">${eventCardsHTML}</div></div>`,
    );
  if (sameCategory.length > 0)
    relatedSections.push(
      `<div><h2 class="section-title">More ${esc(biz.categoryName)} in Round Rock</h2><div class="related-grid">${sameCatCardsHTML}</div></div>`,
    );

  return `<!doctype html>
<!-- Generated by Round Rock Local v${VERSION} -->
<html lang="en" class="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(cleanDescription.slice(0, 160))}" />
<!-- Canonical tag: tells search engines the preferred/main URL of this page -->
<link rel="canonical" href="${url}" />
<meta property="og:title" content="${esc(biz.name)} - ${esc(biz.categoryName)} in ${esc(cityState)}" />
<meta property="og:description" content="${esc(cleanDescription.slice(0, 160))}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${biz.image}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="Round Rock Local" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(biz.name)} - ${esc(biz.categoryName)} in ${esc(cityState)}" />
<meta name="twitter:description" content="${esc(cleanDescription.slice(0, 160))}" />
<meta name="twitter:image" content="${biz.image}" />
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
<style>${SHARED_CSS}</style>
</head>
<body>
<section class="hero">
  <img src="${biz.image}" alt="${esc(biz.name)} in Round Rock, TX" />
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <nav class="breadcrumb"><a href="/">Home</a><span>›</span><a href="/category/${biz.category}">${esc(biz.categoryName)}</a><span>›</span>${esc(biz.name)}</nav>
    <div class="hero-bottom">
      <div>
        <h1 class="hero-title">${esc(biz.name)}${biz.verified ? ' <span class="badge badge-verified">✓ Verified</span>' : ""}${biz.premium ? ' <span class="badge badge-premium">★ Premium</span>' : ""}</h1>
        <div class="hero-meta">
          ${biz.rating ? `<span class="badge-open">★ ${biz.rating} (${biz.reviewCount ?? 0} reviews)</span>` : ""}
          <span class="badge-open">📍 ${esc(biz.city ?? "Round Rock")}, ${esc(biz.state ?? "TX")}</span>
        </div>
      </div>
      <div class="cta-group">
        ${biz.phone ? `<a href="tel:${esc(biz.phone)}" class="btn btn-primary">📞 Call</a>` : ""}
        ${biz.website ? `<a href="${biz.website}" target="_blank" rel="noopener" class="btn btn-outline">🌐 Website</a>` : ""}
      </div>
    </div>
  </div>
</section>
<div class="container">
  <div class="body-grid">
    <div class="main-col">
      <a href="/category/${biz.category}" class="back-link">← Back to ${esc(biz.categoryName)}</a>
      <div class="card">
        <h2 class="section-title">About ${esc(biz.name)}</h2>
        <div class="description-content">${descriptionHTML}</div>
        ${categoriesHTML ? `<div class="categories">${categoriesHTML}</div>` : ""}
      </div>
      ${galleryHTML ? `<div class="card"><h2 class="section-title">⭐ Photo Gallery</h2><div class="gallery-grid">${galleryHTML}</div></div>` : ""}
      ${servicesHTML ? `<div class="card"><h2 class="section-title">🔧 Services</h2><div class="services-grid">${servicesHTML}</div></div>` : ""}
      ${leadFormHTML}
    </div>
    <aside class="sidebar">
      ${contactHTML ? `<div class="card"><h2 class="section-title" style="font-size: 1.1rem;">Contact & Info</h2>${contactHTML}</div>` : ""}
      ${hoursHTML ? `<div class="card"><div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;"><h2 class="section-title" style="margin: 0; font-size: 1.1rem;">🕐 Hours</h2></div>${hoursHTML}</div>` : ""}
      ${fullAddress ? `<div class="card" style="padding: 0; overflow: hidden;"><div style="padding: 1rem 1rem 0.5rem;"><h2 class="section-title" style="font-size: 1.1rem;">📍 Location</h2></div><div class="map"><iframe title="Map of ${esc(biz.name)}" src="https://maps.google.com/maps?q=${mapQ}&hl=en&z=14&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><div style="padding: 0.75rem;"><a href="https://www.google.com/maps/dir/?api=1&destination=${mapQ}" target="_blank" rel="noopener" style="color: var(--accent); font-weight: 500; font-size: 0.875rem;">Get Directions ›</a></div></div>` : ""}
    </aside>
  </div>
</div>
${relatedSections.length > 0 ? `<div class="related">${relatedSections.join("\n  ")}</div>` : ""}
${TRACKING_SCRIPT}
</body>
</html>`;
}

// --- Blog HTML generator ---
function generateBlogHTML(post: BlogPost): string {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const relatedBiz = businesses.filter((b) =>
    (post.relatedBusinessSlugs ?? []).includes(b.slug),
  );
  const morePosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Parse content: split on blank lines into paragraphs, handle ![alt](url) images
  const blocks = post.content.split(/\n\n+/);
  const bodyHTML = blocks
    .map((block) => {
      const imgMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        return `<figure><img src="${imgMatch[2]}" alt="${esc(imgMatch[1])}" loading="lazy" /><figcaption>${esc(imgMatch[1])}</figcaption></figure>`;
      }
      return `<p>${esc(block)}</p>`;
    })
    .join("\n  ");

  const bizCardsHTML = relatedBiz
    .map(
      (b) =>
        `<a href="/business/${b.slug}" class="related-card"><img src="${b.image}" alt="${esc(b.name)}" loading="lazy" /><div class="related-card-body"><span class="related-card-cat">${esc(b.categoryName)}</span><h4 class="related-card-title">${esc(b.name)}</h4><span class="related-card-link">View listing ›</span></div></a>`,
    )
    .join("\n      ");

  const morePostsHTML = morePosts
    .map(
      (p) =>
        `<a href="/blog/${p.slug}" class="related-card"><img src="${p.image}" alt="${esc(p.title)}" loading="lazy" /><div class="related-card-body"><span class="related-card-cat">${esc(p.category)}</span><h4 class="related-card-title">${esc(p.title)}</h4><span class="related-card-link">Read more ›</span></div></a>`,
    )
    .join("\n    ");

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    image: post.image,
    url,
  };

  return `<!doctype html>
<!-- Generated by Round Rock Local v${VERSION} -->
<html lang="en" class="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(post.title)} | Round Rock Local</title>
<meta name="description" content="${esc(post.excerpt)}" />
<link rel="canonical" href="${url}" />
<meta property="og:title" content="${esc(post.title)}" />
<meta property="og:description" content="${esc(post.excerpt)}" />
<meta property="og:type" content="article" />
<meta property="og:image" content="${post.image}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="Round Rock Local" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(post.title)}" />
<meta name="twitter:description" content="${esc(post.excerpt)}" />
<meta name="twitter:image" content="${post.image}" />
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
<style>${SHARED_CSS}</style>
</head>
<body>
<section class="hero" style="height: auto;">
  <div style="position: relative; height: 440px; padding-top: 5rem; overflow: hidden;">
    <img src="${post.image}" alt="${esc(post.imageAlt ?? post.title)}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />
    <div class="hero-overlay" style="position: absolute; inset: 0; background: linear-gradient(to top, oklch(0.19 0.02 135), oklch(0.19 0.02 135 / 0.6), oklch(0.19 0.02 135 / 0.2));"></div>
  </div>
  <div style="position: relative; max-width: 1400px; margin: 0 auto; padding: 0 1rem; margin-top: -10rem;">
    <div style="max-width: 768px; margin: 0 auto;">
      <nav class="breadcrumb" style="margin-bottom: 1rem;"><a href="/">Home</a><span>›</span><a href="/blog">Blog</a><span>›</span><span style="color: #fff;">${esc(post.title)}</span></nav>
      <span class="cat-badge">${esc(post.category)}</span>
      <h1 class="hero-title">${esc(post.title)}</h1>
    </div>
  </div>
</section>
<div class="article-body">
  <div class="meta-bar">
    <span>📅 ${formatDate(post.date)}</span>
    <span>🕐 ${esc(post.readTime)}</span>
    <span>By ${esc(post.author)}</span>
  </div>
  <p class="lede">${esc(post.excerpt)}</p>
  ${bodyHTML}
  <div class="ad-banner">Sponsored Advertisement</div>
  ${relatedBiz.length > 0 ? `<div style="margin-top: 2.5rem;"><h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Featured in This Article</h3><div class="related-grid" style="display: grid; gap: 1.5rem;">${bizCardsHTML}</div></div>` : ""}
</div>
<div class="more-posts">
  <div class="more-posts-header"><h3>More from the blog</h3><a href="/blog" style="font-size: 0.875rem; color: var(--accent);">View all ›</a></div>
  <div class="more-posts-grid">${morePostsHTML}</div>
</div>
${TRACKING_SCRIPT}
</body>
</html>`;
}

// --- Event HTML generator ---
function generateEventHTML(evt: EventItem): string {
  const url = `${SITE_URL}/events/${evt.slug}`;
  const relatedBiz = businesses.filter((b) =>
    (evt.relatedBusinessSlugs ?? []).includes(b.slug),
  );
  const relatedBlogPosts = blogPosts.filter((p) =>
    (evt.relatedBlogSlugs ?? []).includes(p.slug),
  );
  const moreEvents = events.filter((e) => e.slug !== evt.slug).slice(0, 3);
  const mapQ = encodeURIComponent(evt.address);

  const contentHTML = evt.content
    .map((p) => `<p>${esc(p)}</p>`)
    .join("\n      ");
  const galleryHTML = (evt.gallery ?? [])
    .map((g, i) => {
      const item = parseGalleryItem(g);
      const altText = item.alt || `${evt.title} photo ${i + 1}`;
      if (item.isYouTube) {
        return `<div class="gallery-video"><iframe src="${item.src}" title="${esc(altText)}" loading="lazy" allowfullscreen frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>`;
      }
      if (item.isVideo) {
        return `<video controls preload="none" poster="${item.thumb || evt.image}" class="gallery-video" aria-label="${esc(altText)}"><source src="${item.src}" type="video/mp4" /></video>`;
      }
      return `<img src="${item.src}" alt="${esc(altText)}" loading="lazy" />`;
    })
    .join("\n        ");

  const bizCardsHTML = relatedBiz
    .map(
      (b) =>
        `<a href="/business/${b.slug}" class="related-card"><img src="${b.image}" alt="${esc(b.name)}" loading="lazy" /><div class="related-card-body"><span class="related-card-cat">${esc(b.categoryName)}</span><h4 class="related-card-title">${esc(b.name)}</h4><span class="related-card-link">View listing ›</span></div></a>`,
    )
    .join("\n        ");

  const blogCardsHTML = relatedBlogPosts
    .map(
      (p) =>
        `<a href="/blog/${p.slug}" class="related-card" style="flex-direction: row;"><img src="${p.image}" alt="${esc(p.title)}" loading="lazy" style="width: 160px; height: auto; flex-shrink: 0; object-fit: cover;" /><div class="related-card-body"><span class="related-card-cat">${esc(p.category)}</span><h4 class="related-card-title">${esc(p.title)}</h4><span class="related-card-link">Read more ›</span></div></a>`,
    )
    .join("\n        ");

  const moreEventsHTML = moreEvents
    .map(
      (e) =>
        `<a href="/events/${e.slug}" class="related-card"><img src="${e.image}" alt="${esc(e.title)}" loading="lazy" /><div class="related-card-body"><h4 class="related-card-title">${esc(e.title)}</h4><span style="font-size: 0.75rem; color: var(--muted-foreground);">${formatShortDate(e.date)}${e.endDate && e.endDate !== e.date ? " – " + formatShortDate(e.endDate) : ""} · ${timeRangeStr(e.time, e.endTime)}</span><span class="related-card-link">View details ›</span></div></a>`,
    )
    .join("\n        ");

  const ld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evt.title,
    description: evt.description,
    startDate: `${evt.date}T${evt.time}`,
    endDate: `${evt.endDate ?? evt.date}T${evt.endTime ?? evt.time}`,
    location: { "@type": "Place", name: evt.location, address: evt.address },
    image: evt.image,
  };

  return `<!doctype html>
<!-- Generated by Round Rock Local v${VERSION} -->
<html lang="en" class="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(evt.title)} | Round Rock Local</title>
<meta name="description" content="${esc(evt.description)}" />
<link rel="canonical" href="${url}" />
<meta property="og:title" content="${esc(evt.title)}" />
<meta property="og:description" content="${esc(evt.description)}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${evt.image}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="Round Rock Local" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(evt.title)}" />
<meta name="twitter:description" content="${esc(evt.description)}" />
<meta name="twitter:image" content="${evt.image}" />
<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
</script>
<style>${SHARED_CSS}</style>
</head>
<body>
<section class="hero" style="height: auto;">
  <div style="position: relative; height: 440px; padding-top: 5rem; overflow: hidden;">
    <img src="${evt.image}" alt="${esc(evt.title)}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;" />
    <div class="hero-overlay" style="position: absolute; inset: 0; background: linear-gradient(to top, oklch(0.19 0.02 135), oklch(0.19 0.02 135 / 0.6), oklch(0.19 0.02 135 / 0.2));"></div>
  </div>
  <div style="position: relative; max-width: 1400px; margin: 0 auto; padding: 0 1rem; margin-top: -10rem;">
    <div style="max-width: 896px; margin: 0 auto;">
      <nav class="breadcrumb" style="margin-bottom: 1rem;"><a href="/">Home</a><span>›</span><a href="/events">Events</a><span>›</span><span style="color: #fff;">${esc(evt.title)}</span></nav>
      <div class="hero-flex">
        <div class="date-badge"><span class="month">${getMonthShort(evt.date)}</span><span class="day">${getDayNum(evt.date)}</span></div>
        <div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;"><span class="cat-badge">${esc(evt.category)}</span><span class="status-badge">✓ Upcoming</span></div>
          <h1 class="hero-title">${esc(evt.title)}</h1>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="body-grid">
  <div class="main-col">
    <p class="lede">${esc(evt.description)}</p>
    <div class="content">${contentHTML}</div>
    ${galleryHTML ? `<div><h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem;">Gallery</h3><div class="gallery-grid">${galleryHTML}</div></div>` : ""}
    <div class="ad-banner">Sponsored Advertisement</div>
    ${relatedBiz.length > 0 ? `<div style="margin-top: 2.5rem;"><h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Businesses at This Event</h3><div class="related-grid">${bizCardsHTML}</div></div>` : ""}
    ${relatedBlogPosts.length > 0 ? `<div style="margin-top: 2.5rem;"><h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Related Articles</h3><div class="related-grid">${blogCardsHTML}</div></div>` : ""}
    <div style="border-top: 1px solid var(--border); padding-top: 2rem; margin-top: 2rem;">
      <div class="more-posts-header"><h3 style="font-size: 1.5rem; font-weight: 600;">More events</h3><a href="/events" style="font-size: 0.875rem; color: var(--accent);">View all ›</a></div>
      <div class="more-posts-grid">${moreEventsHTML}</div>
    </div>
  </div>
  <aside class="sidebar">
    <div class="info-card">
      <h3>Event Details</h3>
      <div class="info-row"><div class="info-icon">📅</div><div><div class="info-label">Date</div><div class="info-value">${dateRangeStr(evt.date, evt.endDate)}</div></div></div>
      <div class="info-row"><div class="info-icon">🕐</div><div><div class="info-label">Time</div><div class="info-value">${timeRangeStr(evt.time, evt.endTime)}</div></div></div>
      <div class="info-row"><div class="info-icon">📍</div><div><div class="info-label">Location</div><div class="info-value">${esc(evt.location)}</div><div class="info-sub">${esc(evt.address)}</div></div></div>
    </div>
    <div class="map-card"><iframe title="Map of ${esc(evt.title)}" src="https://www.google.com/maps?q=${mapQ}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </aside>
</div>
${TRACKING_SCRIPT}
</body>
</html>`;
}

// --- Index page generator ---
function generateIndexHTML(): string {
  const bizLinks = businesses
    .map(
      (b) =>
        `<li><a href="/business/${b.slug}">${esc(b.name)}</a> <span style="color: var(--muted-foreground);">— ${esc(b.categoryName)}</span></li>`,
    )
    .join("\n      ");
  const blogLinks = blogPosts
    .map(
      (p) =>
        `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> <span style="color: var(--muted-foreground);">— ${esc(p.category)}</span></li>`,
    )
    .join("\n      ");
  const eventLinks = events
    .map(
      (e) =>
        `<li><a href="/events/${e.slug}">${esc(e.title)}</a> <span style="color: var(--muted-foreground);">— ${formatShortDate(e.date)}</span></li>`,
    )
    .join("\n      ");
  const catLinks = categories
    .map(
      (c) =>
        `<li><a href="/category/${c.slug}">${esc(c.name)}</a> <span style="color: var(--muted-foreground);">— ${esc(c.blurb)}</span></li>`,
    )
    .join("\n      ");

  return `<!doctype html>
<!-- Generated by Round Rock Local v${VERSION} -->
<html lang="en" class="dark">
<head>
<style>${SHARED_CSS}</style>
</head>
<body>
<div class="container" style="padding: 3rem 1rem;">
  <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">Static Pages Index</h1>
  <p style="font-size: 0.8rem; color: var(--muted-foreground); margin-bottom: 1.5rem; font-family: var(--font-body);">Generated by Round Rock Local v${VERSION}</p>
  <div style="display: grid; gap: 2rem; grid-template-columns: 1fr; max-width: 800px;">
    <div class="card"><h2 class="section-title">Business Listings (${businesses.length})</h2><ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem;">${bizLinks}</ul></div>
    <div class="card"><h2 class="section-title">Blog Posts (${blogPosts.length})</h2><ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem;">${blogLinks}</ul></div>
    <div class="card"><h2 class="section-title">Events (${events.length})</h2><ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem;">${eventLinks}</ul></div>
    <div class="card"><h2 class="section-title">Categories (${categories.length})</h2><ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem;">${catLinks}</ul></div>
  </div>
</div>
${TRACKING_SCRIPT}
</body>
</html>`;
}

// Grab all source files at build time (same as DownloadProject)
const sourceFiles = import.meta.glob("/src/**/*.{ts,tsx,css,html}", {
  query: "?raw",
  import: "default",
  eager: true,
});
const configFiles = import.meta.glob(
  "/{vite.config.ts,tailwind.config.ts,postcss.config.js,tsconfig.json,tsconfig.app.json,tsconfig.node.json,components.json,index.html,eslint.config.js}",
  { query: "?raw", import: "default", eager: true },
);
const scriptFiles = import.meta.glob("/scripts/**/*.{mjs,md}", {
  query: "?raw",
  import: "default",
  eager: true,
});
const publicFiles = import.meta.glob("/public/**/*", {
  query: "?url",
  import: "default",
  eager: true,
});

export default function GenerateStaticPages() {
  const [status, setStatus] = useState<"idle" | "building" | "done" | "error">(
    "idle",
  );
  const [generatedCount, setGeneratedCount] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [progress, setProgress] = useState("");

  const stats = useMemo(
    () => ({
      businesses: businesses.length,
      blogs: blogPosts.length,
      events: events.length,
      total: businesses.length + blogPosts.length + events.length,
    }),
    [],
  );

  const handleGenerate = async () => {
    setStatus("building");
    setProgress("Generating HTML pages...");
    try {
      const zip = new JSZip();
      const staticFolder = zip.folder("static-html")!;
      let count = 0;

      // Generate business pages
      setProgress(`Generating ${businesses.length} business pages...`);
      for (const biz of businesses) {
        staticFolder.file(
          `business/${biz.slug}.html`,
          generateBusinessHTML(biz),
        );
        count++;
      }

      // Generate blog pages
      setProgress(`Generating ${blogPosts.length} blog pages...`);
      for (const post of blogPosts) {
        staticFolder.file(`blog/${post.slug}.html`, generateBlogHTML(post));
        count++;
      }

      // Generate event pages
      setProgress(`Generating ${events.length} event pages...`);
      for (const evt of events) {
        staticFolder.file(`events/${evt.slug}.html`, generateEventHTML(evt));
        count++;
      }

      // Generate index page
      staticFolder.file("index.html", generateIndexHTML());
      count++;
      setGeneratedCount(count);
      setProgress("Bundling source files...");

      // Nexus pages to exclude from the download entirely
      const NEXUS_PAGES = [
        "Nexus",
        "GenerateStaticPages",
        "DownloadProject",
        "DataExplorer",
      ];

      // Add all source files (exclude all nexus-related pages)
      let srcCount = 0;
      for (const [path, content] of Object.entries(sourceFiles)) {
        if (NEXUS_PAGES.some((p) => path.includes(`pages/${p}`))) continue;
        const relPath = path.replace(/^\//, "");
        // Strip nexus imports & routes from App.tsx so the project builds cleanly
        if (path.endsWith("App.tsx")) {
          let appModified = content as string;
          NEXUS_PAGES.forEach((p) => {
            appModified = appModified.replace(
              new RegExp(`import ${p} from "[^"]+";\\n`, "g"),
              "",
            );
            appModified = appModified.replace(
              new RegExp(
                `\\s*<Route path="[^"]*" element={<${p} />} />\\n`,
                "g",
              ),
              "\n",
            );
          });
          zip.file(relPath, appModified);
        } else {
          zip.file(relPath, content as string);
        }
        srcCount++;
      }

      // Add config files
      for (const [path, content] of Object.entries(configFiles)) {
        const relPath = path.replace(/^\//, "");
        zip.file(relPath, content as string);
        srcCount++;
      }

      // Add script files
      for (const [path, content] of Object.entries(scriptFiles)) {
        const relPath = path.replace(/^\//, "");
        zip.file(relPath, content as string);
        srcCount++;
      }

      // Add package.json (full, with all dependencies)
      zip.file(
        "package.json",
        JSON.stringify(
          {
            name: "round-rock-local",
            private: true,
            version: "1.0.0",
            type: "module",
            scripts: {
              dev: "vite",
              build: "tsc -b && vite build",
              preview: "vite preview",
              lint: "eslint .",
              test: "vitest",
            },
            dependencies: {
              "@hookform/resolvers": "^3.10.0",
              "@radix-ui/react-accordion": "^1.2.11",
              "@radix-ui/react-alert-dialog": "^1.1.14",
              "@radix-ui/react-aspect-ratio": "^1.1.7",
              "@radix-ui/react-avatar": "^1.1.10",
              "@radix-ui/react-checkbox": "^1.3.2",
              "@radix-ui/react-collapsible": "^1.1.11",
              "@radix-ui/react-context-menu": "^2.2.15",
              "@radix-ui/react-dialog": "^1.1.14",
              "@radix-ui/react-dropdown-menu": "^2.1.15",
              "@radix-ui/react-hover-card": "^1.1.14",
              "@radix-ui/react-label": "^2.1.7",
              "@radix-ui/react-menubar": "^1.1.15",
              "@radix-ui/react-navigation-menu": "^1.2.13",
              "@radix-ui/react-popover": "^1.1.14",
              "@radix-ui/react-progress": "^1.1.7",
              "@radix-ui/react-radio-group": "^1.3.7",
              "@radix-ui/react-scroll-area": "^1.2.9",
              "@radix-ui/react-select": "^2.2.5",
              "@radix-ui/react-separator": "^1.1.7",
              "@radix-ui/react-slider": "^1.3.5",
              "@radix-ui/react-slot": "^1.2.3",
              "@radix-ui/react-switch": "^1.2.5",
              "@radix-ui/react-tabs": "^1.1.12",
              "@radix-ui/react-toast": "^1.2.14",
              "@radix-ui/react-toggle": "^1.1.9",
              "@radix-ui/react-toggle-group": "^1.1.10",
              "@radix-ui/react-tooltip": "^1.2.7",
              "@tanstack/react-query": "^5.83.0",
              "class-variance-authority": "^0.7.1",
              clsx: "^2.1.1",
              cmdk: "^1.1.1",
              "date-fns": "^3.6.0",
              "embla-carousel-react": "^8.6.0",
              "framer-motion": "^11",
              "input-otp": "^1.4.2",
              jszip: "^3.10.1",
              "lucide-react": "^0.462.0",
              "next-themes": "^0.3.0",
              react: "^18.3.1",
              "react-day-picker": "^8.10.1",
              "react-dom": "^18.3.1",
              "react-helmet-async": "^3.0.0",
              "react-hook-form": "^7.61.1",
              "react-resizable-panels": "^2.1.9",
              "react-router-dom": "^6.30.1",
              recharts: "^2.15.4",
              sonner: "^1.7.4",
              "tailwind-merge": "^2.6.0",
              "tailwindcss-animate": "^1.0.7",
              vaul: "^0.9.9",
              zod: "^3.25.76",
            },
            devDependencies: {
              "@eslint/js": "^9.32.0",
              "@leadconnector/vibe-tagger": "^0.3.1",
              "@tailwindcss/typography": "^0.5.16",
              "@testing-library/jest-dom": "^6.6.0",
              "@testing-library/react": "^16.0.0",
              "@types/node": "^22.16.5",
              "@types/react": "^18.3.23",
              "@types/react-dom": "^18.3.7",
              "@vitejs/plugin-react-swc": "^3.11.0",
              autoprefixer: "^10.4.21",
              eslint: "^9.32.0",
              "eslint-plugin-react-hooks": "^5.2.0",
              "eslint-plugin-react-refresh": "^0.4.20",
              globals: "^15.15.0",
              jsdom: "^20.0.3",
              postcss: "^8.5.6",
              tailwindcss: "^3.4.17",
              typescript: "^5.8.3",
              "typescript-eslint": "^8.38.0",
              vite: "^5.4.19",
              vitest: "^3.2.4",
            },
          },
          null,
          2,
        ),
      );
      srcCount++;

      // Add README
      zip.file(
        "README.md",
        `# Round Rock Local (v${VERSION})\n\nLocal business directory for Round Rock, TX.\n\n## Static HTML Pages\n\nThis project includes pre-generated static HTML pages in \`static-html/\`:\n- ${businesses.length} business listing pages in \`static-html/business/\`\n- ${blogPosts.length} blog post pages in \`static-html/blog/\`\n- ${events.length} event pages in \`static-html/events/\`\n- An index page at \`static-html/index.html\`\n\n## Setup\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`,
      );
      srcCount++;

      // Add public files
      setProgress("Fetching public assets...");
      for (const [path, url] of Object.entries(publicFiles)) {
        const relPath = path.replace(/^\//, "");
        try {
          const resp = await fetch(url as string);
          const blob = await resp.blob();
          zip.file(relPath, blob);
          srcCount++;
        } catch {
          // skip if fetch fails
        }
      }

      setTotalFiles(count + srcCount);
      setProgress("Creating ZIP archive...");
      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `round-rock-local-v${VERSION}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
      setStatus("done");
      setProgress("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Download Project — Round Rock Local"
        description="Generate static HTML pages for all listings, blogs, and events, then download the full project ZIP."
        canonical="/download"
        noIndex
      />

      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/15 via-background to-background pt-28 pb-16 sm:pt-32">
        <div className="absolute inset-0 mesh-blob opacity-40" />
        <div className="container mx-auto max-w-4xl px-4 relative">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg glow-sm">
              <FileCode2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">
                Download Project
              </h1>
              <p className="text-base text-muted-foreground">
                Generate static HTML pages & download the full project ZIP
              </p>
            </div>
            <span className="ml-auto shrink-0 rounded-full border border-border bg-muted/50 px-3 py-1 font-mono text-xs font-semibold text-muted-foreground">
              v{VERSION}
            </span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Link
          to="/nexus"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Nexus
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-display text-2xl font-bold text-primary">
                {stats.businesses}
              </p>
              <p className="text-xs text-muted-foreground">Businesses</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-display text-2xl font-bold text-primary">
                {stats.blogs}
              </p>
              <p className="text-xs text-muted-foreground">Blog Posts</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="font-display text-2xl font-bold text-primary">
                {stats.events}
              </p>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
          </div>

          <div className="mb-6 space-y-3 text-sm text-muted-foreground">
            <p>
              This tool reads all data from{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                listings.ts
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                blog.ts
              </code>
              , and{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                events.ts
              </code>{" "}
              and generates a standalone HTML page for each item — complete with
              SEO meta tags, JSON-LD structured data, breadcrumbs, hero
              sections, galleries, related content, and embedded maps.
            </p>
            <p>
              The generated pages plus the full project source are bundled into
              a single ZIP for download. Generation is{" "}
              <strong className="text-foreground">instantaneous</strong> —
              everything runs client-side in your browser.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={status === "building"}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {status === "building" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {progress || "Working..."}
              </>
            ) : status === "done" ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-400" />v{VERSION} —
                Generated {generatedCount} pages + {totalFiles - generatedCount}{" "}
                source files — download again
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Generate {stats.total} Pages & Download ZIP
              </>
            )}
          </button>

          {status === "error" && (
            <p className="mt-4 text-center text-sm text-destructive">
              Something went wrong. Try again or refresh the page.
            </p>
          )}

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
            <Zap className="h-4 w-4 shrink-0 text-accent mt-0.5" />
            <span>
              Each generated page is fully self-contained with inline CSS — no
              build step needed to view them. Open any{" "}
              <code className="font-mono">.html</code> file directly in a
              browser.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
