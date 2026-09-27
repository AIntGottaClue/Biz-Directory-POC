import { useState, useRef, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Store, Tag, ArrowRight, BadgeCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSuggestions, getByCategory } from "@/data/helpers";
import { categories } from "@/data/categories";

interface SearchBarProps {
  variant?: "hero" | "compact" | "page";
  className?: string;
}

type FlatItem =
  | { type: "biz"; label: string; slug: string }
  | { type: "category"; label: string; slug: string; count?: number }
  | { type: "keyword"; label: string };

export default function SearchBar({
  variant = "compact",
  className = "",
}: SearchBarProps) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  const {
    businesses: bizMatches,
    categories: catMatches,
    keywords,
  } = q.trim()
    ? getSuggestions(q)
    : { businesses: [], categories: [], keywords: [] };

  // When no query, show all categories with business counts
  const allCategoryItems: FlatItem[] = !q.trim()
    ? categories.map((c) => ({
        type: "category" as const,
        label: c.name,
        slug: c.slug,
        count: getByCategory(c.slug).length,
      }))
    : [];

  const hasSuggestions = q.trim()
    ? bizMatches.length > 0 || catMatches.length > 0 || keywords.length > 0
    : allCategoryItems.length > 0;

  // Flat list for keyboard navigation
  const flatItems: FlatItem[] = q.trim()
    ? [
        ...catMatches.map((c) => ({
          type: "category" as const,
          label: c.name,
          slug: c.slug,
        })),
        ...bizMatches.map((b) => ({
          type: "biz" as const,
          label: b.name,
          slug: b.slug,
        })),
        ...keywords.map((k) => ({ type: "keyword" as const, label: k })),
      ]
    : allCategoryItems;

  const go = (term: string) => {
    navigate(term.trim() ? `/search?q=${encodeURIComponent(term)}` : "/search");
    setOpen(false);
  };

  const pick = (item: FlatItem) => {
    if (item.type === "biz") navigate(`/business/${item.slug}`);
    else if (item.type === "category") navigate(`/category/${item.slug}`);
    else go(item.label);
    setOpen(false);
    setQ("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    go(q);
  };

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !hasSuggestions) {
      if (e.key === "ArrowDown" && hasSuggestions) setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      pick(flatItems[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  if (variant === "hero" || variant === "page") {
    return (
      <div
        ref={wrapRef}
        className={`relative z-[200] w-full ${variant === "hero" ? "max-w-2xl" : "max-w-xl"} ${className}`}
      >
        <form onSubmit={submit}>
          <div
            className={`flex items-center rounded-full p-2 ${variant === "hero" ? "glass-strong shadow-[0_8px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/20" : "ring-1 ring-border shadow-sm bg-card"}`}
          >
            <Search
              className={`ml-4 h-5 w-5 shrink-0 ${variant === "hero" ? "text-white/60" : "text-muted-foreground"}`}
            />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
                setActiveIndex(-1);
              }}
              onKeyDown={onKeyDown}
              onFocus={() => setOpen(true)}
              placeholder="Search by name, service, or category…"
              className={`border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:shadow-none ${variant === "hero" ? "text-white placeholder:text-white/50" : "text-foreground placeholder:text-muted-foreground"}`}
              aria-label="Search businesses"
            />
            <Button
              type="submit"
              className="rounded-full bg-accent text-accent-foreground px-7 py-3 text-base font-semibold shadow-md hover:bg-accent/90"
            >
              Search
            </Button>
          </div>
        </form>

        {open && hasSuggestions && (
          <Dropdown items={flatItems} activeIndex={activeIndex} onPick={pick} />
        )}
      </div>
    );
  }

  // compact variant removed — no longer used in nav bar
}

function Dropdown({
  items,
  activeIndex,
  onPick,
}: {
  items: FlatItem[];
  activeIndex: number;
  onPick: (item: FlatItem) => void;
}) {
  return (
    <div className="absolute left-0 right-0 top-full z-[200] mt-2 overflow-y-auto max-h-[400px] rounded-xl border border-border bg-popover shadow-xl">
      {items.map((item, i) => (
        <button
          key={`${item.type}-${item.label}`}
          type="button"
          onMouseEnter={() => {}}
          onClick={() => onPick(item)}
          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
            i === activeIndex
              ? "bg-accent/10 text-accent"
              : "text-foreground hover:bg-muted"
          }`}
        >
          {item.type === "biz" ? (
            <Store className="h-4 w-4 shrink-0 text-accent" />
          ) : item.type === "category" ? (
            <Tag className="h-4 w-4 shrink-0 text-sage" />
          ) : (
            <BadgeCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="flex-1 truncate">{item.label}</span>
          {item.type === "biz" && (
            <span className="text-xs text-muted-foreground">Listing</span>
          )}
          {item.type === "category" && (
            <span className="text-xs text-muted-foreground">
              {item.count !== undefined
                ? `${item.count} ${item.count === 1 ? "business" : "businesses"}`
                : "Category"}
            </span>
          )}
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
