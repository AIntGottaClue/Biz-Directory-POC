import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Play } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  businessName: string;
}

type MediaItem =
  | { type: "image"; url: string; alt: string }
  | { type: "youtube"; url: string; embedUrl: string; alt: string }
  | { type: "video"; url: string; thumbnail?: string; alt: string };

function parseYouTube(url: string): string | null {
  const short = url.match(/youtu\.be\/([\w-]{11})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long =
    url.match(/[?&]v=([\w-]{11})/) ||
    url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return null;
}

function parseMedia(raw: string): MediaItem {
  const [url, thumbnail, alt] = raw.split("|").map((s) => s.trim());
  const safeAlt = alt || "";
  const yt = parseYouTube(url);
  if (yt) return { type: "youtube", url, embedUrl: yt, alt: safeAlt };
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url))
    return { type: "video", url, thumbnail, alt: safeAlt };
  return { type: "image", url, alt: safeAlt };
}

export default function ImageGallery({
  images,
  businessName,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);

  if (!images || images.length === 0) return null;

  const items = images.map(parseMedia);
  const goNext = () => setActiveIndex((i) => (i + 1) % items.length);
  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + items.length) % items.length);

  const renderItem = (item: MediaItem, className = "") => {
    if (item.type === "youtube") {
      return (
        <iframe
          src={item.embedUrl}
          title={item.alt || `${businessName} video`}
          className={`h-full w-full ${className}`}
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }
    if (item.type === "video") {
      return (
        <video
          src={item.url}
          poster={item.thumbnail}
          className={`h-full w-full object-cover ${className}`}
          controls
          playsInline
        />
      );
    }
    return (
      <img
        src={item.url}
        alt={item.alt || `${businessName} — photo`}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  };

  // Render item in lightbox — images get object-contain, videos get a fixed aspect
  const renderLightboxItem = (item: MediaItem) => {
    if (item.type === "youtube") {
      return (
        <div className="w-[90vw] max-w-5xl aspect-video">
          <iframe
            src={item.embedUrl}
            title={item.alt || `${businessName} video`}
            className="h-full w-full rounded-lg shadow-2xl"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }
    if (item.type === "video") {
      return (
        <video
          src={item.url}
          poster={item.thumbnail}
          className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl"
          controls
          playsInline
          autoPlay
        />
      );
    }
    return (
      <img
        src={item.url}
        alt={item.alt || `${businessName} — photo ${activeIndex + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
      />
    );
  };

  const active = items[activeIndex];
  const isImage = active.type === "image";

  return (
    <>
      <div className="space-y-3">
        {/* Main media with nav arrows */}
        <div
          className={`group relative aspect-[16/10] overflow-hidden rounded-xl bg-muted ${isImage ? "cursor-pointer" : ""}`}
          onClick={() => isImage && setIsLightbox(true)}
          role={isImage ? "button" : undefined}
          tabIndex={isImage ? 0 : undefined}
          aria-label={
            isImage
              ? `View ${images.length} photos of ${businessName}`
              : undefined
          }
          onKeyDown={(e) => e.key === "Enter" && isImage && setIsLightbox(true)}
        >
          {renderItem(active)}

          {/* Left arrow on main display */}
          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100"
              aria-label="Previous media"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Right arrow on main display */}
          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100"
              aria-label="Next media"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Overlay controls — only for images */}
          {isImage && (
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20 pointer-events-none">
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-3.5 w-3.5" />
                Click to enlarge
                <span className="ml-1 text-white/60">
                  · {activeIndex + 1}/{items.length}
                </span>
              </div>
            </div>
          )}
          {/* Video badge */}
          {!isImage && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Play className="h-3 w-3 fill-white" /> Video
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {items.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-border">
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="flex h-16 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  idx === activeIndex
                    ? "border-accent ring-2 ring-accent/25 shadow-md"
                    : "border-transparent hover:border-border"
                }`}
                aria-label={`Go to item ${idx + 1}`}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.alt || `${businessName} thumbnail`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    {item.type === "youtube" ? (
                      <img
                        src={`https://img.youtube.com/vi/${item.embedUrl.match(/embed\/([\w-]{11})/)?.[1]}/mqdefault.jpg`}
                        alt={item.alt || `${businessName} video thumbnail`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.alt || `${businessName} video thumbnail`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Play className="h-6 w-6 text-muted-foreground" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-5 w-5 text-white fill-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
            <button
              onClick={() =>
                setActiveIndex((i) => Math.min(items.length - 1, i + 1))
              }
              disabled={activeIndex === items.length - 1}
              className="flex h-16 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* LIGHTBOX — all media types */}
      {isLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal
          aria-label="Gallery lightbox"
        >
          <button
            onClick={() => setIsLightbox(false)}
            className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Previous media"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Next media"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          {renderLightboxItem(items[activeIndex])}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-white/70">
            {activeIndex + 1} / {items.length}
          </p>
        </div>
      )}
    </>
  );
}
