/** Single registry for city routes and display names. Round Rock keeps its legacy root URLs. */
export const cities = [
  { slug: 'round-rock', name: 'Round Rock', prefix: '' },
  { slug: 'georgetown', name: 'Georgetown', prefix: '/georgetown' },
  { slug: 'pflugerville', name: 'Pflugerville', prefix: '/pflugerville' },
] as const;
export type CitySlug = typeof cities[number]['slug'];
export const cityForPath = (path: string) => cities.find(c => c.prefix && (path === c.prefix || path.startsWith(c.prefix + '/'))) || cities[0];
export const cityBySlug = (slug: string) => cities.find(c => c.slug === slug);
export const cityPath = (slug: CitySlug, path = '/') => {
  const prefix = cityBySlug(slug)?.prefix || '';
  return path === '/' ? (prefix || '/') : prefix + path;
};
export const cityForName = (name?: string) => cities.find(c => c.name === name)?.slug || 'round-rock';
export const isCityContent = (path: string) => /^\/(?:business|claim|category|categories|search|premium|blog|events)(?:\/|\?|$)/.test(path);
