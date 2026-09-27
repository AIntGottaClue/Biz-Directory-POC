import { ShieldCheck, Phone, ArrowRight } from "lucide-react";

interface AdSlotProps {
  variant?: "sidebar" | "banner" | "square";
  label?: string;
  className?: string;
  /** Optional props for banner-style ads */
  headline?: string;
  subheadline?: string;
  description?: string;
  ctaPhone?: string;
  ctaText?: string;
  ctaUrl?: string;
  badgeText?: string;
}

/**
 * Ad slot component.
 *
 * - **banner** renders a rich promotional card matching the reference design
 *   (dark bg, headline, phone CTA + secondary CTA, optional trust badge).
 * - **sidebar / square** render minimal placeholders ready for an ad network.
 */
export default function AdSlot({
  variant = "sidebar",
  label,
  className = "",
  // Banner props
  headline,
  subheadline,
  description,
  ctaPhone,
  ctaText = "Request Free Quote",
  ctaUrl = "#",
  badgeText,
}: AdSlotProps) {
  /* ──────────────────────────────── BANNER ──────────────────────────────── */
  if (variant === "banner") {
    return (
      <div
        className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-[#3a2a1e] via-[#4a3a2a] to-[#3a2a1e] text-white shadow-lg ${className}`}
        aria-label="Advertisement"
      >
        {/* Subtle texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
          {/* Left: copy */}
          <div className="min-w-0 flex-1">
            {subheadline && (
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#fbbf24]">
                {subheadline}
              </p>
            )}
            {headline && (
              <h3 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
                {headline}
              </h3>
            )}
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
                {description}
              </p>
            )}

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {ctaPhone && (
                <a
                  href={`tel:${ctaPhone.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e8a87c] px-5 py-2.5 text-sm font-bold text-[#3a2a1e] transition-transform hover:scale-[1.02] hover:brightness-110"
                >
                  <Phone className="h-4 w-4" /> {ctaPhone}
                </a>
              )}
              {ctaText && (
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  {ctaText} <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right: trust badge */}
          {badgeText && (
            <div className="hidden shrink-0 sm:block">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" /> {badgeText}
              </span>
            </div>
          )}
        </div>

        {/* Tiny disclaimer */}
        <div className="border-t border-white/5 px-6 pb-3 pt-2 text-[10px] uppercase tracking-wider text-white/30 sm:px-8">
          Sponsored · Advertisement
        </div>
      </div>
    );
  }

  /* ─────────────────────────── SIDEBAR / SQUARE ─────────────────────────── */
  const sizes: Record<string, string> = {
    sidebar: "min-h-[250px]",
    square: "min-h-[300px]",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 text-center ${sizes[variant]} ${className}`}
      aria-label="Advertisement"
    >
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/60"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <p className="px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
        {label ?? "Your Ad Here"}
      </p>
      <p className="mt-1 px-4 text-[11px] text-muted-foreground/60">
        Advertisement
      </p>
    </div>
  );
}
