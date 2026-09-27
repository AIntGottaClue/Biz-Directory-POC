import { describe, it, expect } from 'vitest';
import { cities, cityForPath, cityPath } from '../data/cities';
import { businesses } from '../data/listings';
import { getBySlug, searchBusinesses, getByCategory } from '../data/helpers';
import { seoFor } from '../lib/seo';
import { localPath } from '../lib/router';

describe('multi-city routing and data isolation', () => {
  it('keeps Round Rock root routes and prefixes two added cities', () => {
    expect(cities.map(c=>c.slug)).toEqual(['round-rock','georgetown','pflugerville']);
    expect(cityPath('round-rock','/business/example')).toBe('/business/example');
    expect(cityPath('georgetown','/business/example')).toBe('/georgetown/business/example');
    expect(cityForPath('/pflugerville/search').slug).toBe('pflugerville');
    expect(localPath('/search?q=cafe','/georgetown')).toBe('/georgetown/search?q=cafe');
    expect(localPath('/','/georgetown/business/example')).toBe('/georgetown');
  });
  it('does not leak listings between hubs', () => {
    expect(getBySlug('cedar-lantern-cafe','round-rock')).toBeUndefined();
    expect(getBySlug('cedar-lantern-cafe','georgetown')?.city).toBe('Georgetown');
    expect(searchBusinesses('cedar lantern','pflugerville')).toHaveLength(0);
    expect(getByCategory('restaurants','pflugerville').every(b=>b.citySlug==='pflugerville')).toBe(true);
    expect(businesses.filter(b=>b.citySlug==='georgetown')).toHaveLength(3);
    expect(businesses.filter(b=>b.citySlug==='pflugerville')).toHaveLength(3);
  });
  it('uses the current city in page metadata', () => {
    expect(seoFor('home','/georgetown').title).toContain('Georgetown');
    expect(seoFor('business','/pflugerville/business/copper-creek-electric').title).toContain('Pflugerville');
    expect(seoFor('category','/pflugerville/category/dentist').noIndex).toBe(true);
  });
});
