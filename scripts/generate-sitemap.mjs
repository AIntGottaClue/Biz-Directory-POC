/** Generate sitemap from actual built pages, not a second hardcoded slug list. */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
const dist = new URL('../dist/', import.meta.url).pathname;
const site = (process.argv[2] || 'https://roundrocklocal.com').replace(/\/$/, '');
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, {withFileTypes:true})) {
    const file = join(dir,entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'index.html') files.push(file);
  }
}
walk(dist);
const urls = files.flatMap(file => {
  const html = readFileSync(file,'utf8');
  if (/<meta name="robots" content="noindex/.test(html)) return [];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const path = relative(dist,file).replace(/(?:^|\/)index\.html$/,'').replace(/\/$/,'');
  const expected = site + (path ? '/' + path : '/');
  return canonical === expected ? [canonical] : [];
});
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.sort().map(url => `  <url><loc>${url.replaceAll('&','&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(join(dist,'sitemap.xml'),xml);
console.log(`Generated sitemap.xml with ${urls.length} canonical, indexable built pages`);
