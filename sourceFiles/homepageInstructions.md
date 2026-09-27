# Homepage Design Instructions

> Complete reference for rebuilding the homepage (`src/pages/Home.tsx`) of the **Round Rock Local** business directory.

---

## 1. Overview & Structure

The homepage is a single React component (`Home`) rendered at route `/`. It is a full-bleed page (no top padding — the hero extends under the fixed header). The page is divided into **5 visual sections**, top to bottom:

1. **Hero** — dark navy, full-bleed, search bar + category quick-links
2. **Top Categories** — bento grid of image-backed category tiles
3. **Featured Listings** — premium businesses in a card grid (banded section)
4. **Latest Listings** — newest businesses in a card grid (container section)
5. **Community Pulse** — split layout: upcoming events (left) + latest blog posts (right)

The page wraps a `<SEOHead>` component at the top for all meta tags, canonical, Open Graph, Twitter Card, and JSON-LD structured data.

### Data sources

| Data | Import | Helper |
|---|---|---|
| Featured businesses (premium) | `@/data/helpers` | `getFeatured(8)` |
| Latest businesses | `@/data/helpers` | `getLatest(8)` |
| Categories | `@/data/categories` | `categories` array (first 4 for hero pills, first 10 for bento) |
| Upcoming events | `@/data/events` | sorted by date ascending, sliced to 3 |
| Latest blog posts | `@/data/blog` | sorted by date descending, sliced to 3 |
| Hero background image | `@/data/helpers` | `HERO_IMAGE` constant (cloud-hosted URL) |

---

## 2. Typography & Fonts

Fonts are loaded via Google Fonts in `src/index.css`:

| Token | Font | Weights | Usage |
|---|---|---|---|
| `font-display` (`.font-display`) | **Outfit** | 400–800 | All headings (h1–h4, section titles) |
| `font-body` (default body) | **Figtree** | 400–700 | Body text, paragraphs, UI labels |
| `Space Mono` | Space Mono | 400, 700 | Loaded but not used on homepage |

Global CSS rules:
- `h1`–`h6` use `font-family: "Outfit"` with `letter-spacing: -0.02em`
- `body` uses `font-family: "Figtree"` with `-webkit-font-smoothing: antialiased`

### Heading sizes (homepage)

| Element | Classes | Size |
|---|---|---|
| Hero H1 | `font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl leading-[1.1]` | 36px → 48px → 60px |
| Section H2 | `font-display text-3xl font-bold md:text-4xl` | 30px → 36px |
| Subsection H3 | `font-display text-xl font-bold` | 20px |
| Bento tile H3 | `font-display font-semibold` | inherited (base) |
| Card title (ListingCard) | `font-display text-base font-semibold` | 16px |

### Body text

| Element | Classes |
|---|---|
| Hero subtitle | `text-base sm:text-lg text-white/70 max-w-xl font-medium` |
| Section subtitle | `text-muted-foreground` |
| Eyebrow label | `text-sm font-medium text-accent` (with a small lucide icon) |
| Bento blurb | `text-xs text-white/80` |

---

## 3. Color System

All colors use **OKLCH** semantic tokens defined in `src/index.css`. Never use raw hex in components except for fixed brand constants (`#0f172a` for navy, `#e5a84b` for the event date block).

### Light mode tokens (key values)

| Token | OKLCH | Usage |
|---|---|---|
| `--background` | `oklch(0.985 0.005 240)` | Page background |
| `--foreground` | `oklch(0.18 0.04 250)` | Primary text |
| `--card` | `oklch(1 0 0)` | Card surfaces |
| `--primary` | `oklch(0.2 0.04 250)` | Deep navy |
| `--accent` | `oklch(0.78 0.16 75)` | Gold/amber accent |
| `--accent-foreground` | `oklch(0.2 0.04 250)` | Text on accent |
| `--premium` | `oklch(0.78 0.16 75)` | Premium badge (same as accent) |
| `--muted` | `oklch(0.96 0.01 240)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.48 0.02 250)` | Secondary text |
| `--border` | `oklch(0.92 0.008 240)` | Borders |
| `--sage` | `oklch(0.68 0.09 130)` | Sage green (category icons in dropdown) |

