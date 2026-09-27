# Build scripts

`npm run build` runs Astro's static build and then `scripts/generate-sitemap.mjs` for `dist/sitemap.xml`. The Puppeteer/Vite preview prerender step is no longer needed: Astro writes every directory route to static HTML. To target a different domain, change the URL passed to the sitemap generator in `package.json` and update the Astro site and canonical URL settings described in the project README.
