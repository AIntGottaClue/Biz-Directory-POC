import { Helmet } from "react-helmet-async";

const SITE_NAME = "Round Rock Local";
const DEFAULT_OG_IMAGE =
  "https://vibe.filesafe.space/1787129704745061268/assets/f3b01469-304a-4178-8552-9350d727a55b.png";
const BASE_URL = "https://roundrocklocal.com"; // ← Replace with your real domain

export interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string; // path, e.g. "/" or "/blog/some-post"
  ogImage?: string;
  noIndex?: boolean;
  schemaJson?: Record<string, unknown>;
}

/**
 * Centralized SEO meta tag manager.
 * Place at the top of every page, before the main content.
 * All title/description/canonical/og:/twitter: tags are managed here,
 * so index.html should NOT contain any of those.
 */
export default function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  noIndex = false,
  schemaJson,
}: SEOHeadProps) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} - ${SITE_NAME}`;

  const url = `${BASE_URL}${canonical}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      {/* Title */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {schemaJson && (
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      )}
    </Helmet>
  );
}