### Dark mode

Dark mode swaps `--background` to `oklch(0.16 0.04 250)` (deep navy) and inverts foreground/card/border tokens. The hero section stays fixed dark navy `#0f172a` in both modes.

### Fixed brand colors (not tokenized)

| Hex | Usage |
|---|---|
| `#0f172a` | Hero background, header background on scroll, footer background |
| `#e5a84b` | Event date block background (gold) |

---

## 4. Layout & Spacing

### Container

- **Class:** `container mx-auto px-4`
- **Max width:** Tailwind default `container` (max-width follows breakpoints: `sm:max-w-[640px]` → `md:max-w-[768px]` → `lg:max-w-[1024px]` → `xl:max-w-[1280px]` → `2xl:max-w-[1400px]`)

### Hero inner content

- **Class:** `mx-auto max-w-[1400px] px-5`
- Matches the header's content width (`max-w-[1400px] px-5`) so the hero text aligns with the logo.

### Section vertical padding

| Section | Padding |
|---|---|
| Hero | `pt-24 pb-16` (plus `min-h-[580px] lg:min-h-[640px]`) |
| Top Categories | `py-16 md:py-20` |
| Featured Listings | `py-16 md:py-20` |
| Latest Listings | `py-16 md:py-20` |
| Community Pulse | `py-16 md:py-20` |

### Section header pattern

Each content section (Categories, Featured, Latest) uses the same header layout:

```
<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
      <Icon className="h-4 w-4" /> Eyebrow Label
    </span>
    <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Section Title</h2>
    <p className="mt-2 text-muted-foreground">Subtitle text</p>
  </div>
  <Button variant="ghost" className="self-start sm:self-auto group">
    Link text
    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </Button>
</div>
```

### Banded vs container sections

- **Banded sections** (Featured, Community Pulse): `border-y border-border/50 bg-muted/30` — full-bleed background with subtle border top/bottom
- **Container sections** (Top Categories, Latest): plain `container` — no band

---

## 5. Hero Section — Detailed

### Container

```
<section className="relative bg-[#0f172a] text-white">
  <div className="relative min-h-[580px] pt-24 pb-16 flex items-center lg:min-h-[640px]">
```

### Background layers (stacked, z-index order)

1. **Hero image** — `absolute inset-0 h-full w-full object-cover opacity-25` (25% opacity)
2. **Gradient overlay** — `absolute inset-0 bg-gradient-to-b from-[#0f172a]/60 via-[#0f172a]/80 to-[#0f172a]` (fades from 60% → 80% → 100% navy, top to bottom)
3. **Content** — `relative z-10 mx-auto max-w-[1400px] px-5 flex flex-col items-start text-left w-full`

### Content elements (in order)

1. **H1** — `Find real local Round Rock businesses.`
   - Classes: `font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-3xl leading-[1.1]`
   - Animation: `motion.h1` with `initial={{ opacity: 0, y: 16 }}` → `animate={{ opacity: 1, y: 0 }}` (`duration: 0.5`)

2. **Subtitle** — `Free to list • Local-first results • Manually checked`
   - Classes: `mt-4 text-base sm:text-lg text-white/70 max-w-xl font-medium`
   - Animation: same fade-up, `delay: 0.1`

3. **Search bar** — `<SearchBar variant="hero" />` wrapped in `mt-8 w-full max-w-3xl`
   - Animation: `delay: 0.2`

4. **Category quick-links** — first 4 categories as pill links
   - Container: `mt-5 flex flex-wrap gap-2.5`
   - Each pill: `rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/10 hover:text-white`
   - Links to `/category/${slug}`
   - Animation: `delay: 0.3`

### SearchBar (hero variant)

