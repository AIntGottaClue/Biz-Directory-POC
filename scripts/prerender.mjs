/**
 * ============================================================
 *  PRE-RENDER SCRIPT (Puppeteer) — generates fully-rendered
 *  static HTML for every page so search engines can crawl
 *  your content WITHOUT executing JavaScript.
 *
 *  This is TRUE pre-rendering: it launches a headless browser,
 *  visits each route, waits for React to render + react-helmet-async
 *  to inject all SEO meta tags, then saves the complete HTML.
 *
 *  HOW TO USE (run on your computer after downloading the project):
 *
 *    1. Install Node.js (if you don't have it): https://nodejs.org
 *    2. Open a terminal in the project folder
 *    3. Run:  npm install
 *    4. Run:  npm install puppeteer
 *    5. Run:  npm run build
 *    6. Run:  node scripts/prerender.mjs
 *
 *  Then deploy the dist/ folder to your hosting provider.
 *
 *  OPTIONAL: Pass your domain as an argument:
 *    node scripts/prerender.mjs https://myroundrock.com
 *  (This replaces YOURDOMAIN.com in canonical/OG URLs)
 * ============================================================
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");

// --- Configuration ---
// Use command-line arg, or fall back to placeholder
const BASE_URL = process.argv[2] || "https://YOURDOMAIN.com";
const SITE_NAME = "Round Rock Local";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SERVER_PORT = 4173; // Vite preview port
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

// --- Validate dist/ exists ---
if (!existsSync(join(DIST, "index.html"))) {
  console.error("❌ dist/index.html not found. Run `npm run build` first.");
  process.exit(1);
}

// --- Extract slugs from data files via regex (no TS compiler needed) ---
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

// --- Collect all routes to pre-render ---
const listingsContent = readFileSync(join(ROOT, "src", "data", "listings.ts"), "utf-8");
const blogContent = readFileSync(join(ROOT, "src", "data", "blog.ts"), "utf-8");
const eventsContent = readFileSync(join(ROOT, "src", "data", "events.ts"), "utf-8");
const categoriesContent = readFileSync(join(ROOT, "src", "data", "categories.ts"), "utf-8");

const businessSlugs = extractSlugs("listings.ts");
const blogSlugs = extractSlugs("blog.ts");
const eventSlugs = extractSlugs("events.ts");
const categorySlugs = (categoriesContent.match(/slug:\s*"([^"]+)"/g) || [])
  .map((s) => s.match(/"([^"]+)"/)[1]);

// Build the full list of routes
const routes = [
  "/",
  "/categories",
  "/blog",
  "/events",
  "/search",
  "/premium",
  // NOTE: /download and /claim-listing are excluded from pre-rendering
  // /download is a dev utility, /claim-listing should not be indexed
];

// Add category routes
for (const slug of categorySlugs) {
  routes.push(`/category/${slug}`);
}

// Add business listing routes
for (const slug of businessSlugs) {
  routes.push(`/business/${slug}`);
}

// Add blog routes
for (const slug of blogSlugs) {
  routes.push(`/blog/${slug}`);
}

// Add event routes
for (const slug of eventSlugs) {
  routes.push(`/events/${slug}`);
}

console.log(`\n📦 Found ${routes.length} routes to pre-render`);
console.log(`   ${categorySlugs.length} categories, ${businessSlugs.length} businesses, ${blogSlugs.length} blogs, ${eventSlugs.length} events\n`);

// --- Main pre-rendering logic ---
async function main() {
  // Dynamically import puppeteer (so the script doesn't crash if not installed)
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    console.error("❌ Puppeteer is not installed.");
    console.error("   Run: npm install puppeteer");
    process.exit(1);
  }

  // Start a local static file server for the dist/ folder
  // We use a tiny inline server to avoid requiring a dependency
  const http = await import("http");
  const { lookup } = await import("mimes");

  const server = http.createServer((req, res) => {
    let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

    // SPA fallback: if the file doesn't exist, serve index.html
    if (!existsSync(filePath)) {
      // Try with .html extension
      if (existsSync(filePath + ".html")) {
        filePath = filePath + ".html";
      } else {
        filePath = join(DIST, "index.html");
      }
    }

    const ext = filePath.split(".").pop();
    const contentType = lookup(ext) || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(readFileSync(filePath));
  });

  await new Promise((resolve) => server.listen(SERVER_PORT, resolve));
  console.log(`🚀 Local server running at ${SERVER_URL}\n`);

  // Launch headless browser
  const browser = await puppeteer.default.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let count = 0;
  let failed = 0;

  for (const route of routes) {
    const page = await browser.newPage();

    // Set a desktop user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    try {
      // Navigate to the route
      await page.goto(`${SERVER_URL}${route}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Wait for react-helmet-async to inject meta tags
      await page.waitForSelector("title", { timeout: 10000 });

      // Give helmet a moment to settle
      await new Promise((r) => setTimeout(r, 500));

      // Get the full rendered HTML
      const html = await page.content();

      // Replace the local server URL with the production domain
      const finalHtml = html
        .replace(new RegExp(SERVER_URL, "g"), BASE_URL)
        .replace(/http:\/\/localhost:4173/g, BASE_URL);

      // Determine the output file path
      // For SPA routes like /business/lumiere-med-spa, we create:
      //   dist/business/lumiere-med-spa/index.html  (for clean URLs)
      const parts = route.split("/").filter(Boolean);
      let outputDir, outputFile;

      if (parts.length === 0) {
        // Root route: dist/index.html
        outputDir = DIST;
        outputFile = join(DIST, "index.html");
      } else {
        // Sub-routes: dist/{path}/index.html
        outputDir = join(DIST, ...parts);
        outputFile = join(outputDir, "index.html");
      }

      mkdirSync(outputDir, { recursive: true });
      writeFileSync(outputFile, finalHtml, "utf-8");

      count++;
      console.log(`  ✓ ${route}`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${route} — ${err.message}`);
    }

    await page.close();
  }

  await browser.close();
  server.close();

  console.log(`\n✅ Pre-rendered ${count} pages into dist/`);
  if (failed > 0) {
    console.log(`⚠️  ${failed} pages failed — check errors above`);
  }
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Run: node scripts/generate-sitemap.mjs ${BASE_URL}`);
  console.log(`   2. Deploy the dist/ folder to your hosting provider`);
  console.log(`   3. Submit sitemap.xml to Google Search Console\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
