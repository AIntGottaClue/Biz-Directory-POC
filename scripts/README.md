# Pre-Rendering & SEO Scripts

These scripts generate **fully-rendered static HTML** and a sitemap so search engines can crawl your site without executing JavaScript.

## Quick Start

After downloading the project and installing dependencies:

```bash
npm install                    # install project dependencies
npm install puppeteer          # install the pre-rendering engine
npm run build                  # build the React app into dist/
node scripts/prerender.mjs    # render every page to static HTML
node scripts/generate-sitemap.mjs https://myroundrock.com  # generate sitemap.xml
```

Then deploy the `dist/` folder to your hosting provider.

> **Pass your domain** as an argument to both scripts so canonical URLs and sitemap entries are correct:
> ```bash
> node scripts/prerender.mjs https://myroundrock.com
> node scripts/generate-sitemap.mjs https://myroundrock.com
> ```
> If you omit the domain, it defaults to `https://YOURDOMAIN.com` (a placeholder).

## What the Pre-Render Script Does

The pre-render script uses **Puppeteer** (a headless Chrome browser) to:

1. Start a local static server serving your built `dist/` folder
2. Launch a headless browser
3. Visit every route (homepage, categories, business listings, blog posts, events)
4. Wait for React to render and `react-helmet-async` to inject all SEO meta tags
5. Save the complete, fully-rendered HTML to `dist/`

### Output structure (clean URLs)

```
dist/
  index.html                    ← homepage
  categories/index.html          ← /categories
  blog/index.html                ← /blog
  events/index.html              ← /events
  search/index.html              ← /search
  premium/index.html             ← /premium
  category/
    med-spa/index.html           ← /category/med-spa
    dentist/index.html           ← /category/dentist
    ...
  business/
    lumiere-med-spa/index.html   ← /business/lumiere-med-spa
    ...
  blog/
    best-med-spas-round-rock-2026/index.html
    ...
  events/
    round-rock-farmers-market/index.html
    ...
```

Each HTML file includes:
- Fully rendered page content (text, images, headings — all visible to crawlers)
- Proper `<title>` and `<meta description>` (injected by SEOHead/Helmet)
- Canonical URL
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- JSON-LD structured data (LocalBusiness schema for listings, BlogPosting for blog posts, Event for events)

### Excluded routes

- `/download` — dev utility, not for public indexing
- `/claim-listing` — form page, not for search index

## What the Sitemap Generator Does

Reads the same data files and generates `dist/sitemap.xml` with all URLs, change frequency, and priority. Submit this to:

1. **Google Search Console**: https://search.google.com/search-console
2. **Bing Webmaster Tools**: https://www.bing.com/webmasters

## Important Notes

- **Update BASE_URL**: Pass your real domain as an argument, or edit the `BASE_URL` variable in both scripts.

- **Run after every content change**: Any time you add/remove listings, blog posts, or events, re-run both scripts before deploying.

- **The React app still works**: The static HTML files are for crawlers. When a real visitor loads the page, the React app takes over (client-side hydration). Both the static HTML and the React app serve the same content.

- **No server required**: The generated files are plain HTML. You can host them on any static hosting (Netlify, Vercel, GitHub Pages, S3, Cloudflare Pages, etc.).

- **Puppeteer downloads its own Chromium**: The first `npm install puppeteer` will download a compatible Chromium binary (~170MB). This is a one-time download.

## Workflow Summary

```
Edit data files (listings.ts, blog.ts, events.ts)
        ↓
npm run build
        ↓
node scripts/prerender.mjs https://myroundrock.com
        ↓
node scripts/generate-sitemap.mjs https://myroundrock.com
        ↓
Deploy dist/ folder
        ↓
Submit sitemap.xml to Google Search Console
```

## Troubleshooting

**"Puppeteer is not installed"**
→ Run `npm install puppeteer`

**"dist/index.html not found"**
→ Run `npm run build` first

**Pages timing out**
→ Some pages may take longer to render. The script waits 30 seconds per page. If you have hundreds of listings, this could take a few minutes.

**Clean URL vs .html routing**
→ The script generates `dist/business/lumiere-med-spa/index.html` (clean URL format). Most static hosts (Netlify, Vercel, Cloudflare Pages) automatically serve `index.html` for clean URLs. If your host doesn't, check their "SPA fallback" or "pretty URLs" setting.
