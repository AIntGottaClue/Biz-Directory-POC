import { Link, NavLink, useCity } from "@/lib/router";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { cities, cityPath } from "@/data/cities";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/categories", label: "Categories" },
  { to: "/search", label: "Search" },
  { to: "/blog", label: "Blog" },
  { to: "/events", label: "Events" },
];

export default function Header() {
  const city = useCity();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <div
        className={cn(
          "w-full transition-all duration-300",
          scrolled || open
            ? "bg-[#0f172a]/95 backdrop-blur-md shadow-lg border-b border-white/10"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-5">
          {/* Logo */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 font-display text-lg font-bold sm:text-xl text-white"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md transition-transform group-hover:scale-105 font-black text-xl">
              TX
            </span>
            <span className="text-white font-extrabold tracking-tight">
              Locals of <span className="text-accent">Round Rock</span>
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative text-sm font-semibold tracking-wide transition-colors py-1",
                    isActive
                      ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full"
                      : "text-white/80 hover:text-white",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* City switcher keeps the existing header and changes only location. */}
          <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
            <label htmlFor="city-switch" className="sr-only">Choose city</label>
            <select id="city-switch" value={city.slug} onChange={e => window.location.assign(cityPath(e.target.value as typeof city.slug))}
              className="max-w-[125px] sm:max-w-none rounded-lg border border-white/30 bg-[#0f172a] px-2 py-2 text-white" aria-label="Choose city">
              {cities.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          {/* Right utilities */}
          <div className="flex shrink-0 items-center gap-3 md:pl-6 md:border-l md:border-white/15">
            <ThemeToggle />
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — slide-in panel below header */}
      <div
        className={cn(
          "fixed left-0 right-0 top-[72px] z-40 bg-[#0f172a] transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Nav items — left aligned */}
        <div className="flex flex-col px-5 pt-6 pb-8 min-h-[calc(100vh-72px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center border-b border-white/10 py-4 text-2xl font-bold tracking-tight transition-colors",
                  isActive ? "text-accent" : "text-white/80 hover:text-white",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Theme toggle at bottom */}
          <div className="mt-auto pt-8">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
