/**
 * ============================================================
 *  SITEMAP GENERATOR — generates sitemap.xml from your data files
 *
 *  HOW TO USE:
 *    1. After `npm run build`, run:  node scripts/generate-sitemap.mjs
 *    2. This creates dist/sitemap.xml
 *    3. Deploy it alongside the rest of the dist/ folder
 *
 *  Submit the sitemap to Google Search Console:
 *    https://search.google.com/search-console
 * ============================================================
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");

const BASE_URL = process.argv[2] || "https://YOURDOMAIN.com"; // ← Or pass as arg: node scripts/generate-sitemap.mjs https://myroundrock.com

// --- Extract slugs by regex ---
function extractSlugs(file) {
  const content = readFileSync(join(ROOT, "src", "data", file), "utf-8");
  const regex = /slug:\s*"([^"]+)"/g;
  const slugs = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    slugs.push(m[1]);
  }
  return slugs;
}

function extractField(content, slug, field) {
  const idx = content.indexOf(`slug: "${slug}"`);
  if (idx === -1) return null;
  const block = content.slice(idx, idx + 3000);
  const regex = new RegExp(`${field}:\\s*"([^"]+)"`);
  const m = block.match(regex);
  return m ? m[1] : null;
}

// --- Collect all URLs ---
const urls = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/categories", priority: "0.8", changefreq: "weekly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/events", priority: "0.8", changefreq: "daily" },
  { path: "/search", priority: "0.5", changefreq: "weekly" },
  { path: "/premium", priority: "0.7", changefreq: "weekly" },
];

// Categories
const categoriesContent = readFileSync(join(ROOT, "src", "data", "categories.ts"), "utf-8");
for (const slug of extractSlugs("categories.ts")) {
  urls.push({ path: `/category/${slug}`, priority: "0.7", changefreq: "weekly" });
}

// Businesses
const listingsContent = readFileSync(join(ROOT, "src", "data", "listings.ts"), "utf-8");
for (const slug of extractSlugs("listings.ts")) {
  const createdAt = extractField(listingsContent, slug, "createdAt") || "2026-01-01";
  urls.push({ path: `/business/${slug}`, priority: "0.9", changefreq: "weekly", lastmod: createdAt });
}

// Blog posts
const blogContent = readFileSync(join(ROOT, "src", "data", "blog.ts"), "utf-8");
for (const slug of extractSlugs("blog.ts")) {
  const date = extractField(blogContent, slug, "date") || "2026-01-01";
  urls.push({ path: `/blog/${slug}`, priority: "0.7", changefreq: "monthly", lastmod: date });
}

// Events
const eventsContent = readFileSync(join(ROOT, "src", "data", "events.ts"), "utf-8");
for (const slug of extractSlugs("events.ts")) {
  const date = extractField(eventsContent, slug, "date") || "2026-01-01";
  urls.push({ path: `/events/${slug}`, priority: "0.7", changefreq: "monthly", lastmod: date });
}

// --- Generate XML ---
const today = new Date().toISOString().split("T")[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${BASE_URL}${u.path}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

if (!existsSync(DIST)) {
  mkdirSync(DIST, { recursive: true });
}
writeFileSync(join(DIST, "sitemap.xml"), xml, "utf-8");
console.log(`✅ Generated sitemap.xml with ${urls.length} URLs`);
console.log(`   Submit to Google Search Console: ${BASE_URL}/sitemap.xml`);
