import { useState, useEffect, useRef, useMemo } from "react";
import { Copy, Check, Eye, ExternalLink, X } from "lucide-react";
import {
  type TableData,
  type CellData,
  prepareTableData,
  buildAllCells,
  getCellContent,
  formatCellDisplay,
  isUrl,
  normalizeUrl,
  processForCopy,
  prettyHeader,
} from "@/lib/table-utils";

interface TableViewProps {
  result: unknown;
  selected: Set<number>;
  onSelectionChange: (s: Set<number>) => void;
}

export function TableView({
  result,
  selected,
  onSelectionChange,
}: TableViewProps) {
  const data = useMemo(() => prepareTableData(result), [result]);
  const allCells = useMemo(() => (data ? buildAllCells(data) : []), [data]);

  // Row selection
  const lastSelectedRef = useRef<number | null>(null);

  // Focus / keyboard nav
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Popup
  const [popupCell, setPopupCell] = useState<CellData | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  // Drag
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const didDragRef = useRef(false);

  // Copy selected
  const [includeHeaders, setIncludeHeaders] = useState(false);
  const [copiedRow, setCopiedRow] = useState(false);

  // Reset selection on data change
  useEffect(() => {
    onSelectionChange(new Set());
    setFocusedCell(null);
  }, [data]);

  // ---------- Row selection ----------

  const toggleRow = (rowIdx: number, shiftKey: boolean) => {
    onSelectionChange(
      (() => {
        const prev = selected;
        const next = new Set(prev);
        if (
          shiftKey &&
          lastSelectedRef.current !== null &&
          lastSelectedRef.current !== rowIdx
        ) {
          const start = Math.min(lastSelectedRef.current, rowIdx);
          const end = Math.max(lastSelectedRef.current, rowIdx);
          const targetState = !next.has(rowIdx);
          for (let i = start; i <= end; i++) {
            if (targetState) next.add(i);
            else next.delete(i);
          }
        } else {
          if (next.has(rowIdx)) next.delete(rowIdx);
          else next.add(rowIdx);
          lastSelectedRef.current = rowIdx;
        }
        return next;
      })(),
    );
  };

  const toggleAll = () => {
    if (!data) return;
    onSelectionChange(
      (() => {
        if (selected.size === data.rows.length && data.rows.length > 0)
          return new Set();
        return new Set(Array.from({ length: data.rows.length }, (_, i) => i));
      })(),
    );
  };

  // ---------- Copy ----------

  const copyCell = (cell: CellData) => {
    const processed = processForCopy(cell.contentForCopy, cell.column);
    navigator.clipboard.writeText(processed);
  };

  const copySelected = () => {
    if (!data || selected.size === 0) return;
    const lines: string[] = [];
    if (includeHeaders)
      lines.push(data.keys.map((k) => prettyHeader(k)).join("\t"));
    const sorted = Array.from(selected).sort((a, b) => a - b);
    for (const rowIdx of sorted) {
      const row = data.rows[rowIdx];
      const values = data.keys.map((key) => {
        const { contentForCopy } = getCellContent(row[key]);
        return processForCopy(contentForCopy, key);
      });
      lines.push(values.join("\t"));
    }
    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedRow(true);
    setTimeout(() => setCopiedRow(false), 2000);
  };

  // ---------- Popup dragging ----------

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    didDragRef.current = false;
    const container = (e.currentTarget as HTMLElement).closest(
      ".popup-container",
    ) as HTMLElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: rect.left,
      origY: rect.top,
    };
    setPopupPos({ x: rect.left, y: rect.top });
  };

  useEffect(() => {
    if (!popupCell) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      didDragRef.current = true;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPopupPos({
        x: dragRef.current.origX + dx,
        y: dragRef.current.origY + dy,
      });
    };
    const handleMouseUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [popupCell]);

  const handleOverlayClick = () => {
    if (!didDragRef.current) {
      setPopupCell(null);
    }
    didDragRef.current = false;
  };

  // ---------- Table keyboard nav ----------

  const handleTableKeyDown = (e: React.KeyboardEvent) => {
    if (popupCell) return;
    if (
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(
        e.key,
      )
    )
      return;
    e.preventDefault();
    if (!focusedCell) {
      setFocusedCell({ row: 0, col: 0 });
      return;
    }
    if (e.key === "Enter" && data) {
      const cell = allCells.find(
        (c) => c.row === focusedCell.row && c.col === focusedCell.col,
      );
      if (cell) {
        setPopupPos(null);
        setPopupCell(cell);
      }
      return;
    }
    if (!data) return;
    let { row, col } = focusedCell;
    if (e.key === "ArrowUp") row = Math.max(0, row - 1);
    if (e.key === "ArrowDown") row = Math.min(data.rows.length - 1, row + 1);
    if (e.key === "ArrowLeft") col = Math.max(0, col - 1);
    if (e.key === "ArrowRight") col = Math.min(data.keys.length - 1, col + 1);
    setFocusedCell({ row, col });
    requestAnimationFrame(() => {
      const el = tableRef.current?.querySelector(`[data-cell="${row}-${col}"]`);
      el?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  };

  // ---------- Popup keyboard nav ----------

  useEffect(() => {
    if (!popupCell) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPopupCell(null);
        return;
      }
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;
      e.preventDefault();
      const current = allCells.find(
        (c) => c.row === popupCell.row && c.col === popupCell.col,
      );
      if (!current) return;
      let target: CellData | undefined;
      if (e.key === "ArrowUp")
        target = allCells.find(
          (c) => c.col === current.col && c.row === current.row - 1,
        );
      if (e.key === "ArrowDown")
        target = allCells.find(
          (c) => c.col === current.col && c.row === current.row + 1,
        );
      if (e.key === "ArrowLeft")
        target = allCells.find(
          (c) => c.row === current.row && c.col === current.col - 1,
        );
      if (e.key === "ArrowRight")
        target = allCells.find(
          (c) => c.row === current.row && c.col === current.col + 1,
        );
      if (target) {
        setPopupCell(target);
        setFocusedCell({ row: target.row, col: target.col });
        requestAnimationFrame(() => {
          const el = tableRef.current?.querySelector(
            `[data-cell="${target.row}-${target.col}"]`,
          );
          el?.scrollIntoView({ block: "nearest", inline: "nearest" });
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [popupCell, allCells]);

  // ---------- Render ----------

  if (!data) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground/60 font-mono text-sm">
        Result is not suitable for table display
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-xs text-table-fg/70">
          {selected.size === 0
            ? "No rows selected"
            : selected.size === data.rows.length
              ? `All ${data.rows.length} rows selected`
              : `${selected.size} of ${data.rows.length} rows selected`}
        </span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 font-mono text-xs text-table-fg/70">
            <input
              type="checkbox"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              className="h-3.5 w-3.5 accent-primary"
            />
            Headers
          </label>
          <button
            onClick={copySelected}
            disabled={selected.size === 0}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-colors disabled:opacity-40 ${
              copiedRow
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground hover:opacity-90"
            }`}
          >
            {copiedRow ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copiedRow ? "Copied!" : "Copy Selected"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        ref={tableRef}
        tabIndex={0}
        onKeyDown={handleTableKeyDown}
        className="overflow-auto rounded-lg border border-table-border outline-none focus:ring-2 focus:ring-primary/40"
        style={{ maxHeight: "60vh" }}
      >
        <table className="min-w-max font-mono text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-table-header">
              <th className="sticky left-0 z-20 w-10 px-2 py-2 text-center border-b border-table-border">
                <input
                  type="checkbox"
                  checked={
                    selected.size === data.rows.length && data.rows.length > 0
                  }
                  onChange={toggleAll}
                  className="h-3.5 w-3.5 accent-primary"
                />
              </th>
              <th className="sticky left-10 z-20 w-10 px-2 py-2 text-center font-bold text-table-fg/50 border-b border-table-border">
                #
              </th>
              {data.keys.map((key) => (
                <th
                  key={key}
                  className="px-3 py-2 text-left font-bold whitespace-nowrap text-table-fg border-b border-table-border"
                >
                  {prettyHeader(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIdx) => {
              const isSelected = selected.has(rowIdx);
              return (
                <tr
                  key={rowIdx}
                  onClick={(e) => {
                    if (
                      !(e.target instanceof HTMLInputElement) &&
                      !(e.target instanceof HTMLButtonElement)
                    ) {
                      toggleRow(rowIdx, e.shiftKey);
                    }
                  }}
                  className={`group cursor-pointer border-b border-table-border hover:bg-slate-300/50 dark:hover:bg-white/5 ${
                    isSelected
                      ? "bg-amber-200/50 dark:bg-amber-400/15"
                      : rowIdx % 2 === 0
                        ? "bg-table-bg"
                        : "bg-table-stripe/60"
                  }`}
                >
                  <td className="sticky left-0 z-10 px-2 py-1.5 text-center bg-inherit border-b border-table-border">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(rowIdx, e.shiftKey);
                      }}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                  </td>
                  <td className="sticky left-10 z-10 px-2 py-1.5 text-center text-table-fg/50 bg-inherit border-b border-table-border">
                    {rowIdx + 1}
                  </td>
                  {data.keys.map((key, colIdx) => {
                    const value = row[key];
                    const display = formatCellDisplay(value);
                    const isFocused =
                      focusedCell?.row === rowIdx &&
                      focusedCell?.col === colIdx;
                    const url = isUrl(value);
                    const cell = allCells.find(
                      (c) => c.row === rowIdx && c.col === colIdx,
                    );
                    return (
                      <td
                        key={key}
                        data-cell={`${rowIdx}-${colIdx}`}
                        onClick={() =>
                          setFocusedCell({ row: rowIdx, col: colIdx })
                        }
                        className={`group/cell relative px-3 py-1.5 border-b border-table-border ${
                          isFocused
                            ? "ring-2 ring-primary ring-inset bg-primary/10"
                            : ""
                        }`}
                        style={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {url ? (
                          <a
                            href={normalizeUrl(String(value))}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-500 underline hover:opacity-80"
                          >
                            {display}
                          </a>
                        ) : (
                          <span className="text-table-fg/90">{display}</span>
                        )}
                        {/* Hover actions */}
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (cell) copyCell(cell);
                            }}
                            className="flex h-5 w-5 items-center justify-center rounded bg-[#0f172a] text-white hover:scale-110"
                            title="Copy cell"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocusedCell({ row: rowIdx, col: colIdx });
                              setPopupPos(null);
                              if (cell) setPopupCell(cell);
                            }}
                            className="flex h-5 w-5 items-center justify-center rounded bg-accent text-accent-foreground hover:scale-110"
                            title="View full value"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {popupCell && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={handleOverlayClick}
        >
          <div
            className="popup-container flex max-h-[80vh] w-[90vw] max-w-[600px] flex-col rounded-xl border border-border bg-card shadow-2xl"
            style={
              popupPos
                ? {
                    position: "fixed",
                    left: popupPos.x,
                    top: popupPos.y,
                    transform: "none",
                    margin: 0,
                  }
                : { margin: "auto" }
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / drag handle */}
            <div
              onMouseDown={handleDragStart}
              className="flex items-center justify-between rounded-t-xl border-b border-border px-4 py-3 cursor-move select-none"
            >
              <div>
                <div className="font-mono text-sm font-bold text-foreground">
                  {prettyHeader(popupCell.column)}
                </div>
                <div className="font-mono text-xs text-muted-foreground">
                  Drag to move · Arrow keys to navigate · Esc to close
                </div>
              </div>
              <button
                onClick={() => setPopupCell(null)}
                className="flex h-7 w-7 items-center justify-center rounded bg-destructive/15 text-destructive hover:scale-110 hover:bg-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="whitespace-pre-wrap break-words font-mono text-sm text-foreground">
                {popupCell.fullContent}
              </pre>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
              {isUrl(popupCell.content) && (
                <a
                  href={normalizeUrl(popupCell.content)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-mono text-xs font-medium text-foreground hover:bg-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open
                </a>
              )}
              <button
                onClick={() => copyCell(popupCell)}
                className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 font-mono text-xs font-medium text-accent-foreground hover:opacity-90"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Value
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- JSON View ----------

export function JsonView({
  result,
  selected,
}: {
  result: unknown;
  selected?: Set<number>;
}) {
  const [copied, setCopied] = useState(false);
  const json = useMemo(() => {
    try {
      if (Array.isArray(result) && selected && selected.size > 0) {
        const filtered = result.filter((_, idx) => selected.has(idx));
        return JSON.stringify(filtered, null, 2);
      }
      return JSON.stringify(result, null, 2);
    } catch {
      return String(result);
    }
  }, [result, selected]);

  return (
    <div className="relative rounded-lg border border-table-border bg-table-bg">
      <button
        onClick={() => {
          navigator.clipboard.writeText(json);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-table-border bg-card px-2.5 py-1.5 font-mono text-xs text-table-fg hover:bg-muted"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="max-h-[60vh] overflow-auto p-4 font-mono text-xs text-table-fg">
        {json}
      </pre>
    </div>
  );
}

// ---------- CSV View ----------

export function CsvView({
  result,
  csvText,
  selected,
}: {
  result: unknown;
  csvText: string;
  selected?: Set<number>;
}) {
  const [copied, setCopied] = useState(false);

  const displayCsv = useMemo(() => {
    if (Array.isArray(result) && selected && selected.size > 0) {
      // Rebuild CSV from selected rows only (safe with embedded newlines)
      const rows = result as Record<string, unknown>[];
      const sample = rows[0] ?? {};
      const keys = Object.keys(sample);
      const sorted = Array.from(selected).sort((a, b) => a - b);
      const filtered = sorted.map((idx) => rows[idx]).filter(Boolean);
      // Reuse the same toCSV logic from DataExplorer
      return buildCsv(filtered, keys);
    }
    return csvText;
  }, [result, csvText, selected]);

  return (
    <div className="relative rounded-lg border border-table-border bg-table-bg">
      <button
        onClick={() => {
          navigator.clipboard.writeText(displayCsv);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md border border-table-border bg-card px-2.5 py-1.5 font-mono text-xs text-table-fg hover:bg-muted"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="max-h-[60vh] overflow-auto p-4 font-mono text-xs text-table-fg">
        {displayCsv}
      </pre>
    </div>
  );
}

// Local CSV builder — mirrors DataExplorer's toCSV so embedded newlines are quoted properly
function buildCsv(rows: Record<string, unknown>[], keys: string[]): string {
  const flatten = (val: unknown): string => {
    if (val === undefined || val === null) return "";
    if (typeof val === "object") return JSON.stringify(val);
    return String(val).replace(/\n/g, "\\n");
  };
  const escape = (val: string): string => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };
  const header = keys.map((k) => escape(prettyHeader(k))).join(",");
  const body = rows
    .map((row) => keys.map((c) => escape(flatten(row[c]))).join(","))
    .join("\n");
  return header + "\n" + body;
}