- **Wrapper:** `relative z-[200] w-full max-w-2xl` (z-200 to overlay above body content)
- **Form container:** `flex items-center rounded-full p-2 glass-strong shadow-[0_8px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/20`
- **Search icon:** `ml-4 h-5 w-5 text-white/60`
- **Input:** `border-0 bg-transparent px-4 py-3 text-base text-white placeholder:text-white/50 focus-visible:ring-0`
- **Submit button:** `rounded-full bg-accent text-accent-foreground px-7 py-3 text-base font-semibold shadow-md hover:bg-accent/90`
- **Dropdown:** `absolute left-0 right-0 top-full z-[200] mt-2 overflow-y-auto max-h-[400px] rounded-xl border border-border bg-popover shadow-xl`
  - When no query is typed, shows all 20 categories with business counts
  - When typing, shows matching categories, businesses, and keywords
  - Keyboard navigation: ArrowUp/ArrowDown to move, Enter to select, Escape to close

---

## 6. Top Categories — Bento Grid

### Grid

```
<div className="grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
```

- Shows first **10** categories
- Each tile: `motion.button` with `whileInView` fade-up animation (staggered by index × 0.06s)
- Rows are **180px** tall
- Items at index 0 and 5 are "feature" tiles: `row-span-2` (double height = 360px + gap)

### Tile structure

```
<motion.button className="group relative flex flex-col items-start justify-end gap-2 overflow-hidden rounded-2xl border border-border/60 p-5 text-left card-lift hover:border-accent/50 hover:shadow-xl hover:glow-sm [isFeature ? 'row-span-2' : '']">
```

1. **Background image** (if category has `image`):
   - `<img className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />`
   - Gradient overlay: `absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10`
2. **Feature glow blob** (only on feature tiles): `absolute right-4 top-4 h-20 w-20 rounded-full bg-accent/10 blur-2xl`
3. **Icon badge:** `relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20 transition-all group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent group-hover:shadow-lg`
   - Icon: lucide icon from `cat.icon` name, `h-5 w-5`
   - Falls back to `Store` if icon name not found
4. **Label:** `font-display font-semibold text-white drop-shadow-sm` + blurb `text-xs text-white/80 drop-shadow-sm`
5. **Hover arrow:** `ArrowRight` at `absolute bottom-4 right-4`, opacity 0 → 100% on hover, slides right

### `card-lift` utility

Defined in `src/index.css`:
```css
.card-lift {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}
.card-lift:hover {
  transform: translateY(-6px);
}
```

### `glow-sm` utility

```css
.glow-sm {
  box-shadow: 0 0 20px -5px var(--glow);
}
```

---

## 7. Featured & Latest Listings — Card Grid

### Grid

Both sections use the same grid:
```
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

### Featured section extras

- Banded: `border-y border-border/50 bg-muted/30`
- Decorative blur: `absolute -top-32 left-1/2 -z-10 h-64 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]`
- Eyebrow uses `text-premium` color and `TrendingUp` icon
- Shows 8 premium businesses via `getFeatured(8)`

### Latest section

- Container (no band)
- Eyebrow uses `text-accent` color and `Clock` icon
- Shows 8 newest businesses via `getLatest(8)` (sorted by `createdAt` descending)

### ListingCard component

Renders a `<Link to="/business/${slug}">` wrapping a `<Card>`. Key details:

- **Card:** `relative flex h-full flex-col overflow-hidden border-border/60 p-0` with hover lift (`hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-2xl`)
- **Image:** `aspect-[4/3]` with `object-cover`, `group-hover:scale-110` zoom on hover
- **Image overlay:** gradient from `black/50` bottom to transparent top
- **Badges (top of image):** Premium (gold `bg-premium`) left + Verified (green `bg-green-600`) right
- **Body:** `p-4` with name, rating stars, location, description (120-char truncate with "more/less" toggle), and category badges
- **Rating:** `Star` icon in `fill-premium text-premium` with decimal rating + review count in parens
- **Open/closed:** green dot (`bg-green-600`) with `animate-pulse` + "Open" or red (`bg-destructive`) + "Closed"
- **Description limit:** 120 characters, with inline "more"/"less" toggle button

---

## 8. Community Pulse — Events + Blog

### Layout

```
<div className="grid gap-8 lg:grid-cols-2">
```

Two equal columns: **Upcoming Events** (left) and **From the Blog** (right).

### Section header

Centered (unlike other sections):
```
<div className="mb-10 text-center">
```
- Eyebrow: `Heart` icon, `text-accent`
- H2: `What's Happening in Round Rock`

