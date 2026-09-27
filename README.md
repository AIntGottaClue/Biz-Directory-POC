# Round Rock Local (Astro)

The Round Rock business directory is a static Astro site. The original React/Tailwind components, copy, data, layout, and CSS are preserved. Astro owns the routes and generates HTML for each listing, category, post, event, and claim page; `@astrojs/react` hydrates the interactive React shell for search, menus, filters, forms, galleries, and theme controls.

## Run locally

```sh
npm install
npm run dev
```

## Build and deploy to Cloudflare Pages

```sh
npm run build
```

Set the Cloudflare Pages build command to `npm run build` and output directory to `dist`. The generated site needs no server runtime. `npm run build` also refreshes `dist/sitemap.xml` from the existing sitemap generator, using `https://roundrocklocal.com`. If deploying to another domain, update `site` in `astro.config.mjs`, the base URL in `src/layouts/Base.astro`, and the sitemap URL passed by the build script in `package.json`.

## Project layout

- `src/pages/**/*.astro`: file-based static routes, including dynamic `getStaticPaths` routes.
- `src/layouts/Base.astro`: shared document head, SEO tags, styles, theme bootstrap, and React island.
- `src/components/AstroShell.tsx`: original page layout, providers, and page component selection.
- `src/views/*.tsx`: existing React page content, kept intact.
- `src/data`, `src/components`, `src/index.css`, `src/App.css`, `tailwind.config.ts`: original data, UI and styles.
- `scripts/generate-sitemap.mjs`: sitemap builder. The old Puppeteer prerender script is gone because Astro builds route HTML directly.

The `/download` and `/download-source` utility screens are preserved as they were. `/download` still creates its own legacy standalone export in the browser; it is not the Astro/Cloudflare Pages project. Use this repository or its zip for the Astro source.

## Multi-city test

Round Rock retains its existing root URLs (`/`, `/business/:slug`, `/category/:slug`, `/blog`, `/events`, `/search`). Georgetown and Pflugerville use city prefixes (`/georgetown/...`, `/pflugerville/...`), including listings, categories, search, premium, blog, events and claim routes. This avoids changing existing Round Rock links or needing redirects. The existing brand is deliberately unchanged; the city picker in the header moves between hubs.

`src/data/cities.ts` is the city registry and route prefix source. `src/data/listings.ts` stores each business with a `citySlug` and a human-readable `city`. Posts and events also have a `citySlug`; existing posts and events remain Round Rock only. City-aware helpers filter home cards, search, category lists, related content and detail lookups. Shared React links resolve to the current city prefix; the `[city]/[...rest].astro` route generates city pages at build time. SEO metadata and canonicals use the city path and the sitemap is generated from actual built canonical, indexable pages. Empty categories, blog and events pages are noindex and excluded from the sitemap until they have content.

To add city #4: add `{ slug, name, prefix }` to `src/data/cities.ts`, add sample or real businesses in `src/data/listings.ts` with that city slug and matching `city`, and optionally tag events and blog posts in their data files. Run `npm run build`. The city route generator and switcher pick up the new city automatically; the sitemap follows built pages. Add city-specific artwork and real copy before publishing a real hub. New-city businesses here are explicitly fictional sample entries with no contact information, addresses, ratings, or verification claims.

The site's `/download` screen remains a legacy standalone exporter and does not generate this Astro multi-city project. For GitHub, use this source repository / zip instead. The delivery zip includes a ready-to-serve `dist/` folder: from the project directory, run `python3 -m http.server 8080 --directory dist` and open `http://localhost:8080`.
