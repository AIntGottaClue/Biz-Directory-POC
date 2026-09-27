# Prompt 2 — Rebuild from the Exported Source

Copy and paste this prompt into the same AI Studio chat after pasting your exported code into `ogDirectoryCode.txt`:

---

I have pasted the full exported source code into **`ogDirectoryCode.txt`** at the project root.

In that file, every file is formatted with a header like:

`--- /src/path/to/file.tsx ---`

followed by the code inside triple-backtick fences, followed by the next file. At the bottom there is an "EXCLUDED FILES" section listing default boilerplate files.

**Your job:** Rebuild the project by reading `ogDirectoryCode.txt` and creating each file at the exact project path specified in its `--- /path ---` header (strip any leading slash so it is project-relative, e.g. `src/pages/Home.tsx`).

**CRITICAL — Do NOT recreate or overwrite these files** because they already exist in this project as default boilerplate:

- Everything under `src/components/ui/*` (all shadcn UI components: button, card, dialog, input, badge, table, accordion, alert, alert-dialog, avatar, breadcrumb, calendar, carousel, chart, checkbox, collapsible, command, context-menu, drawer, dropdown-menu, form, hover-card, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip, aspect-ratio)
- `src/hooks/use-toast.ts`, `src/hooks/use-mobile.tsx`, `src/hooks/use-document-title.ts`
- `src/lib/utils.ts` (the `cn()` helper)
- `src/vite-env.d.ts`, `src/App.css`, `src/tailwind.config.vibe.json`
- `src/test/*` (test setup and example tests)
- Any `*.test.ts` or `*.test.tsx` files
- Config files: `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `postcss.config.js`, `tailwind.config.ts`, `eslint.config.js`, `components.json`, `vitest.config.ts`
- Entry points: `src/main.tsx`
- Static assets: `public/placeholder.svg`, `public/robots.txt`, `public/favicon.svg`, `public/sitemap.xml`

**DO recreate** all custom files included in the export. Process the files in this order to avoid import errors:

1. Data files first: `src/data/*` (listings, categories, events, blog, types, helpers)
2. Lib helpers: `src/lib/business-hours.ts`, `src/lib/table-utils.ts`, `src/lib/tracking.ts` (skip `utils.ts`)
3. Custom components: `src/components/*` (Header, Footer, SearchBar, ListingCard, TableView, ImageGallery, LeadGenForm, etc. — skip `ui/*`)
4. Pages: `src/pages/*`
5. Root app & styles: `src/App.tsx`, `src/index.css`, `index.html`
6. Any other files included in the export: `scripts/*`, `static-html/*`, `Instructions/*`

After creating all files, verify the build compiles with no errors. Fix any broken imports, but keep the exact code, layout, and styling from the export. Do not alter the logic or design of the exported code.

**IMPORTANT — Why I'm rebuilding this in a new project:** This project needs to be converted to **TanStack** so we can use **Server-Side Rendering (SSR)** and **create API routes**. The platform recently added SSR and API support, but these features only apply to *new* projects — not existing ones. That's why I'm recreating the site from scratch in a fresh project instead of upgrading the old one. For now, just focus on recreating the exported files exactly as they are.
