export interface SEOHeadProps { title: string; description: string; canonical: string; ogImage?: string; noIndex?: boolean; schemaJson?: Record<string, unknown> }
// The Astro layout emits canonical/meta/JSON-LD in the static HTML. Keep page calls
// as-is so the content components need no copy or layout changes.
export default function SEOHead(_props: SEOHeadProps) { return null; }