### Decorative blurs

- Top-right: `absolute -top-32 right-1/4 -z-10 h-64 w-[500px] rounded-full bg-accent/10 blur-[100px]`
- Bottom-left: `absolute -bottom-32 left-1/4 -z-10 h-64 w-[500px] rounded-full bg-primary/10 blur-[100px]`

### Event card

```
<Link className="group flex items-stretch gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card card-lift hover:border-accent/40 hover:shadow-lg">
```

- **Date block:** `w-16 shrink-0` column, `bg-[#e5a84b] text-[#0f172a]`
  - Day number: `font-display text-2xl font-bold`
  - Month: `text-xs font-medium uppercase tracking-wider`
- **Thumbnail:** `w-28 shrink-0` (hidden on mobile: `hidden sm:block`), `group-hover:scale-110`
- **Content:** category label (accent, uppercase), title (`group-hover:text-accent`), location with `MapPin` icon
- **Chevron:** `ChevronRight` at right, `group-hover:translate-x-1 group-hover:text-accent`
- Shows 3 upcoming events, sorted by date ascending

### Blog card

```
<Link className="group flex items-stretch gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card card-lift hover:border-accent/40 hover:shadow-lg">
```

- **Thumbnail:** `w-28 shrink-0` (always visible), `group-hover:scale-110`
- **Content:** category label (accent, uppercase), title (`line-clamp-2`, `group-hover:text-accent`), read time + date
- **Chevron:** same as event card
- Shows 3 latest posts, sorted by date descending

---

## 9. Animation System

All entrance animations use **Framer Motion** with a shared `fadeUp` variant:

```ts
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,   // stagger by index
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],  // cubic-bezier "easeOutExpo"-like
    },
  }),
};
```

### Usage pattern

```tsx
<motion.div
  custom={i}           // pass index for stagger
  variants={fadeUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-50px" }}
>
```

- `once: true` — animates only the first time it enters viewport
- `margin: "-50px"` — triggers when element is 50px into viewport
- Hero elements use `initial`/`animate` (not `whileInView`) since they're above the fold

### Hero-specific animations

Hero elements use individual `motion.*` with `initial`/`animate`:
- H1: `duration: 0.5`, no delay
- Subtitle: `delay: 0.1`
- Search bar: `delay: 0.2`
- Category pills: `delay: 0.3`

All use `initial={{ opacity: 0, y: 16 }}` → `animate={{ opacity: 1, y: 0 }}` (slightly less Y offset than `fadeUp`).

---

## 10. Icons (Lucide React)

All icons come from `lucide-react`. Key imports on the homepage:

| Icon | Usage |
|---|---|
| `MapPin` | Location indicators (events, cards) |
| `ArrowRight` | "View all" button arrows |
| `TrendingUp` | Featured section eyebrow |
| `Clock` | Latest section eyebrow |
| `Sparkles` | Categories section eyebrow |
| `Heart` | Community Pulse eyebrow |
| `CalendarDays` | Events sub-header |
| `BookOpen` | Blog sub-header |
| `ChevronRight` | Event/blog card right edge |
| `Search`, `Store`, `Tag`, `BadgeCheck` | SearchBar dropdown item icons |
| Dynamic (from `cat.icon`) | Bento tile icons — resolved via `LucideIcons[cat.icon] ?? Store` |

---

## 11. SEO (SEOHead component)

```tsx
<SEOHead
  title="Round Rock Local — Round Rock, TX Business Directory"
  description="Discover trusted local businesses in Round Rock, Texas. Browse verified and premium listings across every category — med spas, dentists, restaurants, electricians, roofers, plumbers, mechanics, and more."
  canonical="/"
  ogImage={HERO_IMAGE}
  schemaJson={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Round Rock Local",
    url: "/",
    description: "Local business directory for Round Rock, Texas.",
    areaServed: { "@type": "City", name: "Round Rock, TX" },
  }}
/>
```

