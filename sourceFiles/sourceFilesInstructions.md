# Source Files Export — What Was Built & How It Works

## Overview

This document explains the **Download Source Files** feature added to the Round Rock Local directory site. It lives at the route `/download-source` and is implemented in `src/pages/DownloadSourceFiles.tsx`.

The purpose: bundle every **custom** source file in the project into a single downloadable `.txt` file, so the project can be rebuilt in a fresh AI Studio project by pasting that file back in.

---

## How It Works

### 1. Grabbing all source files at build time

The page uses Vite's `import.meta.glob` to read the raw text of every file under `src/`, plus `index.html` and any files under `scripts/`:

```ts
const allModules = import.meta.glob(
  ["/src/**/*.{ts,tsx,css,js,jsx}", "/index.html", "/scripts/**/*"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;
```

- `query: "?raw"` — tells Vite to return the raw file contents as a string (not a compiled module).
- `import: "default"` — grabs the default export of each file (which for `?raw` is the file text).
- `eager: true` — loads all files immediately at build time, not lazily.

### 2. Excluding boilerplate files

Not every file in the project is custom. shadcn/ui components, hooks, the `cn()` util, and config files are default boilerplate that a fresh project already has. We don't want to copy them — they'd cause conflicts.

```ts
const EXCLUDE_PATTERNS: ((p: string) => boolean)[] = [
  (p) => p.startsWith("/src/components/ui/"),
  (p) => p.startsWith("/src/hooks/"),
  (p) => p.startsWith("/src/test/"),
  (p) => p === "/src/lib/utils.ts",
  (p) => p === "/src/vite-env.d.ts",
  (p) => p === "/src/tailwind.config.vibe.json",
  (p) => p.endsWith(".test.ts"),
  (p) => p.endsWith(".test.tsx"),
];

const isExcluded = (p: string) => EXCLUDE_PATTERNS.some((fn) => fn(p));
```

Any file matching one of these patterns is **listed** in the export (so you know it exists) but its **code is omitted**.

### 3. Building the export text

The export format is plain text with clear delimiters:

```ts
const buildExport = (): string => {
  const lines: string[] = [];
  lines.push("=".repeat(70));
  lines.push("Round Rock Local — Source Files Export");
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push(`Total files: ${files.length} | Included: ${included.length} | Excluded: ${excluded.length}`);
  lines.push("=".repeat(70));
  lines.push("");
  lines.push("INCLUDED FILES (custom / edited — full source below)");
  lines.push("-".repeat(70));
  lines.push("");
  for (const f of included) {
    lines.push("");
    lines.push(`--- ${f.path} ---`);
    lines.push("```");
    lines.push(f.content.replace(/\s+$/, ""));
    lines.push("```");
    lines.push("");
  }
  // ...excluded files listed by path only...
  return lines.join("\n");
};
```

Each included file is wrapped in a `--- /path/to/file.tsx ---` header followed by triple-backtick fences:

```
--- /src/pages/Home.tsx ---
```
(import React from "react";
 ...full file contents...)
```
```

Excluded files are listed by path only at the bottom under an "EXCLUDED FILES" section.

### 4. Downloading

```ts
const handleDownload = async () => {
  const text = buildExport();
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "round-rock-local-source.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
```

This creates a `.txt` blob and triggers a browser download.

---

## The UI

The page shows:

1. **Summary stats** — total files, included count, excluded count, and total export size.
2. **Included Files table** — every custom file with its path and size.
3. **Excluded Files table** — boilerplate files (code omitted), with paths and sizes.
4. **Download button** — triggers the `.txt` export.

---

## Rebuilding from the Export

To rebuild the project in a fresh AI Studio project:

1. Create a new project named **New Biz Directory**.
2. Create a blank file named `ogDirectoryCode.txt` at the root.
3. Paste the exported text into it.
4. Give the AI the rebuild prompt (see `prompt-1-setup.md` and `prompt-2-rebuild.md` in this folder).

The AI reads `ogDirectoryCode.txt`, creates each file at the path specified in the `---` headers, skips the excluded boilerplate, and verifies the build compiles.

---

## File Inventory

### Files that ARE exported (custom):
- `src/pages/*` — all page components (Home, BusinessDetail, DataExplorer, etc.)
- `src/components/*` — custom components (Header, Footer, SearchBar, ListingCard, TableView, etc.) — **except** `ui/*`
- `src/data/*` — data files (listings, categories, events, blog, helpers, types)
- `src/lib/*` — custom helpers (business-hours, table-utils, tracking) — **except** `utils.ts`
- `src/index.css`, `index.html`, `src/App.tsx`
- `scripts/*` — build scripts
- `static-html/*` — prerendered static pages
- `Instructions/*` — instruction files

### Files that are EXCLUDED (boilerplate):
- `src/components/ui/*` — all shadcn/ui components
- `src/hooks/*` — use-toast, use-mobile, use-document-title
- `src/lib/utils.ts` — the `cn()` class merge helper
- `src/vite-env.d.ts`, `src/App.css`, `src/tailwind.config.vibe.json`
- `src/test/*` — test setup and example tests
- `*.test.ts`, `*.test.tsx` — any test files
- Config files (vite.config.ts, tsconfig.json, postcss.config.js, etc.)
- `src/main.tsx`, `public/*`
