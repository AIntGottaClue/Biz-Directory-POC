import { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileCode2,
  FileText,
  Loader2,
  CheckCircle2,
  Package,
} from "lucide-react";

// Grab raw source for everything under src/, plus root index.html and scripts/
const allModules = import.meta.glob(
  ["/src/**/*.{ts,tsx,css,js,jsx}", "/index.html", "/scripts/**/*"],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

// Files that are default boilerplate — listed but code excluded from the export
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

type FileEntry = { path: string; content: string; excluded: boolean };

export default function DownloadSourceFiles() {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const files = useMemo<FileEntry[]>(() => {
    return Object.keys(allModules)
      .sort()
      .map((path) => ({
        path,
        content: allModules[path] ?? "",
        excluded: isExcluded(path),
      }));
  }, []);

  const included = files.filter((f) => !f.excluded);
  const excluded = files.filter((f) => f.excluded);

  const buildExport = (): string => {
    const now = new Date().toLocaleString();
    const lines: string[] = [];
    lines.push("=".repeat(70));
    lines.push("Round Rock Local — Source Files Export");
    lines.push(`Generated: ${now}`);
    lines.push(
      `Total files: ${files.length} | Included: ${included.length} | Excluded: ${excluded.length}`,
    );
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
    lines.push("");
    lines.push("=".repeat(70));
    lines.push("EXCLUDED FILES (default boilerplate — code omitted)");
    lines.push("-".repeat(70));
    for (const f of excluded) {
      lines.push(`  ${f.path}`);
    }
    lines.push("");
    lines.push("=".repeat(70));
    lines.push("End of export");
    lines.push("=".repeat(70));
    return lines.join("\n");
  };

  const handleDownload = async () => {
    setDownloading(true);
    setDone(false);
    try {
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
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } finally {
      setDownloading(false);
    }
  };

  const formatBytes = (n: number) => {
    if (n < 1024) return `${n} B`;
    return `${(n / 1024).toFixed(1)} KB`;
  };

  const totalSize = included.reduce((sum, f) => sum + f.content.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Download Source Files — Round Rock Local"
        description="Export all custom source files into a single downloadable text file."
        canonical="/download-source"
        noIndex
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/15 via-background to-background pt-28 pb-12 sm:pt-32">
        <div className="absolute inset-0 mesh-blob opacity-40" />
        <div className="container mx-auto max-w-4xl px-4 relative">
          <Link
            to="/nexus"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Nexus
          </Link>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg glow-sm">
              <Package className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">
                Download Source Files
              </h1>
              <p className="text-base text-muted-foreground">
                Bundle all custom source into one text file
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-10">
        {/* Summary + download */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <div className="font-display text-2xl font-bold text-foreground">
                {files.length}
              </div>
              <div className="text-muted-foreground">Total files</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-foreground">
                {included.length}
              </div>
              <div className="text-muted-foreground">Included</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-muted-foreground">
                {excluded.length}
              </div>
              <div className="text-muted-foreground">
                Excluded (boilerplate)
              </div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-foreground">
                {formatBytes(totalSize)}
              </div>
              <div className="text-muted-foreground">Export size</div>
            </div>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : done ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Building…" : done ? "Downloaded!" : "Download .txt"}
          </button>
        </div>

        {/* Included files */}
        <div className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <FileCode2 className="h-5 w-5 text-primary" /> Included Files (
            {included.length})
          </h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <tbody>
                {included.map((f, i) => (
                  <tr
                    key={f.path}
                    className={i % 2 ? "bg-muted/30" : "bg-card"}
                  >
                    <td className="px-4 py-2.5 font-mono text-foreground">
                      {f.path}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground whitespace-nowrap">
                      {formatBytes(f.content.length)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Excluded files */}
        {excluded.length > 0 && (
          <div>
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-muted-foreground">
              <FileText className="h-5 w-5" /> Excluded — Boilerplate (
              {excluded.length})
            </h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {excluded.map((f, i) => (
                    <tr
                      key={f.path}
                      className={i % 2 ? "bg-muted/20" : "bg-card"}
                    >
                      <td className="px-4 py-2 font-mono text-muted-foreground">
                        {f.path}
                      </td>
                      <td className="px-4 py-2 text-right text-muted-foreground/60 whitespace-nowrap">
                        {formatBytes(f.content.length)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