- `SEOHead` uses `react-helmet-async` `<Helmet>` to inject `<title>`, meta description, canonical link, Open Graph, Twitter Card, and optional JSON-LD
- Site name constant: `"Round Rock Local"` — appended to title if not already included
- Default OG image: cloud-hosted URL constant in `SEOHead.tsx`

---

## 12. Responsive Breakpoints

Tailwind defaults:

| Prefix | Min width |
|---|---|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

### Key responsive changes

| Element | Mobile | Desktop |
|---|---|---|
| Hero H1 | `text-4xl` | `sm:text-5xl lg:text-6xl` |
| Hero subtitle | `text-base` | `sm:text-lg` |
| Hero min-height | `580px` | `lg:640px` |
| Bento grid | 2 cols | `sm:3`, `lg:4` |
| Listing grids | 1 col | `sm:2`, `lg:3`, `xl:4` |
| Community Pulse | 1 col (stacked) | `lg:2` (side-by-side) |
| Event card thumbnail | hidden (`hidden sm:block`) | visible |
| Section padding | `py-16` | `md:py-20` |

---

## 13. Utilities & CSS Classes

Custom utility classes from `src/index.css` used on the homepage:

| Class | Effect |
|---|---|
| `glass-strong` | White/12% background, `backdrop-filter: blur(20px) saturate(180%)`, white/15% border |
| `glass` | Lighter glassmorphism (blur 16px) |
| `card-lift` | `translateY(-6px)` on hover with smooth transition |
| `glow-sm` | `box-shadow: 0 0 20px -5px var(--glow)` |
| `text-gradient` | Gold gradient clip-text (not used on homepage but available) |
| `font-display` | `font-family: "Outfit"` |
| `font-body` | `font-family: "Figtree"` |

---

## 14. Footer

The footer is rendered by `Layout.tsx` (not by `Home`), but appears on the homepage. Key details:

- **Background:** `bg-[#0f172a] text-white`
- **Top accent line:** `h-[2px] w-full bg-accent`
- **Grid:** `grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]` — brand column wider
- **Brand:** "TX" badge + "Locals of Round Rock" with "Round Rock" in accent gold
- **4 columns:** Brand, Explore, For Business Owners, About
- **Bottom bar:** `border-t border-white/[0.06]`, copyright + "By locals, for Locals."

---

## 15. Header (context)

The header is a fixed, full-width bar that sits above the homepage hero:

- **Position:** `fixed inset-x-0 top-0 z-50`
- **Transparent state:** `bg-transparent border-b border-transparent` (at top of page)
- **Solid state (on scroll > 24px):** `bg-[#0f172a]/95 backdrop-blur-md shadow-lg border-b border-white/10`
- **Height:** `h-[72px]`
- **Content width:** `max-w-[1400px] px-5` — matches hero content alignment
- **Logo:** "TX" gold badge + "Locals of **Round Rock**"
- **Nav links:** `text-sm font-semibold` with gold underline on active
- **Mobile menu:** Full-screen slide-in panel below header, `bg-[#0f172a]`, large left-aligned text, white separators

---

## 16. Key Dimensions Summary

| Element | Value |
|---|---|
| Header height | 72px |
| Hero min-height | 580px (mobile) / 640px (desktop) |
| Hero content max-width | 1400px |
| Hero H1 max-width | `max-w-3xl` (768px) |
| Hero subtitle max-width | `max-w-xl` (36rem) |
| Search bar max-width | `max-w-2xl` (672px) |
| Bento tile height | 180px (feature: 360px + gap) |
| Card image aspect | 4:3 |
| Event date block width | 64px (`w-16`) |
| Event/blog thumbnail width | 112px (`w-28`) |
| Container horizontal padding | `px-4` (sections) / `px-5` (hero & header) |
| Card body padding | `p-4` |
| Bento tile padding | `p-5` |
| Grid gap (cards) | `gap-6` (24px) |
| Grid gap (bento) | `gap-4` (16px) |
