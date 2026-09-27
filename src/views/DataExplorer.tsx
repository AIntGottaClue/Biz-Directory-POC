import { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { businesses } from "@/data/listings";
import { blogPosts } from "@/data/blog";
import { events } from "@/data/events";
import { categories } from "@/data/categories";
import {
  Download,
  Copy,
  Check,
  Table as TableIcon,
  ArrowLeft,
  Braces,
  FileSpreadsheet,
} from "lucide-react";
import { Link } from "@/lib/router";
import { TableView, JsonView, CsvView } from "@/components/TableView";
import { prettyHeader } from "@/lib/table-utils";

// ---------- CSV helpers ----------

function flattenValue(val: unknown): string {
  if (val === undefined || val === null) return "";
  // Keep arrays and objects as JSON strings so structure is preserved
  if (typeof val === "object") return JSON.stringify(val);
  // Convert actual newlines to literal \n so cells stay on one line
  return String(val).replace(/\n/g, "\\n");
}

function escapeCSV(val: string): string {
  // Wrap in quotes if the value contains comma, double-quote, or newline
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function toCSV(rows: Record<string, unknown>[], columns: string[]): string {
  const header = columns.map((c) => escapeCSV(prettyHeader(c))).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCSV(flattenValue(row[c]))).join(","))
    .join("\n");
  return header + "\n" + body;
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ---------- Column definitions ----------

const listingCols = [
  "asset",
  "id",
  "slug",
  "name",
  "category",
  "categoryName",
  "image",
  "imageOverride",
  "gallery",
  "description",
  "phone",
  "email",
  "hideEmail",
  "website",
  "address",
  "city",
  "state",
  "zip",
  "hours",
  "rating",
  "reviewCount",
  "yearEstablished",
  "services",
  "tags",
  "verified",
  "premium",
  "position",
  "createdAt",
  "relatedBlogSlugs",
  "relatedEventSlugs",
];

const blogCols = [
  "asset",
  "id",
  "slug",
  "title",
  "excerpt",
  "content",
  "author",
  "date",
  "readTime",
  "image",
  "imageAlt",
  "category",
  "website",
  "relatedBusinessSlugs",
  "relatedEventSlugs",
];
const eventCols = [
  "asset",
  "id",
  "slug",
  "title",
  "description",
  "content",
  "date",
  "time",
  "endDate",
  "endTime",
  "location",
  "address",
  "image",
  "gallery",
  "category",
  "website",
  "relatedBusinessSlugs",
  "relatedBlogSlugs",
];

const categoryCols = ["asset", "slug", "name", "icon", "blurb", "image"];

// ---------- Data converters ----------

const ASSET = "Round Rock Local";
const listingRows = (businesses as unknown as Record<string, unknown>[]).map(
  (r) => ({ ...r, asset: ASSET }),
);
const blogRows = (blogPosts as unknown as Record<string, unknown>[]).map(
  (r) => ({ ...r, asset: ASSET }),
);
const eventRows = (events as unknown as Record<string, unknown>[]).map((r) => ({
  ...r,
  asset: ASSET,
}));
const categoryRows = (categories as unknown as Record<string, unknown>[]).map(
  (r) => ({ ...r, asset: ASSET }),
);

const allCols = [
  "asset",
  "type",
  ...new Set([
    ...listingCols.filter((c) => c !== "asset"),
    ...blogCols.filter((c) => c !== "asset"),
    ...eventCols.filter((c) => c !== "asset"),
    ...categoryCols.filter((c) => c !== "asset"),
  ]),
];
const allRows: Record<string, unknown>[] = [
  ...listingRows.map((r) => ({ type: "listing", ...r })),
  ...blogRows.map((r) => ({ type: "blog", ...r })),
  ...eventRows.map((r) => ({ type: "event", ...r })),
  ...categoryRows.map((r) => ({ type: "category", ...r })),
];

type Tab = "listings" | "blogs" | "events" | "categories" | "all";
type ViewTab = "table" | "json" | "csv";

export default function DataExplorer() {
  const [tab, setTab] = useState<Tab>("all");
  const [viewTab, setViewTab] = useState<ViewTab>("table");
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const { rows, cols, filename } = useMemo(() => {
    switch (tab) {
      case "listings":
        return {
          rows: listingRows,
          cols: listingCols,
          filename: "listings-data.csv",
        };
      case "blogs":
        return { rows: blogRows, cols: blogCols, filename: "blogs-data.csv" };
      case "events":
        return {
          rows: eventRows,
          cols: eventCols,
          filename: "events-data.csv",
        };
      case "categories":
        return {
          rows: categoryRows,
          cols: categoryCols,
          filename: "categories-data.csv",
        };
      default:
        return { rows: allRows, cols: allCols, filename: "all-data.csv" };
    }
  }, [tab]);

  const csv = useMemo(() => toCSV(rows, cols), [rows, cols]);
  const currentResult = useMemo(() => rows, [rows]);

  const filteredRows = useMemo(() => {
    if (selected.size === 0) return rows;
    const sorted = Array.from(selected).sort((a, b) => a - b);
    return sorted.map((idx) => rows[idx]).filter(Boolean);
  }, [rows, selected]);

  const filteredCsv = useMemo(
    () => toCSV(filteredRows, cols),
    [filteredRows, cols],
  );
  const filteredResult = useMemo(
    () => (selected.size > 0 ? filteredRows : rows),
    [filteredRows, rows, selected],
  );

  const handleCopy = async () => {
    const text =
      viewTab === "csv"
        ? filteredCsv
        : viewTab === "json"
          ? JSON.stringify(filteredResult, null, 2)
          : filteredCsv;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (viewTab === "csv") {
      downloadCSV(filteredCsv, filename.replace(".csv", ".csv"));
    } else if (viewTab === "json") {
      const json = JSON.stringify(filteredResult, null, 2);
      const blob = new Blob([json], {
        type: "application/json;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename.replace(".csv", ".json");
      link.click();
      URL.revokeObjectURL(link.href);
    } else {
      downloadCSV(filteredCsv, filename);
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All Data", count: allRows.length },
    { key: "listings", label: "Listings", count: listingRows.length },
    { key: "blogs", label: "Blogs", count: blogRows.length },
    { key: "events", label: "Events", count: eventRows.length },
    { key: "categories", label: "Categories", count: categoryRows.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Data Explorer — Round Rock Local"
        description="View and export all listings, blogs, events, and categories data."
        canonical="/data-explorer"
        noIndex
      />

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/15 via-background to-background pt-28 pb-16 sm:pt-32">
        <div className="absolute inset-0 mesh-blob opacity-40" />
        <div className="container mx-auto max-w-4xl px-4 relative">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg glow-sm">
              <TableIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">
                Data Explorer
              </h1>
              <p className="text-base text-muted-foreground">
                Live data from listings.ts, blog.ts, events.ts, categories.ts —
                always accurate
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Link
          to="/nexus"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Nexus
        </Link>

        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSelected(new Set());
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-[#0f172a] text-white shadow-sm"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {t.label} <span className="ml-1 opacity-60">({t.count})</span>
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{rows.length}</strong> rows
            </span>
            <span>
              <strong className="text-foreground">{cols.length}</strong> columns
            </span>
            <span>
              <strong className="text-foreground">
                {(csv.length / 1024).toFixed(1)}
              </strong>{" "}
              KB CSV
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-muted/40 p-1">
              <button
                onClick={() => setViewTab("table")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewTab === "table"
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" />
                Table
              </button>
              <button
                onClick={() => setViewTab("json")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewTab === "json"
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Braces className="h-3.5 w-3.5" />
                JSON
              </button>
              <button
                onClick={() => setViewTab("csv")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewTab === "csv"
                    ? "bg-[#0f172a] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                CSV
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg bg-[#0f172a] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b]"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : `Copy ${viewTab.toUpperCase()}`}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-[#0f172a] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b]"
            >
              <Download className="h-4 w-4" />
              Download {viewTab.toUpperCase()}
            </button>
          </div>
        </div>

        {viewTab === "table" && (
          <TableView
            result={currentResult}
            selected={selected}
            onSelectionChange={setSelected}
          />
        )}
        {viewTab === "json" && (
          <JsonView result={currentResult} selected={selected} />
        )}
        {viewTab === "csv" && (
          <CsvView result={currentResult} csvText={csv} selected={selected} />
        )}
      </div>
    </div>
  );
}
