// ---------- Interfaces ----------

export interface TableData {
  rows: Record<string, unknown>[];
  keys: string[];
  isKeyValue: boolean;
}

export interface CellData {
  column: string;
  content: string;
  contentForCopy: string;
  fullContent: string;
  row: number;
  col: number;
}

// ---------- Utility functions ----------

export function getCellContent(value: unknown): {
  content: string;
  contentForCopy: string;
  fullContent: string;
} {
  if (value === undefined || value === null) {
    return { content: "", contentForCopy: "", fullContent: "" };
  }
  if (typeof value === "object") {
    const compact = JSON.stringify(value);
    const pretty = JSON.stringify(value, null, 2);
    if (Array.isArray(value)) {
      return {
        content: `[array(${value.length})]`,
        contentForCopy: compact,
        fullContent: pretty,
      };
    }
    const keys = Object.keys(value as Record<string, unknown>);
    return {
      content: `[object: ${keys.join(", ")}]`,
      contentForCopy: compact,
      fullContent: pretty,
    };
  }
  const str = String(value);
  return { content: str, contentForCopy: str, fullContent: str };
}

export function formatCellDisplay(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") {
    if (Array.isArray(value)) return `[array(${value.length})]`;
    return `[object]`;
  }
  const str = String(value);
  if (str.length > 100) return str.slice(0, 100) + "…";
  return str;
}

export function isUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /^https?:\/\/[^\s]+$/i.test(value) || /^www\.[^\s]+/i.test(value);
}

export function normalizeUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  if (/^www\./i.test(value)) return "https://" + value;
  return "https://" + value;
}

/**
 * Convert a camelCase key into a Proper Case header with spaces.
 * e.g. "categoryName" → "Category Name", "relatedBlogSlugs" → "Related Blog Slugs"
 */
export function prettyHeader(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function processForCopy(content: string, columnName: string): string {
  let value = content;

  // 1. Convert <br> tags to literal \n
  value = value.replace(/<br\s*\/?>/gi, "\\n");

  // 2. Decode HTML entities via a temporary textarea
  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    value = textarea.value;
  }

  // 3. Convert actual newlines to literal \n so cells stay on one line
  value = value.replace(/\n/g, "\\n");

  // 4. Prepend apostrophe to phone numbers and values starting with =, +, @, or -
  //    so spreadsheets don't auto-format them
  if (columnName && /phone|tel|mobile|cell/i.test(columnName) && value.trim()) {
    value = "'" + value;
  }
  if (value && /^[+=@-]/.test(value.trim())) {
    value = "'" + value;
  }

  // 5. Wrap in double quotes if the value contains a tab, newline, or double-quote,
  //    and escape any internal double quotes by doubling them
  if (value.includes("\t") || value.includes("\n") || value.includes('"')) {
    value = value.split('"').join('""');
    return '"' + value + '"';
  }

  return value;
}

// ---------- Data preparation ----------

export function prepareTableData(result: unknown): TableData | null {
  if (
    Array.isArray(result) &&
    result.length > 0 &&
    typeof result[0] === "object" &&
    result[0] !== null
  ) {
    // Collect the union of ALL keys across every row — not just the first.
    // This ensures columns from blog/event/category rows appear in the
    // "All Data" table even though the first row is a listing.
    const keys = Array.from(
      new Set(
        (result as Record<string, unknown>[]).flatMap((r) => Object.keys(r)),
      ),
    );
    return {
      rows: result as Record<string, unknown>[],
      keys,
      isKeyValue: false,
    };
  }
  if (result !== null && typeof result === "object" && !Array.isArray(result)) {
    const entries = Object.entries(result as Record<string, unknown>);
    const rows = entries.map(([Key, Value]) => ({ Key, Value }));
    return { rows, keys: ["Key", "Value"], isKeyValue: true };
  }
  return null;
}

export function buildAllCells(data: TableData): CellData[] {
  const cells: CellData[] = [];
  data.rows.forEach((row, rowIdx) => {
    data.keys.forEach((key, colIdx) => {
      const { content, contentForCopy, fullContent } = getCellContent(row[key]);
      cells.push({
        column: key,
        content,
        contentForCopy,
        fullContent,
        row: rowIdx,
        col: colIdx,
      });
    });
  });
  return cells;
}
