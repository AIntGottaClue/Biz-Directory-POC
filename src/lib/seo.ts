import { cityForPath } from '@/data/cities';
import { categories } from '@/data/categories';
import { businesses } from '@/data/listings';
import { blogPosts } from '@/data/blog';
import { events } from '@/data/events';
import { HERO_IMAGE, getCategoryListingsSorted } from '@/data/helpers';
const image = 'https://vibe.filesafe.space/1787129704745061268/assets/f3b01469-304a-4178-8552-9350d727a55b.png';
export function seoFor(page: string, path: string) {
  const city = cityForPath(path);
  const local = city.prefix ? path.slice(city.prefix.length) || '/' : path;
  const slug = local.split('/')[2];
  const common = (title: string, description: string, ogImage=image, noIndex=false, schemaJson?:Record<string,unknown>) => ({title,description,ogImage,noIndex,schemaJson});
  if(page==='home') return common(`${city.name}, TX Business Directory`, `Explore sample local listings in ${city.name}, Texas. Browse businesses by category.`,HERO_IMAGE,false,{'@context':'https://schema.org','@type':'CollectionPage',name:`${city.name}, TX Business Directory`,url:path,about:{'@type':'City',name:`${city.name}, TX`}});
  if(page==='categories') return common('All Categories',`Browse business categories in ${city.name}, TX.`);
  if(page==='category') { const c=categories.find(c=>c.slug===slug); return c ? common(c.name,`${c.blurb} - ${getCategoryListingsSorted(c.slug, city.slug).length} businesses in ${city.name}, TX. Browse ${c.name.toLowerCase()} listings.`,c.image, getCategoryListingsSorted(c.slug, city.slug).length === 0,{'@context':'https://schema.org','@type':'CollectionPage',name:`${c.name} in ${city.name}, TX`,description:c.blurb,url:path}) : common('Category not found','Category not found'); }
  if(page==='business') {const b=businesses.find(b=>b.slug===slug && b.citySlug===city.slug);if(b){const state=({'Texas':'TX','California':'CA','New York':'NY'} as Record<string,string>)[b.state || '']||b.state||'TX';const clean=b.description.replace(/\{\{embed:\w+(?:\|[^}]+)?\}\}/g,'').replace(/\{\{image:[^}]+\}\}/g,'').replace(/\n+/g,' ').replace(/\s+/g,' ').trim();return common(`${b.name} - ${b.categoryName} in ${b.city||city.name}, ${state} | Round Rock Local`,clean.slice(0,160),b.image,false,{'@context':'https://schema.org','@type':'LocalBusiness',name:b.name,description:clean,image:b.image,url:path,telephone:b.phone,...(b.address ? {address:{'@type':'PostalAddress',streetAddress:b.address,addressLocality:b.city,addressRegion:b.state,postalCode:b.zip,addressCountry:'US'}} : {})});} }
  if(page==='blog') return common('Blog',`Guides and local stories for ${city.name}, Texas.`,image,!blogPosts.some(p=>p.citySlug===city.slug));
  if(page==='post') {const p=blogPosts.find(p=>p.slug===slug && p.citySlug===city.slug);if(p)return common(p.title,p.excerpt,p.image,false,{'@context':'https://schema.org','@type':'BlogPosting',headline:p.title,description:p.excerpt,datePublished:p.date,author:{'@type':'Organization',name:p.author},image:p.image,url:path});}
  if(page==='events') return common('Events',`Community events in ${city.name}, Texas.`,image,!events.some(e=>e.citySlug===city.slug));
  if(page==='event') {const e=events.find(e=>e.slug===slug && e.citySlug===city.slug);if(e)return common(e.title,e.description,e.image,false,{'@context':'https://schema.org','@type':'Event',name:e.title,description:e.description,startDate:`${e.date}T${e.time.replace(/[^\d:APM]/g,'')}`,image:e.image,location:{'@type':'Place',name:e.location,address:e.address}});}
  if(page==='claim') {const b=businesses.find(b=>b.slug===slug && b.citySlug===city.slug);return common(b?`Claim ${b.name}`:'Claim Listing',b?`Claim ownership of ${b.name} on Round Rock Local. Verify your business and update your listing information.`:'Claim your business listing on Round Rock Local.',image,true);}
  if(page==='search') return common('Search',`Search businesses in ${city.name}, TX by name, service, or category.`,image,true);
  if(page==='premium')return common('Premium Listings',`Browse premium listings in ${city.name}, TX.`,image,!businesses.some(b=>b.citySlug===city.slug && b.premium));
  const extras:Record<string,[string,string]>={download:['Download Project — Round Rock Local','Generate static HTML pages for all listings, blogs, and events, then download the full project ZIP.'],data:['Data Explorer — Round Rock Local','View and export all listings, blogs, events, and categories data.'],source:['Download Source Files — Round Rock Local','Export all custom source files into a single downloadable text file.'],nexus:['Nexus — Round Rock Local','Internal utility hub for hidden tools and pages.'],notfound:['Page Not Found','The page you are looking for does not exist.']};
  const [title,description]=extras[page]||extras.notfound;return common(title,description,image,true);
}
