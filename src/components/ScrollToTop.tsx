import { useState, useEffect, useCallback } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setProgress(pct);
      setVisible(scrollTop > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className="relative w-16 h-16 rounded-full"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}
      >
        <svg
          className="absolute inset-0 -rotate-90"
          width="64"
          height="64"
          viewBox="0 0 64 64"
        >
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="var(--navy-deep)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-150"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <ChevronUp className="w-7 h-7" style={{ color: "#f59e0b" }} />
        </div>
      </div>
    </button>
  );
};

export default ScrollToTop;
